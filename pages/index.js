import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicArticles } from '../utils/api';

// Rubriques dans l'ordre du prompt : Marché de l'art, Art contemporain, Histoire de l'art, Tribunal des arts, Au fil des œuvres
const RUBRIQUES_ORDER = ['marche-art', 'art-contemporain', 'histoire-arts', 'tribunal-arts', 'fil-oeuvres'];

const RUBRIQUES_DATA = {
  'marche-art': { title: "Marché de l'art", image: '/images/marche.jpeg' },
  'art-contemporain': { title: 'Art contemporain', image: '/images/art contempo.jpg.jpeg' },
  'histoire-arts': { title: "Histoire de l'art", image: '/images/Histoire des arts.png' },
  'tribunal-arts': { title: 'Tribunal des arts', image: '/images/tribunal des arts.jpeg' },
  'fil-oeuvres': { title: 'Au fil des œuvres', image: '/images/au fil des oeuvres.png' },
};

const IDENTITE_ITEMS = [
  {
    src: '/new images/derriere-chaque-oeuvre.jpeg',
    text: 'Derrière chaque œuvre, il y a une histoire qui mérite d\u2019être racontée.',
  },
  {
    src: '/new images/on-explore-art.jpeg',
    text: 'On explore l\u2019art sous tous ses angles\u00a0: beauté, marché, enjeux contemporains.',
  },
  {
    src: '/new images/chaque-mois-recherches.jpeg',
    text: 'Chaque mois, des recherches approfondies pour mieux comprendre l\u2019univers artistique.',
  },
  {
    src: '/new images/collection-aurart-reflexion.jpeg',
    text: 'Collection Aur\u2019art se veut un espace de réflexion, de découverte et de transmission, où l\u2019art se pense autant qu\u2019il se contemple.',
  },
];

