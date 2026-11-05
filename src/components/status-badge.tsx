import { bookingStatusLabel, statusTone } from "@/lib/labels";
import type { BookingStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusTone(status)}`}>
      {bookingStatusLabel[status]}
    </span>
  );
}
