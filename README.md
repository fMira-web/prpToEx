# IELTS 6-Month Roadmap

A day-by-day B2 → C1 IELTS preparation plan: 180 daily sessions across 26 weeks / 6 phased months, each with a grammar component, all four skill workouts (Listening/Reading/Writing/Speaking), three vocabulary collocations, and a concrete action item — plus progress tracking, search/filter, a built-in Pomodoro timer, proctored practice exercises (Month 1), a progress backup/restore tool, and a configurable third-party AI Speaking grader.

Multi-file static site: HTML + a compiled CSS bundle + a JS file + a small eager data file + 5 lazily-fetched per-month data chunks. No build tooling is required to *run* it (open `index.html` directly, or deploy the files as-is) — a build step (see below) is only needed after editing source files in `src/`.

## Live

Deployed on Vercel from this repo's `main` branch. The static site serves `index.html`, `styles.css`, `app.js`, `roadmap-data.js`, and `data/month-2.json` .. `data/month-6.json` as-is.

## Structure

```
index.html            the deployable page shell (generated — do not hand-edit)
styles.css             compiled Tailwind utilities + hand-written custom CSS, minified (generated — do not hand-edit)
app.js                 all client-side logic: rendering, filters, progress, timer, exercises, backup, AI grader (generated — do not hand-edit)
roadmap-data.js        eager payload: window.ROADMAP_META (all 6 months' stats) + window.ROADMAP_MONTH1_DAYS (generated — do not hand-edit)
data/month-2.json .. month-6.json   lazily-fetched per-month day data, one file per month (generated — do not hand-edit)
src/
  content_banks.py    grammar bank (24 points, plain-English rule/tip explanations), topic list, vocabulary/collocation bank
  task_banks.py       per-skill, per-month-phase task templates
  exercises_*.py      gradable Listening/Reading/Writing/Speaking exercise content banks (Month 1 topics)
  generate.py         builds src/roadmap_data.json from the content banks + exercise banks
  roadmap_data.json   generated day-by-day dataset (180 days), canonical source for both build modes
  template.html       page shell / markup, with placeholders for CSS/data/script
  styles.css           hand-written custom CSS (glass panels, accordions, toasts, keyframes) — appended after compiled Tailwind, not processed by it
  tailwind.config.js   Tailwind theme extension (colors, fonts, shadows, keyframes) + content-scan paths
  tailwind.input.css   bare @tailwind directives — the CLI's compile entry point
  package.json         `npm install` + `npm run build:css` for the Tailwind CLI (see Build pipeline below)
  app.js                source app logic, copied verbatim to ../app.js by build.py
  build.py             builds either the multi-file site or a single-file artifact (see below); also compiles CSS and splits data into month chunks
  BACKUP_SCHEMA.md     JSON schema for the export/import backup file + a future authenticated-backend REST/DB design
  test_render.py       Playwright smoke test (180 days render, search/filter/timer/persistence)
  test_exercise.py     Playwright test for the proctored exercise runner (all 4 skills, anti-cheat)
  test_fullscreen_fix.py   Playwright test proving the fullscreen-hang bug is fixed (simulates a permanently-pending requestFullscreen() promise)
  test_lazy_months.py  Playwright test for month code-splitting (needs a local HTTP server — file:// doesn't support fetch())
  test_backup_and_ai.py Playwright test for export/import and the AI grader modal (presets, validation, test-connection)
```

To rebuild after editing anything in `src/`:

```
cd src
python3 generate.py       # regenerates roadmap_data.json from the content banks
python3 build.py site     # compiles CSS, splits data by month, writes ../index.html, ../styles.css, ../app.js, ../roadmap-data.js, ../data/month-*.json
```

## Build pipeline (Tailwind CLI, no more CDN)

Styling used to load `<script src="https://cdn.tailwindcss.com">` at runtime, which ships the entire Tailwind JIT engine to every visitor and compiles styles in-browser on every page load. `build.py` now compiles a static, purged, minified stylesheet ahead of time instead:

```
cd src
npm install              # installs tailwindcss (see package.json) — one-time, or after upgrading it
python3 build.py site    # runs `tailwindcss -i tailwind.input.css -o ... -c tailwind.config.js --minify` internally,
                          # scanning template.html + app.js for every utility class actually used, then appends
                          # the hand-written custom CSS (styles.css) unprocessed after it
```