export default function Home() {
  const [articles, setArticles] = useState([]);

  const demoSettings = {
    site_name: "Collection Aur'art",
    site_description: "L'Association de passionnés qui s'engage à valoriser le patrimoine artistique sous toutes ses formes",
    email: 'collection.aurart@gmail.com',
  };

  const [pubsPage, setPubsPage] = useState(0);

  useEffect(() => {
    getPublicArticles({ limit: 12 })
      .then(({ articles: list }) => {
        const sorted = (list || []).slice().sort((a, b) => {
          const da = a.publishedAt || a.createdAt || a.updatedAt || 0;
          const db = b.publishedAt || b.createdAt || b.updatedAt || 0;
          return new Date(db) - new Date(da);
        });
        setArticles(sorted);
      })
      .catch(() => setArticles([]));
  }, []);

  const pubsPerPage = 3;
  const pubsMaxPage = Math.max(0, Math.ceil(articles.length / pubsPerPage) - 1);
  const canPrevPubs = pubsPage > 0;
  const canNextPubs = pubsPage < pubsMaxPage;
  const visibleArticles = articles.slice(pubsPage * pubsPerPage, pubsPage * pubsPerPage + pubsPerPage);

  return (
    <>
      <Head>
        <title>Collection Aur'art – Esquisses de l'Art & son marché</title>
        <meta
          name="description"
          content="Association de valorisation du patrimoine artistique. Nous explorons l'histoire de l'art, le marché de l'art et les enjeux juridiques à travers nos articles et analyses."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white">
        <Header settings={demoSettings} />

        <main id="main-content">
        {/* Hero — image plein écran, overlay titre + slogan + CTA */}
        <section className="hero-home">
          <div className="hero-home-bg">
            <img
              src="/new images/image acceuil principale.jpeg"
              alt=""
              className="hero-home-bg-img"
            />
          </div>
          <div className="hero-home-content">
            <h1 className="hero-home-title">Collection Aur&apos;art</h1>
            <p className="hero-home-subtitle">Esquisses de l&apos;art et son marché</p>
          </div>
          <Link href="/articles" className="hero-home-btn">
            Lire nos articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Rubriques — grille pleine largeur */}
        <section className="section-rubriques">
          <h2 className="section-rubriques-title">Les rubriques</h2>
          <div className="section-rubriques-grid">
            {RUBRIQUES_ORDER.map((id) => {
              const data = RUBRIQUES_DATA[id];
              if (!data) return null;
              return (
                <Link
                  key={id}
                  href={`/rubriques/${id}`}
                  className="section-rubriques-card"
                >
                  <div className="section-rubriques-card-img">
                    <Image
                      src={data.image}
                      alt={data.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                  <h3 className="section-rubriques-card-title">{data.title}</h3>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Dernières publications — grille 3 colonnes, pagination par 3 */}
        <section className="section-pubs">
          <h2 className="section-pubs-title">Dernières publications</h2>
          {articles.length === 0 ? (
            <p className="section-pubs-empty">Aucun article pour le moment.</p>
          ) : (
            <>
              <div className="section-pubs-grid">
                {visibleArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug || art.id}`}
                    className="section-pubs-card"
                  >
                    <div className="section-pubs-card-frame">
                      <div className="section-pubs-card-cover">
                        {(art.featured_image_url || art.imageUrl) ? (
                          <img
                            src={art.featured_image_url || art.imageUrl}
                            alt=""
                            className="section-pubs-card-img"
                          />
                        ) : (
                          <div className="section-pubs-card-placeholder" />
                        )}
                      </div>
                      <div className="section-pubs-card-body">
                        {(art.rubrique?.title || art.rubriqueName) && (
                          <span className="section-pubs-card-rubrique">
                            {(art.rubrique?.title || art.rubriqueName).toUpperCase()}
                          </span>
                        )}
                        <h3 className="section-pubs-card-title">{art.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {(canPrevPubs || canNextPubs) && (
                <div className="section-pubs-nav">
                  <button
                    type="button"
                    className="section-pubs-nav-btn"
                    onClick={() => setPubsPage((p) => Math.max(0, p - 1))}
                    disabled={!canPrevPubs}
                    aria-label="Articles précédents"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="section-pubs-nav-btn"
                    onClick={() => setPubsPage((p) => Math.min(pubsMaxPage, p + 1))}
                    disabled={!canNextPubs}
                    aria-label="Articles suivants"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
          <div className="section-pubs-footer">
            <Link href="/articles" className="section-pubs-link">
              Voir tous les articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Identité de l'association — mosaïque artistique */}
        <section className="section-identite">
          <h2 className="section-identite-title">Notre identité</h2>
          <div className="section-identite-mosaic">
            {IDENTITE_ITEMS.map((item, i) => (
              <figure key={i} className={`id-fig id-fig--${i}`}>
                <div className="id-fig-img-wrap">
                  <img src={item.src} alt="" className="id-fig-img" />
                </div>
                <figcaption className="id-fig-caption">{item.text}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Nous contacter */}
        <section className="section-contact">
          <div className="section-contact-inner">
            <h2 className="section-contact-title">Nous contacter</h2>
            <p className="section-contact-text">
              Une question, un partenariat ou simplement envie d&apos;échanger ? Écrivez-nous.
            </p>
            <Link href="/contact" className="section-contact-btn">
              Envoyer un message
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        </main>

        <style jsx global>{`
          /* ===== HERO ===== */
          .hero-home {
            position: relative;
            min-height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          @media (min-width: 480px) {
            .hero-home { min-height: 60vh; }
          }
          @media (min-width: 768px) {
            .hero-home { min-height: 80vh; }
          }
          @media (min-width: 1024px) {
            .hero-home { min-height: 100vh; }
          }
          .hero-home-bg {
            position: absolute;
            inset: 0;
            background: #1a1a1a;
            pointer-events: none;
          }
          .hero-home-bg-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          @media (min-width: 1024px) {
            .hero-home-bg-img { object-fit: contain; background: #fff; }
          }
          .hero-home-content {
            position: absolute;
            left: 50%;
            top: 28%;
            transform: translateX(-50%);
            z-index: 1;
            text-align: center;
            padding: 0 1rem;
            width: 100%;
          }
          @media (min-width: 768px) {
            .hero-home-content { top: 32%; padding: 0 1.5rem; }
          }
          .hero-home-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: clamp(2rem, 10vw, 6rem);
            font-weight: 700;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8), 0 2px 12px rgba(0,0,0,0.6), 0 4px 24px rgba(0,0,0,0.4);
            margin: 0 0 0.4rem;
            line-height: 1.1;
          }
          .hero-home-subtitle {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: clamp(1rem, 3.2vw, 1.75rem);
            color: rgba(255,255,255,0.95);
            text-shadow: 0 1px 3px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5);
            margin: 0;
            letter-spacing: 0.08em;
          }
          .hero-home-btn {
            position: absolute;
            left: 50%;
            bottom: 18%;
            transform: translateX(-50%);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 1.25rem;
            background: #4A6B3A;
            color: #fff;
            font-weight: 600;
            font-size: 0.85rem;
            text-decoration: none;
            border-radius: 8px;
            z-index: 2;
            transition: background 0.2s, transform 0.2s;
          }
          .hero-home-btn:hover {
            background: #3a5a2e;
            transform: translateX(-50%) translateY(-2px);
          }
          @media (min-width: 480px) {
            .hero-home-btn { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
          }
          @media (min-width: 768px) {
            .hero-home-btn { padding: 0.875rem 1.75rem; font-size: 1rem; bottom: 22%; }
          }

          /* ===== RUBRIQUES ===== */
          .section-rubriques {
            background: #fff;
            padding: 2rem 0.75rem 2.5rem;
            width: 100%;
            overflow: hidden;
          }
          @media (min-width: 480px) {
            .section-rubriques { padding: 2.5rem 1rem 3rem; }
          }
          @media (min-width: 768px) {
            .section-rubriques { padding: 3.5rem 1.5rem 4.5rem; }
          }
          @media (min-width: 1024px) {
            .section-rubriques { padding: 4rem 2rem 5rem; }
          }
          .section-rubriques-title {
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #4a6b3a;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: center;
            margin: 0 0 1.5rem;
          }
          @media (min-width: 480px) {
            .section-rubriques-title { font-size: 1.25rem; margin: 0 0 1.75rem; }
          }
          @media (min-width: 768px) {
            .section-rubriques-title { font-size: 1.5rem; margin: 0 0 2.5rem; }
          }
          .section-rubriques-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            width: 100%;
            max-width: 80rem;
            margin: 0 auto;
            padding: 0 0.25rem;
          }
          @media (min-width: 480px) {
            .section-rubriques-grid {
              gap: 1rem;
              padding: 0 0.5rem;
            }
          }
          @media (min-width: 640px) {
            .section-rubriques-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 1.25rem;
              padding: 0 1rem;
            }
          }
          @media (min-width: 1024px) {
            .section-rubriques-grid {
              grid-template-columns: repeat(5, 1fr);
              gap: 1.75rem;
              padding: 0 2rem;
            }
          }
          .section-rubriques-card {
            display: block;
            text-decoration: none;
            color: inherit;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            cursor: pointer;
            transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .section-rubriques-card:hover {
            transform: scale(1.06);
            box-shadow: 0 12px 32px rgba(74,107,58,0.18), 0 4px 12px rgba(0,0,0,0.1);
          }
          @media (min-width: 768px) {
            .section-rubriques-card { border-radius: 12px; }
          }
          .section-rubriques-card-img {
            position: relative;
            width: 100%;
            aspect-ratio: 4/3;
            background: #E8B4BC;
            overflow: hidden;
          }
          .section-rubriques-card-img img {
            transition: transform 0.5s ease;
          }
          .section-rubriques-card:hover .section-rubriques-card-img img {
            transform: scale(1.08);
          }
          .section-rubriques-card-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 0.8rem;
            font-weight: 600;
            color: #2d1f2d;
            margin: 0;
            padding: 0.75rem 0.5rem;
            text-align: center;
            transition: color 0.3s ease;
          }
          .section-rubriques-card:hover .section-rubriques-card-title {
            color: #4a6b3a;
          }
          @media (min-width: 480px) {
            .section-rubriques-card-title {
              font-size: 0.85rem;
              padding: 0.85rem 0.6rem;
            }
          }
          @media (min-width: 640px) {
            .section-rubriques-card-title {
              font-size: 0.95rem;
              padding: 1rem 0.75rem;
            }
          }
          @media (min-width: 768px) {
            .section-rubriques-card-title {
              font-size: 1.05rem;
              padding: 1.1rem 0.75rem;
            }
          }
          @media (min-width: 1024px) {
            .section-rubriques-card-title {
              font-size: 1.15rem;
              padding: 1.25rem 1rem;
            }
          }

          /* ===== PUBLICATIONS ===== */
          .section-pubs {
            background: #E8B4BC;
            padding: 2rem 0.5rem 2.5rem;
            overflow: hidden;
          }
          @media (min-width: 480px) {
            .section-pubs { padding: 2rem 0.75rem 3rem; }
          }
          @media (min-width: 768px) {
            .section-pubs { padding: 3rem 1rem 4rem; }
          }
          @media (min-width: 1024px) {
            .section-pubs { padding: 3.5rem 1.5rem 4.5rem; }
          }
          .section-pubs-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #4A6B3A;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            text-align: center;
            margin: 0 0 1.25rem;
          }
          @media (min-width: 480px) {
            .section-pubs-title { font-size: 1.25rem; margin: 0 0 1.5rem; }
          }
          @media (min-width: 768px) {
            .section-pubs-title { font-size: 1.5rem; margin: 0 0 2rem; }
          }
          .section-pubs-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.25rem;
            max-width: 72rem;
            margin: 0 auto;
            padding: 0 0.5rem;
          }
          @media (min-width: 480px) {
            .section-pubs-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
              padding: 0 0.75rem;
            }
          }
          @media (min-width: 768px) {
            .section-pubs-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 2rem;
              padding: 0 1.5rem;
            }
          }
          @media (min-width: 1024px) {
            .section-pubs-grid { gap: 2.25rem; }
          }
          .section-pubs-card {
            display: block;
            text-decoration: none;
            color: inherit;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .section-pubs-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
          }
          .section-pubs-card-frame {
            display: flex;
            flex-direction: column;
            background: transparent;
            overflow: hidden;
          }
          .section-pubs-card-cover {
            width: 100%;
            aspect-ratio: 4/3;
            overflow: hidden;
            border-radius: 8px;
          }
          .section-pubs-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
            transform: scale(1.1);
          }
          .section-pubs-card-placeholder {
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.25);
          }
          .section-pubs-card-body {
            padding: 0.75rem 0.25rem 0;
          }
          @media (min-width: 480px) {
            .section-pubs-card-body { padding: 0.85rem 0.35rem 0; }
          }
          @media (min-width: 768px) {
            .section-pubs-card-body { padding: 1rem 0.5rem 0; }
          }
          .section-pubs-card-rubrique {
            display: block;
            font-family: 'Times New Roman', Georgia, serif;
            font-size: 0.6rem;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #4a6b3a;
            margin-bottom: 0.3rem;
          }
          @media (min-width: 480px) {
            .section-pubs-card-rubrique { font-size: 0.65rem; }
          }
          .section-pubs-card-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 0.95rem;
            font-weight: 600;
            line-height: 1.4;
            color: #2d1f2d;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color 0.3s ease;
          }
          @media (min-width: 480px) {
            .section-pubs-card-title { font-size: 1rem; }
          }
          @media (min-width: 768px) {
            .section-pubs-card-title { font-size: 1.1rem; }
          }
          @media (min-width: 1024px) {
            .section-pubs-card-title { font-size: 1.2rem; }
          }
          .section-pubs-card:hover .section-pubs-card-title {
            color: #4a6b3a;
          }
          .section-pubs-nav {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 1.25rem;
          }
          @media (min-width: 768px) {
            .section-pubs-nav { gap: 1rem; margin-top: 1.5rem; }
          }
          .section-pubs-nav-btn {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: 0;
            background: rgba(255,255,255,0.95);
            color: #4a6b3a;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            transition: background 0.2s, opacity 0.2s, transform 0.2s;
          }
          @media (min-width: 768px) {
            .section-pubs-nav-btn { width: 2.25rem; height: 2.25rem; }
          }
          .section-pubs-nav-btn:hover:not(:disabled) {
            background: #fff;
            transform: scale(1.1);
          }
          .section-pubs-nav-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          .section-pubs-empty {
            text-align: center;
            color: rgba(255,255,255,0.9);
            margin: 0;
            font-size: 0.9rem;
          }
          .section-pubs-footer {
            text-align: center;
            margin-top: 1.5rem;
          }
          @media (min-width: 768px) {
            .section-pubs-footer { margin-top: 2rem; }
          }
          .section-pubs-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #fff;
            font-weight: 600;
            font-size: 0.85rem;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            background: rgba(0,0,0,0.15);
            transition: background 0.2s, transform 0.2s;
          }
          @media (min-width: 768px) {
            .section-pubs-link { font-size: 0.95rem; padding: 0.6rem 1.25rem; }
          }
          .section-pubs-link:hover {
            background: rgba(0,0,0,0.25);
            transform: translateY(-1px);
          }

          /* ===== IDENTITÉ ===== */
          .section-identite {
            background: #fff;
            padding: 2rem 0.75rem 2.5rem;
          }
          @media (min-width: 480px) {
            .section-identite { padding: 2.5rem 1rem 3rem; }
          }
          @media (min-width: 768px) {
            .section-identite { padding: 4rem 1.5rem 5rem; }
          }
          .section-identite-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #4A6B3A;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 1.5rem;
            text-align: center;
          }
          @media (min-width: 480px) {
            .section-identite-title { font-size: 1.25rem; margin: 0 0 2rem; }
          }
          @media (min-width: 768px) {
            .section-identite-title { font-size: 1.5rem; margin: 0 0 3rem; }
          }

          .section-identite-mosaic {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 820px;
            margin: 0 auto;
            padding: 0 0.25rem;
          }
          @media (min-width: 480px) {
            .section-identite-mosaic {
              grid-template-columns: 1fr 1fr;
              column-gap: 0.75rem;
              row-gap: 1.25rem;
              padding: 0;
            }
          }
          @media (min-width: 768px) {
            .section-identite-mosaic {
              column-gap: 3rem;
              row-gap: 3.5rem;
            }
          }

          .id-fig {
            margin: 0;
            padding: 0;
          }

          /* Single column on very small screens */
          @media (max-width: 479px) {
            .id-fig--0,
            .id-fig--1,
            .id-fig--2,
            .id-fig--3 {
              grid-column: 1 !important;
              grid-row: auto !important;
              padding-top: 0 !important;
              margin-top: 0 !important;
            }
          }

          /* Quinconce 2 cols from 480px */
          @media (min-width: 480px) {
            .id-fig--0 { grid-column: 1; grid-row: 1; }
            .id-fig--3 { grid-column: 2; grid-row: 1; padding-top: 2rem; }
            .id-fig--2 { grid-column: 1; grid-row: 2; margin-top: -2rem; }
            .id-fig--1 { grid-column: 2; grid-row: 2; }
          }
          @media (min-width: 768px) {
            .id-fig--0 { grid-column: 1; grid-row: 1; }
            .id-fig--3 { grid-column: 2; grid-row: 1; padding-top: 5rem; }
            .id-fig--2 { grid-column: 1; grid-row: 2; margin-top: -11rem; }
            .id-fig--1 { grid-column: 2; grid-row: 2; padding-top: 1rem; justify-self: center; }
          }

          .id-fig-img-wrap {
            overflow: hidden;
            border-radius: 6px;
          }
          @media (min-width: 768px) {
            .id-fig-img-wrap { border-radius: 0; }
          }
          .id-fig-img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
            transition: transform 0.5s ease;
          }
          .id-fig:hover .id-fig-img {
            transform: scale(1.03);
          }
          .id-fig-caption {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 0.7rem;
            font-style: italic;
            line-height: 1.45;
            color: #4A6B3A;
            margin-top: 0.4rem;
            padding: 0;
          }
          @media (min-width: 480px) {
            .id-fig-caption { font-size: 0.8rem; }
          }
          @media (min-width: 768px) {
            .id-fig-caption {
              font-size: 1rem;
              line-height: 1.6;
              margin-top: 0.65rem;
            }
          }

          /* ===== CONTACT ===== */
          .section-contact {
            background: #f8f4f4;
            padding: 2rem 0.75rem 2.5rem;
          }
          @media (min-width: 480px) {
            .section-contact { padding: 2rem 1rem 3rem; }
          }
          @media (min-width: 768px) {
            .section-contact { padding: 3rem 1rem 4rem; }
          }
          .section-contact-inner {
            max-width: 32rem;
            margin: 0 auto;
            text-align: center;
            padding: 0 0.5rem;
          }
          .section-contact-title {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 1.1rem;
            font-weight: 700;
            color: #4A6B3A;
            margin: 0 0 0.6rem;
          }
          @media (min-width: 480px) {
            .section-contact-title { font-size: 1.25rem; margin: 0 0 0.75rem; }
          }
          @media (min-width: 768px) {
            .section-contact-title { font-size: 1.5rem; }
          }
          .section-contact-text {
            font-size: 0.85rem;
            color: #555;
            margin: 0 0 1rem;
            line-height: 1.5;
          }
          @media (min-width: 480px) {
            .section-contact-text { font-size: 0.9rem; margin: 0 0 1.25rem; }
          }
          @media (min-width: 768px) {
            .section-contact-text { font-size: 1rem; margin: 0 0 1.5rem; }
          }
          .section-contact-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.65rem 1.25rem;
            background: #4A6B3A;
            color: #fff;
            font-weight: 600;
            font-size: 0.85rem;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.2s, transform 0.2s;
          }
          @media (min-width: 480px) {
            .section-contact-btn { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
          }
          @media (min-width: 768px) {
            .section-contact-btn { padding: 0.875rem 1.75rem; font-size: 1rem; }
          }
          .section-contact-btn:hover {
            background: #3a5a2e;
            transform: translateY(-2px);
          }
        `}</style>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}