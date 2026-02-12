// Politique de confidentialité — Données personnelles, cookies, RGPD
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AssociationLogo from '../components/AssociationLogo';

const SITE_NAME = "Collection Aur'art";
const EMAIL = "collection.aurart@gmail.com";

export default function PrivacyPage() {
  const settings = { site_name: SITE_NAME };

  return (
    <>
      <Head>
        <title>Politique de confidentialité – {SITE_NAME}</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles de Collection Aur'art. Cookies, RGPD." />
      </Head>

      <div className="min-h-screen bg-creme">
        <Header settings={settings} />

        <main className="px-6 py-20 md:py-32">
          <section className="mx-auto max-w-4xl text-center mb-12">
            <div className="mb-8 flex justify-center">
              <AssociationLogo size="md" linkToHome />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-anthracite mb-6">
              Politique de confidentialité
            </h1>
            <div className="w-24 h-1 bg-primary-gradient mx-auto rounded-full mb-6" />
            <p className="text-lg text-gris">
              Protection des données personnelles et utilisation des cookies
            </p>
          </section>

          <section className="mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-anthracite/5">
              <div className="prose prose-lg max-w-none space-y-6 text-gris">
                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">1. Responsable du traitement</h2>
                  <p>
                    <strong>{SITE_NAME}</strong> — Association loi 1901. Adresse de contact :{' '}
                    <a href={`mailto:${EMAIL}`} className="text-burgundy hover:underline">{EMAIL}</a>
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">2. Données collectées</h2>
                  <p>Notre association collecte des données personnelles dans les cas suivants :</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Formulaire de contact</strong> : nom, adresse email, objet et message</li>
                    <li><strong>Inscription des membres</strong> : nom, prénom, email, mot de passe (hashé)</li>
                    <li><strong>Newsletter</strong> : adresse email pour l&apos;envoi des actualités</li>
                    <li><strong>Commentaires sur les articles</strong> : contenu et identité de l&apos;auteur</li>
                    <li><strong>Likes / favoris</strong> : association utilisateur–article</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">3. Utilisation des cookies</h2>
                  <p>
                    Notre site utilise des cookies pour le bon fonctionnement du service : mémorisation de votre consentement, session de connexion, préférences. Ces cookies et la collecte de données personnelles nous permettent d&apos;améliorer nos services et de répondre à vos demandes.
                  </p>
                  <p>
                    Lors de votre première visite, une bannière vous propose d&apos;accepter ou de refuser les cookies. Votre choix est enregistré (cookie <code className="px-1.5 py-0.5 bg-creme rounded text-sm">collection-aurart-cookie-consent</code>).
                  </p>
                  <p>
                    En cliquant sur &quot;Accepter&quot; dans la bannière des cookies, vous consentez à cette utilisation.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">4. Finalités et base légale</h2>
                  <p>
                    Les données sont traitées pour : répondre à vos demandes de contact, gérer votre compte membre, envoyer la newsletter si vous y êtes abonné(e), publier vos commentaires, gérer vos favoris. La base légale repose sur votre consentement et, le cas échéant, sur l&apos;exécution d&apos;un contrat.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">5. Durée de conservation</h2>
                  <p>
                    Les données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, puis supprimées ou anonymisées conformément aux obligations légales.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">6. Vos droits (RGPD)</h2>
                  <p>
                    Conformément au Règlement général sur la protection des données (RGPD), vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
                    <li><strong>Droit de rectification</strong> : faire corriger des données inexactes</li>
                    <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
                    <li><strong>Droit à la limitation du traitement</strong> : restreindre l&apos;utilisation de vos données</li>
                    <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
                    <li><strong>Droit d&apos;opposition</strong> : vous opposer à un traitement</li>
                  </ul>
                  <p className="mt-3">
                    Pour exercer ces droits :{' '}
                    <a href={`mailto:${EMAIL}`} className="text-burgundy hover:underline">{EMAIL}</a>
                  </p>
                  <p>
                    Vous disposez également du droit d&apos;introduire une réclamation auprès de la CNIL :{' '}
                    <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline">www.cnil.fr</a>
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">7. Sécurité</h2>
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, perte ou altération.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">8. Liens utiles</h2>
                  <p>
                    Consultez également nos{' '}
                    <Link href="/terms" className="text-burgundy hover:underline font-medium">
                      conditions générales d&apos;utilisation
                    </Link>
                    {' '}et les mentions légales en bas de page.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading text-xl font-bold text-navy mb-3">9. Contact</h2>
                  <p>
                    Pour toute question sur cette politique de confidentialité :{' '}
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
