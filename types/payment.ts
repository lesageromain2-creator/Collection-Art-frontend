// ============================================
// TYPES PAIEMENTS STRIPE
// ============================================

import { UUID } from './common';
import type { Stripe } from '@stripe/stripe-js';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  client_secret: string;
  customer?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  customer_email?: string;
  amount_total: number;
  currency: string;
  status: string;
}

export interface PaymentData {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: {
    project_id?: UUID;
    user_id?: UUID;
    order_id?: UUID;
    [key: string]: any;
  };
}

export interface StripeElementsOptions {
  clientSecret: string;
  appearance?: Stripe.Appearance;
  loader?: 'auto' | 'always' | 'never';
}

export interface PaymentFormData {
  amount: number;
  email: string;
  name: string;
  description?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_email: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  created: number;
  due_date?: number;
  invoice_pdf?: string;
}

export interface Subscription {
  id: string;
  customer: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'trialing';
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    price: string;
    quantity: number;
  }[];
}
