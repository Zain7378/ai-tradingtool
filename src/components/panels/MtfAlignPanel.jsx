import React from 'react';
import { TrendBadge } from '../ui/Badge';
import Tooltip from '../ui/Tooltip';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import './MtfAlignPanel.css';

function AlignmentIcon({ aligned }) {
  if (aligned === true)  return <CheckCircle size={16} style={{ color: 'var(--bull)' }} />;
  if (aligned === false) return <XCircle     size={16} style={{ color: 'var(--bear)' }} />;
  return <MinusCircle size={16} style={{ color: 'var(--text-muted)' }} />;
}

export default function MtfAlignPanel({ symbol, combo, trends }) {
  const tfs = [combo.htf, combo.mtf, combo.ltf];
  const roles = [
    { label: 'Higher Time Frame', key: 'HTF', tip: 'HTF' },
    { label: 'Middle Time Frame', key: 'MTF', tip: 'MTF' },
    { label: 'Lower Time Frame',  key: 'LTF', tip: 'LTF' },
  ];

  const allBull = trends.every(t => t === 'bullish');
  const allBear = trends.every(t => t === 'bearish');
  const alignedCount = trends.filter(t => t === trends[0]).length;

  return (
    <div className="mtf-alignment-card">
      <div className="mtf-align-header">
        <h2 className="mtf-align-title">Alignment Summary — {symbol}</h2>
        <div className={`mtf-align-score mtf-align-score--${allBull ? 'bull' : allBear ? 'bear' : 'mixed'}`}>
          {alignedCount} / {tfs.length} aligned
        </div>
      </div>
      <div className="mtf-align-rows">
        {tfs.map((tf, i) => (
          <div key={tf} className="mtf-align-row">
            <AlignmentIcon aligned={trends[i] === trends[0]} />
            <span className="mtf-align-role text-muted">
              <Tooltip term={roles[i].tip}>{roles[i].key}</Tooltip>
            </span>
            <span className="mtf-align-tf font-mono">{tf}</span>
            <TrendBadge trend={trends[i] ?? 'neutral'} />
            <span className="mtf-align-note text-muted">
              {trends[i] === 'bullish' ? 'Favours long setups' : 'Favours short setups'}
            </span>
          </div>
        ))}
      </div>
      <p className="mtf-align-conclusion">
        {allBull
          ? '✓ All three timeframes bullish — strongest long bias. Look for bullish setups on the lower timeframe.'
          : allBear
          ? '✓ All three timeframes bearish — strongest short bias. Look for bearish setups on the lower timeframe.'
          : `⚠ Mixed alignment (${alignedCount}/${tfs.length}). Proceed with caution; prefer setups that align with the higher timeframe.`
        }
      </p>
    </div>
  );
}

