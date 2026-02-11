// frontend/pages/admin/messages.js - Gestion Messages
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import MessageCard from '../../components/admin/MessageCard';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { Search, Filter, Mail, Reply, Archive, Trash2 } from 'lucide-react';
import { checkAuth, getAdminContactMessages, updateAdminContactMessage, replyToContactMessage } from '../../utils/api';

export default function AdminMessages() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadMessages();
    
    // Polling toutes les 30s
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, filters]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/messages');
        return;
      }

      setUser(authData.user);
      const data = await getAdminContactMessages();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];

    if (filters.status !== 'all') {
      filtered = filtered.filter(m => m.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(m => (m.priority || 'normal') === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.subject?.toLowerCase().includes(searchLower) ||
        m.message?.toLowerCase().includes(searchLower) ||
        m.name?.toLowerCase().includes(searchLower) ||
        m.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredMessages(filtered);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await replyToContactMessage(selectedMessage.id, replyText);
      setReplyText('');
      setShowModal(false);
      await loadMessages();
      alert('Réponse envoyée avec succès');
    } catch (error) {
      console.error('Erreur envoi réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await updateAdminContactMessage(messageId, { status: newStatus });
      await loadMessages();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const tableColumns = [
    { key: 'subject', label: 'Sujet', sortable: true },
    { key: 'name', label: 'Expéditeur', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'priority', label: 'Priorité', render: (val) => val || 'normal' },
    { key: 'status', label: 'Statut' },
    { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString('fr-FR') },
  ];

  return (
    <>
      <Head>
        <title>Gestion Messages - Admin Collection Aur'art</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="messages" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <div>
                <h1>Gestion des Messages</h1>
                <p>Consultez et répondez aux messages clients</p>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un message..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>

              <div className="filters-group">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="filter-select"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="new">Nouveau</option>
                  <option value="read">Lu</option>
                  <option value="replied">Répondu</option>
                  <option value="archived">Archivé</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="filter-select"
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="low">Faible</option>
                  <option value="normal">Normale</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>

                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grille
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    Tableau
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des messages */}
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="empty-state">
                <Mail size={60} />
                <p>Aucun message trouvé</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="messages-grid">
                {filteredMessages.map((message) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    onClick={() => {
                      setSelectedMessage(message);
                      setShowModal(true);
                      if (message.status === 'new') {
                        handleStatusChange(message.id, 'read');
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <DataTable
                columns={tableColumns}
                data={filteredMessages}
                onRowClick={(row) => {
                  setSelectedMessage(row);
                  setShowModal(true);
                  if (row.status === 'new') {
                    handleStatusChange(row.id, 'read');
                  }
                }}
                actions={(row) => (
                  <>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(row);
                        setShowModal(true);
                      }}
                      title="Voir"
                    >
                      <Mail size={16} />
                    </button>
                    {row.status !== 'archived' && (
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(row.id, 'archived');
                        }}
                        title="Archiver"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                  </>
                )}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modal détails message */}
      {showModal && selectedMessage && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedMessage(null);
            setReplyText('');
          }}
          title={selectedMessage.subject}
          size="large"
          footer={
            <div className="modal-footer-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setSelectedMessage(null);
                  setReplyText('');
                }}
              >
                Fermer
              </button>
              <button
                className="btn-primary"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                <Reply size={18} />
                Répondre
              </button>
            </div>
          }
        >
          <div className="message-details">
            <div className="message-header-info">
              <div>
                <p><strong>De:</strong> {selectedMessage.name}</p>
                <p><strong>Email:</strong> {selectedMessage.email}</p>
                {selectedMessage.phone && <p><strong>Téléphone:</strong> {selectedMessage.phone}</p>}
                <p><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>

            <div className="message-content">
              <h3>Message</h3>
              <div className="message-text">
                {selectedMessage.message}
              </div>
            </div>

            {selectedMessage.reply_text && (
              <div className="message-reply">
                <h3>Réponse envoyée</h3>
                <div className="reply-text">
                  {selectedMessage.reply_text}
                </div>
                {selectedMessage.replied_at && (
                  <p className="reply-date">
                    Le {new Date(selectedMessage.replied_at).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            )}

            {!selectedMessage.reply_text && (
              <div className="reply-section">
                <h3>Répondre</h3>
                <textarea
                  className="reply-textarea"
                  placeholder="Tapez votre réponse ici..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                />
              </div>
            )}
          </div>
        </Modal>
      )}

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

        .filters-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          color: rgba(255, 255, 255, 0.5);
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
        }

        .search-box input:focus {
          outline: none;
          border-color: #0066FF;
        }

        .filters-group {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .filter-select {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 4px;
        }

        .toggle-btn {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
        }

        .messages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0066FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .action-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .message-details {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message-header-info p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin: 8px 0;
        }

        .message-content h3,
        .message-reply h3,
        .reply-section h3 {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .message-text,
        .reply-text {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .reply-textarea {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .reply-textarea:focus {
          outline: none;
          border-color: #0066FF;
        }

        .reply-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .reply-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          margin-top: 8px;
        }

        .modal-footer-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 20px;
          }

          .messages-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
