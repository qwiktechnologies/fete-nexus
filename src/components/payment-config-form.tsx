"use client";

import { useActionState } from "react";
import { savePaymentConfig } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

export function PaymentConfigForm({
  secretHint,
  publishableHint,
  webhookHint,
  webhookUrl,
  enabled,
}: {
  secretHint: string;
  publishableHint: string;
  webhookHint: string;
  webhookUrl: string;
  enabled: boolean;
}) {
  const [state, action, pending] = useActionState(savePaymentConfig, {} as FormState);
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[2rem] bg-white p-6">
      <p className="text-sm text-muted">
        {enabled
          ? "Card deposits are on. A customer can pay the amount on their invoice."
          : "Card deposits are off. Customers see the bank details until a secret key is saved."}
      </p>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-emerald-700">{state.ok}</p> : null}
      <label className="label">
        Secret key
        <span className="mt-1 block text-xs font-normal text-muted">{secretHint}</span>
        <input className="field" name="stripeSecretKey" type="password" autoComplete="off" placeholder="sk_live_… or sk_test_…" />
      </label>
      <label className="label">
        Publishable key
        <span className="mt-1 block text-xs font-normal text-muted">{publishableHint}</span>
        <input className="field" name="stripePublishableKey" type="password" autoComplete="off" placeholder="pk_live_… or pk_test_…" />
      </label>
      <label className="label">
        Webhook signing secret
        <span className="mt-1 block text-xs font-normal text-muted">{webhookHint}</span>
        <input className="field" name="stripeWebhookSecret" type="password" autoComplete="off" placeholder="whsec_…" />
      </label>
      <label className="label">
        Webhook address to paste into Stripe
        <input className="field" readOnly value={webhookUrl} />
      </label>
      <p className="text-sm text-muted">
        Leave a box empty to keep the saved value. In Stripe, send the event <span className="font-semibold">checkout.session.completed</span> to the address above. Use test keys together, or live keys together.
      </p>
      <label className="flex items-center gap-3 text-sm font-semibold text-navy-900">
        <input type="checkbox" name="clear" value="yes" className="size-4" />
        Remove the saved card credentials
      </label>
      <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-5 font-bold text-white">
        {pending ? "Saving…" : "Save payment config"}
      </button>
    </form>
  );
}
