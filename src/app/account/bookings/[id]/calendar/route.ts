import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/guards";
import { isStaffRole } from "@/lib/roles";
import { getBookingDetail } from "@/lib/queries";
import { serviceLabelForBooking } from "@/lib/booking-confirmation";

function icsDate(date: Date, time: string) {
  const [h, m] = time.split(":").map((part) => Number(part));
  const d = new Date(date);
  d.setUTCHours(h, m, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const booking = await getBookingDetail(id);
  if (!booking || (booking.userId !== user.id && !isStaffRole(user.role))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const start = icsDate(booking.scheduledDate, booking.scheduledTime);
  const end = start;
  const summary = `Fete Nexus ${serviceLabelForBooking(booking)} (${booking.reference})`;
  const description = `From ${booking.locationFrom} to ${booking.locationTo}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fete Nexus//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@fetenexus.co.uk`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${booking.locationFrom}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="fete-nexus-${booking.reference}.ics"`,
    },
  });
}