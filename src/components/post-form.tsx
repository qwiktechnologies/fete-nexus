"use client";

import { useActionState } from "react";
import { savePost } from "@/actions/admin";
import type { FormState } from "@/lib/validators";

export function PostForm({
  initial,
}: {
  initial?: { id: string; title: string; slug: string; excerpt: string; content: string; published: boolean };
}) {
  const [state, action, pending] = useActionState(savePost, {} as FormState);
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-[2rem] bg-white p-6">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      {state.error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p> : null}
      <label className="label">Title<input className="field" name="title" required defaultValue={initial?.title} /></label>
      <label className="label">Slug<input className="field" name="slug" defaultValue={initial?.slug} /></label>
      <label className="label">Excerpt<textarea className="field min-h-20" name="excerpt" required defaultValue={initial?.excerpt} /></label>
      <label className="label">Article<textarea className="field min-h-72" name="content" required defaultValue={initial?.content} /></label>
      <label className="flex items-center gap-2 font-semibold"><input type="checkbox" name="published" defaultChecked={initial?.published ?? true} /> Published on Community</label>
      <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-5 font-bold text-white">{initial ? "Save article" : "Post article"}</button>
    </form>
  );
}
