import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/guards";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <DashboardShell
      title="Your account"
      userName={user.name}
      links={[
        { href: "/account", label: "Overview" },
        { href: "/account/bookings", label: "Bookings" },
        { href: "/account/messages", label: "Messages" },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
