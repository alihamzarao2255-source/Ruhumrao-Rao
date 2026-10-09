import React from 'react';
import { Bot, Settings, Wifi } from 'lucide-react';

interface JarvisHeaderProps {
  onOpenSettings: () => void;
  isOffline: boolean;
}

export const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  onOpenSettings,
  isOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080b11]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Brand Title: Pure JARVIS */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-extrabold font-mono tracking-widest text-slate-100 uppercase">
            JARVIS
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>ONLINE</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
