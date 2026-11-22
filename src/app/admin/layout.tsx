import { AppShell } from "@/components/app-shell";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNavCopy } from "@/lib/admin-dashboard-figma";
import { requireStaff } from "@/lib/guards";
import { getSettings } from "@/lib/queries";
import { isAdminRole } from "@/lib/roles";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([requireStaff(), getSettings()]);

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/quotes", label: "Quotes" },
    { href: "/admin/payments", label: "Invoices" },
    { href: "/admin/messages", label: "Messages" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/users", label: "Customers" },
  ];

  const secondaryLinks = isAdminRole(user.role)
    ? [
        { href: "/admin/services", label: "Services" },
        { href: "/admin/blog", label: "Community" },
        { href: "/admin/settings", label: "Settings" },
        { href: "/admin/payment-config", label: "Payment config" },
      ]
    : undefined;

  return (
    <AppShell user={{ name: user.name, role: user.role }}>
      <DashboardShell
        shellTitle={adminNavCopy.shellTitle}
        shellSubtitle={adminNavCopy.shellSubtitle}
        userName={user.name}
        dispatch={{ phone: settings.phone, email: settings.email }}
        navAriaLabel="Admin"
        links={links}
        secondaryLinks={secondaryLinks}
        secondaryGroupLabel="Manage"
      >
        {children}
      </DashboardShell>
    </AppShell>
  );
}