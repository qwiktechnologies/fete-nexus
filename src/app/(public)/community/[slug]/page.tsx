import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: { select: { name: true } } } });
  if (!post || !post.published) notFound();
  const others = await prisma.post.findMany({
    where: { published: true, NOT: { id: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <Container className="py-14">
      <Link href="/community" className="text-sm font-bold text-gold-600">Community</Link>
      <p className="mt-4 text-sm font-semibold text-muted">
        {post.publishedAt ? formatDate(post.publishedAt) : ""} · {post.author.name}
      </p>
      <h1 className="mt-3 max-w-3xl text-5xl text-navy-900">{post.title}</h1>
      <p className="mt-5 max-w-2xl text-xl text-muted">{post.excerpt}</p>
      <div className="mt-8 max-w-3xl">
        {post.content.split(/\n\n+/).map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="mt-5 text-lg leading-8">{paragraph}</p>
        ))}
      </div>
      {others.length ? (
        <div className="mt-16 border-t border-navy-900/10 pt-8">
          <h2 className="text-2xl text-navy-900">More from the journal</h2>
          <ul className="mt-4 grid gap-3">
            {others.map((item) => (
              <li key={item.id}>
                <Link href={`/community/${item.slug}`} className="font-semibold text-navy-800">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Container>
  );
}
