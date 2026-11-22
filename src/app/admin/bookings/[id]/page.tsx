import { notFound } from "next/navigation";
import { AdminBookingDetail } from "@/components/admin-booking-detail";
import { requireStaff } from "@/lib/guards";
import { getBookingDetail } from "@/lib/queries";

export default async function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireStaff();
  const booking = await getBookingDetail(id);
  if (!booking) notFound();
  return <AdminBookingDetail booking={booking} viewerId={user.id} />;
}