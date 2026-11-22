import Link from "next/link";
import type { EnquiryStatus } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { EnquiryStatusBadge } from "@/components/enquiry-status-badge";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { enquiryStatusLabel } from "@/lib/enquiry-labels";

const statuses = Object.keys(enquiryStatusLabel) as EnquiryStatus[];
const columns = ["Reference", "Enquirer", "Service", "Route", "Status", "Received", ""];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: EnquiryStatus }>;
}) {
  await requireStaff();
  const { q, status } = await searchParams;
  const query = q?.trim();
  const enquiries = await prisma.contactEnquiry.findMany({
    where: {
      status: status && statuses.includes(status) ? status : undefined,
      OR: query
        ? [
            { reference: { contains: query, mode: "insensitive" } },
            { fullName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { serviceRequired: { contains: query, mode: "insensitive" } },
            { collectionPostcode: { contains: query, mode: "insensitive" } },
            { deliveryPostcode: { contains: query, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="w-full">
      <h1 className="dash-title">Enquiries</h1>
      <p className="mt-2 text-muted">Website contact form — same fields as the public “Send enquiry” page.</p>
      <form className="mt-6 flex flex-wrap items-center gap-3">
        <input className="field mt-0 max-w-sm" name="q" defaultValue={query} placeholder="Reference, name or postcode" />
        <select className="field mt-0 max-w-xs" name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {enquiryStatusLabel[item]}
            </option>
          ))}
        </select>
        <button className="btn-secondary">Filter</button>
      </form>
      <DataTable columns={columns} empty={!enquiries.length}>
        {enquiries.map((enquiry) => (
          <tr key={enquiry.id} className={enquiry.status === "NEW" ? "bg-gold-50/50" : undefined}>
            <td className="whitespace-nowrap font-bold text-navy-900">{enquiry.reference}</td>
            <td>
              <p className="font-semibold text-navy-900">{enquiry.fullName}</p>
              <p className="text-sm text-muted">{enquiry.email}</p>
              <p className="text-sm text-muted">{enquiry.phone || "No phone"}</p>
            </td>
            <td className="max-w-[12rem]">{enquiry.serviceRequired}</td>
            <td className="max-w-[10rem] text-sm">
              <p>{enquiry.collectionPostcode || "—"}</p>
              <p className="text-muted">{enquiry.deliveryPostcode ? `→ ${enquiry.deliveryPostcode}` : ""}</p>
            </td>
            <td>
              <EnquiryStatusBadge status={enquiry.status} />
            </td>
            <td className="whitespace-nowrap text-sm text-muted">{formatStamp(enquiry.createdAt)}</td>
            <td className="whitespace-nowrap">
              <Link href={`/admin/enquiries/${enquiry.id}`} className="btn-secondary min-h-10 px-4 text-sm">
                Open
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}