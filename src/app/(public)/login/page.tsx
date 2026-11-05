import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser, homeForRole } from "@/lib/guards";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(homeForRole(user.role));
  return <AuthForm mode="login" next={next} />;
}
