// ============================================
// CONFIGURATION STRIPE CLIENT
// ============================================

import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

if (!stripePublishableKey) {
  console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY n\'est pas définie');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise && stripePublishableKey) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Apparence Stripe Elements personnalisée
export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0066FF',
    colorBackground: '#ffffff',
    colorText: '#0A0E27',
    colorDanger: '#df1b41',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #E5E7EB',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #0066FF',
      boxShadow: '0 0 0 3px rgba(0, 102, 255, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '8px',
    },
  },
};

// Options par défaut pour Elements
export const stripeElementsOptions = {
  appearance: stripeAppearance,
  loader: 'auto' as const,
};
