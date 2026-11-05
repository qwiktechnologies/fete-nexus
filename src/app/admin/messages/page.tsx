import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";

export default async function AdminMessagesPage() {
  await requireStaff();
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    take: 80,
    include: {
      user: { select: { name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  return (
    <div>
      <h1 className="text-4xl text-navy-900">Messages</h1>
      <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
        {conversations.map((conversation) => (
          <li key={conversation.id} className="py-5">
            <Link href={`/admin/messages/${conversation.id}`} className="font-bold text-navy-900">{conversation.subject}</Link>
            <p className="text-sm text-muted">{conversation.user.name} · {formatStamp(conversation.updatedAt)}</p>
            <p className="mt-1 line-clamp-2 text-sm">{conversation.messages[0]?.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
