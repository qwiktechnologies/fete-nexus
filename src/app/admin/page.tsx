import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import { gbp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";

export default async function AdminHome() {
  await requireStaff();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const [pending, awaiting, customers, unread, paid, recent] = await Promise.all([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "AWAITING_PAYMENT" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.message.count({ where: { readAt: null, system: false, sender: { role: "CUSTOMER" } } }),
    prisma.payment.aggregate({ where: { status: "SUCCEEDED", createdAt: { gte: start } }, _sum: { amountPence: true } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { user: true, service: true } }),
  ]);
  const cards: { label: string; value: string; href: string }[] = [
    { label: "Pending", value: String(pending), href: "/admin/bookings?status=PENDING" },
    { label: "Awaiting deposit", value: String(awaiting), href: "/admin/bookings?status=AWAITING_PAYMENT" },
    { label: "Customers", value: String(customers), href: "/admin/users" },
    { label: "Unread", value: String(unread), href: "/admin/messages" },
    { label: "Paid this month", value: gbp(paid._sum.amountPence ?? 0), href: "/admin/payments" },
  ];
  return (
    <div>
      <h1 className="text-4xl text-navy-900">Office</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, href }) => (
          <Link key={label} href={href} className="rounded-3xl bg-white p-5">
            <p className="text-sm font-bold text-muted">{label}</p>
            <p className="mt-2 text-3xl text-navy-900">{value}</p>
          </Link>
        ))}
      </div>
      <section className="mt-8 rounded-[2rem] bg-white p-6">
        <h2 className="text-2xl text-navy-900">Latest bookings</h2>
        <ul className="mt-4 divide-y divide-navy-900/10">
          {recent.map((booking) => (
            <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={`/admin/bookings/${booking.id}`} className="font-bold text-navy-900">{booking.reference}</Link>
                <p className="text-sm text-muted">{booking.user.name} · {booking.service?.title ?? "Custom job"}</p>
              </div>
              <StatusBadge status={booking.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
