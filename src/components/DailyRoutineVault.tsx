import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, Sparkles, TrendingUp, Cpu, Briefcase, HeartPulse, Volume2, ArrowLeft, ArrowRight, Shuffle, Code, DollarSign, Globe } from 'lucide-react';
import { generate15000Questions, BankQuestion } from '../utils/questionBank';

interface DailyRoutineVaultProps {
  onAskJarvis: (prompt: string) => void;
}

export const DailyRoutineVault: React.FC<DailyRoutineVaultProps> = ({ onAskJarvis }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  // Generate complete bank of 15,000+ deep questions
  const all15000Questions = useMemo(() => generate15000Questions(), []);

  // Filter logic
  const filteredQuestions = useMemo(() => {
    return all15000Questions.filter((q) => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [all15000Questions, selectedCategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Handle category change
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Pick random question from 15,000 bank
  const handleRandomAsk = () => {
    const randomIndex = Math.floor(Math.random() * all15000Questions.length);
    const randomQ = all15000Questions[randomIndex];
    if (randomQ) {
      onAskJarvis(randomQ.text);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Banner with 15,000 Badge */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            NEXUS PRIME KNOWLEDGE VAULT
          </div>
          <h2 className="text-2xl font-extrabold font-display text-slate-100 flex items-center gap-3">
            15,000+ Questions & Commands Vault
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow">
              {all15000Questions.length.toLocaleString()} LOADED
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            15,000+ distinct, deep-knowledge questions across SMC Trading, Code Engineering, High-Ticket Sales, Geopolitics, MLM & Life for Rao Ahsan Sir!
          </p>
        </div>

        <button
          onClick={handleRandomAsk}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition shrink-0"
        >
          <Shuffle className="w-4 h-4" />
          Ask Random Question from 15,000 Bank
        </button>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search 15,000+ questions (e.g. Wyckoff Spring, React 19, $10k closing, MLM script, Geopolitics, PC status)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills with Counters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Questions ({all15000Questions.length.toLocaleString()})
          </button>
          <button
            onClick={() => handleSelectCategory('trading_smc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'trading_smc'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            SMC Trading (~4,000)
          </button>
          <button
            onClick={() => handleSelectCategory('online_work_agency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'online_work_agency'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Agency & Freelancing (~3,500)
          </button>
          <button
            onClick={() => handleSelectCategory('mlm_closing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'mlm_closing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            MLM & Closing (~2,500)
          </button>
          <button
            onClick={() => handleSelectCategory('quantum_code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'quantum_code'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            Quantum Code (~2,000)
          </button>
          <button
            onClick={() => handleSelectCategory('sales_million')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'sales_million'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            High-Ticket Sales (~1,500)
          </button>
          <button
            onClick={() => handleSelectCategory('geopolitics_macro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
              selectedCategory === 'geopolitics_macro'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Geopolitics (~800)
          </button>
        </div>
      </div>

      {/* Showing Count & Pagination Info */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-mono">
        <span>
          Showing {paginatedQuestions.length} of {filteredQuestions.length.toLocaleString()} matching questions (Page {currentPage} of {totalPages})
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-200">{currentPage}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 disabled:opacity-40 transition"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Paginated Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {paginatedQuestions.map((q) => (
          <div
            key={q.id}
            onClick={() => onAskJarvis(q.text)}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-cyan-950/30 border border-slate-800/80 hover:border-cyan-500/50 transition cursor-pointer flex items-start justify-between gap-3 group shadow-sm hover:shadow-cyan-500/10"
          >
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  #{q.id} · {q.categoryLabel}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 leading-relaxed truncate">
                "{q.text}"
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 transition shrink-0 mt-1">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pagination Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400 font-mono">
          Rao Ahsan Sir Knowledge Vault · 15,000+ Active Questions
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 disabled:opacity-40 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 disabled:opacity-40 transition flex items-center gap-1"
          >
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
