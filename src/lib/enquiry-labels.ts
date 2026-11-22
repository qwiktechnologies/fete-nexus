import type { EnquiryStatus } from "@prisma/client";

export const enquiryStatusLabel: Record<EnquiryStatus, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};