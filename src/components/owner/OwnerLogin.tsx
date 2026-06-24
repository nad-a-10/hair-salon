"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { authenticateOwner } from "@/server/actions/bookings";

export function OwnerLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await authenticateOwner(password);
      if (res.ok) {
        router.refresh();
      } else {
        setError("Incorrect password. Try again.");
      }
    });
  }

  return (
    <div className="rounded-3xl border border-line/60 bg-ivory px-8 py-10 shadow-soft">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600"
        >
          <Lock className="h-5 w-5" />
        </span>
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted">
          Owner sign-in
        </span>
      </div>

      <h2 className="mt-5 font-display text-2xl text-charcoal">
        Enter the owner password
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Only the clinic can confirm or deny bookings. Enter the owner password
        to continue — you&apos;ll stay signed in on this device.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Owner password"
          className="w-full rounded-2xl border border-line/70 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-muted/70 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
        />

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-rose-100 px-4 py-3 text-xs leading-relaxed text-rose-800"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || password.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
