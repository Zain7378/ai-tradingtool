import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Tooltip from '../components/ui/Tooltip';
import { mockStrategies as initialStrategies } from '../data/mockStrategies';
import { ChevronDown, ChevronUp, GitBranch, Settings, Clock, Check, X } from 'lucide-react';
import './Strategies.css';

function VersionTimeline({ versions }) {
  return (
    <div className="version-timeline">
      {[...versions].reverse().map((v, i) => (
        <div key={v.version} className={`version-item${i === 0 ? ' version-item--latest' : ''}`}>
          <div className="version-dot" />
          <div className="version-content">
            <div className="version-header-row">
              <span className="version-tag font-mono">v{v.version}</span>
              <span className="version-date text-muted">{v.date}</span>
              {i === 0 && <span className="version-current-badge">Current</span>}
            </div>
            <p className="version-note">{v.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Strategies() {
  const [strategies, setStrategies] = useState(initialStrategies);
  const [expanded, setExpanded] = useState({ 'strat-001': true });
  const [editModal, setEditModal] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [versionNote, setVersionNote] = useState('');
  const [notification, setNotification] = useState(null);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const openEdit = (strat) => {
    const vals = {};
    strat.conditions.forEach(c => {
      vals[c.paramKey] = c.paramValue;
    });
    setFormValues(vals);
    setVersionNote(`Adjusted parameters for ${strat.name}`);
    setEditModal(strat);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editModal) return;

    const currentMajor = parseFloat(editModal.currentVersion) || 1.0;
    const nextVersion = (currentMajor + 0.1).toFixed(1);

    const updated = strategies.map(s => {
      if (s.id !== editModal.id) return s;
      const updatedConditions = s.conditions.map(c => ({
        ...c,
        paramValue: formValues[c.paramKey] ?? c.paramValue,
      }));

      const newVersionEntry = {
        version: nextVersion,
        date: new Date().toISOString().split('T')[0],
        note: versionNote || `Updated parameter values`,
      };

      return {
        ...s,
        currentVersion: nextVersion,
        lastModified: new Date().toISOString(),
        conditions: updatedConditions,
        versions: [...s.versions, newVersionEntry],
      };
    });

    setStrategies(updated);
    setEditModal(null);
    setNotification(`Successfully created strategy version v${nextVersion}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <AppLayout title="Strategies & Rule Definitions">
      <div className="strategies-page fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <p className="strategies-intro text-muted" style={{ margin: 0 }}>
            Each strategy is a formal, versioned rule set. Parameter modifications create a new version, preserving prior versions for historical backtest reproducibility.
          </p>
          {notification && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bull-dim)', color: 'var(--bull)', border: '1px solid var(--bull-border)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
              <Check size={14} />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {strategies.map(strat => (
          <div key={strat.id} className="strategy-card">

            {/* Card header */}
            <div className="strategy-card-header" onClick={() => toggle(strat.id)}>
              <div className="strategy-card-title-row">
                <span className="strategy-name">{strat.name}</span>
                <span className="strategy-version font-mono">v{strat.currentVersion}</span>
              </div>
              <div className="strategy-card-meta">
                <span className="text-muted strategy-desc">{strat.description}</span>
                <div className="strategy-card-actions">
                  <span className="text-muted strategy-modified">
                    <Clock size={12} /> {new Date(strat.lastModified).toLocaleDateString()}
                  </span>
                  <button className="strategy-edit-btn" onClick={e => { e.stopPropagation(); openEdit(strat); }}>
                    <Settings size={13} /> Edit parameters
                  </button>
                  <span className="strategy-expand-icon">
                    {expanded[strat.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </div>
              </div>
            </div>

            {/* Expandable body */}
            {expanded[strat.id] && (
              <div className="strategy-card-body">

                {/* Conditions table */}
                <div className="strategy-section">
                  <h3 className="strategy-section-title"><Settings size={14} /> Conditions & Rules</h3>
                  <table className="conditions-table">
                    <thead>
                      <tr>
                        <th>Condition</th>
                        <th>Rule Requirement</th>
                        <th>Parameter Key</th>
                        <th>Current Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strat.conditions.map(c => (
                        <tr key={c.id} className="condition-row">
                          <td className="condition-label">
                            <Tooltip term={c.label.includes('FVG') ? 'FVG' : c.label.includes('Trend') ? 'Uptrend' : c.label.includes('Target') ? 'Risk-Reward' : c.label}>
                              {c.label}
                            </Tooltip>
                          </td>
                          <td className="condition-value">{c.value}</td>
                          <td className="font-mono text-muted" style={{ fontSize: 'var(--text-xs)' }}>{c.paramKey}</td>
                          <td>
                            <span className="param-value font-mono">{c.paramValue}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Version history */}
                <div className="strategy-section">
                  <h3 className="strategy-section-title"><GitBranch size={14} /> Version History</h3>
                  <VersionTimeline versions={strat.versions} />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Edit modal */}
        {editModal && (
          <div className="modal-backdrop" onClick={() => setEditModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="modal-title">Edit Parameters — {editModal.name}</h2>
                <button onClick={() => setEditModal(null)} style={{ color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              </div>
              <p className="modal-note text-muted">
                Saving will create a new version (v{(parseFloat(editModal.currentVersion) + 0.1).toFixed(1)}). The current version (v{editModal.currentVersion}) is preserved for backtesting consistency.
              </p>
              <form onSubmit={handleSave}>
                <div className="modal-fields">
                  {editModal.conditions.map(c => (
                    <div key={c.id} className="modal-field">
                      <label className="modal-field-label">{c.label} ({c.paramKey})</label>
                      <input
                        value={formValues[c.paramKey] ?? c.paramValue}
                        onChange={e => setFormValues({ ...formValues, [c.paramKey]: e.target.value })}
                        className="modal-field-input"
                      />
                    </div>
                  ))}
                  <div className="modal-field">
                    <label className="modal-field-label">Version Change Note</label>
                    <input
                      value={versionNote}
                      onChange={e => setVersionNote(e.target.value)}
                      placeholder="e.g. Adjusted risk reward target"
                      className="modal-field-input"
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel" onClick={() => setEditModal(null)}>Cancel</button>
                  <button type="submit" className="modal-save">
                    Save as new version
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
