export const siteConfig = {
  name: "Elie Maamari",
  shortName: "Elie",
  role: "Hair Stylist",
  tagline: "unhurried cuts, color & care",
  description:
    "Elie Maamari Hair Studio, Zalka, Lebanon. Cuts, color, blowouts, and restorative hair treatments by a dedicated stylist. Book your day online and confirm by WhatsApp.",
  url: "https://eliemaamari.com",
  contact: {
    phoneDisplay: "+961 3 262 088",
    whatsappE164: "+9613262088",
    instagram: "https://www.instagram.com/coiffure_elie_maamari",
    instagramHandle: "@coiffure_elie_maamari",
    addressLines: ["Aamrit Chalhoub, Zalqa", "Next to Haroun Hospital"],
    mapsUrl: "https://maps.app.goo.gl/Lceq4wVTA3h8wRsy7?g_st=aw",
  },
  hours: {
    // Open every day; Sunday opens earlier (07:00) by exception.
    weekdays: "Mon – Sat · 09:00 – 19:00",
    sunday: "Sunday · 07:00 – 13:00",
  },

  // Timezone used for all booking dates, regardless of visitor/server locale.
  timeZone: "Asia/Beirut",
  // "day"   = customer picks a date only; up to a daily capacity of bookings.
  // "timed" = customer picks date + time.
  bookingMode: "timed" as "day" | "timed",
  // Timed mode only: every appointment reserves this many minutes and start
  // times are offered at `slotGranularityMinutes` spacing. Services do NOT
  // carry their own duration — this single value governs all of them.
  slotMinutes: 75,
  slotGranularityMinutes: 30,
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
