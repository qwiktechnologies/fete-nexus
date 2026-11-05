"use client";

import { useActionState } from "react";
import { startConversation } from "@/actions/messages";
import type { FormState } from "@/lib/validators";

export function StartMessageForm() {
  const [state, action, pending] = useActionState(startConversation, {} as FormState);
  return (
    <form action={action} className="rounded-[2rem] bg-white p-6">
      <h2 className="text-2xl text-navy-900">New message</h2>
      {state.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
      <label className="label mt-4">Subject<input className="field" name="subject" required /></label>
      <label className="label mt-4">Message<textarea className="field min-h-28" name="body" required /></label>
      <button disabled={pending} className="mt-4 rounded-full bg-navy-900 px-5 py-2 font-bold text-white">Send</button>
    </form>
  );
}
