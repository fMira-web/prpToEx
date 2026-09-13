import type { KeyboardEvent } from 'react';

/**
 * Shared Enter/Space activation handler for elements that behave like a
 * button but aren't one — the month/week/day accordion headers are plain
 * `onClick` divs (so the checkbox and chevron inside them can still have
 * their own separate click targets), which previously meant keyboard and
 * screen-reader users had no way to open them at all. Pair this with
 * `role="button"` and `tabIndex={0}` on the same element.
 */
export function handleActivateKey(e: KeyboardEvent, activate: () => void) {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    activate();
  }
}
