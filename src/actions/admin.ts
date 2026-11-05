"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { BookingStatus, Role } from "@prisma/client";
import { postSystemMessage, settleInvoice } from "@/lib/billing";
import { nextCode } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { gbp, poundsToPence, slugify } from "@/lib/format";
import { requireAdmin, requireStaff } from "@/lib/guards";
import { isAdminRole } from "@/lib/roles";
import { field, passwordSchema, emailSchema, type FormState } from "@/lib/validators";

function refreshBooking(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/account");
  revalidatePath(`/account/bookings/${id}`);
  revalidatePath("/admin/payments");
}

export async function setBookingStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  const staff = await requireStaff();
  const id = field(formData, "id");
  const status = field(formData, "status") as BookingStatus;
  const reason = field(formData, "reason");
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { error: "Booking not found." };
  if (booking.status === "CONFIRMED" && status === "REJECTED") {
    return { error: "A paid booking can't be rejected. Message the customer instead." };
  }

  const allowed: BookingStatus[] = ["ACCEPTED", "REJECTED", "COMPLETED"];
  if (!allowed.includes(status)) return { error: "That status can't be set from here." };
  if (status === "REJECTED" && reason.length < 3) return { error: "Tell the customer why the booking was rejected." };
  if (status === "COMPLETED" && !["CONFIRMED", "ACCEPTED", "AWAITING_PAYMENT"].includes(booking.status)) {
    return { error: "Accept the booking before marking it complete." };
  }

  await prisma.booking.update({ where: { id }, data: { status } });
  const line =
    status === "ACCEPTED"
      ? `${staff.name} accepted booking ${booking.reference}.`
      : status === "COMPLETED"
        ? `Booking ${booking.reference} is marked complete. Thank you for choosing Fete Nexus.`
        : `Booking ${booking.reference} was declined. ${reason}`;
  await postSystemMessage(id, line);
  refreshBooking(id);
  return { ok: status === "REJECTED" ? "Booking rejected." : status === "COMPLETED" ? "Marked complete." : "Booking accepted." };
}

export async function sendQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  const staff = await requireStaff();
  const id = field(formData, "id");
  const message = field(formData, "message");
  const amountPence = poundsToPence(field(formData, "amount"));
  if (amountPence == null || amountPence <= 0) return { error: "Enter a quote amount in pounds." };
  if (message.length < 3) return { error: "Add a short note with the quote." };
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.status === "REJECTED" || booking.status === "CANCELLED") {
    return { error: "This booking can't be quoted." };
  }
  await prisma.quote.create({ data: { bookingId: id, amountPence, message, createdById: staff.id } });
  if (booking.status === "PENDING" || booking.status === "ACCEPTED") {
    await prisma.booking.update({ where: { id }, data: { status: "QUOTED" } });
  }
  await postSystemMessage(id, `Quote: ${gbp(amountPence)}. ${message}`);
  refreshBooking(id);
  return { ok: "Quote sent in the booking thread." };
}

export async function sendInvoice(_prev: FormState, formData: FormData): Promise<FormState> {
  const staff = await requireStaff();
  const id = field(formData, "id");
  const notes = field(formData, "notes");
  const amountPence = poundsToPence(field(formData, "amount"));
  const depositPence = poundsToPence(field(formData, "deposit"));
  if (amountPence == null || amountPence <= 0) return { error: "Enter the full amount." };
  if (depositPence == null || depositPence <= 0) return { error: "Enter the deposit the customer must pay." };
  if (depositPence > amountPence) return { error: "The deposit can't be more than the full amount." };

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || ["REJECTED", "CANCELLED", "COMPLETED"].includes(booking.status)) {
    return { error: "This booking can't be invoiced." };
  }

  const number = await nextCode("INV");
  await prisma.$transaction([
    prisma.invoice.updateMany({ where: { bookingId: id, status: "SENT" }, data: { status: "VOID" } }),
    prisma.invoice.create({
      data: { number, bookingId: id, amountPence, depositPence, notes, status: "SENT", createdById: staff.id },
    }),
    prisma.booking.update({ where: { id }, data: { status: "AWAITING_PAYMENT" } }),
  ]);
  await postSystemMessage(
    id,
    `Invoice ${number}: ${gbp(amountPence)} total, ${gbp(depositPence)} deposit to confirm the booking.${notes ? ` ${notes}` : ""}`,
  );
  refreshBooking(id);
  return { ok: `Invoice ${number} sent.` };
}

