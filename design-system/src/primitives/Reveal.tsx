import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../utils';

export interface RevealProps {
  children: ReactNode;
  /** Milliseconds to wait after the element enters view - stagger siblings with 0 / 100 / 200. */
  delay?: number;
  /** How far the content rises as it appears, in pixels. */
  distance?: number;
  /** Reveal once (default) or every time it re-enters view. */
  once?: boolean;
  /** Force the shown state (useful for static frames). */
  shown?: boolean;
  /** Extra classes appended to the wrapper. */
  className?: string;
}

/**
 * Fades and lifts its children into place when they scroll into view. Wrap sections or
 * cards in it - stagger a row by giving each child a larger `delay`. Falls back to
 * visible when IntersectionObserver is unavailable.
 */
export function Reveal({ children, delay = 0, distance = 24, once = true, shown, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const forced = shown !== undefined;

  useEffect(() => {
    if (forced) return;
    const el = ref.current;
    if (!el || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [forced, once]);

  const isShown = forced ? shown : visible;
  return (
    <div
      ref={ref}
      className={cx('transition-all duration-700 ease-out motion-reduce:transition-none', className)}
      style={{
        opacity: isShown ? 1 : 0,
        transform: isShown ? 'none' : `translateY(${distance}px)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
