import Link from "next/link";
import { FiClock, FiFileText, FiMapPin, FiShield } from "react-icons/fi";
import { Container } from "@/components/container";
import { Mark } from "@/components/logo";
import { ServiceCard } from "@/components/service-card";
import { formatDate } from "@/lib/format";
import { activeServices, getSettings, publishedPosts } from "@/lib/queries";

const steps = [
  ["01", "Tell us the job", "Date, addresses, photographs and anything the crew should know."],
  ["02", "We reply in the app", "A quote or invoice lands in your account. No lost messages."],
  ["03", "Pay the deposit", "The amount on the invoice holds the booking."],
  ["04", "We turn up", "Removal, collection, house move, delivery or clearance."],
];

export default async function HomePage() {
  const [settings, services, posts] = await Promise.all([getSettings(), activeServices(), publishedPosts()]);
  const featured = services.filter((service) => service.featured).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <Container className="grid items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold-400">{settings.areas}</p>
            <h1 className="mt-4 text-5xl leading-[0.95] text-white sm:text-7xl">
              {settings.companyName}
              <span className="mt-3 block text-3xl font-medium text-white/75 sm:text-4xl">{settings.heroLine}</span>
            </h1>
            <p className="mt-6 text-2xl text-gold-400">{settings.tagline}</p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
              House moves, office relocations, waste clearance and same-day collections across West Yorkshire. Fully insured, and licensed to carry waste.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="inline-flex min-h-12 items-center rounded-full bg-gold-500 px-6 font-bold text-navy-950 hover:bg-gold-400">
                Book now
              </Link>
              <Link href="/services" className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 font-bold text-white hover:bg-white/10">
                Our services
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <Mark className="h-16 w-20" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-gold-400">On the road</p>
            <p className="mt-2 text-4xl">{settings.areas}</p>
            <dl className="mt-8 grid grid-cols-2 gap-5 text-sm">
              <div>
                <dt className="text-white/50">Licence</dt>
                <dd className="mt-1 font-semibold">{settings.licenceNumber}</dd>
              </div>
              <div>
                <dt className="text-white/50">Cover</dt>
                <dd className="mt-1 font-semibold">{settings.insuredNote}</dd>
              </div>
              <div>
                <dt className="text-white/50">Hours</dt>
                <dd className="mt-1 font-semibold">{settings.hours}</dd>
              </div>
              <div>
                <dt className="text-white/50">Messages</dt>
                <dd className="mt-1 font-semibold">Inside your account</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section className="border-b border-navy-900/10 bg-white">
        <Container className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: FiShield, label: settings.insuredNote },
            { Icon: FiFileText, label: `Waste carrier ${settings.licenceNumber}` },
            { Icon: FiMapPin, label: settings.areas },
            { Icon: FiClock, label: "Same-day collection available" },
          ].map(({ Icon, label }) => (
            <p key={label} className="flex items-center gap-3 text-sm font-semibold text-navy-900">
              <Icon className="h-5 w-5 shrink-0 text-gold-600" aria-hidden />
              {label}
            </p>
          ))}
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Top services</p>
          <h2 className="mt-3 max-w-xl text-4xl text-navy-900">What people book us for</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <h2 className="text-4xl text-navy-900">How a booking works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map(([number, title, text]) => (
              <li key={number} className="rounded-3xl bg-paper p-6">
                <p className="text-sm font-bold text-gold-600">{number}</p>
                <h3 className="mt-3 text-2xl text-navy-900">{title}</h3>
                <p className="mt-3 text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Our services</p>
              <h2 className="mt-3 text-4xl text-navy-900">Removals, clearance and delivery</h2>
            </div>
            <Link href="/services" className="hidden font-bold text-navy-900 sm:inline">
              See the full list
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-20 text-white">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Who we are</p>
            <h2 className="mt-3 text-4xl">A West Yorkshire crew you can actually reach</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{settings.about.split("\n\n")[0]}</p>
            <Link href="/about" className="mt-6 inline-flex font-bold text-gold-400">
              Meet the company
            </Link>
          </div>
          <img src="/brand/logo.jpg" alt="Fete Nexus Logistics and Removals logo" className="w-full rounded-3xl bg-white object-cover" />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Community</p>
              <h2 className="mt-3 text-4xl text-navy-900">Notes from the yard</h2>
            </div>
            <Link href="/community" className="font-bold text-navy-900">Read the journal</Link>
          </div>
          <div className="mt-8 divide-y divide-navy-900/10 border-y border-navy-900/10">
            {posts.slice(0, 3).map((post) => (
              <article key={post.id} className="grid gap-3 py-7 md:grid-cols-[160px_1fr]">
                <p className="text-sm font-semibold text-gold-600">{post.publishedAt ? formatDate(post.publishedAt) : "Draft"}</p>
                <div>
                  <h3 className="text-2xl text-navy-900">
                    <Link href={`/community/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 max-w-2xl text-muted">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="rounded-[2rem] bg-navy-950 px-8 py-12 text-white sm:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Book now</p>
            <h2 className="mt-3 max-w-2xl text-4xl sm:text-5xl">Need it moved, delivered or cleared?</h2>
            <p className="mt-4 text-2xl text-gold-400">We&apos;ve got you covered.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="inline-flex min-h-12 items-center rounded-full bg-gold-500 px-6 font-bold text-navy-950">
                Book now
              </Link>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="inline-flex min-h-12 items-center rounded-full border border-white/20 px-6 font-bold">
                Call {settings.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
