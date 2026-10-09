import React, { useState } from 'react';
import { Mic, MicOff, Radio, Send, Sparkles } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isWakeWordActive: boolean;
  continuousListening: boolean;
  interimTranscript: string;
  onToggleMic: () => void;
  onSendMessage: (text: string) => void;
  onToggleContinuous: () => void;
  isOffline?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  continuousListening,
  interimTranscript,
  onToggleMic,
  onSendMessage,
  onToggleContinuous,
}) => {
  const [inputText, setInputText] = useState('');

  const quickVoicePrompts = [
    'Jarvis, BTC trade analysis',
    'Jarvis, PC status check',
    'Jarvis, active position profit',
    'Jarvis, Gold SMC signal',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Live Transcript Bar */}
      <div className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-center justify-between gap-3 shadow-inner backdrop-blur-md font-mono">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isSpeaking
                ? 'bg-cyan-400 animate-bounce'
                : isListening
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-400 uppercase">
            {isSpeaking
              ? 'SPEAKING...'
              : isListening
              ? 'LISTENING FOR RAO AHSAN SIR...'
              : 'JARVIS READY'}
          </span>
          {interimTranscript && (
            <span className="text-slate-200 italic font-sans text-xs border-l border-slate-700 pl-2">
              "{interimTranscript}"
            </span>
          )}
        </div>

        <button
          onClick={onToggleContinuous}
          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition flex items-center gap-1 ${
            continuousListening
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>HANDS-FREE {continuousListening ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Mic Button & Form */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
        <button
          onClick={onToggleMic}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shrink-0 ${
            isListening
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 ring-2 ring-cyan-400/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isListening ? (
            <>
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 text-cyan-400" />
              <span>Mic On</span>
            </>
          )}
        </button>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Command Jarvis..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Voice Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        {quickVoicePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] font-mono whitespace-nowrap hover:border-cyan-500/50 hover:text-cyan-300 transition"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
