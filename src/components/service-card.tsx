import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { ServiceIcon } from "@/components/service-icon";
import { priceLabel } from "@/lib/format";

export function ServiceCard({
  service,
}: {
  service: {
    slug: string;
    title: string;
    summary: string;
    category: string;
    icon: string;
    pricePence: number | null;
    isPurchasable: boolean;
  };
}) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-navy-900/10 bg-white p-6 shadow-[0_24px_50px_-36px_rgba(11,31,58,0.7)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400">
          <ServiceIcon name={service.icon} />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-600">{service.category}</span>
      </div>
      <h3 className="mt-5 text-2xl text-navy-900">{service.title}</h3>
      <p className="mt-3 flex-1 text-muted">{service.summary}</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="font-semibold text-navy-900">{priceLabel(service.pricePence, service.isPurchasable)}</p>
        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-800">
          View service
          <FiArrowRight className="transition group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
