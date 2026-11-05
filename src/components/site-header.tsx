"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { logout } from "@/actions/auth";
import { Wordmark } from "@/components/logo";
import { isStaffRole } from "@/lib/roles";

const links = [
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "Who we are" },
  { href: "/community", label: "Community" },
];

export function SiteHeader({
  phone,
  user,
}: {
  phone: string;
  user: { name: string; role: string } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-paper/95 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Fete Nexus home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className={`text-sm font-bold ${pathname.startsWith(link.href) ? "text-gold-600" : "text-navy-800 hover:text-gold-600"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-sm font-semibold text-navy-800">
            {phone}
          </a>
          {user ? (
            <>
              <Link href="/account" className="text-sm font-bold text-navy-900">
                {user.name.split(" ")[0]}
              </Link>
              {isStaffRole(user.role) ? (
                <Link href="/admin" className="text-sm font-bold text-navy-900">
                  Admin
                </Link>
              ) : null}
              <form action={logout}>
                <button className="text-sm font-semibold text-muted">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-bold text-navy-900">
              Sign in
            </Link>
          )}
          <Link href="/book" className="inline-flex min-h-11 items-center rounded-full bg-gold-500 px-5 text-sm font-bold text-navy-950 hover:bg-gold-400">
            Book now
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/10 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-navy-900/10 px-5 py-4 lg:hidden">
          <nav className="grid gap-3" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="font-bold text-navy-900">
                {link.label}
              </Link>
            ))}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold text-navy-800">
              {phone}
            </a>
            {user ? <Link href="/account">Account</Link> : <Link href="/login">Sign in</Link>}
            <Link href="/book" className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950">
              Book now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
