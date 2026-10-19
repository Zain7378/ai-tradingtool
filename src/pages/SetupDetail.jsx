import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import CandlestickChart from '../components/chart/CandlestickChart';
import ProbabilityBar from '../components/ui/ProbabilityBar';
import { DirectionBadge, StateBadge, ExperimentalBadge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import Disclaimer from '../components/ui/Disclaimer';
import { mockSetups } from '../data/mockSetups';
import { mockCandles } from '../data/mockCandles';
import { mockZones } from '../data/mockZones';
import { mockStructure } from '../data/mockStructure';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import './SetupDetail.css';

export default function SetupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setup = mockSetups.find(s => s.id === id);

  if (!setup) {
    return (
      <AppLayout title="Setup Not Found">
        <div style={{ padding: 'var(--sp-8)', color: 'var(--text-muted)' }}>
          Setup <code>{id}</code> not found.
          <button onClick={() => navigate('/setups')} style={{ marginLeft: 'var(--sp-4)', color: 'var(--accent)' }}>
            ← Back to setups
          </button>
        </div>
      </AppLayout>
    );
  }

  const precision = setup.symbol === 'EURUSD' ? 5 : 2;
  const fmt = v => v.toFixed(precision);
  const candles = mockCandles[setup.symbol]?.[setup.timeframe] ?? [];

  // Slice to ~50 candles centered around the setup anchor for mini chart
  const anchorIdx = candles.findIndex(c => c.time >= setup.chartAnchorTime);
  const start = anchorIdx >= 0 ? Math.max(0, anchorIdx - 25) : Math.max(0, candles.length - 50);
  const miniCandles = candles.slice(start, start + 50);

  const positiveFactors = setup.factors.filter(f => f.impact === 'positive');
  const negativeFactors = setup.factors.filter(f => f.impact === 'negative');

  return (
    <AppLayout title={`Setup — ${setup.symbol} ${setup.timeframe}`}>
      <div className="detail-page fade-in">

        {/* ── Back breadcrumb ─────────────────────── */}
        <div className="detail-breadcrumb">
          <button className="back-btn" onClick={() => navigate('/setups')}>
            <ArrowLeft size={14} /> Back to Setups
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{setup.symbol} · {setup.strategy} · {setup.detectedAtLabel}</span>
        </div>

        <div className="detail-layout">

          {/* ── Left: chart + factors ─────────────── */}
          <div className="detail-left">

            {/* Header */}
            <div className="detail-header">
              <div className="detail-header-left">
                <DirectionBadge direction={setup.direction} />
                <h1 className="detail-title">{setup.symbol}</h1>
                <span className="detail-meta font-mono">{setup.timeframe}</span>
                <StateBadge state={setup.state} />
              </div>
              <div className="detail-header-right">
                <span className="detail-detected text-muted">Detected {setup.detectedAtLabel}</span>
                <button className="link-btn" onClick={() => navigate(`/chart?setup=${setup.id}`)}>
                  <ExternalLink size={13} /> View on chart
                </button>
              </div>
            </div>

            {/* Mini chart */}
            <div className="detail-chart">
              <CandlestickChart
                candles={miniCandles}
                zones={mockZones.filter(z => setup.zones.includes(z.id))}
                structure={mockStructure}
                setups={[setup]}
                overlays={{ fvg: true, orderBlocks: true, supplyDemand: true, structure: true, setups: true }}
                height={320}
              />
            </div>

            {/* Factors */}
            <div className="detail-factors-section">
              <h3 className="detail-section-title">
                Supporting & Conflicting Factors
                <span className="detail-section-sub">(based on model coefficients)</span>
              </h3>
              <div className="detail-factors-grid">
                <div className="detail-factors-col">
                  <h4 className="factors-col-title factors-col-title--pos">
                    <TrendingUp size={14} /> Supporting ({positiveFactors.length})
                  </h4>
                  {positiveFactors.map((f, i) => (
                    <div key={i} className="factor-row-detail factor-row-detail--pos">
                      <span className="factor-plus">+</span>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
                <div className="detail-factors-col">
                  <h4 className="factors-col-title factors-col-title--neg">
                    <TrendingDown size={14} /> Conflicting ({negativeFactors.length})
                  </h4>
                  {negativeFactors.map((f, i) => (
                    <div key={i} className="factor-row-detail factor-row-detail--neg">
                      <span className="factor-minus">−</span>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: probability + levels ─────────── */}
          <div className="detail-right">

            {/* Probability card */}
            <div className="detail-card">
              <h3 className="detail-section-title">Win Probability</h3>
              <ProbabilityBar
                probability={setup.probability}
                validated={setup.validated}
                disclaimer={setup.probabilityDisclaimer}
              />
            </div>

            {/* Levels card */}
            <div className="detail-card">
              <h3 className="detail-section-title">Trade Levels</h3>
              <div className="detail-levels">
                <div className="detail-level-row">
                  <span className="detail-level-label">Entry</span>
                  <span className="detail-level-val font-mono">{fmt(setup.entry)}</span>
                </div>
                <div className="detail-level-row">
                  <span className="detail-level-label">Target</span>
                  <span className="detail-level-val font-mono text-bull">{fmt(setup.target)}</span>
                  <span className="detail-level-badge badge-bull">+{setup.riskReward}R</span>
                </div>
                <div className="detail-level-row">
                  <span className="detail-level-label">Stop</span>
                  <span className="detail-level-val font-mono text-bear">{fmt(setup.stop)}</span>
                  <span className="detail-level-badge badge-bear">−1R</span>
                </div>
                <div className="detail-level-row">
                  <span className="detail-level-label"><Tooltip term="Risk-Reward">R:R</Tooltip></span>
                  <span className="detail-level-val font-mono">{setup.riskReward}:1</span>
                </div>
              </div>
            </div>

            {/* Timeframes card */}
            <div className="detail-card">
              <h3 className="detail-section-title">Timeframes Used</h3>
              <div className="detail-tf-list">
                {setup.timeframesUsed.map((tf, i) => (
                  <div key={tf} className="detail-tf-row">
                    <span className="detail-tf-role text-muted">
                      {i === 0 ? <Tooltip term="HTF">HTF</Tooltip> : i === 1 ? <Tooltip term="MTF">MTF</Tooltip> : <Tooltip term="LTF">LTF</Tooltip>}
                    </span>
                    <span className="detail-tf-val font-mono">{tf}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy card */}
            <div className="detail-card">
              <h3 className="detail-section-title">Strategy</h3>
              <div className="detail-strategy-info">
                <span className="detail-strategy-name">{setup.strategy}</span>
                <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                  Model: {setup.modelVersion}
                  {!setup.validated && <> · <ExperimentalBadge /></>}
                </span>
              </div>
            </div>

            <Disclaimer />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
