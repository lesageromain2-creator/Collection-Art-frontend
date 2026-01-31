import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Scale, TrendingUp, Palette, ArrowRight, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const demoSettings = {
  site_name: "Collection Aur'art",
  email: 'collection.aurart@gmail.com',
};

const RUBRIQUES_IMAGES = {
  'histoire-arts': '/images/Histoire des arts.png',
  'fil-oeuvres': '/images/au fil des oeuvres.png',
  'art-contemporain': '/images/art contempo.jpg.jpeg',
  'tribunal-arts': null,
  'marche-art': "/images/Marché de l'art.jpg.jpeg",
};

const rubriques = [
  {
    id: 'histoire-arts',
    title: 'Histoire des arts',
    slug: 'histoire-arts',
    description: "Découvrez l'histoire de l'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard sur le monde.",
    longDescription: "Cette rubrique explore l'évolution de l'art depuis l'Antiquité jusqu'à nos jours. Nous analysons les mouvements artistiques majeurs, les révolutions esthétiques et les figures qui ont marqué l'histoire de l'art.",
    icon: BookOpen,
    color: '#7C2A3C',
    hex: '#7C2A3C',
    articleCount: 0,
  },
  {
    id: 'fil-oeuvres',
    title: 'Au fil des œuvres',
    slug: 'fil-oeuvres',
    description: "Explorez en profondeur les œuvres qui ont marqué l'histoire de l'art, leurs secrets, leur contexte de création et leur impact culturel.",
    longDescription: "Des analyses détaillées d'œuvres d'art emblématiques. Nous décryptons les techniques, les symboles, les contextes historiques et les histoires fascinantes derrière les chefs-d'œuvre.",
    icon: Palette,
    color: '#6C8157',
    hex: '#6C8157',
    articleCount: 0,
  },
  {
    id: 'art-contemporain',
    title: 'Art contemporain',
    slug: 'art-contemporain',
    description: "Plongez dans l'art d'aujourd'hui : tendances, artistes émergents et enjeux de la création contemporaine.",
    longDescription: "L'art contemporain interroge notre époque. Nous explorons les courants actuels, les artistes qui font l'actualité et les questions que soulève la création d'aujourd'hui.",
    icon: Sparkles,
    color: '#C7A11E',
    hex: '#C7A11E',
    articleCount: 0,
  },
  {
    id: 'tribunal-arts',
    title: 'Tribunal des arts',
    slug: 'tribunal-arts',
    description: "Analyse des procès et affaires judiciaires qui ont secoué le monde de l'art, entre droit, éthique et patrimoine culturel.",
    longDescription: "Les grandes affaires juridiques du monde de l'art : vols, faux, restitutions, droits d'auteur. Nous analysons les enjeux juridiques et éthiques qui façonnent le marché de l'art.",
    icon: Scale,
    color: '#212E50',
    hex: '#212E50',
    articleCount: 0,
  },
  {
    id: 'marche-art',
    title: "Marché de l'art",
    slug: 'marche-art',
    description: "Décryptage des dynamiques du marché de l'art : ventes aux enchères, tendances, valorisation et circulation des œuvres contemporaines.",
    longDescription: "Analyses économiques et financières du marché de l'art. Ventes records, tendances de collection, nouveaux acteurs et transformations du secteur artistique.",
    icon: TrendingUp,
    color: '#7C2A3C',
    hex: '#7C2A3C',
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
          content="Explorez nos différentes rubriques : Histoire des arts, Au fil des œuvres, Art contemporain, Tribunal des arts, Marché de l'art."
        />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          <section className="mx-auto max-w-4xl text-center mb-20">
            <div className="relative inline-flex h-20 w-20 rounded-full overflow-hidden bg-navy/10 ring-2 ring-navy/10 mb-8">
              <Image
                src="/images/logo icone.jpeg"
                alt="Collection Aur'art"
                width={80}
                height={80}
                className="object-contain p-2"
              />
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
                    <div className="relative h-56 md:h-64 overflow-hidden">
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
                            background: `linear-gradient(135deg, ${rubrique.hex} 0%, #212E50 100%)`,
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
