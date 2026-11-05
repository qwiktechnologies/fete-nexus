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

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-4xl text-navy-900">Hello, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 text-muted">{unread ? `${unread} unread message${unread === 1 ? "" : "s"}` : "You're up to date."}</p>
      </div>
      {invoices.length ? (
        <section className="rounded-[2rem] bg-navy-900 p-6 text-white">
          <h2 className="text-2xl">Deposit due</h2>
          <ul className="mt-4 grid gap-3">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3">
                <span>{invoice.booking.reference} · {gbp(invoice.depositPence)}</span>
                <Link href={`/account/bookings/${invoice.bookingId}`} className="rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-navy-950">Pay</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="rounded-[2rem] bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-navy-900">Recent bookings</h2>
          <Link href="/book" className="font-bold text-navy-900">Book now</Link>
        </div>
        <ul className="mt-4 divide-y divide-navy-900/10">
          {bookings.length ? bookings.map((booking) => (
            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={`/account/bookings/${booking.id}`} className="font-bold text-navy-900">{booking.reference}</Link>
                <p className="text-sm text-muted">{booking.service?.title ?? "Custom job"} · {formatWhen(booking.scheduledDate, booking.scheduledTime)}</p>
              </div>
              <StatusBadge status={booking.status} />
            </li>
          )) : <li className="py-6 text-muted">No bookings yet.</li>}
        </ul>
      </section>
      <PasswordForm />
    </div>
  );
}
