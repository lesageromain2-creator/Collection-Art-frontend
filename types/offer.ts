// ============================================
// TYPES OFFRES DE SERVICES
// ============================================

import { UUID, Timestamps } from './common';

export type OfferStatus = 'active' | 'inactive' | 'draft';
export type OfferType = 'service' | 'package' | 'subscription';

export interface Offer extends Timestamps {
  id: UUID;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  currency: string;
  discount_percentage?: number;
  final_price: number;
  type: OfferType;
  duration?: string; // ex: "1 mois", "30 jours"
  features: string[];
  is_featured: boolean;
  is_popular: boolean;
  status: OfferStatus;
  image_url?: string;
  order_index: number;
  metadata?: Record<string, any>;
}

export interface OfferCreateData {
  title: string;
  description: string;
  short_description: string;
  price: number;
  currency?: string;
  discount_percentage?: number;
  type: OfferType;
  duration?: string;
  features: string[];
  is_featured?: boolean;
  is_popular?: boolean;
  image_url?: string;
}

export interface OfferUpdateData extends Partial<OfferCreateData> {
  status?: OfferStatus;
}
