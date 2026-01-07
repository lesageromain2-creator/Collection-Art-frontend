// frontend/pages/reservation.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchSettings, createReservation, checkAuth } from '../utils/api';

export default function Reservation() {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    reservation_date: '',
    reservation_time: '',
    number_of_people: 2,
    special_requests: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    loadData();
    // Trigger mount animation
    setTimeout(() => setMounted(true), 50);
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, authData] = await Promise.all([
        fetchSettings(),
        checkAuth()
      ]);

      setSettings(settingsData);
      
      if (authData.authenticated) {
        setUser(authData.user);
      }

      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({...prev, reservation_date: today}));

    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.reservation_date) {
      newErrors.push('La date est requise');
    }
    
    if (!formData.reservation_time) {
      newErrors.push('L\'heure est requise');
    }
    
    if (formData.number_of_people < 1 || formData.number_of_people > 20) {
      newErrors.push('Le nombre de personnes doit être entre 1 et 20');
    }

    const reservationDateTime = new Date(`${formData.reservation_date}T${formData.reservation_time}`);
    if (reservationDateTime < new Date()) {
      newErrors.push('La date et l\'heure doivent être dans le futur');
    }

    const [hour, minute] = formData.reservation_time.split(':').map(Number);
    const timeInMinutes = hour * 60 + minute;
    
    const lunchStart = 12 * 60;
    const lunchEnd = 14 * 60 + 30;
    const dinnerStart = 19 * 60;
    const dinnerEnd = 22 * 60 + 30;

    const isLunchTime = timeInMinutes >= lunchStart && timeInMinutes <= lunchEnd;
    const isDinnerTime = timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd;

    if (!isLunchTime && !isDinnerTime) {
      newErrors.push('Horaires disponibles : 12h00-14h30 et 19h00-22h30');
    }

    return newErrors;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login?redirect=/reservation');
      return;
    }

    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      await createReservation(formData);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error) {
      setErrors([error.message || 'Une erreur est survenue']);
      setLoading(false);
      triggerShake();
    }
  };

  if (success) {
    return (
      <>
        <Head>
          <title>Réservation confirmée - {settings.site_name}</title>
        </Head>

        <Header settings={settings} />

        <div className="success-page">
          <div className="success-container">
            <div className="success-icon-wrapper">
              <div className="success-circle"></div>
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            
            <h1>Réservation confirmée !</h1>
            <p className="success-subtitle">Votre demande a été envoyée avec succès</p>
            <p className="success-info">Nous vous confirmerons votre réservation par email dans les plus brefs délais.</p>
            
            <div className="reservation-summary">
              <h3>📋 Récapitulatif de votre réservation</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-icon">📅</span>
                  <div>
                    <strong>Date</strong>
                    <p>{new Date(formData.reservation_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon">🕐</span>
                  <div>
                    <strong>Heure</strong>
                    <p>{formData.reservation_time}</p>
                  </div>
                </div>
                <div className="summary-item">
                  <span className="summary-icon">👥</span>
                  <div>
                    <strong>Personnes</strong>
                    <p>{formData.number_of_people} {formData.number_of_people > 1 ? 'personnes' : 'personne'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="btn-dashboard"
              onClick={() => router.push('/dashboard')}
            >
              Voir mes réservations
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <Footer settings={settings} />

        <style jsx>{`
          .success-page {
            min-height: calc(100vh - 200px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }

          .success-page::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: gridMove 20s linear infinite;
          }

          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }

          .success-container {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 60px 50px;
            border-radius: 30px;
            max-width: 650px;
            width: 100%;
            text-align: center;
            box-shadow: 0 30px 80px rgba(0,0,0,0.25);
            position: relative;
            animation: successSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes successSlideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .success-icon-wrapper {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 30px;
          }

          .success-circle {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
          }

          .checkmark {
            position: absolute;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            stroke-width: 3;
            stroke: #fff;
            stroke-miterlimit: 10;
            animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
          }

          .checkmark-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
          }

          .checkmark-check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }

          @keyframes stroke {
            100% { stroke-dashoffset: 0; }
          }

          @keyframes scale {
            0%, 100% { transform: none; }
            50% { transform: scale(1.1); }
          }

          .success-container h1 {
            font-size: 2.8em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            font-weight: 800;
            animation: fadeInUp 0.6s ease 0.3s both;
          }

          .success-subtitle {
            font-size: 1.3em;
            color: #4a5568;
            margin-bottom: 10px;
            font-weight: 600;
            animation: fadeInUp 0.6s ease 0.4s both;
          }

          .success-info {
            font-size: 1.1em;
            color: #718096;
            margin-bottom: 35px;
            animation: fadeInUp 0.6s ease 0.5s both;
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

          .reservation-summary {
            background: linear-gradient(135deg, #f6f8fb 0%, #eef2f7 100%);
            padding: 35px;
            border-radius: 20px;
            margin: 35px 0;
            text-align: left;
            border: 2px solid #e2e8f0;
            animation: fadeInUp 0.6s ease 0.6s both;
          }

          .reservation-summary h3 {
            font-size: 1.4em;
            color: #2d3748;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 700;
          }

          .summary-grid {
            display: grid;
            gap: 20px;
          }

          .summary-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }

          .summary-item:hover {
            transform: translateX(5px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
          }

          .summary-icon {
            font-size: 2.5em;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            flex-shrink: 0;
          }

          .summary-item strong {
            display: block;
            color: #4a5568;
            font-size: 0.95em;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }

          .summary-item p {
            color: #2d3748;
            font-size: 1.15em;
            margin: 0;
            font-weight: 700;
          }

          .btn-dashboard {
            padding: 20px 45px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 1.15em;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            animation: fadeInUp 0.6s ease 0.7s both;
          }

          .btn-dashboard:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
          }

          .btn-arrow {
            transition: transform 0.3s ease;
          }

          .btn-dashboard:hover .btn-arrow {
            transform: translateX(5px);
          }

          @media (max-width: 768px) {
            .success-container {
              padding: 40px 25px;
            }

            .success-container h1 {
              font-size: 2em;
            }

            .success-icon-wrapper {
              width: 100px;
              height: 100px;
            }

            .success-circle,
            .checkmark {
              width: 100px;
              height: 100px;
            }

            .summary-item {
              flex-direction: column;
              text-align: center;
            }

            .summary-item:hover {
              transform: translateY(-3px);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Réserver une table - {settings.site_name || 'Restaurant'}</title>
      </Head>

      <Header settings={settings} />

      <div className="reservation-page">
        <section className="page-hero">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Réservation en ligne
            </div>
            <h1>Réservez votre table</h1>
            <p>Une expérience culinaire inoubliable vous attend</p>
          </div>
        </section>

        <div className="container">
          <div className={`reservation-container ${mounted ? 'mounted' : ''}`}>
            <div className="info-sidebar">
              <div className="info-card info-card-hours">
                <div className="card-icon">🕐</div>
                <h3>Horaires d'ouverture</h3>
                <div className="hours-list">
                  <div className="hour-item">
                    <span className="hour-label">Déjeuner</span>
                    <span className="hour-time">12:00 - 14:30</span>
                  </div>
                  <div className="hour-item">
                    <span className="hour-label">Dîner</span>
                    <span className="hour-time">19:00 - 22:30</span>
                  </div>
                  <div className="hour-item closed">
                    <span className="hour-label">Dimanche</span>
                    <span className="hour-time">Fermé</span>
                  </div>
                </div>
              </div>

              <div className="info-card info-card-contact">
                <div className="card-icon">📞</div>
                <h3>Contact</h3>
                <div className="contact-list">
                  {settings.site_phone && (
                    <a href={`tel:${settings.site_phone}`} className="contact-item">
                      <span className="contact-icon">📱</span>
                      <div>
                        <strong>Téléphone</strong>
                        <p>{settings.site_phone}</p>
                      </div>
                    </a>
                  )}
                  {settings.site_email && (
                    <a href={`mailto:${settings.site_email}`} className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <div>
                        <strong>Email</strong>
                        <p>{settings.site_email}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              <div className="info-card info-card-info">
                <div className="card-icon">ℹ️</div>
                <h3>Informations pratiques</h3>
                <ul className="info-list">
                  <li>
                    <span className="check-icon">✓</span>
                    Confirmation immédiate par email
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Annulation gratuite jusqu'à 2h avant
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Jusqu'à 20 personnes
                  </li>
                  <li>
                    <span className="check-icon">✓</span>
                    Tolérance de retard: 15 min
                  </li>
                </ul>
              </div>
            </div>

            <div className={`reservation-form ${shake ? 'shake' : ''}`}>
              <div className="form-header">
                <h2>Formulaire de réservation</h2>
                <p>Remplissez les informations ci-dessous</p>
              </div>

              {!user && (
                <div className="auth-notice">
                  <div className="notice-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Connexion requise</strong>
                    <p>
                      Vous devez être connecté pour réserver. 
                      <a href="/login?redirect=/reservation"> Se connecter maintenant</a>
                    </p>
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div className="error-box">
                  <div className="error-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div>
                    <strong>Erreur de validation</strong>
                    <ul>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">📅</span>
                    <h3>Date et heure</h3>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reservation_date">
                        Date de réservation
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="date"
                          id="reservation_date"
                          name="reservation_date"
                          value={formData.reservation_date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          disabled={loading || !user}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reservation_time">
                        Heure d'arrivée
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <select
                          id="reservation_time"
                          name="reservation_time"
                          value={formData.reservation_time}
                          onChange={handleChange}
                          required
                          disabled={loading || !user}
                        >
                          <option value="">Sélectionner une heure...</option>
                          <optgroup label="🌅 Déjeuner (12h-14h30)">
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                          </optgroup>
                          <optgroup label="🌙 Dîner (19h-22h30)">
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                            <option value="21:30">21:30</option>
                            <option value="22:00">22:00</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">👥</span>
                    <h3>Nombre de convives</h3>
                  </div>
                  
                  <div className="people-selector">
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() => setFormData({...formData, number_of_people: Math.max(1, formData.number_of_people - 1)})}
                      disabled={loading || !user || formData.number_of_people <= 1}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    
                    <div className="people-display">
                      <input
                        type="number"
                        name="number_of_people"
                        value={formData.number_of_people}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        required
                        disabled={loading || !user}
                        className="people-input"
                      />
                      <span className="people-label">
                        {formData.number_of_people > 1 ? 'personnes' : 'personne'}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      className="btn-counter"
                      onClick={() => setFormData({...formData, number_of_people: Math.min(20, formData.number_of_people + 1)})}
                      disabled={loading || !user || formData.number_of_people >= 20}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">💬</span>
                    <h3>Demandes spéciales</h3>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="special_requests">
                      Allergies, régimes alimentaires, occasion spéciale...
                    </label>
                    <div className="input-wrapper">
                      <textarea
                        id="special_requests"
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Ex: Allergie aux fruits à coque, régime végétarien, anniversaire, chaise haute..."
                        disabled={loading || !user}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading || !user}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
                      </svg>
                      Confirmer ma réservation
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .reservation-page {
          min-height: 100vh;
          background: #0f0f23;
          position: relative;
        }

        .page-hero {
          height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(102, 126, 234, 0.4);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: rgba(118, 75, 162, 0.4);
          bottom: -150px;
          right: -150px;
          animation-delay: 7s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: rgba(237, 100, 166, 0.4);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          font-size: 0.9em;
          font-weight: 600;
          margin-bottom: 20px;
          animation: fadeInDown 0.6s ease;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content h1 {
          font-size: 4em;
          margin-bottom: 15px;
          font-weight: 900;
          letter-spacing: -1px;
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .hero-content p {
          font-size: 1.4em;
          opacity: 0.95;
          animation: fadeInUp 0.8s ease 0.4s both;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .reservation-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 40px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reservation-container.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .info-sidebar {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 35px;
          border-radius: 25px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .info-card:hover::before {
          transform: scaleX(1);
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .card-icon {
          font-size: 3em;
          margin-bottom: 15px;
          display: inline-block;
          transition: transform 0.4s ease;
        }

        .info-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .info-card h3 {
          font-size: 1.5em;
          color: white;
          margin-bottom: 25px;
          font-weight: 700;
        }

        .hours-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .hour-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .hour-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .hour-item.closed {
          opacity: 0.6;
        }

        .hour-label {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
        }

        .hour-time {
          color: white;
          font-weight: 700;
          font-size: 1.1em;
        }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .contact-icon {
          font-size: 2em;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          flex-shrink: 0;
        }

        .contact-item strong {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85em;
          margin-bottom: 3px;
        }

        .contact-item p {
          color: white;
          font-weight: 600;
          margin: 0;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          color: rgba(255, 255, 255, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .info-list li:last-child {
          border-bottom: none;
        }

        .info-list li:hover {
          color: white;
          padding-left: 10px;
        }

        .check-icon {
          color: #4ade80;
          font-weight: bold;
          font-size: 1.3em;
        }

        .reservation-form {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 50px;
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .reservation-form.shake {
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-header h2 {
          font-size: 2.8em;
          color: white;
          margin-bottom: 10px;
          font-weight: 800;
        }

        .form-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.15em;
        }

        .auth-notice,
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px 25px;
          border-radius: 15px;
          margin-bottom: 30px;
          animation: slideDown 0.4s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-notice {
          background: rgba(33, 150, 243, 0.15);
          border: 2px solid rgba(33, 150, 243, 0.3);
        }

        .error-box {
          background: rgba(239, 68, 68, 0.15);
          border: 2px solid rgba(239, 68, 68, 0.3);
        }

        .notice-icon,
        .error-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .notice-icon svg {
          stroke: #3b82f6;
          stroke-width: 2;
        }

        .error-icon svg {
          stroke: #ef4444;
          stroke-width: 2;
        }

        .auth-notice strong,
        .error-box strong {
          display: block;
          color: white;
          font-size: 1.05em;
          margin-bottom: 5px;
        }

        .auth-notice p {
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .auth-notice a,
        .error-box a {
          color: #60a5fa;
          font-weight: 600;
          text-decoration: underline;
          transition: color 0.3s;
        }

        .auth-notice a:hover {
          color: #93c5fd;
        }

        .error-box ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .error-box li {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 500;
          margin-bottom: 5px;
        }

        .error-box li:last-child {
          margin-bottom: 0;
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 35px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .section-icon {
          font-size: 2em;
        }

        .section-header h3 {
          font-size: 1.6em;
          color: white;
          font-weight: 700;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          font-size: 1.05em;
        }

        .required {
          color: #ef4444;
          margin-left: 4px;
        }

        .input-wrapper {
          position: relative;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 1.05em;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-family: inherit;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        .form-group input:disabled,
        .form-group select:disabled,
        .form-group textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-group select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 15px center;
          background-size: 20px;
          padding-right: 45px;
        }

        .form-group select option {
          background: #1a1a2e;
          color: white;
        }

        .people-selector {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          border: 2px dashed rgba(255, 255, 255, 0.2);
        }

        .btn-counter {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .btn-counter svg {
          width: 24px;
          height: 24px;
        }

        .btn-counter:hover:not(:disabled) {
          transform: scale(1.15) rotate(90deg);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
        }

        .btn-counter:active:not(:disabled) {
          transform: scale(0.95);
        }

        .btn-counter:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .people-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .people-input {
          width: 120px;
          text-align: center;
          font-size: 3em;
          font-weight: 900;
          color: white;
          padding: 10px;
          background: transparent;
          border: none;
        }

        .people-input:focus {
          box-shadow: none;
        }

        .people-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-submit {
          width: 100%;
          padding: 22px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 15px;
          font-size: 1.25em;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-submit::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-submit:hover:not(:disabled)::before {
          width: 400px;
          height: 400px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(102, 126, 234, 0.6);
        }

        .btn-submit:active:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-submit svg {
          width: 24px;
          height: 24px;
          position: relative;
          z-index: 1;
        }

        .btn-submit span:not(.spinner) {
          position: relative;
          z-index: 1;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .reservation-container {
            grid-template-columns: 1fr;
          }

          .info-sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-hero {
            height: 300px;
          }

          .hero-content h1 {
            font-size: 2.5em;
          }

          .hero-content p {
            font-size: 1.1em;
          }

          .container {
            padding: 40px 15px;
          }

          .reservation-form {
            padding: 30px 20px;
          }

          .form-header h2 {
            font-size: 2em;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .people-selector {
            padding: 25px;
            gap: 25px;
          }

          .btn-counter {
            width: 60px;
            height: 60px;
          }

          .people-input {
            font-size: 2.5em;
            width: 100px;
          }

          .btn-submit {
            font-size: 1.1em;
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .hero-content h1 {
            font-size: 2em;
          }

          .info-sidebar {
            grid-template-columns: 1fr;
          }

          .form-header h2 {
            font-size: 1.8em;
          }

          .section-header h3 {
            font-size: 1.3em;
          }
        }
      `}</style>
    </>
  );
}