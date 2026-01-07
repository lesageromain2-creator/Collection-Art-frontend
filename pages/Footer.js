// frontend/components/Footer.js
import Link from 'next/link';

export default function Footer({ settings = {} }) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || 'Restaurant';
  const phoneNumber = settings.phone_number || 'Non renseigné';
  const email = settings.email || 'contact@restaurant.fr';
  const address = settings.address || 'Adresse non renseignée';

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          
          {/* Section 1 : Nom du site */}
          <div className="footer-section">
            <h3>🍽️ {siteName}</h3>
            <p>{settings.site_description || 'Bienvenue dans notre restaurant'}</p>
          </div>

          {/* Section 2 : Navigation */}
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/categories">Carte</Link></li>
              <li><Link href="/menus">Menus</Link></li>
              <li><Link href="/reservation">Réserver</Link></li>
            </ul>
          </div>

          {/* Section 3 : Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>📍 {address}</li>
              <li>📞 {phoneNumber}</li>
              <li>✉️ {email}</li>
            </ul>
          </div>

          {/* Section 4 : Horaires */}
          <div className="footer-section">
            <h4>Horaires</h4>
            <p>{settings.opening_hours || 'Voir nos horaires'}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {siteName}. Tous droits réservés.</p>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: #2c3e50;
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

        .footer-section h3 {
          font-size: 1.8em;
          margin-bottom: 15px;
        }

        .footer-section h4 {
          font-size: 1.3em;
          margin-bottom: 15px;
          color: #e74c3c;
        }

        .footer-links,
        .footer-contact {
          list-style: none;
          padding: 0;
        }

        .footer-links li,
        .footer-contact li {
          margin-bottom: 10px;
        }

        .footer-links a {
          color: white;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: #e74c3c;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
