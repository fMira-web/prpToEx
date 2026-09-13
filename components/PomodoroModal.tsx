'use client';

import { useRoadmap } from '../context/RoadmapContext';
import { fmtTime } from '../lib/helpers';
import { RING_CIRC, TIMER_LABELS, TIMER_MODES, TimerMode } from '../lib/timer';
import Modal from './Modal';
import { PauseIcon, PlayIcon, RefreshIcon, SkipIcon } from './Icons';

const MODE_ORDER: { mode: TimerMode; label: string }[] = [
  { mode: 'focus', label: 'Focus 25' },
  { mode: 'short', label: 'Break 5' },
  { mode: 'long', label: 'Break 15' },
];

/**
 * Study/Pomodoro timer — ported 1:1 from the POMODORO TIMER section. The
 * timer engine itself lives in RoadmapContext (not here), because the
 * legacy app.js kept it running even while this modal was hidden — closing
 * the modal only hid a div, it never stopped the interval.
 */
export default function PomodoroModal() {
  const { timerOpen, setTimerOpen, timerMode, timerRemaining, timerRunning, setTimerModeAction, toggleTimerRunning, resetTimer, skipTimer } = useRoadmap();

  const total = TIMER_MODES[timerMode];
  const frac = timerRemaining / total;
  const dashoffset = RING_CIRC * (1 - frac);

  return (
    <Modal open={timerOpen} onClose={() => setTimerOpen(false)} labelledBy="timer-modal-title" maxWidth="max-w-sm">
      <div className="relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-emerald/10 blur-3xl animate-pulseGlow" />
        <div className="flex items-center justify-between relative">
          <h3 id="timer-modal-title" className="font-display font-bold text-lg">
            Study Timer
          </h3>
          <button type="button" onClick={() => setTimerOpen(false)} className="focus-ring text-slate-400 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="mt-3 flex gap-2 relative">
          {MODE_ORDER.map(({ mode, label }) => {
            const active = mode === timerMode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setTimerModeAction(mode)}
                className={
                  'timer-mode-btn flex-1 text-xs font-semibold py-2 rounded-lg glass card-hover' +
                  (active ? ' shadow-glowEmerald text-white' : ' text-slate-400')
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid place-items-center relative">
          <svg width={200} height={200} viewBox="0 0 200 200" className="-rotate-90">
            <circle cx={100} cy={100} r={88} fill="none" strokeWidth={10} className="ring-track" />
            <circle
              cx={100}
              cy={100}
              r={88}
              fill="none"
              strokeWidth={10}
              strokeLinecap="round"
              stroke="url(#timerGrad)"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={dashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="60%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-display text-4xl font-extrabold num-pill tracking-tight">{fmtTime(timerRemaining)}</span>
            <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-1">{TIMER_LABELS[timerMode]}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 relative">
          <button
            type="button"
            onClick={resetTimer}
            aria-label="Reset timer"
            className="focus-ring w-11 h-11 rounded-full glass grid place-items-center card-hover text-slate-300 hover:text-white"
          >
            <RefreshIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleTimerRunning}
            aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
            className="focus-ring w-16 h-16 rounded-full btn-primary grid place-items-center shadow-glowEmerald card-hover"
          >
            {timerRunning ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <button
            type="button"
            onClick={skipTimer}
            aria-label="Skip to next mode"
            className="focus-ring w-11 h-11 rounded-full glass grid place-items-center card-hover text-slate-300 hover:text-white"
          >
            <SkipIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] text-slate-500 relative">Runs while this tab is open · sound plays on completion</p>
      </div>
    </Modal>
  );
}
