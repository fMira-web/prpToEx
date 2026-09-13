'use client';

/** Ported 1:1 from renderCheatScreen(). */
export default function ExerciseCheatScreen({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-rose/15 border border-brand-rose/30 grid place-items-center text-2xl mb-4">🚫</div>
      <div className="font-display font-bold text-xl mb-2 text-brand-rose">Attempt reset</div>
      <p className="text-slate-400 text-[13px] leading-relaxed mb-6">
        Looks like you left full-screen, or switched tabs or windows, during the exercise — were you trying to cheat? To keep practice honest, this
        attempt has been cleared. Stay in full-screen and on this tab until you submit.
      </p>
      <button type="button" onClick={onRetry} className="focus-ring px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-100 font-semibold text-[13px]">
        Try Again
      </button>
      <div className="mt-4">
        <button type="button" onClick={onClose} className="text-[12px] text-slate-500 hover:text-slate-300">
          Close
        </button>
      </div>
    </div>
  );
}
