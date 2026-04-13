// Lightweight hover sound + haptic feedback utilities

const STORAGE_KEY = "sound-enabled";

let audioCtx: AudioContext | null = null;

/** Check if sound is enabled (defaults to true) */
export const isSoundEnabled = (): boolean => {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
};

/** Toggle sound on/off, returns new state */
export const toggleSound = (): boolean => {
  const next = !isSoundEnabled();
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {}
  return next;
};

/** Play a subtle click/pop sound using Web Audio API */
export const playClickSound = () => {
  if (!isSoundEnabled()) return;
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.06);
  } catch {
    // Silently fail if audio isn't supported
  }
};

/** Trigger a short haptic vibration on supported devices */
export const triggerHaptic = (ms = 10) => {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  } catch {
    // Silently fail
  }
};
