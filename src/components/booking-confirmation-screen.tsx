import Link from "next/link";
import { FiArrowRight, FiMail, FiPhone } from "react-icons/fi";
import { gbp } from "@/lib/format";
import { bookingConfirmationCopy } from "@/lib/booking-confirmation-figma";
import type { BookingConfirmationPayload } from "@/lib/booking-confirmation";

export function BookingConfirmationScreen({
  payload,
  bookingId,
  phone,
  email,
}: {
  payload: BookingConfirmationPayload;
  bookingId: string;
  phone: string;
  email: string;
}) {
  return (
    <div className="grid gap-8">
      <header className="border-b border-border/70 pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{payload.header}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">{payload.headline}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{payload.thanks}</p>
        <p className="mt-5 inline-flex rounded-md bg-forest-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-forest-900">
          {payload.badge}
        </p>
        <p className="mt-4 text-base font-semibold text-navy-800">{payload.schedule}</p>
      </header>

      <section className="panel border border-border/80 p-6 lg:p-8">
        <h2 className="text-xl font-semibold text-navy-900">{bookingConfirmationCopy.glanceTitle}</h2>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              [bookingConfirmationCopy.labels.from, payload.glance.from],
              [bookingConfirmationCopy.labels.to, payload.glance.to],
              [bookingConfirmationCopy.labels.service, payload.glance.service],
              [bookingConfirmationCopy.labels.team, payload.glance.teamVehicle],
              [bookingConfirmationCopy.labels.distance, payload.glance.distance],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className={label === bookingConfirmationCopy.labels.distance ? "sm:col-span-2" : ""}>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold-600">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-navy-900">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/account/bookings/${bookingId}`} className="btn-secondary min-h-11">
            {bookingConfirmationCopy.manageBooking}
          </Link>
          <a
            href={`/account/bookings/${bookingId}/calendar`}
            className="inline-flex min-h-11 items-center rounded-md border border-navy-900/15 bg-white px-5 text-sm font-bold text-navy-900"
          >
            {bookingConfirmationCopy.addToCalendar}
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-navy-900">{bookingConfirmationCopy.nextTitle}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {bookingConfirmationCopy.steps.map((step) => (
            <li key={step.number} className="border-t-2 border-gold-500 pt-4">
              <p className="text-sm font-bold text-gold-600">{step.number}</p>
              <h3 className="mt-2 font-bold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {payload.payment ? (
        <section className="panel p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-navy-900">{bookingConfirmationCopy.paymentTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-muted">{bookingConfirmationCopy.totalQuote}</p>
              <p className="mt-1 text-2xl font-bold">{gbp(payload.payment.totalPence)}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted">{bookingConfirmationCopy.depositPaid}</p>
              <p className="mt-1 text-2xl font-bold text-forest-800">{gbp(payload.payment.depositPence)}</p>
              {payload.payment.paidOn ? <p className="mt-1 text-xs text-muted">Paid on {payload.payment.paidOn}</p> : null}
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted">{bookingConfirmationCopy.balanceDue}</p>
              <p className="mt-1 text-2xl font-bold">{gbp(payload.payment.balancePence)}</p>
            </div>
          </div>
          {payload.payment.canDownloadReceipt ? (
            <a
              href={`/account/bookings/${bookingId}/receipt`}
              className="btn-primary mt-6 inline-flex min-h-11 items-center gap-2"
            >
              {bookingConfirmationCopy.downloadReceipt}
              <FiArrowRight aria-hidden />
            </a>
          ) : null}
        </section>
      ) : null}

      <section className="panel border border-border/80 p-6">
        <h2 className="text-lg font-semibold text-navy-900">{bookingConfirmationCopy.helpTitle}</h2>
        <p className="mt-2 text-sm text-muted">
          {bookingConfirmationCopy.confirmationSent} <span className="font-semibold text-navy-900">{payload.customer.email}</span>
        </p>
        <p className="mt-3 text-sm text-muted">{bookingConfirmationCopy.changeHint}</p>
        <div className="mt-4 flex flex-wrap gap-6">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            <FiPhone className="text-gold-500" aria-hidden />
            {phone}
          </a>
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-900">
            <FiMail className="text-gold-500" aria-hidden />
            {email}
          </a>
        </div>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">{bookingConfirmationCopy.dispatchSupport}</p>
        <p className="mt-4 text-sm font-semibold text-navy-800">{bookingConfirmationCopy.tagline}</p>
      </section>
    </div>
  );
}