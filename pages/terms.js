// Conditions générales d'utilisation — Mentions légales
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssociationLogo from '../components/AssociationLogo';

const SITE_NAME = "Collection Aur'art";
const EMAIL = "collection.aurart@gmail.com";

export default function TermsPage() {
  const settings = { site_name: SITE_NAME };

  return (
    <>
      <Head>
        <title>Conditions générales – {SITE_NAME}</title>
        <meta name="description" content="Conditions générales d'utilisation et mentions légales de Collection Aur'art." />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={settings} />

        <main className="px-6 py-20 md:py-32">
          <section className="mx-auto max-w-4xl text-center mb-12">
            <div className="mb-8 flex justify-center">
              <AssociationLogo size="md" linkToHome />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-anthracite mb-6">
              Conditions générales d&apos;utilisation
            </h1>
            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-6" />
            <p className="text-lg text-gris">
              Mentions légales et conditions d&apos;utilisation du site
            </p>
          </section>

          <section className="mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-anthracite/5">
              <div className="prose prose-lg max-w-none space-y-6 text-gris">
                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">1. Identité</h2>
                  <p>
                    <strong>{SITE_NAME}</strong> — Association loi 1901. Association à but non lucratif régie par la loi du 1er juillet 1901.
                  </p>
                  <p>
                    Association de valorisation du patrimoine artistique. Esquisses de l&apos;Art & son marché.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">2. Objet du site</h2>
                  <p>
                    Le présent site a pour objet de présenter les activités de l&apos;association, ses articles et analyses sur l&apos;histoire de l&apos;art, le marché de l&apos;art et les enjeux patrimoniaux.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">3. Propriété intellectuelle</h2>
                  <p>
                    Le contenu de ce site (textes, images, logos, maquettes) est protégé par le droit d&apos;auteur et les droits voisins. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable écrite de l&apos;association, est interdite.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">4. Responsabilité</h2>
                  <p>
                    L&apos;association s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur ce site. Elle ne peut toutefois garantir l&apos;exhaustivité ou l&apos;absence d&apos;erreur. L&apos;utilisation du site relève de la seule responsabilité de l&apos;internaute.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">5. Données personnelles</h2>
                  <p>
                    Les données personnelles collectées sur ce site font l&apos;objet d&apos;une politique de confidentialité détaillée. Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
                  </p>
                  <p>
                    Consultez notre{' '}
                    <Link href="/privacy" className="text-burgundy hover:underline font-medium">
                      politique de confidentialité
                    </Link>
                    {' '}pour plus d&apos;informations.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">6. Contact</h2>
                  <p>
                    Pour toute question relative aux présentes conditions :{' '}
                    <a href={`mailto:${EMAIL}`} className="text-burgundy hover:underline">{EMAIL}</a>
                  </p>
                </div>

                <p className="text-sm text-gris/80 pt-4 border-t border-anthracite/10">
                  Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer settings={settings} />
      </div>
    </>
  );
}
