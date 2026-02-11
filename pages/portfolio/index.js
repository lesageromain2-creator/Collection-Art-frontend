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
    short_description:
      "Refonte de l'identité digitale d'une école de surf bretonne, avec réservations en ligne et mise en avant des spots locaux.",
    thumbnail_url:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    technologies: ['Next.js', 'Supabase', 'Framer Motion'],
    featured: true,
  },
  {
    id: 'armor-cafe-ecommerce',
    title: 'Armor Café',
    slug: 'armor-cafe-ecommerce',
    category: 'ecommerce',
    client_name: 'Armor Café',
    short_description:
      'Boutique en ligne pour un torréfacteur artisanal breton, optimisée pour le mobile et le SEO local.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80',
    technologies: ['Next.js', 'Stripe', 'TailwindCSS'],
    featured: true,
  },
  {
    id: 'keltia-tech-dashboard',
    title: 'Keltia Tech',
    slug: 'keltia-tech-dashboard',
    category: 'webapp',
    client_name: 'Keltia Tech',
    short_description:
      'Dashboard SaaS pour piloter des campagnes marketing multi-canales en temps réel.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    featured: false,
  },
  {
    id: 'hotel-cote-breizh',
    title: 'Hôtel Côté Breizh',
    slug: 'hotel-cote-breizh',
    category: 'vitrine',
    client_name: 'Hôtel Côté Breizh',
    short_description:
      'Site vitrine premium pour un boutique-hôtel en bord de mer, avec intégration d’un moteur de réservation externe.',
    thumbnail_url:
      'https://images.unsplash.com/photo-1519823551271-9d2b46a8459a?w=1200&q=80',
    technologies: ['Next.js', 'API externe', 'SEO'],
    featured: false,
  },
];

export async function getStaticProps() {
  return {
    props: {
      projects: portfolioProjects,
    },
  };
}

const categoryLabels = {
  vitrine: 'Site vitrine',
  ecommerce: 'E-commerce',
  webapp: 'Application web',
  branding: 'Branding',
  refonte: 'Refonte',
};

export default function PortfolioPage({ projects }) {
  return (
    <>
      <Head>
        <title>
          Portfolio – Studio Web Breizh | Sites vitrines, e-commerce &
          applications web
        </title>
        <meta
          name="description"
          content="Découvrez une sélection de réalisations : sites vitrines, boutiques e-commerce et applications web conçues pour des acteurs bretons et francophones."
        />
      </Head>
      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <section className="mx-auto max-w-5xl text-center">
            <h1 className="font-heading text-3xl font-black text-white md:text-4xl">
              Des projets concrets,
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                des résultats mesurables.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Une sélection de sites vitrines, boutiques en ligne et
              applications web que nous avons conçues avec nos clients,
              du premier brief au lancement.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-lg transition-all hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                >
                  <Link href={`/portfolio/${project.slug}`} className="flex h-full flex-col">

                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                      <div className="absolute left-3 top-3 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-100 backdrop-blur">
                        {categoryLabels[project.category] ||
                          project.category}
                      </div>
                      {project.featured && (
                        <div className="absolute right-3 top-3 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-lg">
                          Projet phare
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="font-heading text-base font-semibold text-white md:text-lg">
                        {project.title}
                      </h2>
                      {project.client_name && (
                        <p className="mt-1 text-xs text-slate-400">
                          {project.client_name}
                        </p>
                      )}
                      <p className="mt-3 flex-1 text-xs text-slate-300 md:text-sm">
                        {project.short_description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-200">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                  </Link>
                </article>
              ))}
            </div>
          </section>
        </main>

        <Footer settings={demoSettings} />
      </div>
    </>
  );
}

