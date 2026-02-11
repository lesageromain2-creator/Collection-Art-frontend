'use client';

import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'collection-aurart-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) setVisible(true);
  }, [mounted]);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]"
      style={{ background: 'linear-gradient(180deg, #F9F6F0 0%, #F5F1EA 100%)', borderTop: '2px solid #212E50' }}
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="flex-1">
            <h2 id="cookie-title" className="font-heading text-base md:text-lg font-semibold text-navy mb-2">
              Utilisation des cookies
            </h2>
            <p id="cookie-desc" className="text-sm text-gris leading-relaxed">
              Notre association utilise des cookies et collecte des données personnelles pour : le formulaire de contact, l&apos;inscription des membres, la newsletter, les commentaires sur les articles et les likes. Ces informations nous permettent d&apos;améliorer nos services et de répondre à vos demandes. En cliquant sur &quot;Accepter&quot;, vous consentez à cette utilisation. Conformément au RGPD, vous pouvez à tout moment exercer vos droits.
            </p>
          </div>
          <div className="flex flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={refuse}
              className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 border-navy/30 text-navy hover:bg-navy/5 transition-colors"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={accept}
              className="px-5 py-2.5 text-sm font-medium rounded-lg text-creme transition-all"
              style={{ background: 'linear-gradient(135deg, #7C2A3C 0%, #212E50 100%)' }}
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
