// mirrors GET /api/strategies

export const mockStrategies = [
  {
    id: 'strat-001',
    name: 'FVG Retest',
    description: 'Enters when price returns to a Fair Value Gap aligned with the higher-timeframe trend.',
    currentVersion: '1.3',
    lastModified: '2026-10-15T10:00:00Z',
    conditions: [
      { id: 'c1', label: 'HTF Trend',       value: 'Bullish or Bearish (aligned)',    paramKey: 'htf_trend_tf',    paramValue: '4h' },
      { id: 'c2', label: 'FVG Direction',   value: 'Must match HTF trend',            paramKey: 'fvg_min_size_atr', paramValue: '0.5' },
      { id: 'c3', label: 'FVG Status',      value: 'Fresh only',                     paramKey: 'fvg_status',       paramValue: 'fresh' },
      { id: 'c4', label: 'Entry trigger',   value: 'Price enters the FVG on LTF',    paramKey: 'ltf_tf',           paramValue: '15m' },
      { id: 'c5', label: 'Stop placement',  value: 'Beyond FVG opposite edge + 0.5 pip', paramKey: 'stop_buffer_pips', paramValue: '0.5' },
      { id: 'c6', label: 'Target',          value: '2R from entry',                  paramKey: 'risk_reward',      paramValue: '2.0' },
      { id: 'c7', label: 'Expiry',          value: 'Invalidated if FVG fully mitigated without trigger', paramKey: 'expiry_bars', paramValue: '48' },
    ],
    versions: [
      { version: '1.0', date: '2026-08-01', note: 'Initial definition — FVG + HTF trend only.' },
      { version: '1.1', date: '2026-08-20', note: 'Added minimum FVG size filter (0.3× ATR).' },
      { version: '1.2', date: '2026-09-05', note: 'Increased minimum size to 0.5× ATR; added 48-bar expiry.' },
      { version: '1.3', date: '2026-10-15', note: 'Stop buffer raised from 0.3 to 0.5 pip after slippage analysis.' },
    ],
  },
  {
    id: 'strat-002',
    name: 'Order Block Entry',
    description: 'Enters when price returns to a bullish or bearish order block following a displacement move.',
    currentVersion: '1.0',
    lastModified: '2026-10-10T14:00:00Z',
    conditions: [
      { id: 'c1', label: 'Displacement',    value: 'BOS on LTF following OB formation', paramKey: 'bos_required',  paramValue: 'true' },
      { id: 'c2', label: 'OB Direction',    value: 'Must align with MTF trend',          paramKey: 'ob_min_size',   paramValue: '0.8× ATR' },
      { id: 'c3', label: 'Entry trigger',   value: 'Price retests OB zone',              paramKey: 'ltf_tf',        paramValue: '15m' },
      { id: 'c4', label: 'Stop placement',  value: 'Beyond OB + 1 pip',                 paramKey: 'stop_buffer',   paramValue: '1.0' },
      { id: 'c5', label: 'Target',          value: '2R from entry',                      paramKey: 'risk_reward',   paramValue: '2.0' },
    ],
    versions: [
      { version: '1.0', date: '2026-10-10', note: 'Initial definition.' },
    ],
  },
];
