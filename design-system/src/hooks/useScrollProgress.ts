import { useEffect, useRef, useState } from 'react';

export interface ScrollProgressOptions {
  /** Freeze the value instead of following the scroll (for static frames). */
  frozen?: number;
  /** Skip the listener entirely. */
  disabled?: boolean;
}

/**
 * Tracks how far a tall element has scrolled through the viewport, from 0 (its top reaches
 * the top of the screen) to 1 (its bottom does). Attach `ref` to the tall element and drive
 * any animation from `progress`. Pass `frozen` to hold a fixed frame.
 */
export function useScrollProgress({ frozen, disabled = false }: ScrollProgressOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tracked, setTracked] = useState(0);
  const live = frozen === undefined && !disabled;

  useEffect(() => {
    if (!live) return;
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    let frame = 0;
    const read = () => {
      frame = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        setTracked(travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0);
      });
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [live]);

  return { ref, progress: live ? tracked : Math.min(1, Math.max(0, frozen ?? 0)) };
}

/** Eased 0..1 ramp between two thresholds of a progress value. */
export function ramp(progress: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (progress - from) / (to - from)));
}
