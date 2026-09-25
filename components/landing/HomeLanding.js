import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, Search, User } from 'lucide-react';
import { getPublicArticles } from '../../utils/api';
import styles from '../../styles/landing.module.css';

const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/rubriques', label: 'Rubriques' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'Notre équipe' },
  { href: '/contact', label: 'Nous contacter' },
];

const FALLBACK_ARTICLES = [
  {
    id: 'art-contemporain',
    href: '/rubriques/art-contemporain',
    category: 'Art contemporain',
    title: 'Les nouvelles figures de la peinture contemporaine',
    date: '12 sept. 2026',
    image: '/images/landing/art-contemporain.jpg',
  },
  {
    id: 'marche',
    href: '/rubriques/marche-art',
    category: "Marché de l'art",
    title: 'Pourquoi les jeunes collectionneurs changent la donne',
    date: '8 sept. 2026',
    image: '/images/landing/marche.jpg',
  },
  {
    id: 'tribunal',
    href: '/rubriques/tribunal-arts',
    category: 'Tribunal des arts',
    title: "Droit d'auteur : quels enjeux pour les artistes aujourd'hui ?",
    date: '5 sept. 2026',
    image: '/images/landing/tribunal.jpg',
  },
  {
    id: 'histoire',
    href: '/rubriques/histoire-arts',
    category: "Histoire de l'art",
    title: 'Le retour de la couleur dans les musées',
    date: '2 sept. 2026',
    image: '/images/landing/histoire.png',
  },
  {
    id: 'portrait',
    href: '/articles',
    category: 'Portrait',
    title: 'Rencontre avec Sophie Laurent, artiste plasticienne',
    date: '29 août 2026',
    image: '/images/landing/au-fil.png',
  },
];

const RUBRIQUES = [
  { href: '/rubriques/art-contemporain', title: 'Art contemporain', image: '/images/landing/art-contemporain.jpg', tone: styles.pink },
  { href: '/rubriques/marche-art', title: "Marché de l'art", image: '/images/landing/marche.jpg', tone: styles.sageCard },
  { href: '/rubriques/tribunal-arts', title: 'Tribunal des arts', image: '/images/landing/tribunal.jpg', tone: styles.blue },
  { href: '/rubriques/histoire-arts', title: "Histoire de l'art", image: '/images/landing/histoire.png', tone: styles.sand },
  { href: '/rubriques/tribunal-arts', title: 'Droit', image: '/images/landing/tribunal.jpg', tone: styles.pink },
  { href: '/articles', title: 'Portraits', image: '/images/landing/au-fil.png', tone: styles.sageCard },
  { href: '/rubriques/fil-oeuvres', title: 'Au fil des œuvres', image: '/images/landing/au-fil.png', tone: styles.mint },
];

const EVENTS = [
  { day: 12, city: 'Paris', title: 'Exposition', place: 'Palais de Tokyo' },
  { day: 16, city: 'Lyon', title: 'Art contemporain', place: "Musée d'Art Contemporain" },
  { day: 20, city: 'Paris', title: 'Vernissage', place: 'Galerie Perrotin' },
  { day: 24, city: 'Lyon', title: 'Conférence', place: 'Biennale' },
  { day: 28, city: 'Paris', title: 'Salon', place: 'Art Paris' },
];

const SPECIAL_DAYS = [4, 19];

function imageForRubrique(name) {
  const value = (name || '').toLowerCase();
  if (value.includes('tribunal') || value.includes('droit')) return '/images/landing/tribunal.jpg';
  if (value.includes('march')) return '/images/landing/marche.jpg';
  if (value.includes('contempor')) return '/images/landing/art-contemporain.jpg';
  if (value.includes('histoire')) return '/images/landing/histoire.png';
  return '/images/landing/au-fil.png';
}

