import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** kinetic-typography: the premium enter ease — easeOutExpo cubic-bezier(0.16,1,0.3,1). */
export const EASE_KINETIC = [0.16, 1, 0.3, 1] as const;

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Use this for the children of a `stagger` container — provides the actual
 *  fade+rise animation values so the parent and child roles are distinct. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

/* Reveal only waits on the observer as long as it takes to confirm position.
   If the observer never fires — headless jumps, throttled tabs, interrupted
   frames — this timer settles the content into its visible state anyway, so a
   section can never stay at opacity 0 forever. */
const REVEAL_FALLBACK_MS = 1200;

function useRevealed() {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduce) {
      /* Reduced motion renders the settled state directly, skipping animation.
         `MotionConfig reducedMotion="user"` is not enough on its own: it
         suppresses transform animations but still runs the opacity transition,
         so every reveal would remain subject to the same fade-and-stagger queue
         as a full-motion visit. A measured 9-second wait for a card deep in a
         135-item list is exactly the movement-and-delay burden reduced-motion
         exists to remove. */
      setRevealed(true);
      return;
    }
    const el = elRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    const timer = window.setTimeout(() => {
      setRevealed(true);
      io.disconnect();
    }, REVEAL_FALLBACK_MS);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduce]);

  const setRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
  }, []);

  return { setRef, revealed, reduce };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/**
 * Scroll reveal, implemented as a CSS transition rather than a framer-motion
 * component.
 *
 * `Reveal` is the most-repeated primitive in the site — 105 instances — and it
 * animates exactly two properties, opacity and transform. Routing each one
 * through framer-motion meant 105 extra motion components constructed, mounted
 * and driven on every page load. Measured in Chromium at 1440x900 that doubled
 * main-thread blocking: home cost 1932ms of long-task time with motion enabled
 * against 1000ms with it disabled, and /programmes cost 2513ms against 1144ms.
 *
 * The observer, the guaranteed-resolve fallback timer and the reduced-motion
 * short-circuit are unchanged — the trigger logic was never the cost. Only the
 * animation transport moved to CSS, which handles opacity and transform on the
 * compositor with no JavaScript per frame. The visual result is deliberately
 * identical: same 0.9s duration, same cubic-bezier(0.22, 1, 0.36, 1) easing,
 * same `delay` (converted from framer's seconds to CSS milliseconds) and the
 * same `y` offset.
 *
 * No `will-change` is set here on purpose — 105 permanently promoted layers
 * would cost far more memory than the transitions save. Browsers promote the
 * property for the duration of the transition on their own.
 *
 * `Stagger` deliberately keeps framer-motion: its children carry variants, and
 * framer's variant propagation (staggerChildren / delayChildren) is what
 * sequences them. Reveal is never a direct child of a Stagger, so it never
 * participated in that propagation and loses nothing by stepping out of it.
 */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const { setRef, revealed, reduce } = useRevealed();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={setRef}
      className={className}
      data-reveal={revealed ? "shown" : "hidden"}
      /* --reveal-y is a custom property, which React.CSSProperties does not
         model, so the style object is cast rather than widened. */
      style={
        {
          "--reveal-y": `${y}px`,
          transitionDelay: `${delay * 1000}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

type StaggerProps = {
  children?: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "ul";
};

const staggerTags = { div: motion.div, ul: motion.ul } as const;

/** Variant container with the same guaranteed-resolve behaviour as `Reveal`:
 *  children holding `staggerItem` variants stay hidden only until the observer
 *  (or the fallback timer) releases them. `as="ul"` keeps list children valid. */
export function Stagger({ children, className, variants = stagger, as = "div" }: StaggerProps) {
  const { setRef, revealed, reduce } = useRevealed();
  const Tag = as;

  if (reduce) return <Tag className={className}>{children}</Tag>;

  const MotionTag = staggerTags[as];
  return (
    <MotionTag
      ref={setRef}
      className={className}
      variants={variants}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerSlow({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <Stagger className={className} variants={staggerSlow}>
      {children}
    </Stagger>
  );
}