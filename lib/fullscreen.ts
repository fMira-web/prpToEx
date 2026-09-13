/**
 * Fullscreen API helpers — ported 1:1 from the EXERCISE RUNNER section's
 * isFS()/requestFS()/requestFSWithTimeout()/exitFSIfAny(). The legacy
 * version targeted a single hardcoded #exerciseModal element; here the
 * element is passed in so each ExerciseRunner instance uses its own node.
 */

export function isFS(): boolean {
  return !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement);
}

export function requestFS(el: HTMLElement): Promise<void> {
  const fn: (() => Promise<void> | void) | undefined =
    el.requestFullscreen || (el as any).webkitRequestFullscreen || (el as any).msRequestFullscreen;
  if (!fn) return Promise.reject(new Error('Fullscreen API unsupported in this browser'));
  let ret: Promise<void> | void;
  try {
    ret = fn.call(el);
  } catch (e) {
    return Promise.reject(e);
  }
  // The modern Fullscreen API returns a Promise. A few older/embedded WebKit
  // implementations return undefined instead and only ever signal completion
  // via the fullscreenchange event — normalise that into a Promise too so
  // callers (and the timeout race below) always have one to work with.
  if (ret && typeof (ret as Promise<void>).then === 'function') return ret as Promise<void>;
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    function onChange() {
      if (settled) return;
      settled = true;
      cleanup();
      if (isFS()) resolve();
      else reject(new Error('fullscreen-not-confirmed'));
    }
    function cleanup() {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    }
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
  });
}

/**
 * Wraps requestFS() in a timeout race: if the fullscreen promise neither
 * resolves nor rejects within `ms`, we treat it as failed rather than
 * blocking the user indefinitely (this fixes the reproduced "Enter
 * Full-Screen & Start" hang from the original remediation). Whichever
 * settles first wins; the loser is simply ignored (no cancellation API
 * exists for either).
 */
export function requestFSWithTimeout(el: HTMLElement, ms: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('timeout'));
    }, ms);
    requestFS(el).then(
      (v) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(v);
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export function exitFSIfAny(): void {
  if (!isFS()) return;
  const fn = document.exitFullscreen || (document as any).webkitExitFullscreen || (document as any).msExitFullscreen;
  if (fn) {
    try {
      fn.call(document);
    } catch {
      /* ignore */
    }
  }
}

export const FS_REQUEST_TIMEOUT_MS = 3000;
