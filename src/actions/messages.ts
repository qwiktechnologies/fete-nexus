"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/guards";
import { isStaffRole } from "@/lib/roles";
import { field, type FormState } from "@/lib/validators";

async function loadConversation(id: string) {
  const user = await requireUser();
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) return { error: "That conversation is no longer here." as const, user, conversation: null };
  if (!isStaffRole(user.role) && conversation.userId !== user.id) {
    return { error: "You can't open that conversation." as const, user, conversation: null };
  }
  return { user, conversation };
}

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const id = field(formData, "conversationId");
  const body = field(formData, "body");
  if (body.length < 1) return { error: "Write a message first." };
  if (body.length > 2000) return { error: "Keep the message under 2,000 characters." };

  const loaded = await loadConversation(id);
  if (!loaded.conversation) return { error: loaded.error ?? "You can't open that conversation." };

  await prisma.message.create({
    data: { conversationId: id, senderId: loaded.user.id, body },
  });
  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });
  revalidatePath("/account/messages");
  revalidatePath("/admin/messages");
  revalidatePath(`/account/messages/${id}`);
  revalidatePath(`/admin/messages/${id}`);
  if (loaded.conversation.bookingId) {
    revalidatePath(`/account/bookings/${loaded.conversation.bookingId}`);
    revalidatePath(`/admin/bookings/${loaded.conversation.bookingId}`);
  }
  return { ok: "Sent" };
}

export async function markConversationRead(conversationId: string) {
  const loaded = await loadConversation(conversationId);
  if (!loaded.conversation) return;
  await prisma.message.updateMany({
    where: {
      conversationId,
      readAt: null,
      NOT: { senderId: loaded.user.id },
    },
    data: { readAt: new Date() },
  });
}

export async function startConversation(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  if (isStaffRole(user.role)) return { error: "Reply from the admin inbox." };
  const subject = field(formData, "subject");
  const body = field(formData, "body");
  if (subject.length < 3) return { error: "Add a short subject." };
  if (body.length < 2) return { error: "Write a message." };
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      subject,
      messages: { create: { senderId: user.id, body } },
    },
  });
  revalidatePath("/admin/messages");
  redirect(`/account/messages/${conversation.id}`);
}
