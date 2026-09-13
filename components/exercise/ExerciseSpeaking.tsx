'use client';

import { useEffect, useRef, useState } from 'react';
import type { SpeakingExercise } from '../../lib/types';
import { loadAiConfig, requestAiFeedback, type SpeakingRecord } from '../../lib/aiGrader';
import { useRoadmap } from '../../context/RoadmapContext';
import ExerciseHeader from './ExerciseHeader';
import CompletionFooter from './CompletionFooter';

type Stage = 'prompt' | 'prep' | 'recording' | 'micError' | 'itemDone' | 'review';

/**
 * Ported 1:1 from renderSpeaking()/beginPrep()/beginRecording()/showItemDone()
 * /renderReview()/requestAiFeedback(). The legacy version tracked mic
 * streams, the MediaRecorder and SpeechRecognition in module-level globals
 * cleared by a manual stopAllMedia(); here they live in refs local to this
 * component and are torn down by the unmount effect below, which React
 * guarantees runs when the exercise closes or the cheat-screen replaces it
 * — same guarantee, less bookkeeping.
 */
export default function ExerciseSpeaking({
  dayNum,
  exercise,
  onClose,
  onFinish,
  onGrace,
}: {
  dayNum: number;
  exercise: SpeakingExercise;
  onClose: () => void;
  onFinish: () => void;
  onGrace: (ms: number) => void;
}) {
  const { aiConfigVersion, setAiConfigOpen, recordExerciseAttempt } = useRoadmap();
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('prompt');
  const [remaining, setRemaining] = useState(0);
  const [records, setRecords] = useState<(SpeakingRecord | undefined)[]>([]);
  const [reflection, setReflection] = useState('');
  const [aiFeedback, setAiFeedback] = useState<{ status: 'idle' | 'loading' | 'done' | 'error'; text?: string; error?: string }>({ status: 'idle' });

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcriptRef = useRef<string[]>([]);
  const cancelledRef = useRef(false);
  const finishedRef = useRef(false);

  const item = exercise.items[idx];

  function teardownMedia() {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    } catch {
      /* ignore */
    }
    try {
      recognitionRef.current && recognitionRef.current.stop();
    } catch {
      /* ignore */
    }
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {
      /* ignore */
    }
  }

  useEffect(
    () => () => {
      cancelledRef.current = true;
      teardownMedia();
    },
    []
  );

  /* ---- prep countdown ---- */
  useEffect(() => {
    if (stage !== 'prep') return;
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [stage]);
  useEffect(() => {
    if (stage === 'prep' && remaining <= 0) beginRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, remaining]);

  /* ---- recording countdown ---- */
  useEffect(() => {
    if (stage !== 'recording') return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [stage]);
  useEffect(() => {
    if (stage === 'recording' && remaining <= 0) finishRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, remaining]);

  function beginPrep() {
    setStage('prep');
    setRemaining(item.prepSeconds);
  }

  function beginRecording() {
    finishedRef.current = false;
    onGrace(1500); // the mic-permission prompt can blur the window
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelledRef.current) {
          try {
            stream.getTracks().forEach((t) => t.stop());
          } catch {
            /* ignore */
          }
          return;
        }
        streamRef.current = stream;
        chunksRef.current = [];
        transcriptRef.current = [];
        let mr: MediaRecorder | null = null;
        try {
          mr = new MediaRecorder(stream);
        } catch {
          mr = null;
        }
        recorderRef.current = mr;
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SR) {
          const recognition = new SR();
          recognition.lang = 'en-US';
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = (e: any) => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
              if (e.results[i].isFinal) transcriptRef.current.push(e.results[i][0].transcript);
            }
          };
          try {
            recognition.start();
          } catch {
            /* ignore */
          }
          recognitionRef.current = recognition;
        }
        if (mr) {
          mr.ondataavailable = (e) => {
            if (e.data.size) chunksRef.current.push(e.data);
          };
          mr.start();
        }
        setStage('recording');
        setRemaining(item.speakSeconds);
      })
      .catch(() => {
        if (cancelledRef.current) return;
        setStage('micError');
      });
  }

  function finishRecording() {
    if (finishedRef.current || cancelledRef.current) return;
    finishedRef.current = true;
    const mr = recorderRef.current;
    const recognition = recognitionRef.current;
    const stream = streamRef.current;
    if (mr && mr.state !== 'inactive') mr.stop();
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    }
    try {
      stream?.getTracks().forEach((t) => t.stop());
    } catch {
      /* ignore */
    }
    const finalizeRecord = (blobUrl: string | null) => {
      const rec: SpeakingRecord = { blobUrl, transcript: transcriptRef.current.join(' ') };
      setRecords((prev) => {
        const next = [...prev];
        next[idx] = rec;
        return next;
      });
      setStage('itemDone');
    };
    if (mr) {
      setTimeout(() => {
        if (cancelledRef.current) return;
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          finalizeRecord(URL.createObjectURL(blob));
        } catch {
          finalizeRecord(null);
        }
      }, 250);
    } else {
      finalizeRecord(null);
    }
  }

  function handleContinueWithoutMic() {
    setRecords((prev) => {
      const next = [...prev];
      next[idx] = { blobUrl: null, transcript: '' };
      return next;
    });
    setStage('itemDone');
  }

  function handleNext() {
    const isLast = idx === exercise.items.length - 1;
    if (isLast) setStage('review');
    else {
      setIdx((i) => i + 1);
      setStage('prompt');
    }
  }

  async function handleGetAiFeedback() {
    setAiFeedback({ status: 'loading' });
    try {
      const text = await requestAiFeedback(exercise, records);
      setAiFeedback({ status: 'done', text });
    } catch (err: any) {
      setAiFeedback({ status: 'error', error: err && err.message ? err.message : String(err) });
    }
  }

  const isLast = idx === exercise.items.length - 1;

  // Speaking has no numeric auto-grader, but it DOES sometimes have a real
  // AI-estimated band (when the user configured a grader and requested
  // feedback) — pass whatever is available through to the history table.
  function handleFinishReview() {
    recordExerciseAttempt(dayNum, 'speaking', {
      answers: { reflection, transcripts: records.map((r) => r?.transcript || '') },
      aiFeedback: aiFeedback.status === 'done' ? aiFeedback.text : undefined,
    });
    onFinish();
  }

  if (stage === 'review') {
    // aiConfigVersion is read here purely to force a re-render (and thus a
    // fresh loadAiConfig() read) right after AI Grader settings are saved —
    // mirrors the legacy 'ai-config-saved' CustomEvent listener.
    void aiConfigVersion;
    const cfg = loadAiConfig();
    const configured = !!(cfg.endpoint && cfg.apiKey);
    return (
      <>
        <ExerciseHeader skill="speaking" dayNum={dayNum} title={exercise.title} onClose={onClose} />
        <div className="text-[13px] text-slate-300 mb-2">All {exercise.items.length} response(s) recorded.</div>
        {exercise.reflectionPrompt && (
          <>
            <label className="block text-[12px] text-slate-400 mb-1.5 mt-4">{exercise.reflectionPrompt}</label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100"
            />
          </>
        )}
        <div className="mt-5 rounded-xl bg-gradient-to-br from-brand-indigo/10 to-transparent border border-brand-indigo/25 px-4 py-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-indigo">AI Speaking Review</div>
            <button type="button" onClick={() => setAiConfigOpen(true)} className="text-[11px] text-slate-400 hover:text-slate-200 underline">
              {configured ? 'Change AI settings' : 'Set up AI grader'}
            </button>
          </div>
          {configured ? (
            <button
              type="button"
              disabled={aiFeedback.status === 'loading'}
              onClick={handleGetAiFeedback}
              className="focus-ring px-4 py-2.5 rounded-lg btn-primary font-semibold text-[12.5px] disabled:opacity-60"
            >
              {aiFeedback.status === 'loading' ? 'Requesting feedback…' : 'Get AI Feedback'}
            </button>
          ) : (
            <div className="text-[12px] text-slate-500">
              Not configured yet. This uses a third-party AI service of your choice (NOT Claude) — click “Set up AI grader” and enter its API
              endpoint, key and model.
            </div>
          )}
          <div className="mt-3">
            {aiFeedback.status === 'done' && (
              <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 text-[12.5px] text-slate-200 leading-relaxed whitespace-pre-line">
                {aiFeedback.text}
              </div>
            )}
            {aiFeedback.status === 'error' && <div className="text-[12px] text-brand-rose">Could not get feedback: {aiFeedback.error}</div>}
          </div>
        </div>
        <CompletionFooter dayNum={dayNum} onFinish={handleFinishReview} />
      </>
    );
  }

  return (
    <>
      <ExerciseHeader skill="speaking" dayNum={dayNum} title={exercise.title} onClose={onClose} />
      <p className="text-[12.5px] text-slate-400 mb-4">{exercise.instructions}</p>
      <div className="text-[11px] text-slate-500 mb-1.5">
        Question {idx + 1} of {exercise.items.length}
      </div>
      <div className="rounded-xl bg-black/20 border border-white/10 px-4 py-4 mb-5">
        <div className="font-display font-semibold text-[15px] text-slate-100">{item.prompt}</div>
      </div>

      <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-6 text-center">
        {stage === 'prompt' && (
          <button type="button" onClick={beginPrep} className="focus-ring px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">
            Get Ready ({item.prepSeconds}s) &amp; Record
          </button>
        )}
        {stage === 'prep' && (
          <>
            <div className="text-[12px] text-slate-400 mb-2">Get ready…</div>
            <div className="font-display font-extrabold text-3xl num-pill">{remaining}</div>
          </>
        )}
        {stage === 'recording' && (
          <>
            <div className="flex items-center justify-center gap-2 mb-2 text-brand-rose">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-rose rec-pulse" />
              <span className="text-[12px] font-semibold">Recording</span>
            </div>
            <div className="font-display font-extrabold text-3xl num-pill">{remaining}</div>
            <button type="button" onClick={finishRecording} className="focus-ring mt-3 text-[11.5px] text-slate-400 hover:text-slate-200 underline">
              Stop early
            </button>
          </>
        )}
        {stage === 'micError' && (
          <>
            <div className="text-[12.5px] text-brand-rose">
              Microphone access was denied or unavailable — you can still continue, but this response won’t be recorded.
            </div>
            <button
              type="button"
              onClick={handleContinueWithoutMic}
              className="focus-ring mt-3 px-4 py-2 rounded-lg bg-white/10 text-[12.5px]"
            >
              Continue
            </button>
          </>
        )}
      </div>

      {stage === 'itemDone' && (
        <div className="mt-4">
          <div className="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5">
            <div className="text-brand-emerald text-[12.5px] font-semibold mb-1">Recorded ✓</div>
            {records[idx]?.blobUrl && <audio controls src={records[idx]!.blobUrl!} className="w-full mt-3" />}
            {records[idx]?.transcript ? (
              <div className="mt-3 text-[12px] text-slate-400">
                <span className="text-slate-500">Auto transcript:</span> <span className="italic">{records[idx]!.transcript}</span>
              </div>
            ) : (
              <div className="mt-3 text-[11.5px] text-slate-500">No automatic transcript available in this browser.</div>
            )}
          </div>
          <button type="button" onClick={handleNext} className="focus-ring mt-3 px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">
            {isLast ? 'Continue' : 'Next Question'}
          </button>
        </div>
      )}
    </>
  );
}
