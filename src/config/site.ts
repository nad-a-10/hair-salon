export const siteConfig = {
  // TODO: replace remaining placeholders (phone, email, socials) with real details.
  name: "Elie Maamary",
  shortName: "Elie",
  role: "Hair Stylist",
  tagline: "unhurried cuts, color & care",
  description:
    "Elie Maamary Hair Studio, Zalka, Lebanon. Cuts, color, blowouts, and restorative hair treatments by a dedicated stylist. Book your day online and confirm by WhatsApp.",
  url: "https://example.com",
  contact: {
    phoneDisplay: "+961 00 000 000",
    whatsappE164: "+96100000000",
    email: "hello@example.com",
    instagram: "https://instagram.com/",
    instagramHandle: "@eliemaamary",
    facebook: "https://facebook.com/",
    facebookLabel: "Elie Maamary Hair Studio",
    addressLines: ["Aamrit Chalhoub, Zalqa", "Next to Haroun Hospital"],
    mapsUrl: "https://maps.app.goo.gl/Lceq4wVTA3h8wRsy7?g_st=aw",
  },
  hours: {
    weekdays: "Mon – Sat · 09:00 – 19:00",
    sunday: "Sunday · 11:00 – 17:00",
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
