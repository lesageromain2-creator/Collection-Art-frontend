// frontend/components/admin/AdminSidebar.js
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Mail,
  LogOut
} from 'lucide-react';

export default function AdminSidebar({ activeSection, onNavigate, notifications = {} }) {
  const router = useRouter();

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard, path: '/admin' },
    { id: 'blog', label: 'Articles / Blog', icon: FileText, path: '/admin/blog', badge: notifications.articles },
    { id: 'messages', label: 'Messages contact', icon: MessageSquare, path: '/admin/messages', badge: notifications.messages },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, path: '/admin/newsletter', badge: notifications.newsletter },
  ];

  const handleLogout = async () => {
    try {
      const { logout } = await import('../../utils/api');
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-art-bg" aria-hidden="true" />
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Image src="/images/logo icone.jpeg" alt="Collection Aurart" width={40} height={40} className="logo-img" />
          </div>
          <span className="logo-text">Collection Aur&apos;Art</span>
        </div>
        <span className="admin-badge">Admin</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || router.pathname === item.path;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                router.push(item.path);
                if (onNavigate) onNavigate(item.id);
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}

        <div className="nav-divider"></div>

        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </nav>

      <style jsx>{`
        .admin-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          background: linear-gradient(180deg, #212E50 0%, #2a3a62 50%, #212E50 100%);
          border-right: 1px solid rgba(199, 161, 30, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow: hidden;
        }

        .sidebar-art-bg {
          position: absolute;
          inset: 0;
          background: url('/images/Histoire des arts.png') center bottom / cover no-repeat;
          opacity: 0.08;
          pointer-events: none;
        }

        .sidebar-header {
          position: relative;
          z-index: 1;
          padding: 24px 20px;
          border-bottom: 1px solid rgba(199, 161, 30, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 248, 240, 0.1);
          border: 1px solid rgba(199, 161, 30, 0.3);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          color: #F8F8F0;
          font-weight: 700;
          font-size: 15px;
        }

        .admin-badge {
          padding: 4px 12px;
          background: rgba(124, 42, 60, 0.4);
          color: #F1B2C8;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: rgba(248, 248, 240, 0.75);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(108, 129, 87, 0.15);
          color: #F8F8F0;
        }

        .nav-item.active {
          background: rgba(124, 42, 60, 0.25);
          color: #F1B2C8;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          background: linear-gradient(180deg, #C7A11E, #7C2A3C);
          border-radius: 0 4px 4px 0;
        }

        .nav-badge {
          margin-left: auto;
          background: #7C2A3C;
          color: #F1B2C8;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }

        .nav-divider {
          height: 1px;
          background: rgba(199, 161, 30, 0.2);
          margin: 12px 0;
        }

        .nav-item.logout {
          color: #F1B2C8;
          margin-top: auto;
        }

        .nav-item.logout:hover {
          background: rgba(124, 42, 60, 0.2);
        }

        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
