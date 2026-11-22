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
    <article className="panel group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-[0_28px_55px_-38px_rgba(18,53,91,0.75)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
          <ServiceIcon name={service.icon} />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-600">{service.category}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-navy-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{service.summary}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <p className="text-sm font-semibold text-navy-900">{priceLabel(service.pricePence, service.isPurchasable)}</p>
        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-gold-600">
          Book this service
          <FiArrowRight className="transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}