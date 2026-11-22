import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Container } from "@/components/container";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";
import { MarketingButton } from "@/components/marketing-button";
import {
  contactBottomCta,
  contactCoverage,
  contactDispatch,
  contactFaq,
  contactHero,
  contactServiceFallback,
} from "@/lib/contact-figma";
import { activeServices, getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Contact us" };

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), activeServices()]);
  const phoneHref = `tel:${settings.phone.replace(/\s/g, "")}`;
  const serviceOptions = [
    ...new Set([
      ...services.map((item) => item.title),
      ...contactServiceFallback.filter((item) => !services.some((s) => s.title === item)),
    ]),
  ];

  return (
    <>
      <section className="border-b border-border/70 bg-white py-12 lg:py-14">
        <Container>
          <p className="eyebrow text-gold-600">{contactHero.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-navy-900 sm:text-[2.65rem]">
            {contactHero.title}
          </h1>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-8 text-muted">{contactHero.intro}</p>
        </Container>
      </section>

      <section className="bg-surface-50 py-12 lg:py-14">
        <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-navy-900">{contactDispatch.heading}</h2>
              <p className="mt-2 text-muted">{contactDispatch.subheading}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={phoneHref}
                className="panel flex flex-col gap-2 border border-border/80 p-5 transition hover:border-gold-400"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-600">{contactDispatch.phoneLabel}</p>
                <p className="flex items-center gap-2 text-xl font-bold text-navy-900">
                  <FiPhone className="text-gold-500" aria-hidden />
                  {settings.phone}
                </p>
                <p className="text-sm text-muted">{contactDispatch.phoneAvailability}</p>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="panel flex flex-col gap-2 border border-border/80 p-5 transition hover:border-gold-400"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-600">{contactDispatch.emailLabel}</p>
                <p className="flex items-center gap-2 text-base font-bold text-navy-900 break-all">
                  <FiMail className="shrink-0 text-gold-500" aria-hidden />
                  {settings.email}
                </p>
                <p className="text-sm text-muted">{contactDispatch.emailHint}</p>
              </a>
            </div>

            <div className="panel border border-border/80 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-600">{contactDispatch.hubLabel}</p>
              <p className="mt-2 flex items-start gap-2 font-semibold text-navy-900">
                <FiMapPin className="mt-1 shrink-0 text-gold-500" aria-hidden />
                <span>
                  {settings.address}
                  <br />
                  {contactDispatch.hubLine2}
                </span>
              </p>
            </div>

            <motionlessTip />
          </div>

          <ContactEnquiryForm serviceOptions={serviceOptions} />
        </Container>
      </section>

      <section className="bg-navy-900 py-12 text-white lg:py-16">
        <Container>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-400">{contactCoverage.tag}</p>
          <h2 className="mt-4 whitespace-pre-line text-3xl font-semibold leading-tight sm:text-4xl">{contactCoverage.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">{contactCoverage.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {contactCoverage.regions.map((region) => (
              <span
                key={region}
                className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold"
              >
                {region}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/70">{contactCoverage.hint}</p>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <Container className="max-w-3xl">
          <p className="eyebrow text-gold-600">{contactFaq.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-navy-900">{contactFaq.title}</h2>
          <ul className="mt-8 divide-y divide-border">
            {contactFaq.items.map((item) => (
              <li key={item.question}>
                <details className="group py-4">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-navy-900 marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span className="text-gold-500 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-forest-700 py-12 text-white lg:py-14">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-2xl font-semibold leading-snug sm:text-3xl">{contactBottomCta.title}</p>
            <p className="mt-3 text-base leading-7 text-white/90">{contactBottomCta.body}</p>
          </div>
          <MarketingButton href={contactBottomCta.href} className="min-h-12 justify-center px-8">
            {contactBottomCta.label}
            <FiArrowRight aria-hidden />
          </MarketingButton>
        </Container>
      </section>
    </>
  );
}

function motionlessTip() {
  return (
    <div className="rounded-xl border border-gold-200 bg-gold-50/80 p-5">
      <p className="font-bold text-navy-900">{contactDispatch.bookingTipTitle}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{contactDispatch.bookingTipBody}</p>
      <Link href="/account/bookings" className="mt-3 inline-flex text-sm font-bold text-gold-700 hover:text-gold-600">
        View your bookings
      </Link>
    </div>
  );
}