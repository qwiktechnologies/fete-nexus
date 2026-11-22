import Link from "next/link";
import { FiMail, FiPhone } from "react-icons/fi";
import { Container } from "@/components/container";
import { Wordmark } from "@/components/logo";

const explore = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/book", label: "Book a Service" },
];

const coverage = [
  "Bradford Central Depot",
  "Leeds Logistics Hub",
  "West Yorkshire",
  "M62 Commercial Corridor",
  "UK-wide deliveries",
];

const footerBlurb =
  "Precision-engineered commercial haulage, national residential relocation, and zero-emission urban distribution based in West Yorkshire. Licensed Carrier & Operator standard compliant.";

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
  const phone = "07920 507601";
  const email = settings.email || "contact@fetenexus.co.uk";

  return (
    <footer className="mt-auto bg-navy-950 text-white">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.25fr_0.75fr_0.85fr_1fr]">
        <div>
          <Wordmark light />
          <p className="mt-5 max-w-sm text-xs leading-6 text-white/70">{footerBlurb}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wide text-white/80">
            <li className="rounded-full border border-white/15 px-3 py-1">Euro 6 &amp; EV Fleet</li>
            <li className="rounded-full border border-white/15 px-3 py-1">Operator Reg UK-04982</li>
            <li className="rounded-full border border-white/15 px-3 py-1">Goods in Transit £100k</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-400">EXPLORE</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/80">
            {explore.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href} className="hover:text-gold-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-400">COVERAGE</p>
          <ul className="mt-4 grid gap-2 text-sm text-white/80">
            {coverage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-400">24/7 DISPATCH CONTROL</p>
          <ul className="mt-4 grid gap-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <FiPhone className="text-gold-400" aria-hidden />
              <a href="tel:07920507601">{phone}</a>
            </li>
            <li>Bradford Hub, BD1 4PQ</li>
            <li className="flex items-center gap-2">
              <FiMail className="text-gold-400" aria-hidden />
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {settings.hours ? <li>{settings.hours}</li> : null}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2025 Fete Nexus Logistics Ltd. Registered in England &amp; Wales (No. 12948210).</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Privacy Policy</span>
            <span>FAQ</span>
            <span>Terms and Conditions</span>
          </p>
          <p className="text-white/40">Powered By: QWIK TECHNOLOGIES</p>
        </Container>
      </div>
    </footer>
  );
}