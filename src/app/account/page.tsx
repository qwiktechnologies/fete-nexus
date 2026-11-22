import Link from "next/link";
import { PasswordForm } from "@/components/password-form";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { gbp, formatWhen } from "@/lib/format";
import { requireUser } from "@/lib/guards";

export default async function AccountHome() {
  const user = await requireUser();
  const [bookings, invoices, unread] = await Promise.all([
    prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5, include: { service: true } }),
    prisma.invoice.findMany({ where: { status: "SENT", booking: { userId: user.id } }, include: { booking: true }, orderBy: { createdAt: "desc" } }),
    prisma.message.count({ where: { readAt: null, conversation: { userId: user.id }, NOT: { senderId: user.id } } }),
  ]);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="max-w-6xl grid gap-6">
      <header>
        <p className="eyebrow text-gold-600">Your account</p>
        <h1 className="dash-title mt-2">Hello, {firstName}</h1>
        <p className="mt-3 text-muted">
          {unread ? `${unread} unread message${unread === 1 ? "" : "s"}` : "You're up to date."} Track bookings, pay deposits and message dispatch.
        </p>
      </header>
      {invoices.length ? (
        <section className="dash-cta p-6">
          <h2 className="text-xl font-semibold text-white">Deposit due</h2>
          <ul className="mt-4 grid gap-3">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 text-white">
                <span>
                  {invoice.booking.reference} · {gbp(invoice.depositPence)}
                </span>
                <Link href={`/account/bookings/${invoice.bookingId}`} className="btn-primary px-4 py-2 text-sm">
                  Pay
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-navy-900">Recent bookings</h2>
          <Link href="/book" className="text-sm font-bold text-gold-600">
            Book now
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {bookings.length ? (
            bookings.map((booking) => (
              <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link href={`/account/bookings/${booking.id}`} className="font-bold text-navy-900">
                    {booking.reference}
                  </Link>
                  <p className="text-sm text-muted">
                    {booking.service?.title ?? "Custom job"} · {formatWhen(booking.scheduledDate, booking.scheduledTime)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))
          ) : (
            <li className="py-6 text-muted">No bookings yet.</li>
          )}
        </ul>
      </section>
      <PasswordForm />
    </div>
  );
}