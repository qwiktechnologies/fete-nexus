"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiLock, FiMessageSquare, FiTruck } from "react-icons/fi";
import { login, register } from "@/actions/auth";
import { Wordmark } from "@/components/logo";
import type { FormState } from "@/lib/validators";

const points = [
  { icon: FiTruck, title: "Book the job", text: "Removals, clearance, collection or delivery, with photographs." },
  { icon: FiMessageSquare, title: "Keep it in one thread", text: "Quotes, invoices and replies stay in your account." },
  { icon: FiLock, title: "Hold the date", text: "The deposit on the invoice confirms the booking." },
];

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? login : register;
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const other = mode === "login" ? "register" : "login";
  const otherHref = `/${other}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="grid min-h-[calc(100vh-8rem)] w-full lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative overflow-hidden bg-navy-950 px-6 py-10 text-white sm:px-10 lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />
        <div className="relative">
          <Wordmark light />
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.22em] text-gold-400">Your Logistics Partner</p>
          <h1 className="mt-3 max-w-lg text-4xl leading-tight sm:text-5xl">
            {mode === "login" ? "Welcome back to the yard." : "Open an account and book the van."}
          </h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-white/75">
            Bradford, Leeds and West Yorkshire. Fully insured, and licensed to carry waste.
          </p>
        </div>
        <ul className="relative mt-10 grid gap-4">
          {points.map((point) => (
            <li key={point.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-navy-950">
                <point.icon />
              </span>
              <span>
                <span className="block font-bold">{point.title}</span>
                <span className="mt-1 block text-sm leading-6 text-white/70">{point.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center bg-paper px-5 py-12 sm:px-10">
        <form action={formAction} className="w-full max-w-md rounded-[2rem] border border-navy-900/10 bg-white p-7 shadow-[0_30px_80px_-48px_rgba(11,31,58,0.8)] sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold-600">{mode === "login" ? "Sign in" : "Register"}</p>
          <h2 className="mt-2 text-4xl text-navy-900">{mode === "login" ? "Your account" : "Create an account"}</h2>
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
            <label className="label">
              Password
              <input className="field" type="password" name="password" required minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </label>
          </div>
          <button disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-navy-900 font-bold text-white disabled:opacity-60">
            {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
          <p className="mt-4 text-sm text-muted">
            {mode === "login" ? (
              <>New here? <Link href={otherHref} className="font-bold text-navy-900">Create an account</Link></>
            ) : (
              <>Already booked with us? <Link href={otherHref} className="font-bold text-navy-900">Sign in</Link></>
            )}
          </p>
        </form>
      </section>
    </div>
  );
}
