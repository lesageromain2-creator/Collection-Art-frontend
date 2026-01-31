import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Scale, TrendingUp, Palette, ArrowLeft, Calendar, User, Sparkles } from 'lucide-react';
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
  const articles = [];
  const imageSrc = slug ? RUBRIQUES_IMAGES[slug] : null;

  if (!rubrique) {
    return (
      <>
        <Head>
          <title>Rubrique introuvable – Collection Aur'art</title>
        </Head>
        <div className="min-h-screen bg-creme">
          <Header settings={demoSettings} />
          <main className="px-6 py-20 text-center">
            <h1 className="font-heading text-3xl font-bold text-navy mb-4">
              Rubrique introuvable
            </h1>
            <Link href="/rubriques" className="text-burgundy hover:underline">
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

        <main className="px-0 pb-20 md:pb-32">
          {/* Hero avec image de rubrique - pleine largeur, élégant */}
          <section className="relative w-full h-[45vh] min-h-[320px] md:h-[55vh] overflow-hidden">
            {imageSrc ? (
              <>
                <Image
                  src={imageSrc}
                  alt={rubrique.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
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

          {/* Articles de la rubrique */}
          <section className="mx-auto max-w-6xl px-6 mt-16">
            {articles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-navy/5 hover:shadow-lg transition-all duration-300"
                  >
                    {article.image && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-navy mb-3 group-hover:text-burgundy transition-colors">
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
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-navy/5">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${rubrique.hex}20` }}
                >
                  <Icon className="h-8 w-8" style={{ color: rubrique.color }} />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-navy mb-4">
                  Bientôt disponible
                </h2>
                <p className="text-gris mb-6 max-w-md mx-auto">
                  Les articles de cette rubrique seront prochainement disponibles. Revenez nous voir bientôt !
                </p>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 text-burgundy hover:text-navy transition-colors font-medium"
                >
                  Découvrir tous nos articles
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

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
