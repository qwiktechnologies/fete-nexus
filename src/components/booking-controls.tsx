"use client";

import { useActionState } from "react";
import { sendInvoice, sendQuote, setBookingStatus } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

function Notice({ state }: { state: FormState }) {
  if (state.error) return <p className="mt-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="mt-2 text-sm text-forest-700">{state.ok}</p>;
  return null;
}

export function BookingControls({ bookingId }: { bookingId: string }) {
  const [statusState, statusAction, statusPending] = useActionState(setBookingStatus, {} as FormState);
  const [quoteState, quoteAction, quotePending] = useActionState(sendQuote, {} as FormState);
  const [invoiceState, invoiceAction, invoicePending] = useActionState(sendInvoice, {} as FormState);

  return (
    <div className="grid gap-4">
      <form action={statusAction} className="panel p-5">
        <h2 className="text-lg font-semibold text-navy-900">Decision</h2>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">
          Reason (if rejecting)
          <textarea className="field min-h-20" name="reason" />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button name="status" value="ACCEPTED" disabled={statusPending} className="btn-success">
            Accept
          </button>
          <button name="status" value="REJECTED" disabled={statusPending} className="btn-danger">
            Reject
          </button>
          <button name="status" value="COMPLETED" disabled={statusPending} className="btn-outline min-h-10 px-4 text-sm">
            Mark complete
          </button>
        </div>
        <Notice state={statusState} />
      </form>
      <form action={quoteAction} className="panel p-5">
        <h2 className="text-lg font-semibold text-navy-900">Send a quote</h2>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">
          Amount (£)
          <input className="field" name="amount" inputMode="decimal" required />
        </label>
        <label className="label mt-3">
          Note
          <textarea className="field min-h-20" name="message" required />
        </label>
        <button type="submit" disabled={quotePending} className="btn-primary mt-3 min-h-10 px-4 text-sm">
          Send quote
        </button>
        <Notice state={quoteState} />
      </form>
      <form action={invoiceAction} className="panel p-5">
        <h2 className="text-lg font-semibold text-navy-900">Generate invoice</h2>
        <p className="mt-1 text-sm text-muted">The deposit is what the customer pays to confirm the booking.</p>
        <input type="hidden" name="id" value={bookingId} />
        <label className="label mt-3">
          Full amount (£)
          <input className="field" name="amount" inputMode="decimal" required />
        </label>
        <label className="label mt-3">
          Deposit (£)
          <input className="field" name="deposit" inputMode="decimal" required />
        </label>
        <label className="label mt-3">
          Notes
          <textarea className="field min-h-20" name="notes" />
        </label>
        <button type="submit" disabled={invoicePending} className="btn-secondary mt-3 min-h-10 px-4 text-sm">
          Send invoice
        </button>
        <Notice state={invoiceState} />
      </form>
    </div>
  );
}