'use client';

/** Ported 1:1 from completionFooterHTML(). */
export default function CompletionFooter({ dayNum, extraLabel, onFinish }: { dayNum: number; extraLabel?: string; onFinish: () => void }) {
  return (
    <div className="mt-6 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 px-4 py-3.5 flex items-center justify-between gap-3 flex-wrap">
      <div className="text-[12.5px] text-slate-200">{extraLabel || 'Nice work — you can mark today’s day complete from here.'}</div>
      <button type="button" onClick={onFinish} className="focus-ring shrink-0 px-4 py-2 rounded-lg btn-primary text-[12.5px] font-semibold">
        Mark Day {dayNum} Complete &amp; Close
      </button>
    </div>
  );
}
