export type MonsterSkin = 'cyber_leviathan' | 'shadow_plasma' | 'neon_beast' | 'quantum_titan' | 'flame_demon';

export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'offline';

export type EmotionType = 'Joyful' | 'Curious' | 'Stressed' | 'Confident' | 'Focused' | 'Urgent' | 'Neutral' | 'Warm';

export type PersonalityProfile = 'Jarvis Prime' | 'Cyber Strategy Mentor' | 'Network Marketing Master' | 'Quantum AI Scientist' | 'Edgy Cyberpunk Rogue';

export type ThemeMode = 'cyber_dark' | 'obsidian_void' | 'matrix_green' | 'neon_gold' | 'royal_amethyst' | 'crimson_fury';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  emotion?: EmotionType;
  detectedLanguage?: string;
  quickActionData?: {
    type: string;
    title?: string;
    content?: string;
    metadata?: string;
  };
  groundingSources?: { title: string; uri: string }[];
}

export interface TradingAsset {
  symbol: string;
  price: string;
  change: string;
  sentiment: string;
  rsi: number;
  macd: string;
}

export interface NewsItem {
  category: string;
  title: string;
  source: string;
  time: string;
  summary?: string;
}

export interface UserMemoryItem {
  id: string;
  category: 'trading' | 'goal' | 'preference' | 'personal' | 'business';
  content: string;
  createdAt: string;
}

export interface AppSettings {
  personality: PersonalityProfile;
  monsterSkin: MonsterSkin;
  theme: ThemeMode;
  continuousListening: boolean;
  wakeWordEnabled: boolean;
  voicePitch: number;
  voiceRate: number;
  audioVisualizerSensitivity: number;
  ambientSoundscape: 'none' | 'cyber_lab' | 'space_drone' | 'rain' | 'synthwave';
  preferredLanguage: string;
}
