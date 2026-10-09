import React, { useRef, useEffect } from 'react';
import { AssistantState, MonsterSkin, EmotionType } from '../types';

interface MonsterAvatarProps {
  state: AssistantState;
  skin: MonsterSkin;
  audioLevel?: number; // 0 to 1
  emotion?: EmotionType;
  onClick?: () => void;
}

export const MonsterAvatar: React.FC<MonsterAvatarProps> = ({
  state,
  skin,
  audioLevel = 0,
  emotion = 'Warm',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const monsterImagePath = '/src/assets/images/jarvis_cyber_monster_1791178229667.jpg';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle array for monster aura
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number; life: number }> = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 220,
        y: (Math.random() - 0.5) * 220,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        life: Math.random() * 100,
      });
    }

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const effectiveAudio = Math.max(audioLevel * 1.8, state === 'speaking' ? 0.4 : 0.05);

      ctx.save();
      ctx.translate(centerX, centerY);

      // 1. Draw Soundwave Outer Rings
      for (let r = 1; r <= 3; r++) {
        const ringRadius = (110 + r * 25 + Math.sin(time * 3 + r) * 12) * (1 + effectiveAudio * 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = state === 'speaking' ? '#22d3ee' : state === 'listening' ? '#10b981' : '#818cf8';
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = Math.max(0, 0.5 - r * 0.12);
        ctx.setLineDash([12, 8]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 2. Draw Floating Particles around Monster
      particles.forEach((p) => {
        p.x += p.vx * (1 + effectiveAudio);
        p.y += p.vy * (1 + effectiveAudio);
        p.life += 1;

        if (p.x * p.x + p.y * p.y > 180 * 180 || p.life > 120) {
          p.x = (Math.random() - 0.5) * 100;
          p.y = (Math.random() - 0.5) * 100;
          p.life = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + effectiveAudio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.globalAlpha = p.alpha * Math.sin((p.life / 120) * Math.PI);
        ctx.fill();
      });

      // 3. Central Glowing Energy Core Overlay
      if (state === 'speaking' || state === 'thinking' || state === 'listening') {
        const coreRadius = 40 + Math.sin(time * 4) * 8 + effectiveAudio * 25;
        const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, coreRadius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.6)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, skin, audioLevel, emotion]);

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center justify-center cursor-pointer group select-none"
      title="Click to toggle Jarvis Hands-Free Voice Assistant"
    >
      {/* High-Fidelity Cyber Monster Picture Frame */}
      <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full p-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-2xl shadow-cyan-500/30 ring-4 ring-cyan-500/20 transition-transform duration-300 group-hover:scale-105 overflow-hidden">
        <img
          src={monsterImagePath}
          alt="Jarvis Cyber Monster Entity"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
            state === 'speaking'
              ? 'brightness-125 scale-105'
              : state === 'listening'
              ? 'brightness-110 saturate-125'
              : 'brightness-100'
          }`}
          onError={(e) => {
            // Fallback styled container if image fails
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Audio-Reactive Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* VIP State Badge */}
      <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-slate-900/90 border border-slate-700/80 text-cyan-300 shadow-xl backdrop-blur-md flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            state === 'speaking'
              ? 'bg-cyan-400 animate-ping'
              : state === 'listening'
              ? 'bg-emerald-400 animate-pulse'
              : state === 'thinking'
              ? 'bg-amber-400 animate-spin'
              : 'bg-slate-400'
          }`}
        />
        <span>JARVIS MONSTER: {state}</span>
      </div>
    </div>
  );
};
