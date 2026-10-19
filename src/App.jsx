import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Overview from './pages/Overview';
import Chart from './pages/Chart';
import Setups from './pages/Setups';
import SetupDetail from './pages/SetupDetail';
import MultiTimeframe from './pages/MultiTimeframe';
import Backtest from './pages/Backtest';
import Strategies from './pages/Strategies';
import ModelStatus from './pages/ModelStatus';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/setups" element={<Setups />} />
          <Route path="/setups/:id" element={<SetupDetail />} />
          <Route path="/mtf" element={<MultiTimeframe />} />
          <Route path="/backtest" element={<Backtest />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/status" element={<ModelStatus />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
