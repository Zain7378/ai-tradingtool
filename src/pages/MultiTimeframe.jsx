import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import CandlestickChart from '../components/chart/CandlestickChart';
import { TrendBadge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import MtfAlignPanel from '../components/panels/MtfAlignPanel';
import Disclaimer from '../components/ui/Disclaimer';
import { useApp } from '../context/AppContext';
import { mockCandles } from '../data/mockCandles';
import { mockStructure } from '../data/mockStructure';
import { mockZones } from '../data/mockZones';
import './MultiTimeframe.css';

const MTF_COMBOS = [
  { htf: '1d', mtf: '4h', ltf: '1h',  label: 'Daily / 4H / 1H'  },
  { htf: '4h', mtf: '1h', ltf: '15m', label: '4H / 1H / 15M'    },
];

export default function MultiTimeframe() {
  const { state } = useApp();
  const [combo, setCombo] = useState(MTF_COMBOS[1]);

  const symbol = state.symbol || 'XAUUSD';
  const tfs = [combo.htf, combo.mtf, combo.ltf];
  const roles = [
    { label: 'Higher Time Frame', key: 'HTF', tip: 'HTF' },
    { label: 'Middle Time Frame', key: 'MTF', tip: 'MTF' },
    { label: 'Lower Time Frame',  key: 'LTF', tip: 'LTF' },
  ];

  const trends = tfs.map(tf => mockStructure.trend[tf]);

  return (
    <AppLayout title={`Multi-Timeframe — ${symbol}`}>
      <div className="mtf-page fade-in">

        {/* Combo selector */}
        <div className="mtf-combo-selector">
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginRight: 'var(--sp-2)' }}>
            Timeframe Trio:
          </span>
          {MTF_COMBOS.map(c => (
            <button
              key={c.label}
              className={`mtf-combo-btn${combo.label === c.label ? ' mtf-combo-btn--active' : ''}`}
              onClick={() => setCombo(c)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Alignment summary card */}
        <MtfAlignPanel symbol={symbol} combo={combo} trends={trends} />

        {/* Three stacked charts */}
        {tfs.map((tf, i) => {
          const candles = mockCandles[symbol]?.[tf] ?? [];
          const tfZones = mockZones.filter(z => z.timeframe === tf);
          return (
            <div key={tf} className="mtf-chart-section">
              <div className="mtf-chart-header">
                <div className="mtf-chart-label">
                  <span className="mtf-chart-role">
                    <Tooltip term={roles[i].tip}>{roles[i].key}</Tooltip>
                  </span>
                  <span className="mtf-chart-tf font-mono">{symbol} · {tf}</span>
                  <TrendBadge trend={mockStructure.trend[tf] ?? 'neutral'} />
                </div>
                <span className="mtf-chart-desc text-muted">
                  {roles[i].label} — {i === 0 ? 'Sets the overall trend direction' : i === 1 ? 'Identifies zones and setups' : 'Confirms entry trigger'}
                </span>
              </div>
              <CandlestickChart
                candles={candles}
                zones={tfZones}
                structure={mockStructure}
                setups={[]}
                overlays={{ fvg: true, orderBlocks: true, supplyDemand: true, structure: true, setups: false }}
                height={260}
              />
            </div>
          );
        })}

        <Disclaimer />
      </div>
    </AppLayout>
  );
}
