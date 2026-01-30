// ============================================
// PAGE: PAYMENT SUCCESS
// ============================================

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MainLayout } from '@/components/layouts';
import { Card, CardContent, Button } from '@/components/atoms';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const { payment_intent, payment_intent_client_secret } = router.query;

  useEffect(() => {
    // Ici vous pouvez vérifier le statut du paiement avec votre backend
    if (payment_intent) {
      console.log('Payment Intent:', payment_intent);
      // Appel API pour confirmer le paiement
    }
  }, [payment_intent]);

  return (
    <MainLayout
      title="Paiement réussi - Le Sage Dev"
      description="Votre paiement a été effectué avec succès"
    >
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Paiement réussi !
              </h1>
              <p className="text-gray-600 mb-8">
                Merci pour votre paiement. Votre transaction a été effectuée avec succès.
              </p>

              {/* Payment Info */}
              {payment_intent && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Numéro de transaction</p>
                    <p className="font-mono text-xs text-gray-900 break-all">
                      {payment_intent}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Accéder au dashboard
                </Button>

                <Button
                  fullWidth
                  variant="outline"
                  size="lg"
                  leftIcon={<Download className="w-5 h-5" />}
                >
                  Télécharger le reçu
                </Button>

                <Link href="/" className="block">
                  <Button fullWidth variant="ghost">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                Un email de confirmation vous a été envoyé avec les détails de votre paiement.
              </p>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'aide ?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccessPage;
