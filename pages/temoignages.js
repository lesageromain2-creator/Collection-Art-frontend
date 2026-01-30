// frontend/pages/temoignages.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Star, Quote, User as UserIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllTestimonials, fetchSettings } from '../utils/api';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [testimonialsData, settingsData] = await Promise.all([
        getAllTestimonials(),
        fetchSettings()
      ]);

      setTestimonials(testimonialsData.testimonials || testimonialsData || []);
      setSettings(settingsData);
    } catch (error) {
      console.error('Erreur chargement témoignages:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? '#FFD700' : 'none'}
        color={i < rating ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}
      />
    ));
  };

  return (
    <>
      <Head>
        <title>Témoignages Clients - {settings.site_name || 'LE SAGE DEV'}</title>
        <meta name="description" content="Découvrez ce que nos clients pensent de nos services." />
      </Head>

      <Header settings={settings} />

      <div className="testimonials-page">
        {/* Hero Section */}
        <section className="testimonials-hero">
          <div className="hero-content">
            <h1>⭐ Témoignages Clients</h1>
            <p>Ce que nos clients disent de leur expérience avec nous</p>
          </div>
        </section>

        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des témoignages...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="empty-state">
              <Quote size={80} />
              <h3>Aucun témoignage disponible</h3>
              <p>Revenez bientôt pour découvrir les retours de nos clients.</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="quote-icon">
                    <Quote size={40} />
                  </div>

                  <div className="rating">
                    {renderStars(testimonial.rating || 5)}
                  </div>

                  <p className="testimonial-text">{testimonial.content || testimonial.message}</p>

                  <div className="author-info">
                    {testimonial.avatar_url ? (
                      <img src={testimonial.avatar_url} alt={testimonial.client_name} className="author-avatar" />
                    ) : (
                      <div className="author-avatar">
                        <UserIcon size={24} />
                      </div>
                    )}
                    <div className="author-details">
                      <h4>{testimonial.client_name}</h4>
                      {testimonial.company_name && (
                        <p className="company">{testimonial.company_name}</p>
                      )}
                      {testimonial.position && (
                        <p className="position">{testimonial.position}</p>
                      )}
                      {testimonial.project_type && (
                        <span className="project-badge">{testimonial.project_type}</span>
                      )}
                    </div>
                  </div>

                  {testimonial.created_at && (
                    <div className="testimonial-date">
                      {new Date(testimonial.created_at).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Vous souhaitez partager votre expérience ?</h2>
            <p>Votre avis compte pour nous et aide d'autres clients à nous découvrir.</p>
            <a href="/contact" className="cta-button">
              Laisser un témoignage
            </a>
          </div>
        </section>
      </div>

      <Footer settings={settings} />

      <style jsx>{`
        .testimonials-page {
          min-height: 100vh;
          background: #0A0E27;
          padding-top: 80px;
        }

        .testimonials-hero {
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

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 30px;
        }

        .testimonial-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 30px;
          transition: all 0.4s;
        }

        .testimonial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(0, 217, 255, 0.4);
        }

        .quote-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          color: rgba(0, 217, 255, 0.2);
        }

        .rating {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }

        .testimonial-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.05em;
          line-height: 1.7;
          margin-bottom: 30px;
          font-style: italic;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .author-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          object-fit: cover;
        }

        .author-details {
          flex: 1;
        }

        .author-details h4 {
          color: white;
          font-size: 1.1em;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .company,
        .position {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9em;
          margin: 2px 0;
        }

        .project-badge {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 12px;
          background: rgba(0, 102, 255, 0.2);
          color: #00D9FF;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .testimonial-date {
          margin-top: 16px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85em;
          text-align: right;
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
          font-size: 2.2em;
          font-weight: 900;
          margin-bottom: 16px;
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
          .testimonials-hero {
            padding: 60px 20px;
          }

          .hero-content h1 {
            font-size: 2em;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .cta-content h2 {
            font-size: 1.6em;
          }
        }
      `}</style>
    </>
  );
}
