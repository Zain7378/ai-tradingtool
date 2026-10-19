import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function SetupMarker({ setup, isSelected, onClick }) {
  const isBull = setup.direction === 'bullish';
  const pct = Math.round(setup.probability * 100);

  return (
    <button
      className={`setup-marker-badge setup-marker-badge--${setup.direction}${isSelected ? ' setup-marker-badge--selected' : ''}`}
      onClick={() => onClick && onClick(setup.id)}
      title={`${setup.symbol} ${setup.timeframe} ${setup.strategy} (${pct}%)`}
    >
      {isBull ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      <span>{pct}%</span>
    </button>
  );
}

