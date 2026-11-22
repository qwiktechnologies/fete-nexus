"use client";

import { useActionState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { submitContactEnquiry } from "@/actions/contact";
import { contactForm } from "@/lib/contact-figma";
import type { FormState } from "@/lib/validators";

export function ContactEnquiryForm({ serviceOptions }: { serviceOptions: string[] }) {
  const [state, action, pending] = useActionState(submitContactEnquiry, {} as FormState);

  if (state.ok) {
    return (
      <div className="panel border border-forest-200 bg-forest-50 p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-forest-800">Enquiry received</p>
        <p className="mt-3 text-2xl font-semibold text-navy-900">Reference {state.ok}</p>
        <p className="mt-3 text-sm leading-6 text-muted">{contactForm.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="panel border border-border/80 p-6 lg:p-8">
      <h2 className="text-2xl font-semibold text-navy-900">{contactForm.title}</h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{contactForm.intro}</p>
      {state.error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="label sm:col-span-2">
          {contactForm.fields.fullName.label}
          <input className="field" name="fullName" required placeholder={contactForm.fields.fullName.placeholder} autoComplete="name" />
        </label>
        <label className="label">
          {contactForm.fields.email.label}
          <input
            className="field"
            name="email"
            type="email"
            required
            placeholder={contactForm.fields.email.placeholder}
            autoComplete="email"
          />
        </label>
        <label className="label">
          {contactForm.fields.phone.label}
          <input className="field" name="phone" type="tel" placeholder={contactForm.fields.phone.placeholder} autoComplete="tel" />
        </label>
        <label className="label sm:col-span-2">
          {contactForm.fields.service.label}
          <select className="field" name="serviceRequired" required defaultValue="">
            <option value="" disabled>
              {contactForm.fields.service.placeholder}
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          {contactForm.fields.collection.label}
          <input className="field" name="collectionPostcode" placeholder={contactForm.fields.collection.placeholder} autoComplete="postal-code" />
        </label>
        <label className="label">
          {contactForm.fields.delivery.label}
          <input className="field" name="deliveryPostcode" placeholder={contactForm.fields.delivery.placeholder} />
        </label>
        <label className="label sm:col-span-2">
          {contactForm.fields.message.label}
          <textarea
            className="field min-h-36"
            name="message"
            required
            placeholder={contactForm.fields.message.placeholder}
          />
        </label>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        {contactForm.privacyNote}{" "}
        <span className="font-semibold text-navy-800">{contactForm.privacyLink}</span>
      </p>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 px-6 text-sm font-bold text-white hover:bg-gold-400 disabled:opacity-60 sm:w-auto"
      >
        {contactForm.submit}
        <FiArrowRight aria-hidden />
      </button>
    </form>
  );
}