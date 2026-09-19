/** Haptics and sound. Audio is synthesised with the Web Audio API, so there are no files to download. */

let audio: AudioContext | null = null;

function context(): AudioContext | null {
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audio ??= new Ctor();
  if (audio.state === 'suspended') void audio.resume();
  return audio;
}

function tone(ctx: AudioContext, freq: number, start: number, length: number, peak: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + length + 0.03);
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* not allowed in this context */
    }
  }
}

/** A soft wooden "bead" tick for every count. */
export function playTick() {
  const ctx = context();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 420, t, 0.09, 0.05);
  tone(ctx, 840, t, 0.05, 0.02);
}

/** A gentle three-note chime when a round is completed. */
export function playChime() {
  const ctx = context();
  if (!ctx) return;
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((f, i) => tone(ctx, f, t + i * 0.17, 1.2, 0.06));
}
