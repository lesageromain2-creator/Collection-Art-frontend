import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, BookOpen, Scale, TrendingUp, Palette, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const rubriques = [
  {
    id: 'histoire-arts',
    title: 'Histoire des arts',
    description: 'Découvrez l\'histoire de l\'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard.',
    icon: BookOpen,
    color: 'framboise',
  },
  {
    id: 'fil-oeuvres',
    title: 'Au fil des œuvres',
    description: 'Explorez en profondeur les œuvres qui ont marqué l\'histoire de l\'art, leurs secrets et leur contexte de création.',
    icon: Palette,
    color: 'violet-profond',
  },
  {
    id: 'tribunal-arts',
    title: 'Tribunal des arts',
    description: 'Analyse des procès et affaires judiciaires qui ont secoué le monde de l\'art, entre droit et patrimoine.',
    icon: Scale,
    color: 'orange',
  },
  {
    id: 'marche-art',
    title: 'Marché de l\'art',
    description: 'Décryptage des dynamiques du marché de l\'art : ventes aux enchères, tendances, valorisation et circulation des œuvres.',
    icon: TrendingUp,
    color: 'violet-clair',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const demoSettings = {
    site_name: 'Collection Aur\'art',
    site_description: 'L\'Association de passionnés qui s\'engage à valoriser le patrimoine artistique sous toutes ses formes',
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

        {/* HERO SECTION - Inspiré d'aoede.law */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
          {/* Effet de fond subtil */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(214, 51, 132, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(106, 44, 112, 0.3) 0%, transparent 50%)',
              }}
            />
          </div>

          <div className={`relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Logo Circle */}
            <div className="mb-8 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white font-serif">A</span>
              </div>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold text-anthracite mb-6 leading-tight">
              Collection Aur'art
            </h1>
            
            <p className="text-xl md:text-2xl text-gris mb-8 font-light tracking-wide">
              Esquisses de l'Art & son marché
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-base md:text-lg text-gris leading-relaxed">
                L'Association de passionnés qui s'engage à valoriser le patrimoine artistique sous toutes ses « formes »
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/articles"
                className="group inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Découvrir nos articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center gap-2 border-2 border-anthracite/20 text-anthracite px-8 py-3 rounded-full font-medium hover:border-framboise hover:text-framboise transition-all"
              >
                Notre équipe
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="h-6 w-6 text-gris" />
            </div>
          </div>
        </section>

        {/* PRÉSENTATION DE L'ASSOCIATION */}
        <section className="py-20 md:py-32 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-anthracite mb-6">
                Notre mission
              </h2>
              <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full"></div>
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

        {/* NOS RUBRIQUES */}
        <section className="py-20 md:py-32 px-6 bg-creme">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-anthracite mb-6">
                Nos rubriques
              </h2>
              <p className="text-lg text-gris max-w-2xl mx-auto">
                Parcourez nos thématiques artistiques et découvrez nos analyses approfondies
              </p>
              <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {rubriques.map((rubrique, index) => {
                const Icon = rubrique.icon;
                return (
                  <Link
                    key={rubrique.id}
                    href={`/rubriques/${rubrique.id}`}
                    className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-anthracite/5"
                  >
                    <div className="flex items-start gap-5">
                      <div className={`flex-shrink-0 h-14 w-14 rounded-full bg-${rubrique.color}/10 flex items-center justify-center`}>
                        <Icon className={`h-7 w-7 text-${rubrique.color}`} style={{color: rubrique.color === 'framboise' ? '#D63384' : rubrique.color === 'violet-profond' ? '#6A2C70' : rubrique.color === 'orange' ? '#E67E22' : '#9B59B6'}} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl md:text-2xl font-semibold text-anthracite mb-3 group-hover:text-framboise transition-colors">
                          {rubrique.title}
                        </h3>
                        <p className="text-gris leading-relaxed mb-4">
                          {rubrique.description}
                        </p>
                        <div className="inline-flex items-center gap-2 text-framboise font-medium text-sm">
                          Découvrir
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/rubriques"
                className="inline-flex items-center gap-2 text-anthracite hover:text-framboise transition-colors font-medium"
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
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-anthracite mb-6">
              Rejoignez notre communauté
            </h2>
            <p className="text-lg text-gris mb-8 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos derniers articles, analyses et réflexions sur l'art, son histoire et son marché. Une culture artistique vivante, critique et partagée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Lire nos articles
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-anthracite/20 text-anthracite px-8 py-3 rounded-full font-medium hover:border-framboise hover:text-framboise transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
