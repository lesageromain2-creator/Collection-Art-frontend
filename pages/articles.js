// frontend/pages/articles.js - Catalogue d'articles (tous les articles, design cadre artistique)
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicArticles, fetchSettings } from '../utils/api';

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [settings, setSettings] = useState({ site_name: "Collection Aur'art" });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!router.isReady) return;
    loadData();
  }, [page, router.isReady, router.query.search, router.query.rubrique]);

  const loadData = async () => {
    try {
      setLoading(true);
      const q = router.query;
      const [articlesRes, settingsRes] = await Promise.all([
        getPublicArticles({
          page,
          limit: 9,
          ...(q.search && { search: String(q.search) }),
          ...(q.rubrique && { rubrique: String(q.rubrique) }),
        }),
        fetchSettings().catch(() => ({})),
      ]);
      setArticles(articlesRes.articles || []);
      setPagination(articlesRes.pagination || {});
      if (settingsRes?.site_name) setSettings(settingsRes);
    } catch (e) {
      console.error(e);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tous nos articles – {settings.site_name}</title>
        <meta
          name="description"
          content="Découvrez tous nos articles sur l'histoire de l'art, le marché de l'art, les procès artistiques et nos analyses d'œuvres."
        />
      </Head>

      <div className="articles-page">
        <Header settings={settings} />

        <main className="articles-main">
          {/* Hero */}
          <section className="hero">
            <div className="hero-inner">
              <div className="hero-icon" aria-hidden="true">
                <BookOpen size={44} />
              </div>
              <h1 className="hero-title">Notre catalogue d&apos;articles</h1>
              <div className="hero-line" />
              <p className="hero-desc">
                Découvrez l&apos;ensemble des publications de l&apos;association sur l&apos;art, son histoire et son marché.
              </p>
            </div>
          </section>

          {/* Feed */}
          <section className="feed-section">
            {loading ? (
              <div className="feed-loading">
                <div className="spinner" />
                <p>Chargement des articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <>
                <div className="feed-grid">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="article-card"
                    >
                      <div className="card-frame">
                        <div className="card-mat">
                          {article.rubrique_name && (
                            <span
                              className="card-rubrique-label"
                              style={
                                article.rubrique_color
                                  ? { color: article.rubrique_color }
                                  : {}
                              }
                            >
                              {article.rubrique_name}
                            </span>
                          )}
                          <div className="card-cover">
                            {article.featured_image_url ? (
                              <img
                                src={article.featured_image_url}
                                alt=""
                                className="card-cover-img"
                              />
                            ) : (
                              <div className="card-cover-placeholder">
                                <BookOpen size={56} />
                              </div>
                            )}
                          </div>
                          <div className="card-body">
                            <h2 className="card-title">{article.title}</h2>
                            {article.excerpt && (
                              <p className="card-excerpt">{article.excerpt}</p>
                            )}
                            <div className="card-meta">
                              {(article.firstname || article.lastname) && (
                                <span className="meta-item">
                                  <User size={16} />
                                  {[article.firstname, article.lastname].filter(Boolean).join(' ')}
                                </span>
                              )}
                              <span className="meta-item">
                                <Calendar size={16} />
                                {formatDate(article.published_at || article.created_at)}
                              </span>
                            </div>
                            <span className="card-link-label">
                              Lire l&apos;article
                              <ArrowRight size={18} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      type="button"
                      className="btn-pag"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Précédent
                    </button>
                    <span className="pag-info">
                      Page {pagination.page || page} / {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn-pag"
                      disabled={page >= (pagination.totalPages || 1)}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="feed-empty">
                <div className="empty-icon">
                  <BookOpen size={64} />
                </div>
                <h2>Bientôt disponible</h2>
                <p>
                  Nos premiers articles seront bientôt publiés. Découvrez nos rubriques en attendant.
                </p>
                <Link href="/rubriques" className="btn-primary">
                  Découvrir nos rubriques
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="cta-section">
            <div className="cta-box">
              <h2>Rejoignez notre communauté</h2>
              <p>Ne manquez aucune de nos publications. Contactez-nous pour en savoir plus.</p>
              <Link href="/contact" className="btn-primary">
                Nous contacter
                <ArrowRight size={20} />
              </Link>
            </div>
          </section>
        </main>

        <Footer settings={settings} />
      </div>

      <style jsx>{`
        .articles-page {
          min-height: 100vh;
          background: #F9F6F0;
        }
        .articles-main {
          padding-top: 80px;
          padding-bottom: 60px;
        }
        .hero {
          background: linear-gradient(135deg, #212E50 0%, #7C2A3C 100%);
          color: #F8F8F0;
          padding: 48px 24px 56px;
          text-align: center;
        }
        .hero-inner {
          max-width: 640px;
          margin: 0 auto;
        }
        .hero-icon {
          opacity: 0.9;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .hero-line {
          width: 80px;
          height: 4px;
          background: #C7A11E;
          border-radius: 2px;
          margin: 0 auto 20px;
        }
        .hero-desc {
          font-size: 1.15rem;
          opacity: 0.95;
          line-height: 1.6;
        }
        .feed-section {
          max-width: 1100px;
          margin: 56px auto 0;
          padding: 0 24px;
        }
        .feed-loading {
          text-align: center;
          padding: 64px 20px;
          color: #212E50;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(108, 129, 87, 0.2);
          border-top-color: #6C8157;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 36px;
        }
        .article-card {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }
        .article-card:hover {
          transform: translateY(-6px);
        }
        .card-frame {
          background: #F9F6F0;
          border: none;
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 2px 12px rgba(33, 46, 80, 0.06);
          overflow: hidden;
          transition: box-shadow 0.35s ease;
        }
        .article-card:hover .card-frame {
          box-shadow: 0 4px 20px rgba(33, 46, 80, 0.1);
        }
        .card-mat {
          background: #F9F6F0;
          border-radius: 12px;
          overflow: hidden;
          border: none;
        }
        .card-rubrique-label {
          display: block;
          padding: 8px 16px 6px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .card-cover {
          position: relative;
          aspect-ratio: 16/10;
          background: #F9F6F0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-cover-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }
        .article-card:hover .card-cover-img {
          transform: scale(1.06);
        }
        .card-cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(248, 248, 240, 0.35);
        }
        .card-body {
          padding: 24px 28px 20px;
          display: flex;
          flex-direction: column;
        }
        .card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #212E50;
          margin-bottom: 10px;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-card:hover .card-title {
          color: #7C2A3C;
        }
        .card-excerpt {
          font-size: 1rem;
          color: #212E50;
          opacity: 0.85;
          line-height: 1.55;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          font-size: 0.9rem;
          color: #6C8157;
          margin-top: auto;
          margin-bottom: 12px;
        }
        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .card-link-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0 0;
          font-size: 1rem;
          font-weight: 600;
          color: #7C2A3C;
          border-top: 1px solid rgba(33, 46, 80, 0.08);
          transition: color 0.2s;
        }
        .article-card:hover .card-link-label {
          color: #212E50;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }
        .btn-pag {
          padding: 10px 20px;
          border: 1px solid rgba(33, 46, 80, 0.2);
          border-radius: 10px;
          background: #fff;
          color: #212E50;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-pag:hover:not(:disabled) {
          border-color: #6C8157;
          color: #6C8157;
        }
        .btn-pag:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pag-info {
          font-size: 0.9rem;
          color: #212E50;
          opacity: 0.8;
        }
        .feed-empty {
          text-align: center;
          padding: 64px 20px;
          background: #fff;
          border-radius: 20px;
          border: 2px solid #212E50;
          box-shadow: 0 4px 24px rgba(33, 46, 80, 0.08);
        }
        .empty-icon {
          color: #C7A11E;
          margin-bottom: 20px;
          opacity: 0.8;
        }
        .feed-empty h2 {
          font-size: 1.5rem;
          color: #212E50;
          margin-bottom: 12px;
        }
        .feed-empty p {
          color: #212E50;
          opacity: 0.85;
          margin-bottom: 24px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #7C2A3C, #212E50);
          color: #F8F8F0;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124, 42, 60, 0.35);
        }
        .cta-section {
          max-width: 800px;
          margin: 64px auto 0;
          padding: 0 20px;
        }
        .cta-box {
          background: linear-gradient(135deg, #212E50 0%, #7C2A3C 100%);
          color: #F8F8F0;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          border: 2px solid rgba(199, 161, 30, 0.3);
        }
        .cta-box h2 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #F8F8F0;
        }
        .cta-box p {
          opacity: 0.95;
          margin-bottom: 24px;
          color: #F8F8F0;
        }
        .cta-box .btn-primary {
          background: #C7A11E;
          color: #212E50;
        }
        .cta-box .btn-primary:hover {
          background: #d4ad2a;
          color: #212E50;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 1.85rem; }
          .feed-grid { grid-template-columns: 1fr; gap: 28px; }
          .card-body { padding: 20px 20px 16px; }
        }
      `}</style>
    </>
  );
}
