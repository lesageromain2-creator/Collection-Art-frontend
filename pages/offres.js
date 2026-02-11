// frontend/pages/offres.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Check, Zap, Star, ArrowRight, Package } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllOffers, fetchSettings } from '../utils/api';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [offersData, settingsData] = await Promise.all([
        getAllOffers({ type: selectedType !== 'all' ? selectedType : undefined }),
        fetchSettings()
      ]);

      setOffers(offersData.offers || offersData || []);
      setSettings(settingsData);
    } catch (error) {
      console.error('Erreur chargement offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (offer) => {
    if (offer.price === 0 || offer.price_type === 'custom') {
      return 'Sur devis';
    }
    if (offer.price_type === 'starting') {
      return `À partir de ${offer.price}€`;
    }
    return `${offer.price}€`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'website':
        return '🌐';
      case 'ecommerce':
        return '🛒';
      case 'mobile':
        return '📱';
      case 'design':
        return '🎨';
      case 'seo':
        return '🚀';
      default:
        return '📦';
    }
  };

  return (
    <>
      <Head>
        <title>Nos Offres - {settings.site_name || "Collection Aur'art"}</title>
        <meta name="description" content="Découvrez nos offres de développement web, e-commerce, design et plus encore." />
      </Head>

      <Header settings={settings} />

      <div className="offers-page">
        {/* Hero Section */}
        <section className="offers-hero">
          <div className="hero-content">
            <h1>💼 Nos Offres & Services</h1>
            <p>Des solutions sur mesure pour transformer vos idées en réalité</p>
          </div>
        </section>

        <div className="container">
          {/* Filter Tabs */}
          <div className="filter-tabs">
            <button
              className={selectedType === 'all' ? 'active' : ''}
              onClick={() => setSelectedType('all')}
            >
              Toutes les offres
            </button>
            <button
              className={selectedType === 'website' ? 'active' : ''}
              onClick={() => setSelectedType('website')}
            >
              🌐 Sites Web
            </button>
            <button
              className={selectedType === 'ecommerce' ? 'active' : ''}
              onClick={() => setSelectedType('ecommerce')}
            >
              🛒 E-commerce
            </button>
            <button
              className={selectedType === 'mobile' ? 'active' : ''}
              onClick={() => setSelectedType('mobile')}
            >
              📱 Applications
            </button>
            <button
              className={selectedType === 'design' ? 'active' : ''}
              onClick={() => setSelectedType('design')}
            >
              🎨 Design
            </button>
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des offres...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="empty-state">
              <Package size={80} />
              <h3>Aucune offre disponible</h3>
              <p>Revenez bientôt pour découvrir nos services.</p>
            </div>
          ) : (
            <div className="offers-grid">
              {offers.map((offer) => (
                <div key={offer.id} className={`offer-card ${offer.is_featured ? 'featured' : ''}`}>
                  {offer.is_featured && (
                    <div className="featured-badge">
                      <Star size={16} />
                      Populaire
                    </div>
                  )}

                  <div className="offer-icon">
                    {getTypeIcon(offer.type)}
                  </div>

                  <h2>{offer.title}</h2>
                  <p className="offer-description">{offer.description}</p>

                  <div className="offer-price">
                    {getPriceDisplay(offer)}
                    {offer.duration && (
                      <span className="duration">Délai: {offer.duration}</span>
                    )}
                  </div>

                  {offer.features && offer.features.length > 0 && (
                    <ul className="features-list">
                      {offer.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx}>
                          <Check size={18} />
                          {feature}
                        </li>
                      ))}
                      {offer.features.length > 5 && (
                        <li className="more">+ {offer.features.length - 5} autres fonctionnalités</li>
                      )}
                    </ul>
                  )}

                  <Link href={`/contact?offer=${offer.slug}`} className="offer-cta">
                    Demander un devis
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <Zap size={60} />
            <h2>Une offre sur mesure ?</h2>
            <p>Vous ne trouvez pas l'offre qui vous correspond ? Contactez-nous pour un projet personnalisé.</p>
            <Link href="/contact" className="cta-button">
              Discutons de votre projet
            </Link>
          </div>
        </section>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .offers-page {
          min-height: 100vh;
          background: #0A0E27;
          padding-top: 80px;
        }

        .offers-hero {
          padding: 80px 20px;
          text-align: center;
          background: linear-gradient(135deg, rgba(0, 102, 255, 0.1), rgba(0, 217, 255, 0.1));
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-content h1 {
          font-size: 3em;
          color: white;
          margin-bottom: 16px;
          font-weight: 900;
        }

        .hero-content p {
          font-size: 1.2em;
          color: rgba(255, 255, 255, 0.7);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 50px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .filter-tabs button {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .filter-tabs button:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-tabs button.active {
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border-color: transparent;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }

        .offer-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 30px;
          transition: all 0.4s;
        }

        .offer-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(0, 102, 255, 0.5);
        }

        .offer-card.featured {
          border-color: rgba(0, 217, 255, 0.5);
          background: rgba(0, 217, 255, 0.05);
        }

        .featured-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #FF6B35, #FF8C42);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .offer-icon {
          font-size: 3em;
          margin-bottom: 20px;
        }

        .offer-card h2 {
          color: white;
          font-size: 1.8em;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .offer-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .offer-price {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px;
          background: rgba(0, 102, 255, 0.1);
          border-radius: 12px;
          margin-bottom: 24px;
          color: white;
          font-size: 1.8em;
          font-weight: 900;
          text-align: center;
        }

        .duration {
          font-size: 0.5em;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 30px 0;
        }

        .features-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .features-list li.more {
          color: #00D9FF;
          font-style: italic;
        }

        .offer-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }

        .offer-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.5);
        }

        .cta-section {
          margin-top: 80px;
          padding: 80px 20px;
          text-align: center;
          background: linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 217, 255, 0.15));
          border-radius: 30px;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          color: white;
        }

        .cta-content h2 {
          font-size: 2.5em;
          font-weight: 900;
          margin: 20px 0;
        }

        .cta-content p {
          font-size: 1.1em;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 30px;
        }

        .cta-button {
          display: inline-block;
          padding: 18px 40px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          color: white;
          border-radius: 12px;
          font-size: 1.1em;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.6);
        }

        .loading-container,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-state svg {
          stroke: rgba(255, 255, 255, 0.3);
          margin-bottom: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0066FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state h3 {
          color: white;
          font-size: 1.8em;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .offers-hero {
            padding: 60px 20px;
          }

          .hero-content h1 {
            font-size: 2em;
          }

          .offers-grid {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            justify-content: flex-start;
          }

          .cta-content h2 {
            font-size: 1.8em;
          }
        }
      `}</style>
    </>
  );
}
