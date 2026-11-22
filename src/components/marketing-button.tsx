import Link from "next/link";

const styles = {
  primary:
    "border border-transparent bg-gold-500 text-white shadow-[0_10px_24px_-12px_rgba(242,140,40,0.9)] hover:bg-gold-400",
  secondary: "border border-navy-800 bg-navy-800 text-white hover:bg-navy-700",
  outline: "border border-navy-900/15 bg-white text-navy-900 hover:bg-surface-100",
  ghost: "border border-white/25 bg-transparent text-white hover:bg-white/10",
} as const;

export function MarketingButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function MarketingSubmitButton({
  children,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-gold-500 px-6 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(242,140,40,0.9)] transition hover:bg-gold-400 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}