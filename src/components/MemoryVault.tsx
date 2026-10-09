import React, { useState } from 'react';
import { Database, Plus, Trash2, Bookmark, CheckCircle2, Shield } from 'lucide-react';
import { UserMemoryItem } from '../types';

interface MemoryVaultProps {
  memories: UserMemoryItem[];
  onAddMemory: (content: string, category: UserMemoryItem['category']) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoryVault: React.FC<MemoryVaultProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [newContent, setNewContent] = useState('');
  const [category, setCategory] = useState<UserMemoryItem['category']>('trading');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent.trim()) {
      onAddMemory(newContent.trim(), category);
      setNewContent('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            Ahsan Sir's Memory Vault & Context Bank
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persisted memory entries automatically remembered by Jarvis across sessions
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
          {memories.length} ENTRIES SAVED
        </div>
      </div>

      {/* Manual Memory Addition Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 backdrop-blur-xl">
        <label className="text-xs font-mono text-slate-300 uppercase">
          Add Custom Memory / Goal / Preference for Ahsan sir
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 shrink-0"
          >
            <option value="trading">Trading</option>
            <option value="goal">Goal</option>
            <option value="preference">Preference</option>
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </select>

          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="e.g. Ahsan sir's target goal is 100k USD in trading by Q4..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />

          <button
            type="submit"
            disabled={!newContent.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Save Entry
          </button>
        </div>
      </form>

      {/* Memory Entries List */}
      <div className="space-y-3">
        {memories.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No custom memories saved yet, Ahsan sir.</p>
            <p className="text-xs text-slate-500">
              Jarvis automatically extracts key preferences during voice chat or you can add them above.
            </p>
          </div>
        ) : (
          memories.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition flex items-center justify-between gap-4 backdrop-blur-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono uppercase">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.createdAt}</span>
                </div>
                <p className="text-sm font-medium text-slate-100">{item.content}</p>
              </div>

              <button
                onClick={() => onDeleteMemory(item.id)}
                className="p-2 rounded-lg bg-slate-950 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 border border-slate-800 transition shrink-0"
                title="Delete memory entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
