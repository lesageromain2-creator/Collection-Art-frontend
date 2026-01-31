// frontend/pages/admin/index.js - Vue d'ensemble Admin (Association)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCard from '../../components/admin/StatsCard';
import { MessageSquare, FileText, Mail, Calendar, FolderOpen } from 'lucide-react';
import {
  checkAuth,
  getContactMessagesStats,
  getNewsletterStats,
  fetchAPI
} from '../../utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    articles: 0,
    messages: { unread: 0, total: 0 },
    newsletter: { total: 0, active: 0 },
  });
  const [recentActivity] = useState([]);
  const [projectsNeedingAttention] = useState([]);
  const [upcomingReservations] = useState([]);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin');
        return;
      }
      setUser(authData.user);

      const [articlesRes, messagesStats, newsletterStats] = await Promise.all([
        fetchAPI('/articles?limit=1&page=1').catch(() => ({ total: 0 })),
        getContactMessagesStats().catch(() => ({ unread: 0, total: 0 })),
        getNewsletterStats().catch(() => ({ total: 0, active: 0 })),
      ]);

      setStats({
        articles: articlesRes?.total ?? 0,
        messages: messagesStats,
        newsletter: newsletterStats,
      });
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
            background: #212E50;
            color: #F8F8F0;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(199, 161, 30, 0.2);
            border-top-color: #C7A11E;
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
        <title>Tableau de bord Admin - Collection Aur&apos;Art</title>
      </Head>

      <div className="admin-layout">
        <div className="admin-art-bg" aria-hidden="true" />
        <AdminSidebar activeSection="overview" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            <div className="content-header">
              <h1>Vue d'ensemble</h1>
              <p>Bienvenue dans votre tableau de bord administrateur</p>
            </div>

            {/* Stats Cards - Association */}
            <div className="stats-grid">
              <StatsCard
                title="Articles publiés"
                value={stats.articles}
                icon={FileText}
                gradient="blue"
                onClick={() => router.push('/admin/blog')}
              />
              <StatsCard
                title="Messages contact"
                value={stats.messages.total ?? 0}
                icon={MessageSquare}
                gradient="purple"
                onClick={() => router.push('/admin/messages')}
              />
              <StatsCard
                title="Abonnés newsletter"
                value={stats.newsletter?.total ?? stats.newsletter?.active ?? 0}
                icon={Mail}
                gradient="green"
                onClick={() => router.push('/admin/newsletter')}
              />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-grid">
              <button className="quick-action-card" onClick={() => router.push('/admin/blog')}>
                <FileText size={32} />
                <span>Gérer les articles</span>
              </button>
              <button className="quick-action-card" onClick={() => router.push('/admin/messages')}>
                <MessageSquare size={32} />
                <span>Messages contact</span>
              </button>
              <button className="quick-action-card" onClick={() => router.push('/admin/newsletter')}>
                <Mail size={32} />
                <span>Newsletter</span>
              </button>
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
          background: #212E50;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .admin-art-bg {
          position: fixed;
          inset: 0;
          background: url('/images/au fil des oeuvres.png') center center / cover no-repeat;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }

        .admin-main {
          position: relative;
          z-index: 1;
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
          color: #F8F8F0;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .content-header p {
          color: rgba(248, 248, 240, 0.65);
          font-size: 16px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .section-card {
          background: rgba(248, 248, 240, 0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(199, 161, 30, 0.2);
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
          color: #F8F8F0;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .view-all-btn {
          padding: 8px 16px;
          background: rgba(124, 42, 60, 0.3);
          border: 1px solid rgba(241, 178, 200, 0.3);
          border-radius: 8px;
          color: #F1B2C8;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          background: rgba(124, 42, 60, 0.5);
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
          background: rgba(248, 248, 240, 0.04);
          border-radius: 12px;
          transition: background 0.2s;
        }

        .attention-item:hover,
        .reservation-item:hover {
          background: rgba(108, 129, 87, 0.1);
        }

        .attention-content,
        .reservation-info {
          flex: 1;
        }

        .attention-content h3,
        .reservation-info h3 {
          color: #F8F8F0;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .attention-content p,
        .reservation-info p {
          color: rgba(248, 248, 240, 0.65);
          font-size: 12px;
          margin: 0;
        }

        .attention-badge,
        .reservation-status {
          padding: 6px 12px;
          background: rgba(199, 161, 30, 0.2);
          color: #C7A11E;
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
          background: linear-gradient(135deg, #7C2A3C, #C7A11E);
          border-radius: 10px;
        }

        .date-day {
          font-size: 20px;
          font-weight: 900;
          color: #F8F8F0;
          line-height: 1;
        }

        .date-month {
          font-size: 10px;
          font-weight: 700;
          color: rgba(248, 248, 240, 0.9);
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
          background: rgba(124, 42, 60, 0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F1B2C8;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-content p {
          color: #F8F8F0;
          font-size: 14px;
          margin: 0 0 4px 0;
        }

        .activity-content strong {
          color: #C7A11E;
        }

        .activity-time {
          color: rgba(248, 248, 240, 0.5);
          font-size: 12px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .quick-action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 32px 20px;
          background: rgba(248, 248, 240, 0.06);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(199, 161, 30, 0.2);
          border-radius: 16px;
          color: #F8F8F0;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-action-card:hover {
          transform: translateY(-5px);
          border-color: rgba(199, 161, 30, 0.45);
          box-shadow: 0 15px 40px rgba(33, 46, 80, 0.4);
          background: rgba(108, 129, 87, 0.12);
        }

        .quick-action-card span {
          font-size: 15px;
          font-weight: 600;
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

          .quick-actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