function formatShort(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function septemberCells() {
  const cells = [];
  for (let i = 0; i < 1; i += 1) cells.push(null);
  for (let day = 1; day <= 30; day += 1) cells.push(day);
  return cells;
}

const STAINS = [
  { top: '15%', left: '-22px', width: 74, rotate: -14, opacity: 0.38 },
  { top: '19%', right: '-18px', width: 48, rotate: 22, opacity: 0.3 },
  { top: '33%', left: '-28px', width: 92, rotate: 8, opacity: 0.26 },
  { top: '41%', right: '-12px', width: 42, rotate: -18, opacity: 0.34 },
  { top: '56%', left: '-8px', width: 36, rotate: 16, opacity: 0.28 },
  { top: '64%', right: '-24px', width: 80, rotate: -6, opacity: 0.24 },
  { top: '78%', left: '-16px', width: 58, rotate: 11, opacity: 0.32 },
  { top: '88%', right: '-10px', width: 44, rotate: -24, opacity: 0.28 },
  { top: '96%', left: '6%', width: 34, rotate: 20, opacity: 0.22 },
];

export default function HomeLanding() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [selectedDay, setSelectedDay] = useState(null);
  const [articles, setArticles] = useState(FALLBACK_ARTICLES);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem('authToken')));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPublicArticles({ page: 1, limit: 5 })
      .then((res) => {
        if (cancelled || !res.articles?.length) return;
        setArticles(
          res.articles.slice(0, 5).map((article) => ({
            id: article.id || article.slug,
            href: article.slug ? `/blog/${article.slug}` : '/articles',
            category: article.rubrique_name || 'Article',
            title: article.title,
            date: formatShort(article.published_at || article.created_at),
            image: article.featured_image_url || imageForRubrique(article.rubrique_name),
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleEvents = useMemo(
    () =>
      EVENTS.filter((event) => (city === 'all' || event.city === city) && (!selectedDay || event.day === selectedDay)),
    [city, selectedDay]
  );

  const onSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/articles?search=${encodeURIComponent(value)}` : '/articles');
  };

  const pickCity = (next) => {
    setSelectedDay(null);
    setCity((current) => (current === next ? 'all' : next));
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Collection Aur&apos;art – Esquisses de l&apos;Art & son marché</title>
        <meta
          name="description"
          content="Collection Aur'art est un magazine mensuel qui explore l'art sous toutes ses formes : expositions, artistes, marché de l'art, droit et actualités."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.atelier} aria-hidden>
        {STAINS.map((stain) => (
          <img
            key={`${stain.top}-${stain.left || stain.right}`}
            src="/images/landing/stain.svg"
            alt=""
            className={styles.stain}
            style={{
              top: stain.top,
              left: stain.left,
              right: stain.right,
              width: stain.width,
              opacity: stain.opacity,
              transform: `rotate(${stain.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <header className={styles.layer}>
        <div className={styles.greenBar}>
          <button
            type="button"
            className={styles.burger}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={styles.nav} aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={`${styles.pill} ${item.href === '/' ? styles.pillActive : ''}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.tools}>
            <form className={styles.search} onSubmit={onSearch}>
              <Search size={15} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un article..."
                aria-label="Rechercher un article"
              />
            </form>
            <Link href={loggedIn ? '/dashboard' : '/login'} className={styles.login}>
              <User size={15} aria-hidden />
              {loggedIn ? 'Mon espace' : 'Se connecter'}
            </Link>
          </div>
        </div>
        {menuOpen && (
          <div className={styles.drawer}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.pill} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <form className={styles.search} onSubmit={onSearch}>
              <Search size={15} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un article..."
                aria-label="Rechercher un article"
              />
            </form>
          </div>
        )}
        <div className={styles.brand}>
          <img src="/images/landing/logo-aa.png" alt="" className={styles.logo} />
          <p className={styles.script}>Collection Aur&apos;art</p>
          <p className={styles.tag}>Esquisses de l&apos;art & son marché</p>
        </div>
      </header>

      <main className={`${styles.wrap} ${styles.layer}`}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Le magazine mensuel</p>
            <h1 className={styles.heroTitle}>L&apos;art, une histoire de regards</h1>
            <p className={styles.heroText}>
              Collection Aur&apos;art est un magazine mensuel qui explore l&apos;art sous toutes ses formes :
              expositions, artistes, marché de l&apos;art, droit, actualités et bien plus encore.
            </p>
            <Link href="/articles" className={styles.cta}>
              Découvrir le magazine <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.collage} aria-hidden>
            <span className={styles.blobSage} />
            <span className={styles.blobPink} />
            <svg className={styles.spark} style={{ left: 18, top: 24 }} width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l1.6 8.2L22 12l-8.4 1.8L12 24l-1.6-10.2L2 12l8.4-1.8L12 0z" />
            </svg>
            <figure className={`${styles.frame} ${styles.frameMain}`}>
              <img src="/images/landing/au-fil.png" alt="" />
            </figure>
            <figure className={`${styles.frame} ${styles.frameSide}`}>
              <img src="/images/landing/art-contemporain.jpg" alt="" />
            </figure>
            <figure className={`${styles.frame} ${styles.frameLow}`}>
              <img src="/images/landing/marche.jpg" alt="" />
            </figure>
            <p className={styles.note}>
              Explorer
              <br />
              Comprendre
              <br />
              Partager
            </p>
            <svg className={styles.flower} viewBox="0 0 140 150" aria-hidden>
              <path fill="#e7a8bb" d="M70 78c-8 16-28 22-36 12-9-12 2-28 14-34-16-6-28-22-22-34 6-12 24-8 34 4 2-16 16-30 30-28 14 2 20 18 14 32 14-8 32-6 36 8 4 14-8 28-24 30 10 10 12 28 2 36-12 10-32-6-48-26z" />
              <path fill="#f4c3d0" d="M68 74c-6 10-18 16-24 8-6-8 2-18 10-22-10-4-18-14-14-22 4-8 16-6 22 2 2-10 12-18 20-16 8 2 12 12 8 20 8-6 20-4 22 6 2 8-6 16-16 18 6 6 8 16 2 22-8 6-20-4-30-16z" />
              <circle cx="72" cy="72" r="7" fill="#f0d48a" />
              <path d="M74 96c8 14 6 28-2 40" fill="none" stroke="#7f9a72" strokeWidth="3" />
              <path d="M78 118c8 2 14 8 16 14" fill="none" stroke="#7f9a72" strokeWidth="2" />
            </svg>
          </div>
        </section>

        <section aria-labelledby="articles-title">
          <div className={styles.sectionHead}>
            <h2 id="articles-title" className={styles.sectionTitle}>Articles récents</h2>
            <Link href="/articles" className={styles.textLink}>
              Voir tous les articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.articleRow}>
            {articles.map((article) => (
              <Link key={article.id} href={article.href} className={styles.card}>
                <img src={article.image} alt="" className={styles.cardImg} />
                <div className={styles.cardBody}>
                  <span className={styles.badge}>{article.category}</span>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <div className={styles.cardFoot}>
                    <span>{article.date}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.split} aria-label="Agenda et portraits">
          <span className={styles.scrapOut} aria-hidden />
          <span className={styles.scrapOutB} aria-hidden />
          <div className={styles.agenda} id="agenda">
            <div className={styles.agendaTop}>
              <div>
                <h2>Agenda</h2>
                <p className={styles.cities}>Paris × Lyon</p>
              </div>
              <button type="button" className={styles.ghost} onClick={() => { setCity('all'); setSelectedDay(null); }}>
                Voir le calendrier complet <ArrowRight size={14} />
              </button>
            </div>
            <div className={styles.toggles}>
              <button type="button" className={`${styles.toggle} ${city === 'Paris' ? styles.toggleOn : ''}`} onClick={() => pickCity('Paris')}>
                <i className={`${styles.dot} ${styles.dotParis}`} /> Paris
              </button>
              <button type="button" className={`${styles.toggle} ${city === 'Lyon' ? styles.toggleOn : ''}`} onClick={() => pickCity('Lyon')}>
                <i className={`${styles.dot} ${styles.dotLyon}`} /> Lyon
              </button>
            </div>
            <div className={styles.agendaGrid}>
              <div className={styles.cal}>
                <p className={styles.calTitle}>Septembre 2026</p>
                <div className={styles.week}>
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>
                <div className={styles.days}>
                  {septemberCells().map((day, index) => {
                    if (!day) return <span key={`empty-${index}`} />;
                    const event = EVENTS.find((item) => item.day === day);
                    const tone = event?.city === 'Paris' ? styles.dayParis : event?.city === 'Lyon' ? styles.dayLyon : '';
                    const special = SPECIAL_DAYS.includes(day) ? styles.dayGold : '';
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`${styles.day} ${event ? styles.dayBtn : ''} ${tone} ${special} ${selectedDay === day ? styles.dayOn : ''}`}
                        onClick={() => {
                          if (!event) return;
                          setSelectedDay((current) => (current === day ? null : day));
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className={styles.legend}>
                  <span><i className={`${styles.dot} ${styles.dotParis}`} /> Paris</span>
                  <span><i className={`${styles.dot} ${styles.dotLyon}`} /> Lyon</span>
                  <span><i className={`${styles.dot} ${styles.dotGold}`} /> Événement spécial</span>
                </div>
              </div>
              <div className={styles.events}>
                {visibleEvents.map((event) => (
                  <article key={event.day} className={styles.event}>
                    <div className={styles.eventDate}>{event.day} se.<br />sept.</div>
                    <div>
                      <strong>{event.city}</strong>
                      <em>{event.title} – {event.place}</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className={styles.portraits}>
            <div className={styles.portraitStage}>
              <figure className={styles.portraitMain}>
                <img src="/images/landing/au-fil.png" alt="" />
              </figure>
              <figure className={styles.portraitSide}>
                <img src="/images/landing/histoire.png" alt="" />
              </figure>
            </div>
            <h2>Portraits</h2>
            <p>Des rencontres avec celles et ceux qui font vivre l&apos;art d&apos;aujourd&apos;hui.</p>
            <Link href="/articles" className={styles.cta}>
              Découvrir les portraits <ArrowRight size={16} />
            </Link>
          </aside>
        </section>

        <section aria-labelledby="rubriques-title">
          <div className={styles.rubBlock}>
            <div>
              <div className={styles.rubHead}>
                <h2 id="rubriques-title" className={styles.sectionTitle}>Les rubriques</h2>
                <Link href="/rubriques" className={styles.textLink}>
                  Voir toutes les rubriques <ArrowRight size={16} />
                </Link>
              </div>
              <div className={styles.rubScroller}>
                {RUBRIQUES.map((item) => (
                  <Link key={item.title} href={item.href} className={`${styles.rub} ${item.tone}`}>
                    <img src={item.image} alt="" />
                    <span>{item.title}</span>
                    <i>→</i>
                  </Link>
                ))}
              </div>
            </div>
            <article className={styles.join}>
              <img src="/images/landing/marche.jpg" alt="" />
              <div className={styles.joinShade} />
              <p className={styles.sticker}>Time, passe par là</p>
              <div className={styles.joinBody}>
                <h3>Rejoignez l&apos;aventure</h3>
                <p>
                  Rejoignez notre communauté et accédez à tous nos articles, enregistrez vos favoris,
                  et échangez avec nous.
                </p>
                <Link href="/register" className={styles.cta}>
                  Créer un compte <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          </div>
          <p className={styles.quote}>L&apos;art est un lien entre les hommes</p>
        </section>

        <footer className={styles.footer}>
          <Link href="/" className={styles.brandMini}>
            <img src="/images/landing/logo-aa.png" alt="" />
            <strong>Collection Aur&apos;art</strong>
          </Link>
          <div className={styles.social}>
            <p>Suivez-nous</p>
            <div className={styles.icons}>
              <a href="https://www.instagram.com/collection.aurart" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
              </a>
              <a href="https://www.tiktok.com/@collection.aurart" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v12.2a3.2 3.2 0 1 1-2.2-3V9.1A6.2 6.2 0 1 0 17 15V8.4A6.7 6.7 0 0 0 21 9.6V6.5A4 4 0 0 1 17.2 3H14z" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/collection-aurart" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H11V9h2.4v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20z" /></svg>
              </a>
            </div>
          </div>
          <p className={styles.legal}>
            <span>Mentions légales</span>
            <span>Politique de confidentialité</span>
            <span>CGV</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
