// ============================================
// TYPES PORTFOLIO
// ============================================

import { UUID, Timestamps } from './common';

export type PortfolioStatus = 'draft' | 'published' | 'archived';

export interface PortfolioProject extends Timestamps {
  id: UUID;
  title: string;
  slug: string;
  description: string;
  client_name?: string;
  project_url?: string;
  featured_image_url?: string;
  status: PortfolioStatus;
  published_at?: string;
  technologies?: string[];
  categories?: string[];
  view_count: number;
  is_featured: boolean;
  order_index: number;
}

export interface PortfolioImage extends Timestamps {
  id: UUID;
  portfolio_project_id: UUID;
  image_url: string;
  cloudinary_public_id?: string;
  caption?: string;
  order_index: number;
  width?: number;
  height?: number;
}

export interface PortfolioProjectCreateData {
  title: string;
  description: string;
  client_name?: string;
  project_url?: string;
  featured_image_url?: string;
  technologies?: string[];
  categories?: string[];
  is_featured?: boolean;
}

export interface PortfolioProjectUpdateData extends Partial<PortfolioProjectCreateData> {
  status?: PortfolioStatus;
  published_at?: string;
}

export interface PortfolioProjectWithImages extends PortfolioProject {
  images: PortfolioImage[];
}
