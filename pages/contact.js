// frontend/pages/contact.js - Page Contact LE SAGE
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, sendContactMessage} from '../utils/api';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, XCircle } from 'lucide-react';


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
    
    // Validation basique
    if (!formData.name || !formData.email || !formData.message || !formData.subject) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }
    
    try {
      console.log('📨 Envoi du formulaire de contact...');
      
      // Appel API
      const response = await sendContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        company: null, // Optionnel
        project_type: null, // Optionnel
        budget_range: null, // Optionnel
      });
      
      console.log('✅ Message envoyé:', response);
      setSubmitStatus('success');
      
      // Réinitialiser le formulaire
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '' 
      });
      
      // Masquer le message de succès après 5s
      setTimeout(() => setSubmitStatus(null), 5000);
      
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
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
            background: #0A0E27;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #0066FF;
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
        <title>Contact - {settings.site_name || 'LE SAGE'}</title>
        <meta name="description" content="Contactez-nous pour votre projet web" />
      </Head>

      <Header settings={settings} />

      <div className="contact-page">
        <div className="bg-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>

        {/* Hero Section */}
        <section className={`hero-section ${mounted ? 'mounted' : ''}`}>
          <div className="hero-content">
            <h1>Contactez-nous</h1>
            <p>Discutons de votre projet web</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="contact-container">
          <div className="contact-grid">
            {/* Informations de contact */}
            <div className="contact-info-section">
              <div className="info-card">
                <div className="info-icon">
                  <Mail size={24} />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>{settings.contact_email || 'lesage.pro.dev@gmail.com'}</p>
                  <p className="info-subtitle">Réponse sous 24h</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Phone size={24} />
                </div>
                <div className="info-content">
                  <h3>Téléphone</h3>
                  <p>{settings.contact_phone || '+33 7 86 18 18 40'}</p>
                  <p className="info-subtitle">Du lundi au vendredi</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <MapPin size={24} />
                </div>
                <div className="info-content">
                  <h3>Localisation</h3>
                  <p>{settings.address_city || 'Lyon'}, {settings.address_country || 'France'}</p>
                  <p className="info-subtitle">Agence digitale</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <Clock size={24} />
                </div>
                <div className="info-content">
                  <h3>Horaires</h3>
                  <p>Lun-Ven: 9h-18h</p>
                  <p className="info-subtitle">Sur rendez-vous</p>
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
                    <CheckCircle size={24} />
                    <span>Votre message a été envoyé avec succès !</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error">
                    <XCircle size={24} />
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
                        <option value="devis">Demande de devis</option>
                        <option value="info">Information</option>
                        <option value="support">Support technique</option>
                        <option value="partnership">Partenariat</option>
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
                      placeholder="Décrivez votre projet..."
                      rows="6"
                      className="form-input"
                    />
                  </div>

                  <button type="submit" className="btn-submit">
                    <Send size={20} />
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: #0A0E27;
          padding-top: 80px;
          position: relative;
          overflow-x: hidden;
        }

        .bg-effects {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          top: -300px;
          right: -300px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #FF6B35, #764ba2);
          bottom: -250px;
          left: -250px;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.1); }
        }

        .hero-section {
          padding: 80px 20px;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
          position: relative;
          z-index: 1;
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
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-content p {
          font-size: 1.3em;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px 80px;
          position: relative;
          z-index: 1;
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
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 25px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          border-color: rgba(0, 102, 255, 0.3);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.2);
        }

        .info-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .info-content h3 {
          font-size: 1.2em;
          color: white;
          margin-bottom: 8px;
        }

        .info-content p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 5px 0;
        }

        .info-subtitle {
          font-size: 0.9em;
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
        }

        .form-card h2 {
          font-size: 2em;
          color: white;
          margin-bottom: 10px;
        }

        .form-description {
          color: rgba(255, 255, 255, 0.6);
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

        .alert-success {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
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
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95em;
        }

        .form-input {
          padding: 14px 18px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 1em;
          transition: all 0.3s ease;
          font-family: inherit;
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          outline: none;
          border-color: #0066FF;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.2);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 120px;
        }

        select.form-input {
          cursor: pointer;
        }

        .btn-submit {
          padding: 16px 32px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
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
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
          margin-top: 10px;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.4);
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
        }
      `}</style>
    </>
  );
}
