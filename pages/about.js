import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Linkedin } from 'lucide-react';

const demoSettings = {
  site_name: 'Collection Aur\'art',
  site_description: 'L\'Association de passionnés qui s\'engage à valoriser le patrimoine artistique sous toutes ses formes',
  email: 'collection.aurart@gmail.com',
};

// Données de l'équipe - dans l'ordre demandé
const teamMembers = [
  {
    name: 'Prénom Nom',
    role: 'Président',
    description: 'Description du président de l\'association et de son rôle.',
    image: '/team/president.jpg',
    email: 'president@collection.aurart.com',
    linkedin: null,
  },
  {
    name: 'Prénom Nom',
    role: 'Vice-Président',
    description: 'Description du vice-président et de ses missions au sein de l\'association.',
    image: '/team/vice-president.jpg',
    email: 'vicepresident@collection.aurart.com',
    linkedin: null,
  },
  {
    name: 'Prénom Nom',
    role: 'Rédactrice en Chef',
    description: 'Description de la rédactrice en chef et de son travail éditorial.',
    image: '/team/redactrice.jpg',
    email: 'redaction@collection.aurart.com',
    linkedin: null,
  },
  {
    name: 'Prénom Nom',
    role: 'Secrétaire',
    description: 'Description du secrétaire et de ses responsabilités administratives.',
    image: '/team/secretaire.jpg',
    email: 'secretaire@collection.aurart.com',
    linkedin: null,
  },
  {
    name: 'Prénom Nom',
    role: 'Développeur Web',
    description: 'Description du développeur web et de son travail technique pour l\'association.',
    image: '/team/dev.jpg',
    email: 'dev@collection.aurart.com',
    linkedin: null,
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Notre équipe – Collection Aur'art</title>
        <meta
          name="description"
          content="Découvrez l'équipe de Collection Aur'art : des passionnés engagés pour la valorisation du patrimoine artistique."
        />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={demoSettings} />

        <main className="px-6 py-20 md:py-32">
          {/* Hero Section */}
          <section className="mx-auto max-w-4xl text-center mb-20">
            <div className="mb-8 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary-gradient flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white font-serif">A</span>
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-anthracite mb-6">
              Notre équipe
            </h1>
            
            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-8"></div>

            <p className="text-lg md:text-xl text-gris leading-relaxed max-w-3xl mx-auto text-justify">
              Notre association se donne pour mission de questionner, valoriser et transmettre l'histoire de l'art dans toute sa complexité. À travers nos articles, nous explorons les œuvres, les courants artistiques, les procès, les dynamiques du marché de l'art et les enjeux contemporains de la protection patrimoniale.
            </p>
          </section>

          {/* Présentation détaillée */}
          <section className="mx-auto max-w-4xl mb-24">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-anthracite/5">
              <div className="space-y-6 text-justify">
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

          {/* Section Équipe */}
          <section className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-anthracite mb-4">
                Les membres de l'association
              </h2>
              <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-anthracite/5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="grid md:grid-cols-[200px_1fr] gap-8 p-8">
                    {/* Photo */}
                    <div className="flex justify-center md:justify-start">
                      <div className="relative">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-48 h-48 rounded-full object-cover border-4 border-anthracite/5"
                          />
                        ) : (
                          <div className="w-48 h-48 rounded-full bg-primary-gradient flex items-center justify-center shadow-md">
                            <span className="text-5xl font-bold text-white font-serif">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        {/* Badge du rôle */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-md border border-anthracite/10">
                          <span className="text-sm font-semibold text-framboise">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex flex-col justify-center">
                      <h3 className="font-heading text-2xl md:text-3xl font-semibold text-anthracite mb-3">
                        {member.name}
                      </h3>
                      
                      <p className="text-gris leading-relaxed mb-4">
                        {member.description}
                      </p>

                      {/* Contact */}
                      <div className="flex flex-wrap gap-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Contact</span>
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-4xl mt-24">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-anthracite/5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-anthracite mb-4">
                Rejoignez notre communauté
              </h2>
              <p className="text-gris mb-6 max-w-2xl mx-auto leading-relaxed">
                Découvrez nos articles, analyses et réflexions sur l'art, son histoire et son marché. Une culture artistique vivante, critique et partagée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center justify-center gap-2 bg-primary-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Lire nos articles
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
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}
