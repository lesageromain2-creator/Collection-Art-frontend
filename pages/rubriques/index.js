import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Scale, TrendingUp, Palette, ArrowRight, Sparkles, UserRound, Newspaper, PenLine } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AssociationLogo from '../../components/AssociationLogo';

const demoSettings = {
  site_name: "Collection Aur'art",
  email: 'collection.aurart@gmail.com',
};

const RUBRIQUES_IMAGES = {
  'histoire-arts': '/images/landing/histoire-arts.jpg',
  'fil-oeuvres': '/images/landing/au-fil.jpg',
  'art-contemporain': '/images/landing/art-contemporain.jpg',
  'tribunal-arts': '/images/landing/tribunal.jpg',
  'marche-art': '/images/landing/marche-art.jpg',
  portraits: '/images/landing/portrait.jpg',
  'billets-art': '/images/landing/au-fil.jpg',
  actualites: '/images/landing/actualites.jpg',
};

const rubriques = [
  {
    id: 'histoire-arts',
    title: 'Histoire des arts',
    slug: 'histoire-arts',
    description: "Découvrez l'histoire de l'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard sur le monde.",
    longDescription: "Cette rubrique explore l'évolution de l'art depuis l'Antiquité jusqu'à nos jours. Nous analysons les mouvements artistiques majeurs, les révolutions esthétiques et les figures qui ont marqué l'histoire de l'art.",
    icon: BookOpen,
    color: '#BC4B78',
    hex: '#BC4B78',
    articleCount: 0,
  },
  {
    id: 'fil-oeuvres',
    title: 'Au fil des œuvres',
    slug: 'fil-oeuvres',
    description: "Explorez en profondeur les œuvres qui ont marqué l'histoire de l'art, leurs secrets, leur contexte de création et leur impact culturel.",
    longDescription: "Des analyses détaillées d'œuvres d'art emblématiques. Nous décryptons les techniques, les symboles, les contextes historiques et les histoires fascinantes derrière les chefs-d'œuvre.",
    icon: Palette,
    color: '#8A855E',
    hex: '#8A855E',
    articleCount: 0,
  },
  {
    id: 'art-contemporain',
    title: 'Art contemporain',
    slug: 'art-contemporain',
    description: "Plongez dans l'art d'aujourd'hui : tendances, artistes émergents et enjeux de la création contemporaine.",
    longDescription: "L'art contemporain interroge notre époque. Nous explorons les courants actuels, les artistes qui font l'actualité et les questions que soulève la création d'aujourd'hui.",
    icon: Sparkles,
    color: '#8A855E',
    hex: '#8A855E',
    articleCount: 0,
  },
  {
    id: 'tribunal-arts',
    title: 'Tribunal des arts',
    slug: 'tribunal-arts',
    description: "Analyse des procès et affaires judiciaires qui ont secoué le monde de l'art, entre droit, éthique et patrimoine culturel.",
    longDescription: "Les grandes affaires juridiques du monde de l'art : vols, faux, restitutions, droits d'auteur. Nous analysons les enjeux juridiques et éthiques qui façonnent le marché de l'art.",
    icon: Scale,
    color: '#341E04',
    hex: '#341E04',
    articleCount: 0,
  },
  {
    id: 'marche-art',
    title: "Marché de l'art",
    slug: 'marche-art',
    description: "Décryptage des dynamiques du marché de l'art : ventes aux enchères, tendances, valorisation et circulation des œuvres contemporaines.",
    longDescription: "Analyses économiques et financières du marché de l'art. Ventes records, tendances de collection, nouveaux acteurs et transformations du secteur artistique.",
    icon: TrendingUp,
    color: '#BC4B78',
    hex: '#BC4B78',
    articleCount: 0,
  },
  {
    id: 'portraits',
    title: 'Portraits',
    slug: 'portraits',
    description:
      "Portraits d'artistes, de collectionneurs et de figures du monde de l'art : regards, entretiens et mises en lumière.",
    longDescription:
      "Cette rubrique met en avant les personnalités qui font vivre l'art : créateurs, mécènes, historiens et acteurs du marché. Entretiens, profils et regards croisés pour mieux comprendre ceux qui façonnent la scène artistique.",
    icon: UserRound,
    color: '#BC4B78',
    hex: '#BC4B78',
    articleCount: 0,
  },
  {
    id: 'billets-art',
    title: "Billets d'art",
    slug: 'billets-art',
    description: 'Notes courtes, regards et coups de cœur sur une œuvre, une exposition ou une actualité.',
    longDescription: "Des billets pour aller à l'essentiel : un regard, une émotion, une lecture rapide du monde de l'art.",
    icon: PenLine,
    color: '#8A855E',
    hex: '#8A855E',
    articleCount: 0,
  },
  {
    id: 'actualites',
    title: "Les actualités du monde de l'art",
    slug: 'actualites',
    description: "L'actualité artistique, des musées au marché.",
    longDescription: "Ouvertures, nominations, ventes et débats : ce qui bouge dans le monde de l'art, à Paris, à Lyon et ailleurs.",
    icon: Newspaper,
    color: '#19E7DB',
    hex: '#19E7DB',
    articleCount: 0,
  },
];

export default function RubriquesPage() {
  return (
    <>
      <Head>
        <title>Nos rubriques – Collection Aur'art</title>
        <meta
          name="description"
          content="Explorez nos rubriques : Histoire des arts, Au fil des œuvres, Art contemporain, Tribunal des arts, Marché de l'art, Portraits."
        />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          <section className="mx-auto max-w-4xl text-center mb-20">
            <div className="mb-8 flex justify-center">
              <AssociationLogo size="md" linkToHome />
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-navy mb-6">
              Nos rubriques
            </h1>

            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-8" />

            <p className="text-lg md:text-xl text-gris leading-relaxed">
              Parcourez nos thématiques artistiques et découvrez nos analyses approfondies sur l'art, son histoire et son marché
            </p>
          </section>

          <section className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {rubriques.map((rubrique) => {
                const Icon = rubrique.icon;
                const imageSrc = RUBRIQUES_IMAGES[rubrique.id];
                return (
                  <Link
                    key={rubrique.id}
                    href={`/rubriques/${rubrique.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative h-56 md:h-64 overflow-hidden bg-[#EDDBCE]">
                      {imageSrc ? (
                        <>
                          <Image
                            src={imageSrc}
                            alt={rubrique.title}
                            fill
                            className="object-contain"
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div
                            className="absolute inset-0 opacity-70 transition-opacity group-hover:opacity-50"
                            style={{
                              background: `linear-gradient(180deg, transparent 0%, ${rubrique.hex} 100%)`,
                            }}
                          />
                        </>
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${rubrique.hex} 0%, #341E04 100%)`,
                          }}
                        >
                          <Icon className="h-20 w-20 text-creme/90" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-creme drop-shadow-lg">
                          {rubrique.title}
                        </h2>
                        {rubrique.articleCount > 0 && (
                          <p className="text-creme/90 text-sm mt-1">
                            {rubrique.articleCount} article{rubrique.articleCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gris leading-relaxed mb-4 line-clamp-2">
                        {rubrique.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-burgundy font-medium text-sm group-hover:gap-3 transition-all">
                        Découvrir cette rubrique
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    <div
                      className="h-1.5"
                      style={{ background: `linear-gradient(90deg, ${rubrique.hex}, ${rubrique.hex}99)` }}
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mx-auto max-w-4xl mt-20">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-navy/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
                Découvrez tous nos articles
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Explorez l'ensemble de nos publications et plongez dans l'univers fascinant de l'art, de son histoire et de son marché
              </p>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-creme px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Voir tous les articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
