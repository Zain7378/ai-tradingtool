import React from 'react';
import { useApp } from '../../context/AppContext';
import { instruments, timeframes } from '../../data/mockCandles';
import { mockStatus } from '../../data/mockStatus';
import { Clock, ChevronDown, Sun, Moon } from 'lucide-react';
import './Topbar.css';

function formatTime(isoStr) {
  return new Date(isoStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC';
}

export default function Topbar({ title }) {
  const { state, dispatch } = useApp();
  const { isLive, lastUpdate, delayMinutes } = mockStatus.dataProvider;
  const currentInst = instruments.find(i => i.symbol === state.symbol) || instruments[0];

  return (
    <header className="topbar">
      {/* Page Title & Breadcrumb */}
      <div className="topbar-title-section">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-controls">
        {/* Instrument Selector Pill with Live Quote */}
        <div className="topbar-instrument-card">
          <div className="topbar-select-wrap">
            <select
              id="instrument-select"
              className="topbar-select"
              value={state.symbol}
              onChange={e => dispatch({ type: 'SET_SYMBOL', payload: e.target.value })}
            >
              {instruments.map(i => (
                <option key={i.symbol} value={i.symbol}>
                  {i.symbol} ({i.label})
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="topbar-select-icon" />
          </div>

          <div className="topbar-quote-divider" />

          <div className="topbar-quote-data">
            <span className="topbar-quote-price font-mono">
              ${currentInst.currentPrice.toLocaleString()}
            </span>
            <span className={`topbar-quote-change ${currentInst.change24h >= 0 ? 'text-bull' : 'text-bear'} font-mono`}>
              {currentInst.change24h >= 0 ? '▲' : '▼'} {Math.abs(currentInst.change24h)}%
            </span>
          </div>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="topbar-segmented-track" role="radiogroup" aria-label="Timeframe selector">
          {timeframes.map(tf => {
            const isActive = state.timeframe === tf;
            return (
              <button
                key={tf}
                type="button"
                className={`topbar-segmented-btn${isActive ? ' topbar-segmented-btn--active' : ''}`}
                onClick={() => dispatch({ type: 'SET_TIMEFRAME', payload: tf })}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {/* Data freshness status */}
        <div className={`topbar-status-chip${!isLive ? ' topbar-status-chip--delayed' : ''}`}>
          <span className={`pulse-dot ${!isLive ? 'warn' : ''}`} />
          <span className="topbar-status-text">
            {isLive ? 'Live Feed' : `Delayed ${delayMinutes}m`}
          </span>
          <span className="topbar-status-time font-mono">
            <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />
            {formatTime(lastUpdate)}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="topbar-theme-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={`Switch to ${state.theme === 'light' ? 'Dark' : 'Bright Light'} mode`}
          aria-label="Toggle theme"
        >
          {state.theme === 'light' ? (
            <>
              <Moon size={14} />
              <span className="topbar-theme-label">Dark</span>
            </>
          ) : (
            <>
              <Sun size={14} />
              <span className="topbar-theme-label">Bright</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
