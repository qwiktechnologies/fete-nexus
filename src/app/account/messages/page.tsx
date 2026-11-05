import Link from "next/link";
import { StartMessageForm } from "@/components/start-message-form";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireUser } from "@/lib/guards";

export default async function AccountMessagesPage() {
  const user = await requireUser();
  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section>
        <h1 className="text-4xl text-navy-900">Messages</h1>
        <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="py-5">
              <Link href={`/account/messages/${conversation.id}`} className="font-bold text-navy-900">{conversation.subject}</Link>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{conversation.messages[0]?.body}</p>
              <p className="mt-1 text-xs text-muted">{formatStamp(conversation.updatedAt)}</p>
            </li>
          ))}
        </ul>
      </section>
      <StartMessageForm />
    </div>
  );
}
