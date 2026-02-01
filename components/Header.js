// frontend/components/Header.js
// Bannière moderne – fonds opaques, menu déroulant lisible

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/rubriques', label: 'Rubriques' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'Notre équipe' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const siteName = settings.site_name || "Collection Aur'art";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    if (token) {
      checkUserRole();
    }
  }, []);

  const checkUserRole = async () => {
    try {
      const { checkAuth } = await import('../utils/api');
      const authData = await checkAuth();
      if (authData.authenticated && authData.user) {
        setUserRole(authData.user.role);
      }
    } catch (error) {
      console.error('Erreur vérification rôle:', error);
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
  };

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`header-bar ${scrolled ? 'header-bar--scrolled' : ''}`}
        role="banner"
      >
        <div className="header-inner">
          <Link href="/" className="header-logo">
            <span className="header-logo-icon">
              <Image
                src="/images/logo icone.jpeg"
                alt=""
                width={40}
                height={40}
                className="header-logo-img"
              />
            </span>
            <span className="header-logo-text">
              <span className="header-logo-title">{siteName}</span>
              <span className="header-logo-subtitle">Esquisses de l&apos;Art & son marché</span>
            </span>
          </Link>

          <nav className="header-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header-nav-link ${isActive(item.href) ? 'header-nav-link--active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="header-nav-actions">
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className="header-btn header-btn--admin">
                      Admin
                    </Link>
                  )}
                  <Link href="/dashboard" className="header-btn header-btn--dashboard">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="header-btn header-btn--logout"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" className="header-btn header-btn--login">
                  Connexion
                </Link>
              )}
            </div>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`header-burger ${menuOpen ? 'header-burger--open' : ''}`}
          >
            <span className="header-burger-line" />
            <span className="header-burger-line" />
            <span className="header-burger-line" />
          </button>
        </div>
        <div className="header-accent" aria-hidden="true" />
      </header>

      {/* Overlay du menu mobile – fond opaque */}
      {menuOpen && (
        <div
          className="header-overlay"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
        />
      )}

      {/* Panneau menu mobile – fond opaque, bien lisible */}
      <aside
        className={`header-drawer ${menuOpen ? 'header-drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="header-drawer-inner">
          <div className="header-drawer-head">
            <div className="header-drawer-logo">
              <span className="header-drawer-logo-icon">
                <Image
                  src="/images/logo icone.jpeg"
                  alt=""
                  width={36}
                  height={36}
                  className="header-drawer-logo-img"
                />
              </span>
              <span className="header-drawer-logo-title">{siteName}</span>
            </div>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={() => setMenuOpen(false)}
              className="header-drawer-close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="header-drawer-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`header-drawer-link ${isActive(item.href) ? 'header-drawer-link--active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-drawer-footer">
            {isLoggedIn ? (
              <div className="header-drawer-actions">
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="header-drawer-btn header-drawer-btn--secondary"
                  >
                    Espace Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="header-drawer-btn header-drawer-btn--secondary"
                >
                  Accéder au dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="header-drawer-btn header-drawer-btn--primary"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="header-drawer-btn header-drawer-btn--primary"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .header-bar {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          background: #212E50;
          border-bottom: 3px solid #C7A11E;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          transition: background 0.25s ease, box-shadow 0.25s ease;
        }
        .header-bar--scrolled {
          background: #F8F8F0;
          border-bottom-color: rgba(33, 46, 80, 0.12);
          box-shadow: 0 4px 20px rgba(33, 46, 80, 0.08);
        }
        .header-accent {
          position: absolute;
          bottom: -3px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #C7A11E, #7C2A3C);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .header-bar--scrolled .header-accent {
          opacity: 1;
        }

        .header-inner {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .header-inner {
            padding: 0.875rem 1.5rem;
          }
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
        }
        .header-logo-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          background: #F8F8F0;
          border: 2px solid rgba(199, 161, 30, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .header-bar--scrolled .header-logo-icon {
          border-color: rgba(33, 46, 80, 0.2);
        }
        .header-logo-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
          padding: 4px;
        }
        .header-logo-text {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .header-logo-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1rem;
          font-weight: 600;
          color: #F8F8F0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .header-bar--scrolled .header-logo-title {
          color: #212E50;
        }
        .header-logo-subtitle {
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(248, 248, 240, 0.85);
        }
        .header-bar--scrolled .header-logo-subtitle {
          color: #5A5A5A;
        }

        .header-nav {
          display: none;
          align-items: center;
          gap: 1.75rem;
          font-size: 0.9375rem;
          font-weight: 500;
        }
        @media (min-width: 768px) {
          .header-nav {
            display: flex;
          }
        }
        .header-nav-link {
          color: rgba(248, 248, 240, 0.95);
          text-decoration: none;
          padding: 0.35rem 0;
          position: relative;
          transition: color 0.2s ease;
        }
        .header-nav-link:hover {
          color: #F8F8F0;
        }
        .header-bar--scrolled .header-nav-link {
          color: #5A5A5A;
        }
        .header-bar--scrolled .header-nav-link:hover {
          color: #212E50;
        }
        .header-nav-link--active {
          color: #F8F8F0;
          font-weight: 600;
        }
        .header-bar--scrolled .header-nav-link--active {
          color: #212E50;
        }
        .header-nav-link--active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          background: #C7A11E;
        }
        .header-bar--scrolled .header-nav-link--active::after {
          background: linear-gradient(90deg, #7C2A3C, #212E50);
        }
        .header-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
        }
        .header-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.375rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 9999px;
          text-decoration: none;
          border: 1px solid transparent;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .header-btn--admin {
          border-color: rgba(199, 161, 30, 0.6);
          background: rgba(199, 161, 30, 0.15);
          color: #212E50;
        }
        .header-btn--admin:hover {
          background: rgba(199, 161, 30, 0.25);
        }
        .header-bar--scrolled .header-btn--admin {
          color: #212E50;
        }
        .header-btn--dashboard {
          border-color: rgba(248, 248, 240, 0.35);
          background: rgba(248, 248, 240, 0.1);
          color: #F8F8F0;
        }
        .header-btn--dashboard:hover {
          background: rgba(248, 248, 240, 0.2);
        }
        .header-bar--scrolled .header-btn--dashboard {
          border-color: rgba(33, 46, 80, 0.2);
          background: rgba(33, 46, 80, 0.06);
          color: #212E50;
        }
        .header-bar--scrolled .header-btn--dashboard:hover {
          background: rgba(33, 46, 80, 0.12);
        }
        .header-btn--logout,
        .header-btn--login {
          background: linear-gradient(135deg, #7C2A3C 0%, #212E50 100%);
          color: #F8F8F0;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .header-btn--logout:hover,
        .header-btn--login:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          filter: brightness(1.05);
        }
        .header-bar--scrolled .header-btn--logout,
        .header-bar--scrolled .header-btn--login {
          background: linear-gradient(135deg, #7C2A3C 0%, #212E50 100%);
          color: #F8F8F0;
        }

        .header-burger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 44px;
          height: 44px;
          padding: 0;
          border: none;
          border-radius: 12px;
          background: rgba(248, 248, 240, 0.12);
          color: #F8F8F0;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .header-bar--scrolled .header-burger {
          background: rgba(33, 46, 80, 0.08);
          color: #212E50;
        }
        .header-burger:hover {
          background: rgba(248, 248, 240, 0.2);
        }
        .header-bar--scrolled .header-burger:hover {
          background: rgba(33, 46, 80, 0.14);
        }
        @media (min-width: 768px) {
          .header-burger {
            display: none;
          }
        }
        .header-burger-line {
          display: block;
          width: 20px;
          height: 2px;
          border-radius: 2px;
          background: currentColor;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .header-burger--open .header-burger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .header-burger--open .header-burger-line:nth-child(2) {
          opacity: 0;
        }
        .header-burger--open .header-burger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .header-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(33, 46, 80, 0.85);
          backdrop-filter: none;
          animation: headerOverlayIn 0.2s ease-out;
        }
        @media (min-width: 768px) {
          .header-overlay {
            display: none;
          }
        }
        @keyframes headerOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .header-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 88%;
          max-width: 320px;
          z-index: 70;
          background: #F8F8F0;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
        }
        .header-drawer--open {
          transform: translateX(0);
        }
        @media (min-width: 768px) {
          .header-drawer {
            display: none;
          }
        }
        .header-drawer-inner {
          padding: 1.5rem 1.25rem;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        .header-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .header-drawer-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-drawer-logo-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          background: #212E50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-drawer-logo-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
          padding: 4px;
        }
        .header-drawer-logo-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #212E50;
        }
        .header-drawer-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          background: rgba(33, 46, 80, 0.08);
          color: #212E50;
          cursor: pointer;
          transition: background 0.2s;
        }
        .header-drawer-close:hover {
          background: rgba(33, 46, 80, 0.14);
        }
        .header-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .header-drawer-link {
          display: block;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: #5A5A5A;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s, color 0.2s;
        }
        .header-drawer-link:hover {
          background: rgba(33, 46, 80, 0.06);
          color: #212E50;
        }
        .header-drawer-link--active {
          background: rgba(124, 42, 60, 0.1);
          color: #7C2A3C;
          font-weight: 600;
        }
        .header-drawer-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(33, 46, 80, 0.1);
        }
        .header-drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .header-drawer-btn {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          font-weight: 600;
          text-align: center;
          border-radius: 12px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .header-drawer-btn--primary {
          background: linear-gradient(135deg, #7C2A3C 0%, #212E50 100%);
          color: #F8F8F0;
          box-shadow: 0 4px 12px rgba(33, 46, 80, 0.25);
        }
        .header-drawer-btn--primary:hover {
          box-shadow: 0 6px 16px rgba(33, 46, 80, 0.3);
          filter: brightness(1.05);
        }
        .header-drawer-btn--secondary {
          background: rgba(33, 46, 80, 0.06);
          color: #212E50;
          border: 1px solid rgba(33, 46, 80, 0.15);
        }
        .header-drawer-btn--secondary:hover {
          background: rgba(33, 46, 80, 0.1);
        }
      `}</style>
    </>
  );
}
