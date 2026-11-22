"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMail, FiPhone } from "react-icons/fi";
import { logout } from "@/actions/auth";
export type DashboardNavLink = { href: string; label: string };

export function DashboardShell({
  shellTitle,
  shellSubtitle,
  links,
  secondaryLinks,
  secondaryGroupLabel = "Manage",
  userName,
  dispatch,
  navAriaLabel = "Dashboard",
  children,
}: {
  shellTitle: string;
  shellSubtitle: string;
  links: DashboardNavLink[];
  secondaryLinks?: DashboardNavLink[];
  secondaryGroupLabel?: string;
  userName: string;
  dispatch: { phone: string; email: string };
  navAriaLabel?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const roots = ["/admin", "/account"];

  function isActive(href: string) {
    if (roots.includes(href)) return pathname === href;
    const [path] = href.split("?");
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <div className="flex w-full flex-col border-t border-navy-900/10 bg-surface-50 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 bg-navy-900 text-white lg:sticky lg:top-[72px] lg:w-[min(260px,100%)] lg:max-h-[calc(100vh-72px)] lg:overflow-y-auto">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-base font-bold tracking-tight">{shellTitle}</p>
            <p className="mt-1 text-xs text-white/65">{shellSubtitle}</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible" aria-label={navAriaLabel}>
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-white/12 text-white ring-1 ring-inset ring-gold-500/40"
                      : "text-white/80 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {secondaryLinks?.length ? (
              <>
                <p className="mt-3 hidden px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 lg:block">
                  {secondaryGroupLabel}
                </p>
                {secondaryLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                        active ? "bg-white/12 text-white" : "text-white/75 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </>
            ) : null}
          </nav>
          <div className="border-t border-white/10 p-5 max-lg:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold-400">Need help?</p>
            <p className="mt-1 text-xs text-white/60">24/7 dispatch control</p>
            <a
              href={`tel:${dispatch.phone.replace(/\s/g, "")}`}
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-white hover:text-gold-300"
            >
              <FiPhone aria-hidden />
              {dispatch.phone}
            </a>
            <a
              href={`mailto:${dispatch.email}`}
              className="mt-2 flex items-center gap-2 break-all text-xs font-semibold text-white/85 hover:text-gold-300"
            >
              <FiMail className="shrink-0" aria-hidden />
              {dispatch.email}
            </a>
            <p className="mt-4 text-xs text-white/50">Signed in as {userName}</p>
            <form action={logout} className="mt-2">
              <button type="submit" className="text-sm font-bold text-gold-400 hover:text-gold-300">
                Log out
              </button>
            </form>
          </div>
      </aside>
      <div className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:max-w-[calc(100vw-260px)] lg:py-8 lg:pr-12">{children}</div>
    </div>
  );
}