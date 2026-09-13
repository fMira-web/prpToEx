'use client';

import { skillLabel } from '../../lib/helpers';
import type { SkillKey } from '../../lib/types';

/** Ported 1:1 from exHeaderHTML(). */
export default function ExerciseHeader({
  skill,
  dayNum,
  title,
  onClose,
}: {
  skill: SkillKey;
  dayNum: number;
  title?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/10 mb-5">
      <div>
        <div className="text-[10.5px] uppercase tracking-wide text-slate-500">
          {skillLabel(skill)} · Day {dayNum}
        </div>
        <div className="font-display font-bold text-[15px] sm:text-base">{title || skillLabel(skill) + ' Practice'}</div>
      </div>
      <button
        type="button"
        onClick={onClose}
        title="Exit (resets this attempt)"
        className="focus-ring shrink-0 w-9 h-9 rounded-lg hover:bg-white/10 grid place-items-center text-slate-400 hover:text-white text-lg"
      >
        ✕
      </button>
    </div>
  );
}
