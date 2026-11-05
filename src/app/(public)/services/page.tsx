import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ServiceCard } from "@/components/service-card";
import { activeServices } from "@/lib/queries";

export const metadata: Metadata = { title: "Our services" };

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const services = await activeServices();
  const categories = ["All", ...Array.from(new Set(services.map((service) => service.category)))];
  const visible = !category || category === "All" ? services : services.filter((service) => service.category === category);

  return (
    <>
      <section className="bg-navy-900 py-16 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Our services</p>
          <h1 className="mt-3 text-5xl">Move it, clear it, or deliver it</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Fixed-price jobs can be booked and paid from the service page. Larger moves are quoted from your photographs and addresses.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = (category ?? "All") === item;
            const href = item === "All" ? "/services" : `/services?category=${encodeURIComponent(item)}`;
            return (
              <Link
                key={item}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-navy-900 text-white" : "bg-white text-navy-900"}`}
              >
                {item}
              </Link>
            );
          })}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </>
  );
}
