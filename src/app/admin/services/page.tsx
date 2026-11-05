import Link from "next/link";
import { setServiceActive } from "@/actions/admin";
import { DataTable, menuItemClass } from "@/components/data-table";
import { RowMenu } from "@/components/row-menu";
import { prisma } from "@/lib/db";
import { formatStamp, gbp } from "@/lib/format";
import { requireAdmin } from "@/lib/guards";

const columns = ["Service", "Category", "Price", "Deposit", "Featured", "Visible", "Order", "Updated", ""];

export default async function ServicesAdminPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-navy-900">Services</h1>
          <p className="mt-2 text-muted">Listed work, prices and what customers can book.</p>
        </div>
        <Link href="/admin/services/new" className="rounded-full bg-gold-500 px-5 py-2 font-bold text-navy-950">New service</Link>
      </div>
      <DataTable columns={columns} empty={!services.length}>
        {services.map((service) => (
          <tr key={service.id}>
            <td>
              <p className="font-bold text-navy-900">{service.title}</p>
              <p className="mt-1 max-w-xs text-sm text-muted">{service.summary}</p>
            </td>
            <td>{service.category}</td>
            <td className="whitespace-nowrap">{service.isPurchasable && service.pricePence != null ? gbp(service.pricePence) : "Quote"}</td>
            <td>{service.depositPercent != null ? `${service.depositPercent}%` : "Default"}</td>
            <td>{service.featured ? "Yes" : "No"}</td>
            <td>{service.active ? "Visible" : "Hidden"}</td>
            <td>{service.sortOrder}</td>
            <td className="whitespace-nowrap">{formatStamp(service.updatedAt)}</td>
            <td>
              <RowMenu>
                <Link href={`/admin/services/${service.id}`} className={menuItemClass}>View and edit</Link>
                <Link href={`/services/${service.slug}`} className={menuItemClass}>View on site</Link>
                <form action={setServiceActive}>
                  <input type="hidden" name="id" value={service.id} />
                  <input type="hidden" name="active" value={service.active ? "false" : "true"} />
                  <button className={menuItemClass}>{service.active ? "Hide from site" : "Show on site"}</button>
                </form>
              </RowMenu>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
