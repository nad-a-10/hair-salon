"use client";

import { useEffect, useState } from "react";
import {
  phoneToDigits,
  waMeUrl,
  whatsappBusinessAndroidUrl,
  whatsappBusinessIosUrl,
  whatsappSchemeUrl,
} from "@/lib/booking/whatsapp";

type Platform = "android" | "ios" | "other";

interface Props {
  phoneE164: string;
  message?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Opens a WhatsApp chat with the customer, preferring the owner's WhatsApp
 * **Business** app on both mobile platforms:
 *
 * - Android: `intent://` URL that names the Business package explicitly
 *   (falls back to wa.me if it isn't installed).
 * - iOS: the undocumented Business-only `whatsapp-smb://` scheme. A timer
 *   falls back to the generic `whatsapp://` scheme if the app didn't take
 *   over the screen (e.g. Business not installed or the scheme was dropped).
 * - Desktop/other: wa.me in a new tab.
 *
 * The href starts as `wa.me` (matching the server render) and upgrades after
 * mount once the user agent is readable. App links navigate the CURRENT tab —
 * Chrome on Android refuses `intent://` navigations into a new tab.
 */
export function WhatsAppLink({ phoneE164, message, className, children }: Props) {
  const digits = phoneToDigits(phoneE164);
  const [platform, setPlatform] = useState<Platform>("other");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      setPlatform("android");
    } else if (
      /iphone|ipad|ipod/i.test(ua) ||
      // iPadOS reports as Macintosh but is touch-capable.
      (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    ) {
      setPlatform("ios");
    }
  }, []);

  const href =
    mounted && platform === "android"
      ? whatsappBusinessAndroidUrl(digits, message)
      : mounted && platform === "ios"
        ? whatsappBusinessIosUrl(digits, message)
        : waMeUrl(digits, message);

  const isAppLink = mounted && platform !== "other";

  /**
   * iOS has no installed-app detection, so let the anchor attempt the
   * Business-only scheme and arm a fallback: if the page is still visible
   * ~1.5s later, the scheme didn't open anything — retry with the generic
   * `whatsapp://` scheme. Leaving the page cancels the fallback.
   */
  function armIosFallback() {
    if (platform !== "ios") return;

    const fallback = whatsappSchemeUrl(digits, message);
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.location.href = fallback;
      }
    }, 1500);

    const cancel = () => window.clearTimeout(timer);
    window.addEventListener("pagehide", cancel, { once: true });
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "hidden") cancel();
      },
      { once: true },
    );
  }

  return (
    <a
      href={href}
      target={isAppLink ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={armIosFallback}
      className={className}
    >
      {children}
    </a>
  );
}
