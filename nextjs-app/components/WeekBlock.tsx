'use client';

import { useRoadmap } from '../context/RoadmapContext';
import { ChevronIcon } from './Icons';
import DayRow from './DayRow';

/** One week's header + collapsible day list — ported 1:1 from weekHeaderHTML()/weeksHTMLForMonth(). */
export default function WeekBlock({ weekNum }: { weekNum: number }) {
  const { weeks, weekProgressOf, isFiltersActive, expandedWeeks, toggleWeek, isDayVisible } = useRoadmap();
  const weekData = weeks.get(weekNum);
  if (!weekData) return null;

  const p = weekProgressOf(weekNum);
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
  const anyVisible = weekData.days.some(isDayVisible);
  const isOpen = isFiltersActive ? anyVisible : expandedWeeks.has(weekNum);
  const hidden = isFiltersActive && !anyVisible;

  return (
    <div className={'week-block rounded-xl bg-black/15 border border-white/5' + (hidden ? ' day-hidden' : '')}>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => toggleWeek(weekNum)}>
        <ChevronIcon className={'chev shrink-0 w-4 h-4 text-slate-400 rotate-open' + (isOpen ? ' is-open' : '')} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-[13px]">Week {weekNum}</span>
            <span className="text-[12px] text-slate-400 truncate">{weekData.topic}</span>
          </div>
        </div>
        <span className="text-[10.5px] text-slate-500 num-pill hide-mobile">
          {p.done}/{p.total}
        </span>
        <div className="w-16 sm:w-24 h-1.5 rounded-full progress-track overflow-hidden shrink-0">
          <div className="h-full progress-fill rounded-full" style={{ width: pct + '%' }} />
        </div>
      </div>
      <div className={'accordion' + (isOpen ? ' open' : '')}>
        <div className="accordion-inner">
          <div className="px-3 sm:px-4 pb-3.5 flex flex-col gap-2">
            {weekData.days.map((d) => (
              <DayRow key={d.n} day={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
