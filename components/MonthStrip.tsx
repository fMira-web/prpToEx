'use client';

import { useRoadmap } from '../context/RoadmapContext';

/** BUILD: MONTH STRIP — the row of jump-to-month cards under the toolbar. */
export default function MonthStrip() {
  const { meta, monthProgressOf, expandedMonths, toggleMonth, clearFilters } = useRoadmap();

  // Jumping to a month should ensure it's expanded, not toggle it closed if
  // it happened to already be open — matching legacy: `expandedMonths.add(mnum)`.
  function handleJump(monthNum: number) {
    if (!expandedMonths.has(monthNum)) toggleMonth(monthNum);
    clearFilters();
    const sec = document.querySelector('[data-month-section="' + monthNum + '"]');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {meta.months.map((m) => {
          const p = monthProgressOf(m.month);
          const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
          return (
            <button
              key={m.month}
              type="button"
              onClick={() => handleJump(m.month)}
              className="focus-ring group text-left glass rounded-xl px-3 py-2.5 card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[13px]">M{m.month}</span>
                <span className="text-[10px] text-slate-400 num-pill">{pct}%</span>
              </div>
              <div className="mt-1 text-[10.5px] text-slate-400 leading-snug line-clamp-2">{m.phase}</div>
              <div className="mt-2 h-1.5 rounded-full progress-track overflow-hidden">
                <div className="h-full progress-fill rounded-full" style={{ width: pct + '%' }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
