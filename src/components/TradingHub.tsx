import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Shield, Play, RefreshCw, Sparkles, HelpCircle, Activity } from 'lucide-react';
import { TradingAsset } from '../types';
import { ActiveTradeMonitor } from './ActiveTradeMonitor';

interface TradingHubProps {
  onAskJarvis: (prompt: string) => void;
}

export const TradingHub: React.FC<TradingHubProps> = ({ onAskJarvis }) => {
  const [assets, setAssets] = useState<TradingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<TradingAsset | null>(null);

  // Lot Size Calculator State
  const [accountBalance, setAccountBalance] = useState('10000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('25');
  const [calculatedLotSize, setCalculatedLotSize] = useState('0.40');

  const dailyTradingQuestions = [
    { title: 'Market Trend', prompt: 'Jarvis, aaj market ka overall trend kya hai?' },
    { title: 'BTC Resistance & Support', prompt: 'Jarvis, BTC ka live resistance zone aur support kahan hai?' },
    { title: 'Gold (XAUUSD) Signal', prompt: 'Jarvis, Gold (XAUUSD) mein buy ka setup ban rha hai ya sell ka?' },
    { title: 'SMC Order Block', prompt: 'Jarvis, 15m timeframe par SMC order block aur FVG gap batao' },
    { title: 'Lot Size Advice', prompt: 'Jarvis, $500 balance par kitna lot size rakhun?' },
    { title: 'Active Trade Tracker', prompt: 'Jarvis, hamari active trade ka profit kitna hua hai?' },
    { title: 'PC & Connection Status', prompt: 'Jarvis, PC status aur system connection batao' },
  ];

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market');
      const data = await res.json();
      if (data.assets && data.assets.length > 0) {
        setAssets(data.assets);
        if (!selectedAsset) setSelectedAsset(data.assets[0]);
      }
    } catch (e) {
      console.warn('Failed to fetch live market feed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  useEffect(() => {
    // Calculate Lot Size formula: (Balance * (Risk / 100)) / (StopLossPips * 10)
    const bal = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const sl = parseFloat(stopLossPips) || 1;
    const riskAmount = bal * (risk / 100);
    const lotSize = riskAmount / (sl * 10);
    setCalculatedLotSize(lotSize.toFixed(2));
  }, [accountBalance, riskPercent, stopLossPips]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Trading & Live Market Terminal for Rao Ahsan Sir
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Technical Analysis, RSI/MACD Signals, Smart Money Concepts (SMC) & Risk Calculator
          </p>
        </div>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Prices
        </button>
      </div>

      {/* Daily Use Trading Quick Questions Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Rao Ahsan Sir's Daily Use Trading Questions (Click to Ask Jarvis Out Loud):
        </div>
        <div className="flex flex-wrap gap-2">
          {dailyTradingQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onAskJarvis(q.prompt)}
              className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-medium transition flex items-center gap-2 group"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
              <span>{q.prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-Time Active Trade Monitor with Recharts */}
      <ActiveTradeMonitor onAskJarvis={onAskJarvis} />

      {/* Grid: Watchlist & Asset Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Watchlist */}
        <div className="lg:col-span-1 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold font-display text-slate-200 uppercase tracking-wider text-xs">
              Live Assets Watchlist
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">REAL-TIME FEED</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {assets.map((asset) => {
              const isPositive = !asset.change.startsWith('-');
              const isSelected = selectedAsset?.symbol === asset.symbol;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold font-mono text-slate-100">{asset.symbol}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>RSI: {asset.rsi}</span>
                      <span>·</span>
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {asset.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-100">${asset.price}</div>
                    <div
                      className={`text-xs font-mono font-medium flex items-center justify-end gap-0.5 ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Analysis & Signal Generator */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAsset && (
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                    SMC TECHNICAL BREAKDOWN
                  </span>
                  <h3 className="text-2xl font-extrabold font-mono text-slate-100">
                    {selectedAsset.symbol} — ${selectedAsset.price}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    onAskJarvis(
                      `Jarvis, analyze ${selectedAsset.symbol} chart using Smart Money Concepts (SMC) for Rao Ahsan sir. Give me RSI, MACD analysis, Order Block entry, Stop Loss, and Take Profit targets.`
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Ask Jarvis for Voice Signal
                </button>
              </div>

              {/* Indicator Gauge Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono uppercase">RSI (14)</div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                    {selectedAsset.rsi}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedAsset.rsi > 70
                      ? 'Overbought Warning'
                      : selectedAsset.rsi < 30
                      ? 'Oversold Opportunity'
                      : 'Neutral Momentum'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono uppercase">MACD Signal</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                    {selectedAsset.macd}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Bullish Divergence</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-400 font-mono uppercase">SMC Structure</div>
                  <div className="text-sm font-bold text-cyan-400 mt-1">
                    {selectedAsset.sentiment}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Order Block & FVG Confluence</div>
                </div>
              </div>

              {/* Simulated Chart Visualizer */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>PRICE ACTION WAVE (H1)</span>
                  <span className="text-emerald-400">TREND: BULLISH CONSOLIDATION</span>
                </div>
                <div className="h-28 flex items-end gap-1.5 pt-4 px-2">
                  {[40, 55, 48, 65, 58, 75, 70, 88, 82, 95, 90, 100, 94, 110].map((h, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t transition-all duration-500 ${
                        idx % 2 === 0 ? 'bg-cyan-500/80' : 'bg-emerald-500/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Forex & Crypto Lot Size Risk Calculator */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 backdrop-blur-xl">
            <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2 uppercase tracking-wide">
              <Shield className="w-4 h-4 text-cyan-400" />
              Risk & Lot Size Calculator for Rao Ahsan Sir
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-mono">Account Balance ($)</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">Risk Per Trade (%)</label>
                <input
                  type="number"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-mono">Stop Loss (Pips/Points)</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between">
              <span className="text-xs text-slate-300">Recommended Position / Lot Size:</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {calculatedLotSize} Lots
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
