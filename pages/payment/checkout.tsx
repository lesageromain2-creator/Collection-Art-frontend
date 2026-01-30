// ============================================
// PAGE: CHECKOUT PAYMENT
// ============================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/components/layouts';
import { Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/atoms';
import { StripeProvider } from '@/components/providers';
import { StripePaymentForm } from '@/components/molecules';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-toastify';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { amount, currency = 'EUR', description, project_id } = router.query;

  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!amount) {
      toast.error('Montant manquant');
      router.push('/');
      return;
    }

    // Créer le Payment Intent
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);

        const response = await axiosInstance.post('/payments/create-intent', {
          amount: parseInt(amount as string),
          currency: currency as string,
          description: description as string,
          metadata: project_id
            ? { project_id: project_id as string }
            : undefined,
        });

        if (response.data.data.client_secret) {
          setClientSecret(response.data.data.client_secret);
        } else {
          throw new Error('Client secret manquant');
        }
      } catch (error: any) {
        console.error('Erreur création payment intent:', error);
        toast.error('Erreur lors de l\'initialisation du paiement');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, currency, description, project_id, router]);

  if (!amount) {
    return null;
  }

  const amountNumber = parseInt(amount as string);

  return (
    <MainLayout
      title="Paiement - Le Sage Dev"
      description="Procédez au paiement sécurisé"
    >
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement sécurisé
            </h1>
            <p className="text-gray-600">
              Finalisez votre achat en toute sécurité
            </p>
          </div>

          {/* Payment Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description</span>
                    <span className="font-medium">{description}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(amountNumber / 100, currency as string)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : clientSecret ? (
                <StripeProvider clientSecret={clientSecret}>
                  <StripePaymentForm
                    amount={amountNumber}
                    currency={currency as string}
                    onSuccess={() => {
                      router.push('/payment/success');
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                    }}
                    returnUrl={`${window.location.origin}/payment/success`}
                  />
                </StripeProvider>
              ) : (
                <div className="text-center text-red-600 py-8">
                  Erreur lors du chargement du formulaire de paiement
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              🔒 Paiement 100% sécurisé via Stripe
            </p>
            <p className="mt-1">
              Vos informations bancaires ne sont jamais stockées sur nos serveurs
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
