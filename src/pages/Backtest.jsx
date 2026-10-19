import React, { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Disclaimer from '../components/ui/Disclaimer';
import { DirectionBadge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import { mockBacktest } from '../data/mockBacktest';
import { Play, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import './Backtest.css';

function SimpleBarChart({ data }) {
  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const fillClass = d.winRate >= 0.6 ? 'bar-fill--high' : d.winRate >= 0.4 ? 'bar-fill--mid' : 'bar-fill--low';
        return (
          <div key={i} className="bar-group">
            <div className="bar-track">
              <div
                className={`bar-fill ${fillClass}`}
                style={{ height: `${(d.winRate / 1) * 100}%` }}
              />
            </div>
            <div className="bar-label-bottom">
              <span className="bar-pct font-mono">{Math.round(d.winRate * 100)}%</span>
              <span className="bar-range">{d.range}</span>
              <span className="bar-n text-muted">{d.setups}n</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SimpleLineChart({ data }) {
  const values = data.map(d => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;
  const W = 100, H = 100;

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.value - minV) / range) * H;
    return `${x},${y}`;
  });

  return (
    <div className="equity-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="equity-svg">
        <defs>
          <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--bull)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--bull)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          points={[`0,${H}`, ...pts, `${W},${H}`].join(' ')}
          fill="url(#equityGrad)"
          stroke="none"
        />
        <polyline
          points={pts.join(' ')}
          fill="none"
          stroke="var(--bull)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="equity-axis">
        <span className="equity-max font-mono">+{maxV.toFixed(1)}R</span>
        <span className="equity-zero font-mono">{minV.toFixed(1)}R</span>
      </div>
    </div>
  );
}

