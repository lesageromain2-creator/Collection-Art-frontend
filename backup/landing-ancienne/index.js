import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Scale, TrendingUp, Palette, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HermesSection = dynamic(() => import('../components/HermesSection'), { ssr: false });

// Mapping rubriques → images (dossier public/images)
const RUBRIQUES_IMAGES = {
  'histoire-arts': '/images/Histoire des arts.png',
  'fil-oeuvres': '/images/au fil des oeuvres.png',
  'art-contemporain': '/images/art contempo.jpg.jpeg',
  'tribunal-arts': '/images/tribunal des arts.jpeg',
  'marche-art': '/images/marche-art.jpg',
};

const rubriques = [
  {
    id: 'histoire-arts',
    title: 'Histoire des arts',
    description: "Découvrez l'histoire de l'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard.",
    icon: BookOpen,
    color: 'burgundy',
    hex: '#7C2A3C',
  },
  {
    id: 'fil-oeuvres',
    title: 'Au fil des œuvres',
    description: "Explorez en profondeur les œuvres qui ont marqué l'histoire de l'art, leurs secrets et leur contexte de création.",
    icon: Palette,
    color: 'olive',
    hex: '#6C8157',
  },
  {
    id: 'art-contemporain',
    title: 'Art contemporain',
    description: "Plongez dans l'art d'aujourd'hui : tendances, artistes émergents et enjeux de la création contemporaine.",
    icon: Sparkles,
    color: 'gold',
    hex: '#C7A11E',
  },
  {
    id: 'tribunal-arts',
    title: 'Tribunal des arts',
    description: "Analyse des procès et affaires judiciaires qui ont secoué le monde de l'art, entre droit et patrimoine.",
    icon: Scale,
    color: 'navy',
    hex: '#212E50',
  },
  {
    id: 'marche-art',
    title: "Marché de l'art",
    description: "Décryptage des dynamiques du marché de l'art : ventes aux enchères, tendances, valorisation et circulation des œuvres.",
    icon: TrendingUp,
    color: 'burgundy',
    hex: '#7C2A3C',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const demoSettings = {
    site_name: "Collection Aur'art",
    site_description: "L'Association de passionnés qui s'engage à valoriser le patrimoine artistique sous toutes ses formes",
    email: 'collection.aurart@gmail.com',
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        {/* Hero d'accueil — logo transparent sur fond beige artistique */}
        <section className="hero-welcome">
          <div className="hero-welcome-bg">
            <div className="hero-art-bg" aria-hidden />
            <div className="hero-orb hero-orb--olive" aria-hidden />
            <div className="hero-orb hero-orb--burgundy" aria-hidden />
            <div className="hero-orb hero-orb--gold" aria-hidden />
            <div className="hero-orb hero-orb--pink" aria-hidden />
          </div>
          <div className="hero-welcome-inner">
            <div className="hero-logo-frame">
              <div className="hero-logo-border hero-logo-border--1" />
              <div className="hero-logo-border hero-logo-border--2" />
              <div className="hero-logo-wrap logo-hero-reveal">
                <Image
                  src="/images/Logo final transparent.png"
                  alt="Collection Aur'art"
                  fill
                  className="object-contain object-center"
                  priority
                  sizes="(max-width: 768px) 90vw, min(70vmin, 520px)"
                />
              </div>
            </div>
            <p className="hero-subtitle">Esquisses de l&apos;Art & son marché</p>
          </div>
        </section>

        <style jsx>{`
          .hero-welcome {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: linear-gradient(
              135deg,
              #F9F6F0 0%,
              #F5F0E8 25%,
              #EDE6DC 50%,
              #F0EBE3 75%,
              #F9F6F0 100%
            );
          }
          .hero-welcome-bg {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }
          .hero-art-bg {
            position: absolute;
            inset: 0;
            background-image:
              radial-gradient(circle at 20% 30%, rgba(199, 161, 30, 0.04) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(124, 42, 60, 0.03) 0%, transparent 35%),
              repeating-linear-gradient(
                105deg,
                transparent,
                transparent 60px,
                rgba(108, 129, 87, 0.02) 60px,
                rgba(108, 129, 87, 0.02) 61px
              );
          }
          .hero-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.1;
            animation: heroOrbFloat 25s ease-in-out infinite;
          }
          .hero-orb--olive {
            width: 400px;
            height: 400px;
            background: #6C8157;
            top: 10%;
            left: 5%;
            animation-delay: 0s;
          }
          .hero-orb--burgundy {
            width: 350px;
            height: 350px;
            background: #7C2A3C;
            top: 60%;
            right: 10%;
            animation-delay: -6s;
          }
          .hero-orb--gold {
            width: 300px;
            height: 300px;
            background: #C7A11E;
            bottom: 15%;
            left: 15%;
            animation-delay: -12s;
          }
          .hero-orb--pink {
            width: 320px;
            height: 320px;
            background: #F1B2C8;
            top: 20%;
            right: 20%;
            animation-delay: -18s;
          }
          @keyframes heroOrbFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -30px) scale(1.05); }
            50% { transform: translate(-15px, 20px) scale(0.98); }
            75% { transform: translate(25px, 15px) scale(1.02); }
          }
          .hero-welcome-inner {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem 3rem;
            text-align: center;
          }
          .hero-logo-frame {
            position: relative;
            width: min(90vw, min(75vmin, 560px));
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .hero-logo-border {
            position: absolute;
            border-radius: 24px;
            border: 2px solid;
            pointer-events: none;
          }
          .hero-logo-border--1 {
            inset: -10px;
            border-color: rgba(108, 129, 87, 0.35);
            animation: heroBorderPulse 4s ease-in-out infinite;
          }
          .hero-logo-border--2 {
            inset: -20px;
            border-color: rgba(199, 161, 30, 0.25);
            animation: heroBorderPulse 4s ease-in-out infinite 0.5s;
          }
          .hero-logo-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 20px;
            overflow: visible;
            background: transparent;
            box-shadow: none;
          }
          @keyframes heroBorderPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          .logo-hero-reveal {
            opacity: 0;
            transform: scale(0.85);
            animation: logoHeroReveal 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
          }
          @keyframes logoHeroReveal {
            0% {
              opacity: 0;
              transform: scale(0.85);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .hero-subtitle {
            margin-top: 1.5rem;
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 1.125rem;
            font-weight: 500;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #7C2A3C;
          }
          @media (min-width: 768px) {
            .hero-subtitle {
              font-size: 1.25rem;
              letter-spacing: 0.25em;
              margin-top: 2rem;
            }
          }
        `}</style>

        {/* Statue 3D + titre + contenu */}
        <main id="main-content" className="relative z-10">
          <HermesSection rubriques={rubriques}>
          {/* Section présentation — palette beige + quatre couleurs */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-6 bg-creme">
            <div className="absolute top-0 left-0 right-0 h-1 flex" aria-hidden>
              <span className="flex-1 bg-olive/40" />
              <span className="flex-1 bg-burgundy/40" />
              <span className="flex-1 bg-gold/40" />
              <span className="flex-1 bg-pink/40" />
            </div>
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-navy mb-4 leading-tight">
                Collection Aur'art
              </h1>
              <p className="text-xl md:text-2xl text-burgundy/90 font-light tracking-wide mb-6">
                Esquisses de l'Art & son marché
              </p>
              <p className="text-base md:text-lg text-gris max-w-2xl mx-auto mb-10 leading-relaxed">
                L'Association de passionnés qui s'engage à valoriser le patrimoine artistique sous toutes ses « formes »
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/articles"
                  className="group inline-flex items-center justify-center gap-2 bg-primary-gradient text-creme px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Découvrir nos articles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-navy/30 text-navy px-8 py-3 rounded-full font-medium hover:border-burgundy hover:text-burgundy transition-all"
                >
                  Notre équipe
                </Link>
              </div>
            </div>
          </section>

          {/* PRÉSENTATION DE L'ASSOCIATION */}
          <section className="py-20 md:py-32 px-6 bg-creme">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mb-6">
                  Notre mission
                </h2>
                <div className="w-32 h-1 flex mx-auto rounded-full overflow-hidden">
                  <span className="flex-1 bg-olive" />
                  <span className="flex-1 bg-burgundy" />
                  <span className="flex-1 bg-gold" />
                  <span className="flex-1 bg-pink" />
                </div>
              </div>
              <div className="space-y-6 text-justify">
                <p className="text-base md:text-lg text-gris leading-relaxed">
                  Notre association se donne pour mission de questionner, valoriser et transmettre l'histoire de l'art dans toute sa complexité. À travers nos articles, nous explorons les œuvres, les courants artistiques, les procès, les dynamiques du marché de l'art et les enjeux contemporains de la protection patrimoniale.
                </p>
                <p className="text-base md:text-lg text-gris leading-relaxed">
                  Nous refusons une approche élitiste de l'art qui le cantonne aux cercles initiés. Notre conviction est que la compréhension des œuvres, leur contexte historique et leur circulation actuelle constituent un enjeu culturel fondamental. L'art n'est pas un luxe réservé à quelques-uns : c'est un patrimoine commun qui façonne notre regard sur le monde et notre rapport à l'histoire.
                </p>
                <p className="text-base md:text-lg text-gris leading-relaxed">
                  Nos rubriques interrogent aussi bien la beauté formelle des créations que les questions juridiques, économiques et éthiques qui traversent le marché de l'art. Nous analysons les ventes aux enchères, les procès, décryptons les tendances, documentons les débats.
                </p>
                <p className="text-base md:text-lg text-gris leading-relaxed">
                  Écrire sur l'art, c'est aussi prendre position : face aux inégalités d'accès à la culture, face à la marchandisation croissante des œuvres, face à l'urgence de préserver et transmettre notre héritage artistique. C'est notre façon de contribuer à une culture vivante, critique et partagée.
                </p>
              </div>
            </div>
          </section>

          {/* NOS RUBRIQUES - Avec images */}
          <section className="py-20 md:py-32 px-6 bg-creme">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mb-6">
                  Nos rubriques
                </h2>
                <p className="text-lg text-gris max-w-2xl mx-auto">
                  Parcourez nos thématiques artistiques et découvrez nos analyses approfondies
                </p>
                <div className="w-32 h-1 flex mx-auto rounded-full overflow-hidden mt-6">
                  <span className="flex-1 bg-olive" />
                  <span className="flex-1 bg-burgundy" />
                  <span className="flex-1 bg-gold" />
                  <span className="flex-1 bg-pink" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {rubriques.map((rubrique) => {
                  const Icon = rubrique.icon;
                  const imageSrc = RUBRIQUES_IMAGES[rubrique.id];
                  return (
                    <Link
                      key={rubrique.id}
                      href={`/rubriques/${rubrique.id}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 md:h-56 overflow-hidden">
                        {imageSrc ? (
                          <>
                            <Image
                              src={imageSrc}
                              alt={rubrique.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div
                              className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-40"
                              style={{ background: `linear-gradient(180deg, transparent 0%, ${rubrique.hex} 100%)` }}
                            />
                          </>
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${rubrique.hex} 0%, #212E50 100%)` }}
                          >
                            <Icon className="h-16 w-16 text-creme/90" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-heading text-xl md:text-2xl font-semibold text-creme drop-shadow-lg">
                            {rubrique.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gris leading-relaxed mb-4 line-clamp-2">
                          {rubrique.description}
                        </p>
                        <div className="inline-flex items-center gap-2 text-burgundy font-medium text-sm group-hover:gap-3 transition-all">
                          Découvrir
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/rubriques"
                  className="inline-flex items-center gap-2 text-navy hover:text-burgundy transition-colors font-medium"
                >
                  Voir toutes les rubriques
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION CTA */}
          <section className="py-20 md:py-32 px-6 bg-creme">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex h-16 w-16 rounded-full items-center justify-center shadow-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #6C8157, #7C2A3C, #C7A11E, #F1B2C8)' }}>
                  <BookOpen className="h-8 w-8 text-creme" />
                </div>
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mb-6">
                Rejoignez notre communauté
              </h2>
              <p className="text-lg text-gris mb-8 max-w-2xl mx-auto leading-relaxed">
                Découvrez nos derniers articles, analyses et réflexions sur l'art, son histoire et son marché. Une culture artistique vivante, critique et partagée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-creme px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Lire nos articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-navy/20 text-navy px-8 py-3 rounded-full font-medium hover:border-burgundy hover:text-burgundy transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </section>
          </HermesSection>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
