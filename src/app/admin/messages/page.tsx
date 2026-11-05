import Link from "next/link";
import { markInboxRead } from "@/actions/messages";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireStaff } from "@/lib/guards";

export default async function AdminMessagesPage() {
  await requireStaff();
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    take: 80,
    include: {
      user: { select: { name: true, email: true } },
      booking: { select: { reference: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          messages: { where: { readAt: null, OR: [{ system: true }, { sender: { role: "CUSTOMER" } }] } },
        },
      },
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-4xl text-navy-900">Messages</h1>
      <p className="mt-2 text-muted">Customer threads. Mark one as read when you have seen it.</p>
      {conversations.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {conversations.map((conversation) => {
            const unread = conversation._count.messages > 0;
            const preview = conversation.messages[0]?.body ?? "No message yet.";
            return (
              <article key={conversation.id} className="flex flex-col rounded-[1.75rem] border border-navy-900/10 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-xs font-bold uppercase tracking-[0.16em] ${unread ? "text-gold-600" : "text-muted"}`}>
                    {unread ? `${conversation._count.messages} unread` : "Read"}
                  </p>
                  <p className="text-xs text-muted">{formatStamp(conversation.updatedAt)}</p>
                </div>
                <h2 className="mt-3 text-2xl text-navy-900">{conversation.subject}</h2>
                <p className="mt-1 text-sm text-muted">
                  {conversation.user.name}
                  {conversation.booking ? ` · ${conversation.booking.reference}` : ""}
                </p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-navy-800">{preview}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/admin/messages/${conversation.id}`} className="inline-flex min-h-10 items-center rounded-full bg-navy-900 px-4 text-sm font-bold text-white">
                    Open
                  </Link>
                  {unread ? (
                    <form action={markInboxRead}>
                      <input type="hidden" name="conversationId" value={conversation.id} />
                      <button className="inline-flex min-h-10 items-center rounded-full border border-navy-900/15 px-4 text-sm font-bold text-navy-900">
                        Mark as read
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.75rem] border border-navy-900/10 bg-white px-6 py-16 text-center font-semibold text-muted">
          No data found
        </div>
      )}
    </div>
  );
}
