import { getCurrentUser } from "@/lib/guards";
import { getSettings } from "@/lib/queries";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, user] = await Promise.all([getSettings(), getCurrentUser()]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2">
        Skip to content
      </a>
      <SiteHeader phone={settings.phone} user={user ? { name: user.name, role: user.role } : null} />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
