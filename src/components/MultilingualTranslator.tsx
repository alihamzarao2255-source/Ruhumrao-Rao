import React, { useState } from 'react';
import { Languages, Volume2, ArrowRightLeft, Sparkles, Copy, Check } from 'lucide-react';

interface MultilingualTranslatorProps {
  onSpeakText: (text: string) => void;
}

export const MultilingualTranslator: React.FC<MultilingualTranslatorProps> = ({ onSpeakText }) => {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Urdu');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = ['Urdu', 'Roman Urdu', 'Hindi', 'Arabic', 'Spanish', 'French', 'German', 'Turkish', 'Chinese', 'English'];

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLanguage }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText || '');
    } catch (err) {
      console.warn('Translation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Languages className="w-5 h-5 text-indigo-400" />
            Real-Time Multilingual Translator for Ahsan sir
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Bridge communication effortlessly between Urdu, English, Roman Urdu, Arabic, Hindi & 5+ languages
          </p>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          TARGET LANGUAGE:
        </span>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Text Input */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">Input Text / Speech</label>
            <textarea
              rows={5}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter or speak text to translate for Ahsan sir..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading || !sourceText.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Translating...' : 'Translate Now'}
          </button>
        </div>

        {/* Translation Output */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-indigo-400 uppercase">
                Translated ({targetLanguage})
              </label>
              {translatedText && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <div className="w-full min-h-[135px] p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 leading-relaxed font-sans">
              {translatedText || <span className="text-slate-500 italic">Translation output will appear here...</span>}
            </div>
          </div>

          {translatedText && (
            <button
              onClick={() => onSpeakText(translatedText)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Volume2 className="w-4 h-4" />
              Speak Translation Aloud
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
