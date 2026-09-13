import fs from 'node:fs';
import path from 'node:path';
import dynamic from 'next/dynamic';
import type { Day, RoadmapMeta } from '@/lib/types';

// The full React port of the legacy app.js/template.html (see
// components/RoadmapApp.tsx and its children). Loaded with ssr:false: every
// piece of state in that tree ultimately reads from localStorage or a
// browser-only API (fullscreen, MediaRecorder, speechSynthesis), so there is
// nothing useful to server-render, and skipping SSR sidesteps any
// server/client HTML mismatch from that browser-only state entirely — the
// same way the old static site rendered nothing until app.js ran.
const RoadmapApp = dynamic(() => import('@/components/RoadmapApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen grid place-items-center text-slate-500 text-sm">Loading your roadmap…</div>
  ),
});

// Month 1 + the tiny cross-month meta ship inlined for a fast first paint,
// exactly like the old roadmap-data.js did via window.ROADMAP_META /
// window.ROADMAP_MONTH1_DAYS — read server-side here instead, so the data
// arrives as ordinary React props rather than global variables set by a
// separately-loaded <script>. Months 2-6 are still fetched lazily from
// public/data/month-N.json by RoadmapContext, unchanged.
const meta: RoadmapMeta = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'meta.json'), 'utf-8'));
const month1: { days: Day[] } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'month-1.json'), 'utf-8'));

export default function HomePage() {
  // AuthBar now renders inside RoadmapApp/AppShell (see components/RoadmapApp.tsx)
  // so it lives inside <RoadmapProvider> and can drive progress/attempt sync.
  return <RoadmapApp meta={meta} initialMonth1Days={month1.days} />;
}
