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

        {/* Image d'accueil — logo centré, animation d'entrée artistique */}
        <section
          className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
          style={{
            paddingTop: '0.5rem',
            background: 'linear-gradient(165deg, #15182a 0%, #1a1f38 35%, #212E50 70%, #161b2e 100%)',
          }}
        >
          <div
            className="logo-hero-reveal relative aspect-square flex items-center justify-center"
            style={{ width: 'min(100vw, calc(100vh - 1rem))' }}
          >
            <Image
              src="/images/logo avec fond.png"
              alt="Collection Aur'art"
              fill
              className="object-contain object-center"
              priority
              sizes="100vw"
            />
          </div>
        </section>

        <style jsx global>{`
          @keyframes logoHeroReveal {
            0% {
              opacity: 0;
              transform: scale(0.72);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .logo-hero-reveal {
            animation: logoHeroReveal 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}</style>

        {/* Statue 3D + titre + contenu */}
        <main id="main-content" className="relative z-10">
          <HermesSection rubriques={rubriques}>
          {/* Section présentation */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-6 bg-creme">
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
          <section className="py-20 md:py-32 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-navy mb-6">
                  Notre mission
                </h2>
                <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full" />
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
                <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mt-6" />
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
          <section className="py-20 md:py-32 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex h-16 w-16 rounded-full bg-primary-gradient items-center justify-center shadow-lg">
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
