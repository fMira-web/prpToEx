import type {
  BackupPayload,
  Day,
  ExerciseQuestion,
  GapQuestion,
  McqQuestion,
  MonthMeta,
  NormalizedQuestion,
  ProgressPair,
  WeekData,
} from './types';
import { collectAllPomoEntries } from './storage';
import { loadAiConfig } from './aiGrader';

/* =========================================================
   SEARCH / FILTER
========================================================= */

export function dayMatchesSkill(day: Day, skill: string): boolean {
  if (skill === 'Full Mock') return day.dayType === 'mock';
  if (skill === 'Rest & Review') return day.dayType === 'rest' || day.focus.indexOf('Rest & Review') !== -1;
  return day.focus.indexOf(skill) !== -1;
}

export function dayVisible(day: Day, searchQuery: string, activeSkills: Set<string>): boolean {
  if (searchQuery && (day._hay || '').indexOf(searchQuery) === -1) return false;
  if (activeSkills.size > 0) {
    let ok = false;
    activeSkills.forEach((s) => {
      if (dayMatchesSkill(day, s)) ok = true;
    });
    if (!ok) return false;
  }
  return true;
}

export function filtersActive(searchQuery: string, activeSkills: Set<string>): boolean {
  return !!searchQuery || activeSkills.size > 0;
}

/* =========================================================
   PROGRESS HELPERS
   These deliberately do NOT depend on whether a month/week's day content
   has actually loaded yet: `completed` is a Set of day NUMBERS, and
   MONTH_META's dayRange tells us exactly which numbers belong to each
   month from the tiny, always-eager metadata alone — so progress bars and
   percentages are correct immediately, even while Months 2-6 are still
   being fetched in the background, with no "loading flash" of a wrong 0%.
========================================================= */

export function weekProgress(week: WeekData | undefined, completed: Set<number>): ProgressPair {
  if (!week) return { done: 0, total: 0 };
  let done = 0;
  week.days.forEach((d) => {
    if (completed.has(d.n)) done++;
  });
  return { done, total: week.days.length };
}

export function monthProgress(meta: MonthMeta | undefined, completed: Set<number>): ProgressPair {
  if (!meta) return { done: 0, total: 0 };
  let done = 0;
  for (let n = meta.dayRange[0]; n <= meta.dayRange[1]; n++) {
    if (completed.has(n)) done++;
  }
  return { done, total: meta.dayCount };
}

export function overallProgress(completed: Set<number>, totalDays: number): ProgressPair {
  return { done: completed.size, total: totalDays };
}

export function currentStreak(completed: Set<number>): number {
  let n = 1;
  let streak = 0;
  while (completed.has(n)) {
    streak++;
    n++;
  }
  return streak;
}

// hoursLogged/skillStats DO need actual day content (estMinutes, focus[]) for
// every completed day, so — unlike the progress counters above — they can
// transiently undercount for a completed day in a month that hasn't finished
// background-loading yet. In practice this window is milliseconds, and both
// figures self-correct the moment each chunk arrives.
export function hoursLogged(completed: Set<number>, dayByN: Map<number, Day>): number {
  let mins = 0;
  completed.forEach((n) => {
    const d = dayByN.get(n);
    if (d) mins += d.estMinutes;
  });
  return Math.round((mins / 60) * 10) / 10;
}

export function skillStats(days: Day[], completed: Set<number>): Record<string, ProgressPair> {
  const res: Record<string, ProgressPair> = {};
  (['Grammar', 'Listening', 'Reading', 'Writing', 'Speaking'] as const).forEach((s) => {
    let total = 0;
    let done = 0;
    days.forEach((d) => {
      if (dayMatchesSkill(d, s)) {
        total++;
        if (completed.has(d.n)) done++;
      }
    });
    res[s] = { done, total };
  });
  return res;
}

/* =========================================================
   INDEXING (mirrors legacy indexDay())
========================================================= */

export function indexDay(d: Day): Day {
  const parts: string[] = [
    d.topic,
    d.phase,
    d.grammar.name,
    d.grammar.rule,
    d.grammar.example,
    d.grammar.tip,
    d.listening.title,
    d.listening.detail,
    d.reading.title,
    d.reading.detail,
    d.writing.title,
    d.writing.detail,
    d.speaking.title,
    d.speaking.detail,
    d.action,
    d.focus.join(' '),
  ];
  d.vocab.forEach((v) => parts.push(v.phrase, v.sentence));
  d._hay = parts.join(' • ').toLowerCase();
  return d;
}

