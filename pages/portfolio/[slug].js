import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const demoSettings = {
  site_name: "Collection Aur'art",
  site_description:
    'Création de sites web professionnels sur-mesure — design moderne, performance et maintenance continue.',
  email: 'lesage.pro.dev@gmail.com',
  phone_number: '+33 07 86 18 18 40',
  city: 'Lyon',
  website: '',
};

const portfolioProjects = [
  {
    id: 'studio-breizh-surf',
    title: 'Studio Breizh Surf',
    slug: 'studio-breizh-surf',
    category: 'vitrine',
    client_name: 'Studio Breizh Surf',
    description:
      "L'école de surf souhaitait une identité digitale à la hauteur de son expertise locale. Nous avons conçu un site immersif mettant en avant les spots, les moniteurs et les conditions en temps réel.",
    thumbnail_url:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    technologies: ['Next.js', 'Supabase', 'Framer Motion'],
    live_url: '#',
    testimonial:
      'Nous avons doublé les demandes de cours en une saison, tout en réduisant le temps administratif.',
    testimonial_author: 'Julie M.',
    testimonial_company: 'Fondatrice, Studio Breizh Surf',
  },
  {
    id: 'armor-cafe-ecommerce',
    title: 'Armor Café',
    slug: 'armor-cafe-ecommerce',
    category: 'ecommerce',
    client_name: 'Armor Café',
    description:
      'Armor Café souhaitait passer de la vente en boutique physique à une présence e-commerce forte, tout en gardant son identité artisanale et bretonne.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
    technologies: ['Next.js', 'Stripe', 'TailwindCSS'],
    live_url: '#',
    testimonial:
      "Le site est rapide, beau et surtout il vend. Nous pouvons suivre nos ventes et nos stocks simplement.",
    testimonial_author: 'Thomas L.',
    testimonial_company: 'Gérant, Armor Café',
  },
  {
    id: 'keltia-tech-dashboard',
    title: 'Keltia Tech',
    slug: 'keltia-tech-dashboard',
    category: 'webapp',
    client_name: 'Keltia Tech',
    description:
      'Une web app permettant aux équipes marketing de suivre leurs performances multi-canales (email, social, SEA) au même endroit.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    live_url: '#',
    testimonial:
      'Nous avons gagné une vision claire sur nos campagnes, avec un outil évolutif qui suit notre roadmap produit.',
    testimonial_author: 'Claire R.',
    testimonial_company: 'CMO, Keltia Tech',
  },
  {
    id: 'hotel-cote-breizh',
    title: 'Hôtel Côté Breizh',
    slug: 'hotel-cote-breizh',
    category: 'vitrine',
    client_name: 'Hôtel Côté Breizh',
    description:
      'Un site vitrine premium pour un boutique-hôtel, pensé pour rassurer, inspirer et convertir les visites en réservations.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1519823551271-9d2b46a8459a?w=1200&q=80',
    technologies: ['Next.js', 'API externe', 'SEO'],
    live_url: '#',
    testimonial:
      'Les visiteurs nous disent régulièrement être venus grâce au site. Le parcours de réservation est fluide.',
    testimonial_author: 'Marc D.',
    testimonial_company: 'Directeur, Hôtel Côté Breizh',
  },
];

const categoryLabels = {
  vitrine: 'Site vitrine',
  ecommerce: 'E-commerce',
  webapp: 'Application web',
  branding: 'Branding',
  refonte: 'Refonte',
};

export async function getStaticPaths() {
  const paths = portfolioProjects.map((project) => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = portfolioProjects.find((p) => p.slug === params.slug) || null;

  return {
    props: {
      project,
      moreProjects: portfolioProjects
        .filter((p) => p.slug !== params.slug)
        .slice(0, 3),
    },
  };
}

export default function ProjectDetailPage({ project, moreProjects }) {
  if (!project) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {project.title} – Projet client | Studio Web Breizh
        </title>
        <meta
          name="description"
          content={project.description.slice(0, 155)}
        />
      </Head>
      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <article className="mx-auto flex max-w-5xl flex-col gap-10">
            <header>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Cas client
              </p>
              <h1 className="mt-2 font-heading text-3xl font-black text-white md:text-4xl">
                {project.title}
              </h1>
              {project.client_name && (
                <p className="mt-1 text-sm text-slate-300">
                  pour {project.client_name}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-200">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  {categoryLabels[project.category] || project.category}
                </span>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </header>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="h-64 w-full object-cover md:h-80"
              />
            </div>

            <section className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] md:items-start">
              <div className="space-y-6 text-sm text-slate-200 md:text-base">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                    Contexte & objectifs
                  </h2>
                  <p className="mt-2">{project.description}</p>
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                    Notre approche
                  </h2>
                  <p className="mt-2 text-sm text-slate-200 md:text-base">
                    Chaque projet suit un processus clair : ateliers de
                    cadrage, prototypage, design UI, développement, intégration
                    des outils tiers, puis tests et accompagnement au
                    lancement. Ici encore, nous avons veillé à aligner chaque
                    décision de design et de technique sur les objectifs
                    business du client.
                  </p>
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                    Résultats
                  </h2>
                  <p className="mt-2 text-sm text-slate-200 md:text-base">
                    Selon les cas, cela peut se traduire par une hausse des
                    demandes de contact, une augmentation du taux de conversion
                    ou une simplification du travail des équipes internes.
                    Les indicateurs exacts sont définis avec vous au démarrage
                    du projet.
                  </p>
                </div>
              </div>

              <aside className="space-y-5">
                {project.testimonial && (
                  <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-5 text-sm text-slate-100 shadow-xl">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-300">
                      Témoignage client
                    </p>
                    <p className="mt-2 text-sm md:text-base">
                      “{project.testimonial}”
                    </p>
                    <div className="mt-3 text-sm font-semibold text-white">
                      {project.testimonial_author}
                    </div>
                    <div className="text-xs text-slate-400">
                      {project.testimonial_company}
                    </div>
                  </div>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-3xl bg-gradient-to-r from-primary to-secondary px-5 py-4 text-center text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    Voir le site en ligne
                  </a>
                )}

                <Link
                  href="/reservation"
                  className="block rounded-3xl border border-white/20 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/10">
                  
                    Discuter d’un projet similaire
                  
                </Link>
              </aside>
            </section>

            {moreProjects && moreProjects.length > 0 && (
              <section className="mt-8 border-t border-white/10 pt-8">
                <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                  Voir aussi
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {moreProjects.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/portfolio/${p.slug}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-md transition hover:-translate-y-1 hover:border-secondary/70 hover:shadow-xl">

                      <img
                        src={p.thumbnail_url}
                        alt={p.title}
                        className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="p-3">
                        <p className="text-xs font-semibold text-white md:text-sm">
                          {p.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {categoryLabels[p.category] || p.category}
                        </p>
                      </div>

                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}

