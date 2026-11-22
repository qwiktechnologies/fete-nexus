"use client";

import { useActionState } from "react";
import { changePassword } from "@/actions/auth";
import type { FormState } from "@/lib/validators";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {} as FormState);
  return (
    <form action={action} className="panel p-6">
      <h2 className="text-xl font-semibold text-navy-900">Password</h2>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm text-forest-700">{state.ok}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="label">
          Current
          <input className="field" type="password" name="current" required autoComplete="current-password" />
        </label>
        <label className="label">
          New
          <input className="field" type="password" name="next" required minLength={8} autoComplete="new-password" />
        </label>
      </div>
      <button type="submit" disabled={pending} className="btn-secondary mt-4">
        Update password
      </button>
    </form>
  );
}