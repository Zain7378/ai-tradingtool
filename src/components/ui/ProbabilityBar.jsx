import React from 'react';
import './ProbabilityBar.css';
import { ExperimentalBadge } from './Badge';

function probColor(p) {
  if (p >= 0.6) return 'high';
  if (p >= 0.4) return 'mid';
  return 'low';
}

export default function ProbabilityBar({ probability, validated = false, disclaimer, compact = false }) {
  const pct = Math.round(probability * 100);
  const tier = probColor(probability);

  return (
    <div className={`prob-bar-wrap${compact ? ' prob-bar-wrap--compact' : ''}`}>
      <div className="prob-bar-header">
        <div className="prob-bar-label-row">
          <span className="prob-bar-label">Win Probability</span>
          {!validated && <ExperimentalBadge />}
        </div>
        <span className={`prob-bar-value prob-bar-value--${tier}`}>{pct}%</span>
      </div>

      <div className="prob-bar-track">
        <div
          className={`prob-bar-fill prob-bar-fill--${tier}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {disclaimer && !compact && (
        <p className="prob-bar-disclaimer">{disclaimer}</p>
      )}
    </div>
  );
}
