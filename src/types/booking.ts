export type BookingStatus =
  | "pending"
  | "confirmed"
  | "denied"
  | "expired"
  | "cancelled";

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  scheduledAt: string;
  endsAt: string;
  status: BookingStatus;
  holdExpiresAt: string;
  ownerToken: string;
  createdAt: string;
}

export interface BookingWithService extends Booking {
  serviceName: string;
  serviceDurationMinutes: number;
  servicePriceCents: number;
}

export interface BookingTimeRange {
  start: Date;
  end: Date;
}
