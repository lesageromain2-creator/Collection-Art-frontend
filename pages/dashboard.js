// frontend/pages/dashboard.js - Dashboard Agence Web LE SAGE
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Calendar, FolderOpen, FileText, User, Settings, LogOut, Briefcase, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateProjectModal from '../components/CreateProjectModal';
import { 
  checkAuth, 
  logout, 
  fetchSettings, 
  getMyReservations,
  cancelReservation,
  deleteReservation,
  getMyProjects
} from '../utils/api';
import { createProject, getClients } from '../utils/projectApi';
import { toast } from 'react-toastify';
import FileDropzone from '../components/FileUpload/FileDropzone';
import FileGallery from '../components/FileUpload/FileGallery';
import { useFileUpload } from '../hooks/useFileUpload';
import { useProjectFiles } from '../hooks/useProjectFiles';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    reservations: 0,
    projects: 0,
    files: 0
  });
  const [mounted, setMounted] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // États pour les réservations
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  // Fichiers / projets
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filesInProgress, setFilesInProgress] = useState([]);
  const { uploadFiles, uploading, progress, error: uploadError } = useFileUpload(selectedProjectId);
  const { files, loading: filesLoading, error: filesError, refreshFiles, downloadFile, deleteFile } = useProjectFiles(selectedProjectId);

  // Modal création projet
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Charger les réservations quand l'onglet change
  useEffect(() => {
    if (activeTab === 'reservations' && user) {
      loadReservations();
    }
  }, [activeTab, user]);

  // Charger mes projets quand onglet Fichiers ou Projects
  useEffect(() => {
    if ((activeTab === 'files' || activeTab === 'projects') && user) {
      getMyProjects().then(setMyProjects);
    }
  }, [activeTab, user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const [authData, settingsData] = await Promise.all([
        checkAuth(),
        fetchSettings()
      ]);

      if (!authData.authenticated || !authData.user) {
        router.push('/login?redirect=/dashboard');
        return;
      }

      setUser(authData.user);
      setSettings(settingsData);

      // Charger les stats
      await loadReservationsForStats();

    } catch (error) {
      console.error('Erreur chargement données:', error);
      router.push('/login?redirect=/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Charger les réservations pour les stats
  const loadReservationsForStats = async () => {
    try {
      const data = await getMyReservations();
      const activeReservations = data.filter(r => r.status !== 'cancelled' && r.status !== 'completed');
      setStats(prev => ({ ...prev, reservations: activeReservations.length }));
    } catch (error) {
      console.error('Erreur stats réservations:', error);
    }
  };

  // Charger la liste complète des réservations
  const loadReservations = async () => {
    try {
      setReservationsLoading(true);
      const data = await getMyReservations();
      const sorted = data.sort((a, b) => {
        const dateA = new Date(`${a.reservation_date}T${a.reservation_time}`);
        const dateB = new Date(`${b.reservation_date}T${b.reservation_time}`);
        return dateB - dateA;
      });
      setReservations(sorted);
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
    } finally {
      setReservationsLoading(false);
    }
  };

  // Supprimer une réservation
  const handleDeleteReservation = async (reservationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    setDeleteLoading(reservationId);
    
    try {
      await deleteReservation(reservationId);
      await loadReservations();
      await loadReservationsForStats();
      alert('Réservation supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression de la réservation');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Annuler une réservation
  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      setCancellingId(reservationId);
      await cancelReservation(reservationId);
      await loadReservations();
      await loadReservationsForStats();
      alert('Réservation annulée avec succès');
    } catch (error) {
      console.error('Erreur annulation:', error);
      alert(error.message || 'Impossible d\'annuler cette réservation');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'En attente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Clock },
      confirmed: { text: 'Confirmée', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: CheckCircle },
      cancelled: { text: 'Annulée', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: XCircle },
      completed: { text: 'Terminée', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: CheckCircle }
    };
    return badges[status] || badges.pending;
  };

  const canCancelReservation = (reservation) => {
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return false;
    }
    const reservationDateTime = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return reservationDateTime > twoHoursFromNow;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement de votre espace...</p>
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
        <title>Espace Client - {settings.site_name || 'LE SAGE'}</title>
      </Head>

      <Header settings={settings} />

      <div className="dashboard-page">
        <div className="bg-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        <div className={`dashboard-container ${mounted ? 'mounted' : ''}`}>
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="user-avatar">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" />
                ) : (
                  <span>{getInitials(user?.firstname, user?.lastname)}</span>
                )}
              </div>
              <div className="user-info">
                <h3>{user?.firstname} {user?.lastname}</h3>
                <p>{user?.email}</p>
                <span className="user-badge">Client</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Briefcase size={20} />
                <span>Vue d'ensemble</span>
              </button>

              <button 
                className={`nav-item ${activeTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                <Calendar size={20} />
                <span>Mes Rendez-vous</span>
                {stats.reservations > 0 && (
                  <span className="badge">{stats.reservations}</span>
                )}
              </button>

              <button 
                className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FolderOpen size={20} />
                <span>Mes Projets</span>
              </button>

              <button 
                className={`nav-item ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
              >
                <FileText size={20} />
                <span>Mes Fichiers</span>
              </button>

              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Mon Profil</span>
              </button>

              <div className="nav-divider"></div>

              <button className="nav-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Déconnexion</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            <div className="main-header">
              <div>
                <h1>{getGreeting()}, {user?.firstname} ! 👋</h1>
                <p>Bienvenue dans votre espace client</p>
              </div>
              <button className="btn-primary" onClick={() => router.push('/reservation')}>
                <Calendar size={20} />
                Nouveau Rendez-vous
              </button>
            </div>

            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="content-section">
                <div className="stats-grid">
                  <div className="stat-card" onClick={() => setActiveTab('reservations')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0066FF, #00D9FF)' }}>
                      <Calendar size={28} color="white" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.reservations}</h3>
                      <p>Rendez-vous actifs</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => setActiveTab('projects')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}>
                      <FolderOpen size={28} color="white" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.projects}</h3>
                      <p>Projets en cours</p>
                    </div>
                  </div>

                  <div className="stat-card" onClick={() => setActiveTab('files')} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #764ba2, #667eea)' }}>
                      <FileText size={28} color="white" />
                    </div>
                    <div className="stat-content">
                      <h3>{stats.files}</h3>
                      <p>Fichiers partagés</p>
                    </div>
                  </div>
                </div>

                <div className="section-card">
                  <h2>Actions Rapides</h2>
                  <div className="quick-actions">
                    <button className="action-btn" onClick={() => router.push('/reservation')}>
                      <Calendar size={32} />
                      <span>Prendre rendez-vous</span>
                    </button>

                    <button className="action-btn" onClick={() => router.push('/offres')}>
                      <Briefcase size={32} />
                      <span>Découvrir nos offres</span>
                    </button>

                    <button className="action-btn" onClick={() => router.push('/portfolio')}>
                      <FolderOpen size={32} />
                      <span>Voir le portfolio</span>
                    </button>

                    <button className="action-btn" onClick={() => router.push('/contact')}>
                      <FileText size={32} />
                      <span>Nous contacter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Réservations */}
            {activeTab === 'reservations' && (
              <div className="content-section">
                <div className="section-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                      <h2>Mes Rendez-vous</h2>
                      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                        Gérez tous vos rendez-vous
                      </p>
                    </div>
                    <button 
                      className="btn-refresh"
                      onClick={loadReservations}
                      disabled={reservationsLoading}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ 
                          animation: reservationsLoading ? 'spin 1s linear infinite' : 'none',
                          width: '20px',
                          height: '20px'
                        }}
                      >
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                      </svg>
                      Actualiser
                    </button>
                  </div>

                  {reservationsLoading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
                      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Chargement de vos rendez-vous...</p>
                    </div>
                  ) : reservations.length === 0 ? (
                    <div className="empty-state">
                      <Calendar size={80} />
                      <h3>Aucun rendez-vous</h3>
                      <p>Vous n'avez pas encore de rendez-vous programmé</p>
                      <button 
                        className="btn-primary"
                        onClick={() => router.push('/reservation')}
                        style={{ marginTop: '20px' }}
                      >
                        Prendre rendez-vous
                      </button>
                    </div>
                  ) : (
                    <div className="reservations-grid">
                      {reservations.map((reservation) => {
                        const statusInfo = getStatusBadge(reservation.status);
                        const StatusIcon = statusInfo.icon;
                        const canCancel = canCancelReservation(reservation);
                        const isCancelling = cancellingId === reservation.id;

                        return (
                          <div key={reservation.id} className="reservation-card">
                            <div className="reservation-header">
                              <div className="reservation-date-badge">
                                <div className="date-day">
                                  {new Date(reservation.reservation_date).getDate()}
                                </div>
                                <div className="date-month">
                                  {new Date(reservation.reservation_date).toLocaleDateString('fr-FR', { month: 'short' })}
                                </div>
                              </div>
                              <div className="reservation-status">
                                <span 
                                  className="status-badge"
                                  style={{ 
                                    background: statusInfo.bg,
                                    color: statusInfo.color,
                                    border: `2px solid ${statusInfo.color}`
                                  }}
                                >
                                  <StatusIcon size={14} style={{ marginRight: '6px' }} />
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>

                            <div className="reservation-body">
                              <div className="reservation-detail">
                                <Clock size={20} />
                                <div>
                                  <strong>Heure</strong>
                                  <p>{formatTime(reservation.reservation_time)}</p>
                                </div>
                              </div>

                              {reservation.meeting_type && (
                                <div className="reservation-detail">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                  </svg>
                                  <div>
                                    <strong>Type</strong>
                                    <p>{reservation.meeting_type === 'visio' ? 'Visioconférence' : 'Présentiel'}</p>
                                  </div>
                                </div>
                              )}

                              {reservation.message && (
                                <div className="reservation-detail">
                                  <FileText size={20} />
                                  <div>
                                    <strong>Message</strong>
                                    <p>{reservation.message}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="reservation-actions">
                              {canCancel && (
                                <button
                                  className="btn-cancel-reservation"
                                  onClick={() => handleCancelReservation(reservation.id)}
                                  disabled={isCancelling}
                                >
                                  {isCancelling ? (
                                    <>
                                      <span className="spinner-small"></span>
                                      Annulation...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={18} />
                                      Annuler le rendez-vous
                                    </>
                                  )}
                                </button>
                              )}
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteReservation(reservation.id)}
                                disabled={deleteLoading === reservation.id}
                              >
                                {deleteLoading === reservation.id ? (
                                  <>
                                    <span className="spinner"></span>
                                    Suppression...
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={18} />
                                    Supprimer
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Projets */}
            {activeTab === 'projects' && (
              <div className="content-section">
                <div className="section-card">
                  <h2>Mes Projets</h2>
                  {myProjects.length === 0 ? (
                    <div className="empty-state">
                      <FolderOpen size={80} />
                      <h3>Aucun projet</h3>
                      <p>Vos projets en cours apparaîtront ici</p>
                      <button 
                        className="btn-primary"
                        onClick={() => router.push('/offres')}
                        style={{ marginTop: '20px' }}
                      >
                        Découvrir nos offres
                      </button>
                    </div>
                  ) : (
                    <div className="projects-list">
                      {myProjects.map((project) => (
                        <div key={project.id} className="project-card" onClick={() => router.push(`/mes-projets/${project.id}`)}>
                          <div className="project-header-card">
                            <h3>{project.title || project.name || 'Projet'}</h3>
                            <span className={`status-badge status-${project.status}`}>
                              {project.status === 'discovery' && 'Découverte'}
                              {project.status === 'design' && 'Design'}
                              {project.status === 'development' && 'Développement'}
                              {project.status === 'testing' && 'Tests'}
                              {project.status === 'launched' && 'Lancé'}
                              {project.status === 'completed' && 'Terminé'}
                              {project.status === 'on_hold' && 'En pause'}
                            </span>
                          </div>
                          <p className="project-description">{project.description || 'Aucune description'}</p>
                          {project.progress !== undefined && (
                            <div className="progress-container">
                              <div className="progress-label">
                                <span>Progression</span>
                                <span>{project.progress}%</span>
                              </div>
                              <div className="progress-bar-small">
                                <div className="progress-fill-small" style={{ width: `${project.progress}%` }}></div>
                              </div>
                            </div>
                          )}
                          <div className="project-footer">
                            {project.estimated_delivery && (
                              <span className="project-date">
                                <Calendar size={14} />
                                Livraison: {new Date(project.estimated_delivery).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Fichiers */}
            {activeTab === 'files' && (
              <div className="content-section">
                <div className="section-card">
                  <h2>Mes Fichiers</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '6px', marginBottom: '20px' }}>
                    Téléversez et consultez les fichiers de vos projets
                  </p>
                  {myProjects.length === 0 ? (
                    <div className="empty-state">
                      <FileText size={80} />
                      <h3>Aucun projet</h3>
                      <p>Vos projets en cours apparaîtront ici. Les fichiers partagés avec vous seront accessibles par projet.</p>
                      <button
                        className="btn-primary"
                        onClick={() => router.push('/offres')}
                        style={{ marginTop: '20px' }}
                      >
                        Découvrir nos offres
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)' }}>Projet</label>
                        <select
                          value={selectedProjectId || ''}
                          onChange={(e) => setSelectedProjectId(e.target.value || null)}
                          style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fff',
                          }}
                        >
                          <option value="">Sélectionner un projet</option>
                          {myProjects.map((p) => (
                            <option key={p.id} value={p.id}>{p.title || p.name || p.id}</option>
                          ))}
                        </select>
                      </div>
                      {selectedProjectId && (
                        <>
                          <FileDropzone
                            onFilesSelected={async (f) => {
                              setFilesInProgress(f);
                              try {
                                await uploadFiles(f);
                                toast.success('Fichier(s) envoyé(s) avec succès');
                                setFilesInProgress([]);
                                refreshFiles();
                              } catch (e) {
                                toast.error(e.message || "Échec de l'upload");
                                setFilesInProgress([]);
                              }
                            }}
                            maxFiles={10}
                            maxSize={50 * 1024 * 1024}
                            multiple
                            uploading={uploading}
                            progress={progress}
                            filesInProgress={filesInProgress}
                            uploadError={uploadError}
                          />
                          <div style={{ marginTop: '28px' }}>
                            <FileGallery
                              files={files}
                              loading={filesLoading}
                              error={filesError}
                              onDownload={downloadFile}
                              onDelete={deleteFile}
                              onBulkDelete={async (ids) => {
                                for (const id of ids) await deleteFile(id);
                                refreshFiles();
                              }}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Section Profil */}
            {activeTab === 'profile' && (
              <div className="content-section">
                <div className="section-card">
                  <h2>Mon Profil</h2>
                  <div className="profile-info">
                    <div className="info-row">
                      <label>Prénom</label>
                      <span>{user?.firstname}</span>
                    </div>
                    <div className="info-row">
                      <label>Nom</label>
                      <span>{user?.lastname}</span>
                    </div>
                    <div className="info-row">
                      <label>Email</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className="info-row">
                      <label>Téléphone</label>
                      <span>{user?.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="info-row">
                      <label>Entreprise</label>
                      <span>{user?.company_name || 'Non renseigné'}</span>
                    </div>
                    <div className="info-row">
                      <label>Membre depuis</label>
                      <span>{new Date(user?.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <button className="btn-secondary" onClick={() => setActiveTab('settings')}>
                    Modifier mon profil
                  </button>
                </div>
              </div>
            )}

            {/* Section Paramètres */}
            {activeTab === 'settings' && (
              <div className="content-section">
                <div className="section-card">
                  <h2>Paramètres du Compte</h2>
                  <div className="empty-state">
                    <Settings size={80} />
                    <h3>Fonctionnalité en cours de développement</h3>
                    <p>Les paramètres seront bientôt disponibles</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: #0A0E27;
          padding-top: 80px;
          position: relative;
          overflow-x: hidden;
        }

        .bg-effects {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          top: -300px;
          right: -300px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #FF6B35, #764ba2);
          bottom: -250px;
          left: -250px;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.1); }
        }

        .dashboard-container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .dashboard-container.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .dashboard-sidebar {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2em;
          font-weight: 700;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-info h3 {
          color: white;
          font-size: 1.2em;
          margin-bottom: 5px;
        }

        .user-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9em;
          margin-bottom: 10px;
        }

        .user-badge {
          display: inline-block;
          padding: 5px 15px;
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 600;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95em;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
        }

        .nav-item.logout {
          color: #FF6B35;
          margin-top: 10px;
        }

        .nav-item.logout:hover {
          background: rgba(255, 107, 53, 0.1);
        }

        .badge {
          margin-left: auto;
          background: #FF6B35;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75em;
          font-weight: 700;
        }

        .nav-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 10px 0;
        }

        .dashboard-main {
          min-height: calc(100vh - 200px);
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .main-header h1 {
          color: white;
          font-size: 2.5em;
          margin-bottom: 5px;
        }

        .main-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1em;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.6);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .section-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
        }

        .section-card h2 {
          color: white;
          font-size: 1.5em;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content h3 {
          color: white;
          font-size: 2em;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .stat-content p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95em;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #0066FF;
          transform: translateY(-3px);
        }

        .reservations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 25px;
        }

        .reservation-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reservation-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .reservation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .reservation-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 102, 255, 0.4);
        }

        .date-day {
          font-size: 2em;
          font-weight: 900;
          color: white;
          line-height: 1;
        }

        .date-month {
          font-size: 0.75em;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
        }

        .reservation-body {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .reservation-detail {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .reservation-detail:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .reservation-detail svg {
          color: #00D9FF;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .reservation-detail strong {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85em;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reservation-detail p {
          color: white;
          font-weight: 600;
          margin: 0;
        }

        .reservation-actions {
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-cancel-reservation {
          flex: 1;
          min-width: 150px;
          padding: 12px;
          background: rgba(255, 107, 53, 0.15);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 12px;
          color: #FF6B35;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-cancel-reservation:hover:not(:disabled) {
          background: rgba(255, 107, 53, 0.25);
          border-color: #FF6B35;
          transform: translateY(-2px);
        }

        .btn-cancel-reservation:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-delete {
          padding: 12px 18px;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-delete:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.25);
          border-color: #ef4444;
          transform: translateY(-2px);
        }

        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-top-color: #FF6B35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-refresh:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: #0066FF;
        }

        .btn-refresh:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        .empty-state svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 20px;
        }

        .empty-state h3 {
          color: white;
          font-size: 1.5em;
          margin-bottom: 10px;
        }

        .empty-state p {
          margin-bottom: 0;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0066FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
        }

        .info-row span {
          color: white;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .dashboard-sidebar {
            position: relative;
            top: 0;
          }

          .reservations-grid {
            grid-template-columns: 1fr;
          }
        }

        .projects-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .project-card {
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .project-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(0, 102, 255, 0.5);
          transform: translateY(-4px);
        }

        .project-header-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .project-header-card h3 {
          color: white;
          font-size: 1.2em;
          font-weight: 700;
          margin: 0;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-discovery { background: rgba(255, 215, 0, 0.2); color: #FFD700; }
        .status-design { background: rgba(0, 217, 255, 0.2); color: #00D9FF; }
        .status-development { background: rgba(0, 102, 255, 0.2); color: #0066FF; }
        .status-testing { background: rgba(255, 140, 66, 0.2); color: #FF8C42; }
        .status-launched { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-completed { background: rgba(107, 114, 128, 0.2); color: #6b7280; }
        .status-on_hold { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .project-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95em;
          line-height: 1.5;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .progress-container {
          margin-bottom: 16px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.85em;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }

        .progress-bar-small {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill-small {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          transition: width 0.5s ease;
        }

        .project-footer {
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.85em;
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding-top: 60px;
          }

          .main-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .projects-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
