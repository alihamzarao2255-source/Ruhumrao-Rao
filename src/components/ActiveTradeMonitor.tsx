import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, ShieldCheck, DollarSign, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface TradePosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  lotSize: number;
  pnl: number;
  pnlPercent: number;
  sl: number;
  tp: number;
  status: string;
}

interface ActiveTradeMonitorProps {
  onAskJarvis: (prompt: string) => void;
}

export const ActiveTradeMonitor: React.FC<ActiveTradeMonitorProps> = ({ onAskJarvis }) => {
  const [positions, setPositions] = useState<TradePosition[]>([
    {
      id: 'pos-1',
      symbol: 'BTC/USD',
      type: 'BUY',
      entryPrice: 91800,
      currentPrice: 92450,
      lotSize: 1.5,
      pnl: 975,
      pnlPercent: 1.06,
      sl: 91800,
      tp: 94800,
      status: 'SL Shifted Breakeven',
    },
    {
      id: 'pos-2',
      symbol: 'XAUUSD (Gold)',
      type: 'BUY',
      entryPrice: 2670.0,
      currentPrice: 2685.4,
      lotSize: 2.0,
      pnl: 3080,
      pnlPercent: 0.58,
      sl: 2662.0,
      tp: 2710.0,
      status: 'Targeting TP1',
    },
    {
      id: 'pos-3',
      symbol: 'SOL/USD',
      type: 'BUY',
      entryPrice: 202.5,
      currentPrice: 214.5,
      lotSize: 50.0,
      pnl: 600,
      pnlPercent: 5.92,
      sl: 198.0,
      tp: 225.0,
      status: 'Strong Momentum',
    },
  ]);

  // Live equity chart history state for Recharts
  const [equityData, setEquityData] = useState([
    { time: '10:00 AM', equity: 10000, pnl: 0 },
    { time: '11:00 AM', equity: 10850, pnl: 850 },
    { time: '12:00 PM', equity: 11620, pnl: 1620 },
    { time: '01:00 PM', equity: 12400, pnl: 2400 },
    { time: '02:00 PM', equity: 13150, pnl: 3150 },
    { time: '03:00 PM', equity: 14655, pnl: 4655 },
  ]);

  // Simulate real-time price fluctuation for live feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          const delta = (Math.random() - 0.48) * (pos.currentPrice * 0.001);
          const newPrice = Math.round((pos.currentPrice + delta) * 100) / 100;
          const diff = newPrice - pos.entryPrice;
          const newPnl = Math.round(diff * pos.lotSize * 10);
          const newPnlPct = Math.round((diff / pos.entryPrice) * 10000) / 100;
          return {
            ...pos,
            currentPrice: newPrice,
            pnl: newPnl,
            pnlPercent: newPnlPct,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalPnL = positions.reduce((acc, curr) => acc + curr.pnl, 0);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-display text-slate-100">Active Trade Monitor</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                LIVE REAL-TIME FEED
              </span>
            </div>
            <p className="text-xs text-slate-400">Rao Ahsan Sir's Live Open Positions & Floating PnL</p>
          </div>
        </div>

        {/* Total Live PnL Badge */}
        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase">Total Floating PnL:</span>
          <span className={`text-lg font-extrabold font-mono ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? `+$${totalPnL.toLocaleString()}` : `-$${Math.abs(totalPnL).toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Live Recharts Equity Curve Chart */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            EQUITY GROWTH CURVE (RECHARTS REAL-TIME)
          </span>
          <span className="text-emerald-400">PORTFOLIO PROFIT: +46.55%</span>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Area type="monotone" dataKey="equity" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#equityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Open Positions List */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Current Open Orders ({positions.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {positions.map((pos) => {
            const isProfit = pos.pnl >= 0;
            return (
              <div
                key={pos.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {pos.type}
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-100">{pos.symbol}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{pos.lotSize} Lots</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">ENTRY PRICE</span>
                    <span className="text-slate-200 font-bold">${pos.entryPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">LIVE PRICE</span>
                    <span className="text-cyan-400 font-bold">${pos.currentPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">STOP LOSS</span>
                    <span className="text-slate-400">${pos.sl.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">TAKE PROFIT</span>
                    <span className="text-emerald-400 font-bold">${pos.tp.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    {pos.status}
                  </span>
                  <span className={`text-sm font-extrabold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? `+$${pos.pnl}` : `-$${Math.abs(pos.pnl)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Trigger Button */}
      <button
        onClick={() =>
          onAskJarvis('NEXUS PRIME, hamari active trades ka current floating profit kitna chal raha hai aur target kahan tak hai?')
        }
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
      >
        <Sparkles className="w-4 h-4" />
        Ask NEXUS PRIME Voice Update on Active Trades
      </button>
    </div>
  );
};
