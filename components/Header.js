// frontend/components/Header.js
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header({ settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const siteName = settings.site_name || 'Le Gourmet Parisien';
  const restaurantStatus = settings.restaurant_status || 'open';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Détecter la taille d'écran côté client uniquement
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Initialiser
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Empêcher le scroll quand le menu est ouvert
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: menuOpen ? 998 : 1000, // Passer derrière le menu mobile quand ouvert
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.08)' : 'none'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link href="/" onClick={closeMenu} style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            zIndex: menuOpen ? 998 : 1001, // Passer derrière le menu mobile quand ouvert
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: scrolled ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.8em',
                boxShadow: scrolled ? '0 4px 12px rgba(231, 76, 60, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                backdropFilter: !scrolled ? 'blur(10px)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                🍽️
              </div>
              <span style={{
                fontSize: '1.5em',
                fontWeight: 800,
                color: scrolled ? '#e74c3c' : 'white',
                letterSpacing: '-0.5px',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {siteName}
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          {!isMobile && (
            <nav style={{
              display: 'flex',
              gap: '8px'
            }}>
              <Link href="/" style={{
                textDecoration: 'none',
                color: scrolled ? '#2c3e50' : 'white',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '0.95em',
                background: router.pathname === '/' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                borderBottom: router.pathname === '/' ? '2px solid #e74c3c' : '2px solid transparent',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                Accueil
              </Link>
              <Link href="/categories" style={{
                textDecoration: 'none',
                color: scrolled ? '#2c3e50' : 'white',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '0.95em',
                background: router.pathname === '/categories' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                borderBottom: router.pathname === '/categories' ? '2px solid #e74c3c' : '2px solid transparent',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                Carte
              </Link>
              <Link href="/menus" style={{
                textDecoration: 'none',
                color: scrolled ? '#2c3e50' : 'white',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '0.95em',
                background: router.pathname === '/menus' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                borderBottom: router.pathname === '/menus' ? '2px solid #e74c3c' : '2px solid transparent',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                Menus
              </Link>
              <Link href="/reservation" style={{
                textDecoration: 'none',
                color: scrolled ? '#2c3e50' : 'white',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '0.95em',
                background: router.pathname === '/reservation' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                borderBottom: router.pathname === '/reservation' ? '2px solid #e74c3c' : '2px solid transparent',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                Réserver
              </Link>
              {isLoggedIn && (
                <Link href="/favorites" style={{
                  textDecoration: 'none',
                  color: scrolled ? '#2c3e50' : 'white',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95em',
                  background: router.pathname === '/favorites' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                  borderBottom: router.pathname === '/favorites' ? '2px solid #e74c3c' : '2px solid transparent',
                  textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
                }}>
                  Favoris
                </Link>
              )}
              <Link href="/contact" style={{
                textDecoration: 'none',
                color: scrolled ? '#2c3e50' : 'white',
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                fontSize: '0.95em',
                background: router.pathname === '/contact' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                borderBottom: router.pathname === '/contact' ? '2px solid #e74c3c' : '2px solid transparent',
                textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
              }}>
                Contact
              </Link>
              {isLoggedIn && (
                <Link href="/dashboard" style={{
                  textDecoration: 'none',
                  color: scrolled ? '#2c3e50' : 'white',
                  fontWeight: 600,
                  padding: '10px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  fontSize: '0.95em',
                  background: router.pathname === '/dashboard' ? (scrolled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(255, 255, 255, 0.2)') : 'transparent',
                  borderBottom: router.pathname === '/dashboard' ? '2px solid #e74c3c' : '2px solid transparent',
                  textShadow: !scrolled ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
                }}>
                  Dashboard
                </Link>
              )}
            </nav>
          )}

          {/* Menu Mobile Overlay */}
          {menuOpen && (
            <div onClick={closeMenu} style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1001, // Au-dessus du header
              animation: 'fadeIn 0.3s ease'
            }} />
          )}

          {/* Menu Mobile Sidebar */}
          {isMobile && (
            <div style={{
              position: 'fixed',
              top: 0,
              right: menuOpen ? 0 : '-100%',
              width: '100%',
              maxWidth: '400px',
              height: '100vh',
              background: 'white',
              transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1002, // Au-dessus de tout (overlay + header)
              display: 'flex',
              flexDirection: 'column',
              padding: '30px',
              overflowY: 'auto',
              boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Header Mobile Menu */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <span style={{
                  fontSize: '1.5em',
                  fontWeight: 800,
                  color: '#e74c3c'
                }}>
                  Menu
                </span>
                <button onClick={closeMenu} style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#f8f9fa',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  ✕
                </button>
              </div>

              {/* Links Mobile */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/" onClick={closeMenu} style={{
                  textDecoration: 'none',
                  padding: '16px 20px',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  background: router.pathname === '/' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.3em' }}>🏠</span>
                  Accueil
                </Link>
                <Link href="/categories" onClick={closeMenu} style={{
                  textDecoration: 'none',
                  padding: '16px 20px',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  background: router.pathname === '/categories' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.3em' }}>📋</span>
                  Carte
                </Link>
                <Link href="/menus" onClick={closeMenu} style={{
                  textDecoration: 'none',
                  padding: '16px 20px',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  background: router.pathname === '/menus' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.3em' }}>🍽️</span>
                  Menus
                </Link>
                <Link href="/reservation" onClick={closeMenu} style={{
                  textDecoration: 'none',
                  padding: '16px 20px',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  background: router.pathname === '/reservation' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.3em' }}>📅</span>
                  Réserver
                </Link>
                {isLoggedIn && (
                  <Link href="/favorites" onClick={closeMenu} style={{
                    textDecoration: 'none',
                    padding: '16px 20px',
                    color: '#2c3e50',
                    fontSize: '1.1em',
                    borderRadius: '12px',
                    background: router.pathname === '/favorites' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '1.3em' }}>❤️</span>
                    Favoris
                  </Link>
                )}
                <Link href="/contact" onClick={closeMenu} style={{
                  textDecoration: 'none',
                  padding: '16px 20px',
                  color: '#2c3e50',
                  fontSize: '1.1em',
                  borderRadius: '12px',
                  background: router.pathname === '/contact' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: '1.3em' }}>📞</span>
                  Contact
                </Link>
                {isLoggedIn && (
                  <Link href="/dashboard" onClick={closeMenu} style={{
                    textDecoration: 'none',
                    padding: '16px 20px',
                    color: '#2c3e50',
                    fontSize: '1.1em',
                    borderRadius: '12px',
                    background: router.pathname === '/dashboard' ? 'rgba(231, 76, 60, 0.1)' : 'transparent',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ fontSize: '1.3em' }}>📊</span>
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Footer Mobile */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '2px solid #f0f0f0',
                marginTop: 'auto'
              }}>
                <div style={{
                  padding: '12px 20px',
                  borderRadius: '24px',
                  background: restaurantStatus === 'open' ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                  color: restaurantStatus === 'open' ? '#155724' : '#721c24',
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: restaurantStatus === 'open' ? '#28a745' : '#dc3545',
                    animation: 'pulse 2s infinite'
                  }}></span>
                  {restaurantStatus === 'open' ? 'Ouvert' : 'Fermé'}
                </div>
                {isLoggedIn ? (
                  <button onClick={handleLogout} style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <span>🚪</span> Déconnexion
                  </button>
                ) : (
                  <Link href="/login" onClick={closeMenu} style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                    color: 'white',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <span>👤</span> Connexion
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Actions Desktop */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {!isMobile && (
              <div style={{
                padding: '10px 20px',
                borderRadius: '24px',
                fontWeight: 600,
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: restaurantStatus === 'open' ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' : 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                color: restaurantStatus === 'open' ? '#155724' : '#721c24',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: restaurantStatus === 'open' ? '#28a745' : '#dc3545',
                  animation: 'pulse 2s infinite'
                }}></span>
                {restaurantStatus === 'open' ? 'Ouvert' : 'Fermé'}
              </div>
            )}

            {!isMobile && isLoggedIn && (
              <button onClick={handleLogout} style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                border: 'none',
                fontSize: '1.3em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                🚪
              </button>
            )}

            {!isMobile && !isLoggedIn && (
              <Link href="/login" style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                fontSize: '1.3em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}>
                👤
              </Link>
            )}

            {/* Hamburger Menu (Mobile Only) */}
            {isMobile && (
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px',
                zIndex: 1003 // Au-dessus du menu pour rester cliquable
              }}>
                <span style={{
                  width: '28px',
                  height: '3px',
                  background: scrolled ? '#2c3e50' : 'white',
                  borderRadius: '3px',
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(45deg) translate(9px, 9px)' : 'none'
                }}></span>
                <span style={{
                  width: '28px',
                  height: '3px',
                  background: scrolled ? '#2c3e50' : 'white',
                  borderRadius: '3px',
                  transition: 'all 0.3s ease',
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? 'translateX(20px)' : 'none'
                }}></span>
                <span style={{
                  width: '28px',
                  height: '3px',
                  background: scrolled ? '#2c3e50' : 'white',
                  borderRadius: '3px',
                  transition: 'all 0.3s ease',
                  transform: menuOpen ? 'rotate(-45deg) translate(9px, -9px)' : 'none'
                }}></span>
              </button>
            )}
          </div>
        </div>
      </header>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}