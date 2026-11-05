import Link from "next/link";
import { cancelBooking } from "@/actions/booking";
import { startCheckout } from "@/actions/payments";
import { markDepositPaid } from "@/actions/admin";
import { BookingControls } from "@/components/booking-controls";
import { MessageThread } from "@/components/message-thread";
import { StatusBadge } from "@/components/status-badge";
import type { BookingDetail } from "@/lib/queries";
import { gbp, formatWhen } from "@/lib/format";
import { bookingTypeLabel, invoiceStatusLabel } from "@/lib/labels";

export function BookingView({
  booking,
  mode,
  viewerId,
  cardPayments,
  bank,
  notice,
}: {
  booking: BookingDetail;
  mode: "customer" | "staff";
  viewerId: string;
  cardPayments: boolean;
  bank: { accountName: string; sortCode: string; accountNumber: string };
  notice?: "invoice" | "paid" | "cancelled";
}) {
  const invoice = booking.invoices.find((item) => item.status === "SENT" || item.status === "PAID");
  const quote = booking.quotes[0];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gold-600">{booking.reference}</p>
          <h1 className="text-4xl text-navy-900">{booking.service?.title ?? bookingTypeLabel[booking.type]}</h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {notice === "paid" ? (
        <section className="rounded-[2rem] bg-emerald-50 p-6 text-navy-900">
          <h2 className="text-2xl">Payment received</h2>
          <p className="mt-2">The deposit is in. Download your receipt and booking slip.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`/account/bookings/${booking.id}/receipt`} className="inline-flex min-h-11 items-center rounded-full bg-navy-900 px-5 font-bold text-white">Download receipt</a>
            <a href={`/account/bookings/${booking.id}/slip`} className="inline-flex min-h-11 items-center rounded-full border border-navy-900/15 px-5 font-bold">Download booking slip</a>
          </div>
        </section>
      ) : null}
      {notice === "invoice" && invoice?.status === "SENT" ? (
        <section className="rounded-[2rem] bg-gold-100 p-6">
          <h2 className="text-2xl text-navy-900">Your invoice is ready</h2>
          <p className="mt-2">Pay now to confirm {booking.reference}. Card payments are taken on Stripe.</p>
        </section>
      ) : null}
      {notice === "cancelled" ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">Payment was cancelled. The invoice is still here when you are ready.</p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-6">
          <h2 className="text-2xl text-navy-900">Job details</h2>
          {mode === "staff" ? (
            <p className="mt-2 text-sm text-muted">{booking.user.name} · {booking.user.email} · {booking.user.phone ?? "No phone"}</p>
          ) : null}
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>When</dt><dd className="font-semibold">{formatWhen(booking.scheduledDate, booking.scheduledTime)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>From</dt><dd className="max-w-[60%] text-right font-semibold">{booking.locationFrom}</dd></div>
            <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>To</dt><dd className="max-w-[60%] text-right font-semibold">{booking.locationTo}</dd></div>
            {booking.distanceNote ? <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Distance</dt><dd className="font-semibold">{booking.distanceNote}</dd></div> : null}
          </dl>
          {booking.instructions ? <p className="mt-5 whitespace-pre-wrap text-navy-800">{booking.instructions}</p> : null}
          {booking.images.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {booking.images.map((image) => (
                <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
                  <img src={image.url} alt="Photograph of the job" className="h-32 w-full rounded-2xl object-cover" />
                </a>
              ))}
            </div>
          ) : null}
          {mode === "customer" && (booking.status === "PENDING" || booking.status === "QUOTED") ? (
            <form action={cancelBooking} className="mt-6">
              <input type="hidden" name="id" value={booking.id} />
              <button className="text-sm font-semibold text-red-700">Cancel request</button>
            </form>
          ) : null}
        </section>

        <div className="grid gap-6 content-start">
          {quote ? (
            <section className="rounded-[2rem] bg-gold-100 p-6">
              <h2 className="text-2xl text-navy-900">Latest quote</h2>
              <p className="mt-2 text-3xl">{gbp(quote.amountPence)}</p>
              <p className="mt-3 whitespace-pre-wrap">{quote.message}</p>
            </section>
          ) : null}
          {invoice ? (
            <section className="rounded-[2rem] bg-navy-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.16em] text-gold-400">{invoice.number} · {invoiceStatusLabel[invoice.status]}</p>
              <p className="mt-3 text-sm text-white/70">Full amount {gbp(invoice.amountPence)}</p>
              <p className="mt-1 text-4xl">{gbp(invoice.depositPence)} deposit</p>
              {invoice.notes ? <p className="mt-3 text-white/75">{invoice.notes}</p> : null}
              {invoice.status === "SENT" && mode === "customer" ? (
                <div className="mt-5">
                  {cardPayments ? (
                    <form action={startCheckout}>
                      <input type="hidden" name="invoiceId" value={invoice.id} />
                      <button className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950">
                        Pay now
                      </button>
                      <p className="mt-3 text-center text-sm text-white/70">You will complete the card payment on Stripe.</p>
                    </form>
                  ) : (
                    <div className="rounded-2xl bg-white/10 p-4 text-sm leading-6">
                      <p>Pay this deposit using your booking reference. We confirm it in this account, then the date is held.</p>
                      {bank.accountName ? (
                        <p className="mt-3">
                          {bank.accountName}<br />
                          Sort code {bank.sortCode}<br />
                          Account {bank.accountNumber}<br />
                          Reference {booking.reference}
                        </p>
                      ) : (
                        <p className="mt-3">Bank details are not on the site yet. Message the team here and they will confirm how to pay.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
              {invoice.status === "SENT" && mode === "staff" ? (
                <form action={markDepositPaid} className="mt-5">
                  <input type="hidden" name="invoiceId" value={invoice.id} />
                  <button className="inline-flex min-h-11 items-center rounded-full bg-gold-500 px-5 font-bold text-navy-950">
                    Mark deposit received
                  </button>
                </form>
              ) : null}
              {invoice.status === "PAID" ? (
                <div className="mt-4">
                  <p className="font-semibold text-gold-400">Deposit received. The booking is confirmed.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={`/account/bookings/${booking.id}/receipt`} className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-navy-950">Download receipt</a>
                    <a href={`/account/bookings/${booking.id}/slip`} className="inline-flex min-h-10 items-center rounded-full border border-white/30 px-4 text-sm font-bold text-white">Download booking slip</a>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
          {mode === "staff" ? <BookingControls bookingId={booking.id} /> : null}
        </div>
      </div>

      {booking.conversation ? (
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
      ) : null}
      {mode === "customer" ? (
        <Link href="/account/bookings" className="text-sm font-bold text-navy-800">All bookings</Link>
      ) : (
        <Link href="/admin/bookings" className="text-sm font-bold text-navy-800">All bookings</Link>
      )}
    </div>
  );
}
