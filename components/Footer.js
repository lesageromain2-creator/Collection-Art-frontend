import Link from 'next/link';
import { Mail, Instagram, Linkedin } from 'lucide-react';
import AssociationLogo from './AssociationLogo';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const SITE_NAME = "Collection Aur'art";
const SITE_DESCRIPTION = "Association de passionnés qui questionne, valorise et transmet l'histoire de l'art, le marché de l'art et les enjeux patrimoniaux à travers articles et analyses.";
const EMAIL = "collection.aurart@gmail.com";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy/10 bg-creme">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <AssociationLogo size="sm" linkToHome className="flex-shrink-0" />
              <div>
                <p className="font-heading text-lg font-semibold text-navy">{SITE_NAME}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gris">
                  Esquisses de l'Art & son marché
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm text-gris leading-relaxed">{SITE_DESCRIPTION}</p>

            <p className="mt-4 text-xs text-gris italic">
              « L'art n'est pas un luxe réservé à quelques-uns : c'est un patrimoine commun qui façonne notre regard sur le monde. »
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">Navigation</p>
            <ul className="mt-4 space-y-2 text-sm text-gris">
              <li>
                <Link href="/" className="hover:text-burgundy transition-colors">Accueil</Link>
              </li>
              <li>
                <Link href="/rubriques" className="hover:text-burgundy transition-colors">Rubriques</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-burgundy transition-colors">Articles</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-burgundy transition-colors">Notre équipe</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-burgundy transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy">Contact & Réseaux</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-burgundy flex-shrink-0" />
                <a
                  className="text-sm text-gris hover:text-burgundy transition-colors break-all"
                  href={`mailto:${EMAIL}`}
                >
                  {EMAIL}
                </a>
              </li>
              <li className="pt-2">
                <p className="text-xs text-gris mb-3">Suivez-nous</p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.tiktok.com/@collection.aurart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy hover:bg-burgundy hover:text-creme transition-all"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/collection.aurart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy hover:bg-burgundy hover:text-creme transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/collection-aurart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy hover:bg-burgundy hover:text-creme transition-all"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-navy/10 pt-6 text-xs text-gris md:flex-row">
          <p>© {currentYear} {SITE_NAME}. Tous droits réservés.</p>
          <p className="text-center md:text-right">Association de valorisation du patrimoine artistique</p>
        </div>

        {/* Mentions légales — informations essentielles */}
        <div className="mt-8 border-t border-navy/10 pt-6 text-xs text-gris space-y-3">
          <p className="font-medium text-navy">Mentions légales</p>
          <p>
            <strong>{SITE_NAME}</strong> — Association loi 1901. Association à but non lucratif régie par la loi du 1er juillet 1901.
          </p>
          <p>
            Le contenu de ce site (textes, images, logos) est protégé par le droit d'auteur. Toute reproduction est interdite sans autorisation.
          </p>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Contact :{' '}
            <a href={`mailto:${EMAIL}`} className="text-burgundy hover:underline">{EMAIL}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
