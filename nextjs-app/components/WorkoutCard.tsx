'use client';

import type { SkillBlock, SkillKey } from '../lib/types';
import { useRoadmap } from '../context/RoadmapContext';
import { ComingSoonIcon, SkillIcon, StartExerciseIcon } from './Icons';

const RING_CLASS: Record<SkillKey, string> = {
  listening: 'border-l-2 border-brand-sky',
  reading: 'border-l-2 border-brand-emerald',
  writing: 'border-l-2 border-brand-amber',
  speaking: 'border-l-2 border-brand-rose',
};

/** One of the four workout cards inside a day's detail — ported 1:1 from workoutCard(). */
export default function WorkoutCard({
  skillKey,
  label,
  block,
  isPrimary,
  dayNum,
  hasExercise,
}: {
  skillKey: SkillKey;
  label: string;
  block: SkillBlock;
  isPrimary: boolean;
  dayNum: number;
  hasExercise: boolean;
}) {
  const { openExercise } = useRoadmap();
  const ring = isPrimary ? RING_CLASS[skillKey] : 'border-l-2 border-white/10';

  return (
    <div className={'rounded-xl bg-black/20 px-3.5 py-3 ' + ring}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <SkillIcon name={label} />
          <span>
            {label}
            {isPrimary && <span className="text-brand-emerald"> · primary</span>}
          </span>
        </div>
        <span className="text-[10.5px] text-slate-500 num-pill">{block.minutes} min</span>
      </div>
      <div className="mt-1 text-[13px] font-semibold text-slate-100">{block.title}</div>
      <div className="mt-0.5 text-[12.5px] text-slate-400 leading-relaxed">{block.detail}</div>
      {hasExercise ? (
        <button
          type="button"
          onClick={() => openExercise(dayNum, skillKey)}
          className="focus-ring mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-100"
        >
          <StartExerciseIcon />
          <span>Start Exercise</span>
        </button>
      ) : (
        // No proctored exercise authored yet for this skill/day (currently Months
        // 2-6). Render an accessible disabled placeholder instead of silently
        // showing nothing, so it's clear this is planned, not broken.
        <div
          className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 border border-dashed border-white/15 text-slate-500 cursor-not-allowed select-none"
          tabIndex={0}
          role="note"
          aria-disabled="true"
          aria-label={'Proctored ' + label + ' exercise coming soon — not yet available for this day'}
          title="Proctored practice for this skill is still being written and will unlock in a future update. Use the workout notes above for self-directed practice in the meantime."
        >
          <ComingSoonIcon />
          <span>Coming soon</span>
        </div>
      )}
    </div>
  );
}
