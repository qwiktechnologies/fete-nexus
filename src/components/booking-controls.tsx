"use client";

import { useActionState } from "react";
import { sendInvoice, sendQuote, setBookingStatus } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

function Notice({ state }: { state: FormState }) {
  if (state.error) return <p className="mt-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="mt-2 text-sm text-emerald-700">{state.ok}</p>;
  return null;
}

export function BookingControls({ bookingId }: { bookingId: string }) {
  const [statusState, statusAction, statusPending] = useActionState(setBookingStatus, {} as FormState);
  const [quoteState, quoteAction, quotePending] = useActionState(sendQuote, {} as FormState);
  const [invoiceState, invoiceAction, invoicePending] = useActionState(sendInvoice, {} as FormState);

  return (
    <div className="grid gap-4">
      <form action={statusAction} className="rounded-[2rem] bg-white p-5">
        <h2 className="text-xl text-navy-900">Decision</h2>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">If rejecting, say why<textarea className="field min-h-20" name="reason" /></label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button name="status" value="ACCEPTED" disabled={statusPending} className="rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white">Accept</button>
          <button name="status" value="REJECTED" disabled={statusPending} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-800">Reject</button>
          <button name="status" value="COMPLETED" disabled={statusPending} className="rounded-full bg-paper px-4 py-2 text-sm font-bold text-navy-900">Mark complete</button>
        </div>
        <Notice state={statusState} />
      </form>
      <form action={quoteAction} className="rounded-[2rem] bg-white p-5">
        <h2 className="text-xl text-navy-900">Send a quote</h2>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">Amount (£)<input className="field" name="amount" inputMode="decimal" required /></label>
        <label className="label mt-3">Note<textarea className="field min-h-20" name="message" required /></label>
        <button disabled={quotePending} className="mt-3 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-navy-950">Send quote</button>
        <Notice state={quoteState} />
      </form>
      <form action={invoiceAction} className="rounded-[2rem] bg-white p-5">
        <h2 className="text-xl text-navy-900">Invoice</h2>
        <p className="mt-1 text-sm text-muted">The deposit is what the customer pays to confirm the booking.</p>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">Full amount (£)<input className="field" name="amount" inputMode="decimal" required /></label>
        <label className="label mt-3">Deposit (£)<input className="field" name="deposit" inputMode="decimal" required /></label>
        <label className="label mt-3">Notes<textarea className="field min-h-20" name="notes" /></label>
        <button disabled={invoicePending} className="mt-3 rounded-full bg-navy-900 px-4 py-2 text-sm font-bold text-white">Send invoice</button>
        <Notice state={invoiceState} />
      </form>
    </div>
  );
}
