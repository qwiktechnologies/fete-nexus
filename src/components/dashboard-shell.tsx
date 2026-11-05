"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { Wordmark } from "@/components/logo";

export function DashboardShell({
  title,
  links,
  userName,
  children,
}: {
  title: string;
  links: { href: string; label: string }[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper md:flex-row">
      <aside className="bg-navy-950 text-white md:w-64 md:shrink-0">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" aria-label="Back to site"><Wordmark light /></Link>
        </div>
        <p className="px-5 text-xs font-bold uppercase tracking-[0.18em] text-gold-400">{title}</p>
        <nav className="mt-4 flex gap-2 overflow-x-auto px-3 pb-4 md:grid md:px-3">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/admin" && link.href !== "/account" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-gold-500 text-navy-950" : "text-white/80 hover:bg-white/10"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="px-5 pb-4 md:hidden">
          <button className="text-sm font-semibold text-gold-400">Log out</button>
        </form>
        <div className="hidden items-center justify-between px-5 py-6 md:flex">
          <p className="text-sm text-white/70">{userName}</p>
          <form action={logout}><button className="text-sm font-semibold text-gold-400">Log out</button></form>
        </div>
      </aside>
      <div className="flex-1 px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
