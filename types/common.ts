// ============================================
// TYPES COMMUNS
// ============================================

export type UUID = string;

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Status = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'completed' 
  | 'cancelled' 
  | 'draft' 
  | 'published';

export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface CloudinaryFile {
  id: UUID;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  cloudinary_public_id: string;
  cloudinary_url: string;
  cloudinary_secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  created_at: string;
}
