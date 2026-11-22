"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { homeRapidBooking } from "@/lib/home-figma";

const operationOptions = [
  "Residential / House Removal",
  "Commercial / Office Move",
  "Clearance & Waste",
  "Collection / Delivery",
];

export function RapidEstimate() {
  const router = useRouter();
  const [from, setFrom] = useState(homeRapidBooking.pickupDefault);
  const [to, setTo] = useState(homeRapidBooking.deliveryDefault);
  const [jobType, setJobType] = useState(homeRapidBooking.operationDefault);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    router.push(params.size ? `/book?${params}` : "/book");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-2xl">
      <form onSubmit={onSubmit} className="p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">{homeRapidBooking.tag}</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{homeRapidBooking.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">{homeRapidBooking.subtitle}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1.25fr_auto] lg:items-end">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/70">PICKUP POSTCODE</span>
            <input
              className="field mt-1 border-0 bg-white text-navy-900"
              name="pickup"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/70">DELIVERY POSTCODE</span>
            <input
              className="field mt-1 border-0 bg-white text-navy-900"
              name="delivery"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/70">OPERATION CLASS</span>
            <select className="field mt-1 border-0 bg-white text-navy-900" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              {operationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-gold-500 px-5 text-sm font-bold text-white hover:bg-gold-400 lg:min-w-[170px]"
          >
            {homeRapidBooking.cta}
            <FiArrowRight aria-hidden />
          </button>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-surface-50 px-5 py-4 text-sm text-navy-900">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-navy-800">{homeRapidBooking.routeLine}</p>
          <p className="text-sm text-muted">{homeRapidBooking.includes}</p>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 text-right">
          <span className="text-[11px] font-bold uppercase text-muted">{homeRapidBooking.guaranteed}</span>
          <span className="text-2xl font-bold text-navy-900">{homeRapidBooking.rate}</span>
          <span className="text-sm font-semibold text-muted">{homeRapidBooking.vat}</span>
          <Link href="/book" className="text-sm font-bold text-gold-600">
            {homeRapidBooking.lock}
          </Link>
        </div>
      </div>
    </div>
  );
}