/* =========================================================
   EXERCISE GRADING (Listening + Reading shared question logic)
========================================================= */

export function normalizeQuestion(q: ExerciseQuestion): NormalizedQuestion {
  if (q.type === 'tfng') {
    const opts = ['True', 'False', 'Not Given'];
    return { id: q.id, type: 'mcq', prompt: q.prompt, options: opts, answerIndex: opts.indexOf(q.answer) };
  }
  return q as NormalizedQuestion;
}

export function normalizeAnswerText(s: string): string {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, '')
    .replace(/\s+/g, ' ');
}

export function gapIsCorrect(q: GapQuestion, given: string): boolean {
  const norm = normalizeAnswerText(given);
  if (!norm) return false;
  const cands = [q.answer].concat(q.altAnswers || []).map(normalizeAnswerText);
  return cands.indexOf(norm) !== -1;
}

export interface GradedAnswer {
  id: string;
  isCorrect: boolean;
  correctText: string;
}

export interface GradeResult {
  correct: number;
  total: number;
  perQuestion: GradedAnswer[];
}

/**
 * Grades a set of questions against the answers currently held in
 * `given` (keyed by question id: string for gap answers, number|null index
 * for mcq answers). Pure function — the legacy gradeQuestions() read the
 * DOM directly; here the caller (a React component) supplies the current
 * form state instead.
 */
export function gradeQuestions(
  questions: ExerciseQuestion[],
  given: Record<string, string | number | null | undefined>
): GradeResult {
  const norm = questions.map(normalizeQuestion);
  let correct = 0;
  const perQuestion: GradedAnswer[] = norm.map((q) => {
    let isCorrect: boolean;
    let correctText: string;
    if (q.type === 'gap') {
      isCorrect = gapIsCorrect(q, String(given[q.id] ?? ''));
      correctText = q.answer;
    } else {
      const g = given[q.id];
      const idx = typeof g === 'number' ? g : g != null ? parseInt(String(g), 10) : null;
      isCorrect = idx === q.answerIndex;
      correctText = q.options[q.answerIndex];
    }
    if (isCorrect) correct++;
    return { id: q.id, isCorrect, correctText };
  });
  return { correct, total: norm.length, perQuestion };
}

/* =========================================================
   FORMATTING
========================================================= */

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

export function fmtMMSS(sec: number): string {
  sec = Math.max(0, sec);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

export function skillLabel(k: string): string {
  return ({ listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' } as Record<string, string>)[k] || k;
}

/* =========================================================
   BACKUP / RESTORE
========================================================= */

export const BACKUP_SCHEMA_VERSION = 1;

export function buildBackupPayload(completed: Set<number>): BackupPayload {
  const aiCfg = loadAiConfig();
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    app: 'ielts-roadmap',
    exportedAt: new Date().toISOString(),
    data: {
      completedDays: Array.from(completed).sort((a, b) => a - b),
      pomodoro: collectAllPomoEntries(),
      // The AI grader's endpoint/model are convenience data, not secrets, so
      // they travel with the backup. The API key never does.
      aiGrader: { endpoint: aiCfg.endpoint || '', model: aiCfg.model || '' },
    },
  };
}

export function validateBackupPayload(obj: any): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { ok: false, errors: ['File is not a valid JSON object.'] };
  }
  if (obj.schemaVersion !== 1) {
    errors.push('Unrecognised schemaVersion (expected 1, got ' + JSON.stringify(obj.schemaVersion) + ').');
  }
  if (!obj.data || typeof obj.data !== 'object' || Array.isArray(obj.data)) {
    errors.push('Missing or invalid "data" object.');
    return { ok: false, errors };
  }
  const d = obj.data;
  if (!Array.isArray(d.completedDays)) {
    errors.push('"data.completedDays" must be an array of day numbers.');
  } else if (!d.completedDays.every((n: any) => typeof n === 'number' && Math.floor(n) === n && n >= 1 && n <= 180)) {
    errors.push('"data.completedDays" must contain only whole numbers from 1 to 180.');
  }
  if (d.pomodoro !== undefined && (typeof d.pomodoro !== 'object' || Array.isArray(d.pomodoro))) {
    errors.push('"data.pomodoro" must be an object keyed by date.');
  }
  if (d.aiGrader !== undefined && (typeof d.aiGrader !== 'object' || Array.isArray(d.aiGrader))) {
    errors.push('"data.aiGrader" must be an object.');
  }
  return { ok: errors.length === 0, errors };
}
