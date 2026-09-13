'use client';

import type { MonthMeta } from '../lib/types';
import { useRoadmap } from '../context/RoadmapContext';
import { ChevronIcon } from './Icons';
import WeekBlock from './WeekBlock';

/** Skeleton shown while a month's data chunk is still being fetched. */
function MonthSkeleton({ month }: { month: MonthMeta }) {
  return (
    <div className="flex flex-col gap-2.5" role="status" aria-live="polite" aria-label={'Loading Month ' + month.month + ' content'}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl bg-black/15 border border-white/5 px-4 py-3.5">
          <div className="skeleton-shimmer h-3.5 w-1/3 rounded-md mb-2.5" />
          <div className="skeleton-shimmer h-2.5 w-2/3 rounded-md" />
        </div>
      ))}
      <div className="text-[11px] text-slate-500 text-center pt-1">Loading Month {month.month}…</div>
    </div>
  );
}

function MonthError({ month, message, onRetry }: { month: number; message: string; onRetry: () => void }) {
  return (
    <div className="text-[12px] text-brand-rose text-center py-3">
      Could not load Month {month} ({message}).{' '}
      <button type="button" onClick={onRetry} className="focus-ring underline">
        Retry
      </button>
    </div>
  );
}

/** One month's header + body — ported 1:1 from monthHeaderHTML()/buildTree(). */
export default function MonthSection({ month }: { month: MonthMeta }) {
  const { monthProgressOf, loadedMonths, monthErrors, retryMonth, isFiltersActive, expandedMonths, toggleMonth, days, isDayVisible } = useRoadmap();

  const p = monthProgressOf(month.month);
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
  const loaded = loadedMonths.has(month.month);
  const error = monthErrors.get(month.month);

  const monthDays = days.filter((d) => d.m === month.month);
  const anyVisible = monthDays.some(isDayVisible);
  const isOpen = isFiltersActive ? anyVisible : expandedMonths.has(month.month);
  const hidden = isFiltersActive && !anyVisible;

  return (
    <section
      className={'month-section glass-strong rounded-2xl overflow-hidden shadow-card' + (hidden ? ' day-hidden' : '')}
      data-month-section={month.month}
    >
      <div className="flex items-center gap-3.5 px-4 sm:px-5 py-4 cursor-pointer select-none" onClick={() => toggleMonth(month.month)}>
        <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-indigo/25 to-brand-emerald/15 border border-white/10 grid place-items-center font-display font-extrabold text-[15px]">
          M{month.month}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-[14.5px] sm:text-base text-slate-100">{month.phase}</div>
          <div className="text-[11.5px] text-slate-400">
            Weeks {month.weeks[0]}–{month.weeks[month.weeks.length - 1]} · {month.dayCount} days
          </div>
        </div>
        <span className="text-[11px] text-slate-400 num-pill hide-mobile">
          {p.done}/{p.total}
        </span>
        <div className="w-20 sm:w-32 h-2 rounded-full progress-track overflow-hidden shrink-0">
          <div className="h-full progress-fill rounded-full" style={{ width: pct + '%' }} />
        </div>
        <ChevronIcon className={'chev shrink-0 w-5 h-5 text-slate-400 rotate-open' + (isOpen ? ' is-open' : '')} />
      </div>
      <div className={'accordion' + (isOpen ? ' open' : '')}>
        <div className="accordion-inner">
          <div className="px-3 sm:px-4 pb-4 flex flex-col gap-3 border-t border-white/5 pt-3.5" data-month-body={month.month}>
            {error ? (
              <MonthError month={month.month} message={error} onRetry={() => retryMonth(month.month)} />
            ) : loaded ? (
              month.weeks.map((w) => <WeekBlock key={w} weekNum={w} />)
            ) : (
              <MonthSkeleton month={month} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
