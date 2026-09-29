import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorTheme = 'emerald', badgeText }) => {
  return (
    <div className={`stat-card theme-${colorTheme}`}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrapper">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-body">
        <div className="stat-value-group">
          <span className="stat-value">{value}</span>
          {badgeText && <span className="stat-badge">{badgeText}</span>}
        </div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>

      <style>{`
        .stat-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border: var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }
        .stat-card.theme-emerald::before { background: var(--primary); }
        .stat-card.theme-amber::before { background: var(--accent-amber); }
        .stat-card.theme-blue::before { background: var(--accent-blue); }
        .stat-card.theme-purple::before { background: var(--accent-purple); }
        .stat-card.theme-teal::before { background: var(--accent-teal); }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }
        .stat-icon-wrapper {
          padding: 0.4rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .theme-emerald .stat-icon-wrapper { background: rgba(16, 185, 129, 0.15); color: var(--primary); }
        .theme-amber .stat-icon-wrapper { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); }
        .theme-blue .stat-icon-wrapper { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); }
        .theme-purple .stat-icon-wrapper { background: rgba(139, 92, 246, 0.15); color: var(--accent-purple); }
        .theme-teal .stat-icon-wrapper { background: rgba(20, 184, 166, 0.15); color: var(--accent-teal); }

        .stat-value-group {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }
        .stat-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }
        .stat-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
