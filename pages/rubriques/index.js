import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Scale, TrendingUp, Palette, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const demoSettings = {
  site_name: 'Collection Aur\'art',
  email: 'collection.aurart@gmail.com',
};

const rubriques = [
  {
    id: 'histoire-arts',
    title: 'Histoire des arts',
    slug: 'histoire-arts',
    description: 'Découvrez l\'histoire de l\'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard sur le monde.',
    longDescription: 'Cette rubrique explore l\'évolution de l\'art depuis l\'Antiquité jusqu\'à nos jours. Nous analysons les mouvements artistiques majeurs, les révolutions esthétiques et les figures qui ont marqué l\'histoire de l\'art.',
    icon: BookOpen,
    color: '#D63384',
    articleCount: 0,
  },
  {
    id: 'fil-oeuvres',
    title: 'Au fil des œuvres',
    slug: 'fil-oeuvres',
    description: 'Explorez en profondeur les œuvres qui ont marqué l\'histoire de l\'art, leurs secrets, leur contexte de création et leur impact culturel.',
    longDescription: 'Des analyses détaillées d\'œuvres d\'art emblématiques. Nous décryptons les techniques, les symboles, les contextes historiques et les histoires fascinantes derrière les chefs-d\'œuvre.',
    icon: Palette,
    color: '#6A2C70',
    articleCount: 0,
  },
  {
    id: 'tribunal-arts',
    title: 'Tribunal des arts',
    slug: 'tribunal-arts',
    description: 'Analyse des procès et affaires judiciaires qui ont secoué le monde de l\'art, entre droit, éthique et patrimoine culturel.',
    longDescription: 'Les grandes affaires juridiques du monde de l\'art : vols, faux, restitutions, droits d\'auteur. Nous analysons les enjeux juridiques et éthiques qui façonnent le marché de l\'art.',
    icon: Scale,
    color: '#E67E22',
    articleCount: 0,
  },
  {
    id: 'marche-art',
    title: 'Marché de l\'art',
    slug: 'marche-art',
    description: 'Décryptage des dynamiques du marché de l\'art : ventes aux enchères, tendances, valorisation et circulation des œuvres contemporaines.',
    longDescription: 'Analyses économiques et financières du marché de l\'art. Ventes records, tendances de collection, nouveaux acteurs et transformations du secteur artistique.',
    icon: TrendingUp,
    color: '#9B59B6',
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
          content="Explorez nos différentes rubriques : Histoire des arts, Au fil des œuvres, Tribunal des arts, et Marché de l'art."
        />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          {/* Hero */}
          <section className="mx-auto max-w-4xl text-center mb-20">
            <div className="mb-8 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white font-serif">A</span>
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-anthracite mb-6">
              Nos rubriques
            </h1>
            
            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-8"></div>

            <p className="text-lg md:text-xl text-gris leading-relaxed">
              Parcourez nos thématiques artistiques et découvrez nos analyses approfondies sur l'art, son histoire et son marché
            </p>
          </section>

          {/* Grille de rubriques */}
          <section className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {rubriques.map((rubrique) => {
                const Icon = rubrique.icon;
                return (
                  <Link
                    key={rubrique.id}
                    href={`/rubriques/${rubrique.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-anthracite/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Header avec icône */}
                    <div className="p-8 pb-6">
                      <div className="flex items-start gap-5 mb-4">
                        <div 
                          className="flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center shadow-md"
                          style={{ backgroundColor: `${rubrique.color}15` }}
                        >
                          <Icon className="h-8 w-8" style={{ color: rubrique.color }} />
                        </div>
                        <div className="flex-1">
                          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-anthracite mb-2 group-hover:text-framboise transition-colors">
                            {rubrique.title}
                          </h2>
                          {rubrique.articleCount > 0 && (
                            <p className="text-sm text-gris">
                              {rubrique.articleCount} article{rubrique.articleCount > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="text-gris leading-relaxed mb-4">
                        {rubrique.description}
                      </p>

                      <div className="inline-flex items-center gap-2 text-framboise font-medium text-sm group-hover:gap-3 transition-all">
                        Découvrir cette rubrique
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Footer avec image ou dégradé */}
                    <div 
                      className="h-2"
                      style={{ 
                        background: `linear-gradient(90deg, ${rubrique.color}, ${rubrique.color}88)` 
                      }}
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-4xl mt-20">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-anthracite/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-anthracite mb-4">
                Découvrez tous nos articles
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Explorez l'ensemble de nos publications et plongez dans l'univers fascinant de l'art, de son histoire et de son marché
              </p>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
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
