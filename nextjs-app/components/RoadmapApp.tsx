'use client';

import { useEffect } from 'react';
import type { Day, RoadmapMeta } from '../lib/types';
import { RoadmapProvider } from '../context/RoadmapContext';
import { primeVoices } from '../lib/tts';
import Header from './Header';
import Toolbar from './Toolbar';
import MonthStrip from './MonthStrip';
import RoadmapTree from './RoadmapTree';
import AboutModal from './AboutModal';
import AiConfigModal from './AiConfigModal';
import BackupModal from './BackupModal';
import PomodoroModal from './PomodoroModal';
import ExerciseRunner from './exercise/ExerciseRunner';
import ToastContainer from './ToastContainer';

function AppShell() {
  useEffect(() => {
    primeVoices();
  }, []);

  return (
    <>
      <Header />
      <Toolbar />
      <MonthStrip />
      <RoadmapTree />

      <AboutModal />
      <AiConfigModal />
      <BackupModal />
      <PomodoroModal />
      <ExerciseRunner />
      <ToastContainer />

      <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="divider-fade mb-6" />
        <p className="text-[11.5px] text-slate-500 leading-relaxed max-w-xl mx-auto">
          Built for a 6-month B2 → C1 IELTS journey · Progress is saved locally in this browser · No account or upload required
        </p>
      </footer>
    </>
  );
}

/**
 * Top-level client entry point — the full React port of the legacy
 * app.js/template.html. Rendered client-only (see app/page.tsx's dynamic
 * import with ssr:false): every piece of state here ultimately reads from
 * localStorage or a browser-only API (fullscreen, media devices, speech),
 * so there is nothing useful to server-render, and skipping SSR for this
 * component sidesteps any localStorage/server-HTML mismatch entirely.
 */
export default function RoadmapApp({ meta, initialMonth1Days }: { meta: RoadmapMeta; initialMonth1Days: Day[] }) {
  return (
    <RoadmapProvider meta={meta} initialMonth1Days={initialMonth1Days}>
      <AppShell />
    </RoadmapProvider>
  );
}
