import { bookingConfirmationCopy } from "@/lib/booking-confirmation-figma";
import { bookingTypeLabel } from "@/lib/labels";
import { formatArrivalSchedule, formatDate, gbp } from "@/lib/format";
import type { BookingDetail } from "@/lib/queries";

export type BookingConfirmationPayload = {
  reference: string;
  header: string;
  badge: string;
  headline: string;
  thanks: string;
  schedule: string;
  glance: {
    from: string;
    to: string;
    service: string;
    teamVehicle: string;
    distance: string;
  };
  payment: {
    totalPence: number;
    depositPence: number;
    balancePence: number;
    paidOn: string | null;
    canDownloadReceipt: boolean;
  } | null;
  customer: { firstName: string; email: string };
};

export function serviceLabelForBooking(booking: BookingDetail) {
  return booking.service?.title ?? bookingTypeLabel[booking.type];
}

export function isConfirmationReady(booking: BookingDetail) {
  if (booking.status === "COMPLETED") return true;
  if (booking.status !== "CONFIRMED") return false;
  return booking.invoices.some((invoice) => invoice.status === "PAID");
}

export function buildBookingConfirmation(
  booking: BookingDetail,
  customer: { name: string; email: string },
): BookingConfirmationPayload | null {
  if (!isConfirmationReady(booking)) return null;

  const service = serviceLabelForBooking(booking);
  const firstName = customer.name.split(/\s+/)[0] || customer.name;
  const paidInvoice =
    booking.invoices.find((invoice) => invoice.status === "PAID") ??
    booking.invoices.find((invoice) => invoice.depositPence > 0);

  const payment = paidInvoice
    ? (() => {
        const succeeded = paidInvoice.payments.find((item) => item.status === "SUCCEEDED");
        const paidOn = succeeded?.createdAt ? formatDate(succeeded.createdAt) : null;
        const canDownloadReceipt = paidInvoice.payments.some(
          (item) => item.status === "SUCCEEDED" && item.provider === "stripe",
        );
        return {
          totalPence: paidInvoice.amountPence,
          depositPence: paidInvoice.depositPence,
          balancePence: Math.max(0, paidInvoice.amountPence - paidInvoice.depositPence),
          paidOn,
          canDownloadReceipt,
        };
      })()
    : null;

  return {
    reference: booking.reference,
    header: `BOOKING ${booking.reference}   /   ${bookingConfirmationCopy.statusSuffix}`,
    badge: `${bookingConfirmationCopy.statusSuffix}   •   ${booking.reference}`,
    headline: bookingConfirmationCopy.headline,
    thanks: bookingConfirmationCopy.thanks(firstName, service),
    schedule: formatArrivalSchedule(booking.scheduledDate, booking.scheduledTime),
    glance: {
      from: booking.locationFrom,
      to: booking.locationTo,
      service,
      teamVehicle: bookingConfirmationCopy.defaultTeam,
      distance: booking.distanceNote.trim() || bookingConfirmationCopy.defaultDistance,
    },
    payment,
    customer: { firstName, email: customer.email },
  };
}

export function confirmationToJson(payload: BookingConfirmationPayload) {
  return {
    reference: payload.reference,
    headline: payload.headline,
    schedule: payload.schedule,
    glance: payload.glance,
    payment: payload.payment
      ? {
          total: gbp(payload.payment.totalPence),
          deposit: gbp(payload.payment.depositPence),
          balance: gbp(payload.payment.balancePence),
          paidOn: payload.payment.paidOn,
        }
      : null,
    customer: { email: payload.customer.email },
  };
}