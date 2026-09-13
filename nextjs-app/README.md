# IELTS Roadmap — Next.js migration

The full conversion of the static site (`ielts-roadmap/`) into a real Next.js 14 (App Router) application, including a **full React rewrite of the ~2,175-line `app.js`** — not just a wrapper around it. This is the actual migration, not a plan for one — but it has **not been built/run** in the sandbox this was written in (see "Why this wasn't build-verified" below), so treat the first `npm install && npm run build` on your machine as the real first test.

## What changed vs. the static site

- **Same visible app, real React underneath.** Every piece of `app.js` — data loading, progress tracking, search/filters, the accordion tree, backup/restore, the AI grader settings, the Pomodoro timer, and the full proctored exercise runner (fullscreen anti-cheat, Listening/Reading/Writing/Speaking) — is now a typed React component or hook instead of direct DOM manipulation. Visually and functionally this should be indistinguishable from the current Vercel deployment; see "Migration strategy" below for how fidelity was checked without being able to run a real build.
- **Real backend, for real this time.** `app/api/auth/{register,login,logout,refresh,me}` plus `prisma/schema.prisma` (`User`, `RefreshToken`, `DayProgress`, `ExerciseAttempt`, `PomodoroLog`, `PushSubscription`) are wired in and buildable. Progress itself still reads/writes `localStorage` only (see "Explicitly not in this drop").
- **A working account UI.** `components/AuthBar.tsx` — a floating pill (top-right) that shows "Войти" when signed out, opens a login/register modal, and shows the signed-in user + a "Выйти" button otherwise.
- **Tailwind compiles through Next's own pipeline**, not the old standalone `build.py` + Tailwind-CLI step.
- **A few incidental accessibility fixes** that fell out of the rewrite rather than being separately implemented: every modal (`components/Modal.tsx`) now has `role="dialog"`, `aria-modal="true"`, and closes on Escape — none of that existed in the original `class="hidden"`-toggled `<div>`s.

## Migration strategy: from "lift the markup" to a real rewrite

An earlier drop of this Next.js app took the "strangler fig" approach: `app.js` and the body markup were lifted into the app unchanged (via `dangerouslySetInnerHTML` + `<script src="/app.js">`), on the reasoning that a full hand-rewrite of tested, working code — with no way to run or test it in the sandbox that wrote it — was pure typo risk for zero visible change.

This drop does the full rewrite anyway, because that's what was explicitly asked for. To keep the risk that reasoning was worried about as low as possible, the port was done as a close **translation**, not a redesign:

