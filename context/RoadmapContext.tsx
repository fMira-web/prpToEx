'use client';

/**
 * The shared store for the whole roadmap app — the React equivalent of the
 * legacy app.js's module-level closure (DATA/STORAGE/STATE/EVENT DELEGATION
 * sections). Everything that used to be a `var` shared across functions in
 * that file lives here as context state instead; everything that used to be
 * a DOM mutation (classList.toggle, innerHTML, etc.) is now just a value
 * consumers read and render declaratively.
 *
 * See ielts-roadmap/src/app.js (the file this was ported from) for the
 * original imperative version of every piece of logic below.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Day, MonthMeta, ProgressPair, RoadmapMeta, SkillKey, ToastItem, ToastType, WeekData } from '../lib/types';
import {
  currentStreak,
  dayVisible as dayVisibleFn,
  filtersActive as filtersActiveFn,
  hoursLogged,
  indexDay,
  monthProgress,
  overallProgress,
  weekProgress,
} from '../lib/helpers';
import { loadPomoCount, loadProgress, savePomoCount, saveProgress } from '../lib/storage';
import { beep, TIMER_MODES, TimerMode } from '../lib/timer';

export interface ExerciseCtxRef {
  dayNum: number;
  skill: SkillKey;
}

interface RoadmapStore {
  meta: RoadmapMeta;
  days: Day[];
  dayByN: Map<number, Day>;
  weeks: Map<number, WeekData>;
  monthMeta: Map<number, MonthMeta>;
  loadedMonths: Set<number>;
  monthErrors: Map<number, string>;
  retryMonth: (m: number) => void;

  completed: Set<number>;
  toggleDay: (n: number) => void;
  markDayComplete: (n: number) => void;
  setCompletedSet: (s: Set<number>) => void;
  resetProgress: () => void;

  weekProgressOf: (w: number) => ProgressPair;
  monthProgressOf: (m: number) => ProgressPair;
  overall: ProgressPair;
  streak: number;
  hours: number;

  syncStatus: 'connecting' | 'live' | 'error' | 'local';

  // ---- Block 2: account + server-backed progress/history ----
  user: { id: string; email: string; name: string | null } | null | undefined; // undefined = still loading
  refreshUser: () => Promise<void>;
  recordExerciseAttempt: (
    dayNumber: number,
    skill: SkillKey,
    data: { scorePercent?: number; bandEstimate?: number; answers?: unknown; aiFeedback?: string }
  ) => void;

  pomoCount: number;
  incrementPomoToday: () => void;
  reloadPomoCount: () => void;
  timerMode: TimerMode;
  timerRemaining: number;
  timerRunning: boolean;
  setTimerModeAction: (m: TimerMode) => void;
  toggleTimerRunning: () => void;
  resetTimer: () => void;
  skipTimer: () => void;

  searchInput: string;
  setSearchInput: (q: string) => void;
  clearSearch: () => void;
  searchQuery: string;
  activeSkills: Set<string>;
  toggleSkill: (s: string) => void;
  clearFilters: () => void;
  isFiltersActive: boolean;
  isDayVisible: (d: Day) => boolean;
  visibleCount: number;

  expandedMonths: Set<number>;
  expandedWeeks: Set<number>;
  toggleMonth: (m: number) => void;
  toggleWeek: (w: number) => void;
  expandAll: () => void;
  collapseAll: () => void;

  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  dismissToast: (id: number) => void;

  aiConfigVersion: number;
  bumpAiConfigVersion: () => void;

  aboutOpen: boolean;
  setAboutOpen: (v: boolean) => void;
  aiConfigOpen: boolean;
  setAiConfigOpen: (v: boolean) => void;
  backupOpen: boolean;
  setBackupOpen: (v: boolean) => void;
  timerOpen: boolean;
  setTimerOpen: (v: boolean) => void;
  exerciseCtx: ExerciseCtxRef | null;
  openExercise: (dayNum: number, skill: SkillKey) => void;
  closeExercise: () => void;
}

const RoadmapReactContext = createContext<RoadmapStore | null>(null);

export function useRoadmap(): RoadmapStore {
  const ctx = useContext(RoadmapReactContext);
  if (!ctx) throw new Error('useRoadmap() must be used inside <RoadmapProvider>');
  return ctx;
}

let toastSeq = 1;

export function RoadmapProvider({
  meta,
  initialMonth1Days,
  children,
}: {
  meta: RoadmapMeta;
  initialMonth1Days: Day[];
  children: React.ReactNode;
}) {
  /* ---------------- DATA (lazy month loading) ---------------- */
  const [days, setDays] = useState<Day[]>(() => initialMonth1Days.map(indexDay));
  const [loadedMonths, setLoadedMonths] = useState<Set<number>>(() => new Set([1]));
  const [monthErrors, setMonthErrors] = useState<Map<number, string>>(new Map());

  const monthMeta = useMemo(() => {
    const m = new Map<number, MonthMeta>();
    meta.months.forEach((mm) => m.set(mm.month, mm));
    return m;
  }, [meta]);

  const dayByN = useMemo(() => {
    const m = new Map<number, Day>();
    days.forEach((d) => m.set(d.n, d));
    return m;
  }, [days]);

  const weeks = useMemo(() => {
    const w = new Map<number, WeekData>();
    days.forEach((d) => {
      let wd = w.get(d.w);
      if (!wd) {
        wd = { month: d.m, topic: d.topic, days: [] };
        w.set(d.w, wd);
      }
      wd.days.push(d);
    });
    return w;
  }, [days]);

  const loadMonth = useCallback(
    (m: number) => {
      fetch('data/month-' + m + '.json')
        .then((r) => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then((chunk) => {
          const incoming: Day[] = ((chunk && chunk.days) || []).map(indexDay);
          setDays((prev) => prev.concat(incoming));
          setLoadedMonths((prev) => {
            const next = new Set(prev);
            next.add(m);
            return next;
          });
          setMonthErrors((prev) => {
            if (!prev.has(m)) return prev;
            const next = new Map(prev);
            next.delete(m);
            return next;
          });
        })
        .catch((err) => {
          const message = err && err.message ? err.message : String(err);
          setMonthErrors((prev) => new Map(prev).set(m, message));
          showToastRef.current?.('Month ' + m + ' failed to load. Check your connection and retry from that section.', 'error', 8000);
        });
    },
    []
  );

  const retryMonth = useCallback(
    (m: number) => {
      setMonthErrors((prev) => {
        if (!prev.has(m)) return prev;
        const next = new Map(prev);
        next.delete(m);
        return next;
      });
      loadMonth(m);
    },
    [loadMonth]
  );

  // Months 2-6's chunks are fetched only after first paint — requestIdleCallback
  // (where available) waits for the browser to be done with more urgent work;
  // setTimeout(0) is the fallback, matching the legacy INIT sequencing.
  useEffect(() => {
    let cancelled = false;
    function loadRemaining() {
      if (cancelled) return;
      meta.months.forEach((m) => {
        if (m.month === 1) return; // already inlined
        loadMonth(m.month);
      });
    }
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === 'function') ric(loadRemaining);
    else setTimeout(loadRemaining, 0);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- PROGRESS ---------------- */
  // Progress always lives in localStorage first. This Next.js build has no
  // window.claude "db" capability (that only exists inside a published
  // Claude Artifact preview) — so, exactly like a plain saved copy of the
  // original static site, it stays on local-only storage. Reading it in the
  // useState initializer is safe (not a hydration-mismatch risk) because
  // RoadmapApp is loaded with next/dynamic's ssr:false — this provider
  // never runs on the server, so there is no server HTML to disagree with.
  const [completed, setCompleted] = useState<Set<number>>(() => loadProgress());
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'live' | 'error' | 'local'>('local');

  // ---- Block 2: account (who's signed in) ----
  // AuthBar (rendered inside this provider, see RoadmapApp.tsx) reads/drives
  // this instead of keeping its own local fetch — one source of truth for
  // "who's logged in" that the progress-sync logic below can also react to.
  const [user, setUser] = useState<{ id: string; email: string; name: string | null } | null | undefined>(undefined);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Once we know who's signed in, pull server progress and MERGE it with
  // whatever's already in localStorage (union of both sets) rather than
  // overwriting either — this is what makes "completed offline, then log in
  // on this device later" and "completed on another device" both survive.
  // The merged set is then pushed back up so the server has the union too.
  const pulledServerProgressRef = useRef(false);
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      setSyncStatus('local');
      return;
    }
    if (pulledServerProgressRef.current) return;
    pulledServerProgressRef.current = true;
    setSyncStatus('connecting');
    fetch('/api/progress', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then((data: { completedDays?: number[] }) => {
        setCompleted((prev) => {
          const merged = new Set(prev);
          (data.completedDays || []).forEach((n) => merged.add(n));
          saveProgress(merged);
          fetch('/api/progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ completedDays: Array.from(merged) }),
          }).catch(() => {});
          return merged;
        });
        setSyncStatus('live');
      })
      .catch(() => {
        setSyncStatus('error');
        showToastRef.current?.('Не удалось загрузить прогресс с сервера — используются локальные данные.', 'warning', 6000);
      });
  }, [user]);

  // Best-effort single-day push. Never blocks the UI: localStorage (via
  // saveProgress, called by every caller below before this runs) is always
  // the immediate source of truth, this just keeps the account in sync.
  function syncDayToServer(dayNumber: number, completedFlag: boolean) {
    if (!user) return;
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dayNumber, completed: completedFlag }),
    })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        setSyncStatus('live');
      })
      .catch(() => {
        setSyncStatus('error');
        showToastRef.current?.('Не удалось синхронизировать день с сервером (сохранено локально).', 'warning', 5000);
      });
  }

  const recordExerciseAttempt = useCallback(
    (
      dayNumber: number,
      skill: SkillKey,
      data: { scorePercent?: number; bandEstimate?: number; answers?: unknown; aiFeedback?: string }
    ) => {
      if (!user) return; // history is an account feature — signed-out attempts simply aren't logged server-side
      fetch('/api/exercise-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dayNumber, skill: skill.toUpperCase(), ...data }),
      }).catch(() => {
        // Best-effort — a failed history write should never block the exercise UI.
      });
    },
    [user]
  );

  const toggleDay = useCallback((n: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      let nowCompleted: boolean;
      if (next.has(n)) {
        next.delete(n);
        nowCompleted = false;
      } else {
        next.add(n);
        nowCompleted = true;
      }
      saveProgress(next);
      syncDayToServer(n, nowCompleted);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markDayComplete = useCallback((n: number) => {
    setCompleted((prev) => {
      if (prev.has(n)) return prev;
      const next = new Set(prev);
      next.add(n);
      saveProgress(next);
      syncDayToServer(n, true);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setCompletedSet = useCallback(
    (s: Set<number>) => {
      setCompleted(s);
      saveProgress(s);
      if (user) {
        fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ completedDays: Array.from(s) }),
        })
          .then((r) => setSyncStatus(r.ok ? 'live' : 'error'))
          .catch(() => setSyncStatus('error'));
      }
    },
    [user]
  );

  const resetProgress = useCallback(() => {
    const empty = new Set<number>();
    setCompleted(empty);
    saveProgress(empty);
    if (user) {
      fetch('/api/progress', { method: 'DELETE', credentials: 'include' })
        .then((r) => setSyncStatus(r.ok ? 'live' : 'error'))
        .catch(() => setSyncStatus('error'));
    }
  }, [user]);

  const weekProgressOf = useCallback((w: number) => weekProgress(weeks.get(w), completed), [weeks, completed]);
  const monthProgressOf = useCallback((m: number) => monthProgress(monthMeta.get(m), completed), [monthMeta, completed]);
  const overall = useMemo(() => overallProgress(completed, meta.totalDays), [completed, meta.totalDays]);
  const streak = useMemo(() => currentStreak(completed), [completed]);
  const hours = useMemo(() => hoursLogged(completed, dayByN), [completed, dayByN]);

  /* ---------------- POMODORO ---------------- */
  const [pomoCount, setPomoCount] = useState<number>(() => loadPomoCount());
  const incrementPomoToday = useCallback(() => {
    setPomoCount((prev) => {
      const next = prev + 1;
      savePomoCount(next);
      return next;
    });
  }, []);
  const reloadPomoCount = useCallback(() => setPomoCount(loadPomoCount()), []);

  const [timerMode, setTimerModeState] = useState<TimerMode>('focus');
  const [timerRemaining, setTimerRemaining] = useState<number>(TIMER_MODES.focus);
  const [timerRunning, setTimerRunning] = useState(false);

  const setTimerModeAction = useCallback((m: TimerMode) => {
    setTimerRunning(false);
    setTimerModeState(m);
    setTimerRemaining(TIMER_MODES[m]);
  }, []);
  const toggleTimerRunning = useCallback(() => setTimerRunning((r) => !r), []);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerRemaining(TIMER_MODES[timerMode]);
  }, [timerMode]);
  const skipTimer = useCallback(() => {
    const next: TimerMode = timerMode === 'focus' ? 'short' : 'focus';
    setTimerRunning(false);
    setTimerModeState(next);
    setTimerRemaining(TIMER_MODES[next]);
  }, [timerMode]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (!timerRunning || timerRemaining > 0) return;
    setTimerRunning(false);
    beep();
    if (timerMode === 'focus') incrementPomoToday();
    const next: TimerMode = timerMode === 'focus' ? 'short' : 'focus';
    setTimerModeState(next);
    setTimerRemaining(TIMER_MODES[next]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRemaining, timerRunning]);

  /* ---------------- SEARCH / FILTERS ----------------
     Legacy app.js debounced the search box by 150ms purely to avoid
     re-toggling classes on up to 180 DOM rows per keystroke. React
     re-renders are cheap by comparison, but the debounce is kept (moved
     into the store, rather than a component) so `searchInput` — what the
     text box shows — and `searchQuery` — what filtering actually uses —
     can both be reset together from anywhere (the toolbar's ✕, or the
     "Clear filters" button in the no-results state). */
  const [searchInput, setSearchInputState] = useState('');
  const [searchQuery, setSearchQueryState] = useState('');
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());

  const setSearchInput = useCallback((q: string) => setSearchInputState(q), []);
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQueryState(searchInput.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(id);
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInputState('');
    setSearchQueryState('');
  }, []);
  const toggleSkill = useCallback((s: string) => {
    setActiveSkills((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }, []);
  const clearFilters = useCallback(() => {
    setSearchInputState('');
    setSearchQueryState('');
    setActiveSkills(new Set());
  }, []);
  const isFiltersActive = filtersActiveFn(searchQuery, activeSkills);
  const isDayVisible = useCallback((d: Day) => dayVisibleFn(d, searchQuery, activeSkills), [searchQuery, activeSkills]);
  const visibleCount = useMemo(() => days.filter((d) => dayVisibleFn(d, searchQuery, activeSkills)).length, [days, searchQuery, activeSkills]);

  /* ---------------- ACCORDION ---------------- */
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(() => new Set([1]));
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(() => new Set([1]));

  const toggleMonth = useCallback((m: number) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }, []);
  const toggleWeek = useCallback((w: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });
  }, []);
  const expandAll = useCallback(() => {
    setExpandedMonths(new Set(meta.months.map((m) => m.month)));
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      weeks.forEach((_, w) => next.add(w));
      return next;
    });
  }, [meta, weeks]);
  const collapseAll = useCallback(() => {
    setExpandedMonths(new Set());
    setExpandedWeeks(new Set());
  }, []);

  /* ---------------- TOASTS ---------------- */
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs = 5000) => {
    const id = toastSeq++;
    setToasts((prev) => prev.concat({ id, message, type, durationMs }));
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  // loadMonth (defined above, before showToast exists) needs to reach the
  // latest showToast without being re-created every render — same trick the
  // original used implicitly by just calling the module-level showToast().
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  /* ---------------- AI CONFIG (change notification) ---------------- */
  // Legacy app.js used a `document.dispatchEvent(new CustomEvent('ai-config-saved'))`
  // so the open Speaking review screen could re-render itself after Settings
  // were saved. A version counter serves the same purpose here: components
  // that care can just add it to a useEffect dependency array.
  const [aiConfigVersion, setAiConfigVersion] = useState(0);
  const bumpAiConfigVersion = useCallback(() => setAiConfigVersion((v) => v + 1), []);

  /* ---------------- MODALS ---------------- */
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [exerciseCtx, setExerciseCtx] = useState<ExerciseCtxRef | null>(null);

  const openExercise = useCallback((dayNum: number, skill: SkillKey) => {
    setExerciseCtx({ dayNum, skill });
  }, []);
  const closeExercise = useCallback(() => setExerciseCtx(null), []);

  const value: RoadmapStore = {
    meta,
    days,
    dayByN,
    weeks,
    monthMeta,
    loadedMonths,
    monthErrors,
    retryMonth,

    completed,
    toggleDay,
    markDayComplete,
    setCompletedSet,
    resetProgress,

    weekProgressOf,
    monthProgressOf,
    overall,
    streak,
    hours,

    syncStatus,

    user,
    refreshUser,
    recordExerciseAttempt,

    pomoCount,
    incrementPomoToday,
    reloadPomoCount,
    timerMode,
    timerRemaining,
    timerRunning,
    setTimerModeAction,
    toggleTimerRunning,
    resetTimer,
    skipTimer,

    searchInput,
    setSearchInput,
    clearSearch,
    searchQuery,
    activeSkills,
    toggleSkill,
    clearFilters,
    isFiltersActive,
    isDayVisible,
    visibleCount,

    expandedMonths,
    expandedWeeks,
    toggleMonth,
    toggleWeek,
    expandAll,
    collapseAll,

    toasts,
    showToast,
    dismissToast,

    aiConfigVersion,
    bumpAiConfigVersion,

    aboutOpen,
    setAboutOpen,
    aiConfigOpen,
    setAiConfigOpen,
    backupOpen,
    setBackupOpen,
    timerOpen,
    setTimerOpen,
    exerciseCtx,
    openExercise,
    closeExercise,
  };

  return <RoadmapReactContext.Provider value={value}>{children}</RoadmapReactContext.Provider>;
}
