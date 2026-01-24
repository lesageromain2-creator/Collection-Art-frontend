// frontend/components/admin/ReservationCard.js
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReservationCard({ reservation, onClick }) {
  const getStatusInfo = (status) => {
    const statuses = {
      pending: { label: 'En attente', icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
      confirmed: { label: 'Confirmé', icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
      cancelled: { label: 'Annulé', icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
      completed: { label: 'Terminé', icon: CheckCircle, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
    };
    return statuses[status] || statuses.pending;
  };

  const statusInfo = getStatusInfo(reservation.status);
  const StatusIcon = statusInfo.icon;
  const date = new Date(reservation.reservation_date);
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });

  return (
    <div className="reservation-card" onClick={onClick}>
      <div className="card-header">
        <div className="date-badge">
          <div className="date-day">{day}</div>
          <div className="date-month">{month}</div>
        </div>
        <div className="status-badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
          <StatusIcon size={14} />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="time-section">
          <Clock size={18} />
          <span className="time-text">{reservation.reservation_time?.substring(0, 5)}</span>
        </div>

        <div className="client-section">
          <div className="client-info">
            <User size={16} />
            <div>
              <div className="client-name">
                {reservation.client_name || `${reservation.firstname} ${reservation.lastname}`}
              </div>
              {reservation.email && (
                <div className="client-contact">
                  <Mail size={12} />
                  <span>{reservation.email}</span>
                </div>
              )}
              {reservation.phone && (
                <div className="client-contact">
                  <Phone size={12} />
                  <span>{reservation.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {reservation.meeting_type && (
          <div className="meeting-type">
            <span className="type-label">Type:</span>
            <span className="type-value">
              {reservation.meeting_type === 'visio' ? 'Visioconférence' : 'Présentiel'}
            </span>
          </div>
        )}

        {reservation.message && (
          <div className="message-preview">
            <p>{reservation.message.substring(0, 100)}{reservation.message.length > 100 ? '...' : ''}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .reservation-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reservation-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0066FF, #00D9FF);
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
        }

        .date-day {
          font-size: 24px;
          font-weight: 900;
          color: white;
          line-height: 1;
        }

        .date-month {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
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
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .time-section {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #00D9FF;
          font-weight: 700;
          font-size: 16px;
        }

        .client-section {
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .client-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .client-name {
          color: white;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .client-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          margin-top: 4px;
        }

        .meeting-type {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
        }

        .type-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .type-value {
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .message-preview {
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border-left: 3px solid #0066FF;
        }

        .message-preview p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
