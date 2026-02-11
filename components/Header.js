// Header – Logo, titre, menu. Fond bordeaux (palette). Menu mobile crème.

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/rubriques', label: 'Rubriques' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'Notre équipe' },
  { href: '/contact', label: 'Contact' },
];

const SITE_NAME = "Collection Aur'art";

export default function Header({ settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

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
      if (authData?.authenticated && authData?.user) {
        setUserRole(authData.user.role);
      }
    } catch (e) {
      console.error('Erreur vérification rôle:', e);
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
  };

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <>
      {/* Bandeau identité : 5 couleurs exactes crème, olive, bordeaux, or, navy */}
      <div className="hdr-palette" aria-hidden />
      <header className="hdr" role="banner">
        <div className="hdr-inner">
          <Link href="/" className="hdr-logo-link">
            <span className="hdr-brand">
              <span className="hdr-title">{SITE_NAME}</span>
              <span className="hdr-subtitle">Esquisses de l&apos;Art & son marché</span>
            </span>
          </Link>

          <nav className="hdr-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hdr-link ${isActive(item.href) ? 'hdr-link--active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <div className="hdr-actions">
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className="hdr-btn hdr-btn--admin">Admin</Link>
                  )}
                  <Link href="/dashboard" className="hdr-btn hdr-btn--dash">Dashboard</Link>
                  <button type="button" onClick={handleLogout} className="hdr-btn hdr-btn--out">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" className="hdr-btn hdr-btn--in">Connexion</Link>
              )}
            </div>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`hdr-burger ${menuOpen ? 'hdr-burger--open' : ''}`}
          >
            <span className="hdr-burger-line" />
            <span className="hdr-burger-line" />
            <span className="hdr-burger-line" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="hdr-overlay"
          onClick={() => setMenuOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Fermer"
        />
      )}

      <aside className={`hdr-drawer ${menuOpen ? 'hdr-drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="hdr-drawer-inner">
          <div className="hdr-drawer-head">
            <div className="hdr-drawer-brand">
              <span className="hdr-drawer-title">{SITE_NAME}</span>
            </div>
            <button type="button" aria-label="Fermer" onClick={() => setMenuOpen(false)} className="hdr-drawer-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="hdr-drawer-nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`hdr-drawer-link ${isActive(item.href) ? 'hdr-drawer-link--active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hdr-drawer-footer">
            {isLoggedIn ? (
              <div className="hdr-drawer-actions">
                {userRole === 'admin' && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="hdr-drawer-btn hdr-drawer-btn--sec">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hdr-drawer-btn hdr-drawer-btn--sec">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="hdr-drawer-btn hdr-drawer-btn--pri">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="hdr-drawer-btn hdr-drawer-btn--pri">
                Connexion
              </Link>
            )}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .hdr-palette {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 51;
          height: 5px;
          background: linear-gradient(90deg, #F9F6F0 0%, #F9F6F0 20%, #6C8157 20%, #6C8157 40%, #7C2A3C 40%, #7C2A3C 60%, #C7A11E 60%, #C7A11E 80%, #212E50 80%, #212E50 100%);
        }
        .hdr {
          position: fixed;
          top: 5px;
          left: 0;
          right: 0;
          z-index: 50;
          background: #1A2B64;
          color: #F9F6F0;
          box-shadow: 0 4px 24px rgba(26,43,100,0.3);
        }
        .hdr-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 1.25rem 1rem 1.25rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-height: 88px;
        }
        @media (min-width: 768px) {
          .hdr-inner {
            padding: 1.5rem 1.5rem 1.5rem 0.75rem;
            min-height: 104px;
          }
        }

        .hdr-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
          padding: 0.35rem 0.5rem;
          margin: -0.35rem -0.5rem;
          border-radius: 8px;
          transition: opacity 0.25s ease, transform 0.2s ease;
        }
        .hdr-logo-link:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .hdr-brand {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-align: left;
        }
        .hdr-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #F9F6F0;
          line-height: 1.2;
        }
        .hdr-subtitle {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(249,246,240,0.92);
        }
        @media (min-width: 768px) {
          .hdr-title {
            font-size: 1.4rem;
          }
          .hdr-subtitle {
            font-size: 12px;
          }
        }

        .hdr-nav {
          display: none;
          align-items: center;
          gap: 1.75rem;
          font-size: 1.0625rem;
          font-weight: 500;
        }
        @media (min-width: 1024px) {
          .hdr-nav {
            font-size: 1.125rem;
          }
        }
        @media (min-width: 768px) {
          .hdr-nav {
            display: flex;
          }
        }
        .hdr-link {
          color: #F9F6F0 !important;
          -webkit-text-fill-color: #F9F6F0 !important;
          text-decoration: none !important;
          padding: 0.4rem 0.6rem;
          margin: 0 -0.6rem;
          border-radius: 6px;
          transition: color 0.25s ease, background 0.25s ease, transform 0.2s ease;
          font-weight: 600;
          position: relative;
        }
        .hdr-link:hover {
          color: #F5C6D2 !important;
          -webkit-text-fill-color: #F5C6D2 !important;
          background: rgba(245, 198, 210, 0.25);
          transform: translateY(-1px);
        }
        .hdr-link--active {
          position: relative;
          font-weight: 700;
          color: #F5C6D2 !important;
          -webkit-text-fill-color: #F5C6D2 !important;
        }
        .hdr-link--active::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background: #F5C6D2;
          border-radius: 2px;
        }
        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
        }
        .hdr-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 9999px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .hdr-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .hdr-btn--admin {
          background: rgba(199,161,30,0.25);
          color: #F9F6F0;
          border: 1px solid #C7A11E;
        }
        .hdr-btn--dash {
          background: rgba(249,246,240,0.12);
          color: #F9F6F0;
          border: 1px solid rgba(249,246,240,0.35);
        }
        .hdr-btn--out,
        .hdr-btn--in {
          background: linear-gradient(135deg, #7C2A3C 0%, #212E50 100%);
          color: #F9F6F0 !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        }

        .hdr-burger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          width: 48px;
          height: 48px;
          padding: 0;
          border: none;
          border-radius: 12px;
          background: rgba(249,246,240,0.1);
          color: #F9F6F0;
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .hdr-burger {
            display: none;
          }
        }
        .hdr-burger-line {
          display: block;
          width: 22px;
          height: 2.5px;
          border-radius: 2px;
          background: currentColor;
          transition: transform 0.25s, opacity 0.25s;
        }
        .hdr-burger--open .hdr-burger-line:nth-child(1) {
          transform: translateY(8.5px) rotate(45deg);
        }
        .hdr-burger--open .hdr-burger-line:nth-child(2) {
          opacity: 0;
        }
        .hdr-burger--open .hdr-burger-line:nth-child(3) {
          transform: translateY(-8.5px) rotate(-45deg);
        }

        .hdr-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(124,42,60,0.75);
          backdrop-filter: blur(6px);
        }
        @media (min-width: 768px) {
          .hdr-overlay {
            display: none;
          }
        }

        .hdr-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 88%);
          z-index: 70;
          background: #F9F6F0;
          box-shadow: -8px 0 40px rgba(33,46,80,0.2);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
        }
        .hdr-drawer--open {
          transform: translateX(0);
        }
        @media (min-width: 768px) {
          .hdr-drawer {
            display: none;
          }
        }
        .hdr-drawer-inner {
          padding: 1.75rem 1.5rem;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        .hdr-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid transparent;
          border-image: linear-gradient(90deg, #6C8157, #7C2A3C, #C7A11E, #212E50) 1;
        }
        .hdr-drawer-brand {
          display: flex;
          align-items: center;
        }
        .hdr-drawer-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #212E50;
        }
        .hdr-drawer-close {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          background: rgba(33,46,80,0.08);
          color: #212E50;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .hdr-drawer-close:hover {
          background: #7C2A3C;
          color: #F9F6F0;
        }
        .hdr-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .hdr-drawer-link {
          display: block;
          padding: 1rem 1.125rem;
          font-size: 1.125rem;
          font-weight: 500;
          color: #212E50;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s, color 0.2s;
        }
        .hdr-drawer-link:hover {
          background: rgba(33,46,80,0.06);
        }
        .hdr-drawer-link--active {
          background: rgba(124,42,60,0.12);
          color: #7C2A3C;
          font-weight: 600;
        }
        .hdr-drawer-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 3px solid transparent;
          border-image: linear-gradient(90deg, #6C8157, #7C2A3C, #C7A11E, #212E50) 1;
        }
        .hdr-drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .hdr-drawer-btn {
          display: block;
          width: 100%;
          padding: 1rem 1.125rem;
          font-size: 1.0625rem;
          font-weight: 600;
          text-align: center;
          border-radius: 12px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hdr-drawer-btn--pri {
          background: linear-gradient(135deg, #7C2A3C 0%, #212E50 100%);
          color: #F9F6F0;
          box-shadow: 0 4px 12px rgba(33,46,80,0.25);
        }
        .hdr-drawer-btn--sec {
          background: rgba(33,46,80,0.06);
          color: #212E50;
          border: 1px solid #6C8157;
        }
      `}</style>
    </>
  );
}
