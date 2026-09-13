'use client';

import type { Day } from '../lib/types';
import { SkillIcon, ClipboardCheckIcon } from './Icons';
import WorkoutCard from './WorkoutCard';

const VOCAB_BORDER_COLORS = ['border-brand-emerald/30', 'border-brand-sky/30', 'border-brand-indigo/30'];

/** Expanded day content — ported 1:1 from buildDayDetailHTML(). */
export default function DayDetail({ day }: { day: Day }) {
  const g = day.grammar;
  const isL = day.focus.indexOf('Listening') !== -1 || day.dayType === 'mock';
  const isR = day.focus.indexOf('Reading') !== -1 || day.dayType === 'mock';
  const isW = day.focus.indexOf('Writing') !== -1 || day.dayType === 'mock';
  const isS = day.focus.indexOf('Speaking') !== -1 || day.dayType === 'mock';

  return (
    <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-brand-indigo/10 to-transparent border border-brand-indigo/25 px-3.5 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-indigo">
            <SkillIcon name="Grammar" />
            <span>Grammar Component</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-indigo/15 text-brand-indigo border border-brand-indigo/30">
            {g.level} · {g.pass_}
          </span>
        </div>
        <div className="mt-2 text-[14px] font-bold text-slate-100">{g.name}</div>
        <div className="mt-1.5 text-[12.5px] text-slate-300 leading-relaxed">{g.rule}</div>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <span className="text-[10.5px] uppercase tracking-wide text-slate-500 shrink-0">Formula</span>
          <code className="text-[12px] px-2 py-1 rounded-md bg-black/40 text-brand-emerald border border-white/10 font-mono">{g.formula}</code>
        </div>
        <div className="mt-2 text-[12.5px] text-slate-300">
          <span className="text-slate-500">Example —</span> <span className="italic">“{g.example}”</span>
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-[12px] text-brand-amber/90">
          <span className="mt-0.5">⚠</span>
          <span>
            <b>Error-avoidance tip:</b> {g.tip}
          </span>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Productive &amp; Receptive Workouts</div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          <WorkoutCard skillKey="listening" label="Listening" block={day.listening} isPrimary={isL} dayNum={day.n} hasExercise={!!day.exercise?.listening} />
          <WorkoutCard skillKey="reading" label="Reading" block={day.reading} isPrimary={isR} dayNum={day.n} hasExercise={!!day.exercise?.reading} />
          <WorkoutCard skillKey="writing" label="Writing" block={day.writing} isPrimary={isW} dayNum={day.n} hasExercise={!!day.exercise?.writing} />
          <WorkoutCard skillKey="speaking" label="Speaking" block={day.speaking} isPrimary={isS} dayNum={day.n} hasExercise={!!day.exercise?.speaking} />
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Vocabulary &amp; Collocations of the Day</div>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {day.vocab.map((v, i) => (
            <div key={i} className={'rounded-xl bg-black/20 border ' + VOCAB_BORDER_COLORS[i % 3] + ' px-3.5 py-3'}>
              <div className="text-[13px] font-semibold text-slate-100">{v.phrase}</div>
              <div className="mt-1 text-[12.5px] text-slate-400 italic leading-relaxed">“{v.sentence}”</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-brand-emerald/10 to-transparent border border-brand-emerald/30 px-3.5 py-3.5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-emerald">
          <ClipboardCheckIcon className="w-3.5 h-3.5" />
          <span>Today’s Action Item / Deliverable</span>
        </div>
        <div className="mt-1.5 text-[13px] text-slate-100 leading-relaxed">{day.action}</div>
      </div>
    </div>
  );
}
