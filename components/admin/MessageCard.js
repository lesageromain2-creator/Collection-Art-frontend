// frontend/components/admin/MessageCard.js
import { Mail, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function MessageCard({ message, onClick }) {
  const getStatusInfo = (status) => {
    const statuses = {
      new: { label: 'Nouveau', icon: AlertCircle, color: '#0066FF', bg: 'rgba(0, 102, 255, 0.15)' },
      read: { label: 'Lu', icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      replied: { label: 'Répondu', icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      archived: { label: 'Archivé', icon: XCircle, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
    };
    return statuses[status] || statuses.new;
  };

  const getPriorityColor = (priority) => {
    const priorities = {
      low: '#10b981',
      normal: '#0066FF',
      high: '#FF6B35',
      urgent: '#ef4444',
    };
    return priorities[priority] || priorities.normal;
  };

  const statusInfo = getStatusInfo(message.status);
  const StatusIcon = statusInfo.icon;
  const priorityColor = getPriorityColor(message.priority || 'normal');
  const date = new Date(message.created_at);
  const isNew = message.status === 'new';

  return (
    <div className={`message-card ${isNew ? 'new' : ''}`} onClick={onClick}>
      <div className="card-header">
        <div className="message-icon-wrapper">
          <Mail size={20} />
        </div>
        <div className="message-main">
          <div className="message-header-row">
            <h3 className="message-subject">{message.subject}</h3>
            {message.priority && message.priority !== 'normal' && (
              <span 
                className="priority-badge"
                style={{ 
                  background: `rgba(${priorityColor}, 0.15)`,
                  color: priorityColor
                }}
              >
                {message.priority}
              </span>
            )}
          </div>
          <div className="message-meta">
            <span className="sender-name">{message.name}</span>
            <span className="sender-email">{message.email}</span>
          </div>
        </div>
        <div className="status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
          <StatusIcon size={14} />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="card-body">
        <p className="message-preview">
          {message.message?.substring(0, 150)}{message.message?.length > 150 ? '...' : ''}
        </p>
        
        <div className="message-footer">
          <div className="message-date">
            <Clock size={14} />
            <span>{date.toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          {message.replied_at && (
            <div className="replied-indicator">
              <CheckCircle size={14} />
              <span>Répondu le {new Date(message.replied_at).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .message-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .message-card.new {
          border-left: 4px solid #0066FF;
          background: rgba(0, 102, 255, 0.05);
        }

        .message-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .card-header {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .message-icon-wrapper {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-main {
          flex: 1;
          min-width: 0;
        }

        .message-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .message-subject {
          color: white;
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .sender-name {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .sender-email {
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
          height: fit-content;
          white-space: nowrap;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-preview {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .message-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 12px;
        }

        .message-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .replied-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
