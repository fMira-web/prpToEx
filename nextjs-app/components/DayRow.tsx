'use client';

import { useState } from 'react';
import type { Day } from '../lib/types';
import { useRoadmap } from '../context/RoadmapContext';
import { SkillIcon, ChevronIcon } from './Icons';
import { SKILL_COLORS } from './FilterChips';
import DayDetail from './DayDetail';

function FocusBadges({ focus }: { focus: string[] }) {
  return (
    <>
      {focus.map((f) => {
        const cls = SKILL_COLORS[f] || 'text-slate-300 border-slate-500/30 bg-slate-500/10';
        return (
          <span key={f} className={'skill-badge inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border ' + cls}>
            <SkillIcon name={f} /> {f}
          </span>
        );
      })}
    </>
  );
}

/** One collapsible day row — ported 1:1 from dayRowHTML() + its accordion. */
export default function DayRow({ day }: { day: Day }) {
  const { completed, toggleDay, isDayVisible } = useRoadmap();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const isDone = completed.has(day.n);
  const visible = isDayVisible(day);

  function handleToggle() {
    if (!hasOpened) setHasOpened(true);
    setIsOpen((o) => !o);
  }

  return (
    <div
      className={'day-row card-hover rounded-xl glass' + (isDone ? ' opacity-70' : '') + (visible ? '' : ' day-hidden')}
      data-day={day.n}
      data-daytype={day.dayType}
    >
      <div className="flex items-center gap-3 px-3.5 sm:px-4 py-3 cursor-pointer" onClick={handleToggle}>
        <label className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isDone}
            onChange={(e) => {
              e.stopPropagation();
              toggleDay(day.n);
            }}
            aria-label={'Mark Day ' + day.n + ' complete'}
            className="checkbox-glow w-[18px] h-[18px] rounded-md accent-emerald-400 cursor-pointer"
          />
        </label>
        <div className="shrink-0 w-9 h-9 rounded-lg bg-black/25 grid place-items-center text-[11px] font-bold num-pill text-slate-300">{day.n}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12.5px] font-semibold text-slate-100">{day.wdName}</span>
            <span className="hidden sm:flex items-center gap-1 flex-wrap">
              <FocusBadges focus={day.focus} />
            </span>
          </div>
          <div className="sm:hidden mt-1 flex items-center gap-1 flex-wrap">
            <FocusBadges focus={day.focus} />
          </div>
        </div>
        <div className="shrink-0 text-[10.5px] text-slate-500 num-pill hide-mobile">{day.estMinutes} min</div>
        <ChevronIcon className={'chev shrink-0 w-4 h-4 text-slate-500 rotate-open' + (isOpen ? ' is-open' : '')} />
      </div>
      <div className={'accordion' + (isOpen ? ' open' : '')}>
        <div className="accordion-inner">{hasOpened && <DayDetail day={day} />}</div>
      </div>
    </div>
  );
}
