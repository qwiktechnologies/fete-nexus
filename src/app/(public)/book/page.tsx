import type { Metadata } from "next";
import { Container } from "@/components/container";
import { BookingForm } from "@/components/booking-form";
import { getCurrentUser } from "@/lib/guards";
import { activeServices, getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Book now" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const [services, user, settings] = await Promise.all([activeServices(), getCurrentUser(), getSettings()]);
  return (
    <>
      <section className="bg-navy-900 py-14 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Book now</p>
          <h1 className="mt-3 text-5xl">Tell us what needs doing</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Removal, collection, house move, delivery, or one of the listed services. We answer in your account.
          </p>
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
        />
      </Container>
    </>
  );
}
