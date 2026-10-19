import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  theme: 'light', // 'light' is default for bright authentic UI
  symbol: 'XAUUSD',
  timeframe: '1h',
  selectedSetupId: null,
  overlays: {
    fvg: true,
    orderBlocks: true,
    structure: true,
    setups: true,
    supplyDemand: true,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_SYMBOL':
      return { ...state, symbol: action.payload };
    case 'SET_TIMEFRAME':
      return { ...state, timeframe: action.payload };
    case 'SELECT_SETUP':
      return { ...state, selectedSetupId: action.payload };
    case 'DESELECT_SETUP':
      return { ...state, selectedSetupId: null };
    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        overlays: { ...state.overlays, [action.payload]: !state.overlays[action.payload] },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
