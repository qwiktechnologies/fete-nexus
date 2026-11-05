"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { getStripeClient } from "@/lib/stripe";
import { settleInvoice } from "@/lib/billing";
import { field } from "@/lib/validators";

export async function startCheckout(formData: FormData) {
  const user = await requireUser();
  const invoiceId = field(formData, "invoiceId");
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { booking: true },
  });
  if (!invoice || invoice.booking.userId !== user.id) redirect("/account");
  const back = `/account/bookings/${invoice.bookingId}`;
  if (invoice.status !== "SENT") redirect(back);

  const { stripe } = await getStripeClient();
  if (!stripe) redirect(`${back}?pay=bank`);

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: invoice.depositPence,
          product_data: {
            name: `Deposit for ${invoice.booking.reference}`,
            description: invoice.number,
          },
        },
      },
    ],
    metadata: { invoiceId: invoice.id, userId: user.id },
    success_url: `${origin}${back}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${back}?pay=cancelled`,
  });
  if (!session.url) redirect(back);
  redirect(session.url);
}

export async function confirmStripeReturn(sessionId: string, userId: string) {
  const { stripe } = await getStripeClient();
  if (!stripe || !sessionId) return;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.userId !== userId || session.payment_status !== "paid") return;
  const invoiceId = session.metadata.invoiceId;
  if (!invoiceId) return;
  await settleInvoice({ invoiceId, userId, provider: "stripe", providerRef: session.id });
  revalidatePath("/account");
  revalidatePath("/admin/payments");
}
