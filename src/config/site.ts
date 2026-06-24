export const siteConfig = {
  // TODO: replace placeholders with the stylist's real brand details.
  name: "Maison Hair Studio",
  shortName: "Maison",
  role: "Hair Stylist",
  tagline: "Cuts, color & care, crafted",
  description:
    "Maison Hair Studio. Cuts, color, blowouts, and restorative hair treatments by a dedicated stylist. Book your day online and confirm by WhatsApp.",
  url: "https://example.com",
  contact: {
    phoneDisplay: "+961 00 000 000",
    whatsappE164: "+96100000000",
    email: "hello@example.com",
    instagram: "https://instagram.com/",
    instagramHandle: "@maisonhairstudio",
    facebook: "https://facebook.com/",
    facebookLabel: "Maison Hair Studio",
    addressLines: ["Studio address line 1", "City, Lebanon"],
    mapsUrl: "https://maps.google.com/",
  },
  hours: {
    weekdays: "Tue – Sun · by appointment",
    sunday: "Monday · closed",
  },
  // Timezone used for all booking dates, regardless of visitor/server locale.
  timeZone: "Asia/Beirut",
  // "day"   = customer picks a date only; up to a daily capacity of bookings.
  // "timed" = customer picks date + time (flip this later to enable slots).
  bookingMode: "day" as "day" | "timed",
  // One-page anchor navigation.
  nav: [
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ] as const,
  defaultBookingHoldHours: 24,
};

export type SiteConfig = typeof siteConfig;
