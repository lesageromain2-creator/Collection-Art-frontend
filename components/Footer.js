// frontend/components/Footer.js
import Link from 'next/link';

export default function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || 'Restaurant';
  const phoneNumber = settings.phone_number || 'Non renseigné';
  const email = settings.email || 'contact@restaurant.fr';
  const address = settings.address || 'Adresse non renseignée';
  const siteDescription = settings.site_description || 'Bienvenue dans notre restaurant';
  const openingHours = settings.opening_hours || 'Voir nos horaires';

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-icon">🍽️</span>
              <h3>{siteName}</h3>
            </div>
            <p className="footer-description">{siteDescription}</p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/categories">Carte</Link></li>
              <li><Link href="/menus">Menus</Link></li>
              <li><Link href="/reservation">Réserver</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                <span>{address}</span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>{phoneNumber}</span>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <span>{email}</span>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Horaires</h4>
            <p className="opening-hours">{openingHours}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {siteName}. Tous droits réservés.</p>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 60px 20px 20px;
          margin-top: 80px;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section {
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .footer-icon {
          font-size: 2em;
        }

        .footer-section h3 {
          font-size: 1.8em;
          margin: 0;
        }

        .footer-description {
          opacity: 0.9;
          line-height: 1.6;
        }

        .footer-section h4 {
          font-size: 1.3em;
          margin-bottom: 15px;
          color: #e74c3c;
          font-weight: 700;
        }

        .footer-links,
        .footer-contact {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li,
        .footer-contact li {
          margin-bottom: 12px;
        }

        .footer-contact li {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .contact-icon {
          font-size: 1.2em;
          flex-shrink: 0;
        }

        .footer-links a {
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          opacity: 0.9;
        }

        .footer-links a:hover {
          color: #e74c3c;
          opacity: 1;
          transform: translateX(5px);
        }

        .opening-hours {
          opacity: 0.9;
          line-height: 1.6;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.8;
          font-size: 0.95em;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 40px 20px 20px;
            margin-top: 60px;
          }

          .footer-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 30px;
          }

          .footer-logo {
            justify-content: center;
          }

          .footer-contact li {
            justify-content: center;
          }

          .footer-links a:hover {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}