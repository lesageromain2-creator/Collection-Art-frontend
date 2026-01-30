// ============================================
// TYPES NEWSLETTER
// ============================================

import { UUID, Timestamps } from './common';

export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';

export interface NewsletterSubscriber extends Timestamps {
  id: UUID;
  email: string;
  first_name?: string;
  last_name?: string;
  status: SubscriberStatus;
  subscribed_at: string;
  unsubscribed_at?: string;
  confirmation_token?: string;
  is_confirmed: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface NewsletterSubscribeData {
  email: string;
  first_name?: string;
  last_name?: string;
  tags?: string[];
}

export interface NewsletterUnsubscribeData {
  email: string;
  reason?: string;
}

export interface NewsletterCampaign extends Timestamps {
  id: UUID;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sent_at?: string;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_for?: string;
}
