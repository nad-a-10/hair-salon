import { z } from "zod";

export const phoneRegex = /^[+0-9 ()-]{7,25}$/;

export const bookingFormSchema = z.object({
  serviceSlug: z.string().min(1, "Missing service"),
  customerName: z
    .string()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  customerPhone: z
    .string()
    .min(7, "Please enter a phone number")
    .regex(phoneRegex, "Use digits, spaces, parentheses, +, or -"),
  customerEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500, "Keep notes under 500 characters").optional(),
  // Timed mode: an ISO instant. Day-only mode: leave empty.
  scheduledAtIso: z.string().optional(),
  // Day-only mode: a clinic calendar day (yyyy-MM-dd). Timed mode: leave empty.
  dayKey: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a day")
    .optional()
    .or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
