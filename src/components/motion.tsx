import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

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

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  /* When the visitor prefers reduced motion, render the settled state and skip
     the animation entirely. `MotionConfig reducedMotion="user"` is not enough on
     its own: it suppresses transform animations but still runs the opacity
     transition, so every reveal remained subject to the same fade-and-stagger
     queue as a full-motion visit. A measured 9-second wait for a card deep in a
     135-item list is exactly the kind of movement-and-delay burden reduced-motion
     exists to remove, and depending on an IntersectionObserver for basic
     legibility is fragile — if the observer never fires, the content stays at
     opacity 0 permanently. Returning a plain element makes the final state the
     default and the animation strictly additive. */
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: "some" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

