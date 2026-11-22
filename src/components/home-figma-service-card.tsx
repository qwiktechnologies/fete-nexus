import Link from "next/link";
import { FiArrowRight, FiBox, FiHome, FiMapPin, FiTrash2, FiTruck } from "react-icons/fi";

const icons = [FiHome, FiTruck, FiBox, FiMapPin, FiTrash2, FiHome, FiTrash2, FiBox];

export function HomeFigmaServiceCard({
  title,
  summary,
  index,
}: {
  title: string;
  summary: string;
  index: number;
}) {
  const Icon = icons[index % icons.length];
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-white p-6 shadow-[0_16px_40px_-36px_rgba(18,53,91,0.65)]">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 text-gold-600">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="mt-4 whitespace-pre-line text-lg font-semibold leading-snug text-navy-900">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{summary}</p>
      <Link
        href="/book"
        className="mt-5 inline-flex items-center gap-1 border-t border-border/70 pt-4 text-sm font-bold text-navy-900 hover:text-gold-600"
      >
        Book this Service
        <FiArrowRight aria-hidden />
      </Link>
    </article>
  );
}