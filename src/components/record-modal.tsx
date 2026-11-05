"use client";

import { useEffect, useState } from "react";

export function RecordModal({
  title,
  rows,
  label = "View all",
}: {
  title: string;
  rows: { label: string; value: string }[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);

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
      <button type="button" onClick={() => setOpen(true)} className="font-bold text-navy-900 underline-offset-2 hover:underline">
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/55 p-4" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-title"
            className="max-h-[86vh] w-full max-w-2xl overflow-auto rounded-[1.75rem] bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="record-title" className="text-3xl text-navy-900">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-navy-900/10 px-4 py-2 text-sm font-bold">
                Close
              </button>
            </div>
            <dl className="mt-6 grid gap-4">
              {rows.map((row) => (
                <div key={row.label} className="grid gap-1 border-t border-navy-900/10 pt-3 sm:grid-cols-[11rem_1fr]">
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{row.label}</dt>
                  <dd className="whitespace-pre-wrap text-navy-900">{row.value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}
    </>
  );
}
