import { prisma } from "@/lib/db";
import { gbp } from "@/lib/format";

export async function nextCode(prefix: "FN" | "INV") {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const existing =
      prefix === "FN"
        ? await prisma.booking.findUnique({ where: { reference: code }, select: { id: true } })
        : await prisma.invoice.findUnique({ where: { number: code }, select: { id: true } });
    if (!existing) return code;
  }
  return `${prefix}-${Date.now().toString().slice(-8)}`;
}

export async function postSystemMessage(bookingId: string, body: string) {
  const conversation = await prisma.conversation.findUnique({ where: { bookingId } });
  if (!conversation) return;
  await prisma.message.create({ data: { conversationId: conversation.id, system: true, body } });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
}

export async function settleInvoice(input: {
  invoiceId: string;
  userId: string;
  provider: string;
  providerRef?: string;
}) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: input.invoiceId },
    include: { booking: { select: { id: true, reference: true, userId: true } } },
  });
  if (!invoice) return { error: "Invoice not found." };
  if (invoice.booking.userId !== input.userId && input.provider !== "bank") {
    return { error: "This invoice belongs to another account." };
  }
  if (invoice.status === "VOID") return { error: "This invoice has been replaced." };
  if (invoice.status === "PAID") return { ok: true as const };

  await prisma.$transaction(async (tx) => {
    const fresh = await tx.invoice.findUnique({ where: { id: invoice.id } });
    if (!fresh || fresh.status === "PAID" || fresh.status === "VOID") return;
    if (input.providerRef) {
      const duplicate = await tx.payment.findFirst({ where: { providerRef: input.providerRef } });
      if (duplicate) return;
    }
    await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        userId: invoice.booking.userId,
        amountPence: invoice.depositPence,
        status: "SUCCEEDED",
        provider: input.provider,
        providerRef: input.providerRef,
      },
    });
    await tx.invoice.update({ where: { id: invoice.id }, data: { status: "PAID" } });
    await tx.booking.update({ where: { id: invoice.bookingId }, data: { status: "CONFIRMED" } });
    const conversation = await tx.conversation.findUnique({ where: { bookingId: invoice.bookingId } });
    if (conversation) {
      const line =
        input.provider === "stripe"
          ? `Card payment of ${gbp(invoice.depositPence)} received for ${invoice.number}. Booking ${invoice.booking.reference} is confirmed.`
          : `Deposit of ${gbp(invoice.depositPence)} confirmed for ${invoice.number}. Booking ${invoice.booking.reference} is confirmed.`;
      await tx.message.create({ data: { conversationId: conversation.id, system: true, body: line } });
      await tx.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
    }
  });

  return { ok: true as const };
}
