// ============================================
// TYPES RÉSERVATIONS
// ============================================

import { UUID, Timestamps } from './common';

export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Reservation extends Timestamps {
  id: UUID;
  user_id?: UUID;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  status: ReservationStatus;
  special_requests?: string;
  table_number?: string;
  confirmation_code: string;
  reminder_sent: boolean;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface ReservationCreateData {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
}

export interface ReservationUpdateData {
  status?: ReservationStatus;
  reservation_date?: string;
  reservation_time?: string;
  party_size?: number;
  special_requests?: string;
  table_number?: string;
}

export interface ReservationAvailability {
  date: string;
  availableSlots: string[];
  maxPartySize: number;
}
