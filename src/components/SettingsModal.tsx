import React from 'react';
import { X, Sliders, Palette, User, Volume2, Sparkles } from 'lucide-react';
import { AppSettings, MonsterSkin, PersonalityProfile, ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const personalities: { id: PersonalityProfile; label: string; desc: string }[] = [
    { id: 'Jarvis Prime', label: 'Jarvis Prime', desc: 'Warm, highly respectful, strategic, all-knowing assistant addressing Rao Ahsan sir.' },
    { id: 'Cyber Strategy Mentor', label: 'Cyber Strategy Mentor', desc: 'Direct, analytical financial & trading market expert.' },
    { id: 'Network Marketing Master', label: 'Network Marketing Master', desc: 'High-energy, master of objection handling & leadership scripts.' },
    { id: 'Quantum AI Scientist', label: 'Quantum AI Scientist', desc: 'Calm, articulate, high-level technical reasoning.' },
    { id: 'Edgy Cyberpunk Rogue', label: 'Edgy Cyberpunk Rogue', desc: 'Futuristic, ultra-fast, sharp & confident.' },
  ];

  const voicesList = [
    { id: 'Puck', label: 'Puck - Authentic JARVIS British Executive (Recommended)', desc: 'Calm, smooth, Paul Bettany style Iron Man JARVIS acoustic profile' },
    { id: 'Fenrir', label: 'Fenrir - Deep JARVIS Authority Male', desc: 'Powerful, confident, executive AI voice tone' },
    { id: 'Kore', label: 'Kore - Natural Warm Human Voice', desc: 'Smooth, friendly, highly expressive cadence' },
    { id: 'Aoede', label: 'Aoede - Smooth Conversational Voice', desc: 'Relaxed, natural, clear pronunciation' },
    { id: 'Charon', label: 'Charon - Calm Strategic Intelligence', desc: 'Analytical, deliberate, focused JARVIS intelligence' },
  ];

  const monsterSkins: { id: MonsterSkin; label: string; color: string }[] = [
    { id: 'cyber_leviathan', label: 'Cyber Leviathan', color: 'from-cyan-500 to-blue-600' },
    { id: 'shadow_plasma', label: 'Shadow Plasma', color: 'from-purple-500 to-indigo-600' },
    { id: 'neon_beast', label: 'Neon Beast', color: 'from-emerald-400 to-teal-600' },
    { id: 'quantum_titan', label: 'Quantum Titan', color: 'from-amber-400 to-orange-600' },
    { id: 'flame_demon', label: 'Flame Demon', color: 'from-rose-500 to-red-700' },
  ];

  const themes: { id: ThemeMode; label: string; bg: string }[] = [
    { id: 'cyber_dark', label: 'Cyber Dark', bg: 'bg-[#080b11]' },
    { id: 'obsidian_void', label: 'Obsidian Void', bg: 'bg-[#030712]' },
    { id: 'matrix_green', label: 'Matrix Green', bg: 'bg-[#022c22]' },
    { id: 'neon_gold', label: 'Neon Gold', bg: 'bg-[#2e1000]' },
    { id: 'royal_amethyst', label: 'Royal Amethyst', bg: 'bg-[#1e1b4b]' },
    { id: 'crimson_fury', label: 'Crimson Fury', bg: 'bg-[#2a080c]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-6 text-slate-100 no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-100">Jarvis Console for Rao Ahsan Sir</h2>
              <p className="text-xs text-slate-400">Tailor HD human voices, personality, monster skin & themes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ultra-Realistic Voice Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Ultra-Realistic HD Human Neural Voice
          </label>
          <div className="space-y-2">
            {voicesList.map((v) => (
              <div
                key={v.id}
                onClick={() => onUpdateSettings({ preferredLanguage: v.id })}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  settings.preferredLanguage === v.id || (!settings.preferredLanguage && v.id === 'Puck')
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold font-display flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{v.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{v.desc}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  HD NEURAL
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" />
            Jarvis Personality Profile
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {personalities.map((p) => (
              <div
                key={p.id}
                onClick={() => onUpdateSettings({ personality: p.id })}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  settings.personality === p.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    settings.personality === p.id ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-600'
                  }`}
                >
                  {settings.personality === p.id && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">{p.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monster Avatar Skin */}
        <div className="space-y-3">
          <label className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Monster Avatar Visual Skin
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {monsterSkins.map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ monsterSkin: s.id })}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition ${
                  settings.monsterSkin === s.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${s.color}`} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interface Color Theme */}
        <div className="space-y-3">
          <label className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
            Dashboard Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                  settings.theme === t.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border border-slate-600 ${t.bg}`} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Modulation Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>VOICE PITCH:</span>
              <span className="text-cyan-400">{settings.voicePitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.05}
              value={settings.voicePitch}
              onChange={(e) => onUpdateSettings({ voicePitch: parseFloat(e.target.value) })}
              className="w-full mt-2 accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>SPEECH SPEED RATE:</span>
              <span className="text-cyan-400">{settings.voiceRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.5}
              step={0.05}
              value={settings.voiceRate}
              onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })}
              className="w-full mt-2 accent-cyan-400"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition shadow-lg"
        >
          Save & Apply Settings for Rao Ahsan Sir
        </button>
      </div>
    </div>
  );
};
