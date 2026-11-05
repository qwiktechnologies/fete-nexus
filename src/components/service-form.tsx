"use client";

import { useActionState } from "react";
import { saveService } from "@/actions/admin";
import { iconOptions } from "@/components/service-icon";
import type { FormState } from "@/lib/validators";

export function ServiceForm({
  initial,
}: {
  initial?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    includes: string;
    category: string;
    icon: string;
    pricePence: number | null;
    depositPercent: number | null;
    isPurchasable: boolean;
    featured: boolean;
    active: boolean;
    sortOrder: number;
  };
}) {
  const [state, action, pending] = useActionState(saveService, {} as FormState);
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[2rem] bg-white p-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      {state.error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p> : null}
      <label className="label">Title<input className="field" name="title" required defaultValue={initial?.title} /></label>
      <label className="label">Slug<input className="field" name="slug" defaultValue={initial?.slug} placeholder="Leave blank to build it from the title" /></label>
      <label className="label">Summary<textarea className="field min-h-20" name="summary" required defaultValue={initial?.summary} /></label>
      <label className="label">Description<textarea className="field min-h-40" name="description" required defaultValue={initial?.description} /></label>
      <label className="label">What's included, one item per line<textarea className="field min-h-28" name="includes" defaultValue={initial?.includes} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="label">Category<input className="field" name="category" required defaultValue={initial?.category} /></label>
        <label className="label">Icon
          <select className="field" name="icon" defaultValue={initial?.icon ?? "package"}>
            {iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="label">Listed price (£)<input className="field" name="price" inputMode="decimal" defaultValue={initial?.pricePence != null ? (initial.pricePence / 100).toFixed(2) : ""} placeholder="Blank for quote only" /></label>
        <label className="label">Deposit % override<input className="field" name="depositPercent" defaultValue={initial?.depositPercent ?? ""} placeholder="Uses the site default if blank" /></label>
        <label className="label">Sort order<input className="field" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} /></label>
      </div>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="isPurchasable" defaultChecked={initial?.isPurchasable} /> Customers can buy this at the listed price</label>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Show in top services</label>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="active" defaultChecked={initial?.active ?? true} /> Visible on the site</label>
      <button disabled={pending} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-5 font-bold text-white">{initial ? "Save service" : "Create service"}</button>
    </form>
  );
}
