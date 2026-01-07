import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, fetchMenus, fetchMenuById } from '../utils/api';

export default function Menus() {
  const router = useRouter();

  const [settings, setSettings] = useState({});
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filterType, setFilterType] = useState('all');
  

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setMounted(true), 100);
    }
  }, [loading]);


  const loadData = async () => {
    try {
      const settingsData = await fetchSettings();
      setSettings(settingsData);

      const menusData = await fetchMenus();
      setMenus(menusData.menus || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

 const openMenuDetail = (menuId) => {
  router.push(`/menu/${menuId}`);
};

  

  const groupDishesByCourse = (dishes) => {
    const grouped = {};
    dishes.forEach(dish => {
      const courseType = dish.course_type || 'Autres';
      if (!grouped[courseType]) {
        grouped[courseType] = [];
      }
      grouped[courseType].push(dish);
    });
    return grouped;
  };

  const courseIcons = {
    'Entrée': '🥗',
    'Plat': '🍖',
    'Dessert': '🍰',
    'Fromage': '🧀',
    'Boisson': '🍷'
  };

  const menuTypeLabels = {
    standard: '✨ Standard',
    seasonal: '🍂 Saisonnier',
    special: '⭐ Spécial',
    tasting: '🍷 Dégustation',
    chef: '👨‍🍳 Menu Chef'
  };

  const filteredMenus = filterType === 'all' 
    ? menus 
    : menus.filter(m => m.menu_type === filterType);

  if (loading) {
    return (
      <>
        <div className="loading-screen">
          <div className="loader-wrapper">
            <div className="loader"></div>
            <div className="loader-inner"></div>
          </div>
          <p className="loading-text">Chargement des menus...</p>
        </div>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          }

          .loader-wrapper {
            position: relative;
            width: 80px;
            height: 80px;
            margin-bottom: 30px;
          }

          .loader {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 4px solid rgba(220, 38, 38, 0.1);
            border-top: 4px solid #DC2626;
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }

          .loader-inner {
            position: absolute;
            width: 60px;
            height: 60px;
            top: 10px;
            left: 10px;
            border: 4px solid rgba(234, 88, 12, 0.1);
            border-bottom: 4px solid #EA580C;
            border-radius: 50%;
            animation: spin 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
          }

          .loading-text {
            background: linear-gradient(135deg, #DC2626, #EA580C, #DB2777);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.2em;
            font-weight: 700;
            animation: pulse 1.5s ease-in-out infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Nos Menus - {settings.site_name || 'Restaurant'}</title>
        <meta name="description" content="Découvrez nos menus gastronomiques" />
      </Head>

      <Header settings={settings} />

      <div className="menus-page">
        <section className="page-hero">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <div className={`hero-content ${mounted ? 'mounted' : ''}`}>
            <span className="hero-badge">✨ Carte des menus</span>
            <h1>Nos Menus</h1>
            <p>Des expériences culinaires d'exception</p>
          </div>
        </section>

        <div className="container">
          {/* Filtres */}
          <div className={`filters ${mounted ? 'mounted' : ''}`}>
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Tous les menus
            </button>
            <button 
              className={`filter-btn ${filterType === 'standard' ? 'active' : ''}`}
              onClick={() => setFilterType('standard')}
            >
              ✨ Standard
            </button>
            <button 
              className={`filter-btn ${filterType === 'chef' ? 'active' : ''}`}
              onClick={() => setFilterType('chef')}
            >
              👨‍🍳 Menu Chef
            </button>
            <button 
              className={`filter-btn ${filterType === 'tasting' ? 'active' : ''}`}
              onClick={() => setFilterType('tasting')}
            >
              🍷 Dégustation
            </button>
            <button 
              className={`filter-btn ${filterType === 'special' ? 'active' : ''}`}
              onClick={() => setFilterType('special')}
            >
              ⭐ Spécial
            </button>
          </div>

          {filteredMenus.length > 0 ? (
            <div className="menus-grid">
              {filteredMenus.map((menu, index) => (
                <div 
                  key={menu.id_menu} 
                  className={`menu-card ${mounted ? 'mounted' : ''}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="menu-image-wrapper">
                    {menu.image ? (
                      <img src={menu.image} alt={menu.title} className="menu-image" />
                    ) : (
                      <div className="menu-image menu-placeholder">
                        <span className="placeholder-icon">🍽️</span>
                      </div>
                    )}
                    <div className="menu-overlay"></div>
                    <span className="menu-type-badge">{menuTypeLabels[menu.menu_type] || '✨ Menu'}</span>
                  </div>

                  <div className="menu-body">
                    <h3 className="menu-title">{menu.title}</h3>

                    {menu.description && (
                      <p className="menu-description">{menu.description}</p>
                    )}

                    {menu.dish_count > 0 && (
                      <div className="menu-dishes-count">
                        🍴 {menu.dish_count} {menu.dish_count > 1 ? 'plats' : 'plat'}
                      </div>
                    )}

                    <div className="menu-footer">
                      <div className="menu-price-wrapper">
                        <span className="price-label">À partir de</span>
                        <div className="menu-price">{parseFloat(menu.price).toFixed(2)}€</div>
                      </div>
                      <button 
                        className="btn-view-menu"
                        onClick={() => openMenuDetail(menu.id_menu)}
                      >
                        Découvrir
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-menus">
              <div className="no-menus-icon">🍽️</div>
              <h3>Aucun menu disponible</h3>
              <p>Nos chefs préparent de nouvelles créations culinaires.</p>
            </div>
          )}
        </div>
      </div>

      
      <Footer settings={settings} />

      <style jsx>{`
        .menus-page {
          min-height: 100vh;
          background: #ffffff;
        }

        .page-hero {
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 80px 20px;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #DC2626, #EA580C, #DB2777);
          opacity: 1;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-content.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-badge {
          display: inline-block;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          font-size: 0.95em;
          font-weight: 600;
          margin-bottom: 25px;
          letter-spacing: 0.5px;
        }

        .hero-content h1 {
          font-size: 4em;
          margin-bottom: 20px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.4em;
          opacity: 0.95;
          line-height: 1.6;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .filters {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 50px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filters.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .filter-btn {
          padding: 12px 28px;
          background: white;
          border: 2px solid #f1f3f5;
          border-radius: 50px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .filter-btn:hover {
          border-color: #DC2626;
          color: #DC2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #DC2626, #EA580C);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
        }

        .menus-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
          gap: 35px;
        }

        .menu-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 2px solid #f1f3f5;
          opacity: 0;
          transform: scale(0.95);
        }

        .menu-card.mounted {
          opacity: 1;
          transform: scale(1);
        }

        .menu-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 60px rgba(220, 38, 38, 0.2);
          border-color: #DC2626;
        }

        .menu-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .menu-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .menu-card:hover .menu-image {
          transform: scale(1.1);
        }

        .menu-placeholder {
          background: linear-gradient(135deg, #DC2626, #EA580C);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 5em;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        .menu-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .menu-card:hover .menu-overlay {
          opacity: 1;
        }

        .menu-type-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 8px 18px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.9em;
          font-weight: 700;
          color: #DC2626;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .menu-body {
          padding: 30px;
        }

        .menu-title {
          font-size: 1.8em;
          margin-bottom: 15px;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .menu-description {
          color: #666;
          line-height: 1.7;
          margin-bottom: 20px;
          font-size: 0.95em;
        }

        .menu-dishes-count {
          display: inline-block;
          padding: 8px 16px;
          background: linear-gradient(135deg, #fef2f2, #fff7ed);
          color: #DC2626;
          border-radius: 50px;
          font-size: 0.9em;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .menu-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 20px;
          border-top: 2px solid #f1f3f5;
        }

        .menu-price-wrapper {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 0.85em;
          color: #999;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .menu-price {
          font-size: 2.2em;
          font-weight: 900;
          background: linear-gradient(135deg, #DC2626, #EA580C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-view-menu {
          padding: 12px 24px;
          background: linear-gradient(135deg, #DC2626, #EA580C);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }

        .btn-view-menu:hover {
          transform: translateX(5px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
        }

        .no-menus {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .no-menus-icon {
          font-size: 5em;
          margin-bottom: 20px;
          opacity: 0.3;
        }

        .no-menus h3 {
          font-size: 2em;
          font-weight: 800;
          color: #333;
          margin-bottom: 15px;
        }

        .no-menus p {
          color: #999;
          font-size: 1.1em;
        }

        /* MODAL STYLES */
     
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2.5em;
      }

      .hero-content p {
        font-size: 1.1em;
      }

      .menus-grid {
        grid-template-columns: 1fr;
      }

      .menu-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .btn-view-menu {
        width: 100%;
        justify-content: center;
      }

      .modal-content {
        max-height: 95vh;
        border-radius: 16px;
      }

      .modal-close {
        width: 36px;
        height: 36px;
      }

      .modal-header-content {
        padding: 30px 20px;
      }

      .modal-header-content h2 {
        font-size: 1.8em;
      }

      .modal-body {
        padding: 0 20px 20px;
      }

      .modal-course-section {
        padding: 20px;
      }

      .modal-dish-item {
        flex-direction: column;
      }

      .modal-dish-image {
        width: 100%;
        height: 180px;
      }

      .modal-dish-content {
        padding: 15px;
      }

      .modal-footer {
        padding: 20px;
        flex-direction: column;
      }

      .modal-btn-reserve,
      .modal-btn-contact {
        width: 100%;
        justify-content: center;
      }
    }
  `}</style>
</>)}