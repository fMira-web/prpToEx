export type TimerMode = 'focus' | 'short' | 'long';

export const TIMER_MODES: Record<TimerMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export const TIMER_LABELS: Record<TimerMode, string> = {
  focus: 'Focus session',
  short: 'Short break',
  long: 'Long break',
};

export const RING_CIRC = 2 * Math.PI * 88;

/** Three-note completion chime, synthesised with WebAudio — ported 1:1. */
export function beep(): void {
  try {
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    [0, 0.16, 0.32].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = i === 2 ? 1046.5 : 784;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch {
    /* ignore — audio isn't essential */
  }
}
