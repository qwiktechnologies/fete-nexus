import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { settleInvoice } from "@/lib/billing";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const { stripe, webhookSecret } = await getStripeClient();
  if (!stripe || !webhookSecret) return NextResponse.json({ error: "Stripe is not configured." }, { status: 400 });

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoiceId;
      const userId = session.metadata?.userId;
      if (invoiceId && userId && session.payment_status === "paid") {
        await settleInvoice({ invoiceId, userId, provider: "stripe", providerRef: session.id });
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
}
