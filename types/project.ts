// ============================================
// TYPES PROJETS CLIENTS
// ============================================

import { UUID, Timestamps, CloudinaryFile } from './common';

export type ProjectStatus = 
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ClientProject extends Timestamps {
  id: UUID;
  client_id: UUID;
  title: string;
  description: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  budget?: number;
  paid_amount: number;
  progress: number; // 0-100
  is_featured: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ProjectFile extends Timestamps {
  id: UUID;
  project_id: UUID;
  uploaded_by: UUID;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  cloudinary_public_id?: string;
  is_deliverable: boolean;
  version: number;
  description?: string;
}

export interface ProjectTask extends Timestamps {
  id: UUID;
  project_id: UUID;
  assigned_to?: UUID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  order_index: number;
}

export interface ProjectUpdate extends Timestamps {
  id: UUID;
  project_id: UUID;
  created_by: UUID;
  title: string;
  content: string;
  is_milestone: boolean;
  attachments?: string[];
}

export interface ProjectComment extends Timestamps {
  id: UUID;
  project_id: UUID;
  user_id: UUID;
  parent_comment_id?: UUID;
  content: string;
  is_internal: boolean; // Visible admin uniquement
  edited_at?: string;
}

export interface ProjectMilestone extends Timestamps {
  id: UUID;
  project_id: UUID;
  title: string;
  description?: string;
  due_date?: string;
  completed_at?: string;
  is_completed: boolean;
  order_index: number;
}

export interface ProjectCreateData {
  title: string;
  description: string;
  start_date?: string;
  budget?: number;
  tags?: string[];
}

export interface ProjectUpdateData {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  end_date?: string;
  progress?: number;
  tags?: string[];
}
