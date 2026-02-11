// frontend/pages/mes-messages.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { checkAuth, fetchSettings, getUserMessages } from '../utils/api';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function MesMessages() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authData = await checkAuth();
      if (!authData.authenticated) {
        router.push('/login?redirect=/mes-messages');
        return;
      }

      setUser(authData.user);
      
      const settingsData = await fetchSettings();
      setSettings(settingsData);

      // Charger les messages de l'utilisateur
      const messagesData = await getUserMessages();
      console.log('📨 Messages reçus:', messagesData);
      setMessages(messagesData.messages || []);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement de vos messages...</p>
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
        <title>Mes Messages - Collection Aur'art</title>
      </Head>

      <Header settings={settings} user={user} />

      <div className="messages-page">
        <div className="container">
          <h1>Mes Messages</h1>
          <p className="subtitle">Retrouvez ici tous vos échanges avec notre équipe</p>
          
          {messages.length === 0 ? (
            <div className="empty-state">
              <Mail size={60} />
              <p>Aucun message pour le moment</p>
              <button 
                className="btn-contact"
                onClick={() => router.push('/contact')}
              >
                Nous contacter
              </button>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className="message-card">
                  <div className="message-header">
                    <div className="header-left">
                      <h3>{msg.subject || 'Message sans sujet'}</h3>
                      <span className={`status-badge status-${msg.status}`}>
                        {msg.status === 'new' && '🆕 Nouveau'}
                        {msg.status === 'read' && '👁️ Lu'}
                        {msg.status === 'replied' && '✅ Répondu'}
                        {msg.status === 'archived' && '📁 Archivé'}
                      </span>
                    </div>
                    <span className="message-date">
                      <Clock size={16} />
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="message-content">
                    <h4>Votre message :</h4>
                    <p>{msg.message}</p>
                  </div>
                  
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="replies-section">
                      <h4>Réponses de notre équipe :</h4>
                      {msg.replies.map((reply) => (
                        <div key={reply.id} className="message-reply">
                          <div className="reply-header">
                            <div className="reply-badge">
                              <CheckCircle size={16} />
                              Réponse de {reply.admin_name || "Collection Aur'art"}
                            </div>
                            <span className="reply-date">
                              {new Date(reply.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="reply-text">{reply.reply_text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.status === 'new' && (
                    <div className="pending-notice">
                      <AlertCircle size={16} />
                      En attente de réponse de notre équipe
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .messages-page {
          min-height: 100vh;
          background: #0A0E27;
          padding: 120px 20px 60px;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        h1 {
          color: white;
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1em;
          margin-bottom: 40px;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s ease;
        }

        .message-card:hover {
          border-color: rgba(0, 102, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.2);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .message-header h3 {
          color: white;
          font-size: 1.4em;
          margin: 0;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85em;
          font-weight: 600;
        }

        .status-new {
          background: rgba(0, 217, 255, 0.2);
          color: #00D9FF;
        }

        .status-read {
          background: rgba(255, 193, 7, 0.2);
          color: #FFC107;
        }

        .status-replied {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        }

        .status-archived {
          background: rgba(158, 158, 158, 0.2);
          color: #9E9E9E;
        }

        .message-date {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9em;
          white-space: nowrap;
        }

        .message-content {
          margin-bottom: 20px;
        }

        .message-content h4,
        .replies-section h4 {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95em;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message-content p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          white-space: pre-wrap;
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: 12px;
          border-left: 3px solid rgba(255, 255, 255, 0.1);
        }

        .replies-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .message-reply {
          background: rgba(0, 102, 255, 0.08);
          border-left: 4px solid #0066FF;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .message-reply:last-child {
          margin-bottom: 0;
        }

        .reply-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 12px;
        }

        .reply-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00D9FF;
          font-weight: 600;
          font-size: 0.95em;
        }

        .reply-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85em;
        }

        .reply-text {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
        }

        .pending-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 10px;
          color: #FFC107;
          font-size: 0.9em;
          margin-top: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 100px 20px;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-state svg {
          margin-bottom: 24px;
          opacity: 0.3;
        }

        .empty-state p {
          font-size: 1.2em;
          margin-bottom: 30px;
        }

        .btn-contact {
          padding: 14px 32px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.05em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
        }

        .btn-contact:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.4);
        }

        @media (max-width: 768px) {
          .messages-page {
            padding: 100px 15px 40px;
          }

          h1 {
            font-size: 2em;
          }

          .message-card {
            padding: 20px;
          }

          .message-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-left {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}