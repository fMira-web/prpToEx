'use client';

import { useEffect, useState } from 'react';
import type { ExerciseChart, WritingExercise } from '../../lib/types';
import { fmtMMSS } from '../../lib/helpers';
import ExerciseHeader from './ExerciseHeader';
import CompletionFooter from './CompletionFooter';

/** Ported 1:1 from renderChartHTML(). */
function WritingChart({ chart }: { chart?: ExerciseChart }) {
  if (!chart) return null;
  if (chart.type === 'pie') {
    const total = chart.data.reduce((s, d) => s + d.value, 0);
    let acc = 0;
    const stops = chart.data
      .map((d) => {
        const start = (acc / total) * 360;
        acc += d.value;
        const end = (acc / total) * 360;
        return d.color + ' ' + start.toFixed(1) + 'deg ' + end.toFixed(1) + 'deg';
      })
      .join(', ');
    return (
      <div className="flex flex-col sm:flex-row items-center gap-5 mb-5 rounded-xl bg-black/20 border border-white/10 px-4 py-4">
        <div className="w-32 h-32 rounded-full shrink-0" style={{ background: 'conic-gradient(' + stops + ')' }} />
        <div className="flex flex-col gap-1">
          {chart.data.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
              {d.label} — {d.value}%
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (chart.type === 'bar') {
    const max = Math.max(...chart.data.map((d) => d.value));
    return (
      <div className="flex items-end gap-3 mb-5 rounded-xl bg-black/20 border border-white/10 px-4 py-4">
        {chart.data.map((d, i) => {
          const h = Math.round((d.value / max) * 100);
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="text-[11px] text-slate-300 num-pill">{d.value}%</div>
              <div className="w-full ex-bar-track rounded-t-md flex items-end" style={{ height: 120 }}>
                <div className="w-full ex-bar-fill rounded-t-md" style={{ height: h + '%', background: d.color }} />
              </div>
              <div className="text-[10.5px] text-slate-500 text-center">{d.label}</div>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

/** Countdown (timeLimitMinutes set) or stopwatch (untimed) — ported 1:1 from startCountdown/startStopwatch. */
function WritingTimer({ timeLimitMinutes }: { timeLimitMinutes?: number }) {
  const [elapsedOrRemaining, setValue] = useState(timeLimitMinutes ? timeLimitMinutes * 60 : 0);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (timeLimitMinutes ? v - 1 : v + 1));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const text = timeLimitMinutes
    ? elapsedOrRemaining >= 0
      ? fmtMMSS(elapsedOrRemaining) + ' remaining'
      : 'Time’s up'
    : fmtMMSS(elapsedOrRemaining) + ' elapsed (untimed)';

  return <div className="text-right text-[11.5px] text-slate-500 num-pill mb-4">{text}</div>;
}

/** Ported 1:1 from renderWriting(). */
export default function ExerciseWriting({
  dayNum,
  exercise,
  onClose,
  onFinish,
}: {
  dayNum: number;
  exercise: WritingExercise;
  onClose: () => void;
  onFinish: () => void;
}) {
  const [extraAnswers, setExtraAnswers] = useState<string[]>(() => (exercise.extraPrompts ? exercise.extraPrompts.map(() => '') : []));
  const [mainText, setMainText] = useState('');
  const [checked, setChecked] = useState<boolean[]>(() => exercise.checklist.map(() => false));
  const [revealModel, setRevealModel] = useState(false);

  const wordCount = mainText.trim() ? mainText.trim().split(/\s+/).length : 0;
  const wordCountClass = exercise.minWords && wordCount < exercise.minWords ? 'text-brand-amber' : 'text-brand-emerald';

  return (
    <>
      <ExerciseHeader skill="writing" dayNum={dayNum} title={exercise.title} onClose={onClose} />
      <div className="text-[10.5px] uppercase tracking-wide text-brand-amber font-semibold mb-1.5">{exercise.taskType}</div>
      <p className="text-[13px] text-slate-300 leading-relaxed mb-1">{exercise.prompt}</p>
      <WritingTimer timeLimitMinutes={exercise.timeLimitMinutes} />

      {exercise.extraPrompts ? (
        exercise.extraPrompts.map((p, i) => (
          <div key={i} className="mb-5">
            <div className="text-[12.5px] text-slate-300 leading-relaxed mb-2 rounded-lg bg-black/20 border border-white/10 px-3.5 py-3">{p}</div>
            <textarea
              rows={3}
              value={extraAnswers[i] || ''}
              onChange={(e) =>
                setExtraAnswers((prev) => {
                  const next = [...prev];
                  next[i] = e.target.value;
                  return next;
                })
              }
              placeholder="Your overview paragraph…"
              className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2.5 text-[13px] text-slate-100 leading-relaxed"
            />
          </div>
        ))
      ) : (
        <>
          <WritingChart chart={exercise.chart} />
          <textarea
            rows={12}
            value={mainText}
            onChange={(e) => setMainText(e.target.value)}
            placeholder="Write your response here…"
            className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3.5 py-3 text-[13.5px] text-slate-100 leading-relaxed"
          />
          <div className={'mt-1.5 text-[11.5px] ' + wordCountClass}>
            {wordCount} words{exercise.minWords ? ' / ' + exercise.minWords + ' min' : ''}
          </div>
        </>
      )}

      <div className="mt-5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Self-Assessment Checklist</div>
        {exercise.checklist.map((c, i) => (
          <label key={i} className="flex items-start gap-2 py-1 text-[12px] text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={checked[i] || false}
              onChange={(e) =>
                setChecked((prev) => {
                  const next = [...prev];
                  next[i] = e.target.checked;
                  return next;
                })
              }
              className="mt-0.5 accent-emerald-400"
            />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <button type="button" onClick={() => setRevealModel(true)} className="focus-ring text-[12px] text-brand-sky hover:underline">
          Reveal model answer
        </button>
      </div>
      {revealModel && (
        <div className="mt-3 rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 text-[12.5px] text-slate-400 leading-relaxed whitespace-pre-line">
          {exercise.modelAnswer}
        </div>
      )}

      <CompletionFooter dayNum={dayNum} onFinish={onFinish} />
    </>
  );
}