- Every function in `app.js` (the original is kept at `ielts-roadmap/src/app.js` for reference) maps to a specific hook or component — `weekProgress()`/`monthProgress()`/`overallProgress()` → `lib/helpers.ts`, `buildDayDetailHTML()` → `components/DayDetail.tsx`, `renderSpeaking()` → `components/exercise/ExerciseSpeaking.tsx`, and so on — rather than being reorganised around a different architecture.
- All state (`completed`, search/filters, accordion open/closed, the Pomodoro timer, backup/restore, AI grader config, the exercise runner's fullscreen state machine) was moved into `context/RoadmapContext.tsx` as the direct equivalent of `app.js`'s module-level `var`s, so the shape of "what depends on what" didn't change, only how it's stored.
- A few places genuinely are better served by React's model than a literal translation, and were done that way instead of forced into an unnatural shape: the exercise runner's per-attempt cleanup (stopping `MediaRecorder`/`SpeechRecognition`/timers) now happens via `useEffect` unmount cleanup instead of a manually-tracked `stopAllMedia()` — React guarantees that cleanup runs; the old code had to remember to call it. The day-by-day "only build this DOM once you open it" trick (`renderedDetail`) is now just "only mount `<DayDetail>` once you've opened it once" (`components/DayRow.tsx`), which is the idiomatic React version of the same optimization.
- Data loading keeps the exact same contract: Month 1 + the tiny cross-month `meta.json` are read server-side in `app/page.tsx` and passed down as props (replacing the old `window.ROADMAP_META`/`window.ROADMAP_MONTH1_DAYS` globals set by a `<script>` tag), and Months 2-6 are still fetched lazily from `public/data/month-N.json` after first paint, unchanged.

## Tailwind: now compiled by Next's own pipeline

The static-site build had its own standalone step (`build.py` calling the Tailwind CLI directly, config in `src/tailwind.config.js`) because there was no bundler to hook into. Next.js has PostCSS built in, so `tailwind.config.js` + `postcss.config.js` + `@tailwind` directives in `app/globals.css` replace that step — same theme extension (colors, fonts, keyframes), copied over unchanged. Some class names are still assembled from full literal strings inside `.tsx` files (e.g. the per-skill color maps in `components/FilterChips.tsx`, or the workout-card ring colors in `components/WorkoutCard.tsx`) rather than written as static JSX — Tailwind's scanner reads `.tsx` files as plain text and picks up any full class-name substring wherever it appears, the same mechanism the old `app.js`/`build.py` pair relied on.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, DIRECT_URL, JWT_ACCESS_SECRET — see that file's comments
npx prisma migrate dev --name init
npm run dev                  # http://localhost:3000
```

Deploying to Vercel: same repo, but point the Vercel project's root directory at wherever you place this (see "Where this lives" below), add the three env vars in Project Settings, and set the build command to `prisma generate && next build` (already the default `npm run build` in `package.json`).

## Where this lives relative to the existing repo

This was built as a **separate folder** (`ielts-nextjs/`, alongside the existing static-site repo), not a replacement of it in place. That's deliberate: the static site is your live, working `prp-to-ex.vercel.app` deployment, and this hasn't been build-tested yet (see below) — swapping it in blind would risk breaking production over something as small as a typo this environment couldn't catch. Recommended path:

1. Run `npm install && npm run dev` here, click through it — search/filters, expand/collapse, checking days off, the Pomodoro timer, Backup/Restore export+import, the AI Grader settings (including "Test Connection" against a real endpoint if you have one), and at least one full Day-1 exercise per skill (Listening/Reading/Writing/Speaking) including the "leave fullscreen mid-exercise" cheat-detection path — and confirm it matches the live site.
2. Once you're happy, either point a new Vercel project at this folder (cheapest way to test a real deploy without touching the live one), or replace the static-site repo's contents with this folder's contents and push — your call once you've seen it run.

## Why this wasn't build-verified

`npm install` needs `registry.npmjs.org`, and that host returns `403 Forbidden` from every place this session can run shell commands — confirmed with a plain `curl`, not just `npm`'s own error. There was no working path to the npm registry anywhere available, so nothing here could actually be `npm install`ed or `next build`t before delivery.

What that means practically: the `.ts`/`.tsx` files were checked with the TypeScript compiler against a small hand-written set of stand-in type declarations for `react`/`next` (since the real `@types/react` package is also blocked by the same registry restriction) — enough to catch real mistakes (and it did: an import bug in `BackupModal.tsx` was caught and fixed this way), but **not** a substitute for a real build against the actual React/Next type definitions. Every piece of exercise-runner logic (the fullscreen timeout race, the anti-cheat listeners, the Speaking recorder's `MediaRecorder`/`SpeechRecognition` handling) was traced by hand against the original `app.js` rather than exercised in a browser. The *first* real build/run of this whole thing will be `npm install && npm run dev` on your machine. If anything errors or behaves differently from the live site, paste it back and it gets fixed immediately — a rewrite this size having zero issues on the very first real run would be unusual, and the exercise runner (the most stateful, timing-sensitive part) is the most likely place for something to need a second pass.

## Explicitly not in this drop

- `/api/progress`, `/api/exercise-attempts` — reading/writing `DayProgress`/`ExerciseAttempt` from the frontend (still using `localStorage` for now).
- Days 36-180 real exercise content (the "Coming soon" placeholders are preserved exactly as before).
- PWA/offline, light theme, a dedicated mobile audit, PDF export, email/push reminders, a TTS provider swap (ElevenLabs/Google Cloud TTS/Amazon Polly instead of the browser's built-in `speechSynthesis`), and CI/CD (GitHub Actions running Playwright before Vercel deploy) — all still queued from the original backlog, unstarted.
