import { notFound } from "next/navigation";
import { PostForm } from "@/components/post-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div>
      <h1 className="mb-6 text-4xl text-navy-900">Edit article</h1>
      <PostForm initial={post} />
    </div>
  );
}
