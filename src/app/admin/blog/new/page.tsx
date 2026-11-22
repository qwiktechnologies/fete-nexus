import { PostForm } from "@/components/post-form";
import { requireAdmin } from "@/lib/guards";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 dash-title">New article</h1>
      <PostForm />
    </div>
  );
}
