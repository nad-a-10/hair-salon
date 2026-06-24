import { NextResponse } from "next/server";
import { serverEnv } from "@/config/env";
import { expirePendingBookings } from "@/server/actions/bookings";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = serverEnv.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const expected = `Bearer ${secret}`;
    if (authHeader !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await expirePendingBookings();
  return NextResponse.json({
    ok: true,
    expired: result.expired,
    ranAt: new Date().toISOString(),
  });
}
