// ============================================
// TYPES UTILISATEUR
// ============================================

import { UUID, Timestamps } from './common';

export interface User extends Timestamps {
  id: UUID;
  email: string;
  password_hash?: string; // Ne pas exposer côté client
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  role: 'admin' | 'client' | 'user';
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string;
  last_login_at?: string;
  login_count: number;
}

export interface UserProfile {
  id: UUID;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  avatar_url?: string;
}

export interface UserNotification extends Timestamps {
  id: UUID;
  user_id: UUID;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
}

export interface EmailPreference extends Timestamps {
  id: UUID;
  user_id: UUID;
  receive_newsletters: boolean;
  receive_project_updates: boolean;
  receive_reservation_reminders: boolean;
  receive_promotional_emails: boolean;
}
