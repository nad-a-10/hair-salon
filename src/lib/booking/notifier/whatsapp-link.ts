import { serverEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import type { BookingWithService } from "@/types/booking";
import {
  type BookingNotifier,
  type NotifierResult,
  buildOwnerMessage,
} from "./index";

function normalizePhoneForWaMe(raw: string | undefined): string {
  if (!raw) return "";
  return raw.replace(/[^0-9]/g, "");
}

export class WhatsAppLinkNotifier implements BookingNotifier {
  async buildHandoff(
    booking: BookingWithService,
  ): Promise<NotifierResult> {
    const ownerNumber =
      normalizePhoneForWaMe(serverEnv.OWNER_WHATSAPP_E164) ||
      normalizePhoneForWaMe(siteConfig.contact.whatsappE164);

    const message = buildOwnerMessage(booking);
    const params = new URLSearchParams({ text: message });
    const url = ownerNumber
      ? `https://wa.me/${ownerNumber}?${params.toString()}`
      : `https://wa.me/?${params.toString()}`;

    return { kind: "handoff", whatsappUrl: url, messagePreview: message };
  }
}
