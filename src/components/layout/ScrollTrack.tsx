"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "top", label: "Welcome" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Sections painted over charcoal — the rail switches to light ink while there.
const DARK_SECTIONS = new Set(["top", "gallery"]);

/**
 * A slim "ruler" index fixed to the right edge: hairline ticks against a thin
 * rail, with a rose fill that tracks scroll progress and a serif label for the
 * section in view. Desktop only (the mobile menu covers small screens), and
 * only on the one-page home route — so it's absent on the booking pages.
 */
export function ScrollTrack() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);

  // Scroll progress, with top/bottom snapping for the short edge sections.
  useEffect(() => {
    if (!onHome) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      if (p > 0.99) setActive("contact");
      else if (h.scrollTop < 8) setActive("top");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  // Active section: whichever crosses the viewport's center band.
  useEffect(() => {
    if (!onHome) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el != null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  const go = useCallback((id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!onHome) return null;

  const onDark = DARK_SECTIONS.has(active);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 pr-7 md:block"
    >
      <ul className="relative flex h-72 flex-col items-end justify-between">
        {/* the rail */}
        <span
          aria-hidden
          className={cn(
            "absolute right-0 top-0 h-full w-px transition-colors duration-500",
            onDark ? "bg-ivory/20" : "bg-charcoal/15",
          )}
        />
        {/* scroll-progress fill */}
        <span
          aria-hidden
          className="absolute right-0 top-0 w-px origin-top bg-gradient-to-b from-gold-500 to-rose-500 transition-[height] duration-150 ease-out"
          style={{ height: `${progress * 100}%` }}
        />

        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="relative z-10">
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-label={s.label}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 py-1"
              >
                <span
                  className={cn(
                    "font-display text-[15px] italic leading-none transition-all duration-300",
                    isActive
                      ? cn("opacity-100", onDark ? "text-rose-200" : "text-rose-600")
                      : cn(
                          "translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                          onDark ? "text-ivory/80" : "text-charcoal/70",
                        ),
                  )}
                >
                  {s.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "block transition-all duration-300 ease-out",
                    isActive
                      ? "h-0.5 w-8 rounded-full bg-rose-500"
                      : cn(
                          "h-px w-3.5 group-hover:w-6",
                          onDark
                            ? "bg-ivory/40 group-hover:bg-rose-300"
                            : "bg-charcoal/30 group-hover:bg-rose-400",
                        ),
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
