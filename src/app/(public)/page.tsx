import Link from "next/link";
import { FiArrowRight, FiPhone, FiShield, FiStar, FiTruck, FiTrendingUp } from "react-icons/fi";
import { Container } from "@/components/container";
import { FigmaImage } from "@/components/figma-image";
import { HomeFigmaServiceCard } from "@/components/home-figma-service-card";
import { MarketingButton } from "@/components/marketing-button";
import { RapidEstimate } from "@/components/rapid-estimate";
import {
  homeHero,
  homeImages,
  homeMidCta,
  homeRouteOverlay,
  homeTopServices,
  homeTrustStats,
  homeWhoWeAre,
} from "@/lib/home-figma";

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <Container className="grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div>
            <p className="inline-block rounded border border-border bg-surface-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              {homeHero.badge}
            </p>
            <h1 className="mt-5 text-[2.65rem] font-semibold leading-[1.05] tracking-[-0.02em] text-gold-500 sm:text-5xl lg:text-[3.35rem]">
              {homeHero.headline[0]}
              <br />
              {homeHero.headline[1]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 tracking-[-0.01em] text-muted">{homeHero.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MarketingButton href="/book" className="min-h-12 px-6 text-base text-white">
                Book Now
                <FiArrowRight aria-hidden />
              </MarketingButton>
              <a href={homeHero.callHref} className="btn-secondary min-h-12 gap-2 px-5">
                <FiPhone aria-hidden />
                {homeHero.callLabel}
              </a>
              <Link href="/services" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-navy-900 hover:text-gold-600">
                View Services
                <FiArrowRight aria-hidden />
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {homeTrustStats.map(({ value, label }) => (
                <div key={label} className="rounded-lg border border-navy-100 bg-navy-100/40 px-4 py-4">
                  <p className="text-2xl font-bold tracking-tight text-navy-900">{value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-navy-800/80">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface-100 shadow-xl">
            <FigmaImage
              src={homeImages.hero}
              alt="Fete Nexus crew carrying a removal box from a van"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover"
              priority
            />
            <HeroRouteOverlay />
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-12 lg:py-14">
        <Container>
          <RapidEstimate />
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <Container>
          <p className="text-sm font-semibold text-gold-600">{homeTopServices.eyebrow}</p>
          <h2 className="mt-2 text-[2.1rem] font-semibold leading-tight text-navy-900">{homeTopServices.title}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {homeTopServices.cards.map((card, index) => (
              <HomeFigmaServiceCard key={card.title} title={card.title} summary={card.summary} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-forest-700 py-14 text-white lg:py-16">
        <Container className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{homeMidCta.title}</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-7 text-white/90">{homeMidCta.body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={homeMidCta.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/30 bg-white px-6 text-sm font-bold text-navy-900"
            >
              <FiPhone aria-hidden />
              {homeMidCta.phone}
            </a>
            <MarketingButton href="/book" className="min-h-12 justify-center bg-gold-500 px-6 text-white hover:bg-gold-400">
              {homeMidCta.book}
              <FiArrowRight aria-hidden />
            </MarketingButton>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-md">
              <FigmaImage src={homeImages.collageMain} alt="" width={800} height={520} className="aspect-[5/3] w-full object-cover" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-h-[180px] flex-col justify-center rounded-2xl bg-forest-700 p-6 text-white shadow-md">
                <p className="text-4xl font-bold">{homeWhoWeAre.carbonBadge.percent}</p>
                <p className="mt-2 whitespace-pre-line text-[11px] font-semibold uppercase leading-snug tracking-wide text-white/90">
                  {homeWhoWeAre.carbonBadge.label}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-border shadow-md">
                <FigmaImage src={homeImages.collageFleet} alt="" width={600} height={400} className="aspect-[3/2] w-full object-cover" />
              </div>
            </div>
          </div>
          <WhoWeAreCopy />
        </Container>
      </section>
    </>
  );
}

function HeroRouteOverlay() {
  return (
    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/40 bg-navy-900/92 p-4 text-white backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-gold-400">{homeRouteOverlay.title}</p>
      <p className="mt-1 text-sm font-bold">{homeRouteOverlay.route}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-[78%] rounded-full bg-gold-500" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold">
        <span>{homeRouteOverlay.consignment}</span>
        <span className="text-gold-400">{homeRouteOverlay.eta}</span>
      </div>
    </div>
  );
}

function WhoWeAreCopy() {
  return (
    <div>
      <p className="text-sm font-semibold tracking-wide text-gold-600">{homeWhoWeAre.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 lg:text-4xl">{homeWhoWeAre.title}</h2>
      <p className="mt-5 whitespace-pre-line text-base leading-7 text-muted">{homeWhoWeAre.body}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {homeWhoWeAre.values.map((item, i) => {
          const Icon = [FiShield, FiTruck, FiTrendingUp, FiStar][i] ?? FiShield;
          const tone = i % 2 === 0 ? "bg-gold-100 text-gold-600" : "bg-forest-700/15 text-forest-700";
          return (
            <article key={item.title} className="panel p-5">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${tone}`}>
                <Icon aria-hidden />
              </span>
              <h3 className="mt-3 text-base font-bold text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </article>
          );
        })}
      </div>
      <div className="panel mt-8 p-5">
        <p className="text-lg font-semibold text-navy-900">{homeWhoWeAre.fleetTitle}</p>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-gold-600">{homeWhoWeAre.vettedTitle}</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{homeWhoWeAre.vettedText}</p>
      </div>
    </div>
  );
}