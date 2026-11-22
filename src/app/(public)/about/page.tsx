import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Container } from "@/components/container";
import { FigmaImage } from "@/components/figma-image";
import { MarketingButton } from "@/components/marketing-button";
import {
  aboutBottomCta,
  aboutCommitment,
  aboutHero,
  aboutImages,
  aboutProcess,
  aboutStory,
  aboutValues,
} from "@/lib/about-figma";

export const metadata: Metadata = { title: "Who we are" };

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-white py-12 lg:py-14">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-gold-600">{aboutHero.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-navy-900 sm:text-[2.65rem]">
              {aboutHero.title}
            </h1>
            <p className="mt-4 text-lg font-bold text-navy-800">{aboutHero.subtitle}</p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{aboutHero.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={aboutHero.primaryCta.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-transparent bg-gold-500 px-5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(242,140,40,0.9)] hover:bg-gold-400"
              >
                {aboutHero.primaryCta.label}
              </Link>
              <MarketingButton href={aboutHero.secondaryCta.href} variant="secondary">
                {aboutHero.secondaryCta.label}
              </MarketingButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg">
            <FigmaImage
              src={aboutImages.fleet}
              alt="Fete Nexus fleet parked at the depot"
              width={1200}
              height={800}
              className="aspect-[3/2] w-full object-cover"
              priority
            />
            <p className="absolute bottom-0 left-0 right-0 bg-navy-900/95 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-white">
              {aboutHero.imageBadge}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-surface-50 py-12 lg:py-14">
        <Container className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="eyebrow text-gold-600">{aboutStory.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-[2rem]">{aboutStory.title}</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-muted">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <Container>
          <p className="eyebrow text-gold-600">{aboutValues.eyebrow}</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-snug text-navy-900">{aboutValues.title}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {aboutValues.cards.map((card) => (
              <article key={card.number} className="panel border border-border/80 p-6 lg:p-7">
                <p className="text-sm font-bold text-gold-600">{card.number}</p>
                <h3 className="mt-2 text-xl font-bold text-navy-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface-50 py-12 lg:py-14">
        <Container>
          <p className="eyebrow text-gold-600">{aboutProcess.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-navy-900">{aboutProcess.title}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {aboutProcess.steps.map((step) => (
              <li key={step.tag} className="border-t-2 border-gold-500 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-600">{step.tag}</p>
                <h3 className="mt-2 text-xl font-bold text-navy-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border shadow-md">
            <FigmaImage
              src={aboutImages.crew}
              alt="Careful handling by the removals team"
              width={1000}
              height={900}
              className="aspect-[10/11] w-full object-cover object-center"
            />
          </div>
          <div>
            <p className="eyebrow text-gold-600">{aboutCommitment.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900">{aboutCommitment.title}</h2>
            <div className="mt-5 space-y-5 text-lg leading-8 text-muted">
              {aboutCommitment.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-2 text-sm font-semibold text-navy-800">
              {aboutCommitment.serviceLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-forest-700 py-12 text-white lg:py-14">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-2xl font-semibold leading-snug sm:text-3xl">{aboutBottomCta.title}</p>
            <p className="mt-3 text-base leading-7 text-white/90">{aboutBottomCta.body}</p>
          </div>
          <Link
            href={aboutBottomCta.href}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-gold-500 px-6 text-sm font-bold text-white hover:bg-gold-400"
          >
            {aboutBottomCta.label}
            <FiArrowRight aria-hidden />
          </Link>
        </Container>
      </section>
    </>
  );
}