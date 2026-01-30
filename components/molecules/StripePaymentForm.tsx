// ============================================
// COMPOSANT MOLECULE: STRIPE PAYMENT FORM
// ============================================

import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '@/components/atoms/Button';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-toastify';

export interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  returnUrl?: string;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'EUR',
  onSuccess,
  onError,
  returnUrl,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        const message = error.message || 'Une erreur est survenue';
        setErrorMessage(message);
        toast.error(message);
        onError?.(message);
      } else {
        toast.success('Paiement réussi !');
        onSuccess?.();
      }
    } catch (err: any) {
      const message = err.message || 'Erreur de paiement';
      setErrorMessage(message);
      toast.error(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Montant */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Montant à payer</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(amount / 100, currency)}
          </span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <PaymentElement />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Bouton de soumission */}
      <Button
        type="submit"
        fullWidth
        isLoading={isProcessing}
        disabled={!stripe || !elements || isProcessing}
        size="lg"
      >
        {isProcessing
          ? 'Traitement en cours...'
          : `Payer ${formatCurrency(amount / 100, currency)}`}
      </Button>

      {/* Mention sécurité */}
      <p className="text-xs text-center text-gray-500">
        Paiement sécurisé par Stripe. Vos informations bancaires ne sont jamais stockées sur nos serveurs.
      </p>
    </form>
  );
};

StripePaymentForm.displayName = 'StripePaymentForm';

export default StripePaymentForm;
