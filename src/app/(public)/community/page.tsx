import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { formatDate } from "@/lib/format";
import { publishedPosts } from "@/lib/queries";

export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage() {
  const posts = await publishedPosts();
  return (
    <>
      <section className="bg-navy-900 py-16 text-white">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-400">Community</p>
          <h1 className="mt-3 text-5xl">The Fete Nexus journal</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Clearance drives, how we handle waste, and what is changing in logistics across England.
          </p>
        </Container>
      </section>
      <Container className="py-12">
        <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
          {posts.map((post) => (
            <article key={post.id} className="grid gap-3 py-8 md:grid-cols-[180px_1fr]">
              <p className="text-sm font-semibold text-gold-600">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p>
              <div>
                <h2 className="text-3xl text-navy-900">
                  <Link href={`/community/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 max-w-2xl text-lg text-muted">{post.excerpt}</p>
                <Link href={`/community/${post.slug}`} className="mt-4 inline-flex font-bold text-navy-900">Read article</Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
