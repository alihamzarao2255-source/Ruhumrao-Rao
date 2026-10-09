import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Clock,
  Mic,
} from 'lucide-react';
import { JarvisHeader } from './components/JarvisHeader';
import { MonsterAvatar } from './components/MonsterAvatar';
import { VoiceControls } from './components/VoiceControls';
import { TradingHub } from './components/TradingHub';
import { DailyRoutineVault } from './components/DailyRoutineVault';
import { NewsFeed } from './components/NewsFeed';
import { NetworkMarketingHub } from './components/NetworkMarketingHub';
import { OnlineWorkDatabase } from './components/OnlineWorkDatabase';
import { MultilingualTranslator } from './components/MultilingualTranslator';
import { MemoryVault } from './components/MemoryVault';
import { SettingsModal } from './components/SettingsModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { synthesizeVocalEmotion } from './utils/emotionalVocalSynthesizer';
import {
  AppSettings,
  AssistantState,
  ChatMessage,
  EmotionType,
  UserMemoryItem,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('voice');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionType>('Warm');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Load Persisted Settings & Memory Vault
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('jarvis_settings');
      return saved
        ? JSON.parse(saved)
        : {
            personality: 'Jarvis Prime',
            monsterSkin: 'cyber_leviathan',
            theme: 'cyber_dark',
            continuousListening: true,
            wakeWordEnabled: true,
            voicePitch: 1.0,
            voiceRate: 1.0,
            audioVisualizerSensitivity: 1.2,
            ambientSoundscape: 'none',
            preferredLanguage: 'English',
          };
    } catch (e) {
      return {
        personality: 'Jarvis Prime',
        monsterSkin: 'cyber_leviathan',
        theme: 'cyber_dark',
        continuousListening: true,
        wakeWordEnabled: true,
        voicePitch: 1.0,
        voiceRate: 1.0,
        audioVisualizerSensitivity: 1.2,
        ambientSoundscape: 'none',
        preferredLanguage: 'English',
      };
    }
  });

  const [memories, setMemories] = useState<UserMemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarvis_memories');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              category: 'personal',
              content: 'User is Rao Ahsan sir. Address him exclusively as Rao Ahsan sir or Rao Ahsan Sir with maximum respect and loyalty.',
              createdAt: 'Initial Setup',
            },
            {
              id: '2',
              category: 'trading',
              content: 'Rao Ahsan sir actively trades BTC/USD, ETH/USD, SOL/USD, and XAUUSD (Gold).',
              createdAt: 'Initial Setup',
            },
          ];
    } catch (e) {
      return [];
    }
  });

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save Settings to LocalStorage
  useEffect(() => {
    localStorage.setItem('jarvis_settings', JSON.stringify(settings));
  }, [settings]);

  // Save Memories to LocalStorage
  useEffect(() => {
    localStorage.setItem('jarvis_memories', JSON.stringify(memories));
  }, [memories]);

  // Speech Synthesis
  const { isSpeaking, playAudioBase64, speakText, stopSpeech } = useSpeechSynthesis();

  // Speech Recognition Hook
  const handleSpeechResult = (transcriptText: string, isFinal: boolean) => {
    if (isFinal && transcriptText.trim().length > 1) {
      handleProcessCommand(transcriptText.trim());
    }
  };

  const {
    isListening,
    interimTranscript,
    isWakeWordActive,
    toggleListening,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onWakeWordDetected: () => {
      setAssistantState('listening');
    },
    continuousListening: settings.continuousListening,
    wakeWordEnabled: settings.wakeWordEnabled,
  });

  // Welcome Greeting on initial load
  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: 'greeting-1',
      sender: 'jarvis',
      text: 'Good day, Rao Ahsan sir! Jarvis is online, fully initialized, and dedicated to your service. Ask me any question on trading, crypto, business, freelancing, or translation!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'Warm',
    };
    setMessages([initialGreeting]);
  }, []);

  // Resume Speech Recognition after Jarvis finishes speaking
  const handleSpeechFinished = () => {
    setAssistantState('idle');
    if (settings.continuousListening) {
      setTimeout(() => {
        startListening();
      }, 400);
    }
  };

  // Core Processing Handler
  const handleProcessCommand = async (commandText: string) => {
    if (!commandText) return;

    // Pause mic while Jarvis processes & speaks
    stopListening();

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: commandText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setAssistantState('thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: commandText,
          conversationHistory: messages,
          userMemory: memories.map((m) => m.content),
          personality: settings.personality,
          isOffline: isOffline,
        }),
      });

      const data = await res.json();
      let replyText = data.replyText || `At your service, Rao Ahsan sir.`;
      const emotion = (data.emotionDetected as EmotionType) || 'Warm';
      setDetectedEmotion(emotion);

      // Save new memories if detected
      if (data.newMemories && data.newMemories.length > 0) {
        const newEntries: UserMemoryItem[] = data.newMemories.map((memStr: string, i: number) => ({
          id: `mem-${Date.now()}-${i}`,
          category: 'preference',
          content: memStr,
          createdAt: new Date().toLocaleDateString(),
        }));
        setMemories((prev) => [...prev, ...newEntries]);
      }

      // Add Jarvis reply to chat log
      const jarvisMsg: ChatMessage = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: emotion,
        detectedLanguage: data.detectedLanguage,
        quickActionData: data.quickActionData,
        groundingSources: data.groundingSources,
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      setAssistantState('speaking');

      // Synthesize Emotional Vocal Profile (higher pitch & rate for excitement, deeper & slower pacing for trading/serious updates)
      const vocalConfig = synthesizeVocalEmotion(emotion, settings.voicePitch, settings.voiceRate);

      // Attempt Gemini TTS or Fallback SpeechSynthesis
      try {
        const selectedVoice = settings.preferredLanguage || 'Puck';
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: replyText,
            voiceName: selectedVoice,
            stylePrompt: vocalConfig.stylePrompt,
          }),
        });

        if (ttsRes.ok) {
          const ttsData = await ttsRes.json();
          if (ttsData.audioBase64) {
            playAudioBase64(ttsData.audioBase64, ttsData.mimeType, {
              rate: vocalConfig.rate,
              onEnd: handleSpeechFinished,
            });
            return;
          }
        }
      } catch (e) {
        console.warn('Server TTS fallback active');
      }

      // Fallback Browser SpeechSynthesis with Emotional Vocal Synthesis
      speakText(replyText, {
        pitch: vocalConfig.pitch,
        rate: vocalConfig.rate,
        onEnd: handleSpeechFinished,
      });
    } catch (error) {
      console.error('Command processing exception:', error);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'jarvis',
        text: 'At your service, Rao Ahsan sir. I am logged on and standing by for your next command.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: 'Warm',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      handleSpeechFinished();
    }
  };

  const handleAddMemory = (content: string, category: UserMemoryItem['category']) => {
    const newItem: UserMemoryItem = {
      id: `mem-${Date.now()}`,
      category,
      content,
      createdAt: new Date().toLocaleDateString(),
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Get theme background class
  const getThemeClass = () => {
    switch (settings.theme) {
      case 'obsidian_void':
        return 'bg-[#030712] text-slate-100';
      case 'matrix_green':
        return 'bg-[#022c22] text-emerald-100';
      case 'neon_gold':
        return 'bg-[#1c120c] text-amber-100';
      case 'royal_amethyst':
        return 'bg-[#130f26] text-purple-100';
      case 'crimson_fury':
        return 'bg-[#1c080a] text-rose-100';
      case 'cyber_dark':
      default:
        return 'bg-[#080b11] text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${getThemeClass()}`}>
      {/* Header Bar */}
      <JarvisHeader
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOffline={isOffline}
      />

      {/* Main Container: Pure Uncluttered JARVIS Workspace */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-6">
        <div className="space-y-6">
          {/* Monster Avatar Visualizer */}
          <div className="flex flex-col items-center justify-center pt-2">
            <MonsterAvatar
              state={assistantState}
              skin={settings.monsterSkin}
              audioLevel={isSpeaking || isListening ? 0.7 : 0.05}
              emotion={detectedEmotion}
              onClick={toggleListening}
            />

            <div className="text-center mt-3 font-mono text-[11px] text-cyan-400 uppercase tracking-widest">
              JARVIS · {assistantState.toUpperCase()}
            </div>
          </div>

          {/* Voice Controls */}
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            isWakeWordActive={isWakeWordActive}
            continuousListening={settings.continuousListening}
            interimTranscript={interimTranscript}
            onToggleMic={toggleListening}
            onSendMessage={handleProcessCommand}
            onToggleContinuous={() =>
              setSettings((prev) => ({ ...prev, continuousListening: !prev.continuousListening }))
            }
            isOffline={isOffline}
          />

          {/* Conversation Log Stream */}
          <div className="w-full space-y-3 pt-2">
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition backdrop-blur-md ${
                    msg.sender === 'user'
                      ? 'bg-slate-900/90 border-slate-800 ml-6 sm:ml-12'
                      : 'bg-cyan-950/20 border-cyan-800/40 mr-6 sm:mr-12'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800/80 mb-1.5">
                    <span className="font-bold font-mono flex items-center gap-2 text-xs">
                      {msg.sender === 'user' ? (
                        <span className="text-slate-200">Rao Ahsan sir</span>
                      ) : (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" />
                          JARVIS
                        </span>
                      )}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">{msg.text}</p>

                  {/* Grounding Sources */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800 text-xs space-y-1">
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-mono text-cyan-300 hover:underline"
                          >
                            {src.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-4 px-6 mt-12 text-center text-xs text-slate-500">
        <p>Jarvis AI Voice Assistant · Dedicated Exclusively for Rao Ahsan Sir</p>
      </footer>
    </div>
  );
}
