import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getSettings() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  if (!settings) {
    throw new Error("Site settings are missing. Run the database seed.");
  }
  return settings;
}

export const bookingDetailInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  service: true,
  images: { orderBy: { createdAt: "asc" } },
  quotes: { orderBy: { createdAt: "desc" }, include: { createdBy: { select: { name: true } } } },
  invoices: { orderBy: { createdAt: "desc" }, include: { payments: true } },
  conversation: {
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, role: true } } },
      },
    },
  },
} satisfies Prisma.BookingInclude;

export async function getBookingDetail(id: string) {
  return prisma.booking.findUnique({ where: { id }, include: bookingDetailInclude });
}

export type BookingDetail = NonNullable<Awaited<ReturnType<typeof getBookingDetail>>>;

export async function publishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
}

export async function activeServices() {
  return prisma.service.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
}
