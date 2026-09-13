'use client';

import { useState, FormEvent } from 'react';
import { useRoadmap } from '../context/RoadmapContext';

type Mode = 'login' | 'register';

// Minimal account UI wired to the auth API (app/api/auth/*). Floats over the
// app rather than living inside the roadmap markup. `user`/`refreshUser` now
// live in RoadmapContext (Block 2) instead of a local fetch here, so the
// same "who's signed in" state also drives DayProgress/ExerciseAttempt sync
// — see RoadmapContext.tsx's pull-then-merge-then-push effect.
export default function AuthBar() {
  const { user: me, refreshUser } = useRoadmap();
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mode === 'register' ? { email, password, name: name || undefined } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так');
        return;
      }
      setModalOpen(false);
      setPassword('');
      await refreshUser();
    } catch {
      setError('Не удалось связаться с сервером');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      await refreshUser();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center">
      {me === undefined ? null : me ? (
        <div className="auth-pill flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-slate-200">
          <span className="truncate max-w-[160px]">{me.name || me.email}</span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={busy}
            className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
          >
            Выйти
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
            setModalOpen(true);
          }}
          className="auth-pill rounded-full px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-white/5"
        >
          Войти
        </button>
      )}

      {modalOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={mode === 'login' ? 'Вход' : 'Регистрация'}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setModalOpen(false);
          }}
        >
          <div className="glass-strong w-full max-w-sm rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-slate-100">
                {mode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Закрыть"
                className="rounded-full p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === 'register' && (
                <label className="flex flex-col gap-1 text-xs text-slate-400">
                  Имя (необязательно)
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus-ring outline-none"
                  />
                </label>
              )}
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus-ring outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                Пароль
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus-ring outline-none"
                />
              </label>

              {error && <p className="text-xs text-brand-rose">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary mt-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {busy ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="text-center text-xs text-slate-400 hover:text-slate-200"
              >
                {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
