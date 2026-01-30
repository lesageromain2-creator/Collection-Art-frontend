// ============================================
// COMPOSANT: BLOG CARD
// ============================================

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/atoms';
import { formatDate } from '@/utils/format';
import type { BlogPost } from '@/types';

export interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'default' }) => {
  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <Card hover className="overflow-hidden group cursor-pointer">
          {post.featured_image_url && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="primary">Article en vedette</Badge>
              </div>
            </div>
          )}
          <CardContent className="p-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.reading_time} min
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <div className="flex gap-4 group cursor-pointer">
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(post.published_at || post.created_at)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card hover className="overflow-hidden group cursor-pointer h-full">
        {post.featured_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {post.reading_time} min
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex gap-2">
            {post.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

BlogCard.displayName = 'BlogCard';

export default BlogCard;