export async function markDepositPaid(formData: FormData) {
  const staff = await requireStaff();
  const invoiceId = field(formData, "invoiceId");
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { booking: true } });
  if (!invoice) redirect("/admin/payments");
  const result = await settleInvoice({
    invoiceId,
    userId: invoice.booking.userId,
    provider: "bank",
    providerRef: `manual-${staff.id}-${invoiceId}`,
  });
  refreshBooking(invoice.bookingId);
  if ("error" in result && result.error) redirect(`/admin/bookings/${invoice.bookingId}`);
  redirect(`/admin/bookings/${invoice.bookingId}`);
}

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = field(formData, "id");
  const title = field(formData, "title");
  const summary = field(formData, "summary");
  const description = field(formData, "description");
  const includes = field(formData, "includes");
  const category = field(formData, "category");
  const icon = field(formData, "icon") || "package";
  const requestedSlug = slugify(field(formData, "slug") || title);
  const priceRaw = field(formData, "price");
  const pricePence = priceRaw ? poundsToPence(priceRaw) : null;
  const depositRaw = field(formData, "depositPercent");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  const isPurchasable = formData.get("isPurchasable") === "on";
  const sortOrder = Number(field(formData, "sortOrder") || "0");

  if (title.length < 3) return { error: "Add a service title." };
  if (summary.length < 8) return { error: "Add a short summary." };
  if (description.length < 20) return { error: "Add a description a customer can read." };
  if (!category) return { error: "Choose a category." };
  if (!requestedSlug) return { error: "Add a web address slug." };
  if (priceRaw && pricePence == null) return { error: "Enter the price in pounds, or leave it blank for a quote." };
  if (isPurchasable && pricePence == null) return { error: "A service customers can buy needs a price." };

  let depositPercent: number | null = null;
  if (depositRaw) {
    const parsed = Number(depositRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
      return { error: "Deposit percent should be a whole number from 1 to 100." };
    }
    depositPercent = parsed;
  }

  const slugTaken = await prisma.service.findFirst({
    where: { slug: requestedSlug, NOT: id ? { id } : undefined },
    select: { id: true },
  });
  if (slugTaken) return { error: "Another service already uses that slug." };

  const data = {
    title,
    slug: requestedSlug,
    summary,
    description,
    includes,
    category,
    icon,
    pricePence,
    depositPercent,
    isPurchasable,
    featured,
    active,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function setServiceActive(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const active = field(formData, "active") === "true";
  await prisma.service.update({ where: { id }, data: { active } });
  revalidatePath("/services");
  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function setPostPublished(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const published = field(formData, "published") === "true";
  await prisma.post.update({
    where: { id },
    data: { published, publishedAt: published ? new Date() : null },
  });
  revalidatePath("/community");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = field(formData, "id");
  const title = field(formData, "title");
  const excerpt = field(formData, "excerpt");
  const content = field(formData, "content");
  const published = formData.get("published") === "on";
  const requestedSlug = slugify(field(formData, "slug") || title);
  if (title.length < 4) return { error: "Add a title." };
  if (excerpt.length < 12) return { error: "Add a short excerpt." };
  if (content.length < 40) return { error: "Write the article before publishing." };
  if (!requestedSlug) return { error: "Add a slug." };

  const slugTaken = await prisma.post.findFirst({
    where: { slug: requestedSlug, NOT: id ? { id } : undefined },
    select: { id: true },
  });
  if (slugTaken) return { error: "Another article already uses that slug." };

  if (id) {
    const existing = await prisma.post.findUnique({ where: { id } });
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: requestedSlug,
        excerpt,
        content,
        published,
        publishedAt: published ? existing?.publishedAt ?? new Date() : null,
      },
    });
  } else {
    await prisma.post.create({
      data: {
        title,
        slug: requestedSlug,
        excerpt,
        content,
        published,
        publishedAt: published ? new Date() : null,
        authorId: admin.id,
      },
    });
  }
  revalidatePath("/community");
  revalidatePath("/");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const depositPercent = Number(field(formData, "depositPercent"));
  if (!Number.isInteger(depositPercent) || depositPercent < 1 || depositPercent > 100) {
    return { error: "Default deposit should be a whole number from 1 to 100." };
  }
  const email = field(formData, "email").toLowerCase();
  if (!emailSchema.safeParse(email).success) return { error: "Enter a valid contact email." };

  await prisma.siteSetting.update({
    where: { id: "default" },
    data: {
      companyName: field(formData, "companyName"),
      heroLine: field(formData, "heroLine"),
      tagline: field(formData, "tagline"),
      email,
      phone: field(formData, "phone"),
      address: field(formData, "address"),
      areas: field(formData, "areas"),
      directorName: field(formData, "directorName"),
      licenceNumber: field(formData, "licenceNumber"),
      insuredNote: field(formData, "insuredNote"),
      about: field(formData, "about"),
      hours: field(formData, "hours"),
      depositPercent,
      bankAccountName: field(formData, "bankAccountName"),
      bankSortCode: field(formData, "bankSortCode"),
      bankAccountNumber: field(formData, "bankAccountNumber"),
    },
  });
  revalidatePath("/", "layout");
  return { ok: "Site details saved." };
}

