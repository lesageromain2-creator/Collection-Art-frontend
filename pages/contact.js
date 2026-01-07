// frontend/pages/contact.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings } from '../utils/api';

export default function Contact() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadSettings();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ici, appeler l'API pour envoyer le message
      // await sendContactMessage(formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa556 100%);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact - {settings.site_name || 'Restaurant'}</title>
        <meta name="description" content="Contactez-nous pour toute question ou réservation" />
      </Head>

      <Header settings={settings} />

      <div className="contact-page">
        {/* Hero Section */}
        <section className={`hero-section ${mounted ? 'mounted' : ''}`}>
          <div className="hero-content">
            <h1>Contactez-nous</h1>
            <p>Nous sommes à votre écoute pour toute question ou réservation</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="contact-container">
          <div className="contact-grid">
            {/* Informations de contact */}
            <div className="contact-info-section">
              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Adresse</h3>
                  <p>{settings.address || '123 Rue de la Gastronomie, 75001 Paris'}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Téléphone</h3>
                  <p>{settings.phone_number || '+33 1 23 45 67 89'}</p>
                  <p className="info-subtitle">Du lundi au dimanche</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>{settings.email || 'contact@restaurant.fr'}</p>
                  <p className="info-subtitle">Réponse sous 24h</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="info-content">
                  <h3>Horaires d'ouverture</h3>
                  <p>{settings.opening_hours || 'Mar-Sam: 12h-14h30, 19h-22h30'}</p>
                  <p className="info-subtitle">Dimanche-Lundi: Fermé</p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="social-section">
                <h3>Suivez-nous</h3>
                <div className="social-links">
                  <a href="#" className="social-btn facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-btn instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-btn twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-btn tiktok">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="contact-form-section">
              <div className="form-card">
                <h2>Envoyez-nous un message</h2>
                <p className="form-description">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>

                {submitStatus === 'success' && (
                  <div className="alert alert-success">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Votre message a été envoyé avec succès !</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <span>Une erreur s'est produite. Veuillez réessayer.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Nom complet *</label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Jean Dupont"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="jean.dupont@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Sujet *</label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="form-input"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="reservation">Réservation</option>
                        <option value="info">Information</option>
                        <option value="event">Événement privé</option>
                        <option value="feedback">Avis / Suggestion</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      placeholder="Votre message..."
                      rows="6"
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-submit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="map-section">
            <h2>Nous trouver</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937604!2d2.292292615674153!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8f%3A0x40b82c3688c9460!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1635789012345!5m2!1sfr!2sfr"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Localisation du restaurant"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa556 100%);
          padding-top: 80px;
        }

        .hero-section {
          padding: 80px 20px;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .hero-section.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content h1 {
          font-size: 3.5em;
          color: white;
          margin-bottom: 20px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .hero-content p {
          font-size: 1.3em;
          color: rgba(255, 255, 255, 0.95);
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-icon svg {
          width: 24px;
          height: 24px;
          stroke: white;
        }

        .info-content h3 {
          font-size: 1.2em;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .info-content p {
          color: #555;
          line-height: 1.6;
          margin: 5px 0;
        }

        .info-subtitle {
          font-size: 0.9em;
          color: #888 !important;
        }

        .social-section {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .social-section h3 {
          font-size: 1.2em;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .social-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .social-btn {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-btn svg {
          width: 24px;
          height: 24px;
        }

        .social-btn.facebook {
          background: #1877f2;
          color: white;
        }

        .social-btn.instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: white;
        }

        .social-btn.twitter {
          background: #1da1f2;
          color: white;
        }

        .social-btn.tiktok {
          background: #000;
          color: white;
        }

        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .form-card h2 {
          font-size: 2em;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .form-description {
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .alert {
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95em;
        }

        .form-input {
          padding: 14px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1em;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 120px;
        }

        .btn-submit {
          padding: 16px 32px;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
          margin-top: 10px;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
        }

        .btn-submit svg {
          width: 20px;
          height: 20px;
        }

        .map-section {
          margin-top: 60px;
        }

        .map-section h2 {
          font-size: 2em;
          color: white;
          text-align: center;
          margin-bottom: 30px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .hero-content h1 {
            font-size: 2.5em;
          }
        }

        @media (max-width: 768px) {
          .contact-page {
            padding-top: 60px;
          }

          .hero-section {
            padding: 60px 20px;
          }

          .hero-content h1 {
            font-size: 2em;
          }

          .hero-content p {
            font-size: 1.1em;
          }

          .form-card {
            padding: 25px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .social-links {
            grid-template-columns: repeat(2, 1fr);
          }

          .map-container iframe {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}