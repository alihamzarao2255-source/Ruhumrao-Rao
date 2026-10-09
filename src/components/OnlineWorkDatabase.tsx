import React, { useState } from 'react';
import { Briefcase, Code, FileText, Sparkles, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface OnlineWorkDatabaseProps {
  onAskJarvis: (prompt: string) => void;
}

export const OnlineWorkDatabase: React.FC<OnlineWorkDatabaseProps> = ({ onAskJarvis }) => {
  const [selectedJobType, setSelectedJobType] = useState('upwork');
  const [jobDescription, setJobDescription] = useState('');

  const workCategories = [
    {
      id: 'upwork',
      title: 'Upwork & Fiverr Freelancing',
      skills: 'Full Stack Web, AI Prompt Engineering, UI/UX Design, Video Editing, Mobile Apps',
      strategy: 'Focus on solving the client\'s primary bottleneck in line 1. Include a loom link or 2-sentence mini audit.',
    },
    {
      id: 'remote_tech',
      title: 'Global Remote Tech Jobs',
      skills: 'React/TypeScript, Python Backend, AI Systems, Cloud Engineering, DevOps',
      strategy: 'Optimize resume for ATS keyword scanning. Prepare STAR method answers for technical interviews.',
    },
    {
      id: 'content',
      title: 'Digital Content & Affiliate',
      skills: 'YouTube Automation, TikTok Shop, SEO Blogging, High-Ticket Affiliate Marketing',
      strategy: 'Focus on high-retention hook structures in the first 3 seconds and SEO optimized thumbnails.',
    },
  ];

  const handleGenerateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobDescription.trim()) {
      onAskJarvis(
        `Jarvis, generate a winning proposal draft for Ahsan sir for this job posting:\n"${jobDescription}"\nInclude a magnetic hook, proof of concept, and call to action.`
      );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Online Work & Digital Freelancing Database
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upwork & Fiverr Strategy, Remote Job Guidance & AI Proposal Generator for Ahsan sir
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedJobType(cat.id)}
            className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
              selectedJobType === cat.id
                ? 'bg-blue-500/10 border-blue-500/50 shadow-md'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                DIGITAL INCOME PATH
              </span>
              <h3 className="text-base font-bold text-slate-100">{cat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.skills}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300 italic">
              💡 {cat.strategy}
            </div>
          </div>
        ))}
      </div>

      {/* AI Proposal Generator Tool for Ahsan sir */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-blue-400" />
            AI Proposal & Gig Script Generator for Ahsan sir
          </h3>
          <span className="text-[10px] font-mono text-cyan-400">JARVIS WRITER v3.8</span>
        </div>

        <form onSubmit={handleGenerateProposal} className="space-y-3">
          <textarea
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the Upwork job post, Fiverr client request, or project description here..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
          />

          <button
            type="submit"
            disabled={!jobDescription.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Generate Pitch Proposal for Ahsan sir
          </button>
        </form>
      </div>
    </div>
  );
};
