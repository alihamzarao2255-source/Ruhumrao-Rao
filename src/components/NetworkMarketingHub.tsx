import React, { useState } from 'react';
import { Share2, Users, MessageSquare, Play, HelpCircle, Target, Award, ArrowRight } from 'lucide-react';

interface NetworkMarketingHubProps {
  onAskJarvis: (prompt: string) => void;
}

export const NetworkMarketingHub: React.FC<NetworkMarketingHubProps> = ({ onAskJarvis }) => {
  const [selectedCategory, setSelectedCategory] = useState<'scripts' | 'objections' | 'calculator'>('scripts');

  // Calculator state
  const [teamMembers, setTeamMembers] = useState('10');
  const [avgVolume, setAvgVolume] = useState('100');
  const [commissionRate, setCommissionRate] = useState('8');

  const calcMonthlyIncome = () => {
    const members = parseInt(teamMembers) || 0;
    const vol = parseFloat(avgVolume) || 0;
    const rate = parseFloat(commissionRate) || 0;
    return (members * vol * (rate / 100)).toFixed(2);
  };

  const scripts = [
    {
      title: 'Warm Market Invitation Script',
      scenario: 'Calling a friend or relative to invite them to inspect an opportunity',
      script:
        '"Hey [Name], I know you\'re super busy, but I just partnered with a high-growth project and thought of you immediately because of your strong drive. I can\'t explain everything in 30 seconds over the phone, but are you free tomorrow at 7 PM for a 15-minute overview?"',
    },
    {
      title: 'Cold Outreach Social Media Script',
      scenario: 'Connecting with ambitious professionals on LinkedIn/Instagram',
      script:
        '"Hi [Name], I noticed your background in leadership and digital business. We are expanding our network in your region and looking for 2 sharp partners. Are you open to taking a look at a side revenue stream if it doesn\'t interfere with what you\'re currently doing?"',
    },
    {
      title: 'Follow-Up & Closing Script',
      scenario: 'After a prospect watches the presentation or attends a webinar',
      script:
        '"Hey [Name], based on what you saw in the presentation, what did you like BEST—the income potential, the products, or the team leadership? ... Perfect! On a scale of 1 to 10, where 1 is not interested and 10 is ready to get started today, where do you stand?"',
    },
  ];

  const objections = [
    {
      query: '"Is this a Pyramid Scheme or MLM?"',
      formula: 'Feel-Felt-Found Method',
      response:
        '"I completely understand why you ask that, Ahsan sir. In fact, I felt the exact same way when I first saw it. But what I found is that pyramid schemes have no real products and are illegal. Here, commissions are strictly earned on genuine product/service volume, exactly like traditional franchise distribution."',
    },
    {
      query: '"I don\'t have money to get started."',
      formula: 'Problem-Solving Switch',
      response:
        '"I respect your honesty. But let me ask you: if staying where you are keeps money tight 6 months from now, isn\'t that the exact reason why you NEED to build a new stream of income? Let\'s look at how we can get you started with a mini starter kit."',
    },
    {
      query: '"I don\'t have time for this."',
      formula: 'Leverage Explanation',
      response:
        '"That\'s actually why most leaders join! You don\'t need 40 hours a week—just 5 to 7 focused hours using our system. As your team grows, you leverage team hours, giving you back time freedom."',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Network Marketing & Leadership Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proven Prospecting Scripts, Objection Handling Masterclass & Team Duplication Models for Ahsan sir
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedCategory('scripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === 'scripts' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Scripts
          </button>
          <button
            onClick={() => setSelectedCategory('objections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === 'objections' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Objections
          </button>
          <button
            onClick={() => setSelectedCategory('calculator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedCategory === 'calculator' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Income Calc
          </button>
        </div>
      </div>

      {/* Category: Prospecting Scripts */}
      {selectedCategory === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider">
              Battle-Tested Prospecting Scripts
            </h3>
            <span className="text-xs text-purple-400 font-mono">3 CORE SCRIPTS READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scripts.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between backdrop-blur-xl"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                    {item.scenario}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {item.script}
                  </p>
                </div>

                <button
                  onClick={() =>
                    onAskJarvis(
                      `Jarvis, roleplay this network marketing script with Ahsan sir: "${item.title}". Speak out the dialogue and guide me on tone and delivery.`
                    )
                  }
                  className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  Roleplay with Jarvis
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category: Objection Handling */}
      {selectedCategory === 'objections' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-slate-200 uppercase tracking-wider">
              Prospect Objection Crusher
            </h3>
            <span className="text-xs text-purple-400 font-mono">FEEL-FELT-FOUND METHOD</span>
          </div>

          <div className="space-y-4">
            {objections.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Objection: {item.query}
                  </h4>
                  <span className="text-[10px] font-mono text-purple-400">{item.formula}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {item.response}
                </div>

                <button
                  onClick={() =>
                    onAskJarvis(
                      `Jarvis, help Ahsan sir handle this objection: ${item.query}. Give me 2 alternative variations for phone and face-to-face pitch.`
                    )
                  }
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition"
                >
                  <span>Ask Jarvis for Custom Objection Response</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category: Team Volume Calculator */}
      {selectedCategory === 'calculator' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 backdrop-blur-xl">
          <h3 className="text-sm font-bold font-display text-slate-100 flex items-center gap-2 uppercase tracking-wide">
            <Target className="w-4 h-4 text-purple-400" />
            Team Duplication & Commission Forecast for Ahsan sir
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-mono">Active Team Size</label>
              <input
                type="number"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono">Avg Monthly Sales Volume ($)</label>
              <input
                type="number"
                value={avgVolume}
                onChange={(e) => setAvgVolume(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-mono">Average Unilevel / Residual (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
            <span className="text-xs text-slate-300">Projected Monthly Residual Income:</span>
            <span className="text-2xl font-bold font-mono text-purple-400">
              ${calcMonthlyIncome()} / month
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
