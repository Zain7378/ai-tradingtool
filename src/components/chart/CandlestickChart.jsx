import React, { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  createSeriesMarkers,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import { useApp } from '../../context/AppContext';
import './CandlestickChart.css';

const ZONE_COLORS = {
  FVG: {
    bullish: { border: '#059669', label: 'Bullish FVG' },
    bearish: { border: '#dc2626', label: 'Bearish FVG' },
  },
  OrderBlock: {
    bullish: { border: '#2563eb', label: 'Bullish OB' },
    bearish: { border: '#7c3aed', label: 'Bearish OB' },
  },
  SupplyZone: {
    bearish: { border: '#dc2626', label: 'Supply Zone' },
  },
  DemandZone: {
    bullish: { border: '#059669', label: 'Demand Zone' },
  },
};

export default function CandlestickChart({
  candles = [],
  zones = [],
  structure = null,
  setups = [],
  overlays = { fvg: true, orderBlocks: true, supplyDemand: true, structure: true, setups: true },
  onSetupClick,
  height = 480,
}) {
  const { state } = useApp();
  const isLight = state?.theme !== 'dark';

  const isLightRef       = useRef(isLight);
  const containerRef     = useRef(null);
  const chartRef         = useRef(null);
  const seriesRef        = useRef(null);
  const markersPluginRef = useRef(null);
  const priceLinesRef    = useRef([]);
  const onSetupClickRef  = useRef(onSetupClick);
  const setupsRef        = useRef(setups);

  useEffect(() => {
    isLightRef.current = isLight;
  });

  useEffect(() => {
    onSetupClickRef.current = onSetupClick;
    setupsRef.current       = setups;
  }, [onSetupClick, setups]);

  // ── Initialize chart ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const light = isLightRef.current;

    const chart = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: light ? '#ffffff' : '#131926' },
        textColor:  light ? '#64748b' : '#94a3b8',
        fontSize:   11,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      },
      grid: {
        vertLines:  { color: light ? '#f1f5f9' : '#1c2436', style: LineStyle.Dotted },
        horzLines:  { color: light ? '#f1f5f9' : '#1c2436', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: light ? '#cbd5e1' : '#344463',
          style: LineStyle.Dashed,
          labelBackgroundColor: light ? '#0f172a' : '#1a2336',
        },
        horzLine: {
          color: light ? '#cbd5e1' : '#344463',
          style: LineStyle.Dashed,
          labelBackgroundColor: light ? '#0f172a' : '#1a2336',
        },
      },
      rightPriceScale: {
        borderColor: light ? '#e2e8f0' : '#222d42',
        textColor:   light ? '#64748b' : '#94a3b8',
      },
      timeScale: {
        borderColor:    light ? '#e2e8f0' : '#222d42',
        timeVisible:    true,
        secondsVisible: false,
        fixLeftEdge:    false,
        fixRightEdge:   false,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor:         light ? '#059669' : '#10b981',
      downColor:       light ? '#dc2626' : '#f43f5e',
      borderUpColor:   light ? '#059669' : '#10b981',
      borderDownColor: light ? '#dc2626' : '#f43f5e',
      wickUpColor:     light ? '#059669' : '#10b981',
      wickDownColor:   light ? '#dc2626' : '#f43f5e',
    });

    chartRef.current  = chart;
    seriesRef.current = series;

    // Handle clicks on chart to select nearest setup
    chart.subscribeClick((param) => {
      if (!param || !param.time || !onSetupClickRef.current) return;
      const targetTime = Number(param.time);
      const hit = setupsRef.current.find(s =>
        s.chartAnchorTime && Math.abs(s.chartAnchorTime - targetTime) <= 14400
      );
      if (hit) {
        onSetupClickRef.current(hit.id);
      }
    });

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (markersPluginRef.current) {
        try { markersPluginRef.current.detach(); } catch {}
        markersPluginRef.current = null;
      }
      chart.remove();
      chartRef.current  = null;
      seriesRef.current = null;
    };
  }, [height]);

  // ── Dynamically update theme options when state.theme toggles ───────────────
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    chartRef.current.applyOptions({
      layout: {
        background: { color: isLight ? '#ffffff' : '#131926' },
        textColor:  isLight ? '#64748b' : '#94a3b8',
      },
      grid: {
        vertLines: { color: isLight ? '#f1f5f9' : '#1c2436' },
        horzLines: { color: isLight ? '#f1f5f9' : '#1c2436' },
      },
      rightPriceScale: {
        borderColor: isLight ? '#e2e8f0' : '#222d42',
        textColor:   isLight ? '#64748b' : '#94a3b8',
      },
      timeScale: {
        borderColor: isLight ? '#e2e8f0' : '#222d42',
      },
    });

    seriesRef.current.applyOptions({
      upColor:         isLight ? '#059669' : '#10b981',
      downColor:       isLight ? '#dc2626' : '#f43f5e',
      borderUpColor:   isLight ? '#059669' : '#10b981',
      borderDownColor: isLight ? '#dc2626' : '#f43f5e',
      wickUpColor:     isLight ? '#059669' : '#10b981',
      wickDownColor:   isLight ? '#dc2626' : '#f43f5e',
    });
  }, [isLight]);

  // ── Update candle data ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !candles.length) return;
    const sorted = [...candles].sort((a, b) => a.time - b.time);
    seriesRef.current.setData(sorted);
    chartRef.current.timeScale().fitContent();
  }, [candles]);

  // ── Draw zones and trade level lines ───────────────────────────────────────
  useEffect(() => {
    if (!seriesRef.current) return;

    // Clear previous price lines
    priceLinesRef.current.forEach(pl => {
      try { seriesRef.current.removePriceLine(pl); } catch {}
    });
    priceLinesRef.current = [];

    const newLines = [];

    // 1. Zone lines (FVGs, Order Blocks, Supply/Demand)
    if (overlays.fvg || overlays.orderBlocks || overlays.supplyDemand) {
      zones.forEach(zone => {
        const showFVG = overlays.fvg && zone.type === 'FVG';
        const showOB  = overlays.orderBlocks && zone.type === 'OrderBlock';
        const showSDZ = overlays.supplyDemand && (zone.type === 'SupplyZone' || zone.type === 'DemandZone');

        if (!showFVG && !showOB && !showSDZ) return;

        const info = ZONE_COLORS[zone.type]?.[zone.direction];
        if (!info) return;

        const color = info.border;
        const statusLabel = zone.status === 'fresh' ? 'Fresh' : zone.status === 'partly_mitigated' ? 'Partly Mit.' : 'Mitigated';

        const topLine = seriesRef.current.createPriceLine({
          price: zone.top,
          color,
          lineWidth: 1,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: `${info.label} Top`,
        });

        const botLine = seriesRef.current.createPriceLine({
          price: zone.bottom,
          color,
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: `${info.label} Btm (${statusLabel})`,
        });

        newLines.push(topLine, botLine);
      });
    }

    // 2. Setup Trade Level Lines (Entry / Stop / Target)
    if (overlays.setups && setups.length > 0) {
      setups.forEach(setup => {
        if (setup.entry) {
          const entryLine = seriesRef.current.createPriceLine({
            price: setup.entry,
            color: '#2563eb',
            lineWidth: 2,
            lineStyle: LineStyle.Dotted,
            axisLabelVisible: true,
            title: `ENTRY (${setup.strategy})`,
          });
          newLines.push(entryLine);
        }

        if (setup.target) {
          const targetLine = seriesRef.current.createPriceLine({
            price: setup.target,
            color: '#059669',
            lineWidth: 2,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title: `TARGET (+${setup.riskReward}R)`,
          });
          newLines.push(targetLine);
        }

        if (setup.stop) {
          const stopLine = seriesRef.current.createPriceLine({
            price: setup.stop,
            color: '#dc2626',
            lineWidth: 2,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title: `STOP (-1R)`,
          });
          newLines.push(stopLine);
        }
      });
    }

    priceLinesRef.current = newLines;
  }, [zones, setups, overlays]);

  // ── Draw structure and setup markers ───────────────────────────────────────
  useEffect(() => {
    if (!seriesRef.current) return;

    const markers = [];

    // 1. Structure: Swing Highs / Swing Lows / BOS / CHoCH
    if (overlays.structure && structure) {
      structure.swingHighs?.forEach(sh => {
        markers.push({
          time:     sh.time,
          position: 'aboveBar',
          color:    isLight ? '#64748b' : '#94a3b8',
          shape:    'arrowDown',
          text:     'SH',
          size:     1,
        });
      });

      structure.swingLows?.forEach(sl => {
        markers.push({
          time:     sl.time,
          position: 'belowBar',
          color:    isLight ? '#64748b' : '#94a3b8',
          shape:    'arrowUp',
          text:     'SL',
          size:     1,
        });
      });

      structure.bosEvents?.forEach(ev => {
        markers.push({
          time:     ev.time,
          position: ev.direction === 'bullish' ? 'belowBar' : 'aboveBar',
          color:    ev.direction === 'bullish' ? '#2563eb' : '#7c3aed',
          shape:    ev.direction === 'bullish' ? 'arrowUp' : 'arrowDown',
          text:     'BOS',
          size:     1,
        });
      });

      structure.chochEvents?.forEach(ev => {
        markers.push({
          time:     ev.time,
          position: ev.direction === 'bullish' ? 'belowBar' : 'aboveBar',
          color:    '#d97706',
          shape:    ev.direction === 'bullish' ? 'arrowUp' : 'arrowDown',
          text:     'CHoCH',
          size:     1,
        });
      });
    }

    // 2. Setup markers with win probabilities
    if (overlays.setups && setups.length) {
      setups.forEach(setup => {
        if (setup.state === 'invalidated' || setup.state === 'expired') return;
        markers.push({
          time:     setup.chartAnchorTime || setup.detectedAt,
          position: setup.direction === 'bullish' ? 'belowBar' : 'aboveBar',
          color:    setup.direction === 'bullish' ? '#059669' : '#dc2626',
          shape:    setup.direction === 'bullish' ? 'arrowUp' : 'arrowDown',
          text:     `${setup.strategy} · ${Math.round(setup.probability * 100)}%`,
          size:     2,
          id:       setup.id,
        });
      });
    }

    const sorted = [...markers].sort((a, b) => a.time - b.time);

    // Apply markers via lightweight-charts v5 createSeriesMarkers plugin API
    if (!markersPluginRef.current) {
      markersPluginRef.current = createSeriesMarkers(seriesRef.current, sorted);
    } else {
      markersPluginRef.current.setMarkers(sorted);
    }
  }, [structure, setups, overlays, isLight]);

  return (
    <div className="chart-wrapper">
      <div ref={containerRef} className="chart-container" />
    </div>
  );
}
