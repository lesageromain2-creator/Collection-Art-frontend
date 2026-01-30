// frontend/components/Header.js
import Link from 'next/link';
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

  const siteName = settings.site_name || 'Collection Aur\'art';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    // Récupérer le rôle de l'utilisateur si connecté
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
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled ? 'backdrop-blur-xl bg-creme/95 border-b border-anthracite/10 shadow-sm' : 'bg-creme/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link 
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-gradient shadow-md">
            <span className="text-lg font-bold text-white font-serif">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-base font-semibold tracking-tight text-anthracite md:text-lg transition-colors group-hover:text-framboise">
              {siteName}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gris">
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
                  ? 'text-anthracite font-semibold'
                  : 'text-gris hover:text-anthracite'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-primary-gradient" />
              )}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link 
                    href="/admin"
                    className="rounded-full border border-orange/30 bg-orange/10 px-3 py-1.5 text-xs font-semibold text-orange hover:bg-orange/20"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  className="rounded-full border border-anthracite/20 bg-anthracite/5 px-3 py-1.5 text-xs font-semibold text-anthracite hover:bg-anthracite/10"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-primary-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="rounded-full border border-framboise/30 bg-framboise/10 px-4 py-1.5 text-xs font-semibold text-framboise hover:bg-framboise/20 transition-all"
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
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-anthracite/15 bg-white text-anthracite shadow-sm transition hover:bg-anthracite/5 md:hidden"
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
        <div className="fixed inset-0 z-30 bg-anthracite/30 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-40 w-[78%] max-w-xs transform bg-creme px-5 py-6 shadow-2xl transition-transform md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-gradient">
              <span className="text-sm font-bold text-white font-serif">A</span>
            </div>
            <span className="text-sm font-semibold text-anthracite">
              {siteName}
            </span>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-anthracite/5 text-anthracite hover:bg-anthracite/10"
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
                  ? 'bg-framboise/10 text-framboise font-semibold'
                  : 'text-gris hover:bg-anthracite/5 hover:text-anthracite'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-anthracite/10 pt-4 text-sm">
          {isLoggedIn ? (
            <div className="space-y-3">
              {userRole === 'admin' && (
                <Link 
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full border border-orange/30 bg-orange/10 px-4 py-2 text-center font-semibold text-orange hover:bg-orange/20"
                >
                  Espace Admin
                </Link>
              )}
              <Link 
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-anthracite/15 bg-anthracite/5 px-4 py-2 text-center font-semibold text-anthracite hover:bg-anthracite/10"
              >
                Accéder au dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-full bg-primary-gradient px-4 py-2 text-center font-semibold text-white shadow-md hover:shadow-lg"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-primary-gradient px-4 py-2 text-center font-semibold text-white shadow-md hover:shadow-lg"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}