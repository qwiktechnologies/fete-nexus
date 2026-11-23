import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/guards";
import { isAdminRole } from "@/lib/roles";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !isAdminRole(user.role)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, select: { id: true, reference: true } });
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true, reference: booking.reference });
}