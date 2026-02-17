// Header – Logo, titre, menu. Fond bordeaux (palette). Menu mobile crème.

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/rubriques', label: 'Rubriques' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

const RUBRIQUES = [
  { id: 'histoire-arts', title: 'Histoire des arts' },
  { id: 'fil-oeuvres', title: 'Au fil des œuvres' },
  { id: 'art-contemporain', title: 'Art contemporain' },
  { id: 'tribunal-arts', title: 'Tribunal des arts' },
  { id: 'marche-art', title: "Marché de l'art" },
];

const SITE_NAME = "Collection Aur'art";

// Couleurs extraites des images dans frontend/public/new images/
// vert banderole au dessus du header.jpeg → vert profond
// rose header.jpeg → rose clair
const BANDEAU_COLOR = '#4a6b3a';
const HEADER_COLOR = '#E8C8D4';
const LOGO_IMG = '/new images/Logo final (1).png';

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
      <div className="hdr-full">
        <div className="hdr-bandeau" aria-hidden>
          Magazine mensuel d&apos;art
        </div>
        <header className="hdr" role="banner">
          <Link href="/" className="hdr-brand" aria-label="Accueil Collection Aur'art">

          
            <span className="hdr-logo-wrap">
              <img src={LOGO_IMG} alt="" className="hdr-logo-img" />
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
              <Link href="/articles" className="hdr-icon-link" aria-label="Rechercher / Articles">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </Link>
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' && (
                    <Link href="/admin" className="hdr-link">Admin</Link>
                  )}
                  <Link href="/dashboard" className="hdr-link">Dashboard</Link>
                  <button type="button" onClick={handleLogout} className="hdr-link hdr-link-btn">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/login" className="hdr-icon-link" aria-label="Connexion">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </Link>
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
        </header>
      </div>

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
            <div className="hdr-drawer-rubriques">
              <span className="hdr-drawer-rubriques-title">Rubriques</span>
              {RUBRIQUES.map((r) => (
                <Link
                  key={r.id}
                  href={`/rubriques/${r.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`hdr-drawer-link hdr-drawer-link--sub ${isActive(`/rubriques/${r.id}`) ? 'hdr-drawer-link--active' : ''}`}
                >
                  {r.title}
                </Link>
              ))}
              <Link
                href="/rubriques"
                onClick={() => setMenuOpen(false)}
                className="hdr-drawer-link hdr-drawer-link--all"
              >
                Toutes les rubriques
              </Link>
            </div>
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

      <style jsx global>{`
        .hdr a.hdr-link,
        .hdr a.hdr-link:visited,
        .hdr a.hdr-link:focus,
        .hdr .hdr-nav a.hdr-link {
          color: #4a6b3a !important;
          -webkit-text-fill-color: #4a6b3a !important;
          font-family: 'Times New Roman', Times, Georgia, serif !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.18em !important;
        }
      `}</style>
      <style jsx>{`
        .hdr-full {
          width: 100%;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 14px rgba(74, 107, 58, 0.08);
        }
        .hdr-bandeau {
          width: 100%;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${BANDEAU_COLOR};
          color: #fff;
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .hdr {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 1rem;
          min-height: 52px;
          background: ${HEADER_COLOR};
          color: #2d1f2d;
          box-shadow: 0 2px 12px rgba(45,31,45,0.1);
        }
        @media (min-width: 768px) {
          .hdr {
            padding: 0.6rem 1.25rem;
            min-height: 56px;
          }
        }
        .hdr-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex: 1;
          min-width: 0;
        }
        @media (min-width: 1024px) {
          .hdr-nav {
            gap: 3rem;
          }
        }

        .hdr-brand {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          margin: 0;
          border-radius: 8px;
          transition: opacity 0.25s;
          flex-shrink: 0;
        }
        .hdr-brand:hover {
          opacity: 0.9;
        }
        .hdr-logo-wrap {
          display: block;
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          overflow: hidden;
          padding: 0.25rem;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .hdr-logo-wrap {
            width: 64px;
            height: 64px;
            padding: 0.35rem;
          }
        }
        .hdr-logo-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }
        .hdr-site-name {
          flex-shrink: 0;
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: ${BANDEAU_COLOR};
          -webkit-text-fill-color: ${BANDEAU_COLOR};
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .hdr-site-name {
            font-size: 1.6rem;
          }
        }

        .hdr-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .hdr-nav {
            display: flex;
          }
        }
        .hdr-link {
          font-family: 'Times New Roman', Times, Georgia, serif !important;
          font-size: 1rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.18em;
          text-decoration: none !important;
          padding: 0.5rem 0.6rem;
          margin: 0;
          border-radius: 8px;
          transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      letter-spacing 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      background 0.35s ease,
                      opacity 0.35s ease;
          font-weight: 700;
          position: relative;
        }
        .hdr-link,
        .hdr-link:visited,
        .hdr-link:focus {
          color: #4a6b3a !important;
          -webkit-text-fill-color: #4a6b3a !important;
        }
        .hdr-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #4a6b3a 0%, #3a5a2e 100%);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hdr-link:hover {
          color: #3a5a2e !important;
          -webkit-text-fill-color: #3a5a2e !important;
          letter-spacing: 0.22em;
          background: rgba(255,255,255,0.35);
        }
        .hdr-link:hover::after {
          width: 100%;
        }
        .hdr-link--active,
        .hdr-link--active:visited {
          font-weight: 700;
          color: #3a5a2e !important;
          -webkit-text-fill-color: #3a5a2e !important;
        }
        .hdr-link--active::after {
          width: 100% !important;
          left: 0 !important;
          height: 2px;
          background: linear-gradient(90deg, #4a6b3a 0%, #3a5a2e 100%);
        }
        .hdr-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: ${BANDEAU_COLOR};
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .hdr-icon-link:hover {
          color: #3a5a2e;
          background: rgba(255,255,255,0.5);
        }
        .hdr-link-btn {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
        }
        .hdr-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-left: 2rem;
          flex-shrink: 0;
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
          background: rgba(249,246,240,0.08);
          color: #F9F6F0;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hdr-burger:hover {
          background: linear-gradient(135deg, rgba(249,246,240,0.12) 0%, rgba(108,129,87,0.06) 100%);
          transform: scale(1.05);
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
          position: relative;
          overflow: hidden;
          transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hdr-drawer-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #4a6b3a, #7C2A3C);
          transform: scaleY(0);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0 2px 2px 0;
        }
        .hdr-drawer-link:hover {
          background: rgba(33,46,80,0.06);
          padding-left: 1.375rem;
        }
        .hdr-drawer-link:hover::before {
          transform: scaleY(1);
        }
        .hdr-drawer-link--active {
          background: rgba(124,42,60,0.12);
          color: #7C2A3C;
          font-weight: 600;
        }
        .hdr-drawer-rubriques {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(33,46,80,0.12);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .hdr-drawer-rubriques-title {
          padding: 0.5rem 1.125rem 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1A2B64;
        }
        .hdr-drawer-link--sub {
          padding: 0.65rem 1.125rem 0.65rem 1.75rem;
          font-size: 1rem;
        }
        .hdr-drawer-link--all {
          margin-top: 0.25rem;
          font-weight: 600;
          color: #1A2B64;
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
