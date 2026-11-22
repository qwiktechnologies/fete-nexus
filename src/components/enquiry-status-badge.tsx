import type { EnquiryStatus } from "@prisma/client";
import { enquiryStatusLabel } from "@/lib/enquiry-labels";

const tones: Record<EnquiryStatus, string> = {
  NEW: "bg-gold-100 text-gold-900 border-gold-300",
  READ: "bg-surface-100 text-navy-800 border-border",
  REPLIED: "bg-forest-100 text-forest-900 border-forest-300",
  ARCHIVED: "bg-navy-100 text-navy-700 border-navy-200",
};

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${tones[status]}`}>
      {enquiryStatusLabel[status]}
    </span>
  );
}