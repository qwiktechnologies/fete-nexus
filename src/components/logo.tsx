export function Mark({ className = "h-10 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 86 64" className={className} aria-hidden>
      <path fill="#0C2340" d="M40 4 22 4 4 32l18 28h18L22 32 40 4Z" />
      <path fill="#0C2340" d="M46 10 34 32l12 22-8 6L20 32 38 4l8 6Z" />
      <path fill="#E6A817" d="M46 4h18l18 28-18 28H46l18-28L46 4Z" />
      <path fill="#E6A817" d="M40 10 52 32 40 54l8 6 18-28L48 4l-8 6Z" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Mark className="h-11 w-14 shrink-0" />
      <span>
        <span className={`block font-display text-lg font-bold leading-none tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
          FETE NEXUS
        </span>
        <span className={`mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] ${light ? "text-gold-400" : "text-navy-700"}`}>
          Logistics & Removals
        </span>
      </span>
    </span>
  );
}
