import type { AiConfig, SpeakingExercise } from './types';

/**
 * AI Speaking grader config + third-party request logic — ported 1:1 from
 * the legacy app.js AI GRADER section. This app never calls Claude or any
 * AI on its own initiative: the endpoint/model/key are entirely user-
 * supplied, and are only ever sent to that endpoint.
 */

export const AI_PRESETS: Record<string, { endpoint: string; model: string }> = {
  openai: { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
  groq: { endpoint: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
  ollama: { endpoint: 'http://localhost:11434/v1/chat/completions', model: 'llama3.1' },
};

const AI_CONFIG_KEY = 'ielts-roadmap-ai-grader-v1';
const AI_KEY_LOCAL = 'ielts-roadmap-ai-grader-key-v1';
const AI_KEY_SESSION = 'ielts-roadmap-ai-grader-key-v1';

export function isPlausibleHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function loadAiConfig(): AiConfig {
  let base: Partial<AiConfig & { remember: boolean }> = {};
  try {
    base = JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || 'null') || {};
  } catch {
    base = {};
  }
  const remember = base.remember !== false; // default on, matching the modal checkbox's default-checked state
  let apiKey = '';
  try {
    apiKey = remember ? localStorage.getItem(AI_KEY_LOCAL) || '' : sessionStorage.getItem(AI_KEY_SESSION) || '';
  } catch {
    /* ignore */
  }
  if (!apiKey && (base as any).apiKey) apiKey = (base as any).apiKey; // one-time migration from the pre-v2 format
  return { endpoint: base.endpoint || '', model: base.model || '', remember, apiKey };
}

export function saveAiConfig(cfg: AiConfig): void {
  const remember = cfg.remember !== false;
  try {
    localStorage.setItem(
      AI_CONFIG_KEY,
      JSON.stringify({ endpoint: cfg.endpoint || '', model: cfg.model || '', remember })
    );
  } catch {
    /* ignore */
  }
  try {
    if (remember) {
      localStorage.setItem(AI_KEY_LOCAL, cfg.apiKey || '');
      sessionStorage.removeItem(AI_KEY_SESSION);
    } else {
      sessionStorage.setItem(AI_KEY_SESSION, cfg.apiKey || '');
      localStorage.removeItem(AI_KEY_LOCAL);
    }
  } catch {
    /* ignore */
  }
}

export interface SpeakingRecord {
  blobUrl: string | null;
  transcript: string;
}

/**
 * Sends the recorded Speaking attempt's transcripts to the user's configured
 * third-party AI endpoint and returns the feedback text. Throws on any
 * failure (network, non-2xx, unexpected response shape) — same contract as
 * the legacy requestAiFeedback().
 */
export async function requestAiFeedback(ex: SpeakingExercise, records: (SpeakingRecord | undefined)[]): Promise<string> {
  const cfg = loadAiConfig();
  const transcripts = ex.items
    .map((item, i) => {
      const r = records[i] || { transcript: '' };
      return `Q${i + 1}: "${item.prompt}"\nAnswer transcript: ${r.transcript || '(no transcript captured — audio only)'}`;
    })
    .join('\n\n');
  const systemPrompt =
    'You are an IELTS Speaking examiner. Score the candidate’s answers using the four official IELTS Speaking band criteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation — the last only if evidence allows). Give an estimated overall band (1-9, may use .5), one line per criterion with a short justification, and 2-3 concrete improvement tips. Be concise.';
  const body = {
    model: cfg.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `IELTS Speaking Part ${ex.part} practice.\n\n${transcripts}` },
    ],
  };
  const r = await fetch(cfg.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const data = await r.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Unexpected response shape from the AI endpoint');
  return text as string;
}

/**
 * "Test Connection": sends the smallest possible real request (1 max_tokens)
 * so the user finds out immediately whether the URL, key and model actually
 * work together. Aborts after 10s so a hanging/unreachable endpoint can't
 * leave the caller stuck — same defensive pattern as the exercise runner's
 * fullscreen timeout race.
 */
export async function testAiConnection(endpoint: string, model: string, apiKey: string): Promise<{ ok: true; hadText: boolean } | { ok: false; message: string }> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = setTimeout(() => controller?.abort(), 10000);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
  try {
    const r = await fetch(endpoint, {
      method: 'POST',
      headers,
      signal: controller ? controller.signal : undefined,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with the single word: OK' }],
        max_tokens: 5,
      }),
    });
    clearTimeout(timer);
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      throw new Error('HTTP ' + r.status + (t ? ' — ' + t.slice(0, 120) : ''));
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    return { ok: true, hadText: !!text };
  } catch (err: any) {
    clearTimeout(timer);
    const msg = err && err.name === 'AbortError' ? 'Timed out after 10s — no response.' : err?.message || String(err);
    return { ok: false, message: msg };
  }
}
