import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CandlestickChart,
  ListChecks,
  Layers,
  FlaskConical,
  Settings2,
  ServerCog,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Overview',          badge: null },
  { to: '/chart',      icon: CandlestickChart, label: 'Interactive Chart', badge: null },
  { to: '/setups',     icon: ListChecks,      label: 'Setups & Signals',  badge: '5' },
  { to: '/mtf',        icon: Layers,          label: 'Multi-Timeframe',   badge: null },
  { to: '/backtest',   icon: FlaskConical,    label: 'Backtest Engine',   badge: null },
  { to: '/strategies', icon: Settings2,       label: 'Strategy Rules',    badge: null },
  { to: '/status',     icon: ServerCog,       label: 'Model Health',      badge: null },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-emblem">
          <TrendingUp size={18} strokeWidth={2.5} />
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">TradeAI</div>
          <span className="sidebar-brand-pill">SYSTEM</span>
        </div>
      </div>

      {/* Nav Section Label */}
      <div className="sidebar-section-title">Navigation</div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <Icon size={17} strokeWidth={2} className="sidebar-link-icon" />
            <span className="sidebar-link-label">{label}</span>
            {badge && <span className="sidebar-link-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* System Health Widget in Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-health-card">
          <div className="sidebar-health-header">
            <span className="pulse-dot warn" />
            <span className="sidebar-health-title">Data Feed Delayed 15m</span>
          </div>
          <div className="sidebar-health-meta">
            <span className="sidebar-health-engine">
              <Cpu size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              LightGBM v1.2
            </span>
            <span className="sidebar-health-version">Prototype</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
