import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  AppWindow,
  CheckCircle2,
  Monitor,
  Rocket,
  ShoppingBag,
  Wrench,
} from 'lucide-react';

const demoSettings = {
  site_name: "Collection Aur'art",
  site_description:
    'Création de sites web professionnels sur-mesure — design moderne, performance et maintenance continue.',
  email: 'lesage.pro.dev@gmail.com',
  phone_number: '+33 07 86 18 18 40',
  city: 'Lyon',
  website: '',
};

const services = [
  {
    title: 'Site vitrine',
    description:
      'Un site moderne qui présente votre activité, rassure et transforme les visites en prises de contact.',
    icon: Monitor,
    bullets: [
      'Design sur-mesure & identité visuelle',
      'SEO on-page & structure optimisée',
      'Pages clés : services, about, contact',
      'Formulaire pro (anti-spam, tracking)',
    ],
    cta: { href: '/offres#vitrine', label: 'Voir l’offre site vitrine' },
  },
  {
    title: 'E-commerce',
    description:
      'Une boutique en ligne rapide et rassurante, avec un tunnel de commande optimisé pour convertir.',
    icon: ShoppingBag,
    bullets: [
      'Catalogue, filtres, recherche',
      'Paiement sécurisé (Stripe)',
      'Suivi conversions (GA4 / Pixel)',
      'Optimisations mobile-first',
    ],
    cta: { href: '/offres#ecommerce', label: 'Voir l’offre e-commerce' },
  },
  {
    title: 'Application web',
    description:
      'Un outil métier ou une web app sur-mesure, robuste et évolutive (dashboard, espace client, rôles).',
    icon: AppWindow,
    bullets: [
      'Cadrage & architecture',
      'Auth, rôles & permissions',
      'Base de données sécurisée',
      'Déploiement & monitoring',
    ],
    cta: { href: '/offres#webapp', label: 'Voir l’offre application web' },
  },
  {
    title: 'Refonte & optimisation',
    description:
      'On améliore un site existant : design, performance, SEO, conversion — sans tout casser.',
    icon: Rocket,
    bullets: [
      'Audit UI/UX, perfs, SEO',
      'Plan d’action priorisé',
      'Optimisation Lighthouse',
      'Migration et redirections',
    ],
    cta: { href: '/offres#refonte', label: 'Voir l’offre refonte' },
  },
  {
    title: 'Maintenance continue',
    description:
      'Mises à jour, monitoring, petites évolutions, sécurité : votre site reste fiable et performant.',
    icon: Wrench,
    bullets: [
      'Mises à jour & correctifs',
      'Sauvegardes & monitoring',
      'Support & évolutions',
      'Conseils SEO / contenu',
    ],
    cta: { href: '/contact', label: 'Demander un forfait maintenance' },
  },
];

export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>Services – Collection Aur'art | Sites vitrines, e-commerce, web apps</title>
        <meta
          name="description"
          content="Découvrez les services Collection Aur'art : site vitrine, e-commerce, application web, refonte & optimisation, maintenance continue."
        />
      </Head>

      <div className="min-h-screen bg-dark text-light">
        <Header settings={demoSettings} />

        <main className="px-6 py-16 md:py-20 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          <section className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Services
            </p>
            <h1 className="mt-2 font-heading text-3xl font-black text-white md:text-4xl">
              Tout ce qu’il faut pour un site
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                moderne, performant et durable.
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Collection Aur'art accompagne restaurants, commerces et services dans la
              création de solutions web sur-mesure : design, base de données,
              hébergement, maintenance.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-6xl">
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <article
                    key={s.title}
                    className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-secondary/70 hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="font-heading text-lg font-semibold text-white md:text-xl">
                            {s.title}
                          </h2>
                          <p className="mt-2 text-sm text-slate-300">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-slate-200">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-secondary" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Link
                        href={s.cta.href}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg"
                      >
                        {s.cta.label}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-5xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/10 via-slate-950/70 to-secondary/10 p-8 text-center shadow-2xl">
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
                Discutons de votre projet
              </h2>
              <p className="mt-3 text-sm text-slate-200 md:text-base">
                Un besoin simple ou un projet ambitieux : on vous propose un
                cadrage clair, un planning et une estimation réaliste.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/reservation"
                  className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-slate-900"
                >
                  Réserver un appel découverte
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-100 backdrop-blur hover:bg-white/10"
                >
                  Envoyer un message
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

