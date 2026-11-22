import { NextResponse } from "next/server";
import { buildBookingQuote, isQuotePageReady, quoteToJson } from "@/lib/booking-quote";
import { isConfirmationReady } from "@/lib/booking-confirmation";
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

  if (isConfirmationReady(booking)) {
    return NextResponse.json({ error: "Booking is confirmed.", status: "CONFIRMED" }, { status: 409 });
  }
  if (!isQuotePageReady(booking)) {
    return NextResponse.json({ error: "No quote or open invoice for this booking." }, { status: 404 });
  }

  const customer =
    booking.userId === user.id
      ? { name: user.name, email: user.email }
      : { name: booking.user.name, email: booking.user.email };

  const payload = buildBookingQuote(booking, customer);
  if (!payload) return NextResponse.json({ error: "Quote not available." }, { status: 404 });

  return NextResponse.json({ ok: true, ...quoteToJson(payload) });
}