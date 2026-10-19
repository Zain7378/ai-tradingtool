// mirrors GET /api/models/status + GET /api/status

export const mockStatus = {
  dataProvider: {
    name: 'Dukascopy (historical) + Twelve Data (recent)',
    lastUpdate: '2026-10-19T08:00:00Z',
    isLive: false,             // drives "Delayed" label on charts
    delayMinutes: 15,
    status: 'ok',              // ok | delayed | error
    instruments: ['XAUUSD', 'EURUSD'],
    timeframes: ['15m', '1h', '4h', '1d'],
    warnings: [
      'EURUSD 15m: 3 missing candles on 2026-10-14 (market holiday gap)',
    ],
    errors: [],
  },

  activeModel: {
    id: 'model-004',
    version: 'v1.2',
    algorithm: 'LightGBM',
    trainStart: '2020-01-01',
    trainEnd:   '2025-06-30',
    validationEnd: '2025-12-31',
    testStart:  '2026-01-01',
    testEnd:    '2026-06-30',
    featureCount: 14,
    features: [
      'fvg_size_atr_ratio', 'htf_trend_aligned', 'mtf_bos_count',
      'zone_age_bars', 'distance_to_zone_atr', 'volume_ratio',
      'time_of_day_sin', 'time_of_day_cos', 'day_of_week',
      'prior_swing_dist', 'confluence_zone_count', 'rrr',
      'candle_pressure', 'spread_at_detection',
    ],
    metrics: {
      precision: 0.63,
      recall: 0.59,
      rocAuc: 0.71,
      brierScore: 0.21,
      baselineAuc: 0.51,
    },
    validated: false,          // "Experimental" badge shown when false
    validationNote: 'Model has not yet passed out-of-sample validation. Results are experimental.',
    loadedAt: '2026-10-19T08:01:00Z',
  },

  allModels: [
    { id: 'model-001', version: 'v1.0', algorithm: 'Logistic Regression', trainEnd: '2024-12-31', rocAuc: 0.58, isActive: false },
    { id: 'model-002', version: 'v1.1', algorithm: 'Random Forest',       trainEnd: '2025-03-31', rocAuc: 0.64, isActive: false },
    { id: 'model-003', version: 'v1.2-rc', algorithm: 'LightGBM',         trainEnd: '2025-06-30', rocAuc: 0.70, isActive: false },
    { id: 'model-004', version: 'v1.2', algorithm: 'LightGBM',            trainEnd: '2025-06-30', rocAuc: 0.71, isActive: true  },
  ],

  // Calibration data — model score bucket vs actual win rate
  calibration: [
    { bucket: '0–10%',   predicted: 0.05, actual: 0.07 },
    { bucket: '10–20%',  predicted: 0.15, actual: 0.12 },
    { bucket: '20–30%',  predicted: 0.25, actual: 0.22 },
    { bucket: '30–40%',  predicted: 0.35, actual: 0.31 },
    { bucket: '40–50%',  predicted: 0.45, actual: 0.43 },
    { bucket: '50–60%',  predicted: 0.55, actual: 0.52 },
    { bucket: '60–70%',  predicted: 0.65, actual: 0.64 },
    { bucket: '70–80%',  predicted: 0.75, actual: 0.69 },
    { bucket: '80–90%',  predicted: 0.85, actual: 0.80 },
    { bucket: '90–100%', predicted: 0.95, actual: 0.88 },
  ],
};
