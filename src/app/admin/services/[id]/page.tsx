import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/service-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (
    <div>
      <h1 className="dash-title mb-6">Edit service</h1>
      <ServiceForm initial={service} />
    </div>
  );
}
