// ============================================
// COMPOSANT: PROJECT CARD
// ============================================

import React from 'react';
import Link from 'next/link';
import { Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@/components/atoms';
import { formatDate, formatCurrency } from '@/utils/format';
import type { ClientProject } from '@/types';

export interface ProjectCardProps {
  project: ClientProject;
  showActions?: boolean;
  onEdit?: (project: ClientProject) => void;
  onDelete?: (project: ClientProject) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'review':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'review':
        return 'En révision';
      case 'cancelled':
        return 'Annulé';
      case 'pending':
        return 'En attente';
      case 'on_hold':
        return 'En pause';
      default:
        return status;
    }
  };

  return (
    <Card hover bordered>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/dashboard/projects/${project.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors mb-2 cursor-pointer">
                {project.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>
          <Badge variant={getStatusColor(project.status)} className="ml-4">
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progression</span>
            <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(project.created_at)}
          </span>
          {project.budget && (
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {formatCurrency(project.budget)}
            </span>
          )}
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => onEdit?.(project)}
            >
              Modifier
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(project)}
            >
              Supprimer
            </Button>
            <Link href={`/dashboard/projects/${project.id}`}>
              <Button variant="primary" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
