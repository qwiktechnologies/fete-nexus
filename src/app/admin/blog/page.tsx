import Link from "next/link";
import { setPostPublished } from "@/actions/admin";
import { DataTable, menuItemClass } from "@/components/data-table";
import { RowMenu } from "@/components/row-menu";
import { prisma } from "@/lib/db";
import { formatDate, formatStamp } from "@/lib/format";
import { requireAdmin } from "@/lib/guards";

const columns = ["Article", "Author", "Status", "Published", "Updated", ""];

export default async function BlogAdminPage() {
  await requireAdmin();
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-navy-900">Community</h1>
          <p className="mt-2 text-muted">Journal articles shown on the public site.</p>
        </div>
        <Link href="/admin/blog/new" className="rounded-full bg-gold-500 px-5 py-2 font-bold text-navy-950">New article</Link>
      </div>
      <DataTable columns={columns} empty={!posts.length}>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>
              <p className="font-bold text-navy-900">{post.title}</p>
              <p className="mt-1 max-w-md text-sm text-muted">{post.excerpt}</p>
            </td>
            <td className="whitespace-nowrap">{post.author.name}</td>
            <td>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${post.published ? "bg-emerald-50 text-emerald-800" : "bg-navy-100 text-navy-800"}`}>
                {post.published ? "Published" : "Hidden"}
              </span>
            </td>
            <td className="whitespace-nowrap">{post.publishedAt ? formatDate(post.publishedAt) : "—"}</td>
            <td className="whitespace-nowrap">{formatStamp(post.updatedAt)}</td>
            <td>
              <RowMenu>
                <Link href={`/admin/blog/${post.id}`} className={menuItemClass}>View and edit</Link>
                {post.published ? <Link href={`/community/${post.slug}`} className={menuItemClass}>View on site</Link> : null}
                <form action={setPostPublished}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="published" value={post.published ? "false" : "true"} />
                  <button className={menuItemClass}>{post.published ? "Hide article" : "Publish"}</button>
                </form>
              </RowMenu>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
