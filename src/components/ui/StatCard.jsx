import React from 'react';
import './StatCard.css';

export default function StatCard({ label, value, sub, icon: Icon, trend, accent = false }) {
  return (
    <div className={`stat-card${accent ? ' stat-card--accent' : ''}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {Icon && <span className="stat-card-icon"><Icon size={16} /></span>}
      </div>
      <div className="stat-card-value-row">
        <span className="stat-card-value">{value}</span>
        {trend && (
          <span className={`stat-card-trend stat-card-trend--${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  );
}
