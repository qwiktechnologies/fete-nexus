import { SettingsForm } from "@/components/settings-form";
import { requireAdmin } from "@/lib/guards";
import { getSettings } from "@/lib/queries";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div>
      <h1 className="mb-6 text-4xl text-navy-900">Site details</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
