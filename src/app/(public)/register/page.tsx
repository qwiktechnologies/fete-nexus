import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/guards";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect("/account");
  return (
    <Container className="grid py-16 lg:grid-cols-2 lg:items-center">
      <div className="mb-10 max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Account</p>
        <p className="mt-3 text-4xl text-navy-900">Book, then keep the conversation here</p>
      </div>
      <AuthForm mode="register" next={next} />
    </Container>
  );
}
