import { notFound } from "next/navigation";
import { BookingView } from "@/components/booking-view";
import { requireStaff } from "@/lib/guards";
import { getBookingDetail, getSettings } from "@/lib/queries";
import { cardPaymentsEnabled } from "@/lib/stripe";

export default async function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireStaff();
  const [booking, settings, cardPayments] = await Promise.all([
    getBookingDetail(id),
    getSettings(),
    cardPaymentsEnabled(),
  ]);
  if (!booking) notFound();
  return (
    <BookingView
      booking={booking}
      mode="staff"
      viewerId={user.id}
      cardPayments={cardPayments}
      bank={{ accountName: settings.bankAccountName, sortCode: settings.bankSortCode, accountNumber: settings.bankAccountNumber }}
    />
  );
}
