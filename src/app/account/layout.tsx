import { AppShell } from "@/components/app-shell";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/guards";
import { getSettings } from "@/lib/queries";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const [user, settings] = await Promise.all([requireUser(), getSettings()]);
  return (
    <AppShell user={{ name: user.name, role: user.role }}>
      <DashboardShell
        shellTitle="Your account"
        shellSubtitle="Bookings, quotes and messages"
        userName={user.name}
        dispatch={{ phone: settings.phone, email: settings.email }}
        navAriaLabel="Your account"
        links={[
          { href: "/account", label: "Overview" },
          { href: "/account/bookings", label: "Bookings" },
          { href: "/account/messages", label: "Messages" },
        ]}
        secondaryLinks={[
          { href: "/book", label: "Book a service" },
          { href: "/contact", label: "Contact dispatch" },
        ]}
        secondaryGroupLabel="Quick links"
      >
        {children}
      </DashboardShell>
    </AppShell>
  );
}