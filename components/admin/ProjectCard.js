// frontend/components/admin/ProjectCard.js
import { Calendar, User, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const getStatusInfo = (status) => {
    const statuses = {
      planning: { label: 'Planification', icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      in_progress: { label: 'En cours', icon: Clock, color: '#0066FF', bg: 'rgba(0, 102, 255, 0.15)' },
      on_hold: { label: 'En attente', icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      review: { label: 'En révision', icon: Clock, color: '#764ba2', bg: 'rgba(118, 75, 162, 0.15)' },
      completed: { label: 'Terminé', icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      cancelled: { label: 'Annulé', icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    };
    return statuses[status] || statuses.planning;
  };

  const getPriorityColor = (priority) => {
    const priorities = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#FF6B35',
      urgent: '#ef4444',
    };
    return priorities[priority] || priorities.medium;
  };

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;
  const isOverdue = project.estimated_delivery && new Date(project.estimated_delivery) < new Date();

  return (
    <div className="project-card" onClick={onClick}>
      <div className="card-header">
        <div className="project-title-section">
          <h3 className="project-title">{project.title}</h3>
          <div className="project-meta">
            <span className="client-name">
              <User size={14} />
              {project.client_name || `${project.firstname} ${project.lastname}`}
            </span>
          </div>
        </div>
        <div className="status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
          <StatusIcon size={14} />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="card-body">
        {project.description && (
          <p className="project-description">{project.description}</p>
        )}

        <div className="project-progress">
          <div className="progress-header">
            <span>Progression</span>
            <span className="progress-value">{project.progress || 0}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="project-info-grid">
          {project.priority && (
            <div className="info-item">
              <span className="info-label">Priorité</span>
              <span 
                className="priority-badge"
                style={{ 
                  background: `rgba(${getPriorityColor(project.priority)}, 0.15)`,
                  color: getPriorityColor(project.priority)
                }}
              >
                {project.priority}
              </span>
            </div>
          )}
          
          {project.estimated_delivery && (
            <div className="info-item">
              <span className="info-label">Livraison</span>
              <span className={`delivery-date ${isOverdue ? 'overdue' : ''}`}>
                <Calendar size={14} />
                {new Date(project.estimated_delivery).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .project-title {
          color: white;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .client-name {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .project-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-progress {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-header span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          font-weight: 600;
        }

        .progress-value {
          color: white;
          font-weight: 700;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066FF, #00D9FF);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .project-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
          display: inline-block;
          width: fit-content;
        }

        .delivery-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          font-size: 13px;
          font-weight: 600;
        }

        .delivery-date.overdue {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
