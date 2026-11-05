import { notFound } from "next/navigation";
import { confirmStripeReturn } from "@/actions/payments";
import { BookingView } from "@/components/booking-view";
import { requireUser } from "@/lib/guards";
import { getBookingDetail, getSettings } from "@/lib/queries";
import { cardPaymentsEnabled } from "@/lib/stripe";

export default async function AccountBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireUser()]);
  if (query.session_id) await confirmStripeReturn(query.session_id, user.id);
  const [booking, settings, cardPayments] = await Promise.all([
    getBookingDetail(id),
    getSettings(),
    cardPaymentsEnabled(),
  ]);
  if (!booking || booking.userId !== user.id) notFound();
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
