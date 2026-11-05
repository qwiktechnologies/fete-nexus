import type { BookingDetail } from "@/lib/queries";
import { gbp, formatStamp, formatWhen } from "@/lib/format";
import { bookingTypeLabel } from "@/lib/labels";
import { buildPdf, wrapPdfLine } from "@/lib/pdf";

type Company = {
  companyName: string;
  phone: string;
  email: string;
  areas: string;
  licenceNumber: string;
};

function paidInvoice(booking: BookingDetail) {
  return booking.invoices.find((invoice) => invoice.payments.some((payment) => payment.status === "SUCCEEDED"));
}

function document(lines: string[]) {
  return buildPdf(lines.flatMap((line) => wrapPdfLine(line)));
}

export function receiptPdf(booking: BookingDetail, company: Company) {
  const invoice = paidInvoice(booking);
  const payment = invoice?.payments.find((item) => item.status === "SUCCEEDED");
  if (!invoice || !payment) return null;
  return document([
    company.companyName,
    "PAYMENT RECEIPT",
    "",
    `Receipt for ${invoice.number}`,
    `Paid ${formatStamp(payment.createdAt)}`,
    "Method Card",
    `Amount ${gbp(payment.amountPence)}`,
    "",
    `Customer ${booking.user.name}`,
    `Email ${booking.user.email}`,
    `Phone ${booking.user.phone ?? "Not given"}`,
    "",
    `Booking ${booking.reference}`,
    `Job ${booking.service?.title ?? bookingTypeLabel[booking.type]}`,
    `Full amount ${gbp(invoice.amountPence)}`,
    `Deposit received ${gbp(payment.amountPence)}`,
    "",
    company.areas,
    company.phone,
    company.email,
    company.licenceNumber ? `Waste carrier ${company.licenceNumber}` : "",
    "",
    "This receipt confirms the card payment for the deposit.",
  ]);
}

export function slipPdf(booking: BookingDetail, company: Company) {
  const invoice = paidInvoice(booking);
  const payment = invoice?.payments.find((item) => item.status === "SUCCEEDED");
  if (!invoice || !payment) return null;
  return document([
    company.companyName,
    "BOOKING SLIP",
    "",
    `Reference ${booking.reference}`,
    "Status Confirmed",
    "",
    `Customer ${booking.user.name}`,
    `Email ${booking.user.email}`,
    `Phone ${booking.user.phone ?? "Not given"}`,
    "",
    `Job ${booking.service?.title ?? bookingTypeLabel[booking.type]}`,
    `When ${formatWhen(booking.scheduledDate, booking.scheduledTime)}`,
    `From ${booking.locationFrom}`,
    `To ${booking.locationTo}`,
    booking.distanceNote ? `Distance ${booking.distanceNote}` : "",
    "",
    `Invoice ${invoice.number}`,
    `Deposit paid ${gbp(payment.amountPence)}`,
    `Paid ${formatStamp(payment.createdAt)}`,
    "",
    "Instructions",
    booking.instructions || "None",
    "",
    company.areas,
    `${company.phone}  ${company.email}`,
    company.licenceNumber ? `Waste carrier ${company.licenceNumber}` : "",
  ]);
}
