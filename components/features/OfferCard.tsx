// ============================================
// COMPOSANT: OFFER CARD
// ============================================

import React from 'react';
import { Check, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from '@/components/atoms';
import { formatCurrency } from '@/utils/format';
import type { Offer } from '@/types';

export interface OfferCardProps {
  offer: Offer;
  onSelect?: (offer: Offer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onSelect }) => {
  const hasDiscount = offer.discount_percentage && offer.discount_percentage > 0;

  return (
    <Card
      hover={!offer.is_featured}
      bordered
      className={offer.is_featured ? 'border-2 border-primary shadow-lg relative' : ''}
    >
      {offer.is_featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="primary" className="px-4 py-1">
            <Star className="w-4 h-4 mr-1 inline" />
            Recommandé
          </Badge>
        </div>
      )}

      {offer.is_popular && !offer.is_featured && (
        <div className="absolute top-4 right-4">
          <Badge variant="success">Populaire</Badge>
        </div>
      )}

      <CardHeader className="text-center pt-8">
        <CardTitle className="text-2xl mb-2">{offer.title}</CardTitle>
        <p className="text-gray-600">{offer.short_description}</p>
      </CardHeader>

      <CardContent className="text-center">
        {/* Prix */}
        <div className="mb-6">
          {hasDiscount && (
            <div className="text-gray-400 line-through text-lg mb-1">
              {formatCurrency(offer.price, offer.currency)}
            </div>
          )}
          <div className="text-4xl font-bold text-primary mb-1">
            {formatCurrency(offer.final_price, offer.currency)}
          </div>
          {offer.duration && (
            <div className="text-gray-500 text-sm">/ {offer.duration}</div>
          )}
          {hasDiscount && (
            <Badge variant="danger" className="mt-2">
              -{offer.discount_percentage}%
            </Badge>
          )}
        </div>

        {/* Fonctionnalités */}
        <div className="space-y-3 text-left mb-6">
          {offer.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          fullWidth
          variant={offer.is_featured ? 'primary' : 'outline'}
          size="lg"
          onClick={() => onSelect?.(offer)}
        >
          Choisir cette offre
        </Button>
      </CardFooter>
    </Card>
  );
};

OfferCard.displayName = 'OfferCard';

export default OfferCard;
