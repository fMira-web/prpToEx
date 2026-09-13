'use client';

import type { ExerciseQuestion } from '../../lib/types';
import { normalizeQuestion, type GradeResult } from '../../lib/helpers';

/** Ported 1:1 from renderQuestionsHTML() — shared by Listening + Reading. */
export default function QuestionList({
  questions,
  given,
  onAnswer,
  graded,
}: {
  questions: ExerciseQuestion[];
  given: Record<string, string | number | null | undefined>;
  onAnswer: (id: string, val: string | number) => void;
  graded: GradeResult | null;
}) {
  return (
    <div>
      {questions.map(normalizeQuestion).map((q) => {
        const fb = graded?.perQuestion.find((p) => p.id === q.id);
        const feedback = fb ? (
          fb.isCorrect ? (
            <span className="text-brand-emerald">✓ Correct</span>
          ) : (
            <span className="text-brand-rose">✗ Correct answer: {fb.correctText}</span>
          )
        ) : null;

        if (q.type === 'gap') {
          return (
            <div key={q.id} className="mb-3.5">
              <label className="block text-[12.5px] text-slate-300 mb-1.5">{q.prompt}</label>
              <input
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={String(given[q.id] ?? '')}
                onChange={(e) => onAnswer(q.id, e.target.value)}
                className="focus-ring w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-[13px] text-slate-100"
              />
              <div className="mt-1 text-[11.5px]">{feedback}</div>
            </div>
          );
        }

        return (
          <div key={q.id} className="mb-3.5">
            <div className="text-[12.5px] text-slate-300 mb-1.5">{q.prompt}</div>
            <div className="flex flex-col gap-0.5">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 py-1 text-[12.5px] text-slate-300 cursor-pointer">
                  <input type="radio" name={'mcq-' + q.id} checked={given[q.id] === i} onChange={() => onAnswer(q.id, i)} className="accent-emerald-400" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <div className="mt-1 text-[11.5px]">{feedback}</div>
          </div>
        );
      })}
    </div>
  );
}
