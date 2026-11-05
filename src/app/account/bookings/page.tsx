import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { formatWhen } from "@/lib/format";
import { requireUser } from "@/lib/guards";
import { bookingTypeLabel } from "@/lib/labels";

export default async function AccountBookingsPage() {
  const user = await requireUser();
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { service: true },
  });
  return (
    <div>
      <h1 className="text-4xl text-navy-900">Bookings</h1>
      <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
            <div>
              <Link href={`/account/bookings/${booking.id}`} className="text-lg font-bold text-navy-900">{booking.reference}</Link>
              <p className="text-sm text-muted">{booking.service?.title ?? bookingTypeLabel[booking.type]} · {formatWhen(booking.scheduledDate, booking.scheduledTime)}</p>
            </div>
            <StatusBadge status={booking.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
