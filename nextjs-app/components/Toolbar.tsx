'use client';

import { useRoadmap } from '../context/RoadmapContext';
import { SearchIcon } from './Icons';
import FilterChips from './FilterChips';

/**
 * Search + expand/collapse/backup/reset toolbar. Ported from the TOOLBAR
 * block in app/_body-inner.html plus the search-debounce / reset-confirm
 * logic from the legacy app.js TOOLBAR section (the debounce itself now
 * lives in RoadmapContext so it can be reset from more than one place).
 */
export default function Toolbar() {
  const { searchInput, setSearchInput, clearSearch, expandAll, collapseAll, setBackupOpen, resetProgress, isFiltersActive, visibleCount, meta, loadedMonths } =
    useRoadmap();

  function handleReset() {
    // dbDoc never exists in this build (no window.claude "db" capability
    // outside a published Claude Artifact preview) — always the
    // device-only phrasing, matching a plain saved copy of the static site.
    const msg = 'Reset all progress? This clears every checked day on this device and cannot be undone.';
    if (!confirm(msg)) return;
    resetProgress();
  }

  const statusText =
    visibleCount + ' of ' + meta.totalDays + ' days match your filters' + (loadedMonths.size < meta.months.length ? ' (some months are still loading)' : '');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-5">
      <div className="glass rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              aria-label="Search the roadmap"
              placeholder="Search topics, grammar points, vocabulary, or action items…"
              className="focus-ring w-full bg-base-card/70 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm placeholder:text-slate-500 focus:border-brand-indigo/60 transition-colors"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs w-5 h-5 grid place-items-center rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={expandAll} className="focus-ring text-xs px-3 py-2.5 rounded-xl glass text-slate-300 hover:text-white whitespace-nowrap card-hover">
              Expand all
            </button>
            <button type="button" onClick={collapseAll} className="focus-ring text-xs px-3 py-2.5 rounded-xl glass text-slate-300 hover:text-white whitespace-nowrap card-hover">
              Collapse all
            </button>
            <button
              type="button"
              onClick={() => setBackupOpen(true)}
              title="Export or import your saved progress as a JSON file"
              className="focus-ring text-xs px-3 py-2.5 rounded-xl glass text-slate-300 hover:text-white whitespace-nowrap card-hover"
            >
              Backup / Restore
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="focus-ring text-xs px-3 py-2.5 rounded-xl glass text-rose-300 hover:text-rose-200 hover:border-rose-400/40 whitespace-nowrap card-hover"
            >
              Reset progress
            </button>
          </div>
        </div>
        <FilterChips />
        {isFiltersActive && <div className="text-[11.5px] text-brand-sky">{statusText}</div>}
      </div>
    </div>
  );
}
