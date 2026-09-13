'use client';

import { useRoadmap } from '../context/RoadmapContext';
import MonthSection from './MonthSection';

/** The <main> roadmap area — ported 1:1 from buildTree() + the #noResults block. */
export default function RoadmapTree() {
  const { meta, isFiltersActive, visibleCount, clearFilters } = useRoadmap();
  const noResults = isFiltersActive && visibleCount === 0;

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col gap-4">
        {meta.months.map((m) => (
          <MonthSection key={m.month} month={m} />
        ))}
      </div>
      {noResults && (
        <div className="text-center py-16">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-slate-400 text-sm">No days match your current search and filters.</p>
          <button type="button" onClick={clearFilters} className="focus-ring mt-3 text-xs px-4 py-2 rounded-xl btn-primary font-semibold">
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
