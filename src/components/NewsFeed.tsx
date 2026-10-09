import React, { useState, useEffect } from 'react';
import { Newspaper, Globe, Sparkles, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsFeedProps {
  onAskJarvis: (prompt: string) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onAskJarvis }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.news && data.news.length > 0) {
        setNews(data.news);
      }
    } catch (e) {
      console.warn('Failed to fetch news:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onAskJarvis(`Jarvis, search for live news and breaking updates about: "${searchQuery}" for Ahsan sir.`);
      setSearchQuery('');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            Live News & Web Grounding Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Search Grounding for Crypto, AI Tech, Global Finance & Remote Work
          </p>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Grounded Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search live news on any topic (e.g. Bitcoin ETF, AI models, Forex rates)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Search Live
        </button>
      </form>

      {/* News Stream List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 backdrop-blur-xl group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                  {item.category}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{item.time}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition leading-snug">
                {item.title}
              </h3>
              {item.summary && <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">{item.source}</span>
              <button
                onClick={() =>
                  onAskJarvis(
                    `Jarvis, brief Ahsan sir on this news item: "${item.title}". What are the key takeaways and market impacts?`
                  )
                }
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition"
              >
                <span>Read Aloud</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
