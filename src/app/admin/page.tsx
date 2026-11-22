import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { StatusBadge } from "@/components/status-badge";
import { EnquiryStatusBadge } from "@/components/enquiry-status-badge";
import { prisma } from "@/lib/db";
import { formatStamp, formatWhen, gbp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { adminOverviewCopy } from "@/lib/admin-dashboard-figma";
import { bookingTypeLabel } from "@/lib/labels";
import type { BookingStatus } from "@prisma/client";

const attentionStatuses: BookingStatus[] = ["PENDING", "QUOTED", "AWAITING_PAYMENT"];

export default async function AdminHome() {
  await requireStaff();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [pending, quoted, awaiting, confirmedWeek, unread, newEnquiries, paidMonth, recent, attention, newEnquiryRows] =
    await Promise.all([
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "QUOTED" } }),
      prisma.booking.count({ where: { status: "AWAITING_PAYMENT" } }),
      prisma.booking.count({ where: { status: "CONFIRMED", updatedAt: { gte: weekStart } } }),
      prisma.message.count({ where: { readAt: null, system: false, sender: { role: "CUSTOMER" } } }),
      prisma.contactEnquiry.count({ where: { status: "NEW" } }),
      prisma.payment.aggregate({
        where: { status: "SUCCEEDED", createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
        _sum: { amountPence: true },
      }),
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: true, service: true },
      }),
      prisma.booking.findMany({
        where: { status: { in: attentionStatuses } },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: true, service: true },
      }),
      prisma.contactEnquiry.findMany({ where: { status: "NEW" }, orderBy: { createdAt: "desc" }, take: 4 }),
    ]);

  const stats = [
    { ...adminOverviewCopy.stats.newRequests, value: String(pending), href: "/admin/bookings?status=PENDING" },
    { ...adminOverviewCopy.stats.quotes, value: String(quoted), href: "/admin/quotes" },
    { ...adminOverviewCopy.stats.awaitingDeposit, value: String(awaiting), href: "/admin/bookings?status=AWAITING_PAYMENT" },
    { ...adminOverviewCopy.stats.confirmedWeek, value: String(confirmedWeek), href: "/admin/bookings?status=CONFIRMED" },
    { ...adminOverviewCopy.stats.unread, value: String(unread), href: "/admin/messages" },
    { ...adminOverviewCopy.stats.enquiries, value: String(newEnquiries), href: "/admin/enquiries?status=NEW" },
  ];

  return (
    <div className="max-w-6xl">
      <header>
        <p className="eyebrow text-gold-600">{adminOverviewCopy.workspace}</p>
        <h1 className="dash-title mt-2">{adminOverviewCopy.title}</h1>
        <p className="mt-3 max-w-2xl text-muted">{adminOverviewCopy.subtitle}</p>
        <p className="mt-2 text-sm font-semibold text-navy-800">
          Deposits this month: {gbp(paidMonth._sum.amountPence ?? 0)}
        </p>
      </header>

      <AdminStatGrid stats={stats} />

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted">{adminOverviewCopy.quickActions}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {adminOverviewCopy.actions.map((action) => (
            <Link key={action.href} href={action.href} className="btn-secondary min-h-10 px-4 text-sm">
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section className="panel overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <h2 className="text-lg font-semibold text-navy-900">{adminOverviewCopy.needsAttention}</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-gold-600">
              {adminOverviewCopy.viewAllBookings}
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {!attention.length && !newEnquiryRows.length ? (
              <li className="px-5 py-8 text-center text-sm text-muted">{adminOverviewCopy.needsAttentionEmpty}</li>
            ) : null}
            {attention.map((booking) => (
              <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <Link href={`/admin/bookings/${booking.id}`} className="font-bold text-navy-900">
                    {booking.reference}
                  </Link>
                  <p className="text-sm text-muted">
                    {booking.user.name} · {booking.service?.title ?? bookingTypeLabel[booking.type]}
                  </p>
                  <p className="text-xs text-muted">{formatWhen(booking.scheduledDate, booking.scheduledTime)}</p>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))}
            {newEnquiryRows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 bg-gold-50/40 px-5 py-4">
                <div>
                  <Link href={`/admin/enquiries/${row.id}`} className="font-bold text-navy-900">
                    {row.reference}
                  </Link>
                  <p className="text-sm text-muted">
                    {row.fullName} · {row.serviceRequired}
                  </p>
                </div>
                <EnquiryStatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="panel overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <h2 className="text-lg font-semibold text-navy-900">{adminOverviewCopy.latestBookings}</h2>
            <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm font-bold text-gold-600">
              {adminOverviewCopy.viewAllBookings}
              <FiArrowRight aria-hidden />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table min-w-full">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((booking) => (
                  <tr key={booking.id}>
                    <td className="whitespace-nowrap font-bold">
                      <Link href={`/admin/bookings/${booking.id}`} className="text-navy-900">
                        {booking.reference}
                      </Link>
                    </td>
                    <td>
                      <p className="font-semibold text-navy-900">{booking.user.name}</p>
                      <p className="text-xs text-muted">{booking.service?.title ?? bookingTypeLabel[booking.type]}</p>
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="whitespace-nowrap text-sm text-muted">{formatStamp(booking.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AdminInboxShortcuts unread={unread} enquiries={newEnquiries} />
    </div>
  );
}

function AdminStatGrid({
  stats,
}: {
  stats: { label: string; hint: string; value: string; href: string }[];
}) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Link key={stat.href + stat.label} href={stat.href} className="panel block p-5 transition hover:border-gold-300/80">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-navy-900">{stat.value}</p>
          <p className="mt-1 text-xs text-muted">{stat.hint}</p>
        </Link>
      ))}
    </div>
  );
}

function AdminInboxShortcuts({ unread, enquiries }: { unread: number; enquiries: number }) {
  if (unread === 0 && enquiries === 0) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {unread > 0 ? (
        <Link href="/admin/messages" className="btn-primary min-h-11 px-5">
          {adminOverviewCopy.viewMessages} ({unread})
        </Link>
      ) : null}
      {enquiries > 0 ? (
        <Link href="/admin/enquiries?status=NEW" className="btn-secondary min-h-11 px-5">
          {adminOverviewCopy.viewEnquiries} ({enquiries})
        </Link>
      ) : null}
    </div>
  );
}