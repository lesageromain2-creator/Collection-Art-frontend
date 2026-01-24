// frontend/components/Header.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/offres', label: 'Offres' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'Présentation' },
  { href: '/mes-messages', label: 'Messagerie' },
  { href: '/contact', label: 'Contact' },
];

export default function Header({ settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const siteName = settings.site_name || 'LE SAGE';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
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
        scrolled ? 'backdrop-blur-xl bg-slate-950/80 border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link 
          href="/"
          className="flex items-center gap-3"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40">
              <span className="text-lg font-black text-white">LS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold tracking-tight text-white md:text-base">
              {siteName}
            </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Création de sites web sur-mesure
              </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative transition-colors ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-secondary to-primary" />
              )}
            </Link>
          ))}
          <div className="ml-4 flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link 
                    href="/admin"
                    className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/20"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/dashboard"
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/10"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/10"
              >
                Espace client
              </Link>
            )}
          </div>
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-slate-950/60 text-slate-100 shadow-md transition hover:bg-slate-900 md:hidden"
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
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-40 w-[78%] max-w-xs transform bg-slate-950/95 px-5 py-6 shadow-2xl transition-transform md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <span className="text-sm font-black text-white">LS</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {siteName}
            </span>
          </div>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-200 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 text-sm font-medium text-slate-100">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-2.5 ${
                isActive(item.href)
                  ? 'bg-white/10 text-white'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-4 text-sm">
          {isLoggedIn ? (
            <div className="space-y-3">
              {userRole === 'admin' && (
                <Link 
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-center font-semibold text-orange-400 hover:bg-orange-500/20"
                >
                  Espace Admin
                </Link>
              )}
              <Link 
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full border border-white/15 bg-white/5 px-4 py-2 text-center font-semibold text-slate-100 hover:bg-white/10"
              >
                Accéder au dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-center font-semibold text-white shadow-md hover:shadow-lg"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-primary px-4 py-2 text-center font-semibold text-white shadow-md hover:bg-primary/90"
            >
              Espace client
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}