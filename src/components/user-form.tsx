"use client";

import { useActionState, useEffect, useState } from "react";
import { createManagedUser } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

export function AddAccountButton({ superAdmin }: { superAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createManagedUser, {} as FormState);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-full bg-gold-500 px-5 py-2 font-bold text-navy-950">
        Add account
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/55 p-4" onClick={() => setOpen(false)}>
          <form
            action={action}
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-[1.75rem] bg-white p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl text-navy-900">Add account</h2>
                <p className="mt-1 text-sm text-muted">Share the password with them yourself. The site does not email it.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-navy-900/10 px-4 py-2 text-sm font-bold">
                Close
              </button>
            </div>
            {state.error ? <p className="mt-4 text-sm text-red-700">{state.error}</p> : null}
            {state.ok ? <p className="mt-4 text-sm text-emerald-700">{state.ok}</p> : null}
            <div className="mt-5 grid gap-3">
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
            <button disabled={pending} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-bold text-white disabled:opacity-60">
              {pending ? "Saving…" : "Create account"}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
