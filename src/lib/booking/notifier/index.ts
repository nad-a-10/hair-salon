import { formatInTimeZone } from "date-fns-tz";
import { isSupabaseConfigured, publicEnv, serverEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import { isDayMode } from "@/lib/booking/when";
import type { BookingWithService } from "@/types/booking";
import { WhatsAppLinkNotifier } from "./whatsapp-link";
import { TwilioNotifier } from "./twilio";

export type NotifierResult =
  | { kind: "handoff"; whatsappUrl: string; messagePreview: string }
  | { kind: "sent" };

export interface BookingNotifier {
  buildHandoff(booking: BookingWithService): Promise<NotifierResult>;
}

export function buildOwnerMessage(booking: BookingWithService): string {
  const when = new Date(booking.scheduledAt);
  const formattedDate = formatInTimeZone(
    when,
    siteConfig.timeZone,
    "EEEE, MMMM d, yyyy",
  );
  const formattedTime = formatInTimeZone(when, siteConfig.timeZone, "h:mm a");

  const whenLine = isDayMode
    ? `When:     ${formattedDate} (by arrangement that day)`
    : `When:     ${formattedDate} at ${formattedTime}`;

  const lines = [
    `New booking request from ${siteConfig.name}`,
    "",
    `Service:  ${booking.serviceName}`,
    whenLine,
    `Length:   ${booking.serviceDurationMinutes} minutes`,
    "",
    `Name:     ${booking.customerName}`,
    `Phone:    ${booking.customerPhone}`,
  ];

  if (booking.customerEmail) lines.push(`Email:    ${booking.customerEmail}`);
  if (booking.notes) {
    lines.push("", `Notes:    ${booking.notes}`);
  }

  if (isSupabaseConfigured) {
    const baseUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    const manageUrl = `${baseUrl}/owner/${booking.ownerToken}`;

    lines.push("", `Manage:   ${manageUrl}`);
    lines.push(
      "",
      "Tap the link above to confirm or deny. The slot is held for 24h while you decide.",
    );
  } else {
    lines.push("", "Reply to the customer to confirm or reschedule.");
  }

  return lines.join("\n");
}

export function getNotifier(): BookingNotifier {
  if (serverEnv.NOTIFIER_KIND === "twilio") {
    return new TwilioNotifier();
  }
  return new WhatsAppLinkNotifier();
}
