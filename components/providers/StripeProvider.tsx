// ============================================
// STRIPE PROVIDER
// ============================================

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe, stripeElementsOptions } from '@/lib/stripe';

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
  options?: any;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  clientSecret,
  options,
}) => {
  const stripePromise = getStripe();

  const elementsOptions = clientSecret
    ? {
        ...stripeElementsOptions,
        ...options,
        clientSecret,
      }
    : undefined;

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
