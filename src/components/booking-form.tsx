"use client";

import { useActionState, useState } from "react";
import { createBooking } from "@/actions/booking";
import { gbp } from "@/lib/format";
import type { FormState } from "@/lib/validators";

type ServiceOption = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  pricePence: number | null;
  isPurchasable: boolean;
  depositPercent: number | null;
};

const jobs = [
  ["REMOVAL", "Removal", "Furniture, flats and part loads."],
  ["COLLECTION", "Collection", "We collect from one address."],
  ["HOUSE_MOVE", "House move", "A home, end to end."],
  ["DELIVERY", "Delivery", "Business or private drops."],
] as const;

export function BookingForm({
  services,
  user,
  initialSlug,
  defaultDeposit,
}: {
  services: ServiceOption[];
  user: { name: string; email: string; phone: string | null } | null;
  initialSlug?: string;
  defaultDeposit: number;
}) {
  const [state, action, pending] = useActionState(createBooking, {} as FormState);
  const preset = services.find((service) => service.slug === initialSlug);
  const [mode, setMode] = useState<"job" | "service">(preset ? "service" : "job");
  const [serviceId, setServiceId] = useState(preset?.id ?? services[0]?.id ?? "");
  const [files, setFiles] = useState<string[]>([]);
  const selected = services.find((service) => service.id === serviceId);
  const depositPercent = selected?.depositPercent ?? defaultDeposit;
  const deposit = selected?.pricePence != null ? Math.max(100, Math.round((selected.pricePence * depositPercent) / 100)) : null;

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-8">
        {state.error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.error}</p> : null}
        <fieldset className="rounded-[2rem] bg-white p-6">
          <legend className="text-2xl text-navy-900">What do you need?</legend>
          <div className="mt-4 flex gap-2">
            {(["job", "service"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${mode === item ? "bg-navy-900 text-white" : "bg-paper text-navy-900"}`}
              >
                {item === "job" ? "Book a job" : "Buy a listed service"}
              </button>
            ))}
          </div>
          {mode === "job" ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {jobs.map(([value, label, text]) => (
                <label key={value} className="rounded-2xl border border-navy-900/10 p-4">
                  <span className="flex items-center gap-2 font-bold text-navy-900">
                    <input type="radio" name="type" value={value} defaultChecked={value === "REMOVAL"} required />
                    {label}
                  </span>
                  <span className="mt-2 block text-sm text-muted">{text}</span>
                </label>
              ))}
            </div>
          ) : (
            <>
              <input type="hidden" name="type" value="SERVICE" />
              <label className="label mt-5">
                Service
                <select className="field" name="serviceId" value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.title}</option>
                  ))}
                </select>
              </label>
              {selected ? <p className="mt-3 text-sm text-muted">{selected.summary}</p> : null}
            </>
          )}
        </fieldset>

        <fieldset className="rounded-[2rem] bg-white p-6">
          <legend className="text-2xl text-navy-900">When and where</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="label">Date<input className="field" type="date" name="date" required /></label>
            <label className="label">Time<input className="field" type="time" name="time" required /></label>
            <label className="label">From<input className="field" name="locationFrom" required placeholder="Address, postcode or area" /></label>
            <label className="label">To<input className="field" name="locationTo" required placeholder="Address, postcode or area" /></label>
          </div>
          <label className="label mt-4">
            Distance, if you know it
            <input className="field" name="distanceNote" placeholder="Optional, for example 8 miles or local" />
          </label>
        </fieldset>

        <fieldset className="rounded-[2rem] bg-white p-6">
          <legend className="text-2xl text-navy-900">The job</legend>
          <label className="label mt-4">
            Additional instructions
            <textarea className="field min-h-32" name="instructions" placeholder="Access, floors, parking, what is being moved or cleared" />
          </label>
          <label className="mt-4 flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-navy-900/20 bg-paper px-6 py-8 text-center">
            <input
              className="sr-only"
              type="file"
              name="images"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
            />
            <span className="font-bold text-navy-900">Add photographs</span>
            <span className="mt-1 text-sm text-muted">Up to 6 images. JPG, PNG or WebP. Optional, and useful for a fair quote.</span>
          </label>
          {files.length ? <p className="mt-3 text-sm text-muted">{files.join(", ")}</p> : null}
        </fieldset>

        {user ? (
          <p className="rounded-2xl bg-gold-100 px-4 py-3 text-sm text-navy-900">Booking as {user.name} · {user.email}</p>
        ) : (
          <fieldset className="rounded-[2rem] bg-white p-6">
            <legend className="text-2xl text-navy-900">Your account</legend>
            <p className="mt-2 text-sm text-muted">We create an account so the quote, invoice and messages stay with this booking.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="label">Name<input className="field" name="name" required autoComplete="name" /></label>
              <label className="label">Phone<input className="field" name="phone" required autoComplete="tel" /></label>
              <label className="label">Email<input className="field" type="email" name="email" required autoComplete="email" /></label>
              <label className="label">Password<input className="field" type="password" name="password" required minLength={8} autoComplete="new-password" /></label>
            </div>
          </fieldset>
        )}
      </div>

      <aside className="h-fit rounded-[2rem] bg-navy-900 p-6 text-white lg:sticky lg:top-24">
        <p className="text-sm uppercase tracking-[0.16em] text-gold-400">Summary</p>
        <h2 className="mt-3 text-3xl">{mode === "service" ? selected?.title : "Custom job"}</h2>
        {mode === "service" && selected?.isPurchasable && selected.pricePence != null ? (
          <p className="mt-4 text-white/80">
            Listed price {gbp(selected.pricePence)}. After you submit, the invoice is ready and Pay now takes the {deposit != null ? gbp(deposit) : "deposit"} on Stripe.
          </p>
        ) : (
          <p className="mt-4 text-white/80">We&apos;ll send a quote in your account. You pay the deposit on the invoice, and that confirms the booking.</p>
        )}
        <button disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950 disabled:opacity-60">
          {pending ? "Sending…" : "Submit booking"}
        </button>
      </aside>
    </form>
  );
}
