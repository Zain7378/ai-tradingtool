import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { ExperimentalBadge, Badge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import Disclaimer from '../components/ui/Disclaimer';
import { mockStatus } from '../data/mockStatus';
import { RefreshCw, Database, Brain, AlertTriangle, CheckCircle, Check } from 'lucide-react';
import './ModelStatus.css';

function CalibrationChart({ data }) {
  const W = 100, H = 60;
  // Diagonal (perfect calibration)
  const diagonal = `0,${H} ${W},0`;
  // Actual points
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - d.actual * H;
    return `${x},${y}`;
  });
  return (
    <div className="calib-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="calib-svg">
        {/* Perfect calibration diagonal */}
        <polyline
          points={diagonal}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
        {/* Model line */}
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - d.actual * H;
          return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--accent)" stroke="var(--bg-surface)" strokeWidth="1.5" />;
        })}
      </svg>
      <div className="calib-legend">
        <span className="calib-legend-item calib-legend-model">— LightGBM Model</span>
        <span className="calib-legend-item calib-legend-perfect">- - Perfect Calibration</span>
      </div>
      <div className="calib-axes">
        <span className="calib-axis-x text-muted">Predicted probability →</span>
        <span className="calib-axis-y text-muted">Actual win rate ↑</span>
      </div>
    </div>
  );
}

