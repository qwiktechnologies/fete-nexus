import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageThread } from "@/components/message-thread";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/guards";

export default async function AccountThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, name: true, role: true } } } } },
  });
  if (!conversation || conversation.userId !== user.id) notFound();
  return (
    <div className="grid gap-4">
      <Link href="/account/messages" className="text-sm font-bold text-gold-600">All messages</Link>
      <h1 className="text-4xl text-navy-900">{conversation.subject}</h1>
      <MessageThread
        conversationId={conversation.id}
        viewerId={user.id}
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
