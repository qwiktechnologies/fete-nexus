import Link from "next/link";
import { FiArrowRight, FiMail, FiPhone } from "react-icons/fi";
import { startCheckout } from "@/actions/payments";
import { gbp } from "@/lib/format";
import type { BookingQuotePayload } from "@/lib/booking-quote";
import { bookingQuoteCopy } from "@/lib/quote-figma";

export function BookingQuoteScreen({
  payload,
  cardPayments,
  bank,
  phone,
  email,
  bookingId,
  cancelled,
}: {
  payload: BookingQuotePayload;
  cardPayments: boolean;
  bank: { accountName: string; sortCode: string; accountNumber: string };
  phone: string;
  email: string;
  bookingId: string;
  cancelled?: boolean;
}) {
  const totalPence = payload.invoice?.totalPence ?? payload.quote?.amountPence ?? 0;
  const depositPence = payload.invoice?.depositPence ?? 0;
  const balancePence = payload.invoice?.balancePence ?? Math.max(0, totalPence - depositPence);

  return (
    <div className="grid gap-8">
      <header className="border-b border-border/70 pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{payload.header}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">{payload.headline}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{payload.intro}</p>
        <p className="mt-5 inline-flex rounded-md bg-forest-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-forest-900">
          {payload.badge}
        </p>
        <p className="mt-4 text-base font-semibold text-navy-800">{payload.schedule}</p>
      </header>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-gold-600">{bookingQuoteCopy.progressTitle}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {bookingQuoteCopy.progressSteps.map((step) => (
            <li
              key={step.number}
              className={`rounded-lg border px-4 py-3 ${
                step.state === "current"
                  ? "border-gold-400 bg-gold-50"
                  : step.state === "done"
                    ? "border-forest-200 bg-forest-50/80"
                    : "border-border bg-surface-50"
              }`}
            >
              <p className="text-xs font-bold text-gold-600">{step.number}</p>
              <p className="mt-1 text-sm font-semibold text-navy-900">{step.label}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel border border-border/80 p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-navy-900">{bookingQuoteCopy.glanceTitle}</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <GlanceRow label={bookingQuoteCopy.labels.from} value={payload.glance.from} />
          <GlanceRow label={bookingQuoteCopy.labels.to} value={payload.glance.to} />
          <GlanceRow label={bookingQuoteCopy.labels.service} value={payload.glance.service} />
          <GlanceRow label={bookingQuoteCopy.labels.team} value={payload.glance.teamVehicle} />
          <GlanceRow label={bookingQuoteCopy.labels.distance} value={payload.glance.distance} className="sm:col-span-2" />
        </dl>
      </section>

      {payload.quote ? (
        <section className="panel p-6">
          <h2 className="text-xl font-semibold text-navy-900">{bookingQuoteCopy.quoteTitle}</h2>
          <p className="mt-2 text-3xl font-bold text-navy-900">{gbp(payload.quote.amountPence)}</p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">{payload.quote.message}</p>
          <p className="mt-4 text-sm text-muted">{bookingQuoteCopy.quoteNote}</p>
        </section>
      ) : null}

      {cancelled ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Card payment was cancelled. You can try again below.
        </p>
      ) : null}

      {payload.invoice ? (
        <section className="dash-cta p-6 lg:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400">
            {payload.invoice.number} · {bookingQuoteCopy.paymentTitle}
          </p>
          <p className="mt-3 text-sm text-white/80">{bookingQuoteCopy.paymentIntro}</p>
          <div className="mt-6 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/60">{bookingQuoteCopy.totalLabel}</p>
              <p className="mt-1 text-2xl font-semibold">{gbp(totalPence)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-gold-300">{bookingQuoteCopy.depositLabel}</p>
              <p className="mt-1 text-3xl font-bold">{gbp(depositPence)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/60">{bookingQuoteCopy.balanceLabel}</p>
              <p className="mt-1 text-2xl font-semibold">{gbp(balancePence)}</p>
            </div>
          </div>
          {payload.invoice.notes ? <p className="mt-4 text-sm text-white/75">{payload.invoice.notes}</p> : null}
          {cardPayments ? (
            <form action={startCheckout} className="mt-6">
              <input type="hidden" name="invoiceId" value={payload.invoice.id} />
              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 text-sm font-bold text-white hover:bg-gold-400 sm:w-auto">
                {bookingQuoteCopy.payCta}
                <FiArrowRight aria-hidden />
              </button>
              <p className="mt-3 text-sm text-white/70">{bookingQuoteCopy.stripeHint}</p>
            </form>
          ) : (
            <p className="mt-6 rounded-lg bg-white/10 p-4 text-sm leading-6 text-white">{bookingQuoteCopy.bankIntro}</p>
          )}
        </section>
      ) : null}

      {!cardPayments && payload.invoice && bank.accountName ? (
        <section className="panel p-6">
          <h2 className="text-lg font-semibold text-navy-900">{bookingQuoteCopy.bankTitle}</h2>
          <p className="mt-2 text-sm text-muted">{bank.accountName}</p>
          <p className="text-sm text-muted">Sort code {bank.sortCode}</p>
          <p className="text-sm text-muted">Account {bank.accountNumber}</p>
          <p className="mt-2 text-sm font-bold text-navy-900">Reference {payload.reference}</p>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href={`/account/bookings/${bookingId}`} className="btn-secondary min-h-11">
          {bookingQuoteCopy.manageBooking}
        </Link>
      </div>

      <section className="panel border border-border/80 p-6">
        <h2 className="text-lg font-semibold text-navy-900">{bookingQuoteCopy.supportTitle}</h2>
        <p className="mt-2 text-sm text-muted">{bookingQuoteCopy.referenceHint}</p>
        <div className="mt-4 flex flex-wrap gap-6">
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            <FiMail className="text-gold-500" aria-hidden />
            {email}
          </a>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            <FiPhone className="text-gold-500" aria-hidden />
            {phone}
          </a>
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">{bookingQuoteCopy.dispatchSupport}</p>
        <p className="mt-4 text-sm font-semibold text-navy-800">{bookingQuoteCopy.tagline}</p>
      </section>
    </div>
  );
}

function GlanceRow({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold-600">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-snug text-navy-900">{value}</dd>
    </div>
  );
}