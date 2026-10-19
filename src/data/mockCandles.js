// mirrors GET /api/candles?symbol=XAUUSD&tf=1h
// Realistic OHLCV data synchronized with mock setups, zones, and structure

const START_TS = 1791590400; // 2026-10-10 00:00:00 UTC
const END_TS   = 1792396800; // 2026-10-19 08:00:00 UTC

function generateCandles({
  startTs,
  count,
  stepSec,
  basePrice,
  volatility,
  precision = 2,
}) {
  const candles = [];
  let close = basePrice;

  for (let i = 0; i < count; i++) {
    const time = startTs + i * stepSec;
    // Multi-frequency wave pattern for realistic market waves
    const wave = Math.sin(i * 0.15) * volatility * 0.8 + Math.cos(i * 0.4) * volatility * 0.4;
    const micro = (Math.sin(i * 1.7) - 0.05) * volatility * 0.3;
    const move = +(wave * 0.3 + micro).toFixed(precision);

    const open = close;
    close = +(open + move).toFixed(precision);
    const wickHigh = +(Math.abs(Math.sin(i * 2.1)) * volatility * 0.5).toFixed(precision);
    const wickLow  = +(Math.abs(Math.cos(i * 1.9)) * volatility * 0.5).toFixed(precision);

    const high = +(Math.max(open, close) + wickHigh).toFixed(precision);
    const low  = +(Math.min(open, close) - wickLow).toFixed(precision);
    const volume = Math.floor(1200 + Math.abs(Math.sin(i * 0.8)) * 3800);

    candles.push({ time, open, high, low, close, volume });
  }
  return candles;
}

// 1h: 225 candles (Oct 10 00:00 -> Oct 19 08:00)
const xauusd1h = generateCandles({
  startTs: START_TS,
  count: 225,
  stepSec: 3600,
  basePrice: 2012.50,
  volatility: 4.5,
  precision: 2,
});

// 4h: 57 candles
const xauusd4h = generateCandles({
  startTs: START_TS,
  count: 57,
  stepSec: 14400,
  basePrice: 2010.00,
  volatility: 8.0,
  precision: 2,
});

// 15m: 240 candles (last 2.5 days up to END_TS)
const xauusd15m = generateCandles({
  startTs: END_TS - 240 * 900,
  count: 240,
  stepSec: 900,
  basePrice: 2016.00,
  volatility: 2.2,
  precision: 2,
});

// 1d: 60 daily candles
const xauusd1d = generateCandles({
  startTs: END_TS - 60 * 86400,
  count: 60,
  stepSec: 86400,
  basePrice: 1980.00,
  volatility: 18.0,
  precision: 2,
});

export const mockCandles = {
  'XAUUSD': {
    '15m': xauusd15m,
    '1h':  xauusd1h,
    '4h':  xauusd4h,
    '1d':  xauusd1d,
  },
  'EURUSD': {
    '15m': xauusd15m.map(c => ({
      ...c,
      open:  +(1.0820 + (c.open - 2000) * 0.0003).toFixed(5),
      high:  +(1.0820 + (c.high - 2000) * 0.0003).toFixed(5),
      low:   +(1.0820 + (c.low  - 2000) * 0.0003).toFixed(5),
      close: +(1.0820 + (c.close - 2000) * 0.0003).toFixed(5),
    })),
    '1h': xauusd1h.map(c => ({
      ...c,
      open:  +(1.0820 + (c.open - 2000) * 0.0003).toFixed(5),
      high:  +(1.0820 + (c.high - 2000) * 0.0003).toFixed(5),
      low:   +(1.0820 + (c.low  - 2000) * 0.0003).toFixed(5),
      close: +(1.0820 + (c.close - 2000) * 0.0003).toFixed(5),
    })),
    '4h': xauusd4h.map(c => ({
      ...c,
      open:  +(1.0820 + (c.open - 2000) * 0.0003).toFixed(5),
      high:  +(1.0820 + (c.high - 2000) * 0.0003).toFixed(5),
      low:   +(1.0820 + (c.low  - 2000) * 0.0003).toFixed(5),
      close: +(1.0820 + (c.close - 2000) * 0.0003).toFixed(5),
    })),
    '1d': xauusd1d.map(c => ({
      ...c,
      open:  +(1.0820 + (c.open - 2000) * 0.0003).toFixed(5),
      high:  +(1.0820 + (c.high - 2000) * 0.0003).toFixed(5),
      low:   +(1.0820 + (c.low  - 2000) * 0.0003).toFixed(5),
      close: +(1.0820 + (c.close - 2000) * 0.0003).toFixed(5),
    })),
  },
};

export const instruments = [
  { symbol: 'XAUUSD', label: 'Gold / USD', type: 'commodity', precision: 2, currentPrice: 2018.40, change24h: 0.42 },
  { symbol: 'EURUSD', label: 'EUR / USD',  type: 'forex',     precision: 5, currentPrice: 1.08620, change24h: -0.15 },
];

export const timeframes = ['15m', '1h', '4h', '1d'];
