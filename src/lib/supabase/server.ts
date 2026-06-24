import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, publicEnv, serverEnv } from "@/config/env";

export type SupabaseServer = ReturnType<typeof createServerClient>;

export async function createSupabaseServer(): Promise<SupabaseServer | null> {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();
  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /* called from a Server Component without a Response — fine */
          }
        },
      },
    },
  );
}

export async function createSupabaseAdmin(): Promise<SupabaseServer | null> {
  if (!isSupabaseConfigured || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const cookieStore = await cookies();
  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          /* no-op for service-role */
        },
      },
    },
  );
}
