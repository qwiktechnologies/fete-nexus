"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { logout } from "@/actions/auth";
import { Wordmark } from "@/components/logo";
import { isStaffRole } from "@/lib/roles";

const links = [
  { href: "/", label: "Home" },
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

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.8)]">
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Fete Nexus home">
          <Wordmark light />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-sm font-semibold transition ${isActive(link.href) ? "text-gold-400" : "text-white/85 hover:text-gold-400"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <Link href="/account" className="text-sm font-semibold text-white/90 hover:text-white">
                {user.name.split(" ")[0]}
              </Link>
              {isStaffRole(user.role) ? (
                <Link href="/admin" className="text-sm font-semibold text-white/90 hover:text-white">
                  Admin
                </Link>
              ) : null}
              <form action={logout}>
                <button className="text-sm font-medium text-white/70 hover:text-white">Log out</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-white/90 hover:text-white">
              Sign in
            </Link>
          )}
          <Link
            href="/book"
            className="inline-flex min-h-10 items-center rounded-md bg-gold-500 px-5 text-sm font-bold text-white hover:bg-gold-400"
          >
            Book Now
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 px-5 py-4 lg:hidden">
          <nav className="grid gap-3" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-semibold text-white">
                {link.label}
              </Link>
            ))}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-white/80">
              {phone}
            </a>
            {user ? <Link href="/account">Account</Link> : <Link href="/login">Sign in</Link>}
            <Link href="/book" className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold-500 font-bold text-white">
              Book Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}