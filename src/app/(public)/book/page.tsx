import type { Metadata } from "next";
import { Container } from "@/components/container";
import { BookingForm } from "@/components/booking-form";
import { getCurrentUser } from "@/lib/guards";
import { activeServices, getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Request a booking" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; from?: string; to?: string }>;
}) {
  const { service, from, to } = await searchParams;
  const [services, user, settings] = await Promise.all([activeServices(), getCurrentUser(), getSettings()]);
  return (
    <>
      <section className="border-b border-border/80 bg-surface-50 py-12">
        <Container>
          <h1 className="dash-title">Request a Booking</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            Removal, collection, house move, delivery, or one of the listed services. We reply in your account with a quote or invoice.
          </p>
          <p className="mt-2 text-sm text-muted">Pay the deposit on the invoice to hold the date. {settings.insuredNote}</p>
        </Container>
      </section>
      <Container className="py-12">
        <BookingForm
          services={services.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            pricePence: item.pricePence,
            isPurchasable: item.isPurchasable,
            depositPercent: item.depositPercent,
          }))}
          user={user ? { name: user.name, email: user.email, phone: user.phone } : null}
          initialSlug={service}
          defaultDeposit={settings.depositPercent}
          prefilledFrom={from}
          prefilledTo={to}
        />
      </Container>
    </>
  );
}