'use client';

import { useRoadmap } from '../context/RoadmapContext';
import { ClockIcon, GearIcon } from './Icons';

/**
 * Sticky top header + the 4-tile stats row. Ported 1:1 from the HEADER
 * block in app/_body-inner.html (values previously written by
 * updateProgressUI() via direct DOM mutation are now just read from
 * context and rendered).
 */
export default function Header() {
  const { overall, streak, hours, pomoCount, syncStatus, setAiConfigOpen, setAboutOpen, setTimerOpen } = useRoadmap();
  const pct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;

  const syncDotClass =
    syncStatus === 'live'
      ? 'w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulseGlow'
      : syncStatus === 'error'
      ? 'w-1.5 h-1.5 rounded-full bg-brand-rose'
      : 'w-1.5 h-1.5 rounded-full bg-slate-500';
  const syncLabelText =
    syncStatus === 'live'
      ? 'Live sync — updates instantly everywhere'
      : syncStatus === 'connecting'
      ? 'Connecting…'
      : syncStatus === 'error'
      ? 'Sync unavailable — saved on this device'
      : 'Saved on this device only';
  const syncLabelClass =
    syncStatus === 'live'
      ? 'text-[10px] text-brand-emerald'
      : syncStatus === 'error'
      ? 'text-[10px] text-brand-rose/80'
      : 'text-[10px] text-slate-500';

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-emerald via-brand-sky to-brand-indigo grid place-items-center shadow-glow animate-floatSlow">
              <span className="text-lg">🎓</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-[15px] sm:text-lg leading-tight tracking-tight truncate">
                IELTS 6-Month Roadmap <span className="grad-text">B2 → C1</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">180 daily sessions · 26 weeks · Target Band 7.5+</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="hide-mobile focus-ring text-xs px-3 py-2 rounded-xl glass text-slate-300 hover:text-white card-hover"
            >
              About this plan
            </button>
            <button
              type="button"
              onClick={() => setAiConfigOpen(true)}
              className="focus-ring flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl glass text-slate-300 hover:text-white card-hover"
              title="Configure the third-party AI used to review Speaking exercises"
            >
              <GearIcon className="w-4 h-4" />
              <span className="hide-mobile">AI Grader</span>
            </button>
            <button
              type="button"
              onClick={() => setTimerOpen(true)}
              className="focus-ring flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl btn-primary shadow-glowEmerald card-hover"
            >
              <ClockIcon className="w-4 h-4" />
              <span className="hide-mobile">Timer</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="glass rounded-xl px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase tracking-wide text-slate-400">Overall Progress</span>
              <span className="text-xs font-bold text-brand-emerald num-pill">{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full progress-track overflow-hidden">
              <div className="h-full progress-fill rounded-full" style={{ width: pct + '%' }} />
            </div>
            <div className="mt-1 text-[10.5px] text-slate-500">
              <span>{overall.done}</span>/180 days complete
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={syncDotClass} />
              <span className={syncLabelClass}>{syncLabelText}</span>
            </div>
          </div>
          <div className="glass rounded-xl px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Current Streak</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-display font-extrabold num-pill">{streak}</span>
              <span className="text-[11px] text-slate-500">days</span>
            </div>
          </div>
          <div className="glass rounded-xl px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Est. Time Invested</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-display font-extrabold num-pill">{hours}</span>
              <span className="text-[11px] text-slate-500">hrs logged</span>
            </div>
          </div>
          <div className="glass rounded-xl px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wide text-slate-400">Pomodoros Today</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-display font-extrabold num-pill">{pomoCount}</span>
              <span className="text-[11px] text-slate-500">🍅 sessions</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
