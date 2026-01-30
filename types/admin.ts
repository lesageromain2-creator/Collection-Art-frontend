// ============================================
// TYPES ADMINISTRATION
// ============================================

import { UUID, Timestamps } from './common';

export type ActivityType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'upload'
  | 'download'
  | 'export'
  | 'import';

export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';
export type AlertStatus = 'new' | 'acknowledged' | 'resolved' | 'dismissed';

export interface AdminActivityLog extends Timestamps {
  id: UUID;
  admin_id: UUID;
  action: ActivityType;
  entity_type: string; // 'user', 'project', 'post', etc.
  entity_id?: UUID;
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export interface AdminAlert extends Timestamps {
  id: UUID;
  title: string;
  message: string;
  level: AlertLevel;
  status: AlertStatus;
  triggered_by?: string; // 'system', 'user_action', etc.
  entity_type?: string;
  entity_id?: UUID;
  acknowledged_by?: UUID;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface DashboardStats {
  users: {
    total: number;
    new_today: number;
    new_this_week: number;
    verified: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    in_progress: number;
  };
  reservations: {
    total: number;
    today: number;
    this_week: number;
    confirmed: number;
  };
  revenue: {
    total: number;
    this_month: number;
    last_month: number;
    pending: number;
  };
  messages: {
    total: number;
    unread: number;
    replied: number;
  };
}

export interface SystemSettings extends Timestamps {
  id: UUID;
  key: string;
  value: any;
  category: string;
  description?: string;
  is_public: boolean;
}
