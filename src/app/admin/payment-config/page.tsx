import { headers } from "next/headers";
import { PaymentConfigForm } from "@/components/payment-config-form";
import { requireAdmin } from "@/lib/guards";
import { getPaymentConfig, maskedKey } from "@/lib/stripe";

export default async function PaymentConfigPage() {
  await requireAdmin();
  const [config, headerList] = await Promise.all([getPaymentConfig(), headers()]);
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return (
    <div>
      <h1 className="mb-2 text-4xl text-navy-900">Payment config</h1>
      <p className="mb-6 max-w-3xl text-muted">
        Paste the Stripe keys here. They are stored with the site settings, and they are not read from an environment file.
      </p>
      <PaymentConfigForm
        secretHint={maskedKey(config?.stripeSecretKey ?? "")}
        publishableHint={maskedKey(config?.stripePublishableKey ?? "")}
        webhookHint={maskedKey(config?.stripeWebhookSecret ?? "")}
        webhookUrl={`${proto}://${host}/api/stripe/webhook`}
        enabled={Boolean(config?.stripeSecretKey.trim())}
      />
    </div>
  );
}
