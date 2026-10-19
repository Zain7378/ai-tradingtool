// mirrors part of GET /api/analysis — structure detections
export const mockStructure = {
  swingHighs: [
    { time: 1791856800, price: 2024.60, label: 'SH' },
    { time: 1792116000, price: 2031.10, label: 'SH' },
    { time: 1792332000, price: 2028.40, label: 'SH' },
  ],
  swingLows: [
    { time: 1791770400, price: 2008.30, label: 'SL' },
    { time: 1792029600, price: 2012.10, label: 'SL' },
    { time: 1792288800, price: 2005.80, label: 'SL' },
  ],
  bosEvents: [
    {
      id: 'bos-001',
      time: 1792116000,
      price: 2024.60,
      direction: 'bullish',
      label: 'BOS',
      tooltip: 'Break of Structure — price closed beyond the last swing high, confirming the uptrend continues.',
    },
    {
      id: 'bos-002',
      time: 1792375200,
      price: 2028.40,
      direction: 'bearish',
      label: 'BOS',
      tooltip: 'Break of Structure — price closed below last swing low, trend continues downward.',
    },
  ],
  chochEvents: [
    {
      id: 'choch-001',
      time: 1792245600,
      price: 2012.10,
      direction: 'bearish',
      label: 'CHoCH',
      tooltip: 'Change of Character — price closed against the trend, first sign of a potential reversal.',
    },
  ],
  trend: {
    '4h': 'bullish',
    '1h': 'bearish',
    '15m': 'bullish',
    '1d': 'bullish',
  },
};
