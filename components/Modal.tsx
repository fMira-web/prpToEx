'use client';

import React, { useEffect } from 'react';

/**
 * Shared modal shell for the About / AI Grader / Backup / Pomodoro dialogs.
 *
 * The legacy app.js modals were plain `<div class="hidden ...">` elements
 * toggled with classList — no `role`, no `aria-modal`, no Escape-to-close.
 * This component keeps that exact visual/DOM pattern (always mounted,
 * visibility via a class) so state like the running Pomodoro timer isn't
 * lost when a modal closes, but adds the accessibility semantics that were
 * flagged as missing in the original a11y audit: role="dialog",
 * aria-modal="true", and an Escape key handler, on every modal for free.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  maxWidth = 'max-w-md',
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={'fixed inset-0 z-50 modal-backdrop grid place-items-center p-4' + (open ? '' : ' hidden')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={'glass-strong rounded-2xl w-full p-6 shadow-card fade-in max-h-[90vh] overflow-y-auto ' + maxWidth}
      >
        {children}
      </div>
    </div>
  );
}
