import React from 'react';
import './Badge.css';

const DIRECTION_MAP = {
  bullish: { label: 'Bullish', cls: 'badge--bull' },
  bearish: { label: 'Bearish', cls: 'badge--bear' },
};

const STATE_MAP = {
  detected:    { label: 'Detected',    cls: 'badge--detected' },
  awaiting:    { label: 'Awaiting',    cls: 'badge--awaiting' },
  confirmed:   { label: 'Confirmed',   cls: 'badge--confirmed' },
  invalidated: { label: 'Invalidated', cls: 'badge--invalid' },
  expired:     { label: 'Expired',     cls: 'badge--expired' },
};

const TREND_MAP = {
  bullish: { label: '▲ Bullish', cls: 'badge--bull' },
  bearish: { label: '▼ Bearish', cls: 'badge--bear' },
  neutral: { label: '— Neutral', cls: 'badge--neutral' },
};

const STATUS_MAP = {
  fresh:             { label: 'Fresh',        cls: 'badge--fresh' },
  partly_mitigated:  { label: 'Partly Mit.', cls: 'badge--partial' },
  fully_mitigated:   { label: 'Mitigated',   cls: 'badge--mitigated' },
};

export function DirectionBadge({ direction }) {
  const m = DIRECTION_MAP[direction] ?? { label: direction, cls: '' };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function StateBadge({ state }) {
  const m = STATE_MAP[state] ?? { label: state, cls: '' };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function TrendBadge({ trend }) {
  const m = TREND_MAP[trend] ?? { label: trend, cls: 'badge--neutral' };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function ZoneStatusBadge({ status }) {
  const m = STATUS_MAP[status] ?? { label: status, cls: '' };
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
}

export function ExperimentalBadge() {
  return <span className="badge badge--experimental">⚗ Experimental</span>;
}

export function Badge({ children, variant = 'default', size = 'sm' }) {
  return <span className={`badge badge--${variant} badge--size-${size}`}>{children}</span>;
}
