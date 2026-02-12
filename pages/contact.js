// frontend/pages/contact.js - Page Contact Collection Aur'art
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssociationLogo from '../components/AssociationLogo';
import { fetchSettings, sendContactMessage} from '../utils/api';
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react';


export default function Contact() {
  const [settings, setSettings] = useState({
    site_name: 'Collection Aur\'art',
    email: 'collection.aurart@gmail.com',
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadSettings();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
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
        phone: null,
        subject: formData.subject,
        message: formData.message,
        company: null,
        project_type: null,
        budget_range: null,
      });
      
      console.log('✅ Message envoyé:', response);
      setSubmitStatus('success');
      
      // Réinitialiser le formulaire
      setFormData({ 
        name: '', 
        email: '', 
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

  return (
    <>
      <Head>
        <title>Contact - Collection Aur'art</title>
        <meta name="description" content="Contactez Collection Aur'art - Association de valorisation du patrimoine artistique" />
      </Head>

      <Header settings={settings} />

      <div className="contact-page">
        {/* Hero Section */}
        <section className={`hero-section ${mounted ? 'mounted' : ''}`}>
          <div className="hero-content">
            <div className="flex justify-center mb-6">
              <AssociationLogo size="md" linkToHome />
            </div>
            <h1>Contactez-nous</h1>
            <p>Une question, une suggestion ? Nous sommes à votre écoute</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="contact-container">
          <div className="contact-grid">
            {/* Information de contact */}
            <div className="contact-info-section">
              <div className="info-card-main">
                <div className="info-icon-main">
                  <Mail size={32} />
                </div>
                <div className="info-content-main">
                  <h3>Notre adresse email</h3>
                  <a href={`mailto:${settings.email}`} className="email-link">
                    {settings.email}
                  </a>
                  <p className="info-subtitle">
                    Nous répondons généralement sous 48 heures
                  </p>
                </div>
              </div>

              <div className="contact-note">
                <p>
                  Que vous souhaitiez en savoir plus sur notre association, proposer une collaboration ou simplement échanger sur l'art et son histoire, n'hésitez pas à nous écrire.
                </p>
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
                  <div className="form-group">
                    <label htmlFor="name">Nom complet *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      placeholder="Votre nom"
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
                      placeholder="votre.email@exemple.com"
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
                      <option value="info">Information générale</option>
                      <option value="article">Proposition d'article</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Retour / Suggestion</option>
                      <option value="other">Autre</option>
                    </select>
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
          background: #FAF8F3;
          padding-top: 80px;
        }

        .hero-section {
          padding: 80px 20px 60px;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease;
        }

        .hero-section.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-content h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 3em;
          color: #2C2C2C;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .hero-content p {
          font-size: 1.2em;
          color: #5A5A5A;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 50px;
        }

        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .info-card-main {
          background: white;
          border: 1px solid rgba(44, 44, 44, 0.1);
          border-radius: 16px;
          padding: 35px;
          text-align: center;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
        }

        .info-icon-main {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #D63384 0%, #6A2C70 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
        }

        .info-content-main h3 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4em;
          color: #2C2C2C;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .email-link {
          display: inline-block;
          color: #D63384;
          font-size: 1.1em;
          font-weight: 500;
          margin-bottom: 15px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .email-link:hover {
          color: #6A2C70;
          text-decoration: underline;
        }

        .info-subtitle {
          font-size: 0.9em;
          color: #5A5A5A;
          line-height: 1.6;
        }

        .contact-note {
          background: white;
          border: 1px solid rgba(44, 44, 44, 0.1);
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
        }

        .contact-note p {
          color: #5A5A5A;
          line-height: 1.7;
          margin: 0;
        }

        .form-card {
          background: white;
          border: 1px solid rgba(44, 44, 44, 0.1);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
        }

        .form-card h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2em;
          color: #2C2C2C;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .form-description {
          color: #5A5A5A;
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
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 500;
          color: #2C2C2C;
          font-size: 0.95em;
        }

        .form-input {
          padding: 14px 18px;
          border: 1px solid rgba(44, 44, 44, 0.15);
          border-radius: 8px;
          font-size: 1em;
          transition: all 0.3s ease;
          font-family: inherit;
          background: white;
          color: #2C2C2C;
        }

        .form-input::placeholder {
          color: rgba(90, 90, 90, 0.5);
        }

        .form-input:focus {
          outline: none;
          border-color: #D63384;
          box-shadow: 0 0 0 3px rgba(214, 51, 132, 0.1);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 150px;
        }

        select.form-input {
          cursor: pointer;
        }

        .btn-submit {
          padding: 16px 32px;
          background: linear-gradient(135deg, #D63384, #6A2C70);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
          margin-top: 10px;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(214, 51, 132, 0.4);
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
            padding: 60px 20px 40px;
          }

          .hero-content h1 {
            font-size: 2em;
          }

          .hero-content p {
            font-size: 1.1em;
          }

          .form-card {
            padding: 30px 20px;
          }

          .info-card-main {
            padding: 25px;
          }
        }
      `}</style>
    </>
  );
}
