import { useEffect, useRef, type RefObject } from "react";

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Sub-3° pointer tilt + pointer-following light for premium cards.
 *
 * Performance contract:
 *  - No React re-renders: the handler writes CSS variables directly.
 *  - No forced layout reads: the element rect is cached on enter/resize;
 *    coordinates come from the event (clientX/Y), never getBoundingClientRect.
 *  - All listeners passive.
 *  - Attached only when (pointer: fine) AND (prefers-reduced-motion: reduce)
 *    are both false. On touch/coarse pointers or reduced-motion it is inert.
 *
 * The returned ref goes on the same element as `card-depth card-spot` classes.
 */
export function useCardDepth<T extends HTMLElement>(
  maxDeg = 2.5
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    let rect = el.getBoundingClientRect();

    const cacheRect = () => {
      rect = el.getBoundingClientRect();
    };

    const onEnter = () => cacheRect();

    const onMove = (e: PointerEvent) => {
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const nx = px * 2 - 1;
      const ny = py * 2 - 1;
      el.style.setProperty("--rx", `${(-ny * maxDeg).toFixed(3)}deg`);
      el.style.setProperty("--ry", `${(nx * maxDeg).toFixed(3)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
    };

    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };

    window.addEventListener("resize", cacheRect, { passive: true });
    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    el.addEventListener("pointercancel", onLeave, { passive: true });

    return () => {
      window.removeEventListener("resize", cacheRect);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, [maxDeg]);

  return ref;
}