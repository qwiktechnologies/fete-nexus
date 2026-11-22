"use client";

import { useActionState, useState } from "react";
import { markDepositPaid, sendInvoice, sendQuote, setBookingStatus } from "@/actions/admin";
import { adminBookingDetailCopy } from "@/lib/admin-booking-detail-figma";
import type { FormState } from "@/lib/validators";

function Notice({ state }: { state: FormState }) {
  if (state.error) return <p className="mt-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok) return <p className="mt-2 text-sm text-forest-700">{state.ok}</p>;
  return null;
}

export function AdminBookingDecisionPanel({
  bookingId,
  openInvoiceId,
}: {
  bookingId: string;
  openInvoiceId?: string;
}) {
  const [statusState, statusAction, statusPending] = useActionState(setBookingStatus, {} as FormState);
  const [quoteState, quoteAction, quotePending] = useActionState(sendQuote, {} as FormState);
  const [invoiceState, invoiceAction, invoicePending] = useActionState(sendInvoice, {} as FormState);
  const [showQuote, setShowQuote] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <section className="panel flex h-full flex-col p-6">
      <h2 className="text-lg font-semibold text-navy-900">{adminBookingDetailCopy.decision}</h2>

      <form action={statusAction} className="mt-4">
        <input type="hidden" name="id" value={bookingId} />
        <div className="flex flex-wrap gap-2">
          <button name="status" value="ACCEPTED" disabled={statusPending} className="btn-success min-h-10 px-5">
            {adminBookingDetailCopy.accept}
          </button>
          <button name="status" value="REJECTED" disabled={statusPending} className="min-h-10 rounded-md border border-red-800 bg-white px-5 text-sm font-bold text-red-800 hover:bg-red-50">
            {adminBookingDetailCopy.reject}
          </button>
          <button name="status" value="COMPLETED" disabled={statusPending} className="btn-outline min-h-10 px-4 text-sm">
            {adminBookingDetailCopy.markComplete}
          </button>
        </div>
        <label className="label mt-4">
          {adminBookingDetailCopy.reasonLabel}
          <textarea className="field min-h-20" name="reason" />
        </label>
        <Notice state={statusState} />
      </form>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border/70 pt-5">
        <button
          type="button"
          className="btn-primary min-h-10 px-5"
          onClick={() => {
            setShowQuote((v) => !v);
            setShowInvoice(false);
          }}
        >
          {adminBookingDetailCopy.sendQuote}
        </button>
        <button
          type="button"
          className="btn-secondary min-h-10 px-5"
          onClick={() => {
            setShowInvoice((v) => !v);
            setShowQuote(false);
          }}
        >
          {adminBookingDetailCopy.generateInvoice}
        </button>
      </div>

      {showQuote ? (
        <form action={quoteAction} className="mt-4 rounded-lg border border-border bg-surface-50 p-4">
          <input type="hidden" name="id" value={bookingId} />
          <label className="label">
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
      ) : null}

      {showInvoice ? (
        <form action={invoiceAction} className="mt-4 rounded-lg border border-border bg-surface-50 p-4">
          <input type="hidden" name="id" value={bookingId} />
          <label className="label">
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
      ) : null}

      {openInvoiceId ? (
        <form action={markDepositPaid} className="mt-4 border-t border-border/70 pt-4">
          <input type="hidden" name="invoiceId" value={openInvoiceId} />
          <button type="submit" className="btn-primary min-h-10 text-sm">
            {adminBookingDetailCopy.markDeposit}
          </button>
        </form>
      ) : null}
    </section>
  );
}