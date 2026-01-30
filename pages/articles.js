import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, BookOpen, Scale, TrendingUp, Palette } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const demoSettings = {
  site_name: 'Collection Aur\'art',
  email: 'collection.aurart@gmail.com',
};

// Mapping des rubriques avec leurs couleurs et icônes
const rubriquesConfig = {
  'Histoire des arts': { color: '#D63384', icon: BookOpen },
  'Au fil des œuvres': { color: '#6A2C70', icon: Palette },
  'Tribunal des arts': { color: '#E67E22', icon: Scale },
  'Marché de l\'art': { color: '#9B59B6', icon: TrendingUp },
};

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRubrique, setSelectedRubrique] = useState('all');

  // Articles d'exemple (à remplacer par de vraies données depuis l'API)
  const articles = [];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRubrique = selectedRubrique === 'all' || article.rubrique === selectedRubrique;
    return matchesSearch && matchesRubrique;
  });

  return (
    <>
      <Head>
        <title>Tous nos articles – Collection Aur'art</title>
        <meta
          name="description"
          content="Découvrez tous nos articles sur l'histoire de l'art, le marché de l'art, les procès artistiques et nos analyses d'œuvres."
        />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          {/* Hero */}
          <section className="mx-auto max-w-4xl text-center mb-16">
            <div className="mb-8 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white font-serif">A</span>
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-anthracite mb-6">
              Tous nos articles
            </h1>
            
            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-8"></div>

            <p className="text-lg md:text-xl text-gris leading-relaxed">
              Explorez nos publications sur l'art, son histoire, son marché et ses enjeux contemporains
            </p>
          </section>

          {/* Filtres 
          <section className="mx-auto max-w-6xl mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-anthracite/5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gris" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-anthracite/15 rounded-xl focus:outline-none focus:border-framboise focus:ring-2 focus:ring-framboise/20 transition-all"
                  />
                </div>

                <select
                  value={selectedRubrique}
                  onChange={(e) => setSelectedRubrique(e.target.value)}
                  className="px-4 py-3 border border-anthracite/15 rounded-xl focus:outline-none focus:border-framboise focus:ring-2 focus:ring-framboise/20 transition-all cursor-pointer"
                >
                  <option value="all">Toutes les rubriques</option>
                  {Object.keys(rubriquesConfig).map(rubrique => (
                    <option key={rubrique} value={rubrique}>{rubrique}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>
          */}

          {/* Articles */}
          <section className="mx-auto max-w-6xl">
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => {
                  const rubriqueConfig = rubriquesConfig[article.rubrique] || {};
                  const RubriqueIcon = rubriqueConfig.icon;
                  
                  return (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-anthracite/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Image */}
                      {article.image ? (
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div 
                          className="aspect-[4/3] flex items-center justify-center"
                          style={{ backgroundColor: `${rubriqueConfig.color}15` }}
                        >
                          {RubriqueIcon && (
                            <RubriqueIcon 
                              className="h-16 w-16" 
                              style={{ color: rubriqueConfig.color }} 
                            />
                          )}
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="p-6">
                        {/* Badge rubrique */}
                        {article.rubrique && (
                          <div className="mb-3">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${rubriqueConfig.color}15`,
                                color: rubriqueConfig.color 
                              }}
                            >
                              {article.rubrique}
                            </span>
                          </div>
                        )}

                        <h3 className="font-heading text-xl font-semibold text-anthracite mb-3 group-hover:text-framboise transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gris text-sm leading-relaxed mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        {/* Meta */}
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
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-anthracite/5">
                <div className="h-16 w-16 rounded-full bg-anthracite/5 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-gris" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-anthracite mb-4">
                  Bientôt disponible
                </h2>
                <p className="text-gris mb-6 max-w-md mx-auto">
                  Nos premiers articles seront bientôt publiés. En attendant, découvrez nos différentes rubriques et ce que nous préparons.
                </p>
                <Link
                  href="/rubriques"
                  className="inline-flex items-center gap-2 bg-primary-gradient text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Découvrir nos rubriques
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-4xl mt-20">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-anthracite/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-anthracite mb-4">
                Rejoignez notre communauté
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Ne manquez aucune de nos publications. Contactez-nous pour en savoir plus sur notre association et nos activités.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-anthracite/20 text-anthracite px-8 py-3 rounded-full font-medium hover:border-framboise hover:text-framboise transition-all"
                >
                  Découvrir notre équipe
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
