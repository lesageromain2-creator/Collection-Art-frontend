// frontend/pages/messages.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Send, MessageSquare, User as UserIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  checkAuth, 
  getUserConversation, 
  sendMessageToAdmin, 
  markMessagesAsRead,
  fetchSettings 
} from '../utils/api';

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
    // Polling toutes les 10 secondes pour nouveaux messages
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated) {
        router.push('/login?redirect=/messages');
        return;
      }
      setUser(authData.user);

      const [messagesData, settingsData] = await Promise.all([
        getUserConversation(),
        fetchSettings()
      ]);

      setMessages(messagesData.messages || messagesData || []);
      setSettings(settingsData);

      // Marquer les messages comme lus
      if (messagesData.messages && messagesData.messages.length > 0) {
        const conversationId = messagesData.messages[0].conversation_id;
        if (conversationId) {
          markMessagesAsRead(conversationId).catch(console.error);
        }
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await getUserConversation();
      setMessages(messagesData.messages || messagesData || []);
    } catch (error) {
      console.error('Erreur rafraîchissement messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await sendMessageToAdmin(newMessage);
      setNewMessage('');
      await loadMessages();
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
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Head><title>Chargement...</title></Head>
        <Header settings={settings} />
        <div style={{ minHeight: '100vh', background: '#0A0E27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
        <style jsx>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #0066FF;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Messages - {settings.site_name || "Collection Aur'art"}</title>
      </Head>

      <Header settings={settings} />

      <div className="messages-page">
        <div className="messages-container">
          {/* Header */}
          <div className="messages-header">
            <div className="header-content">
              <div className="avatar-group">
                <div className="avatar">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h1>Messagerie</h1>
                  <p>Discutez avec notre équipe</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={60} />
                <h3>Aucun message</h3>
                <p>Démarrez la conversation en envoyant un message ci-dessous</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-bubble ${message.sender_id === user?.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.message || message.content}</p>
                      <span className="message-time">
                        {formatMessageDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="message-input-form">
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
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .messages-page {
          min-height: 100vh;
          background: #0A0E27;
          padding: 120px 20px 20px;
        }

        .messages-container {
          max-width: 900px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
        }

        .messages-header {
          padding: 24px 30px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .avatar-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .messages-header h1 {
          color: white;
          font-size: 1.4em;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .messages-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9em;
        }

        .messages-list {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .messages-list::-webkit-scrollbar {
          width: 8px;
        }

        .messages-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .messages-list::-webkit-scrollbar-thumb {
          background: rgba(0, 102, 255, 0.5);
          border-radius: 4px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }

        .empty-state svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: white;
          font-size: 1.4em;
          margin-bottom: 8px;
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
          padding: 14px 18px;
          border-radius: 16px;
          position: relative;
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
          font-size: 0.75em;
          margin-top: 6px;
          opacity: 0.8;
        }

        .message-input-form {
          display: flex;
          gap: 12px;
          padding: 20px 30px;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-input-form input {
          flex: 1;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
        }

        .message-input-form input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .message-input-form button {
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

        .message-input-form button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .message-input-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        @media (max-width: 768px) {
          .messages-page {
            padding: 100px 10px 10px;
          }

          .messages-container {
            height: calc(100vh - 120px);
          }

          .message-bubble {
            max-width: 85%;
          }

          .messages-header {
            padding: 20px;
          }

          .messages-list {
            padding: 20px;
          }

          .message-input-form {
            padding: 16px 20px;
          }
        }
      `}</style>
    </>
  );
}
