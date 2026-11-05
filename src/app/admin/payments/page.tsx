import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { RecordModal } from "@/components/record-modal";
import { prisma } from "@/lib/db";
import { formatStamp, gbp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";
import { invoiceStatusLabel, paymentStatusLabel, paymentTypeLabel } from "@/lib/labels";
import { isAdminRole } from "@/lib/roles";

const columns = ["When", "Customer", "Booking", "Invoice", "Type", "Status", "Amount", ""];

function tone(status: string) {
  if (status === "Received" || status === "Paid") return "bg-emerald-50 text-emerald-800";
  if (status === "Failed" || status === "Replaced") return "bg-red-50 text-red-800";
  if (status === "Refunded") return "bg-sky-50 text-sky-900";
  return "bg-gold-100 text-navy-900";
}

export default async function PaymentsPage() {
  const user = await requireStaff();
  const [payments, waiting] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: true, invoice: { include: { booking: { include: { user: true } } } } },
    }),
    prisma.invoice.findMany({
      where: { status: { in: ["SENT", "DRAFT", "VOID"] }, payments: { none: {} } },
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { user: true } } },
    }),
  ]);

  const rows = [
    ...payments.map((payment) => {
      const status = paymentStatusLabel[payment.status];
      const type = paymentTypeLabel(payment.provider);
      return {
        key: payment.id,
        when: payment.createdAt,
        customer: payment.user.name,
        email: payment.user.email,
        reference: payment.invoice.booking.reference,
        invoice: payment.invoice.number,
        type,
        status,
        amount: gbp(payment.amountPence),
        bookingId: payment.invoice.bookingId,
        detail: [
          { label: "Customer", value: payment.user.name },
          { label: "Email", value: payment.user.email },
          { label: "Phone", value: payment.user.phone ?? "" },
          { label: "Booking", value: payment.invoice.booking.reference },
          { label: "Invoice", value: payment.invoice.number },
          { label: "Type", value: type },
          { label: "Status", value: status },
          { label: "Amount", value: gbp(payment.amountPence) },
          { label: "Full invoice", value: gbp(payment.invoice.amountPence) },
          { label: "When", value: formatStamp(payment.createdAt) },
          { label: "Notes", value: payment.invoice.notes },
        ],
      };
    }),
    ...waiting.map((invoice) => {
      const status = invoiceStatusLabel[invoice.status];
      return {
        key: `invoice-${invoice.id}`,
        when: invoice.createdAt,
        customer: invoice.booking.user.name,
        email: invoice.booking.user.email,
        reference: invoice.booking.reference,
        invoice: invoice.number,
        type: "Deposit",
        status,
        amount: gbp(invoice.depositPence),
        bookingId: invoice.bookingId,
        detail: [
          { label: "Customer", value: invoice.booking.user.name },
          { label: "Email", value: invoice.booking.user.email },
          { label: "Phone", value: invoice.booking.user.phone ?? "" },
          { label: "Booking", value: invoice.booking.reference },
          { label: "Invoice", value: invoice.number },
          { label: "Type", value: "Deposit" },
          { label: "Status", value: status },
          { label: "Deposit", value: gbp(invoice.depositPence) },
          { label: "Full amount", value: gbp(invoice.amountPence) },
          { label: "When", value: formatStamp(invoice.createdAt) },
          { label: "Notes", value: invoice.notes },
        ],
      };
    }),
  ].sort((a, b) => b.when.getTime() - a.when.getTime());

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl text-navy-900">Payments</h1>
          <p className="mt-2 text-muted">Card payments, bank deposits and invoices still waiting.</p>
        </div>
        {isAdminRole(user.role) ? (
          <Link href="/admin/payment-config" className="font-bold text-navy-900">Payment config</Link>
        ) : null}
      </div>
      <DataTable columns={columns} empty={!rows.length}>
        {rows.map((row) => (
          <tr key={row.key}>
            <td className="whitespace-nowrap">{formatStamp(row.when)}</td>
            <td>
              <p className="font-semibold text-navy-900">{row.customer}</p>
              <p className="text-sm text-muted">{row.email}</p>
            </td>
            <td className="whitespace-nowrap font-semibold">{row.reference}</td>
            <td className="whitespace-nowrap">{row.invoice}</td>
            <td>{row.type}</td>
            <td>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${tone(row.status)}`}>
                {row.status}
              </span>
            </td>
            <td className="whitespace-nowrap font-bold">{row.amount}</td>
            <td className="whitespace-nowrap">
              <div className="flex items-center gap-3">
                <RecordModal title={`${row.invoice} · ${row.reference}`} rows={row.detail} />
                <Link href={`/admin/bookings/${row.bookingId}`} className="font-bold text-gold-600">Open</Link>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
