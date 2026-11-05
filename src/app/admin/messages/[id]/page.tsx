import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageThread } from "@/components/message-thread";
import { prisma } from "@/lib/db";
import { requireStaff } from "@/lib/guards";

export default async function AdminThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staff = await requireStaff();
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      user: true,
      messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } },
    },
  });
  if (!conversation) notFound();
  return (
    <div className="grid gap-4">
      <Link href="/admin/messages" className="text-sm font-bold text-gold-600">All messages</Link>
      <h1 className="text-4xl text-navy-900">{conversation.subject}</h1>
      <p className="text-muted">{conversation.user.name} · {conversation.user.email}</p>
      {conversation.bookingId ? <Link href={`/admin/bookings/${conversation.bookingId}`} className="font-bold text-navy-900">Open booking</Link> : null}
      <MessageThread
        conversationId={conversation.id}
        viewerId={staff.id}
        messages={conversation.messages.map((message) => ({
          id: message.id,
          body: message.body,
          system: message.system,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender,
        }))}
      />
    </div>
  );
}
