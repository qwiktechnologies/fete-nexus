import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { Container } from "@/components/container";
import { ServiceIcon } from "@/components/service-icon";
import { gbp, priceLabel } from "@/lib/format";
import { getSettings } from "@/lib/queries";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: "Service" };
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    getSettings(),
  ]);
  if (!service || !service.active) notFound();
  const includes = service.includes.split("\n").map((item) => item.trim()).filter(Boolean);
  const depositPercent = service.depositPercent ?? settings.depositPercent;
  const deposit = service.pricePence != null ? Math.max(100, Math.round((service.pricePence * depositPercent) / 100)) : null;

  return (
    <Container className="grid gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr]">
      <article>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold-600">{service.category}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
            <ServiceIcon name={service.icon} />
          </span>
          <h1 className="text-4xl text-navy-900 sm:text-5xl">{service.title}</h1>
        </div>
        <p className="mt-6 text-xl text-muted">{service.summary}</p>
        {service.description.split(/\n\n+/).map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mt-5 text-lg leading-8">{paragraph}</p>
        ))}
        {includes.length ? (
          <ul className="mt-8 grid gap-3">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                <FiCheck className="mt-1 text-gold-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
      <aside className="h-fit rounded-[2rem] bg-navy-900 p-7 text-white lg:sticky lg:top-24">
        <p className="text-sm uppercase tracking-[0.16em] text-gold-400">
          {service.isPurchasable ? "Listed price" : "Quoted job"}
        </p>
        <p className="mt-3 text-4xl">{priceLabel(service.pricePence, service.isPurchasable)}</p>
        {deposit != null ? (
          <p className="mt-3 text-white/75">
            A {depositPercent}% deposit ({gbp(deposit)}) confirms the booking. The balance is the rest of the listed price.
          </p>
        ) : (
          <p className="mt-3 text-white/75">
            Send the details and photographs. We reply in your account with a quote, then an invoice for the deposit.
          </p>
        )}
        <Link href={`/book?service=${service.slug}`} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950">
          {service.isPurchasable ? "Book this service" : "Request a quote"}
        </Link>
      </aside>
    </Container>
  );
}
