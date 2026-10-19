import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/ui/StatCard';
import { DirectionBadge, StateBadge, TrendBadge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import Disclaimer from '../components/ui/Disclaimer';
import { useApp } from '../context/AppContext';
import { mockSetups } from '../data/mockSetups';
import { mockStructure } from '../data/mockStructure';
import { mockBacktest } from '../data/mockBacktest';
import { instruments } from '../data/mockCandles';
import {
  Activity, TrendingUp, Target, Clock, ArrowRight, CheckCircle, XCircle,
  CandlestickChart, ListChecks, Layers, FlaskConical, DollarSign
} from 'lucide-react';
import './Overview.css';

const TIMEFRAME_ORDER = ['1d', '4h', '1h', '15m'];

export default function Overview() {
  const navigate = useNavigate();
  const { state } = useApp();

  const currentInst = instruments.find(i => i.symbol === state.symbol) || instruments[0];
  const activeSetups = mockSetups.filter(s => ['detected', 'awaiting', 'confirmed'].includes(s.state));
  const recentResults = mockBacktest.setups.slice(0, 5);
  const wins = mockBacktest.summary.wins;
  const losses = mockBacktest.summary.losses;

  return (
    <AppLayout title="Overview / Dashboard">
      <div className="overview fade-in">

        {/* ── Quick-Jump Actions Banner ─────────────────── */}
        <div className="overview-quickjump">
          <button className="quickjump-btn quickjump-btn--primary" onClick={() => navigate('/chart')}>
            <CandlestickChart size={16} />
            <span>Interactive Chart</span>
            <ArrowRight size={14} className="quickjump-arrow" />
          </button>
          <button className="quickjump-btn" onClick={() => navigate('/setups')}>
            <ListChecks size={16} />
            <span>Active Setups ({activeSetups.length})</span>
            <ArrowRight size={14} className="quickjump-arrow" />
          </button>
          <button className="quickjump-btn" onClick={() => navigate('/mtf')}>
            <Layers size={16} />
            <span>Multi-Timeframe</span>
            <ArrowRight size={14} className="quickjump-arrow" />
          </button>
          <button className="quickjump-btn" onClick={() => navigate('/backtest')}>
            <FlaskConical size={16} />
            <span>History & Backtest</span>
            <ArrowRight size={14} className="quickjump-arrow" />
          </button>
        </div>

        {/* ── KPI Row ─────────────────────────────────── */}
        <div className="overview-kpi-grid">
          <StatCard
            label={`${currentInst.symbol} Price`}
            value={`$${currentInst.currentPrice.toLocaleString()}`}
            sub={`${currentInst.label} · 24h change`}
            icon={DollarSign}
            trend={currentInst.change24h}
            accent
          />
          <StatCard
            label="Active Setups"
            value={activeSetups.length}
            sub="Detected + Awaiting + Confirmed"
            icon={Activity}
          />
          <StatCard
            label="Historical Win Rate"
            value={`${Math.round(mockBacktest.summary.winRate * 100)}%`}
            sub={`${wins}W / ${losses}L (${mockBacktest.summary.totalSetups} total)`}
            icon={Target}
            trend={5.7}
          />
          <StatCard
            label="Avg Risk-Reward (R)"
            value={`${mockBacktest.summary.avgR}R`}
            sub={`Profit factor: ${mockBacktest.summary.profitFactor}`}
            icon={TrendingUp}
          />
        </div>

        <div className="overview-two-col">

          {/* ── Trend Alignment ─────────────────────── */}
          <section className="overview-card">
            <div className="overview-card-header">
              <h2 className="overview-card-title">
                Trend Alignment — {state.symbol}
              </h2>
              <button className="overview-card-link" onClick={() => navigate('/mtf')}>
                MTF View <ArrowRight size={13} />
              </button>
            </div>
            <div className="trend-table">
              {TIMEFRAME_ORDER.map(tf => (
                <div key={tf} className="trend-row">
                  <span className="trend-tf font-mono">
                    <Tooltip term={tf === '1d' || tf === '4h' ? 'HTF' : tf === '1h' ? 'MTF' : 'LTF'}>
                      {tf}
                    </Tooltip>
                  </span>
                  <TrendBadge trend={mockStructure.trend[tf] ?? 'neutral'} />
                </div>
              ))}
            </div>
            <div className="trend-summary">
              <span className="trend-summary-label">3 of 4 timeframes bullish</span>
              <span className="trend-summary-note text-muted">
                Higher-timeframe bias favours long setups. Lower timeframes show pullback entries.
              </span>
            </div>
          </section>

          {/* ── Active Setups ────────────────────────── */}
          <section className="overview-card">
            <div className="overview-card-header">
              <h2 className="overview-card-title">Active Setups (Top {Math.min(4, activeSetups.length)})</h2>
              <button className="overview-card-link" onClick={() => navigate('/setups')}>
                View all ({mockSetups.length}) <ArrowRight size={13} />
              </button>
            </div>
            <div className="setups-mini-table">
              {activeSetups.slice(0, 4).map(s => (
                <div key={s.id} className="setups-mini-row" onClick={() => navigate(`/setups/${s.id}`)}>
                  <div className="setups-mini-info">
                    <span className="font-mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{s.symbol}</span>
                    <DirectionBadge direction={s.direction} />
                    <StateBadge state={s.state} />
                  </div>
                  <div className="setups-mini-prob">
                    <span className={`prob-chip prob-chip--${s.probability >= 0.6 ? 'high' : s.probability >= 0.4 ? 'mid' : 'low'}`}>
                      {Math.round(s.probability * 100)}%
                    </span>
                    <span className="text-muted font-mono" style={{ fontSize: 'var(--text-xs)' }}>{s.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recent Results ───────────────────────── */}
          <section className="overview-card">
            <div className="overview-card-header">
              <h2 className="overview-card-title">Recent Backtest Results</h2>
              <button className="overview-card-link" onClick={() => navigate('/backtest')}>
                Full Backtest <ArrowRight size={13} />
              </button>
            </div>
            <div className="recent-results">
              {recentResults.map(r => (
                <div key={r.id} className="recent-result-row">
                  <span className={`result-outcome-icon ${r.outcome === 'target' ? 'text-bull' : r.outcome === 'stop' ? 'text-bear' : 'text-muted'}`}>
                    {r.outcome === 'target' ? <CheckCircle size={14} /> : r.outcome === 'stop' ? <XCircle size={14} /> : <Clock size={14} />}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{r.detectedAt}</span>
                  <DirectionBadge direction={r.direction} />
                  <span className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)', marginLeft: 'auto' }}>
                    {Math.round(r.predictedProb * 100)}% → <strong className={r.outcome === 'target' ? 'text-bull' : 'text-bear'}>{r.outcome}</strong>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Analysis Timestamp & System Status ───── */}
          <section className="overview-card overview-card--status">
            <div className="overview-card-header">
              <h2 className="overview-card-title">System Status</h2>
              <button className="overview-card-link" onClick={() => navigate('/status')}>
                Model & Data <ArrowRight size={13} />
              </button>
            </div>
            <div className="status-list">
              <div className="status-item">
                <span className="pulse-dot warn" />
                <span className="status-item-label">Data Feed</span>
                <span className="status-item-value text-muted">
                  Delayed 15m — Dukascopy / Twelve Data
                </span>
              </div>
              <div className="status-item">
                <span className="pulse-dot" />
                <span className="status-item-label">ML Model</span>
                <span className="status-item-value text-muted">
                  v1.2 (LightGBM) — ⚗ Experimental
                </span>
              </div>
              <div className="status-item">
                <span className="pulse-dot" />
                <span className="status-item-label">Last Analysis</span>
                <span className="status-item-value text-muted font-mono">
                  2026-10-19 08:00 UTC (15m delay)
                </span>
              </div>
            </div>
          </section>

        </div>

        <Disclaimer />
      </div>
    </AppLayout>
  );
}
