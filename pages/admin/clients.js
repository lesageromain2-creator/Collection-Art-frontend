// frontend/pages/admin/clients.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { 
  Users, Search, Mail, Phone, Calendar, MessageSquare, 
  Send, X, User as UserIcon 
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { 
  checkAuth,
  getAdminUsers,
  getAdminUserMessages,
  sendMessageToUser
} from '../../utils/api';

export default function AdminClientsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filtrer les clients selon la recherche
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(client =>
        client.firstname?.toLowerCase().includes(query) ||
        client.lastname?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.company_name?.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  useEffect(() => {
    if (selectedClient) {
      loadMessages(selectedClient.id);
      // Polling toutes les 10 secondes
      const interval = setInterval(() => loadMessages(selectedClient.id), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/clients');
        return;
      }
      setUser(authData.user);

      const clientsData = await getAdminUsers();
      setClients(clientsData.users || clientsData || []);
      setFilteredClients(clientsData.users || clientsData || []);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      const messagesData = await getAdminUserMessages(userId);
      setMessages(messagesData.messages || messagesData || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]); // Définir un tableau vide en cas d'erreur
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setMessages([]);
    loadMessages(client.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient || sending) return;

    try {
      setSending(true);
      await sendMessageToUser(selectedClient.id, newMessage);
      setNewMessage('');
      await loadMessages(selectedClient.id);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffMs < 86400000) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #0A0E27;
            color: white;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #0066FF;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestion des Clients - Admin</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="clients" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <h1>Gestion des Clients</h1>
              <p>{filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}</p>
            </div>

            <div className="clients-container">
              {/* Liste des clients */}
              <div className="clients-list-panel">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="clients-list">
                  {filteredClients.length === 0 ? (
                    <div className="empty-state">
                      <Users size={60} />
                      <p>Aucun client trouvé</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className={`client-item ${selectedClient?.id === client.id ? 'active' : ''}`}
                        onClick={() => handleSelectClient(client)}
                      >
                        <div className="client-avatar">
                          {client.avatar_url ? (
                            <img src={client.avatar_url} alt={client.firstname} />
                          ) : (
                            <span>{getInitials(client.firstname, client.lastname)}</span>
                          )}
                        </div>
                        <div className="client-info">
                          <h4>{client.firstname} {client.lastname}</h4>
                          <p>{client.email}</p>
                          {client.company_name && (
                            <span className="company">{client.company_name}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Zone de chat */}
              <div className="chat-panel">
                {selectedClient ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-header">
                      <div className="client-details">
                        <div className="client-avatar-large">
                          {selectedClient.avatar_url ? (
                            <img src={selectedClient.avatar_url} alt={selectedClient.firstname} />
                          ) : (
                            <span>{getInitials(selectedClient.firstname, selectedClient.lastname)}</span>
                          )}
                        </div>
                        <div>
                          <h3>{selectedClient.firstname} {selectedClient.lastname}</h3>
                          <div className="client-meta">
                            <span><Mail size={14} /> {selectedClient.email}</span>
                            {selectedClient.phone && (
                              <span><Phone size={14} /> {selectedClient.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="close-chat" onClick={() => setSelectedClient(null)}>
                        <X size={24} />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="messages-area">
                      {messages.length === 0 ? (
                        <div className="empty-chat">
                          <MessageSquare size={60} />
                          <p>Aucun message avec ce client</p>
                          <span>Envoyez le premier message ci-dessous</span>
                        </div>
                      ) : (
                        <>
                          {messages.map((msg) => (
                            <div 
                              key={msg.id} 
                              className={`message-bubble ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                            >
                              <div className="message-content">
                                <p>{msg.message || msg.content}</p>
                                <span className="message-time">
                                  {formatMessageDate(msg.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="message-input">
                      <input
                        type="text"
                        placeholder="Écrivez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                      />
                      <button type="submit" disabled={!newMessage.trim() || sending}>
                        {sending ? (
                          <div className="spinner-small"></div>
                        ) : (
                          <Send size={20} />
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="no-selection">
                    <Users size={80} />
                    <h3>Sélectionnez un client</h3>
                    <p>Choisissez un client dans la liste pour commencer une conversation</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: #0A0E27;
          display: flex;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          margin-top: 80px;
          padding: 40px;
          flex: 1;
        }

        .content-header {
          margin-bottom: 32px;
        }

        .content-header h1 {
          color: white;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .content-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .clients-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 24px;
          height: calc(100vh - 260px);
        }

        .clients-list-panel,
        .chat-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .search-box {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .clients-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .clients-list::-webkit-scrollbar {
          width: 6px;
        }

        .clients-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .clients-list::-webkit-scrollbar-thumb {
          background: rgba(0, 102, 255, 0.5);
          border-radius: 3px;
        }

        .client-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .client-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .client-item.active {
          background: rgba(0, 102, 255, 0.2);
          border: 1px solid rgba(0, 102, 255, 0.5);
        }

        .client-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .client-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .client-info {
          flex: 1;
          min-width: 0;
        }

        .client-info h4 {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .client-info p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .client-info .company {
          display: block;
          color: #00D9FF;
          font-size: 12px;
          margin-top: 4px;
        }

        .chat-header {
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .client-details {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .client-avatar-large {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
        }

        .client-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .client-details h3 {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .client-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .client-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .close-chat {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .close-chat:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .messages-area {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .messages-area::-webkit-scrollbar {
          width: 8px;
        }

        .messages-area::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(0, 102, 255, 0.5);
          border-radius: 4px;
        }

        .message-bubble {
          max-width: 70%;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-bubble.sent {
          align-self: flex-end;
        }

        .message-bubble.received {
          align-self: flex-start;
        }

        .message-content {
          padding: 12px 16px;
          border-radius: 14px;
        }

        .message-bubble.sent .message-content {
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.received .message-content {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-bottom-left-radius: 4px;
        }

        .message-content p {
          margin: 0;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message-time {
          display: block;
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.7;
        }

        .message-input {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-input input {
          flex: 1;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
        }

        .message-input input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .message-input button {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border: none;
          border-radius: 12px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .message-input button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .message-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-selection,
        .empty-chat {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }

        .no-selection svg,
        .empty-chat svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 20px;
        }

        .no-selection h3,
        .empty-chat h3 {
          color: white;
          font-size: 1.6em;
          margin-bottom: 12px;
        }

        .no-selection p,
        .empty-chat p {
          font-size: 1.05em;
          max-width: 300px;
        }

        .empty-chat span {
          font-size: 0.9em;
          margin-top: 8px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-state svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .clients-container {
            grid-template-columns: 1fr;
          }

          .clients-list-panel {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}
