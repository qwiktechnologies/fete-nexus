"use client";

import { useActionState } from "react";
import { saveSettings } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

type Settings = {
  companyName: string;
  heroLine: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  areas: string;
  directorName: string;
  licenceNumber: string;
  insuredNote: string;
  about: string;
  hours: string;
  depositPercent: number;
  bankAccountName: string;
  bankSortCode: string;
  bankAccountNumber: string;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, {} as FormState);
  const fields: [keyof Settings, string][] = [
    ["companyName", "Company name"],
    ["heroLine", "Hero line"],
    ["tagline", "Motto"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["address", "Address"],
    ["areas", "Areas"],
    ["directorName", "Director"],
    ["licenceNumber", "Waste carrier licence"],
    ["insuredNote", "Insurance line"],
    ["hours", "Hours"],
  ];
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[2rem] bg-white p-6">
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? <p className="text-sm text-emerald-700">{state.ok}</p> : null}
      {fields.map(([name, label]) => (
        <label key={name} className="label">{label}<input className="field" name={name} defaultValue={String(settings[name])} /></label>
      ))}
      <label className="label">About<textarea className="field min-h-40" name="about" defaultValue={settings.about} /></label>
      <label className="label">Default deposit %<input className="field" name="depositPercent" type="number" min={1} max={100} defaultValue={settings.depositPercent} /></label>
      <h2 className="mt-2 text-2xl text-navy-900">Bank details for deposits</h2>
      <label className="label">Account name<input className="field" name="bankAccountName" defaultValue={settings.bankAccountName} /></label>
      <label className="label">Sort code<input className="field" name="bankSortCode" defaultValue={settings.bankSortCode} /></label>
      <label className="label">Account number<input className="field" name="bankAccountNumber" defaultValue={settings.bankAccountNumber} /></label>
      <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-5 font-bold text-white">Save details</button>
    </form>
  );
}
