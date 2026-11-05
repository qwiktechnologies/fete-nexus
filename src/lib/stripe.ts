import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function getPaymentConfig() {
  return prisma.paymentConfig.findUnique({ where: { id: "default" } });
}

export async function getStripeClient() {
  const config = await getPaymentConfig();
  const key = config?.stripeSecretKey.trim() ?? "";
  if (!key) return { stripe: null, webhookSecret: "" };
  return { stripe: new Stripe(key), webhookSecret: config?.stripeWebhookSecret.trim() ?? "" };
}

export async function cardPaymentsEnabled() {
  const config = await getPaymentConfig();
  return Boolean(config?.stripeSecretKey.trim());
}

export function maskedKey(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Not saved";
  return `Saved · ${trimmed.slice(0, 8)}…${trimmed.slice(-4)}`;
}
