export interface EmotionalSpeechConfig {
  pitch: number;
  rate: number;
  stylePrompt: string;
  glowColor: string;
  avatarMood: 'excited' | 'serious' | 'calm' | 'focused' | 'alert';
}

/**
 * Emotional Vocal Synthesizer Wrapper
 * Dynamically modulates pitch, rate (cadence), and neural style prompt based on detected emotion.
 */
export const synthesizeVocalEmotion = (
  emotion: string = 'Neutral',
  basePitch: number = 1.0,
  baseRate: number = 1.0
): EmotionalSpeechConfig => {
  const normalized = emotion.toLowerCase().trim();

  // 1. Excitement / Joyful / High-Energy Success
  if (
    normalized.includes('excited') ||
    normalized.includes('joy') ||
    normalized.includes('profit') ||
    normalized.includes('celebrat') ||
    normalized.includes('urgent')
  ) {
    return {
      pitch: Math.min(1.25, basePitch * 1.15), // Higher pitch for excitement
      rate: Math.min(1.3, baseRate * 1.18),   // Faster cadence & energy
      stylePrompt:
        'Authentic Iron Man JARVIS AI voice speaking with high energy, upbeat excitement, vibrant cadence, addressing Rao Ahsan sir in fluent Roman Urdu.',
      glowColor: 'from-amber-400 via-cyan-400 to-emerald-400',
      avatarMood: 'excited',
    };
  }

  // 2. Serious Trading Updates / Market Risk / Deep Analysis
  if (
    normalized.includes('serious') ||
    normalized.includes('trading') ||
    normalized.includes('risk') ||
    normalized.includes('stressed') ||
    normalized.includes('analytical') ||
    normalized.includes('wyckoff') ||
    normalized.includes('smc')
  ) {
    return {
      pitch: Math.max(0.85, basePitch * 0.90), // Deeper, authoritative pitch
      rate: Math.max(0.82, baseRate * 0.88),   // Slower, deliberate pacing for serious updates
      stylePrompt:
        'Authentic Iron Man JARVIS AI voice speaking with deep, calm, deliberate, serious executive pacing for trading updates, addressing Rao Ahsan sir respectfully in Roman Urdu.',
      glowColor: 'from-cyan-500 via-blue-600 to-indigo-600',
      avatarMood: 'serious',
    };
  }

  // 3. Focused / Confident Strategy & Closing Scripts
  if (
    normalized.includes('confident') ||
    normalized.includes('focused') ||
    normalized.includes('strategy') ||
    normalized.includes('closing')
  ) {
    return {
      pitch: Math.max(0.92, basePitch * 0.98),
      rate: Math.min(1.1, baseRate * 1.02),
      stylePrompt:
        'Authentic Iron Man JARVIS AI voice speaking with focused confidence, crisp articulation, addressing Rao Ahsan sir in fluent Roman Urdu.',
      glowColor: 'from-purple-500 via-indigo-500 to-cyan-500',
      avatarMood: 'focused',
    };
  }

  // 4. Default Calm / Warm / Respectful VIP Tone
  return {
    pitch: basePitch * 1.0,
    rate: baseRate * 0.98,
    stylePrompt:
      'Authentic Iron Man JARVIS AI voice with British executive calm tone, smooth rhythm, addressing Rao Ahsan sir respectfully in fluent Roman Urdu.',
    glowColor: 'from-cyan-500 via-blue-500 to-teal-400',
    avatarMood: 'calm',
  };
};
