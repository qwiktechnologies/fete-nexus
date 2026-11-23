import Link from "next/link";
import { AdminBookingDelete } from "@/components/admin-booking-delete";
import { AdminBookingDecisionPanel } from "@/components/admin-booking-decision-panel";
import { MessageThread } from "@/components/message-thread";
import { StatusBadge } from "@/components/status-badge";
import { adminBookingDetailCopy } from "@/lib/admin-booking-detail-figma";
import { formatStamp, formatWhen } from "@/lib/format";
import { bookingStatusLabel, bookingTypeLabel } from "@/lib/labels";
import type { BookingDetail } from "@/lib/queries";
function buildActivity(booking: BookingDetail) {
  const items: { at: Date; text: string }[] = [
    { at: booking.createdAt, text: adminBookingDetailCopy.requestSubmitted },
    { at: booking.updatedAt, text: adminBookingDetailCopy.statusSet(bookingStatusLabel[booking.status]) },
  ];
  for (const message of booking.conversation?.messages ?? []) {
    if (message.system) items.push({ at: message.createdAt, text: message.body });
  }
  items.sort((a, b) => b.at.getTime() - a.at.getTime());
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.at.toISOString()}-${item.text.slice(0, 40)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function AdminBookingDetail({
  booking,
  viewerId,
  canDelete,
}: {
  booking: BookingDetail;
  viewerId: string;
  canDelete?: boolean;
}) {
  const serviceLabel = booking.service?.title ?? bookingTypeLabel[booking.type];
  const openInvoice = booking.invoices.find((item) => item.status === "SENT");
  const activity = buildActivity(booking);
  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <Link href="/admin/bookings" className="text-sm font-bold text-gold-600">
          {adminBookingDetailCopy.back}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <h1 className="dash-title">{adminBookingDetailCopy.title(booking.reference)}</h1>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-navy-900">{adminBookingDetailCopy.customer}</h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            <DetailRow label={adminBookingDetailCopy.fields.name} value={booking.user.name} />
            <DetailRow label={adminBookingDetailCopy.fields.email} value={booking.user.email} />
            <DetailRow label={adminBookingDetailCopy.fields.phone} value={booking.user.phone ?? "—"} />
          </dl>
        </section>

        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-navy-900">{adminBookingDetailCopy.jobDetails}</h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            <DetailRow label={adminBookingDetailCopy.fields.service} value={serviceLabel} />
            <DetailRow label={adminBookingDetailCopy.fields.when} value={formatWhen(booking.scheduledDate, booking.scheduledTime)} />
            <DetailRow label={adminBookingDetailCopy.fields.pickup} value={booking.locationFrom} />
            <DetailRow label={adminBookingDetailCopy.fields.dropoff} value={booking.locationTo} />
            <DetailRow
              label={adminBookingDetailCopy.fields.distance}
              value={booking.distanceNote.trim() || "—"}
            />
          </dl>
          {booking.instructions ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">{adminBookingDetailCopy.fields.instructions}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-navy-900">{booking.instructions}</p>
            </div>
          ) : null}
          {booking.images.length ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {booking.images.map((image) => (
                <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
                  <img src={image.url} alt="" className="h-20 w-full rounded-lg object-cover" />
                </a>
              ))}
            </div>
          ) : null}
        </section>

        <AdminBookingDecisionPanel bookingId={booking.id} openInvoiceId={openInvoice?.id} />

        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-navy-900">{adminBookingDetailCopy.activity}</h2>
          <ul className="mt-4 max-h-80 divide-y divide-border overflow-y-auto">
            {activity.map((item) => (
              <li key={`${item.at.toISOString()}-${item.text}`} className="py-3 text-sm">
                <p className="text-xs font-semibold text-muted">{formatStamp(item.at)}</p>
                <p className="mt-1 text-navy-900">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {canDelete ? <AdminBookingDelete bookingId={booking.id} reference={booking.reference} /> : null}

      {booking.conversation ? (
        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-navy-900">{adminBookingDetailCopy.messages}</h2>
          <MessageThread
            conversationId={booking.conversation.id}
            viewerId={viewerId}
            messages={booking.conversation.messages.map((message) => ({
              id: message.id,
              body: message.body,
              system: message.system,
              createdAt: message.createdAt.toISOString(),
              sender: message.sender,
            }))}
          />
        </section>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3 first:pt-0">
      <dt className="text-muted">{label}</dt>
      <dd className="max-w-[65%] text-right font-semibold text-navy-900">{value}</dd>
    </div>
  );
}
