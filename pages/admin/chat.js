// frontend/pages/admin/chat.js - Page admin de gestion des conversations
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { 
  MessageSquare, 
  Search, 
  Send, 
  ArrowLeft,
  Loader2,
  CheckCheck,
  Clock,
  User as UserIcon,
  XCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  checkAuth, 
  getAdminChatConversations,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  closeChatConversation,
  getChatStats
} from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminChat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    loadData();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      pollingRef.current = setInterval(() => {
        loadMessages(selectedConversation.id, true);
      }, 5000);
      
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/chat');
        return;
      }
      setUser(authData.user);

      await Promise.all([
        loadConversations(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await getAdminChatConversations(filters);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getChatStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const data = await getChatMessages(conversationId);
      setMessages(data.messages || []);
      
      await markChatAsRead(conversationId);
      
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_admin: 0 } : c
      ));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const selectConversation = async (conv) => {
    setSelectedConversation(conv);
    await loadMessages(conv.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      const result = await sendChatMessage(selectedConversation.id, newMessage);
      
      setMessages(prev => [...prev, result.message]);
      setNewMessage('');
      
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, last_message: newMessage, last_message_at: new Date().toISOString() }
          : c
      ).sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)));
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;
    
    if (!confirm('Voulez-vous fermer cette conversation ?')) return;
    
    try {
      await closeChatConversation(selectedConversation.id);
      
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id ? { ...c, status: 'closed' } : c
      ));
      
      setSelectedConversation(prev => ({ ...prev, status: 'closed' }));
      
      toast.success('Conversation fermée');
    } catch (error) {
      console.error('Erreur fermeture:', error);
      toast.error('Erreur lors de la fermeture');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="chat" />
        <div className="admin-main">
          <div className="loading-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Chargement...</p>
          </div>
        </div>
        <style jsx>{`
          .admin-layout { display: flex; min-height: 100vh; background: #0a0a0f; }
          .admin-main { flex: 1; margin-left: 260px; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: #9ca3af; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chat - Admin Collection Aur'art</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="chat" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            {/* Stats */}
            {stats && (
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-value">{stats.active_conversations || 0}</span>
                  <span className="stat-label">Actives</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.total_unread || 0}</span>
                  <span className="stat-label">Non lus</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.messages_today || 0}</span>
                  <span className="stat-label">Aujourd'hui</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.new_this_week || 0}</span>
                  <span className="stat-label">Cette semaine</span>
                </div>
              </div>
            )}

            <div className="chat-container">
              {/* Liste des conversations */}
              <aside className={`conversations-sidebar ${selectedConversation ? 'hide-mobile' : ''}`}>
                <div className="sidebar-header">
                  <h2>Conversations</h2>
                  <button className="btn-refresh" onClick={loadConversations}>
                    <RefreshCw size={18} />
                  </button>
                </div>

                {/* Filtres */}
                <div className="filters">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  <select
                    value={filters.status}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, status: e.target.value }));
                      loadConversations();
                    }}
                  >
                    <option value="all">Tous</option>
                    <option value="active">Actives</option>
                    <option value="closed">Fermées</option>
                  </select>
                </div>

                <div className="conversations-list">
                  {conversations.length === 0 ? (
                    <div className="empty">
                      <MessageSquare size={32} />
                      <p>Aucune conversation</p>
                    </div>
                  ) : (
                    conversations.filter(c => {
                      if (!filters.search) return true;
                      const search = filters.search.toLowerCase();
                      return (
                        c.user_firstname?.toLowerCase().includes(search) ||
                        c.user_lastname?.toLowerCase().includes(search) ||
                        c.user_email?.toLowerCase().includes(search) ||
                        c.subject?.toLowerCase().includes(search)
                      );
                    }).map(conv => (
                      <div 
                        key={conv.id}
                        className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.status === 'closed' ? 'closed' : ''}`}
                        onClick={() => selectConversation(conv)}
                      >
                        <div className="conversation-avatar">
                          {conv.user_firstname?.[0]}{conv.user_lastname?.[0]}
                        </div>
                        <div className="conversation-info">
                          <div className="conversation-header">
                            <span className="conversation-name">
                              {conv.user_firstname} {conv.user_lastname}
                            </span>
                            <span className="conversation-time">
                              {formatDate(conv.last_message_at)}
                            </span>
                          </div>
                          <p className="conversation-email">{conv.user_email}</p>
                          <p className="conversation-subject">{conv.subject}</p>
                          <p className="conversation-preview">{conv.last_message}</p>
                        </div>
                        {conv.unread_admin > 0 && (
                          <span className="unread-badge">{conv.unread_admin}</span>
                        )}
                        {conv.status === 'closed' && (
                          <span className="status-badge closed">Fermée</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </aside>

              {/* Zone de chat */}
              <section className={`chat-area ${!selectedConversation ? 'hide-mobile' : ''}`}>
                {selectedConversation ? (
                  <>
                    <div className="chat-header">
                      <button 
                        className="btn-back-mobile"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="chat-header-info">
                        <h3>{selectedConversation.user_firstname} {selectedConversation.user_lastname}</h3>
                        <span className="chat-email">{selectedConversation.user_email}</span>
                        <span className="chat-subject">{selectedConversation.subject}</span>
                      </div>
                      <div className="chat-actions">
                        {selectedConversation.status === 'active' && (
                          <button 
                            className="btn-close-conv"
                            onClick={handleCloseConversation}
                            title="Fermer la conversation"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="messages-container">
                      {loadingMessages ? (
                        <div className="messages-loading">
                          <Loader2 className="animate-spin" size={24} />
                        </div>
                      ) : (
                        <>
                          {messages.map((msg, index) => {
                            const isAdmin = msg.sender_role === 'admin' || msg.sender_role === 'staff';
                            const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
                            
                            return (
                              <div 
                                key={msg.id} 
                                className={`message ${isAdmin ? 'own' : 'other'}`}
                              >
                                {!isAdmin && showAvatar && (
                                  <div className="message-avatar">
                                    {msg.sender_firstname?.[0]}{msg.sender_lastname?.[0]}
                                  </div>
                                )}
                                <div className="message-content">
                                  {showAvatar && (
                                    <span className="message-sender">
                                      {msg.sender_firstname} {msg.sender_lastname}
                                      {isAdmin && <span className="admin-badge">Admin</span>}
                                    </span>
                                  )}
                                  <div className="message-bubble">
                                    <p>{msg.message}</p>
                                  </div>
                                  <div className="message-meta">
                                    <span className="message-time">
                                      {formatDate(msg.created_at)}
                                    </span>
                                    {isAdmin && (
                                      <span className="message-status">
                                        {msg.is_read ? (
                                          <CheckCheck size={14} className="read" />
                                        ) : (
                                          <Clock size={14} />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {selectedConversation.status === 'active' ? (
                      <form className="message-input" onSubmit={handleSendMessage}>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Répondre au client..."
                          disabled={sending}
                        />
                        <button type="submit" disabled={!newMessage.trim() || sending}>
                          {sending ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <Send size={20} />
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="conversation-closed">
                        <XCircle size={20} />
                        <span>Cette conversation est fermée</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-conversation">
                    <MessageSquare size={64} />
                    <h3>Sélectionnez une conversation</h3>
                    <p>Choisissez une conversation pour répondre à vos clients</p>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0f;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
        }

        .admin-content {
          padding: 1.5rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #111827;
          border-radius: 12px;
          padding: 1.25rem;
          border: 1px solid #1f2937;
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: #6b7280;
        }

        .chat-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
          height: calc(100vh - 280px);
          min-height: 500px;
        }

        .conversations-sidebar {
          background: #111827;
          border-radius: 16px;
          border: 1px solid #1f2937;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #1f2937;
        }

        .sidebar-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
        }

        .btn-refresh {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-refresh:hover {
          color: #fff;
          background: #1f2937;
        }

        .filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #1f2937;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1f2937;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          color: #6b7280;
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 0.875rem;
        }

        .search-box input:focus {
          outline: none;
        }

        .filters select {
          background: #1f2937;
          border: none;
          color: #fff;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #6b7280;
        }

        .conversation-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.25rem;
          cursor: pointer;
          border-bottom: 1px solid #1f2937;
          transition: background 0.2s;
          position: relative;
        }

        .conversation-item:hover {
          background: #1f2937;
        }

        .conversation-item.active {
          background: #1f2937;
          border-left: 3px solid #6366f1;
        }

        .conversation-item.closed {
          opacity: 0.6;
        }

        .conversation-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.125rem;
        }

        .conversation-name {
          font-weight: 600;
          color: #fff;
          font-size: 0.9375rem;
        }

        .conversation-time {
          font-size: 0.6875rem;
          color: #6b7280;
        }

        .conversation-email {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .conversation-subject {
          font-size: 0.8125rem;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }

        .conversation-preview {
          font-size: 0.8125rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          position: absolute;
          right: 1rem;
          top: 1rem;
          background: #ef4444;
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.125rem 0.5rem;
          border-radius: 10px;
        }

        .status-badge {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          font-size: 0.6875rem;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
        }

        .status-badge.closed {
          background: #374151;
          color: #9ca3af;
        }

        .chat-area {
          background: #111827;
          border-radius: 16px;
          border: 1px solid #1f2937;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #1f2937;
        }

        .btn-back-mobile {
          display: none;
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }

        .chat-header-info {
          flex: 1;
        }

        .chat-header-info h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .chat-email {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .chat-subject {
          display: block;
          font-size: 0.8125rem;
          color: #9ca3af;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-close-conv {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-close-conv:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .messages-loading {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          max-width: 70%;
        }

        .message.own {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.6875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
        }

        .message.own .message-content {
          align-items: flex-end;
        }

        .message-sender {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-badge {
          background: #6366f1;
          color: #fff;
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }

        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: #1f2937;
        }

        .message.own .message-bubble {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }

        .message-bubble p {
          color: #fff;
          line-height: 1.5;
          font-size: 0.9375rem;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .message-time {
          font-size: 0.6875rem;
          color: #6b7280;
        }

        .message-status .read {
          color: #6366f1;
        }

        .message-input {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid #1f2937;
        }

        .message-input input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 24px;
          color: #fff;
          font-size: 0.9375rem;
        }

        .message-input input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .message-input button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .conversation-closed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #1f2937;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          text-align: center;
        }

        .no-conversation h3 {
          color: #fff;
          margin: 1rem 0 0.5rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .chat-container {
            grid-template-columns: 1fr;
          }

          .conversations-sidebar.hide-mobile,
          .chat-area.hide-mobile {
            display: none;
          }

          .btn-back-mobile {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
