import { NextResponse } from "next/server";
import { buildBookingConfirmation, confirmationToJson, isConfirmationReady } from "@/lib/booking-confirmation";
import { getCurrentUser } from "@/lib/guards";
import { isStaffRole } from "@/lib/roles";
import { getBookingDetail } from "@/lib/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const booking = await getBookingDetail(id);
  if (!booking || (booking.userId !== user.id && !isStaffRole(user.role))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!isConfirmationReady(booking)) {
    return NextResponse.json({ error: "Booking is not confirmed yet." }, { status: 404 });
  }

  const customer =
    booking.userId === user.id
      ? { name: user.name, email: user.email }
      : { name: booking.user.name, email: booking.user.email };

  const payload = buildBookingConfirmation(booking, customer);
  if (!payload) return NextResponse.json({ error: "Confirmation not available." }, { status: 404 });

  return NextResponse.json({ ok: true, ...confirmationToJson(payload) });
}