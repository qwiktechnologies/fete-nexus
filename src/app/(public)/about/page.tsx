import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { initials } from "@/lib/format";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Who we are" };

const promises = [
  ["Show up", "The date on the invoice is the date the crew is booked for."],
  ["Price it first", "You see the deposit before any money is taken."],
  ["Carry waste properly", "Clearance jobs move under our waste carrier licence."],
  ["Keep it in the app", "Quotes, invoices and questions stay on the booking."],
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="bg-navy-900 py-16 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Who we are</p>
          <h1 className="mt-3 max-w-3xl text-5xl">Your logistics partner in {settings.areas}</h1>
        </Container>
      </section>
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {settings.about.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="mt-5 text-lg leading-8 first:mt-0">{paragraph}</p>
          ))}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {promises.map(([title, text]) => (
              <article key={title} className="rounded-3xl bg-white p-5">
                <h2 className="text-xl text-navy-900">{title}</h2>
                <p className="mt-2 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="space-y-5">
          <div className="rounded-[2rem] bg-white p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900 text-xl text-gold-400">
                {initials(settings.directorName)}
              </span>
              <div>
                <p className="text-2xl text-navy-900">{settings.directorName}</p>
                <p className="font-bold text-gold-600">Director</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Phone</dt><dd className="font-semibold">{settings.phone}</dd></div>
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Email</dt><dd className="font-semibold">{settings.email}</dd></div>
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Area</dt><dd className="text-right font-semibold">{settings.address}</dd></div>
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Licence</dt><dd className="font-semibold">{settings.licenceNumber}</dd></div>
              <div className="flex justify-between gap-4 border-t border-navy-900/10 pt-3"><dt>Cover</dt><dd className="font-semibold">{settings.insuredNote}</dd></div>
            </dl>
          </div>
          <img src="/brand/logo.jpg" alt="Fete Nexus logo" className="w-full rounded-[2rem] bg-white" />
          <Link href="/brand/flyer.jpg" className="inline-flex font-bold text-navy-900">View the company profile</Link>
        </aside>
      </Container>
    </>
  );
}
