"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "lumiere:splash-shown";
const SPLASH_DURATION_MS = 3200;

export function useSplash(): { visible: boolean; finish: () => void } {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyShown = false;
    }

    if (alreadyShown) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* sessionStorage unavailable; quietly ignore */
      }
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return {
    visible,
    finish: () => {
      setVisible(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    },
  };
}
