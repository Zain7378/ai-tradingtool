import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockSetups } from '../../data/mockSetups';
import ProbabilityBar from '../ui/ProbabilityBar';
import { DirectionBadge, StateBadge, ExperimentalBadge } from '../ui/Badge';
import Tooltip from '../ui/Tooltip';
import './SetupDetailPanel.css';

function FactorRow({ factor }) {
  return (
    <div className={`factor-row factor-row--${factor.impact}`}>
      <span className={`factor-icon`}>{factor.impact === 'positive' ? '+' : '−'}</span>
      <span className="factor-label">{factor.label}</span>
    </div>
  );
}

export default function SetupDetailPanel() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const setup = mockSetups.find(s => s.id === state.selectedSetupId);

  if (!setup) return null;

  const pricePrecision = setup.symbol === 'EURUSD' ? 5 : 2;
  const fmt = v => v.toFixed(pricePrecision);

  return (
    <aside className="setup-panel fade-in">
      {/* Header */}
      <div className="setup-panel-header">
        <div className="setup-panel-title-row">
          <DirectionBadge direction={setup.direction} />
          <span className="setup-panel-strategy">{setup.strategy}</span>
          <StateBadge state={setup.state} />
        </div>
        <button
          className="setup-panel-close"
          onClick={() => dispatch({ type: 'DESELECT_SETUP' })}
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="setup-panel-body">
        {/* Symbol + time */}
        <div className="setup-panel-meta">
          <span className="setup-meta-symbol">{setup.symbol} · {setup.timeframe}</span>
          <span className="setup-meta-time">{setup.detectedAtLabel}</span>
        </div>

        {/* Entry / Stop / Target */}
        <div className="setup-levels">
          <div className="level-row level-row--entry">
            <span className="level-label">Entry</span>
            <span className="level-value font-mono">{fmt(setup.entry)}</span>
          </div>
          <div className="level-row level-row--target">
            <span className="level-label">Target</span>
            <span className="level-value font-mono text-bull">{fmt(setup.target)}</span>
            <span className="level-rr">+{setup.riskReward}R</span>
          </div>
          <div className="level-row level-row--stop">
            <span className="level-label">Stop</span>
            <span className="level-value font-mono text-bear">{fmt(setup.stop)}</span>
            <span className="level-rr">−1R</span>
          </div>
        </div>

        {/* Probability */}
        <div className="setup-panel-section">
          <ProbabilityBar
            probability={setup.probability}
            validated={setup.validated}
            disclaimer={setup.probabilityDisclaimer}
          />
        </div>

        {/* Factors */}
        <div className="setup-panel-section">
          <h4 className="setup-panel-section-title">
            <Tooltip term="Probability">Factors</Tooltip>
          </h4>
          <div className="factor-list">
            {setup.factors.map((f, i) => <FactorRow key={i} factor={f} />)}
          </div>
        </div>

        {/* Timeframes */}
        <div className="setup-panel-section">
          <h4 className="setup-panel-section-title">Timeframes Used</h4>
          <div className="tf-badges">
            {setup.timeframesUsed.map(tf => (
              <span key={tf} className="tf-badge">{tf}</span>
            ))}
          </div>
        </div>

        {/* Model version */}
        <div className="setup-panel-section setup-panel-model-row">
          <span className="setup-meta-label">Model</span>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {setup.modelVersion}
          </span>
          {!setup.validated && <ExperimentalBadge />}
        </div>

        {/* Actions */}
        <div className="setup-panel-actions">
          <button
            className="setup-panel-btn setup-panel-btn--primary"
            onClick={() => navigate(`/setups/${setup.id}`)}
          >
            Full Detail <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
