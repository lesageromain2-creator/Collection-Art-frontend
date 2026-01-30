// frontend/pages/chat.js - Page de chat client
import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Send, 
  MessageSquare, 
  Plus, 
  ArrowLeft,
  Loader2,
  CheckCheck,
  Clock,
  User as UserIcon,
  Paperclip
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  checkAuth, 
  getChatConversations,
  getChatMessages,
  sendChatMessage,
  createChatConversation,
  markChatAsRead,
  fetchSettings 
} from '../utils/api';
import { toast } from 'react-toastify';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
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
    scrollToBottom();
  }, [messages]);

  // Polling pour les messages
  useEffect(() => {
    if (selectedConversation) {
      // Polling toutes les 5 secondes
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

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated) {
        router.push('/login?redirect=/chat');
        return;
      }
      setUser(authData.user);

      const [conversationsData, settingsData] = await Promise.all([
        getChatConversations(),
        fetchSettings()
      ]);

      setConversations(conversationsData.conversations || []);
      setSettings(settingsData);

      // Si une conversation est passée en query
      if (router.query.id) {
        const conv = conversationsData.conversations?.find(c => c.id === router.query.id);
        if (conv) {
          selectConversation(conv);
        }
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const data = await getChatMessages(conversationId);
      setMessages(data.messages || []);
      
      // Marquer comme lu
      await markChatAsRead(conversationId);
      
      // Mettre à jour le compteur de la conversation
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      if (!silent) toast.error('Erreur lors du chargement des messages');
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
      
      // Ajouter le message localement pour une réponse instantanée
      setMessages(prev => [...prev, result.message]);
      setNewMessage('');
      
      // Mettre à jour la conversation
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, last_message: newMessage, last_message_at: new Date().toISOString() }
          : c
      ).sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)));
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateConversation = async (e) => {
    e.preventDefault();
    if (!newConversationSubject.trim()) {
      toast.error('Veuillez entrer un sujet');
      return;
    }

    try {
      setSending(true);
      const result = await createChatConversation({
        subject: newConversationSubject,
        initial_message: `Bonjour, j'ai une question concernant: ${newConversationSubject}`
      });
      
      // Ajouter à la liste et sélectionner
      const newConv = result.conversation;
      setConversations(prev => [newConv, ...prev]);
      setSelectedConversation(newConv);
      setShowNewConversation(false);
      setNewConversationSubject('');
      
      // Charger les messages
      await loadMessages(newConv.id);
      
      toast.success('Conversation créée !');
    } catch (error) {
      console.error('Erreur création conversation:', error);
      toast.error('Erreur lors de la création');
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
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatConversationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  if (loading) {
    return (
      <>
        <Header user={user} settings={settings} />
        <div className="loading-container">
          <Loader2 className="animate-spin" size={48} />
          <p>Chargement...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #9ca3af;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Messages - {settings.site_name || 'LE SAGE DEV'}</title>
      </Head>

      <Header user={user} settings={settings} />

      <main className="chat-page">
        <div className="chat-container">
          {/* Liste des conversations */}
          <aside className={`conversations-sidebar ${selectedConversation ? 'hide-mobile' : ''}`}>
            <div className="sidebar-header">
              <h2>Messages</h2>
              <button 
                className="btn-new"
                onClick={() => setShowNewConversation(true)}
              >
                <Plus size={20} />
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="empty-conversations">
                <MessageSquare size={48} />
                <p>Aucune conversation</p>
                <button 
                  className="btn-start"
                  onClick={() => setShowNewConversation(true)}
                >
                  Démarrer une conversation
                </button>
              </div>
            ) : (
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div 
                    key={conv.id}
                    className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => selectConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.admin_firstname ? (
                        <span>{conv.admin_firstname[0]}{conv.admin_lastname?.[0]}</span>
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-name">
                          {conv.admin_firstname ? `${conv.admin_firstname} ${conv.admin_lastname}` : 'Support'}
                        </span>
                        <span className="conversation-time">
                          {formatConversationDate(conv.last_message_at)}
                        </span>
                      </div>
                      <p className="conversation-subject">{conv.subject}</p>
                      <p className="conversation-preview">{conv.last_message}</p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                    <h3>
                      {selectedConversation.admin_firstname 
                        ? `${selectedConversation.admin_firstname} ${selectedConversation.admin_lastname}`
                        : 'Support LE SAGE DEV'}
                    </h3>
                    <span className="chat-subject">{selectedConversation.subject}</span>
                  </div>
                </div>

                <div className="messages-container">
                  {loadingMessages ? (
                    <div className="messages-loading">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="empty-messages">
                      <MessageSquare size={48} />
                      <p>Aucun message dans cette conversation</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const isOwn = msg.sender_id === user?.id;
                        const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
                        
                        return (
                          <div 
                            key={msg.id} 
                            className={`message ${isOwn ? 'own' : 'other'}`}
                          >
                            {!isOwn && showAvatar && (
                              <div className="message-avatar">
                                {msg.sender_firstname?.[0]}{msg.sender_lastname?.[0]}
                              </div>
                            )}
                            <div className="message-content">
                              {!isOwn && showAvatar && (
                                <span className="message-sender">
                                  {msg.sender_firstname} {msg.sender_lastname}
                                </span>
                              )}
                              <div className="message-bubble">
                                <p>{msg.message}</p>
                              </div>
                              <div className="message-meta">
                                <span className="message-time">
                                  {formatMessageDate(msg.created_at)}
                                </span>
                                {isOwn && (
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

                <form className="message-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
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
              </>
            ) : (
              <div className="no-conversation">
                <MessageSquare size={64} />
                <h3>Sélectionnez une conversation</h3>
                <p>Ou démarrez une nouvelle conversation avec notre équipe</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowNewConversation(true)}
                >
                  <Plus size={20} />
                  Nouvelle conversation
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Modal nouvelle conversation */}
        {showNewConversation && (
          <div className="modal-overlay" onClick={() => setShowNewConversation(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Nouvelle conversation</h3>
              <form onSubmit={handleCreateConversation}>
                <div className="form-group">
                  <label>Sujet de votre demande</label>
                  <input
                    type="text"
                    value={newConversationSubject}
                    onChange={(e) => setNewConversationSubject(e.target.value)}
                    placeholder="Ex: Question sur mon projet, Demande de devis..."
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowNewConversation(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={!newConversationSubject.trim() || sending}
                  >
                    {sending ? 'Création...' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer settings={settings} />

      <style jsx>{`
        .chat-page {
          min-height: calc(100vh - 200px);
          background: #0a0a0f;
          padding: 2rem;
        }

        .chat-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 1.5rem;
          height: calc(100vh - 250px);
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
          padding: 1.25rem;
          border-bottom: 1px solid #1f2937;
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
        }

        .btn-new {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .btn-new:hover {
          transform: scale(1.1);
        }

        .empty-conversations {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6b7280;
          text-align: center;
        }

        .empty-conversations p {
          margin: 1rem 0;
        }

        .btn-start {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          display: flex;
          align-items: center;
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

        .conversation-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
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
          margin-bottom: 0.25rem;
        }

        .conversation-name {
          font-weight: 600;
          color: #fff;
        }

        .conversation-time {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .conversation-subject {
          font-size: 0.875rem;
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
          top: 50%;
          transform: translateY(-50%);
          background: #6366f1;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
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

        .chat-header-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
        }

        .chat-subject {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .messages-loading,
        .empty-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.75rem;
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
        }

        .message-bubble {
          padding: 0.75rem 1rem;
          border-radius: 16px;
          background: #1f2937;
        }

        .message.own .message-bubble {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }

        .message-bubble p {
          color: #fff;
          line-height: 1.5;
          word-break: break-word;
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

        .message-status {
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
          transition: opacity 0.2s;
        }

        .message-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          text-align: center;
          padding: 2rem;
        }

        .no-conversation h3 {
          color: #fff;
          margin: 1rem 0 0.5rem;
        }

        .no-conversation p {
          margin-bottom: 1.5rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: #111827;
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          border: 1px solid #1f2937;
        }

        .modal-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          color: #9ca3af;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          color: #fff;
          font-size: 0.9375rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid #374151;
          border-radius: 8px;
          color: #9ca3af;
          cursor: pointer;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .chat-page {
            padding: 1rem;
          }

          .chat-container {
            grid-template-columns: 1fr;
            height: calc(100vh - 150px);
          }

          .conversations-sidebar.hide-mobile,
          .chat-area.hide-mobile {
            display: none;
          }

          .btn-back-mobile {
            display: flex;
          }

          .message {
            max-width: 85%;
          }
        }
      `}</style>
    </>
  );
}
