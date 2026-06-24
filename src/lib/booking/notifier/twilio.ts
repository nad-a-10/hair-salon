import type { BookingWithService } from "@/types/booking";
import {
  type BookingNotifier,
  type NotifierResult,
  buildOwnerMessage,
} from "./index";

export class TwilioNotifier implements BookingNotifier {
  async buildHandoff(
    _booking: BookingWithService,
  ): Promise<NotifierResult> {
    void _booking;
    void buildOwnerMessage;

    throw new Error(
      "TwilioNotifier is not implemented yet. " +
        "Set NOTIFIER_KIND='whatsapp-link' or implement Twilio sending here. " +
        "When ready: install `twilio`, send a WhatsApp message with confirm/deny links " +
        "keyed by booking.ownerToken, and return { kind: 'sent' }.",
    );
  }
}
