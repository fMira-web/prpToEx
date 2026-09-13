'use client';

import { useRoadmap } from '../context/RoadmapContext';
import Modal from './Modal';

/** "About this plan" panel — ported 1:1 from the ABOUT MODAL block. */
export default function AboutModal() {
  const { aboutOpen, setAboutOpen } = useRoadmap();
  return (
    <Modal open={aboutOpen} onClose={() => setAboutOpen(false)} labelledBy="about-modal-title" maxWidth="max-w-lg">
      <div className="flex items-start justify-between gap-4">
        <h3 id="about-modal-title" className="font-display font-bold text-lg grad-text">
          Methodology &amp; Design
        </h3>
        <button type="button" onClick={() => setAboutOpen(false)} className="focus-ring text-slate-400 hover:text-white text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="mt-3 space-y-2.5 text-[13px] text-slate-300 leading-relaxed">
        <p>
          This roadmap is built around the four official IELTS assessment criteria —{' '}
          <b className="text-slate-100">Task Achievement/Response, Coherence &amp; Cohesion, Lexical Resource</b> and{' '}
          <b className="text-slate-100">Grammatical Range &amp; Accuracy</b> (plus Pronunciation for Speaking) — using Cambridge's public band
          descriptor language for Bands 6-9 as the target bar for Band 7.5+.
        </p>
        <p>
          Grammar is drawn from a 24-point B2→C1 bank (inversion, cleft sentences, mixed conditionals, participle clauses, the subjunctive, and more)
          cycled in <b className="text-slate-100">three spaced passes</b>: recognition (Months 1-2), production in writing/speech (Months 3-4), and
          fluent timed mastery (Months 5-6) — reflecting spaced-repetition research on durable retention.
        </p>
        <p>
          Every day interleaves all four macro-skills (one deep-dive plus three lighter maintenance touches) rather than isolating a single skill,
          consistent with research on skill interleaving. Daily load is calibrated to roughly <b className="text-slate-100">1.5-2 hours</b>.
        </p>
        <p>
          Format details (4-part/40-question Listening, 3-passage/40-question Reading, Task 1 150 words/20 min, Task 2 250 words/40 min, 3-part
          Speaking) follow the official IELTS test structure.
        </p>
      </div>
      <button type="button" onClick={() => setAboutOpen(false)} className="focus-ring mt-5 w-full text-sm px-4 py-2.5 rounded-xl btn-primary font-semibold">
        Got it
      </button>
    </Modal>
  );
}
