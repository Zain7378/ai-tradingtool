import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import CandlestickChart from '../components/chart/CandlestickChart';
import OverlayToggles from '../components/chart/OverlayToggles';
import SetupDetailPanel from '../components/panels/SetupDetailPanel';
import Tooltip from '../components/ui/Tooltip';
import Disclaimer from '../components/ui/Disclaimer';
import { useApp } from '../context/AppContext';
import { mockCandles } from '../data/mockCandles';
import { mockZones } from '../data/mockZones';
import { mockStructure } from '../data/mockStructure';
import { mockSetups } from '../data/mockSetups';
import './Chart.css';

export default function Chart() {
  const { state, dispatch } = useApp();
  const [searchParams] = useSearchParams();

  // Support ?setup=setup-001 query param from "View on chart" buttons
  useEffect(() => {
    const setupParam = searchParams.get('setup');
    if (setupParam) {
      const target = mockSetups.find(s => s.id === setupParam);
      if (target) {
        dispatch({ type: 'SELECT_SETUP', payload: target.id });
        if (target.symbol !== state.symbol) {
          dispatch({ type: 'SET_SYMBOL', payload: target.symbol });
        }
        if (target.timeframe !== state.timeframe) {
          dispatch({ type: 'SET_TIMEFRAME', payload: target.timeframe });
        }
      }
    }
  }, [searchParams, dispatch, state.symbol, state.timeframe]);

  const candles = mockCandles[state.symbol]?.[state.timeframe] ?? [];
  const symbolSetups = mockSetups.filter(s => s.symbol === state.symbol);
  const activeSetups = symbolSetups.filter(s =>
    ['detected', 'awaiting', 'confirmed'].includes(s.state)
  );

  const selectedSetup = mockSetups.find(s => s.id === state.selectedSetupId);

  // If a setup is selected, prioritize drawing its entry/stop/target levels
  const chartSetups = selectedSetup ? [selectedSetup] : activeSetups;

  const handleSetupClick = (setupId) => {
    dispatch({ type: 'SELECT_SETUP', payload: setupId });
  };

  return (
    <AppLayout title={`Chart — ${state.symbol} (${state.timeframe})`} noPad>
      <div className="chart-page">
        {/* Main chart area */}
        <div className="chart-page-main">
          {/* Toolbar */}
          <div className="chart-toolbar">
            <OverlayToggles />
            <div className="chart-toolbar-right">
              <span className="chart-active-setups-count">
                {activeSetups.length} active setup{activeSetups.length !== 1 ? 's' : ''} on {state.symbol}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="chart-page-chart">
            <CandlestickChart
              candles={candles}
              zones={mockZones}
              structure={mockStructure}
              setups={chartSetups}
              overlays={state.overlays}
              onSetupClick={handleSetupClick}
              height={520}
            />
          </div>

          {/* Zone legend */}
          <div className="zone-legend">
            <span className="zone-legend-title">Legend:</span>
            <span className="zone-legend-item zone-legend-item--fvg-bull">
              ■ <Tooltip term="FVG">Bullish FVG</Tooltip>
            </span>
            <span className="zone-legend-item zone-legend-item--fvg-bear">
              ■ <Tooltip term="FVG">Bearish FVG</Tooltip>
            </span>
            <span className="zone-legend-item zone-legend-item--ob-bull">
              ■ <Tooltip term="Order Block">Bullish OB</Tooltip>
            </span>
            <span className="zone-legend-item zone-legend-item--ob-bear">
              ■ <Tooltip term="Order Block">Bearish OB</Tooltip>
            </span>
            <span className="zone-legend-item zone-legend-item--sdz">
              ■ <Tooltip term="Supply Zone">S/D Zone</Tooltip>
            </span>
            <span className="zone-legend-item" style={{ color: 'var(--accent)' }}>
              ▲ <Tooltip term="BOS">BOS</Tooltip> / <Tooltip term="CHoCH">CHoCH</Tooltip>
            </span>
          </div>

          {/* Setup click guide */}
          {!state.selectedSetupId && activeSetups.length > 0 && (
            <div className="chart-hint">
              ↑ Click any setup marker on the chart (▲ / ▼) or choose a setup below to open its probability analysis
            </div>
          )}

          {/* Quick-select buttons for setups */}
          <div className="chart-setup-quickselect">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', alignSelf: 'center' }}>
              Quick Select:
            </span>
            {mockSetups.filter(s => ['detected','awaiting','confirmed'].includes(s.state)).map(s => (
              <button
                key={s.id}
                className={`quickselect-btn quickselect-btn--${s.direction}${state.selectedSetupId === s.id ? ' quickselect-btn--active' : ''}`}
                onClick={() => {
                  dispatch({ type: 'SELECT_SETUP', payload: s.id });
                  if (s.symbol !== state.symbol) dispatch({ type: 'SET_SYMBOL', payload: s.symbol });
                  if (s.timeframe !== state.timeframe) dispatch({ type: 'SET_TIMEFRAME', payload: s.timeframe });
                }}
              >
                {s.symbol} · {s.timeframe} · {s.direction === 'bullish' ? '▲' : '▼'} {Math.round(s.probability * 100)}% ({s.strategy})
              </button>
            ))}
          </div>

          <div style={{ padding: '0 var(--sp-5) var(--sp-5)' }}>
            <Disclaimer />
          </div>
        </div>

        {/* Right panel */}
        {state.selectedSetupId && (
          <SetupDetailPanel />
        )}
      </div>
    </AppLayout>
  );
}
