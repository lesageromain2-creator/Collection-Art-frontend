// frontend/components/ProjectTimeline.js
import { Calendar, CheckCircle, Circle, Clock } from 'lucide-react';

const TIMELINE_STAGES = [
  { 
    key: 'initial_meeting', 
    title: 'RDV Initial & Devis', 
    description: 'Premier contact et établissement du devis',
    icon: '🤝'
  },
  { 
    key: 'contract_signed', 
    title: 'Signature du Contrat', 
    description: 'Validation et signature du projet',
    icon: '📝'
  },
  { 
    key: 'design_phase', 
    title: 'Phase Design', 
    description: 'Création des maquettes et design',
    icon: '🎨'
  },
  { 
    key: 'design_validation', 
    title: 'Validation Design', 
    description: 'RDV de validation des maquettes',
    icon: '✅'
  },
  { 
    key: 'development', 
    title: 'Développement', 
    description: 'Réalisation technique du projet',
    icon: '💻'
  },
  { 
    key: 'mid_project_review', 
    title: 'RDV Mi-Projet', 
    description: 'Point d\'avancement et ajustements',
    icon: '🔄'
  },
  { 
    key: 'testing', 
    title: 'Tests & QA', 
    description: 'Tests et corrections',
    icon: '🧪'
  },
  { 
    key: 'final_review', 
    title: 'Revue Finale', 
    description: 'RDV de présentation finale',
    icon: '👀'
  },
  { 
    key: 'launch', 
    title: 'Mise en Ligne', 
    description: 'Déploiement en production',
    icon: '🚀'
  },
  { 
    key: 'delivery', 
    title: 'Livraison', 
    description: 'Formation et livraison finale',
    icon: '🎉'
  }
];

export default function ProjectTimeline({ 
  milestones = [], 
  startDate, 
  currentStatus = 'discovery',
  completedStages = []
}) {
  const getStageStatus = (stage) => {
    // Vérifier si l'étape est complétée via milestones
    const milestone = milestones.find(m => 
      m.title?.toLowerCase().includes(stage.title.toLowerCase()) ||
      m.milestone_type === stage.key
    );

    if (milestone?.is_completed || completedStages.includes(stage.key)) {
      return 'completed';
    }

    if (milestone && !milestone.is_completed) {
      return 'in_progress';
    }

    return 'pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>📅 Frise chronologique du projet</h2>
        {startDate && (
          <p className="start-date">
            Démarrage: {formatDate(startDate)}
          </p>
        )}
      </div>

      <div className="timeline">
        {TIMELINE_STAGES.map((stage, index) => {
          const status = getStageStatus(stage);
          const milestone = milestones.find(m => 
            m.title?.toLowerCase().includes(stage.title.toLowerCase()) ||
            m.milestone_type === stage.key
          );

          return (
            <div key={stage.key} className={`timeline-item ${status}`}>
              <div className="timeline-connector">
                {index < TIMELINE_STAGES.length - 1 && (
                  <div className={`connector-line ${status === 'completed' ? 'completed' : ''}`}></div>
                )}
              </div>

              <div className="timeline-marker">
                {status === 'completed' ? (
                  <CheckCircle size={28} strokeWidth={2.5} />
                ) : status === 'in_progress' ? (
                  <div className="pulse-marker">
                    <Circle size={28} strokeWidth={2.5} />
                  </div>
                ) : (
                  <Circle size={28} strokeWidth={1.5} />
                )}
              </div>

              <div className="timeline-content">
                <div className="stage-icon">{stage.icon}</div>
                <div className="stage-info">
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  {milestone?.target_date && (
                    <div className="stage-date">
                      <Calendar size={14} />
                      {formatDate(milestone.target_date)}
                    </div>
                  )}
                  {milestone?.completed_at && (
                    <div className="stage-completed">
                      <CheckCircle size={14} />
                      Complété le {formatDate(milestone.completed_at)}
                    </div>
                  )}
                </div>
                {status === 'completed' && (
                  <div className="status-badge completed">
                    <CheckCircle size={16} />
                    Terminé
                  </div>
                )}
                {status === 'in_progress' && (
                  <div className="status-badge in-progress">
                    <Clock size={16} />
                    En cours
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .timeline-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
        }

        .timeline-header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .timeline-header h2 {
          color: white;
          font-size: 1.8em;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .start-date {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 24px;
          padding: 24px 0;
        }

        .timeline-connector {
          position: absolute;
          left: 29px;
          top: 60px;
          width: 2px;
          height: calc(100% - 40px);
          z-index: 0;
        }

        .connector-line {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.5s ease;
        }

        .connector-line.completed {
          background: linear-gradient(180deg, #0066FF, #00D9FF);
        }

        .timeline-marker {
          position: relative;
          z-index: 2;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #0A0E27;
          transition: all 0.4s ease;
        }

        .timeline-item.pending .timeline-marker {
          color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .timeline-item.in_progress .timeline-marker {
          color: #FFD700;
          background: rgba(255, 215, 0, 0.15);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }

        .timeline-item.completed .timeline-marker {
          color: #10b981;
          background: rgba(16, 185, 129, 0.15);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
        }

        .pulse-marker {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .timeline-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.08);
          transition: all 0.4s ease;
        }

        .timeline-item.completed .timeline-content {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .timeline-item.in_progress .timeline-content {
          background: rgba(255, 215, 0, 0.08);
          border-color: rgba(255, 215, 0, 0.2);
          box-shadow: 0 4px 20px rgba(255, 215, 0, 0.15);
        }

        .timeline-content:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: translateX(4px);
        }

        .stage-icon {
          font-size: 2.5em;
          line-height: 1;
          flex-shrink: 0;
        }

        .stage-info {
          flex: 1;
        }

        .stage-info h3 {
          color: white;
          font-size: 1.2em;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .stage-info p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .stage-date,
        .stage-completed {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0, 102, 255, 0.15);
          color: #00D9FF;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-top: 8px;
        }

        .stage-completed {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-badge.completed {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 2px solid rgba(16, 185, 129, 0.4);
        }

        .status-badge.in-progress {
          background: rgba(255, 215, 0, 0.2);
          color: #FFD700;
          border: 2px solid rgba(255, 215, 0, 0.4);
        }

        @media (max-width: 768px) {
          .timeline-item {
            grid-template-columns: 50px 1fr;
            gap: 16px;
          }

          .timeline-connector {
            left: 24px;
          }

          .timeline-marker {
            width: 50px;
            height: 50px;
          }

          .timeline-content {
            flex-direction: column;
            gap: 16px;
          }

          .stage-icon {
            font-size: 2em;
          }
        }
      `}</style>
    </div>
  );
}
