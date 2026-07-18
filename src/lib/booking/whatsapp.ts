// Helpers for opening a WhatsApp chat with a customer from the owner views.
//
// The owner runs WhatsApp Business (package `com.whatsapp.w4b`) alongside the
// consumer app. A plain `wa.me` / `whatsapp://` link can't pick between the two
// — both apps register the same schemes, so the OS decides, and it tends to
// open the consumer app. The only reliable override is an Android `intent://`
// URL that names the Business package explicitly. On iOS no such hook exists,
// so the best we can do is the raw `whatsapp://` scheme: it opens the app
// directly (skipping the wa.me web page), and on a phone where only WhatsApp
// Business is installed that IS the Business app. Desktop stays on `wa.me`.

// Customers usually type their number in local format ("03 071 537"), but
// WhatsApp deep links only accept full international numbers ("9613071537").
// A local number sent as-is makes WhatsApp report "isn't on WhatsApp".
const DEFAULT_COUNTRY_CALLING_CODE = "961"; // Lebanon

/**
 * Normalize a customer-entered phone number to the international digit string
 * `wa.me` / `whatsapp://` expect. Handles "+961…", "00961…", "961…", local
 * numbers with a trunk zero ("03…"), and short local numbers ("70…") — the
 * last two get the clinic's default country code.
 */
export function phoneToDigits(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");

  // Explicitly international already.
  if (phone.trim().startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (
    digits.startsWith(DEFAULT_COUNTRY_CALLING_CODE) &&
    digits.length >= 10
  ) {
    return digits;
  }

  // Local format: drop the trunk zero ("03…" -> "3…"), then prepend the
  // country code to anything local-sized (Lebanese numbers are 7-8 digits).
  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  if (local.length <= 8) return DEFAULT_COUNTRY_CALLING_CODE + local;

  return digits;
}

/** Universal `wa.me` link — opens whichever WhatsApp the OS routes it to. */
export function waMeUrl(phoneDigits: string, message?: string): string {
  const base = `https://wa.me/${phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Raw `whatsapp://` scheme for iOS — opens the installed WhatsApp app
 * directly, skipping the wa.me browser page. iOS offers no way to target the
 * Business app specifically; if only WhatsApp Business is installed (the
 * usual business-phone setup) this opens it directly.
 */
export function whatsappSchemeUrl(
  phoneDigits: string,
  message?: string,
): string {
  const base = `whatsapp://send?phone=${phoneDigits}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

/**
 * Undocumented iOS scheme registered only by the WhatsApp **Business** app
 * ("WhatsApp SMB"). Because the consumer app doesn't claim it, this opens
 * Business specifically even when both apps are installed. Unofficial — a
 * future app update could drop it, so callers pair it with a timed fallback
 * to the generic `whatsapp://` scheme.
 */
export function whatsappBusinessIosUrl(
  phoneDigits: string,
  message?: string,
): string {
  const base = `whatsapp-smb://send?phone=${phoneDigits}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

/**
 * Android `intent://` URL that forces the WhatsApp **Business** app. If the
 * Business app isn't installed, `browser_fallback_url` sends the OS to the
 * `wa.me` link instead (which opens the consumer app or the Play Store).
 */
export function whatsappBusinessAndroidUrl(
  phoneDigits: string,
  message?: string,
): string {
  const query = message
    ? `send?phone=${phoneDigits}&text=${encodeURIComponent(message)}`
    : `send?phone=${phoneDigits}`;
  const fallback = encodeURIComponent(waMeUrl(phoneDigits, message));
  return (
    `intent://${query}#Intent;scheme=whatsapp;` +
    `package=com.whatsapp.w4b;S.browser_fallback_url=${fallback};end`
  );
}
