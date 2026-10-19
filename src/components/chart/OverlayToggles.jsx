import React from 'react';
import { useApp } from '../../context/AppContext';
import './OverlayToggles.css';

const TOGGLES = [
  { key: 'fvg',          label: 'Fair Value Gaps', color: 'bull' },
  { key: 'orderBlocks',  label: 'Order Blocks',     color: 'accent' },
  { key: 'supplyDemand', label: 'Supply/Demand',    color: 'purple' },
  { key: 'structure',    label: 'Structure & Swings', color: 'accent' },
  { key: 'setups',       label: 'Setups & Levels',   color: 'bull' },
];

export default function OverlayToggles() {
  const { state, dispatch } = useApp();

  return (
    <div className="overlay-toggles">
      <span className="overlay-toggles-label">Chart Overlays:</span>
      <div className="overlay-toggles-track">
        {TOGGLES.map(({ key, label, color }) => {
          const isOn = state.overlays[key];
          return (
            <button
              key={key}
              type="button"
              className={`overlay-btn overlay-btn--${color}${isOn ? ' overlay-btn--on' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_OVERLAY', payload: key })}
              aria-pressed={isOn}
            >
              <span className={`overlay-dot overlay-dot--${color}`} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
