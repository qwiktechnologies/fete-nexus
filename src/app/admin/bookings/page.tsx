import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { RecordModal } from "@/components/record-modal";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { formatStamp, formatWhen } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { bookingStatusLabel, bookingTypeLabel } from "@/lib/labels";

const statuses = Object.keys(bookingStatusLabel) as BookingStatus[];
const columns = ["Reference", "Customer", "Job", "When", "From", "To", "Status", ""];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: BookingStatus }>;
}) {
  await requireStaff();
  const { q, status } = await searchParams;
  const query = q?.trim();
  const bookings = await prisma.booking.findMany({
    where: {
      status: status && statuses.includes(status) ? status : undefined,
      OR: query
        ? [
            { reference: { contains: query, mode: "insensitive" } },
            { locationFrom: { contains: query, mode: "insensitive" } },
            { locationTo: { contains: query, mode: "insensitive" } },
            { user: { name: { contains: query, mode: "insensitive" } } },
            { user: { email: { contains: query, mode: "insensitive" } } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: { user: true, service: true },
    take: 100,
  });

  return (
    <div className="w-full">
      <h1 className="text-4xl text-navy-900">Bookings</h1>
      <p className="mt-2 text-muted">Every request, with the job, the addresses and the status.</p>
      <form className="mt-6 flex flex-wrap items-center gap-3">
        <input className="field mt-0 max-w-sm" name="q" defaultValue={query} placeholder="Reference, name or address" />
        <select className="field mt-0 max-w-xs" name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>{bookingStatusLabel[item]}</option>
          ))}
        </select>
        <button className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-bold text-white">Filter</button>
      </form>
      <DataTable columns={columns} empty={!bookings.length}>
        {bookings.map((booking) => (
          <tr key={booking.id}>
            <td className="whitespace-nowrap font-bold text-navy-900">{booking.reference}</td>
            <td>
              <p className="font-semibold text-navy-900">{booking.user.name}</p>
              <p className="text-sm text-muted">{booking.user.email}</p>
              <p className="text-sm text-muted">{booking.user.phone ?? "No phone"}</p>
            </td>
            <td>
              <p>{booking.service?.title ?? "Custom job"}</p>
              <p className="text-sm text-muted">{bookingTypeLabel[booking.type]}</p>
            </td>
            <td className="whitespace-nowrap">{formatWhen(booking.scheduledDate, booking.scheduledTime)}</td>
            <td className="max-w-[14rem]">{booking.locationFrom}</td>
            <td className="max-w-[14rem]">{booking.locationTo}</td>
            <td><StatusBadge status={booking.status} /></td>
            <td className="whitespace-nowrap">
              <div className="flex items-center gap-3">
                <RecordModal
                  title={booking.reference}
                  rows={[
                    { label: "Reference", value: booking.reference },
                    { label: "Customer", value: booking.user.name },
                    { label: "Email", value: booking.user.email },
                    { label: "Phone", value: booking.user.phone ?? "" },
                    { label: "Job", value: booking.service?.title ?? "Custom job" },
                    { label: "Type", value: bookingTypeLabel[booking.type] },
                    { label: "Status", value: bookingStatusLabel[booking.status] },
                    { label: "When", value: formatWhen(booking.scheduledDate, booking.scheduledTime) },
                    { label: "From", value: booking.locationFrom },
                    { label: "To", value: booking.locationTo },
                    { label: "Distance", value: booking.distanceNote },
                    { label: "Instructions", value: booking.instructions },
                    { label: "Office note", value: booking.adminNote },
                    { label: "Received", value: formatStamp(booking.createdAt) },
                  ]}
                />
                <Link href={`/admin/bookings/${booking.id}`} className="font-bold text-gold-600">Open</Link>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
