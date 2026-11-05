import Link from "next/link";
import { prisma } from "@/lib/db";
import { gbp } from "@/lib/format";
import { requireAdmin } from "@/lib/guards";

export default async function ServicesAdminPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl text-navy-900">Services</h1>
        <Link href="/admin/services/new" className="rounded-full bg-gold-500 px-5 py-2 font-bold text-navy-950">New service</Link>
      </div>
      <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
        {services.map((service) => (
          <li key={service.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <Link href={`/admin/services/${service.id}`} className="font-bold text-navy-900">{service.title}</Link>
              <p className="text-sm text-muted">{service.category} · {service.active ? "Visible" : "Hidden"} · {service.isPurchasable && service.pricePence != null ? gbp(service.pricePence) : "Quote"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
