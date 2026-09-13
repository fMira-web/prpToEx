'use client';

import { useEffect, useState } from 'react';
import type { ToastItem, ToastType } from '../lib/types';
import { useRoadmap } from '../context/RoadmapContext';

const TOAST_STYLES: Record<ToastType, { wrap: string; icon: string }> = {
  info: { wrap: 'border-brand-sky/35 bg-brand-sky/10', icon: 'ℹ️' },
  success: { wrap: 'border-brand-emerald/35 bg-brand-emerald/10', icon: '✅' },
  warning: { wrap: 'border-brand-amber/35 bg-brand-amber/10', icon: '⚠️' },
  error: { wrap: 'border-brand-rose/35 bg-brand-rose/10', icon: '⛔' },
};

function Toast({ toast, onRemove }: { toast: ToastItem; onRemove: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  useEffect(() => {
    const t = setTimeout(remove, toast.durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function remove() {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 220);
  }

  return (
    <div
      role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
      className={
        (leaving ? 'toast-pop-out' : 'toast-pop') +
        ' pointer-events-auto max-w-sm w-full sm:w-auto glass-strong border ' +
        style.wrap +
        ' rounded-xl px-4 py-3 shadow-card flex items-start gap-2.5 text-[12.5px] leading-snug text-slate-100'
      }
    >
      <span className="shrink-0 text-[14px] leading-none mt-0.5" aria-hidden="true">
        {style.icon}
      </span>
      <span className="flex-1">{toast.message}</span>
      <button type="button" onClick={remove} aria-label="Dismiss notification" className="focus-ring shrink-0 text-slate-400 hover:text-white text-sm leading-none">
        ✕
      </button>
    </div>
  );
}

/** Toast host — ported 1:1 from the TOAST NOTIFICATIONS section. */
export default function ToastContainer() {
  const { toasts, dismissToast } = useRoadmap();
  return (
    <div aria-live="polite" className="fixed z-[100] bottom-4 right-4 left-4 sm:left-auto flex flex-col items-stretch sm:items-end gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={dismissToast} />
      ))}
    </div>
  );
}
