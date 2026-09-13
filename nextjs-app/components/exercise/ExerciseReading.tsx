'use client';

import { useState } from 'react';
import type { ReadingExercise } from '../../lib/types';
import { gradeQuestions, type GradeResult } from '../../lib/helpers';
import ExerciseHeader from './ExerciseHeader';
import CompletionFooter from './CompletionFooter';
import QuestionList from './QuestionList';

/** Ported 1:1 from renderReading() — graded-questions mode + skim/self-summary mode. */
export default function ExerciseReading({
  dayNum,
  exercise,
  onClose,
  onFinish,
}: {
  dayNum: number;
  exercise: ReadingExercise;
  onClose: () => void;
  onFinish: () => void;
}) {
  const [given, setGiven] = useState<Record<string, string | number>>({});
  const [graded, setGraded] = useState<GradeResult | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  if (exercise.questions && exercise.questions.length) {
    function handleSubmit() {
      setGraded(gradeQuestions(exercise.questions!, given));
    }
    return (
      <>
        <ExerciseHeader skill="reading" dayNum={dayNum} title={exercise.title || exercise.taskType} onClose={onClose} />
        {exercise.instructions && <p className="text-[12.5px] text-brand-amber/90 mb-3">{exercise.instructions}</p>}
        <div className="font-display font-semibold text-[14px] mb-2">{exercise.title}</div>
        <div className="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 mb-5">
          {exercise.passage.map((p, i) => (
            <p key={i} className="text-[13px] text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
        <QuestionList questions={exercise.questions} given={given} onAnswer={(id, val) => setGiven((prev) => ({ ...prev, [id]: val }))} graded={graded} />
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

  // Skim + self-summary mode (no auto-graded questions).
  return (
    <>
      <ExerciseHeader skill="reading" dayNum={dayNum} title={exercise.title || exercise.taskType} onClose={onClose} />
      <p className="text-[12.5px] text-brand-amber/90 mb-4">{exercise.instructions}</p>
      {exercise.passage.map((p, i) => {
        const summary = exercise.modelSummaries?.[i] || '';
        const isRevealed = revealed.has(i);
        return (
          <div key={i} className="rounded-xl bg-black/20 border border-white/10 px-4 py-3.5 mb-3.5">
            <div className="text-[10.5px] uppercase tracking-wide text-slate-500 mb-1.5">Paragraph {i + 1}</div>
            <p className="text-[13px] text-slate-300 leading-relaxed mb-3">{p}</p>
            <label className="block text-[11.5px] text-slate-400 mb-1">Your one-sentence summary:</label>
            <input type="text" className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100 mb-2" />
            {summary && (
              <button
                type="button"
                onClick={() => setRevealed((prev) => new Set(prev).add(i))}
                className="text-[11.5px] text-brand-sky hover:underline"
              >
                Show model summary
              </button>
            )}
            {summary && isRevealed && <div className="mt-1.5 text-[12px] text-slate-400 italic">{summary}</div>}
          </div>
        );
      })}
      <CompletionFooter dayNum={dayNum} extraLabel="When you’ve summarised every paragraph, mark the day complete." onFinish={onFinish} />
    </>
  );
}
