'use client';

import { useEffect, useRef, useState } from 'react';
import type { ListeningExercise } from '../../lib/types';
import { gradeQuestions, type GradeResult } from '../../lib/helpers';
import { speakSegments, stopSpeaking } from '../../lib/tts';
import ExerciseHeader from './ExerciseHeader';
import CompletionFooter from './CompletionFooter';
import QuestionList from './QuestionList';
import { PlayIcon } from '../Icons';

/** Ported 1:1 from renderListening(). */
export default function ExerciseListening({
  dayNum,
  exercise,
  onClose,
  onFinish,
}: {
  dayNum: number;
  exercise: ListeningExercise;
  onClose: () => void;
  onFinish: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Press play to hear the recording. The voice is synthesised in your browser.');
  const [given, setGiven] = useState<Record<string, string | number>>({});
  const [graded, setGraded] = useState<GradeResult | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  function handlePlay() {
    setPlaying(true);
    startedRef.current = true;
    setAudioStatus('Playing…');
    speakSegments(exercise.segments, exercise.voiceHint, () => {
      setPlaying(false);
      setAudioStatus('Finished. Press play again to replay.');
    });
  }

  function handleSubmit() {
    setGraded(gradeQuestions(exercise.questions, given));
  }

  return (
    <>
      <ExerciseHeader skill="listening" dayNum={dayNum} title={exercise.title || exercise.taskType} onClose={onClose} />
      <p className="text-[13px] text-slate-300 leading-relaxed mb-4">{exercise.instructions}</p>
      <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 mb-5 flex items-center gap-3">
        <button
          type="button"
          disabled={playing}
          onClick={handlePlay}
          className="focus-ring shrink-0 w-11 h-11 rounded-full btn-primary grid place-items-center shadow-glowEmerald"
        >
          <PlayIcon className="w-5 h-5" />
        </button>
        <div className="text-[12.5px] text-slate-400">{audioStatus}</div>
      </div>
      {exercise.predictionMode && (
        <div className="text-[11.5px] text-brand-amber/90 mb-3">
          Fill in your predicted answers first, then press play — predictions aren’t graded, only your final answers after listening are.
        </div>
      )}
      {exercise.formTitle && <div className="font-display font-semibold text-[13.5px] mb-2.5">{exercise.formTitle}</div>}
      <QuestionList
        questions={exercise.questions}
        given={given}
        onAnswer={(id, val) => setGiven((prev) => ({ ...prev, [id]: val }))}
        graded={graded}
      />
      <button type="button" onClick={handleSubmit} className="focus-ring mt-2 px-5 py-2.5 rounded-xl btn-primary font-semibold text-[13px]">
        Submit Answers
      </button>
      {graded && (
        <div className="mt-4">
          <div className="rounded-xl bg-black/25 border border-white/10 px-4 py-3.5 mb-3">
            <span className="font-display font-bold text-lg">
              {graded.correct}/{graded.total}
            </span>{' '}
            <span className="text-slate-400 text-[12.5px]">correct</span>
          </div>
          <CompletionFooter dayNum={dayNum} onFinish={onFinish} />
        </div>
      )}
    </>
  );
}
