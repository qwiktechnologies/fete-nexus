import Link from "next/link";
import { FiGlobe, FiMail, FiPhone } from "react-icons/fi";
import { Container } from "@/components/container";
import { Wordmark } from "@/components/logo";

export function SiteFooter({
  settings,
}: {
  settings: {
    phone: string;
    email: string;
    address: string;
    areas: string;
    hours: string;
    licenceNumber: string;
    insuredNote: string;
  };
}) {
  return (
    <footer className="mt-auto bg-navy-950 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark light />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
            Need it moved, delivered or cleared? We cover {settings.areas}.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Services</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/80">
            <li><Link href="/services">All services</Link></li>
            <li><Link href="/book">Book a job</Link></li>
            <li><Link href="/community">Community</Link></li>
            <li><Link href="/about">Who we are</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Contact</p>
          <ul className="mt-4 grid gap-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><FiPhone aria-hidden /> <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>
            <li className="flex items-center gap-2"><FiMail aria-hidden /> <a href={`mailto:${settings.email}`}>{settings.email}</a></li>
            <li className="flex items-center gap-2"><FiGlobe aria-hidden /> www.fetenexus.co.uk</li>
            <li>{settings.address}</li>
            <li>{settings.hours}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Cover</p>
          <p className="mt-4 text-sm leading-6 text-white/80">
            {settings.insuredNote}
            <span className="mt-2 block">Waste carrier licence {settings.licenceNumber}</span>
          </p>
          <p className="mt-4 text-sm text-white/60">Quotes, invoices and booking messages stay inside your account.</p>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Fete Nexus Logistics & Removals</p>
          <p>{settings.areas}</p>
        </Container>
      </div>
    </footer>
  );
}
