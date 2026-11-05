import { DashboardShell } from "@/components/dashboard-shell";
import { requireStaff } from "@/lib/guards";
import { isAdminRole } from "@/lib/roles";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/messages", label: "Messages" },
  ];
  if (isAdminRole(user.role)) {
    links.push(
      { href: "/admin/services", label: "Services" },
      { href: "/admin/blog", label: "Community" },
      { href: "/admin/users", label: "People" },
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/payment-config", label: "Payment config" },
    );
  }
  return (
    <DashboardShell title="Office" userName={user.name} links={links}>
      {children}
    </DashboardShell>
  );
}
