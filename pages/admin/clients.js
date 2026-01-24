// frontend/pages/admin/clients.js - Gestion Clients
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { Search, User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { checkAuth, getAdminUsers, getAdminUserDetails } from '../../utils/api';

export default function AdminClients() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, filters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/clients');
        return;
      }

      setUser(authData.user);
      const data = await getAdminUsers();
      // Filtrer seulement les clients (pas les admins)
      const clientList = (data.users || []).filter(u => u.role !== 'admin');
      setClients(clientList);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        `${c.firstname} ${c.lastname}`.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.company_name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredClients(filtered);
  };

  const loadClientDetails = async (clientId) => {
    try {
      setLoadingDetails(true);
      const details = await getAdminUserDetails(clientId);
      setClientDetails(details);
    } catch (error) {
      console.error('Erreur chargement détails client:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClientClick = async (client) => {
    setSelectedClient(client);
    setShowModal(true);
    await loadClientDetails(client.id);
  };

  const tableColumns = [
    { key: 'name', label: 'Nom', render: (_, row) => `${row.firstname} ${row.lastname}` },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Téléphone' },
    { key: 'company_name', label: 'Entreprise' },
    { key: 'created_at', label: 'Membre depuis', render: (val) => new Date(val).toLocaleDateString('fr-FR') },
  ];

  return (
    <>
      <Head>
        <title>Gestion Clients - Admin LE SAGE DEV</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="clients" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <div>
                <h1>Gestion des Clients</h1>
                <p>Consultez et gérez tous vos clients</p>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Liste des clients */}
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="empty-state">
                <User size={60} />
                <p>Aucun client trouvé</p>
              </div>
            ) : (
              <DataTable
                columns={tableColumns}
                data={filteredClients}
                onRowClick={handleClientClick}
                actions={(row) => (
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClientClick(row);
                    }}
                    title="Voir détails"
                  >
                    <User size={16} />
                  </button>
                )}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modal détails client */}
      {showModal && selectedClient && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
            setClientDetails(null);
          }}
          title={`${selectedClient.firstname} ${selectedClient.lastname}`}
          size="large"
        >
          {loadingDetails ? (
            <div className="loading-details">
              <div className="loading-spinner"></div>
              <p>Chargement des détails...</p>
            </div>
          ) : (
            <div className="client-details">
              {/* Informations personnelles */}
              <div className="detail-section">
                <h3>
                  <User size={18} />
                  Informations personnelles
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Nom complet</span>
                    <span className="info-value">
                      {selectedClient.firstname} {selectedClient.lastname}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedClient.email}</span>
                  </div>
                  {selectedClient.phone && (
                    <div className="info-item">
                      <span className="info-label">Téléphone</span>
                      <span className="info-value">{selectedClient.phone}</span>
                    </div>
                  )}
                  {selectedClient.company_name && (
                    <div className="info-item">
                      <span className="info-label">Entreprise</span>
                      <span className="info-value">{selectedClient.company_name}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Membre depuis</span>
                    <span className="info-value">
                      {new Date(selectedClient.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              {clientDetails && (
                <>
                  <div className="detail-section">
                    <h3>
                      <Briefcase size={18} />
                      Statistiques
                    </h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Projets</span>
                        <span className="stat-value">
                          {clientDetails.stats?.projects_count || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Réservations</span>
                        <span className="stat-value">
                          {clientDetails.stats?.reservations_count || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">CA Total</span>
                        <span className="stat-value">
                          {clientDetails.stats?.total_revenue 
                            ? `${clientDetails.stats.total_revenue.toFixed(2)}€`
                            : '0€'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Projets récents */}
                  {clientDetails.projects && clientDetails.projects.length > 0 && (
                    <div className="detail-section">
                      <h3>
                        <Briefcase size={18} />
                        Projets récents
                      </h3>
                      <div className="projects-list">
                        {clientDetails.projects.slice(0, 5).map((project) => (
                          <div
                            key={project.id}
                            className="project-item"
                            onClick={() => router.push(`/admin/project/${project.id}`)}
                          >
                            <div>
                              <strong>{project.title}</strong>
                              <p>{project.status}</p>
                            </div>
                            <span className="project-progress">{project.progress || 0}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Réservations récentes */}
                  {clientDetails.reservations && clientDetails.reservations.length > 0 && (
                    <div className="detail-section">
                      <h3>
                        <Calendar size={18} />
                        Réservations récentes
                      </h3>
                      <div className="reservations-list">
                        {clientDetails.reservations.slice(0, 5).map((reservation) => (
                          <div key={reservation.id} className="reservation-item">
                            <div>
                              <strong>
                                {new Date(reservation.reservation_date).toLocaleDateString('fr-FR')}
                              </strong>
                              <p>{reservation.reservation_time?.substring(0, 5)} - {reservation.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
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
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 500px;
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

        .loading-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.6);
        }

        .client-details {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .stat-value {
          color: white;
          font-size: 24px;
          font-weight: 800;
        }

        .projects-list,
        .reservations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .project-item,
        .reservation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .project-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .project-item strong,
        .reservation-item strong {
          color: white;
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .project-item p,
        .reservation-item p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin: 0;
        }

        .project-progress {
          padding: 6px 12px;
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}
