// ============================================
// TYPES TÉMOIGNAGES
// ============================================

import { UUID, Timestamps } from './common';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial extends Timestamps {
  id: UUID;
  client_name: string;
  client_email?: string;
  client_company?: string;
  client_position?: string;
  client_avatar_url?: string;
  content: string;
  rating: number; // 1-5
  status: TestimonialStatus;
  is_featured: boolean;
  project_id?: UUID;
  approved_at?: string;
  approved_by?: UUID;
}

export interface TestimonialCreateData {
  client_name: string;
  client_email?: string;
  client_company?: string;
  client_position?: string;
  client_avatar_url?: string;
  content: string;
  rating: number;
  project_id?: UUID;
}

export interface TestimonialUpdateData extends Partial<TestimonialCreateData> {
  status?: TestimonialStatus;
  is_featured?: boolean;
}
