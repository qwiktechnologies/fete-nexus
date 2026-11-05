"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/auth";
import type { FormState } from "@/lib/validators";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {} as FormState);
  return (
    <form action={action} className="rounded-[2rem] bg-white p-6">
      <h2 className="text-2xl text-navy-900">Password</h2>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm text-emerald-700">{state.ok}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="label">Current<input className="field" type="password" name="current" required autoComplete="current-password" /></label>
        <label className="label">New<input className="field" type="password" name="next" required minLength={8} autoComplete="new-password" /></label>
      </div>
      <button disabled={pending} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-bold text-white">Update password</button>
    </form>
  );
}
