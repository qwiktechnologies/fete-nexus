"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, register } from "@/actions/auth";
import type { FormState } from "@/lib/validators";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? login : register;
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  return (
    <form action={formAction} className="rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(11,31,58,0.8)]">
      <h1 className="text-4xl text-navy-900">{mode === "login" ? "Sign in" : "Create an account"}</h1>
      <p className="mt-2 text-muted">
        {mode === "login" ? "Bookings, invoices and messages live here." : "Use this to book, pay a deposit and message the crew."}
      </p>
      {state.error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{state.error}</p> : null}
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="mt-6 grid gap-4">
        {mode === "register" ? (
          <>
            <label className="label">Name<input className="field" name="name" required autoComplete="name" /></label>
            <label className="label">Phone<input className="field" name="phone" required autoComplete="tel" /></label>
          </>
        ) : null}
        <label className="label">Email<input className="field" type="email" name="email" required autoComplete="email" /></label>
        <label className="label">Password<input className="field" type="password" name="password" required minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
      </div>
      <button disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-navy-900 font-bold text-white disabled:opacity-60">
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="mt-4 text-sm text-muted">
        {mode === "login" ? (
          <>New here? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-navy-900">Create an account</Link></>
        ) : (
          <>Already booked with us? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-navy-900">Sign in</Link></>
        )}
      </p>
    </form>
  );
}
