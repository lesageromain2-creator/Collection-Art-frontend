import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Scale, TrendingUp, Palette, ArrowLeft, Calendar, User, Sparkles, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getPublicArticles, fetchSettings } from '../../utils/api';

const formatDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

// Chemins sans apostrophe dans l’URL pour éviter 404 (marche-art servi via rewrite)
const RUBRIQUES_IMAGES = {
  'histoire-arts': '/images/Histoire des arts.png',
  'fil-oeuvres': '/images/au fil des oeuvres.png',
  'art-contemporain': '/images/art contempo.jpg.jpeg',
  'tribunal-arts': '/images/tribunal des arts.jpeg',
  'marche-art': '/images/marche-art.jpg',
};

const rubriquesConfig = {
  'histoire-arts': {
    title: 'Histoire des arts',
    description: "Découvrez l'histoire de l'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard sur le monde.",
    longDescription: "Cette rubrique explore l'évolution de l'art depuis l'Antiquité jusqu'à nos jours. Nous analysons les mouvements artistiques majeurs, les révolutions esthétiques et les figures qui ont marqué l'histoire de l'art.",
    icon: BookOpen,
    color: '#7C2A3C',
    hex: '#7C2A3C',
  },
  'fil-oeuvres': {
    title: 'Au fil des œuvres',
    description: "Explorez en profondeur les œuvres qui ont marqué l'histoire de l'art, leurs secrets, leur contexte de création et leur impact culturel.",
    longDescription: "Des analyses détaillées d'œuvres d'art emblématiques. Nous décryptons les techniques, les symboles, les contextes historiques et les histoires fascinantes derrière les chefs-d'œuvre.",
    icon: Palette,
    color: '#6C8157',
    hex: '#6C8157',
  },
  'art-contemporain': {
    title: 'Art contemporain',
    description: "Plongez dans l'art d'aujourd'hui : tendances, artistes émergents et enjeux de la création contemporaine.",
    longDescription: "L'art contemporain interroge notre époque. Nous explorons les courants actuels, les artistes qui font l'actualité et les questions que soulève la création d'aujourd'hui.",
    icon: Sparkles,
    color: '#C7A11E',
    hex: '#C7A11E',
  },
  'tribunal-arts': {
    title: 'Tribunal des arts',
    description: "Analyse des procès et affaires judiciaires qui ont secoué le monde de l'art, entre droit, éthique et patrimoine culturel.",
    longDescription: "Les grandes affaires juridiques du monde de l'art : vols, faux, restitutions, droits d'auteur. Nous analysons les enjeux juridiques et éthiques qui façonnent le marché de l'art.",
    icon: Scale,
    color: '#212E50',
    hex: '#212E50',
  },
  'marche-art': {
    title: "Marché de l'art",
    description: "Décryptage des dynamiques du marché de l'art : ventes aux enchères, tendances, valorisation et circulation des œuvres contemporaines.",
    longDescription: "Analyses économiques et financières du marché de l'art. Ventes records, tendances de collection, nouveaux acteurs et transformations du secteur artistique.",
    icon: TrendingUp,
    color: '#7C2A3C',
    hex: '#7C2A3C',
  },
};

