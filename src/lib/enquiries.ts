import { nextCode } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { emailSchema } from "@/lib/validators";

export type EnquiryInput = {
  fullName: string;
  email: string;
  phone?: string;
  serviceRequired: string;
  collectionPostcode?: string;
  deliveryPostcode?: string;
  message: string;
};

export type EnquiryResult = { ok: true; reference: string; id: string } | { ok: false; error: string };

export async function createContactEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = (input.phone ?? "").trim();
  const serviceRequired = input.serviceRequired.trim();
  const collectionPostcode = (input.collectionPostcode ?? "").trim();
  const deliveryPostcode = (input.deliveryPostcode ?? "").trim();
  const message = input.message.trim();

  if (fullName.length < 2) return { ok: false, error: "Enter your full name." };
  if (!emailSchema.safeParse(email).success) return { ok: false, error: "Enter a valid email address." };
  if (phone.length > 0 && phone.length < 7) return { ok: false, error: "Enter a valid phone number or leave it blank." };
  if (serviceRequired.length < 2) return { ok: false, error: "Choose the service you need." };
  if (message.length < 10) return { ok: false, error: "Add a short message so we can help." };
  if (message.length > 4000) return { ok: false, error: "Keep the message under 4,000 characters." };
  if (collectionPostcode.length > 16 || deliveryPostcode.length > 16) {
    return { ok: false, error: "Check the postcodes you entered." };
  }

  const reference = await nextCode("ENQ");
  const row = await prisma.contactEnquiry.create({
    data: {
      reference,
      fullName,
      email,
      phone,
      serviceRequired,
      collectionPostcode,
      deliveryPostcode,
      message,
    },
  });

  return { ok: true, reference: row.reference, id: row.id };
}