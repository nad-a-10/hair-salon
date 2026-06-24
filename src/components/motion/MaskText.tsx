"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One line of a headline that wipes up from behind a mask as it enters view.
 * Wrap each visual line in its own MaskText and stagger with `index`. Under
 * prefers-reduced-motion it renders the line statically.
 */
export function MaskText({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={cn("block", className)}>{children}</span>;
  }

  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className={cn("block", className)}
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.15 + 0.09 * index }}
      >
        {children}
      </motion.span>
    </span>
  );
}
