import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The warm-boutique section marker: a hairline rule trailing into a lowercase
 * serif italic label. Replaces the generic uppercase letter-spaced eyebrow.
 */
export function SectionLabel({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-display text-lg italic lowercase",
        tone === "light" ? "text-rose-200" : "text-rose-600",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-10",
          tone === "light" ? "bg-rose-200/50" : "bg-rose-400/60",
        )}
      />
      {children}
    </span>
  );
}
