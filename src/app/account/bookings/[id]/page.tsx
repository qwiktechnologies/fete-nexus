import { notFound, redirect } from "next/navigation";
import { BookingView } from "@/components/booking-view";
import { isConfirmationReady } from "@/lib/booking-confirmation";
import { isQuotePageReady } from "@/lib/booking-quote";
import { requireUser } from "@/lib/guards";
import { getBookingDetail, getSettings } from "@/lib/queries";
import { cardPaymentsEnabled } from "@/lib/stripe";

export default async function AccountBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ invoice?: string; quote?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireUser()]);
  const [booking, settings, cardPayments] = await Promise.all([
    getBookingDetail(id),
    getSettings(),
    cardPaymentsEnabled(),
  ]);
  if (!booking || booking.userId !== user.id) notFound();
  if (query.invoice === "1" || query.quote === "1") {
    if (isConfirmationReady(booking)) redirect(`/account/bookings/${id}/confirmation`);
    if (isQuotePageReady(booking)) redirect(`/account/bookings/${id}/quote`);
  }
  return (
    <BookingView
      booking={booking}
      mode="customer"
      viewerId={user.id}
      cardPayments={cardPayments}
      bank={{ accountName: settings.bankAccountName, sortCode: settings.bankSortCode, accountNumber: settings.bankAccountNumber }}
    />
  );
}
