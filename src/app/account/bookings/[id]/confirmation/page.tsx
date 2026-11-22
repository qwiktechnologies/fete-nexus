import { notFound, redirect } from "next/navigation";
import { confirmStripeReturn } from "@/actions/payments";
import { BookingConfirmationScreen } from "@/components/booking-confirmation-screen";
import { buildBookingConfirmation, isConfirmationReady } from "@/lib/booking-confirmation";
import { requireUser } from "@/lib/guards";
import { getBookingDetail, getSettings } from "@/lib/queries";

export default async function AccountBookingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requireUser()]);
  if (query.session_id) await confirmStripeReturn(query.session_id, user.id);

  const [booking, settings] = await Promise.all([getBookingDetail(id), getSettings()]);
  if (!booking || booking.userId !== user.id) notFound();
  if (!isConfirmationReady(booking)) redirect(`/account/bookings/${id}/quote`);

  const payload = buildBookingConfirmation(booking, { name: user.name, email: user.email });
  if (!payload) redirect(`/account/bookings/${id}`);

  return (
    <BookingConfirmationScreen
      payload={payload}
      bookingId={id}
      phone={settings.phone}
      email={settings.email}
    />
  );
}