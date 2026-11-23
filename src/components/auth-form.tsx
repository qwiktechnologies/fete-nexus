"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiLock, FiMessageSquare, FiTruck } from "react-icons/fi";
import { login, register } from "@/actions/auth";
import { Container } from "@/components/container";
import { PasswordField } from "@/components/password-field";
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
    <Container className="py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="dash-cta relative overflow-hidden px-6 py-10 sm:px-10 lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="relative">
            <Wordmark light />
            <p className="eyebrow mt-8 text-gold-400">Your logistics partner</p>
            <h1 className="mt-3 max-w-lg text-4xl leading-tight text-white sm:text-5xl">
              {mode === "login" ? "Welcome back to the yard." : "Open an account and book the van."}
            </h1>
            <p className="mt-4 max-w-md text-lg leading-8 text-white/75">
              Bradford, Leeds and West Yorkshire. Fully insured, and licensed to carry waste.
            </p>
          </div>
          <ul className="relative mt-10 grid gap-4">
            {points.map((point) => (
              <li key={point.title} className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-white">
                  <point.icon />
                </span>
                <span>
                  <span className="block font-bold text-white">{point.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-white/70">{point.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex items-center justify-center">
          <form action={formAction} className="panel w-full max-w-md p-7 sm:p-9">
            <p className="eyebrow text-gold-600">{mode === "login" ? "Sign in" : "Register"}</p>
            <h2 className="dash-title mt-2">{mode === "login" ? "Your account" : "Create an account"}</h2>
            <p className="mt-2 text-sm text-muted">
              {mode === "login" ? "Bookings, invoices and messages live here." : "Use this to book, pay a deposit and message the crew."}
            </p>
            {state.error ? (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {state.error}
              </p>
            ) : null}
            {next ? <input type="hidden" name="next" value={next} /> : null}
            <div className="mt-6 grid gap-4">
              {mode === "register" ? (
                <>
                  <label className="label">
                    Name
                    <input className="field" name="name" required autoComplete="name" />
                  </label>
                  <label className="label">
                    Phone
                    <input className="field" name="phone" required autoComplete="tel" />
                  </label>
                </>
              ) : null}
              <label className="label">
                Email
                <input className="field" type="email" name="email" required autoComplete="email" />
              </label>
              <PasswordField
                label="Password"
                name="password"
                required
                minLength={mode === "register" ? 8 : undefined}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {mode === "register" ? (
                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              ) : null}
            </div>
            <button type="submit" disabled={pending} className="btn-primary mt-6 w-full">
              {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
            <p className="mt-4 text-sm text-muted">
              {mode === "login" ? (
                <>
                  New here?{" "}
                  <Link href={otherHref} className="font-bold text-gold-600">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already booked with us?{" "}
                  <Link href={otherHref} className="font-bold text-gold-600">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </form>
        </section>
      </div>
    </Container>
  );
}