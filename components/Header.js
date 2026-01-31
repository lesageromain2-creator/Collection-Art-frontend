// frontend/components/Header.js
// Bannière du site avec logo icône (palette Collection Aur'art)

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
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-creme/95 border-b border-navy/10 shadow-sm'
          : 'bg-navy/95 backdrop-blur-md border-b border-creme/10'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full overflow-hidden bg-creme shadow-md ring-2 ring-navy/10">
            <Image
              src="/images/logo icone.jpeg"
              alt="Collection Aur'art"
              width={40}
              height={40}
              className="object-contain p-1"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-heading text-base font-semibold tracking-tight transition-colors group-hover:text-burgundy md:text-lg ${
                scrolled ? 'text-navy' : 'text-creme'
              }`}
            >
              {siteName}
            </span>
            <span
              className={`text-[9px] font-medium uppercase tracking-[0.2em] ${
                scrolled ? 'text-gris' : 'text-creme/80'
              }`}
            >
              Esquisses de l'Art & son marché
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative transition-colors ${
                isActive(item.href)
                  ? scrolled
                    ? 'text-navy font-semibold'
                    : 'text-creme font-semibold'
                  : scrolled
                  ? 'text-gris hover:text-navy'
                  : 'text-creme/90 hover:text-creme'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full ${
                    scrolled ? 'bg-primary-gradient' : 'bg-gold'
                  }`}
                />
              )}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-gold/20"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-full border border-navy/20 bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/10"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-primary-gradient px-3 py-1.5 text-xs font-semibold text-creme shadow-md hover:shadow-lg transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-navy hover:bg-gold/20 transition-all"
              >
                Connexion
              </Link>
            )}
          </div>
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition md:hidden ${
            scrolled
              ? 'border-navy/15 bg-white text-navy hover:bg-navy/5'
              : 'border-creme/30 bg-creme/10 text-creme hover:bg-creme/20'
          }`}
        >
          <span
            className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform ${
              menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`absolute h-0.5 w-4 rounded-full bg-current transition-opacity ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-4 rounded-full bg-current transition-transform ${
              menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-40 w-[78%] max-w-xs transform bg-creme px-5 py-6 shadow-2xl transition-transform md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden bg-navy/10 ring-2 ring-navy/10">
              <Image
                src="/images/logo icone.jpeg"
                alt=""
                width={36}
                height={36}
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-semibold text-navy">{siteName}</span>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/5 text-navy hover:bg-navy/10"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-2.5 transition-colors ${
                isActive(item.href)
                  ? 'bg-burgundy/10 text-burgundy font-semibold'
                  : 'text-gris hover:bg-navy/5 hover:text-navy'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-navy/10 pt-4 text-sm">
          {isLoggedIn ? (
            <div className="space-y-3">
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-center font-semibold text-navy hover:bg-gold/20"
                >
                  Espace Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-navy/15 bg-navy/5 px-4 py-2 text-center font-semibold text-navy hover:bg-navy/10"
              >
                Accéder au dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-full bg-primary-gradient px-4 py-2 text-center font-semibold text-creme shadow-md hover:shadow-lg"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-primary-gradient px-4 py-2 text-center font-semibold text-creme shadow-md hover:shadow-lg"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
