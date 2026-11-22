import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/queries";

export async function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role: string } | null;
}) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader phone={settings.phone} user={user} />
      <main id="main" className="flex flex-1 flex-col bg-surface-50">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}