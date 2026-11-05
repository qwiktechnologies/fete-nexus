import { NextResponse } from "next/server";
import { receiptPdf } from "@/lib/documents";
import { getCurrentUser } from "@/lib/guards";
import { isStaffRole } from "@/lib/roles";
import { getBookingDetail, getSettings } from "@/lib/queries";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const [booking, settings] = await Promise.all([getBookingDetail(id), getSettings()]);
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (booking.userId !== user.id && !isStaffRole(user.role)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const pdf = receiptPdf(booking, settings);
  if (!pdf) return NextResponse.json({ error: "No card payment to receipt yet." }, { status: 404 });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fete-nexus-receipt-${booking.reference}.pdf"`,
    },
  });
}
