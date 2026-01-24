// frontend/components/admin/StatsCard.js
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  gradient = 'blue',
  onClick 
}) {
  const gradients = {
    blue: 'linear-gradient(135deg, #0066FF, #00D9FF)',
    orange: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
    purple: 'linear-gradient(135deg, #764ba2, #667eea)',
    green: 'linear-gradient(135deg, #10b981, #34d399)',
  };

  const gradientColors = gradients[gradient] || gradients.blue;

  return (
    <div className={`stats-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <div className="card-header">
        <div className="icon-wrapper" style={{ background: gradientColors }}>
          {Icon && <Icon size={24} color="white" />}
        </div>
        {trend !== undefined && (
          <div className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-value">{value}</h3>
        <p className="card-title">{title}</p>
        {trendValue !== undefined && (
          <p className="card-trend">
            {trend >= 0 ? '+' : ''}{trendValue} vs mois dernier
          </p>
        )}
      </div>

      <style jsx>{`
        .stats-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .stats-card.clickable {
          cursor: pointer;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        .trend.positive {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .trend.negative {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-value {
          color: white;
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          line-height: 1;
        }

        .card-title {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }

        .card-trend {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          margin: 0;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
