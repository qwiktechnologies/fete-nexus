"use client";

import { useActionState } from "react";
import { createManagedUser } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

export function UserForm({ superAdmin }: { superAdmin: boolean }) {
  const [state, action, pending] = useActionState(createManagedUser, {} as FormState);
  return (
    <form action={action} className="rounded-[2rem] bg-white p-6">
      <h2 className="text-2xl text-navy-900">Create an account</h2>
      <p className="mt-1 text-sm text-muted">Share the password with them yourself. The site does not email it.</p>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm text-emerald-700">{state.ok}</p> : null}
      <div className="mt-4 grid gap-3">
        <label className="label">Name<input className="field" name="name" required /></label>
        <label className="label">Email<input className="field" type="email" name="email" required /></label>
        <label className="label">Phone<input className="field" name="phone" /></label>
        <label className="label">Password<input className="field" type="text" name="password" required minLength={8} /></label>
        <label className="label">Role
          <select className="field" name="role" defaultValue="CUSTOMER">
            <option value="CUSTOMER">Customer</option>
            <option value="STAFF">Staff</option>
            {superAdmin ? <option value="ADMIN">Admin</option> : null}
          </select>
        </label>
      </div>
      <button disabled={pending} className="mt-4 rounded-full bg-navy-900 px-5 py-2 font-bold text-white">Create</button>
    </form>
  );
}
