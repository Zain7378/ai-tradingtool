// mirrors POST /api/backtests + GET /api/backtests/:id results

export const mockBacktest = {
  id: 'bt-001',
  strategy: 'FVG Retest',
  symbol: 'XAUUSD',
  timeframe: '1h',
  dateFrom: '2025-01-01',
  dateTo:   '2026-10-01',
  status: 'complete',           // running | complete | failed
  runAt: '2026-10-18T22:00:00Z',
  spread: 0.30,

  summary: {
    totalSetups: 142,
    wins: 82,
    losses: 60,
    winRate: 0.577,
    avgR: 1.21,
    maxDrawdown: -8.4,  // percent
    profitFactor: 2.1,
    totalR: 41.3,
  },

  // Outcome rate per probability bucket — for bar chart
  byProbabilityRange: [
    { range: '0–20%',  setups: 8,  winRate: 0.12 },
    { range: '20–40%', setups: 24, winRate: 0.29 },
    { range: '40–60%', setups: 51, winRate: 0.49 },
    { range: '60–80%', setups: 47, winRate: 0.66 },
    { range: '80–100%', setups: 12, winRate: 0.83 },
  ],

  // Breakdown by direction
  byDirection: [
    { direction: 'Bullish', setups: 79, winRate: 0.62 },
    { direction: 'Bearish', setups: 63, winRate: 0.51 },
  ],

  // Equity curve — cumulative R over time
  equityCurve: [
    { time: '2025-01-15', value: 2.0 },
    { time: '2025-02-01', value: 1.5 },
    { time: '2025-02-20', value: 4.5 },
    { time: '2025-03-10', value: 3.8 },
    { time: '2025-04-01', value: 7.2 },
    { time: '2025-05-01', value: 10.1 },
    { time: '2025-06-01', value: 8.9 },
    { time: '2025-07-01', value: 14.3 },
    { time: '2025-08-01', value: 19.0 },
    { time: '2025-09-01', value: 16.8 },
    { time: '2025-10-01', value: 22.5 },
    { time: '2025-11-01', value: 28.1 },
    { time: '2025-12-01', value: 25.9 },
    { time: '2026-01-01', value: 31.4 },
    { time: '2026-02-01', value: 35.8 },
    { time: '2026-03-01', value: 33.2 },
    { time: '2026-04-01', value: 38.6 },
    { time: '2026-05-01', value: 41.3 },
    { time: '2026-06-01', value: 39.0 },
    { time: '2026-07-01', value: 43.7 },
    { time: '2026-08-01', value: 41.3 },
  ],

  // Per-setup results table
  setups: [
    { id: 'bts-001', detectedAt: '2026-10-01 08:00', direction: 'bullish', predictedProb: 0.64, outcome: 'target', barsToResult: 18 },
    { id: 'bts-002', detectedAt: '2026-09-28 12:00', direction: 'bearish', predictedProb: 0.41, outcome: 'stop',   barsToResult: 6  },
    { id: 'bts-003', detectedAt: '2026-09-25 16:00', direction: 'bullish', predictedProb: 0.71, outcome: 'target', barsToResult: 22 },
    { id: 'bts-004', detectedAt: '2026-09-22 04:00', direction: 'bearish', predictedProb: 0.55, outcome: 'stop',   barsToResult: 11 },
    { id: 'bts-005', detectedAt: '2026-09-18 08:00', direction: 'bullish', predictedProb: 0.68, outcome: 'target', barsToResult: 30 },
    { id: 'bts-006', detectedAt: '2026-09-14 00:00', direction: 'bullish', predictedProb: 0.32, outcome: 'expired', barsToResult: 48 },
    { id: 'bts-007', detectedAt: '2026-09-10 12:00', direction: 'bearish', predictedProb: 0.79, outcome: 'target', barsToResult: 9  },
    { id: 'bts-008', detectedAt: '2026-09-06 08:00', direction: 'bullish', predictedProb: 0.58, outcome: 'target', barsToResult: 25 },
    { id: 'bts-009', detectedAt: '2026-09-02 16:00', direction: 'bearish', predictedProb: 0.44, outcome: 'stop',   barsToResult: 4  },
    { id: 'bts-010', detectedAt: '2026-08-29 00:00', direction: 'bullish', predictedProb: 0.81, outcome: 'target', barsToResult: 14 },
  ],
};