export default function RubriquePage() {
  const router = useRouter();
  const { slug } = router.query;
  const rubrique = slug ? rubriquesConfig[slug] : null;
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState({ site_name: "Collection Aur'art" });
  const [loading, setLoading] = useState(true);
  const [heroImageError, setHeroImageError] = useState(false);
  const imageSrc = slug ? RUBRIQUES_IMAGES[slug] : null;
  const showHeroImage = imageSrc && !heroImageError;

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const [res, settingsRes] = await Promise.all([
          getPublicArticles({ rubrique: slug, limit: 24 }),
          fetchSettings().catch(() => ({})),
        ]);
        setArticles(res.articles || []);
        if (settingsRes?.site_name) setSettings(settingsRes);
      } catch (e) {
        console.error(e);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    setHeroImageError(false);
  }, [slug]);

  if (!rubrique) {
    return (
      <>
        <Head>
          <title>Rubrique introuvable – Collection Aur'art</title>
        </Head>
        <div className="min-h-screen bg-creme">
          <Header settings={settings} />
          <main className="px-6 py-20 text-center">
            <h1 className="font-heading text-3xl font-bold text-navy mb-4">
              Rubrique introuvable
            </h1>
            <Link href="/rubriques" className="text-burgundy hover:underline">
              Retour aux rubriques
            </Link>
          </main>
          <Footer settings={settings} />
        </div>
      </>
    );
  }

  const Icon = rubrique.icon;

  return (
    <>
      <Head>
        <title>{rubrique.title} – {settings.site_name}</title>
        <meta name="description" content={rubrique.description} />
      </Head>

      <div className="min-h-screen rubrique-page">
        <Header settings={settings} />

        <main className="px-0 pb-20 md:pb-32">
          {/* Hero avec image de rubrique - pleine largeur, élégant */}
          <section className="relative w-full h-[45vh] min-h-[320px] md:h-[55vh] overflow-hidden">
            {showHeroImage ? (
              <>
                <Image
                  src={imageSrc}
                  alt={rubrique.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  onError={() => setHeroImageError(true)}
                  unoptimized={imageSrc?.includes('marche-art')}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, rgba(33, 46, 80, 0.5) 0%, rgba(124, 42, 60, 0.4) 50%, ${rubrique.hex} 100%)`,
                  }}
                />
              </>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${rubrique.hex} 0%, #212E50 100%)`,
                }}
              >
                <Icon className="h-24 w-24 text-creme/90" />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
              <div className="max-w-6xl mx-auto w-full">
                <Link
                  href="/rubriques"
                  className="inline-flex items-center gap-2 text-creme/90 hover:text-creme text-sm mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux rubriques
                </Link>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-creme drop-shadow-lg">
                  {rubrique.title}
                </h1>
                <div
                  className="w-20 h-1 rounded-full mt-4"
                  style={{ backgroundColor: 'rgba(248, 248, 240, 0.9)' }}
                />
              </div>
            </div>
          </section>

          {/* Contenu */}
          <section className="mx-auto max-w-4xl px-6 -mt-16 relative z-10">
            <div className="bg-white rounded-2xl shadow-xl border border-navy/5 p-8 md:p-12">
              <p className="text-lg md:text-xl text-gris leading-relaxed mb-6">
                {rubrique.description}
              </p>
              <p className="text-base text-gris leading-relaxed">
                {rubrique.longDescription}
              </p>
            </div>
          </section>

          {/* Feed articles de la rubrique */}
          <section className="rubrique-feed mx-auto max-w-6xl px-6 mt-16">
            {loading ? (
              <div className="feed-loading">
                <div className="spinner" />
                <p>Chargement des articles...</p>
              </div>
            ) : articles.length > 0 ? (
              <div className="feed-grid">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="article-card"
                  >
                    <div className="card-frame">
                      <div className="card-mat">
                        <div className="card-cover">
                          {article.featured_image_url ? (
                            <img
                              src={article.featured_image_url}
                              alt=""
                              className="card-cover-img"
                            />
                          ) : (
                            <div className="card-cover-placeholder">
                              <Icon size={56} />
                            </div>
                          )}
                          <span
                            className="card-badge"
                            style={{
                              backgroundColor: rubrique.hex + '22',
                              color: rubrique.hex,
                            }}
                          >
                            {rubrique.title}
                          </span>
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
            ) : (
              <div className="feed-empty">
                <div className="empty-icon" style={{ color: rubrique.hex }}>
                  <Icon size={64} />
                </div>
                <h2>Bientôt disponible</h2>
                <p>
                  Les articles de cette rubrique seront prochainement disponibles. Découvrez tous nos articles en attendant.
                </p>
                <Link href="/articles" className="btn-primary">
                  Découvrir tous nos articles
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </section>

          {/* CTA Newsletter */}
          <section className="mx-auto max-w-4xl px-6 mt-20">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-navy/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
                Ne manquez rien de nos publications
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Recevez nos derniers articles directement dans votre boîte mail et restez informé de l'actualité artistique
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-creme px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Nous contacter
              </Link>
            </div>
          </section>
        </main>

        <Footer settings={settings} />

        <style jsx>{`
          .rubrique-page { background: #F8F8F0; }
          .rubrique-feed .feed-loading {
            text-align: center;
            padding: 64px 20px;
            color: #212E50;
          }
          .rubrique-feed .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(108, 129, 87, 0.2);
            border-top-color: #6C8157;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .rubrique-feed .feed-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 36px;
          }
          .rubrique-feed .article-card {
            display: block;
            text-decoration: none;
            color: inherit;
            transition: transform 0.3s ease;
          }
          .rubrique-feed .article-card:hover {
            transform: translateY(-6px);
          }
          .rubrique-feed .card-frame {
            background: linear-gradient(145deg, #fff 0%, #fafaf8 100%);
            border: none;
            border-radius: 12px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(33, 46, 80, 0.08),
                        0 12px 40px rgba(33, 46, 80, 0.06);
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.35s ease;
          }
          .rubrique-feed .article-card:hover .card-frame {
            box-shadow: 0 8px 28px rgba(33, 46, 80, 0.12),
                        0 20px 56px rgba(33, 46, 80, 0.1);
          }
          .rubrique-feed .card-mat {
            background: #F8F8F0;
            border-radius: 12px;
            overflow: hidden;
            border: none;
          }
          .rubrique-feed .card-cover {
            position: relative;
            aspect-ratio: 16/10;
            background: #212E50;
            overflow: hidden;
          }
          .rubrique-feed .card-cover-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }
          .rubrique-feed .article-card:hover .card-cover-img {
            transform: scale(1.06);
          }
          .rubrique-feed .card-cover-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(248, 248, 240, 0.35);
          }
          .rubrique-feed .card-badge {
            position: absolute;
            top: 14px;
            left: 14px;
            padding: 8px 14px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.02em;
          }
          .rubrique-feed .card-body {
            padding: 24px 28px 20px;
            display: flex;
            flex-direction: column;
          }
          .rubrique-feed .card-title {
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
          .rubrique-feed .article-card:hover .card-title {
            color: #7C2A3C;
          }
          .rubrique-feed .card-excerpt {
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
          .rubrique-feed .card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            font-size: 0.9rem;
            color: #6C8157;
            margin-top: auto;
            margin-bottom: 12px;
          }
          .rubrique-feed .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .rubrique-feed .card-link-label {
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
          .rubrique-feed .article-card:hover .card-link-label {
            color: #212E50;
          }
          .rubrique-feed .feed-empty {
            text-align: center;
            padding: 64px 20px;
            background: #fff;
            border-radius: 20px;
            border: 2px solid #212E50;
            box-shadow: 0 4px 24px rgba(33, 46, 80, 0.08);
          }
          .rubrique-feed .empty-icon { margin-bottom: 20px; opacity: 0.8; }
          .rubrique-feed .feed-empty h2 { font-size: 1.5rem; color: #212E50; margin-bottom: 12px; }
          .rubrique-feed .feed-empty p { color: #212E50; opacity: 0.85; margin-bottom: 24px; }
          .rubrique-feed .btn-primary {
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
          .rubrique-feed .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(124, 42, 60, 0.35);
          }
          @media (max-width: 768px) {
            .rubrique-feed .feed-grid { grid-template-columns: 1fr; gap: 28px; }
            .rubrique-feed .card-body { padding: 20px 20px 16px; }
          }
        `}</style>
      </div>
    </>
  );
}