export default function Backtest() {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [form, setForm] = useState({
    symbol: 'XAUUSD', strategy: 'FVG Retest', from: '2025-01-01', to: '2026-10-01',
  });

  const runBacktest = () => {
    setShowResults(false);
    setLoading(true);
    setTimeout(() => { setLoading(false); setShowResults(true); }, 1400);
  };

  const bt = mockBacktest;

  const filteredSetups = useMemo(() => {
    let rows = [...bt.setups];
    if (filterDirection !== 'all') {
      rows = rows.filter(s => s.direction === filterDirection);
    }
    if (filterOutcome !== 'all') {
      rows = rows.filter(s => s.outcome === filterOutcome);
    }
    return rows;
  }, [bt.setups, filterDirection, filterOutcome]);

  return (
    <AppLayout title="History & Backtest">
      <div className="backtest-page fade-in">

        {/* ── Form ────────────────────────────────── */}
        <section className="bt-form-card">
          <h2 className="bt-section-title">Configure Backtest Simulation</h2>
          <div className="bt-form-grid">
            <div className="bt-form-field">
              <label className="bt-form-label">Instrument</label>
              <select value={form.symbol} onChange={e => setForm(f => ({...f, symbol: e.target.value}))}>
                <option value="XAUUSD">XAUUSD — Gold / USD</option>
                <option value="EURUSD">EURUSD — EUR / USD</option>
              </select>
            </div>
            <div className="bt-form-field">
              <label className="bt-form-label">Strategy</label>
              <select value={form.strategy} onChange={e => setForm(f => ({...f, strategy: e.target.value}))}>
                <option value="FVG Retest">FVG Retest (v1.3)</option>
                <option value="Order Block Entry">Order Block Entry (v1.0)</option>
              </select>
            </div>
            <div className="bt-form-field">
              <label className="bt-form-label">From Date</label>
              <input type="date" value={form.from} onChange={e => setForm(f => ({...f, from: e.target.value}))} />
            </div>
            <div className="bt-form-field">
              <label className="bt-form-label">To Date</label>
              <input type="date" value={form.to} onChange={e => setForm(f => ({...f, to: e.target.value}))} />
            </div>
          </div>
          <button className="bt-run-btn" onClick={runBacktest} disabled={loading}>
            {loading
              ? <><span className="bt-spinner" /> Simulating historical candles…</>
              : <><Play size={15} /> Run Backtest</>
            }
          </button>
        </section>

        {/* ── Results ─────────────────────────────── */}
        {showResults && (
          <>
            <Disclaimer text="Backtest results are based on simulated candle-by-candle historical re-execution. Spread costs (0.30) are accounted for. Past performance is an estimate and does not guarantee future results." />

            {/* Summary KPIs */}
            <div className="bt-kpi-grid">
              {[
                { label: 'Total Setups',    value: bt.summary.totalSetups },
                { label: 'Win Rate',        value: `${Math.round(bt.summary.winRate * 100)}%` },
                { label: 'Avg Risk-Reward', value: `${bt.summary.avgR}R` },
                { label: 'Total Cumulative R', value: `+${bt.summary.totalR}R` },
                { label: 'Profit Factor',   value: bt.summary.profitFactor },
                { label: 'Max Drawdown',    value: `${bt.summary.maxDrawdown}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bt-kpi-card">
                  <span className="bt-kpi-label">{label}</span>
                  <span className="bt-kpi-value font-mono">{value}</span>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="bt-charts-row">
              {/* By probability */}
              <div className="bt-chart-card">
                <h3 className="bt-section-title">
                  Outcome Rate by Predicted Probability
                </h3>
                <p className="bt-chart-sub text-muted">
                  Tests model calibration: higher predicted probability brackets should demonstrate systematically higher win rates.
                </p>
                <SimpleBarChart data={bt.byProbabilityRange} />
              </div>

              {/* Equity curve */}
              <div className="bt-chart-card">
                <h3 className="bt-section-title">
                  Equity Curve <span className="bt-chart-sub">(Cumulative R)</span>
                </h3>
                <p className="bt-chart-sub text-muted">
                  Historical progression in units of risk (R) without compounding across {form.from} to {form.to}.
                </p>
                <SimpleLineChart data={bt.equityCurve} />
              </div>
            </div>

            {/* By direction */}
            <div className="bt-breakdown-row">
              {bt.byDirection.map(d => (
                <div key={d.direction} className="bt-breakdown-card">
                  <DirectionBadge direction={d.direction.toLowerCase()} />
                  <span className="bt-breakdown-val font-mono">{Math.round(d.winRate * 100)}% Win Rate</span>
                  <span className="bt-breakdown-n text-muted">{d.setups} setups</span>
                </div>
              ))}
            </div>

            {/* Per-setup table */}
            <section className="bt-table-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <h3 className="bt-section-title" style={{ margin: 0 }}>Per-Setup Historical Outcomes</h3>
                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    Predicted probability at candle close vs actual outcome
                  </span>
                </div>

                {/* Table Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                  <select
                    value={filterDirection}
                    onChange={e => setFilterDirection(e.target.value)}
                    style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
                  >
                    <option value="all">All Directions</option>
                    <option value="bullish">Bullish Only</option>
                    <option value="bearish">Bearish Only</option>
                  </select>

                  <select
                    value={filterOutcome}
                    onChange={e => setFilterOutcome(e.target.value)}
                    style={{ fontSize: 'var(--text-xs)', padding: '4px 8px' }}
                  >
                    <option value="all">All Outcomes</option>
                    <option value="target">Target (Win)</option>
                    <option value="stop">Stop (Loss)</option>
                    <option value="expired">Expired</option>
                  </select>

                  <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    Showing {filteredSetups.length} setups
                  </span>
                </div>
              </div>

              <table className="bt-table">
                <thead>
                  <tr>
                    <th>Detected At</th>
                    <th>Direction</th>
                    <th><Tooltip term="Probability">Predicted Prob.</Tooltip></th>
                    <th>Outcome</th>
                    <th>Bars to Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSetups.map(r => (
                    <tr key={r.id} className="bt-row">
                      <td className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>{r.detectedAt}</td>
                      <td><DirectionBadge direction={r.direction} /></td>
                      <td>
                        <span className={`prob-chip prob-chip--${r.predictedProb >= 0.6 ? 'high' : r.predictedProb >= 0.4 ? 'mid' : 'low'}`}>
                          {Math.round(r.predictedProb * 100)}%
                        </span>
                      </td>
                      <td>
                        <span className={`outcome-badge outcome--${r.outcome}`}>
                          {r.outcome === 'target'
                            ? <><CheckCircle size={12} /> Target Hit (+2R)</>
                            : r.outcome === 'stop'
                            ? <><XCircle size={12} /> Stop Hit (-1R)</>
                            : <><Clock size={12} /> Expired (48 bars)</>
                          }
                        </span>
                      </td>
                      <td className="font-mono text-muted">{r.barsToResult} bars</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSetups.length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-muted)' }}>
                  No setups match the selected direction/outcome filters.
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
