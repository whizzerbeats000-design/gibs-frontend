import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

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

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const { setRef, revealed, reduce } = useRevealed();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={setRef}
      className={className}
      initial={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
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