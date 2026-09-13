/**
 * Shared types for the roadmap data model and app state.
 *
 * These mirror the JSON shapes in public/data/*.json exactly (which are
 * themselves unchanged from the original static-site data files) plus the
 * shapes the legacy app.js built up at runtime (WEEKS, MONTH_META, etc.).
 */

export interface GrammarBlock {
  name: string;
  level: string;
  pass_: string;
  rule: string;
  formula: string;
  example: string;
  tip: string;
}

export interface SkillBlock {
  title: string;
  detail: string;
  minutes: number;
}

export interface VocabItem {
  phrase: string;
  sentence: string;
}

export type QuestionType = 'mcq' | 'gap' | 'tfng';

export interface McqQuestion {
  id: string;
  type: 'mcq';
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface GapQuestion {
  id: string;
  type: 'gap';
  prompt: string;
  answer: string;
  altAnswers?: string[];
}

export interface TfngQuestion {
  id: string;
  type: 'tfng';
  prompt: string;
  answer: 'True' | 'False' | 'Not Given';
}

export type ExerciseQuestion = McqQuestion | GapQuestion | TfngQuestion;
/** Question shape after normalizeQuestion() collapses tfng -> mcq. */
export type NormalizedQuestion = McqQuestion | GapQuestion;

export interface ListeningSegment {
  speaker?: string;
  text: string;
}

export interface ListeningExercise {
  title?: string;
  taskType?: string;
  instructions: string;
  voiceHint?: string;
  segments: ListeningSegment[];
  predictionMode?: boolean;
  formTitle?: string;
  questions: ExerciseQuestion[];
}

export interface ReadingExercise {
  title?: string;
  taskType?: string;
  instructions?: string;
  passage: string[];
  questions?: ExerciseQuestion[];
  modelSummaries?: Record<number, string>;
}

export interface ChartDatum {
  label: string;
  value: number;
  color: string;
}

export interface ExerciseChart {
  type: 'pie' | 'bar';
  data: ChartDatum[];
}

export interface WritingExercise {
  title?: string;
  taskType: string;
  prompt: string;
  chart?: ExerciseChart;
  extraPrompts?: string[];
  checklist: string[];
  modelAnswer: string;
  minWords?: number;
  timeLimitMinutes?: number;
}

export interface SpeakingItem {
  prompt: string;
  prepSeconds: number;
  speakSeconds: number;
}

export interface SpeakingExercise {
  title?: string;
  part: number;
  instructions: string;
  items: SpeakingItem[];
  reflectionPrompt?: string;
}

export interface DayExercises {
  listening?: ListeningExercise;
  reading?: ReadingExercise;
  writing?: WritingExercise;
  speaking?: SpeakingExercise;
}

export type SkillKey = 'listening' | 'reading' | 'writing' | 'speaking';

export interface Day {
  n: number;
  m: number;
  w: number;
  wd: number;
  wdName: string;
  phase: string;
  dayType: 'grammar' | 'mock' | 'rest' | string;
  topic: string;
  focus: string[];
  grammar: GrammarBlock;
  listening: SkillBlock;
  reading: SkillBlock;
  writing: SkillBlock;
  speaking: SkillBlock;
  vocab: VocabItem[];
  action: string;
  estMinutes: number;
  exercise?: DayExercises;
  /** Computed client-side (indexDay): lowercase searchable haystack. */
  _hay?: string;
}

export interface MonthMeta {
  month: number;
  phase: string;
  weeks: number[];
  dayCount: number;
  dayRange: [number, number];
}

export interface RoadmapMeta {
  months: MonthMeta[];
  phaseNames: Record<string, string>;
  totalDays: number;
}

export interface MonthChunk {
  days: Day[];
}

export interface WeekData {
  month: number;
  topic: string;
  days: Day[];
}

export type ProgressPair = { done: number; total: number };

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  durationMs: number;
}

export interface AiConfig {
  endpoint: string;
  model: string;
  apiKey: string;
  remember: boolean;
}

export interface BackupPayload {
  schemaVersion: number;
  app: string;
  exportedAt: string;
  data: {
    completedDays: number[];
    pomodoro: Record<string, number>;
    aiGrader: { endpoint: string; model: string };
  };
}

export interface ExerciseCtx {
  dayNum: number;
  skill: SkillKey;
  exercise: ListeningExercise | ReadingExercise | WritingExercise | SpeakingExercise;
}
