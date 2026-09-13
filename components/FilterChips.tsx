'use client';

import { useRoadmap } from '../context/RoadmapContext';
import { SkillIcon } from './Icons';

export const SKILL_LIST = ['Grammar', 'Listening', 'Reading', 'Writing', 'Speaking', 'Full Mock', 'Rest & Review'];

export const SKILL_COLORS: Record<string, string> = {
  Grammar: 'text-brand-indigo border-brand-indigo/40 bg-brand-indigo/10',
  Listening: 'text-brand-sky border-brand-sky/40 bg-brand-sky/10',
  Reading: 'text-brand-emerald border-brand-emerald/40 bg-brand-emerald/10',
  Writing: 'text-brand-amber border-brand-amber/40 bg-brand-amber/10',
  Speaking: 'text-brand-rose border-brand-rose/40 bg-brand-rose/10',
  'Full Mock': 'text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-400/10',
  'Rest & Review': 'text-slate-300 border-slate-400/30 bg-slate-400/10',
};

/** Filter-by-focus chip row — ported 1:1 from BUILD: FILTER CHIPS. */
export default function FilterChips() {
  const { activeSkills, toggleSkill } = useRoadmap();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] text-slate-500 mr-1">Filter by focus:</span>
      {SKILL_LIST.map((s) => {
        const active = activeSkills.has(s);
        const cls =
          'chip focus-ring flex items-center gap-1.5 text-[11.5px] font-medium px-2.5 py-1.5 rounded-lg border ' +
          (active ? SKILL_COLORS[s] + ' shadow-glow' : 'text-slate-400 border-white/10 glass hover:text-slate-200');
        return (
          <button key={s} type="button" className={cls} onClick={() => toggleSkill(s)}>
            <SkillIcon name={s} />
            <span>{s}</span>
          </button>
        );
      })}
    </div>
  );
}
