/**
 * localStorage/sessionStorage helpers — ported 1:1 from the legacy app.js
 * STORAGE section. Every key name is unchanged so that anyone who already
 * has progress saved from the static site (or the strangler-fig Next.js
 * drop) keeps it after this port.
 */

export const STORAGE_KEY = 'ielts-roadmap-progress-v1';
export const POMO_PREFIX = 'ielts-roadmap-pomo-';

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, val: string): void {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* ignore quota/availability errors, same as legacy app.js */
  }
}

export function loadProgress(): Set<number> {
  try {
    const raw = safeGet(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(completed: Set<number>): void {
  safeSet(STORAGE_KEY, JSON.stringify(Array.from(completed)));
}

export function todayKey(): string {
  return POMO_PREFIX + new Date().toDateString();
}

export function loadPomoCount(): number {
  const v = safeGet(todayKey());
  return v ? parseInt(v, 10) || 0 : 0;
}

export function savePomoCount(n: number): void {
  safeSet(todayKey(), String(n));
}

export function collectAllPomoEntries(): Record<string, number> {
  const out: Record<string, number> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(POMO_PREFIX) === 0) {
        const v = parseInt(localStorage.getItem(k) || '', 10);
        if (!isNaN(v)) out[k.slice(POMO_PREFIX.length)] = v;
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}
