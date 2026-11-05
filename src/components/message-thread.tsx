"use client";

import { useActionState, useEffect, useRef } from "react";
import { markConversationRead, sendMessage } from "@/actions/messages";
import { formatStamp } from "@/lib/format";
import { isStaffRole } from "@/lib/roles";
import type { FormState } from "@/lib/validators";

type ThreadMessage = {
  id: string;
  body: string;
  system: boolean;
  createdAt: string;
  sender: { id: string; name: string; role: string } | null;
};

export function MessageThread({
  conversationId,
  messages,
  viewerId,
}: {
  conversationId: string;
  messages: ThreadMessage[];
  viewerId: string;
}) {
  const [state, action, pending] = useActionState(sendMessage, {} as FormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    void markConversationRead(conversationId);
  }, [conversationId, messages.length]);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-[2rem] bg-white p-5">
      <h2 className="text-2xl text-navy-900">Messages</h2>
      <div className="mt-4 grid max-h-[32rem] gap-3 overflow-y-auto pr-1">
        {messages.map((message) => {
          if (message.system) {
            return (
              <p key={message.id} className="rounded-2xl bg-gold-100 px-4 py-3 text-sm text-navy-900">
                {message.body}
                <span className="mt-1 block text-xs text-navy-700/70">{formatStamp(new Date(message.createdAt))}</span>
              </p>
            );
          }
          const mine = message.sender?.id === viewerId;
          const fromTeam = message.sender ? isStaffRole(message.sender.role) : false;
          return (
            <article key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? "ml-auto bg-navy-900 text-white" : "bg-paper text-navy-900"}`}>
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                {mine ? "You" : fromTeam ? message.sender?.name ?? "Fete Nexus" : message.sender?.name ?? "Customer"}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{message.body}</p>
              <p className="mt-2 text-xs opacity-60">{formatStamp(new Date(message.createdAt))}</p>
            </article>
          );
        })}
      </div>
      <form ref={formRef} action={action} className="mt-4">
        <input type="hidden" name="conversationId" value={conversationId} />
        <label className="label" htmlFor={`message-${conversationId}`}>Reply</label>
        <textarea id={`message-${conversationId}`} name="body" className="field min-h-24" required maxLength={2000} />
        {state.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
        <button disabled={pending} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-gold-500 px-5 font-bold text-navy-950 disabled:opacity-60">
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
