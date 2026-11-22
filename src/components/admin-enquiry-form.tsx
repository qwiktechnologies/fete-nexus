"use client";

import { useActionState } from "react";
import type { EnquiryStatus } from "@prisma/client";
import { updateEnquiry } from "@/actions/contact";
import { enquiryStatusLabel } from "@/lib/enquiry-labels";
import type { FormState } from "@/lib/validators";

export function AdminEnquiryForm({
  enquiryId,
  status,
  adminNote,
}: {
  enquiryId: string;
  status: EnquiryStatus;
  adminNote: string;
}) {
  const [state, action, pending] = useActionState(updateEnquiry, {} as FormState);
  const statuses = Object.keys(enquiryStatusLabel) as EnquiryStatus[];

  return (
    <form action={action} className="panel mt-8 p-6">
      <h2 className="text-lg font-semibold text-navy-900">Office follow-up</h2>
      <p className="mt-1 text-sm text-muted">Update status after you have called or emailed the customer.</p>
      {state.error ? <p className="mt-3 text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="mt-3 text-sm font-semibold text-forest-800">{state.ok}</p> : null}
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <label className="label mt-4">
        Status
        <select className="field" name="status" defaultValue={status}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {enquiryStatusLabel[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="label mt-4">
        Internal note
        <textarea className="field min-h-28" name="adminNote" defaultValue={adminNote} placeholder="Dispatch notes (not sent to the customer)" />
      </label>
      <button type="submit" disabled={pending} className="btn-secondary mt-4">
        Save
      </button>
    </form>
  );
}