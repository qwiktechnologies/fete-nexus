import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { formatWhen } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { bookingStatusLabel } from "@/lib/labels";

const statuses = Object.keys(bookingStatusLabel) as BookingStatus[];

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
    <div>
      <h1 className="text-4xl text-navy-900">Bookings</h1>
      <form className="mt-6 flex flex-wrap gap-3">
        <input className="field mt-0 max-w-sm" name="q" defaultValue={query} placeholder="Reference, name or address" />
        <select className="field mt-0 max-w-xs" name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>{bookingStatusLabel[item]}</option>
          ))}
        </select>
        <button className="rounded-full bg-navy-900 px-5 font-bold text-white">Filter</button>
      </form>
      <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
            <div>
              <Link href={`/admin/bookings/${booking.id}`} className="font-bold text-navy-900">{booking.reference} · {booking.user.name}</Link>
              <p className="text-sm text-muted">{booking.service?.title ?? "Custom job"} · {formatWhen(booking.scheduledDate, booking.scheduledTime)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
