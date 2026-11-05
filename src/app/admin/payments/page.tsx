import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatStamp, gbp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { isAdminRole } from "@/lib/roles";

export default async function PaymentsPage() {
  const user = await requireStaff();
  const [outstanding, payments] = await Promise.all([
    prisma.invoice.findMany({
      where: { status: "SENT" },
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { user: true } } },
    }),
    prisma.payment.findMany({
      where: { status: "SUCCEEDED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true, invoice: { include: { booking: true } } },
    }),
  ]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-4xl text-navy-900">Payments</h1>
        <p className="mt-2 text-muted">Deposits waiting, and money already confirmed.</p>
        {isAdminRole(user.role) ? (
          <Link href="/admin/payment-config" className="mt-3 inline-flex font-semibold text-navy-900">
            Payment config
          </Link>
        ) : null}
      </div>
      <section className="rounded-[2rem] bg-white p-6">
        <h2 className="text-2xl text-navy-900">Outstanding deposits</h2>
        <ul className="mt-4 divide-y divide-navy-900/10">
          {outstanding.map((invoice) => (
            <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={`/admin/bookings/${invoice.bookingId}`} className="font-bold text-navy-900">{invoice.number} · {invoice.booking.reference}</Link>
                <p className="text-sm text-muted">{invoice.booking.user.name}</p>
              </div>
              <p className="font-bold">{gbp(invoice.depositPence)}</p>
            </li>
          ))}
          {!outstanding.length ? <li className="py-4 text-muted">Nothing waiting.</li> : null}
        </ul>
      </section>
      <section className="rounded-[2rem] bg-white p-6">
        <h2 className="text-2xl text-navy-900">Received</h2>
        <ul className="mt-4 divide-y divide-navy-900/10">
          {payments.map((payment) => (
            <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-bold text-navy-900">{payment.user.name} · {payment.invoice.booking.reference}</p>
                <p className="text-sm text-muted">{payment.provider === "stripe" ? "Card" : "Confirmed in office"} · {formatStamp(payment.createdAt)}</p>
              </div>
              <p className="font-bold">{gbp(payment.amountPence)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
