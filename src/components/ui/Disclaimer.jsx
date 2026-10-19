import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './Disclaimer.css';

export default function Disclaimer({ text }) {
  return (
    <div className="disclaimer" role="note">
      <AlertTriangle size={14} className="disclaimer-icon" />
      <p className="disclaimer-text">
        {text ?? 'Results shown are historical estimates based on past setups. They are not a guarantee of future profit. Probabilities reflect how often similar setups reached their target in backtested data, not in live trading.'}
      </p>
    </div>
  );
}
