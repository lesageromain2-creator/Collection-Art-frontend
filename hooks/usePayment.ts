// ============================================
// HOOK PAIEMENTS STRIPE
// ============================================

import { useState, useCallback } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axiosInstance from '@/lib/axios';
import type { PaymentData, PaymentIntent } from '@/types';
import { toast } from 'react-toastify';

export const usePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Créer un Payment Intent
  const createPaymentIntent = useCallback(async (data: PaymentData): Promise<PaymentIntent | null> => {
    try {
      const response = await axiosInstance.post<{ data: PaymentIntent }>(
        '/payments/create-intent',
        data
      );

      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de création du paiement';
      setPaymentError(message);
      toast.error(message);
      return null;
    }
  }, []);

  // Créer une Checkout Session
  const createCheckoutSession = useCallback(async (data: PaymentData): Promise<string | null> => {
    try {
      const response = await axiosInstance.post<{ data: { url: string } }>(
        '/payments/create-checkout',
        data
      );

      return response.data.data.url;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de création du checkout';
      setPaymentError(message);
      toast.error(message);
      return null;
    }
  }, []);

  // Confirmer le paiement avec Stripe Elements
  const confirmPayment = useCallback(async (returnUrl?: string) => {
    if (!stripe || !elements) {
      setPaymentError('Stripe n\'est pas chargé');
      return { success: false };
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        setPaymentError(error.message || 'Erreur de paiement');
        toast.error(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'Erreur de paiement';
      setPaymentError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  }, [stripe, elements]);

  // Vérifier le statut du paiement
  const checkPaymentStatus = useCallback(async (paymentIntentId: string) => {
    try {
      const response = await axiosInstance.get(`/payments/status/${paymentIntentId}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur de vérification';
      toast.error(message);
      return null;
    }
  }, []);

  return {
    isProcessing,
    paymentError,
    createPaymentIntent,
    createCheckoutSession,
    confirmPayment,
    checkPaymentStatus,
    stripe,
    elements,
  };
};

// Hook simplifié pour redirection Checkout
export const useCheckoutRedirect = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const redirectToCheckout = useCallback(async (data: PaymentData) => {
    setIsRedirecting(true);

    try {
      const response = await axiosInstance.post<{ data: { url: string } }>(
        '/payments/create-checkout',
        data
      );

      if (response.data.data.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur de redirection');
      setIsRedirecting(false);
    }
  }, []);

  return {
    isRedirecting,
    redirectToCheckout,
  };
};
