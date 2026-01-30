import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Scale, TrendingUp, Palette, ArrowLeft, Calendar, User } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const demoSettings = {
  site_name: 'Collection Aur\'art',
  email: 'collection.aurart@gmail.com',
};

// Configuration des rubriques
const rubriquesConfig = {
  'histoire-arts': {
    title: 'Histoire des arts',
    description: 'Découvrez l\'histoire de l\'art à travers les siècles, des œuvres majeures aux courants artistiques qui ont façonné notre regard sur le monde.',
    longDescription: 'Cette rubrique explore l\'évolution de l\'art depuis l\'Antiquité jusqu\'à nos jours. Nous analysons les mouvements artistiques majeurs, les révolutions esthétiques et les figures qui ont marqué l\'histoire de l\'art.',
    icon: BookOpen,
    color: '#D63384',
  },
  'fil-oeuvres': {
    title: 'Au fil des œuvres',
    description: 'Explorez en profondeur les œuvres qui ont marqué l\'histoire de l\'art, leurs secrets, leur contexte de création et leur impact culturel.',
    longDescription: 'Des analyses détaillées d\'œuvres d\'art emblématiques. Nous décryptons les techniques, les symboles, les contextes historiques et les histoires fascinantes derrière les chefs-d\'œuvre.',
    icon: Palette,
    color: '#6A2C70',
  },
  'tribunal-arts': {
    title: 'Tribunal des arts',
    description: 'Analyse des procès et affaires judiciaires qui ont secoué le monde de l\'art, entre droit, éthique et patrimoine culturel.',
    longDescription: 'Les grandes affaires juridiques du monde de l\'art : vols, faux, restitutions, droits d\'auteur. Nous analysons les enjeux juridiques et éthiques qui façonnent le marché de l\'art.',
    icon: Scale,
    color: '#E67E22',
  },
  'marche-art': {
    title: 'Marché de l\'art',
    description: 'Décryptage des dynamiques du marché de l\'art : ventes aux enchères, tendances, valorisation et circulation des œuvres contemporaines.',
    longDescription: 'Analyses économiques et financières du marché de l\'art. Ventes records, tendances de collection, nouveaux acteurs et transformations du secteur artistique.',
    icon: TrendingUp,
    color: '#9B59B6',
  },
};

export default function RubriquePage() {
  const router = useRouter();
  const { slug } = router.query;

  // Récupérer la configuration de la rubrique
  const rubrique = slug ? rubriquesConfig[slug] : null;

  // Articles d'exemple (à remplacer par de vraies données)
  const articles = [];

  if (!rubrique) {
    return (
      <>
        <Head>
          <title>Rubrique introuvable – Collection Aur'art</title>
        </Head>
        <div className="min-h-screen bg-creme">
          <Header settings={demoSettings} />
          <main className="px-6 py-20 text-center">
            <h1 className="font-heading text-3xl font-bold text-anthracite mb-4">
              Rubrique introuvable
            </h1>
            <Link href="/rubriques" className="text-framboise hover:underline">
              Retour aux rubriques
            </Link>
          </main>
          <Footer settings={demoSettings} />
        </div>
      </>
    );
  }

  const Icon = rubrique.icon;

  return (
    <>
      <Head>
        <title>{rubrique.title} – Collection Aur'art</title>
        <meta name="description" content={rubrique.description} />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          {/* Navigation */}
          <div className="mx-auto max-w-6xl mb-8">
            <Link
              href="/rubriques"
              className="inline-flex items-center gap-2 text-gris hover:text-framboise transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux rubriques</span>
            </Link>
          </div>

          {/* Hero de la rubrique */}
          <section className="mx-auto max-w-4xl text-center mb-20">
            <div className="mb-8 flex justify-center">
              <div 
                className="h-20 w-20 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${rubrique.color}15` }}
              >
                <Icon className="h-10 w-10" style={{ color: rubrique.color }} />
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-anthracite mb-6">
              {rubrique.title}
            </h1>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full mb-8"
              style={{ background: rubrique.color }}
            />

            <p className="text-lg md:text-xl text-gris leading-relaxed mb-6">
              {rubrique.description}
            </p>

            <p className="text-base text-gris leading-relaxed max-w-2xl mx-auto">
              {rubrique.longDescription}
            </p>
          </section>

          {/* Articles de la rubrique */}
          <section className="mx-auto max-w-6xl">
            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-anthracite/5 hover:shadow-lg transition-all duration-300"
                  >
                    {article.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-anthracite mb-3 group-hover:text-framboise transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gris text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gris">
                        {article.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{article.author}</span>
                          </div>
                        )}
                        {article.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{article.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-anthracite/5">
                <div 
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${rubrique.color}15` }}
                >
                  <Icon className="h-8 w-8" style={{ color: rubrique.color }} />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-anthracite mb-4">
                  Bientôt disponible
                </h2>
                <p className="text-gris mb-6 max-w-md mx-auto">
                  Les articles de cette rubrique seront prochainement disponibles. Revenez nous voir bientôt !
                </p>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 text-framboise hover:text-violet-profond transition-colors font-medium"
                >
                  Découvrir tous nos articles
                </Link>
              </div>
            )}
          </section>

          {/* CTA Newsletter */}
          <section className="mx-auto max-w-4xl mt-20">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-anthracite/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-anthracite mb-4">
                Ne manquez rien de nos publications
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Recevez nos derniers articles directement dans votre boîte mail et restez informé de l'actualité artistique
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Nous contacter
              </Link>
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
