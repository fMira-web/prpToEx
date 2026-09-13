import type { ListeningSegment } from './types';

/**
 * Text-to-speech helpers — ported 1:1 from the Listening exercise's
 * "Text-to-speech" section. `ttsToken` stays module-level (not per
 * component) exactly like the legacy global: only one exercise runner is
 * ever mounted at a time (it's a fullscreen modal), so there is never more
 * than one speech chain in flight, and a stale chain from a just-closed
 * exercise must still be able to recognise it's superseded.
 */
let ttsToken = 0;

export function primeVoices(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {};
}

function pickVoice(hint?: string): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const exact = voices.filter((v) => v.lang === hint);
  if (exact.length) return exact[0];
  const lang = voices.filter((v) => v.lang && v.lang.indexOf('en') === 0);
  return lang.length ? lang[0] : null;
}

/** Bumps the shared token, invalidating any in-flight speakSegments chain. */
export function stopSpeaking(): void {
  ttsToken++;
  try {
    window.speechSynthesis && window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

export function speakSegments(segments: ListeningSegment[], hint: string | undefined, onDone?: () => void): void {
  if (!('speechSynthesis' in window)) {
    onDone?.();
    return;
  }
  window.speechSynthesis.cancel();
  // Note: calling cancel() above interrupts whatever utterance is currently
  // speaking, which fires that utterance's onerror (not onend) in most
  // browsers. Since onerror is also wired to next(), a naive chain would
  // treat "interrupted" the same as "finished" and immediately speak the
  // NEXT segment — so closing the exercise mid-playback used to just skip
  // ahead instead of stopping. The token check below fixes this: every call
  // here bumps the shared counter, so a chain started before the bump can
  // recognise it's stale and stop instead of queuing the next segment.
  const myToken = ++ttsToken;
  let i = 0;
  function next() {
    if (myToken !== ttsToken) return; // superseded by a stop/replay — do not speak any more
    if (i >= segments.length) {
      onDone?.();
      return;
    }
    const seg = segments[i++];
    const u = new SpeechSynthesisUtterance(seg.text);
    u.lang = hint || 'en-GB';
    u.rate = 0.98;
    const v = pickVoice(u.lang);
    if (v) u.voice = v;
    u.onend = next;
    u.onerror = next;
    window.speechSynthesis.speak(u);
  }
  next();
}
