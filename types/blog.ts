// ============================================
// TYPES BLOG
// ============================================

import { UUID, Timestamps } from './common';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost extends Timestamps {
  id: UUID;
  author_id: UUID;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  status: PostStatus;
  published_at?: string;
  view_count: number;
  reading_time: number; // en minutes
  tags?: string[];
  meta_description?: string;
  meta_keywords?: string[];
}

export interface BlogPostCreateData {
  title: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  status: PostStatus;
  tags?: string[];
  meta_description?: string;
  meta_keywords?: string[];
}

export interface BlogPostUpdateData extends Partial<BlogPostCreateData> {
  published_at?: string;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    id: UUID;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}
