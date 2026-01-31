// frontend/pages/admin/newsletter.js - Gestion Newsletter (Association)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Mail, Users } from 'lucide-react';
import { checkAuth, getNewsletterSubscribers, getNewsletterStats } from '../../utils/api';

export default function AdminNewsletter() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || authData.user?.role !== 'admin') {
        router.push('/login?redirect=/admin/newsletter');
        return;
      }
      setUser(authData.user);
      const [subsData, statsData] = await Promise.all([
        getNewsletterSubscribers().catch(() => ({ subscribers: [] })),
        getNewsletterStats().catch(() => ({ stats: {} })),
      ]);
      setSubscribers(subsData?.subscribers || []);
      const s = statsData?.stats || {};
      setStats({ total: parseInt(s.total, 10) || 0, active: parseInt(s.active_subscribers, 10) || 0 });
    } catch (error) {
      console.error('Erreur chargement newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Chargement...</p>
        <style jsx>{`
          .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #212E50; color: #F8F8F0; }
          .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(199,161,30,0.2); border-top-color: #C7A11E; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head><title>Newsletter - Admin Collection Aur&apos;Art</title></Head>
      <div className="admin-layout">
        <AdminSidebar activeSection="newsletter" />
        <div className="admin-main">
          <AdminHeader user={user} />
          <main className="admin-content">
            <div className="content-header">
              <h1>Newsletter</h1>
              <p>Abonnés à la newsletter</p>
            </div>
            <div className="stats-row">
              <div className="stat-box">
                <Users size={24} />
                <span>{stats.total || stats.active || subscribers.length}</span>
                <span>Abonnés</span>
              </div>
            </div>
            <div className="section-card">
              <h2>Liste des abonnés</h2>
              {subscribers.length === 0 ? (
                <p className="empty">Aucun abonné pour le moment.</p>
              ) : (
                <ul className="subscribers-list">
                  {subscribers.map((s) => (
                    <li key={s.id}>
                      <Mail size={16} />
                      <span>{s.email}</span>
                      {(s.firstname || s.lastname) && (
                        <span className="name"> — {[s.firstname, s.lastname].filter(Boolean).join(' ')}</span>
                      )}
                      {s.status && <span className="badge">{s.status}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </div>
      <style jsx>{`
        .admin-layout { min-height: 100vh; background: #212E50; display: flex; }
        .admin-main { flex: 1; margin-left: 280px; }
        .admin-content { margin-top: 80px; padding: 40px; }
        .content-header h1 { color: #F8F8F0; font-size: 28px; margin-bottom: 8px; }
        .content-header p { color: rgba(248,248,240,0.65); }
        .stats-row { display: flex; gap: 20px; margin-bottom: 24px; }
        .stat-box { background: rgba(248,248,240,0.06); border: 1px solid rgba(199,161,30,0.2); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 12px; }
        .stat-box span:first-of-type { font-size: 24px; font-weight: 700; color: #F8F8F0; }
        .stat-box span:last-of-type { color: rgba(248,248,240,0.7); }
        .section-card { background: rgba(248,248,240,0.06); border: 1px solid rgba(199,161,30,0.2); border-radius: 16px; padding: 24px; }
        .section-card h2 { color: #F8F8F0; font-size: 18px; margin-bottom: 16px; }
        .empty { color: rgba(248,248,240,0.6); }
        .subscribers-list { list-style: none; padding: 0; margin: 0; }
        .subscribers-list li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #F8F8F0; }
        .subscribers-list li .name { color: rgba(248,248,240,0.7); }
        .subscribers-list li .badge { font-size: 11px; padding: 2px 8px; background: rgba(108,129,87,0.3); border-radius: 8px; }
      `}</style>
    </>
  );
}