function keyError(value: string, prefixes: string[], label: string) {
  if (!value) return null;
  const matches = prefixes.some((prefix) => value.startsWith(prefix) && value.length >= prefix.length + 8);
  if (!matches) return `${label} should start with ${prefixes.join(" or ")}.`;
  return null;
}

export async function savePaymentConfig(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (field(formData, "clear") === "yes") {
    await prisma.paymentConfig.upsert({
      where: { id: "default" },
      update: { stripeSecretKey: "", stripePublishableKey: "", stripeWebhookSecret: "" },
      create: { id: "default" },
    });
    revalidatePath("/admin/payment-config");
    revalidatePath("/account");
    return { ok: "Card credentials removed. Customers will see the bank details instead." };
  }

  const current = await prisma.paymentConfig.findUnique({ where: { id: "default" } });
  const secret = field(formData, "stripeSecretKey") || current?.stripeSecretKey.trim() || "";
  const publishable = field(formData, "stripePublishableKey") || current?.stripePublishableKey.trim() || "";
  const webhook = field(formData, "stripeWebhookSecret") || current?.stripeWebhookSecret.trim() || "";

  const error =
    keyError(secret, ["sk_test_", "sk_live_", "rk_test_", "rk_live_"], "The secret key") ||
    keyError(publishable, ["pk_test_", "pk_live_"], "The publishable key") ||
    keyError(webhook, ["whsec_"], "The webhook secret");
  if (error) return { error };
  if (!secret && (publishable || webhook)) {
    return { error: "Add the secret key as well. Card checkout cannot run without it." };
  }

  await prisma.paymentConfig.upsert({
    where: { id: "default" },
    update: { stripeSecretKey: secret, stripePublishableKey: publishable, stripeWebhookSecret: webhook },
    create: { id: "default", stripeSecretKey: secret, stripePublishableKey: publishable, stripeWebhookSecret: webhook },
  });
  revalidatePath("/admin/payment-config");
  revalidatePath("/account");
  return { ok: secret ? "Card payments saved. The pay button is now on invoices." : "Payment config saved." };
}

export async function createManagedUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const phone = field(formData, "phone");
  const password = field(formData, "password");
  const role = field(formData, "role") as Role;
  const allowed: Role[] = admin.role === "SUPER_ADMIN" ? ["CUSTOMER", "STAFF", "ADMIN"] : ["CUSTOMER", "STAFF"];
  if (!allowed.includes(role)) return { error: "You can't create that kind of account." };
  if (name.length < 2) return { error: "Enter a name." };
  if (!emailSchema.safeParse(email).success) return { error: "Enter a valid email." };
  if (!passwordSchema.safeParse(password).success) return { error: "Use a password of at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "That email is already in use." };
  await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash: await bcrypt.hash(password, 10), role },
  });
  revalidatePath("/admin/users");
  return { ok: `${name} can sign in with the password you just set. Share it with them directly.` };
}

export async function setUserActive(formData: FormData) {
  const admin = await requireAdmin();
  const id = field(formData, "id");
  const active = field(formData, "active") === "true";
  if (id === admin.id) redirect("/admin/users");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) redirect("/admin/users");
  if (user.role === "SUPER_ADMIN") redirect("/admin/users");
  if (user.role === "ADMIN" && !isAdminRole(admin.role)) redirect("/admin/users");
  if (user.role === "ADMIN" && admin.role !== "SUPER_ADMIN") redirect("/admin/users");
  await prisma.user.update({ where: { id }, data: { active } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}
