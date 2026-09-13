'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useRoadmap } from '../../context/RoadmapContext';
import { exitFSIfAny, isFS, requestFSWithTimeout, FS_REQUEST_TIMEOUT_MS } from '../../lib/fullscreen';
import type { Day, SkillKey } from '../../lib/types';
import ExerciseGate from './ExerciseGate';
import ExerciseCheatScreen from './ExerciseCheatScreen';
import ExerciseListening from './ExerciseListening';
import ExerciseReading from './ExerciseReading';
import ExerciseWriting from './ExerciseWriting';
import ExerciseSpeaking from './ExerciseSpeaking';

type Phase = 'gate' | 'cheat' | 'running';

/**
 * One attempt's state machine — ported 1:1 from openExercise()/renderGate()/
 * renderCheatScreen()/onPotentialCheat()/closeExercise(). Remounted (via the
 * `key` set by the parent) every time a new day/skill is opened, so every
 * ref below starts fresh per attempt exactly like the legacy per-open globals.
 */
function ExerciseRunnerActive({ day, skill, fsTarget }: { day: Day; skill: SkillKey; fsTarget: RefObject<HTMLDivElement> }) {
  const { closeExercise, markDayComplete, showToast } = useRoadmap();
  const [phase, setPhase] = useState<Phase>('gate');
  const phaseRef = useRef<Phase>('gate');
  const fsStrictRef = useRef(false);
  const graceUntilRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  function grace(ms = 900) {
    graceUntilRef.current = Date.now() + ms;
  }
  function inGrace() {
    return Date.now() < graceUntilRef.current;
  }

  // Always exit fullscreen when this attempt goes away, however that
  // happens (close button, completion, cheat detection, or the parent
  // unmounting us because the exercise closed some other way).
  useEffect(() => () => exitFSIfAny(), []);

  // Anti-cheat only applies to attempts actually running in strict
  // fullscreen mode — an attempt that gracefully degraded to standard mode
  // (see handleStart) was never fullscreen-locked, so there is nothing to
  // "exit" and these signals would just be noise.
  useEffect(() => {
    function onPotentialCheat() {
      if (phaseRef.current !== 'running' || !fsStrictRef.current || inGrace()) return;
      fsStrictRef.current = false;
      exitFSIfAny();
      setPhase('cheat');
    }
    function onFsChange() {
      if (fsStrictRef.current && !isFS()) onPotentialCheat();
    }
    function onVisibility() {
      if (fsStrictRef.current && document.hidden) onPotentialCheat();
    }
    function onBlur() {
      if (fsStrictRef.current) onPotentialCheat();
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  function handleStart() {
    grace(1000);
    const el = fsTarget.current;
    if (!el) return;
    requestFSWithTimeout(el, FS_REQUEST_TIMEOUT_MS).then(
      () => {
        fsStrictRef.current = true;
        grace(700);
        setPhase('running');
      },
      (err) => {
        // Fullscreen either rejected (permissions/user-gesture issue) or the
        // promise hung past FS_REQUEST_TIMEOUT_MS (the reproduced bug this
        // fixes). Either way: never leave the user stuck on the gate screen —
        // degrade to a non-fullscreen, non-proctored attempt instead.
        try {
          exitFSIfAny();
        } catch {
          /* ignore */
        }
        fsStrictRef.current = false;
        grace(700);
        const reason = err && err.message === 'timeout' ? 'Full-screen mode took too long to start' : 'Full-screen mode isn’t available right now';
        showToast(reason + ' — continuing in standard mode. This attempt won’t be proctored, so try to avoid switching tabs anyway.', 'warning', 7000);
        setPhase('running');
      }
    );
  }

  function handleClose() {
    closeExercise();
  }
  function handleRetry() {
    setPhase('gate');
  }
  function handleFinish() {
    markDayComplete(day.n);
    closeExercise();
  }

  const exercise = day.exercise?.[skill];
  if (!exercise) return null; // guarded by the parent before mounting this

  return (
    <div className="min-h-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {phase === 'gate' && <ExerciseGate skill={skill} dayNum={day.n} onStart={handleStart} onClose={handleClose} />}
      {phase === 'cheat' && <ExerciseCheatScreen onRetry={handleRetry} onClose={handleClose} />}
      {phase === 'running' && skill === 'listening' && (
        <ExerciseListening dayNum={day.n} exercise={exercise as any} onClose={handleClose} onFinish={handleFinish} />
      )}
      {phase === 'running' && skill === 'reading' && (
        <ExerciseReading dayNum={day.n} exercise={exercise as any} onClose={handleClose} onFinish={handleFinish} />
      )}
      {phase === 'running' && skill === 'writing' && (
        <ExerciseWriting dayNum={day.n} exercise={exercise as any} onClose={handleClose} onFinish={handleFinish} />
      )}
      {phase === 'running' && skill === 'speaking' && (
        <ExerciseSpeaking dayNum={day.n} exercise={exercise as any} onClose={handleClose} onFinish={handleFinish} onGrace={grace} />
      )}
    </div>
  );
}

/**
 * Host for the fullscreen proctored exercise modal — ported from the
 * `#exerciseModal` element. Always mounted (hidden via a class, exactly like
 * the legacy markup) so page scroll-lock/cleanup happens predictably;
 * `ExerciseRunnerActive` itself is only mounted while an exercise is open,
 * keyed by day+skill so opening a different exercise gets a fully fresh
 * attempt.
 */
export default function ExerciseRunner() {
  const { exerciseCtx, dayByN, closeExercise } = useRoadmap();
  const containerRef = useRef<HTMLDivElement>(null);

  const day = exerciseCtx ? dayByN.get(exerciseCtx.dayNum) : undefined;
  const hasExercise = !!(day && exerciseCtx && day.exercise?.[exerciseCtx.skill]);
  const open = !!(exerciseCtx && hasExercise);

  // If somehow asked to open a day/skill with no authored exercise, don't
  // get stuck showing a blank modal — close it.
  useEffect(() => {
    if (exerciseCtx && !hasExercise) closeExercise();
  }, [exerciseCtx, hasExercise, closeExercise]);

  // Lock page scroll while the exercise is open — matches
  // `document.body.style.overflow = 'hidden'` in openExercise()/closeExercise().
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div ref={containerRef} className={'fixed inset-0 z-[60] bg-base-bg overflow-y-auto' + (open ? '' : ' hidden')}>
      {open && day && exerciseCtx && (
        <ExerciseRunnerActive key={exerciseCtx.dayNum + '-' + exerciseCtx.skill} day={day} skill={exerciseCtx.skill} fsTarget={containerRef} />
      )}
    </div>
  );
}
