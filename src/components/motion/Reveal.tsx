"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger helper: nudges the delay so items in a list arrive in sequence. */
  index?: number;
  /** Extra delay in seconds, added on top of the index-based stagger. */
  delay?: number;
  /** Travel distance in px before settling. Kept small on purpose. */
  y?: number;
  className?: string;
  /** Render as a list item, etc. Defaults to a div. */
  as?: "div" | "li" | "section" | "article";
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A gentle fade-and-rise that plays once as the element scrolls into view.
 * Movement is deliberately understated so the page feels settled, not animated.
 * Honors prefers-reduced-motion by rendering the content with no transform.
 */
export function Reveal({
  children,
  index = 0,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  // Cast away the union of motion component types — every variant shares the
  // same prop surface we use, and the cast keeps TS from choking on the union.
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // Cap the cumulative stagger so long lists never feel like they're crawling in.
  const stagger = Math.min(index, 6) * 0.07;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay: stagger + delay }}
    >
      {children}
    </MotionTag>
  );
}
