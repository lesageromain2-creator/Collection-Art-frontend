import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Linkedin, Phone, Globe, Loader2 } from 'lucide-react';
import { getTeamMembers, fetchSettings } from '../utils/api';

const demoSettings = {
  site_name: 'Collection Aur\'art',
  site_description: 'L\'Association de passionnés qui s\'engage à valoriser le patrimoine artistique sous toutes ses formes',
  email: 'collection.aurart@gmail.com',
};

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  let initialMembers = [];
  let initialSettings = {};
  try {
    const [teamRes, settingsRes] = await Promise.all([
      fetch(`${apiUrl}/team`, { method: 'GET' }),
      fetch(`${apiUrl}/settings`, { method: 'GET' }).catch(() => null),
    ]);
    if (teamRes.ok) {
      const teamData = await teamRes.json();
      const m = teamData?.members ?? teamData?.data ?? (Array.isArray(teamData) ? teamData : []);
      initialMembers = Array.isArray(m) ? m : [];
    }
    if (settingsRes?.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData?.site_name) initialSettings = { site_name: settingsData.site_name };
    }
  } catch (e) {
    console.error('[About getServerSideProps]', e.message);
  }
  return { props: { initialMembers, initialSettings } };
}

export default function AboutPage({ initialMembers = [], initialSettings = {} }) {
  const [teamMembers, setTeamMembers] = useState(initialMembers);
  const [settings, setSettings] = useState({ ...demoSettings, ...initialSettings });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMembers.length > 0) return;
    setLoading(true);
    (async () => {
      try {
        const [members, settingsData] = await Promise.all([
          getTeamMembers(),
          fetchSettings().catch(() => ({})),
        ]);
        setTeamMembers(Array.isArray(members) ? members : []);
        if (settingsData?.site_name) setSettings((s) => ({ ...s, site_name: settingsData.site_name }));
      } catch (e) {
        console.error(e);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialMembers.length]);
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
        <Header settings={settings} />

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

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 text-anthracite/50 animate-spin" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center text-gris py-12 max-w-xl mx-auto">
                <p className="mb-4">
                  Aucun membre n&apos;est affiché pour l&apos;instant. Pour apparaître ici :
                </p>
                <ol className="list-decimal list-inside text-left space-y-2 mb-6">
                  <li>Connectez-vous, allez dans <strong>Dashboard → Équipe associative</strong>, cochez « Apparaître sur la page équipe » et enregistrez.</li>
                  <li>Ou exécutez le script SQL <code className="bg-anthracite/10 px-1 rounded">database/update-team-member.sql</code> pour activer l&apos;affichage des comptes en base.</li>
                </ol>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-gradient text-white rounded-full font-medium">
                  Aller au dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {teamMembers.map((member) => {
                  const name = [member.firstname, member.lastname].filter(Boolean).join(' ') || 'Membre';
                  const initials = [member.firstname, member.lastname].filter(Boolean).map((n) => n.charAt(0)).join('').toUpperCase() || '?';
                  return (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-anthracite/5 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        {/* Photo + nom + poste — bloc compact */}
                        <div className="md:w-56 flex-shrink-0 p-6 md:py-8 md:pl-8 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-anthracite/5 bg-anthracite/[0.02]">
                          <div className="mb-3">
                            {member.avatar_url ? (
                              <img
                                src={member.avatar_url}
                                alt={name}
                                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                              />
                            ) : (
                              <div className="w-40 h-40 rounded-full bg-primary-gradient flex items-center justify-center shadow-md">
                                <span className="text-4xl font-bold text-white font-serif">{initials}</span>
                              </div>
                            )}
                          </div>
                          {member.team_position && (
                            <p className="text-xs font-semibold text-framboise text-center md:text-left mb-2 px-1">
                              {member.team_position}
                            </p>
                          )}
                          <h3 className="font-heading text-xl md:text-2xl font-semibold text-anthracite text-center md:text-left">
                            {name}
                          </h3>
                        </div>

                        {/* Description + contact — espace dédié */}
                        <div className="flex-1 flex flex-col min-w-0 p-6 md:p-8">
                          {member.bio && (
                            <div className="flex-1 mb-6">
                              <p className="text-gris text-base md:text-lg leading-relaxed md:leading-loose max-w-2xl">
                                {member.bio}
                              </p>
                            </div>
                          )}

                          {/* Contact */}
                          <div className="flex flex-wrap gap-3">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                              >
                                <Mail className="h-4 w-4" />
                                <span>Email</span>
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                              >
                                <Phone className="h-4 w-4" />
                                <span>Téléphone</span>
                              </a>
                            )}
                            {member.social_linkedin && (
                              <a
                                href={member.social_linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                              >
                                <Linkedin className="h-4 w-4" />
                                <span>LinkedIn</span>
                              </a>
                            )}
                            {member.social_website && (
                              <a
                                href={member.social_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-anthracite/5 rounded-full text-sm text-anthracite hover:bg-framboise/10 hover:text-framboise transition-all"
                              >
                                <Globe className="h-4 w-4" />
                                <span>Site web</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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

        <Footer settings={settings} />
      </div>
    </>
  );
}
