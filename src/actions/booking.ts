"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BookingStatus, BookingType } from "@prisma/client";
import { setSession } from "@/lib/auth";
import { nextCode, postSystemMessage } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { todayInLondon } from "@/lib/format";
import { getCurrentUser } from "@/lib/guards";
import { photosFromForm, saveJobPhotos } from "@/lib/uploads";
import { emailSchema, field, passwordSchema, type FormState } from "@/lib/validators";

const types = new Set<BookingType>(["REMOVAL", "COLLECTION", "HOUSE_MOVE", "DELIVERY", "SERVICE"]);

export async function createBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const typeValue = field(formData, "type") as BookingType;
  if (!types.has(typeValue)) return { error: "Choose the kind of job you need." };

  const date = field(formData, "date");
  const time = field(formData, "time");
  const locationFrom = field(formData, "locationFrom");
  const locationTo = field(formData, "locationTo");
  const distanceNote = field(formData, "distanceNote");
  const instructions = field(formData, "instructions");
  const serviceId = field(formData, "serviceId");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayInLondon()) {
    return { error: "Choose today or a future date." };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) return { error: "Choose a time." };
  if (locationFrom.length < 3 || locationTo.length < 3) {
    return { error: "Enter where we collect from and where we go to." };
  }
  if (instructions.length > 2000) return { error: "Keep the instructions under 2,000 characters." };

  let service: Awaited<ReturnType<typeof prisma.service.findUnique>> = null;
  if (typeValue === "SERVICE") {
    if (!serviceId) return { error: "Choose a listed service." };
    service = await prisma.service.findFirst({ where: { id: serviceId, active: true } });
    if (!service) return { error: "That service is no longer available." };
  }

  const sessionUser = await getCurrentUser();
  let userId = sessionUser?.id ?? "";

  if (!sessionUser) {
    const name = field(formData, "name");
    const email = field(formData, "email").toLowerCase();
    const phone = field(formData, "phone");
    const password = field(formData, "password");
    if (name.length < 2) return { error: "Enter your name." };
    if (!emailSchema.safeParse(email).success) return { error: "Enter a valid email address." };
    if (phone.length < 7) return { error: "Enter a phone number." };
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (!existing.active) return { error: "This account is disabled. Call the office." };
      const matches = password ? await bcrypt.compare(password, existing.passwordHash) : false;
      if (!matches) return { error: "That email already has an account. Sign in, then book again." };
      userId = existing.id;
      await setSession({ id: existing.id, role: existing.role });
    } else {
      if (!passwordSchema.safeParse(password).success) {
        return { error: "Create a password of at least 8 characters so you can track this booking." };
      }
      const created = await prisma.user.create({
        data: { name, email, phone, passwordHash: await bcrypt.hash(password, 10), role: "CUSTOMER" },
      });
      userId = created.id;
      await setSession({ id: created.id, role: created.role });
    }
  }

  const photos = photosFromForm(formData);
  const saved = await saveJobPhotos(photos);
  if (saved.error) return { error: saved.error };

  const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  const reference = await nextCode("FN");
  const depositPercent = service?.depositPercent ?? settings?.depositPercent ?? 30;

  let bookingId = "";
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          reference,
          userId,
          serviceId: service?.id,
          type: typeValue,
          status: "PENDING",
          scheduledDate: new Date(`${date}T12:00:00.000Z`),
          scheduledTime: time,
          locationFrom,
          locationTo,
          distanceNote,
          instructions,
          images: saved.urls.length ? { create: saved.urls.map((url) => ({ url })) } : undefined,
        },
      });
      const conversation = await tx.conversation.create({
        data: { userId, bookingId: created.id, subject: `Booking ${reference}` },
      });
      const opening = service
        ? `Request received for ${service.title}. Reference ${reference}.`
        : `Request received. Reference ${reference}. We'll reply here with a quote.`;
      await tx.message.create({ data: { conversationId: conversation.id, system: true, body: opening } });

      if (service?.isPurchasable && service.pricePence != null) {
        const depositPence = Math.max(100, Math.round((service.pricePence * depositPercent) / 100));
        const invoiceNumber = await nextCode("INV");
        const admin = await tx.user.findFirst({
          where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, active: true },
          orderBy: { createdAt: "asc" },
        });
        if (admin) {
          await tx.invoice.create({
            data: {
              number: invoiceNumber,
              bookingId: created.id,
              amountPence: service.pricePence,
              depositPence,
              notes: `Listed price for ${service.title}. Paying the deposit confirms the booking.`,
              status: "SENT",
              createdById: admin.id,
            },
          });
          await tx.message.create({
            data: {
              conversationId: conversation.id,
              system: true,
              body: `Invoice ${invoiceNumber} is ready. Pay the deposit in this account to confirm the date.`,
            },
          });
          await tx.booking.update({ where: { id: created.id }, data: { status: "AWAITING_PAYMENT" } });
        }
      }
      return created;
    });
    bookingId = booking.id;
  } catch (error) {
    console.error(error);
    return { error: "We couldn't save that booking. Try again." };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/account");
  redirect(`/account/bookings/${bookingId}`);
}

export async function cancelBooking(formData: FormData) {
  const { requireUser } = await import("@/lib/guards");
  const user = await requireUser();
  const id = field(formData, "id");
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.userId !== user.id) redirect("/account/bookings");
  const cancellable: BookingStatus[] = ["PENDING", "QUOTED"];
  if (!cancellable.includes(booking.status)) {
    redirect(`/account/bookings/${id}`);
  }
  await prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  await postSystemMessage(id, `Booking ${booking.reference} was cancelled by the customer.`);
  revalidatePath(`/account/bookings/${id}`);
  revalidatePath("/admin/bookings");
  redirect(`/account/bookings/${id}`);
}
