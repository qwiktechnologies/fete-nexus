import { redirect } from "next/navigation";
import { Container } from "@/components/container";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser, homeForRole } from "@/lib/guards";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(homeForRole(user.role));
  return (
    <Container className="grid py-16 lg:grid-cols-2 lg:items-center">
      <div className="mb-10 max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-600">Account</p>
        <p className="mt-3 text-4xl text-navy-900">Your Logistics Partner</p>
        <p className="mt-4 text-lg text-muted">Sign in to see quotes, pay a deposit, or message Fete Nexus about a job.</p>
      </div>
      <AuthForm mode="login" next={next} />
    </Container>
  );
}
