import { ServiceForm } from "@/components/service-form";
import { requireAdmin } from "@/lib/guards";

export default async function NewServicePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 dash-title">New service</h1>
      <ServiceForm />
    </div>
  );
}
