"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSplash } from "@/hooks/useSplash";
import { siteConfig } from "@/config/site";

export function BrandLoader() {
  const { visible } = useSplash();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory bg-grain"
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center gap-2 px-8 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="font-display text-4xl tracking-tight text-charcoal xs:text-5xl sm:text-6xl md:text-7xl">
                {siteConfig.name}
              </div>
              <div
                aria-hidden
                className="gold-shimmer pointer-events-none absolute inset-0 font-display text-4xl tracking-tight xs:text-5xl sm:text-6xl md:text-7xl"
              >
                {siteConfig.name}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="font-display text-xl italic text-rose-600 sm:text-2xl"
            >
              {siteConfig.role}
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 h-px w-24 origin-left bg-gold-500/60"
              aria-hidden
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              className="mt-3 font-display text-base italic lowercase text-muted sm:text-lg"
            >
              {siteConfig.tagline}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