export default function ModelStatus() {
  const { dataProvider, activeModel, allModels, calibration } = mockStatus;
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(dataProvider.lastUpdate);
  const [refreshedMsg, setRefreshedMsg] = useState(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date().toISOString());
      setRefreshedMsg('Data feed successfully updated from providers.');
      setTimeout(() => setRefreshedMsg(null), 4000);
    }, 1200);
  };

  const metricRows = [
    { label: 'ROC-AUC',      value: activeModel.metrics.rocAuc,     good: v => v > 0.65, desc: 'Measures ability to rank high-win setups above low-win setups (0.5 = random, 1.0 = perfect)' },
    { label: 'Precision',    value: activeModel.metrics.precision,   good: v => v > 0.60, desc: 'When model predicts target hit, % of times target was actually hit' },
    { label: 'Recall',       value: activeModel.metrics.recall,      good: v => v > 0.55, desc: '% of total successful setups correctly identified' },
    { label: 'Brier Score',  value: activeModel.metrics.brierScore,  good: v => v < 0.25, lower: true, desc: 'Mean squared error between predicted probability and binary outcome (lower is better)' },
    { label: 'Baseline AUC', value: activeModel.metrics.baselineAuc, good: () => false, desc: 'Benchmark ROC-AUC of simple naive baseline strategy' },
  ];

  return (
    <AppLayout title="Model & Data Status">
      <div className="status-page fade-in">

        {refreshedMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bull-dim)', color: 'var(--bull)', border: '1px solid var(--bull-border)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
            <Check size={16} />
            <span>{refreshedMsg}</span>
          </div>
        )}

        {/* ── Data Provider ─────────────────────────── */}
        <section className="status-card">
          <div className="status-card-header">
            <div className="status-card-title-row">
              <Database size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="status-card-title">Data Provider Feed</h2>
            </div>
            <div className={`status-badge status-badge--${dataProvider.status}`}>
              {dataProvider.status === 'ok'
                ? <><span className="pulse-dot warn" />Delayed {dataProvider.delayMinutes}m</>
                : <><span className="pulse-dot error" />Error</>
              }
            </div>
          </div>

          <div className="status-info-grid">
            <div className="status-info-row">
              <span className="status-info-label">Source</span>
              <span className="status-info-value">{dataProvider.name}</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Last update</span>
              <span className="status-info-value font-mono">{new Date(lastUpdate).toLocaleString()} UTC</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Instruments</span>
              <span className="status-info-value">{dataProvider.instruments.join(', ')}</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Timeframes</span>
              <span className="status-info-value font-mono">{dataProvider.timeframes.join(', ')}</span>
            </div>
          </div>

          {dataProvider.warnings.length > 0 && (
            <div className="status-warnings">
              {dataProvider.warnings.map((w, i) => (
                <div key={i} className="status-warning-row">
                  <AlertTriangle size={13} style={{ color: 'var(--status-warn)', flexShrink: 0 }} />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'spin-icon' : ''} />
            {refreshing ? 'Refreshing data feed…' : 'Refresh data'}
          </button>
        </section>

        {/* ── Active Model ──────────────────────────── */}
        <section className="status-card">
          <div className="status-card-header">
            <div className="status-card-title-row">
              <Brain size={16} style={{ color: 'var(--accent)' }} />
              <h2 className="status-card-title">Active Scoring Model</h2>
              <span className="font-mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {activeModel.version}
              </span>
              {!activeModel.validated && <ExperimentalBadge />}
            </div>
          </div>

          {!activeModel.validated && (
            <div className="model-validation-note">
              <AlertTriangle size={14} />
              <span>{activeModel.validationNote}</span>
            </div>
          )}

          <div className="status-info-grid">
            <div className="status-info-row">
              <span className="status-info-label">Algorithm</span>
              <span className="status-info-value font-mono">{activeModel.algorithm}</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Training period</span>
              <span className="status-info-value font-mono">{activeModel.trainStart} → {activeModel.trainEnd}</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Test period</span>
              <span className="status-info-value font-mono">{activeModel.testStart} → {activeModel.testEnd}</span>
            </div>
            <div className="status-info-row">
              <span className="status-info-label">Feature count</span>
              <span className="status-info-value">{activeModel.featureCount} tabular features</span>
            </div>
          </div>

          {/* Metrics table */}
          <div className="metrics-section">
            <h3 className="metrics-title">Out-of-Sample Test Set Metrics</h3>
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Assessment</th>
                </tr>
              </thead>
              <tbody>
                {metricRows.map(m => {
                  const isGood = m.good(m.value);
                  return (
                    <tr key={m.label} className="metrics-row" title={m.desc}>
                      <td className="metrics-label">{m.label}</td>
                      <td className="font-mono">{m.value}</td>
                      <td>
                        {m.label === 'Baseline AUC'
                          ? <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Reference baseline</span>
                          : isGood
                          ? <span className="metric-good"><CheckCircle size={12} /> {m.lower ? 'Low error (passed)' : 'Above threshold (>0.65)'}</span>
                          : <span className="metric-warn"><AlertTriangle size={12} /> Below target</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Features list */}
          <div className="feature-list-section">
            <h3 className="metrics-title">Model Features ({activeModel.featureCount})</h3>
            <div className="feature-tags">
              {activeModel.features.map(f => (
                <span key={f} className="feature-tag font-mono">{f}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Calibration ───────────────────────────── */}
        <section className="status-card">
          <h2 className="status-card-title">Probability Calibration Check</h2>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
            Compares <Tooltip term="Probability">predicted probabilities</Tooltip> against actual historical win rates in each probability decile. Closer alignment with the dashed diagonal indicates superior reliability for trader decision-making.
          </p>
          <CalibrationChart data={calibration} />
        </section>

        {/* ── All Models ────────────────────────────── */}
        <section className="status-card">
          <h2 className="status-card-title">Model Iteration History</h2>
          <table className="metrics-table">
            <thead>
              <tr><th>Version</th><th>Algorithm</th><th>Trained to</th><th>ROC-AUC</th><th>Status</th></tr>
            </thead>
            <tbody>
              {allModels.map(m => (
                <tr key={m.id} className="metrics-row">
                  <td className="font-mono">{m.version}</td>
                  <td>{m.algorithm}</td>
                  <td className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>{m.trainEnd}</td>
                  <td className="font-mono">{m.rocAuc}</td>
                  <td>
                    {m.isActive
                      ? <Badge variant="ok">Active Model</Badge>
                      : <Badge variant="default">Archived</Badge>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Disclaimer />
      </div>
    </AppLayout>
  );
}
