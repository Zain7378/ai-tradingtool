import React, { useState, useRef } from 'react';
import './Tooltip.css';

// Glossary of trading terms from FYP plan §1
export const GLOSSARY = {
  FVG:         'Fair Value Gap — a price imbalance left by a fast move, found between three candles. Price often returns to fill it.',
  IFVG:        'Inverse FVG — an FVG that price closed straight through, so it now acts in the opposite direction.',
  BOS:         'Break of Structure — price closes beyond the last swing high/low in the trend\'s direction, confirming the trend continues.',
  CHoCH:       'Change of Character — price closes beyond the last swing against the trend: first sign the trend may be reversing.',
  'Order Block': 'The last opposite-coloured candle before a strong move that broke structure. Traders expect price to react when it returns here.',
  'Supply Zone': 'A small consolidation area before a strong move down. Sellers were active here and may be again.',
  'Demand Zone': 'A small consolidation area before a strong move up. Buyers were active here and may be again.',
  'Swing High': 'A local peak: a candle whose high is higher than N candles on each side.',
  'Swing Low':  'A local trough: a candle whose low is lower than N candles on each side.',
  'Uptrend':    'A series of higher highs and higher lows.',
  'Downtrend':  'A series of lower highs and lower lows.',
  'Liquidity':  'Clusters of stop-loss orders, usually just beyond obvious swing highs/lows. Price often "sweeps" these before reversing.',
  'Displacement': 'A strong, fast move with large candle bodies, used to qualify order blocks and zones.',
  'Risk-Reward': 'Target distance divided by stop distance. A 2R target is twice as far from entry as the stop.',
  'Probability': 'The ML model\'s historical estimate. "61%" means in similar past setups, about 61% hit the target first — not a guarantee.',
  'HTF':        'Higher Time Frame — a larger timeframe used to determine the overall trend direction.',
  'MTF':        'Middle Time Frame — used to find trading zones and setups within the HTF trend.',
  'LTF':        'Lower Time Frame — used for precise entry confirmation.',
  'ATR':        'Average True Range — a measure of market volatility over a set number of candles.',
  'OHLCV':      'Open, High, Low, Close, Volume — the five numbers describing every price candle.',
  'Backtest':   'Replaying historical data candle by candle with the same rules, to see what would have happened.',
  'R':          'One unit of risk. A 2R result means you made twice what you risked.',
};

export default function Tooltip({ term, children, placement = 'top' }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const definition = GLOSSARY[term] ?? children;

  const show = () => {
    clearTimeout(timerRef.current);
    setVisible(true);
  };
  const hide = () => {
    timerRef.current = setTimeout(() => setVisible(false), 100);
  };

  return (
    <span
      className="tooltip-anchor"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span className="tooltip-term">{term}</span>
      {visible && (
        <div className={`tooltip-box tooltip-box--${placement}`} role="tooltip">
          <strong className="tooltip-term-label">{term}</strong>
          <span className="tooltip-definition">{definition}</span>
        </div>
      )}
    </span>
  );
}