If `npm install` can't reach the registry in your environment, `build.py` also checks `PATH` and one documented fallback location for an already-installed `tailwindcss` binary (see `_FALLBACK_TAILWIND_BINS` in `build.py`) — but a real deploy/CI environment should just run `npm install` and let it use `src/node_modules/.bin/tailwindcss`.

`npm run watch:css` (from `src/`) recompiles on save while iterating on styles.

## Data chunking (code-splitting by month)

`roadmap_data.json` (~690KB, all 180 days) is the canonical source, but the site build splits it before shipping:

- `roadmap-data.js` ships **eagerly** with the page: `window.ROADMAP_META` (every month's phase name, week list, day count and day-number range — a few KB) and `window.ROADMAP_MONTH1_DAYS` (Month 1's full content, since that's what every new visitor lands on).
- `data/month-2.json` .. `data/month-6.json` ship **lazily**: `app.js` fetches them in the background right after the first render (via `requestIdleCallback`, falling back to `setTimeout`), and splices each one in as it arrives, replacing that month's skeleton-loading placeholder.
- Progress totals/percentages (overall, per-month, per-week) are computed from the always-eager `ROADMAP_META` day-number ranges, **not** from however much day content has loaded so far — so they're correct immediately, with no "0% flash" while a month is still loading.
- The single-file **artifact** build (below) has nowhere to fetch a chunk *from* — it's one self-contained HTML file — so it keeps embedding all 180 days inline, exactly as before. Code-splitting is a multi-file-site-only optimization by nature.

## Build modes

`src/build.py` has two modes:

- **`python3 build.py site`** (default) — the real multi-file website used above: `index.html` references `styles.css`, `roadmap-data.js`, `app.js`, and `data/month-*.json` as separate files. This is what's committed to the repo and deployed to Vercel.
- **`python3 build.py artifact [output_path]`** — a single self-contained HTML file with the CSS, data, and JS all inlined (no lazy loading — see Data chunking above). Needed only because Claude's Artifact publisher requires one self-contained file; this output is never committed to the repo (default path is one directory above the repo root).

Both modes are generated from the same source files (`src/template.html`, `src/styles.css` + Tailwind config, `src/app.js`, `src/roadmap_data.json`), so editing logic or styling only ever happens once, in `src/`.

## Progress sync, backup & restore

The single-file artifact build also works as a Claude Artifact: when opened through a published `claude.ai/code/artifact/...` link with the `db` capability declared, it syncs progress live across devices via `claude.use('db')`. The multi-file site (this repo's `index.html`, e.g. on Vercel) or any other standalone copy has no `window.claude`, so progress falls back to that browser's `localStorage` only — a small status pill in the header always shows which mode is active.

Since `localStorage` can be cleared or is device-specific, the toolbar's **Backup / Restore** button exports all local state (completed days, Pomodoro history, AI grader endpoint/model — never the API key) as a versioned, validated JSON file, and can restore from one. See `src/BACKUP_SCHEMA.md` for the full file schema and a matching REST/DB design for a future authenticated backend.

## Proctored practice exercises

Month 1 (Weeks 1-5, days 1-35) has real, gradable Listening/Reading/Writing/Speaking exercises that run full-screen with anti-cheat detection (leaving full-screen, switching tabs, or switching windows resets the attempt). If the browser's fullscreen request neither resolves nor rejects within 3 seconds (a real bug reproduced on the live deployment), the app degrades to a non-fullscreen "standard mode" attempt with a toast explaining why, rather than leaving the user stuck — see `requestFSWithTimeout()` in `app.js` and `test_fullscreen_fix.py`. Months 2-6 (days 36-180) show an accessible "Coming soon" placeholder instead of a Start button where exercise content hasn't been authored yet.

Speaking exercises can optionally be reviewed by a third-party AI service the user configures themselves (endpoint, API key, model) — never by this app or by Claude. The AI Grader settings modal has quick presets for OpenAI/Groq/Ollama, inline validation, and a "Test Connection" button; the API key is stored in `localStorage` or `sessionStorage` depending on a "remember on this device" toggle, and is never included in an exported backup file.
