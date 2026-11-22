import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/guards";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AppShell user={user ? { name: user.name, role: user.role } : null}>
      {children}
    </AppShell>
  );
}