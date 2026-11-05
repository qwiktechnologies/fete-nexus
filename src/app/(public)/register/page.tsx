import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/guards";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect("/account");
  return <AuthForm mode="register" next={next} />;
}
