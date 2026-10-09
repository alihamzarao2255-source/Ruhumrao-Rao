import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechOptions {
  pitch?: number;
  rate?: number;
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Play WAV or MP3 audio from server base64 (Ultra-Realistic Gemini Neural Voice)
  const playAudioBase64 = useCallback((base64Data: string, mimeType = 'audio/wav', options?: SpeechOptions) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const audio = new Audio(`data:${mimeType};base64,${base64Data}`);
      audio.playbackRate = options?.rate || 0.98; // Smooth, polite, VIP rhythmic rate

      audio.onplay = () => {
        setIsSpeaking(true);
        if (options?.onStart) options.onStart();
      };

      audio.onended = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };

      currentAudioRef.current = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn('Base64 audio playback caught error:', e);
          setIsSpeaking(false);
          if (options?.onEnd) options.onEnd();
        });
      }
    } catch (err) {
      console.error('Audio play error:', err);
      setIsSpeaking(false);
      if (options?.onEnd) options.onEnd();
    }
  }, []);

  // Fallback Web Speech API with Polite, Soft, Rhythmic Speech Synthesis
  const speakText = useCallback((text: string, options?: SpeechOptions) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop current speech

      // Clean tags like [excitedly], [thoughtfully], [laughs], <calm> for browser synthesis
      const cleanedText = text
        .replace(/\[[^\]]*\]/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/\|[^|]*\|/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      // Soft, polite VIP rhythmic pitch and rate parameters
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.rate = options?.rate ?? 0.98;

      if (voices.length > 0) {
        // Prioritize natural warm voices: Google UK English Male, Google Natural, Microsoft Natural Online, Apple Siri Natural
        const premiumVoice =
          voices.find(
            (v) =>
              (v.name.toLowerCase().includes('natural') ||
                v.name.toLowerCase().includes('google uk english male') ||
                v.name.toLowerCase().includes('google us english') ||
                v.name.toLowerCase().includes('microsoft natural') ||
                v.name.toLowerCase().includes('siri')) &&
              (v.lang.startsWith('en') || v.lang.startsWith('ur') || v.lang.startsWith('hi'))
          ) ||
          voices.find((v) => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (premiumVoice) utterance.voice = premiumVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (options?.onStart) options.onStart();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      if (options?.onEnd) options.onEnd();
    }
  }, [voices]);

  const stopSpeech = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    voices,
    playAudioBase64,
    speakText,
    stopSpeech,
  };
}
