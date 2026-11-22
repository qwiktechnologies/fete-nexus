import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEnquiryForm } from "@/components/admin-enquiry-form";
import { EnquiryStatusBadge } from "@/components/enquiry-status-badge";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";

export default async function AdminEnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  let enquiry = await prisma.contactEnquiry.findUnique({ where: { id } });
  if (!enquiry) notFound();

  if (enquiry.status === "NEW") {
    enquiry = await prisma.contactEnquiry.update({
      where: { id },
      data: { status: "READ", readAt: new Date() },
    });
  }

  return (
    <div>
      <Link href="/admin/enquiries" className="text-sm font-bold text-gold-600">
        All enquiries
      </Link>
      <EnquiryPageHeader reference={enquiry.reference} status={enquiry.status} createdAt={enquiry.createdAt} />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Contact details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="Full name" value={enquiry.fullName} />
            <Row label="Email" value={enquiry.email} />
            <Row label="Phone" value={enquiry.phone || "—"} />
          </dl>
        </section>
        <section className="panel p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Job details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="Service required" value={enquiry.serviceRequired} />
            <Row label="Collection postcode" value={enquiry.collectionPostcode || "—"} />
            <Row label="Delivery postcode" value={enquiry.deliveryPostcode || "—"} />
          </dl>
        </section>
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Message</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-navy-900">{enquiry.message}</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`mailto:${enquiry.email}`} className="btn-secondary">
          Email {enquiry.fullName.split(" ")[0]}
        </a>
        {enquiry.phone ? (
          <a href={`tel:${enquiry.phone.replace(/\s/g, "")}`} className="btn-secondary">
            Call {enquiry.phone}
          </a>
        ) : null}
      </div>

      <AdminEnquiryForm enquiryId={enquiry.id} status={enquiry.status} adminNote={enquiry.adminNote} />
    </div>
  );
}

function EnquiryPageHeader({
  reference,
  status,
  createdAt,
}: {
  reference: string;
  status: Parameters<typeof EnquiryStatusBadge>[0]["status"];
  createdAt: Date;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="dash-title">{reference}</h1>
        <p className="mt-2 text-sm text-muted">Received {formatStamp(createdAt)}</p>
      </div>
      <EnquiryStatusBadge status={status} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-border/70 pt-3 first:border-t-0 first:pt-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold text-navy-900">{value}</dd>
    </div>
  );
}