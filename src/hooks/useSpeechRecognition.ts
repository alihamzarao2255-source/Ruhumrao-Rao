import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onWakeWordDetected?: () => void;
  continuousListening?: boolean;
  wakeWordEnabled?: boolean;
  language?: string;
}

export function useSpeechRecognition({
  onResult,
  onWakeWordDetected,
  continuousListening = true,
  wakeWordEnabled = true,
  language = 'en-US',
}: SpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [hasSupport, setHasSupport] = useState(true);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const shouldListenRef = useRef<boolean>(continuousListening);
  const lastSubmittedTextRef = useRef<string>('');

  useEffect(() => {
    shouldListenRef.current = continuousListening;
  }, [continuousListening]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      const combinedText = (finalSpeech + ' ' + currentInterim).trim();
      const lowerText = combinedText.toLowerCase();

      // Detect Wake Word ("jarvis", "hey jarvis", "yo jarvis")
      if (
        wakeWordEnabled &&
        (lowerText.includes('jarvis') || lowerText.includes('hey jarvis') || lowerText.includes('yo jarvis'))
      ) {
        setIsWakeWordActive(true);
        if (onWakeWordDetected) onWakeWordDetected();
      }

      setInterimTranscript(currentInterim || finalSpeech);

      // Handle Final Speech Result Immediately
      if (finalSpeech.trim().length > 1) {
        const textToSubmit = finalSpeech.trim();
        if (textToSubmit !== lastSubmittedTextRef.current) {
          lastSubmittedTextRef.current = textToSubmit;
          setInterimTranscript('');
          onResult(textToSubmit, true);
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          return;
        }
      }

      // Fast Silence Timeout (1200ms) for natural conversational pause
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (combinedText.trim().length > 1) {
        silenceTimerRef.current = setTimeout(() => {
          const textToSubmit = combinedText.trim();
          if (textToSubmit.length > 1 && textToSubmit !== lastSubmittedTextRef.current) {
            lastSubmittedTextRef.current = textToSubmit;
            setInterimTranscript('');
            onResult(textToSubmit, true);
          }
        }, 1200);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
        shouldListenRef.current = false;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto restart continuously if enabled
      if (shouldListenRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignore if already active
            }
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [language, wakeWordEnabled]);

  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Already running
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      // Ignore
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    interimTranscript,
    hasSupport,
    isWakeWordActive,
    startListening,
    stopListening,
    toggleListening,
  };
}
