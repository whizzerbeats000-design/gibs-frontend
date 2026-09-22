import { useEffect, useRef, useState } from "react";

/**
 * Ref-counted body scroll lock so multiple dialogs can mount/unmount
 * without one cleanup unlocking a still-open dialog. Prevents background
 * scroll completely while keeping sidebar content independently scrollable,
 * and restores the exact previous overflow and scrollbar compensation on close
 * without layout shift.
 */
let bodyLockCount = 0;
let prevOverflow = "";
let prevPaddingRight = "";
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    bodyLockCount += 1;
    if (bodyLockCount === 1) {
      prevOverflow = document.body.style.overflow;
      prevPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
    }
    return () => {
      bodyLockCount -= 1;
      if (bodyLockCount === 0) {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
        document.documentElement.style.overscrollBehavior = "";
      }
    };
  }, [locked]);
}

/** Call onClose on Escape while active. */
export function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [active, onClose]);
}

/**
 * Focus trap for dialogs. Moves focus into the dialog, keeps Tab cycling
 * inside, and restores focus to the previously focused element on close.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    previous.current = document.activeElement as HTMLElement | null;

    const node = ref.current;
    const focusables = (): HTMLElement[] =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Focus first element (or the container) after mount.
    const t = window.setTimeout(() => {
      const first = focusables()[0];
      (first ?? node).focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      node.removeEventListener("keydown", onKey);
      previous.current?.focus?.();
    };
  }, [active]);

  return ref;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
