// frontend/pages/admin/index.js - Vue d'ensemble Admin
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import { 
  FolderOpen, 
  Calendar, 
  MessageSquare, 
  Users,
  TrendingUp
} from 'lucide-react';
import {
  checkAuth,
  getAdminDashboard,
  getProjectsStats,
  getReservationsStats,
  getContactMessagesStats
} from '../../utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: { active: 0, pending: 0, completed: 0 },
    reservations: { pending: 0, confirmed: 0, total: 0 },
    messages: { unread: 0, total: 0 },
    clients: { total: 0, new: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [projectsNeedingAttention, setProjectsNeedingAttention] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  useEffect(() => {
    loadDashboardData();
    
    // Polling toutes les 30s pour updates
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Vérifier auth
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin');
        return;
      }

      setUser(authData.user);

      // Charger toutes les stats en parallèle
      const [dashboardData, projectsStats, reservationsStats, messagesStats] = await Promise.all([
        getAdminDashboard().catch(() => ({ stats: {}, recentActivity: [], projectsNeedingAttention: [], upcomingReservations: [] })),
        getProjectsStats().catch(() => ({ active: 0, pending: 0, completed: 0 })),
        getReservationsStats().catch(() => ({ pending: 0, confirmed: 0, total: 0 })),
        getContactMessagesStats().catch(() => ({ unread: 0, total: 0 })),
      ]);

      setStats({
        projects: projectsStats,
        reservations: reservationsStats,
        messages: messagesStats,
        clients: dashboardData.stats?.clients || { total: 0, new: 0 },
      });

      setRecentActivity(dashboardData.recentActivity || []);
      setProjectsNeedingAttention(dashboardData.projectsNeedingAttention || []);
      setUpcomingReservations(dashboardData.upcomingReservations || []);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
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
        <title>Tableau de bord Admin - LE SAGE DEV</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="overview" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <h1>Vue d'ensemble</h1>
              <p>Bienvenue dans votre tableau de bord administrateur</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <StatsCard
                title="Projets actifs"
                value={stats.projects.active}
                icon={FolderOpen}
                trend={5}
                trendValue={2}
                gradient="blue"
                onClick={() => router.push('/admin/projects')}
              />
              <StatsCard
                title="RDV en attente"
                value={stats.reservations.pending}
                icon={Calendar}
                trend={-3}
                trendValue={-1}
                gradient="orange"
                onClick={() => router.push('/admin/reservations')}
              />
              <StatsCard
                title="Messages non lus"
                value={stats.messages.unread}
                icon={MessageSquare}
                trend={12}
                trendValue={3}
                gradient="purple"
                onClick={() => router.push('/admin/messages')}
              />
              <StatsCard
                title="Nouveaux clients"
                value={stats.clients.new}
                icon={Users}
                trend={8}
                trendValue={2}
                gradient="green"
                onClick={() => router.push('/admin/clients')}
              />
            </div>

            {/* Projets nécessitant attention */}
            {projectsNeedingAttention.length > 0 && (
              <div className="section-card">
                <div className="section-header">
                  <h2>Projets nécessitant attention</h2>
                  <button 
                    className="view-all-btn"
                    onClick={() => router.push('/admin/projects')}
                  >
                    Voir tout
                  </button>
                </div>
                <div className="attention-list">
                  {projectsNeedingAttention.slice(0, 5).map((project) => (
                    <div key={project.id} className="attention-item">
                      <div className="attention-content">
                        <h3>{project.title}</h3>
                        <p>{project.client_name}</p>
                      </div>
                      <div className="attention-badge">
                        {project.alert_type === 'overdue' && '⚠️ En retard'}
                        {project.alert_type === 'urgent' && '🔥 Urgent'}
                        {project.alert_type === 'due_soon' && '⏰ Bientôt dû'}
                        {project.alert_type === 'on_hold' && '⏸️ En attente'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RDV à venir */}
            {upcomingReservations.length > 0 && (
              <div className="section-card">
                <div className="section-header">
                  <h2>Prochains rendez-vous</h2>
                  <button 
                    className="view-all-btn"
                    onClick={() => router.push('/admin/reservations')}
                  >
                    Voir tout
                  </button>
                </div>
                <div className="reservations-list">
                  {upcomingReservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="reservation-item">
                      <div className="reservation-date">
                        <span className="date-day">
                          {new Date(reservation.reservation_date).getDate()}
                        </span>
                        <span className="date-month">
                          {new Date(reservation.reservation_date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                      <div className="reservation-info">
                        <h3>{reservation.client_name}</h3>
                        <p>{reservation.reservation_time?.substring(0, 5)}</p>
                      </div>
                      <div className="reservation-status">
                        {reservation.status === 'pending' && '⏳ En attente'}
                        {reservation.status === 'confirmed' && '✅ Confirmé'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activité récente */}
            {recentActivity.length > 0 && (
              <div className="section-card">
                <h2>Activité récente</h2>
                <div className="activity-timeline">
                  {recentActivity.slice(0, 10).map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'reservation' && <Calendar size={16} />}
                        {activity.type === 'project' && <FolderOpen size={16} />}
                        {activity.type === 'message' && <MessageSquare size={16} />}
                      </div>
                      <div className="activity-content">
                        <p>
                          <strong>{activity.user_name}</strong> - {activity.detail}
                        </p>
                        <span className="activity-time">
                          {new Date(activity.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .section-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-card h2 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .view-all-btn {
          padding: 8px 16px;
          background: rgba(0, 102, 255, 0.2);
          border: 1px solid rgba(0, 102, 255, 0.3);
          border-radius: 8px;
          color: #00D9FF;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: rgba(0, 102, 255, 0.3);
        }

        .attention-list,
        .reservations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .attention-item,
        .reservation-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          transition: background 0.2s;
        }

        .attention-item:hover,
        .reservation-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .attention-content,
        .reservation-info {
          flex: 1;
        }

        .attention-content h3,
        .reservation-info h3 {
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .attention-content p,
        .reservation-info p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin: 0;
        }

        .attention-badge,
        .reservation-status {
          padding: 6px 12px;
          background: rgba(255, 107, 53, 0.15);
          color: #FF6B35;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .reservation-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 10px;
        }

        .date-day {
          font-size: 20px;
          font-weight: 900;
          color: white;
          line-height: 1;
        }

        .date-month {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
        }

        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .activity-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: rgba(0, 102, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00D9FF;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          color: white;
          font-size: 14px;
          margin: 0 0 4px 0;
        }

        .activity-content strong {
          color: #00D9FF;
        }

        .activity-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
