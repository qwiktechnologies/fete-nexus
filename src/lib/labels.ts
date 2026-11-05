import type { BookingStatus, BookingType, InvoiceStatus, PaymentStatus } from "@prisma/client";

export const bookingTypeLabel: Record<BookingType, string> = {
  REMOVAL: "Removal",
  COLLECTION: "Collection",
  HOUSE_MOVE: "House move",
  DELIVERY: "Delivery",
  SERVICE: "Listed service",
};

export const bookingStatusLabel: Record<BookingStatus, string> = {
  PENDING: "Pending review",
  QUOTED: "Quote sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  AWAITING_PAYMENT: "Awaiting deposit",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCEEDED: "Received",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export function paymentTypeLabel(provider: string) {
  if (provider === "stripe") return "Card";
  if (provider === "bank") return "Bank transfer";
  return "Office";
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Awaiting payment",
  PAID: "Paid",
  VOID: "Replaced",
};

export function statusTone(status: BookingStatus) {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-800";
    case "AWAITING_PAYMENT":
    case "QUOTED":
      return "bg-gold-100 text-navy-900";
    case "REJECTED":
    case "CANCELLED":
      return "bg-red-50 text-red-800";
    case "ACCEPTED":
      return "bg-sky-50 text-sky-900";
    default:
      return "bg-navy-100 text-navy-800";
  }
}
