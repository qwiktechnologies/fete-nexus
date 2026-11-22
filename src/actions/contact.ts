"use server";

import { revalidatePath } from "next/cache";
import type { EnquiryStatus } from "@prisma/client";
import { createContactEnquiry } from "@/lib/enquiries";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/guards";
import { field, type FormState } from "@/lib/validators";

export async function submitContactEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await createContactEnquiry({
    fullName: field(formData, "fullName"),
    email: field(formData, "email"),
    phone: field(formData, "phone"),
    serviceRequired: field(formData, "serviceRequired"),
    collectionPostcode: field(formData, "collectionPostcode"),
    deliveryPostcode: field(formData, "deliveryPostcode"),
    message: field(formData, "message"),
  });

  if (!result.ok) return { error: result.error };
  revalidatePath("/admin/enquiries");
  return { ok: `${result.reference}` };
}

export async function markEnquiryRead(formData: FormData) {
  await requireStaff();
  const id = field(formData, "enquiryId");
  await prisma.contactEnquiry.update({
    where: { id },
    data: { status: "READ", readAt: new Date() },
  });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

const enquiryStatuses = new Set<EnquiryStatus>(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export async function updateEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireStaff();
  const id = field(formData, "enquiryId");
  const status = field(formData, "status") as EnquiryStatus;
  const adminNote = field(formData, "adminNote");
  if (!enquiryStatuses.has(status)) return { error: "Pick a valid status." };
  if (adminNote.length > 4000) return { error: "Keep the office note under 4,000 characters." };

  await prisma.contactEnquiry.update({
    where: { id },
    data: {
      status,
      adminNote,
      ...(status === "NEW" ? { readAt: null } : {}),
    },
  });
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: "Saved" };
}