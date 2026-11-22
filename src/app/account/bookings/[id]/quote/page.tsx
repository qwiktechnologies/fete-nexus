import { notFound, redirect } from "next/navigation";
import { BookingQuoteScreen } from "@/components/booking-quote-screen";
import { buildBookingQuote, isQuotePageReady } from "@/lib/booking-quote";
import { isConfirmationReady } from "@/lib/booking-confirmation";
import { requireUser } from "@/lib/guards";
import { getBookingDetail, getSettings } from "@/lib/queries";
import { cardPaymentsEnabled } from "@/lib/stripe";

export default async function AccountBookingQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pay?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireUser()]);
  const [booking, settings, cardPayments] = await Promise.all([
    getBookingDetail(id),
    getSettings(),
    cardPaymentsEnabled(),
  ]);
  if (!booking || booking.userId !== user.id) notFound();
  if (isConfirmationReady(booking)) redirect(`/account/bookings/${id}/confirmation`);
  if (!isQuotePageReady(booking)) redirect(`/account/bookings/${id}`);

  const payload = buildBookingQuote(booking, { name: user.name, email: user.email });
  if (!payload) redirect(`/account/bookings/${id}`);

  return (
    <BookingQuoteScreen
      payload={payload}
      bookingId={id}
      cardPayments={cardPayments}
      phone={settings.phone}
      email={settings.email}
      bank={{
        accountName: settings.bankAccountName,
        sortCode: settings.bankSortCode,
        accountNumber: settings.bankAccountNumber,
      }}
      cancelled={query.pay === "cancelled"}
    />
  );
}