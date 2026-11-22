import { bookingQuoteCopy } from "@/lib/quote-figma";
import { bookingConfirmationCopy } from "@/lib/booking-confirmation-figma";
import { formatArrivalSchedule, gbp } from "@/lib/format";
import { bookingTypeLabel } from "@/lib/labels";
import type { BookingDetail } from "@/lib/queries";

export type BookingQuotePayload = {
  reference: string;
  header: string;
  badge: string;
  headline: string;
  intro: string;
  schedule: string;
  glance: {
    from: string;
    to: string;
    service: string;
    teamVehicle: string;
    distance: string;
  };
  quote: {
    amountPence: number;
    message: string;
    createdAt: string;
  } | null;
  invoice: {
    id: string;
    number: string;
    totalPence: number;
    depositPence: number;
    balancePence: number;
    notes: string;
  } | null;
  customer: { firstName: string; email: string };
};

function serviceLabel(booking: BookingDetail) {
  return booking.service?.title ?? bookingTypeLabel[booking.type];
}

export function isQuotePageReady(booking: BookingDetail) {
  if (["REJECTED", "CANCELLED", "COMPLETED", "CONFIRMED"].includes(booking.status)) return false;
  const openInvoice = booking.invoices.find((item) => item.status === "SENT");
  if (openInvoice) return true;
  return booking.status === "QUOTED" && booking.quotes.length > 0;
}

export function buildBookingQuote(
  booking: BookingDetail,
  customer: { name: string; email: string },
): BookingQuotePayload | null {
  if (!isQuotePageReady(booking)) return null;

  const firstName = customer.name.split(/\s+/)[0] || customer.name;
  const service = serviceLabel(booking);
  const latestQuote = booking.quotes[0] ?? null;
  const openInvoice = booking.invoices.find((item) => item.status === "SENT") ?? null;

  const totalPence = openInvoice?.amountPence ?? latestQuote?.amountPence ?? 0;
  const depositPence = openInvoice?.depositPence ?? 0;
  const balancePence = Math.max(0, totalPence - depositPence);

  const statusLabel = openInvoice ? bookingQuoteCopy.statusAwaitingDeposit : bookingQuoteCopy.statusQuoteReady;

  return {
    reference: booking.reference,
    header: `BOOKING ${booking.reference}   /   ${statusLabel}`,
    badge: `${statusLabel}   •   ${booking.reference}`,
    headline: bookingQuoteCopy.headline,
    intro: bookingQuoteCopy.intro(firstName),
    schedule: formatArrivalSchedule(booking.scheduledDate, booking.scheduledTime),
    glance: {
      from: booking.locationFrom,
      to: booking.locationTo,
      service,
      teamVehicle: bookingQuoteCopy.defaultTeam,
      distance: booking.distanceNote.trim() || bookingQuoteCopy.defaultDistance,
    },
    quote: latestQuote
      ? {
          amountPence: latestQuote.amountPence,
          message: latestQuote.message,
          createdAt: latestQuote.createdAt.toISOString(),
        }
      : null,
    invoice: openInvoice
      ? {
          id: openInvoice.id,
          number: openInvoice.number,
          totalPence: openInvoice.amountPence,
          depositPence: openInvoice.depositPence,
          balancePence,
          notes: openInvoice.notes,
        }
      : null,
    customer: { firstName, email: customer.email },
  };
}

export function quoteToJson(payload: BookingQuotePayload) {
  return {
    reference: payload.reference,
    headline: payload.headline,
    schedule: payload.schedule,
    glance: payload.glance,
    quote: payload.quote
      ? { amount: gbp(payload.quote.amountPence), message: payload.quote.message }
      : null,
    invoice: payload.invoice
      ? {
          number: payload.invoice.number,
          total: gbp(payload.invoice.totalPence),
          deposit: gbp(payload.invoice.depositPence),
          balance: gbp(payload.invoice.balancePence),
          notes: payload.invoice.notes,
        }
      : null,
    progress: bookingQuoteCopy.progressSteps,
    support: {
      referenceHint: bookingConfirmationCopy.changeHint,
      dispatchSupport: bookingQuoteCopy.dispatchSupport,
    },
  };
}