// frontend/pages/admin/reservations.js - Gestion Réservations
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ReservationCard from '../../components/admin/ReservationCard';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { Search, Filter, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { checkAuth, getAdminReservations, updateAdminReservation } from '../../utils/api';

export default function AdminReservations() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all',
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, filters]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/reservations');
        return;
      }

      setUser(authData.user);
      const data = await getAdminReservations();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.client_name?.toLowerCase().includes(searchLower) ||
        r.email?.toLowerCase().includes(searchLower) ||
        r.message?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(r => {
        const resDate = new Date(`${r.reservation_date}T${r.reservation_time}`);
        switch (filters.dateRange) {
          case 'today':
            return resDate.toDateString() === now.toDateString();
          case 'week':
            return resDate >= now && resDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          case 'month':
            return resDate >= now && resDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    setFilteredReservations(filtered);
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      await updateAdminReservation(reservationId, { status: newStatus });
      await loadReservations();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const tableColumns = [
    { key: 'reservation_date', label: 'Date', render: (val) => new Date(val).toLocaleDateString('fr-FR') },
    { key: 'reservation_time', label: 'Heure', render: (val) => val?.substring(0, 5) },
    { key: 'client_name', label: 'Client', render: (_, row) => row.client_name || `${row.firstname} ${row.lastname}` },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Statut' },
    { key: 'meeting_type', label: 'Type', render: (val) => val === 'visio' ? 'Visioconférence' : 'Présentiel' },
  ];

  return (
    <>
      <Head>
        <title>Gestion Réservations - Admin LE SAGE DEV</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="reservations" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <div>
                <h1>Gestion des Rendez-vous</h1>
                <p>Consultez et gérez toutes les réservations</p>
              </div>
            </div>

            {/* Filtres */}
            <div className="filters-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une réservation..."
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
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="filter-select"
                >
                  <option value="all">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
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

            {/* Liste des réservations */}
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Chargement des réservations...</p>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="empty-state">
                <Calendar size={60} />
                <p>Aucune réservation trouvée</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="reservations-grid">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <DataTable
                columns={tableColumns}
                data={filteredReservations}
                onRowClick={(row) => {
                  setSelectedReservation(row);
                  setShowModal(true);
                }}
                actions={(row) => (
                  <>
                    {row.status === 'pending' && (
                      <button
                        className="action-btn success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(row.id, 'confirmed');
                        }}
                        title="Confirmer"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {row.status !== 'cancelled' && (
                      <button
                        className="action-btn danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Annuler cette réservation ?')) {
                            handleStatusChange(row.id, 'cancelled');
                          }
                        }}
                        title="Annuler"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </>
                )}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modal détails réservation */}
      {showModal && selectedReservation && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedReservation(null);
          }}
          title="Détails de la réservation"
          size="medium"
        >
          <div className="reservation-details">
            <div className="detail-section">
              <h3>Client</h3>
              <p><strong>{selectedReservation.client_name || `${selectedReservation.firstname} ${selectedReservation.lastname}`}</strong></p>
              {selectedReservation.email && <p>{selectedReservation.email}</p>}
              {selectedReservation.phone && <p>{selectedReservation.phone}</p>}
            </div>

            <div className="detail-section">
              <h3>Date et heure</h3>
              <p>{new Date(selectedReservation.reservation_date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
              <p>{selectedReservation.reservation_time?.substring(0, 5)}</p>
            </div>

            {selectedReservation.message && (
              <div className="detail-section">
                <h3>Message</h3>
                <p>{selectedReservation.message}</p>
              </div>
            )}

            <div className="detail-actions">
              {selectedReservation.status === 'pending' && (
                <button
                  className="btn-confirm"
                  onClick={() => {
                    handleStatusChange(selectedReservation.id, 'confirmed');
                    setShowModal(false);
                  }}
                >
                  <CheckCircle size={18} />
                  Confirmer
                </button>
              )}
            </div>
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

        .reservations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

        .action-btn.success {
          color: #10b981;
        }

        .action-btn.success:hover {
          background: rgba(16, 185, 129, 0.15);
        }

        .action-btn.danger {
          color: #ef4444;
        }

        .action-btn.danger:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        .reservation-details {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-section h3 {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .detail-section p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin: 4px 0;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-confirm {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          color: #10b981;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-confirm:hover {
          background: rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 20px;
          }

          .reservations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
