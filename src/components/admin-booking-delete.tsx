"use client";

import { useState } from "react";
import { deleteBooking } from "@/actions/admin";

export function AdminBookingDelete({
  bookingId,
  reference,
}: {
  bookingId: string;
  reference: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");

  return (
    <section className="panel border border-red-200 p-6">
      <h2 className="text-lg font-semibold text-navy-900">Delete booking</h2>
      <p className="mt-2 text-sm text-muted">
        Permanently removes this booking, messages, quotes and invoices. Only admins can do this. Customers cannot delete bookings from their account.
      </p>
      {!open ? (
        <button type="button" className="mt-4 text-sm font-bold text-red-800 underline hover:no-underline" onClick={() => setOpen(true)}>
          Delete this booking…
        </button>
      ) : (
        <form action={deleteBooking} className="mt-4 space-y-3">
          <input type="hidden" name="id" value={bookingId} />
          <label className="label">
            Type <span className="font-mono font-bold text-navy-900">{reference}</span> to confirm
            <input
              className="field"
              name="confirm"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="off"
              required
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={confirm !== reference}
              className="min-h-10 rounded-md bg-red-800 px-4 text-sm font-bold text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete permanently
            </button>
            <button type="button" className="btn-outline min-h-10 px-4 text-sm" onClick={() => { setOpen(false); setConfirm(""); }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}