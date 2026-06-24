import { z } from "zod";

const Server = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OWNER_WHATSAPP_E164: z.string().optional(),
  OWNER_PORTAL_PASSWORD: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  NOTIFIER_KIND: z.enum(["whatsapp-link", "twilio"]).default("whatsapp-link"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_WHATSAPP: z.string().optional(),
});

const Public = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const serverEnv = Server.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  OWNER_WHATSAPP_E164: process.env.OWNER_WHATSAPP_E164,
  OWNER_PORTAL_PASSWORD: process.env.OWNER_PORTAL_PASSWORD,
  CRON_SECRET: process.env.CRON_SECRET,
  NOTIFIER_KIND: process.env.NOTIFIER_KIND,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_FROM_WHATSAPP: process.env.TWILIO_FROM_WHATSAPP,
});

export const publicEnv = Public.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const isSupabaseConfigured =
  Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
