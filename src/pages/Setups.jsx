import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { DirectionBadge, StateBadge, ExperimentalBadge } from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import Disclaimer from '../components/ui/Disclaimer';
import { mockSetups } from '../data/mockSetups';
import { ArrowUpDown, Filter, ChevronRight } from 'lucide-react';
import './Setups.css';

const STATE_OPTIONS  = ['all', 'detected', 'awaiting', 'confirmed', 'invalidated', 'expired'];
const DIR_OPTIONS    = ['all', 'bullish', 'bearish'];
const STRAT_OPTIONS  = ['all', 'FVG Retest', 'Order Block Entry'];
const SYMBOL_OPTIONS = ['all', 'XAUUSD', 'EURUSD'];

function probClass(p) {
  if (p >= 0.6) return 'high';
  if (p >= 0.4) return 'mid';
  return 'low';
}

export default function Setups() {
  const navigate = useNavigate();
  const [filterSymbol, setFilterSymbol] = useState('all');
  const [filterState,  setFilterState]  = useState('all');
  const [filterDir,    setFilterDir]    = useState('all');
  const [filterStrat,  setFilterStrat]  = useState('all');
  const [minProb,      setMinProb]      = useState(0);
  const [sortKey,      setSortKey]      = useState('detectedAt');
  const [sortDir,      setSortDir]      = useState('desc');

  const filtered = useMemo(() => {
    let rows = [...mockSetups];
    if (filterSymbol !== 'all') rows = rows.filter(s => s.symbol === filterSymbol);
    if (filterState  !== 'all') rows = rows.filter(s => s.state === filterState);
    if (filterDir    !== 'all') rows = rows.filter(s => s.direction === filterDir);
    if (filterStrat  !== 'all') rows = rows.filter(s => s.strategy === filterStrat);
    rows = rows.filter(s => s.probability >= minProb);
    rows.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortDir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return rows;
  }, [filterSymbol, filterState, filterDir, filterStrat, minProb, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

function renderSortIcon(sortKey, k) {
  return sortKey === k
    ? <ArrowUpDown size={12} style={{ color: 'var(--accent)' }} />
    : <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
}

  return (
    <AppLayout title="Detected Trading Setups">
      <div className="setups-page fade-in">

        {/* ── Filters ──────────────────────────────── */}
        <section className="setups-filters">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />

          <label className="filter-label">Symbol</label>
          <select value={filterSymbol} onChange={e => setFilterSymbol(e.target.value)} className="filter-select">
            {SYMBOL_OPTIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'All symbols' : o}</option>)}
          </select>

          <label className="filter-label">State</label>
          <select value={filterState} onChange={e => setFilterState(e.target.value)} className="filter-select">
            {STATE_OPTIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'All states' : o}</option>)}
          </select>

          <label className="filter-label">Direction</label>
          <select value={filterDir} onChange={e => setFilterDir(e.target.value)} className="filter-select">
            {DIR_OPTIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'All directions' : o}</option>)}
          </select>

          <label className="filter-label">Strategy</label>
          <select value={filterStrat} onChange={e => setFilterStrat(e.target.value)} className="filter-select">
            {STRAT_OPTIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'All strategies' : o}</option>)}
          </select>

          <label className="filter-label">Min Prob.</label>
          <select value={minProb} onChange={e => setMinProb(+e.target.value)} className="filter-select">
            {[0, 0.3, 0.4, 0.5, 0.6, 0.7].map(v => (
              <option key={v} value={v}>{v === 0 ? 'Any' : `≥ ${v * 100}%`}</option>
            ))}
          </select>

          <span className="filter-count">{filtered.length} setup{filtered.length !== 1 ? 's' : ''}</span>
        </section>

        {/* ── Table ─────────────────────────────────── */}
        <section className="setups-table-wrap">
          <table className="setups-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('detectedAt')} className="th-sort">
                  Detected Time {renderSortIcon(sortKey, 'detectedAt')}
                </th>
                <th>Instrument</th>
                <th onClick={() => toggleSort('direction')} className="th-sort">
                  Direction {renderSortIcon(sortKey, 'direction')}
                </th>
                <th>Strategy</th>
                <th onClick={() => toggleSort('state')} className="th-sort">
                  State {renderSortIcon(sortKey, 'state')}
                </th>
                <th onClick={() => toggleSort('probability')} className="th-sort">
                  <Tooltip term="Probability">Win Prob.</Tooltip> {renderSortIcon(sortKey, 'probability')}
                </th>
                <th><Tooltip term="Risk-Reward">R:R</Tooltip></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr
                  key={s.id}
                  className="setups-row"
                  onClick={() => navigate(`/setups/${s.id}`)}
                >
                  <td className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    {s.detectedAtLabel}
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>
                    {s.symbol} <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>({s.timeframe})</span>
                  </td>
                  <td><DirectionBadge direction={s.direction} /></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{s.strategy}</td>
                  <td><StateBadge state={s.state} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`prob-chip prob-chip--${probClass(s.probability)}`}>
                        {Math.round(s.probability * 100)}%
                      </span>
                      {!s.validated && <ExperimentalBadge />}
                    </div>
                  </td>
                  <td className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>
                    {s.riskReward}R
                  </td>
                  <td><span className="row-chevron"><ChevronRight size={14} style={{ color: 'var(--text-muted)' }} /></span></td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="setups-empty">No setups match the current filters.</div>
          )}
        </section>

        <Disclaimer />
      </div>
    </AppLayout>
  );
}
