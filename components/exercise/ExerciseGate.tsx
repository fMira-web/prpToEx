'use client';

import { useState } from 'react';
import { skillLabel } from '../../lib/helpers';
import type { SkillKey } from '../../lib/types';

/** Ported 1:1 from renderGate(). */
export default function ExerciseGate({
  skill,
  dayNum,
  onStart,
  onClose,
}: {
  skill: SkillKey;
  dayNum: number;
  onStart: () => void;
  onClose: () => void;
}) {
  const [starting, setStarting] = useState(false);

  function handleClick() {
    if (starting) return;
    setStarting(true);
    onStart();
  }

  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-amber/20 to-brand-rose/10 border border-brand-amber/30 grid place-items-center text-2xl mb-4">
        🔒
      </div>
      <div className="text-[11px] uppercase tracking-wide text-brand-amber font-semibold mb-2">Proctored Practice</div>
      <div className="font-display font-bold text-xl mb-3">
        {skillLabel(skill)} Exercise — Day {dayNum}
      </div>
      <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
        This exercise runs in full-screen so you can practise without distraction. If you exit full-screen, switch tabs, or switch windows before
        you finish, your attempt will be reset — make sure you have a few uninterrupted minutes.
        {skill === 'speaking' ? ' You’ll also be asked for microphone access.' : ''}
      </p>
      <button
        type="button"
        disabled={starting}
        onClick={handleClick}
        className="focus-ring px-6 py-3 rounded-xl btn-primary font-semibold text-[13.5px] shadow-glowEmerald disabled:opacity-70 disabled:cursor-wait"
      >
        <span>{starting ? 'Entering full-screen…' : 'Enter Full-Screen & Start'}</span>
      </button>
      <div className="mt-4">
        <button type="button" onClick={onClose} className="text-[12px] text-slate-500 hover:text-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
}
