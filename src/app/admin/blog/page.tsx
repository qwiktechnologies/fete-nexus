import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";

export default async function BlogAdminPage() {
  await requireAdmin();
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, include: { author: { select: { name: true } } } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl text-navy-900">Community</h1>
        <Link href="/admin/blog/new" className="rounded-full bg-gold-500 px-5 py-2 font-bold text-navy-950">New article</Link>
      </div>
      <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
        {posts.map((post) => (
          <li key={post.id} className="py-4">
            <Link href={`/admin/blog/${post.id}`} className="font-bold text-navy-900">{post.title}</Link>
            <p className="text-sm text-muted">{post.published ? "Published" : "Hidden"} · {post.author.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
