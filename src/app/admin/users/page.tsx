import { setUserActive } from "@/actions/admin";
import { UserForm } from "@/components/user-form";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guards";
import { roleLabel } from "@/lib/roles";

export default async function UsersPage() {
  const admin = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      <section>
        <h1 className="text-4xl text-navy-900">People</h1>
        <p className="mt-2 max-w-xl text-muted">Staff handle bookings, quotes, invoices and messages. Admins also manage services, the journal, payments and these accounts.</p>
        <ul className="mt-6 divide-y divide-navy-900/10 rounded-[2rem] bg-white px-6">
          {users.map((user) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-bold text-navy-900">{user.name}</p>
                <p className="text-sm text-muted">{user.email} · {roleLabel(user.role)} · {user.active ? "Active" : "Disabled"}</p>
              </div>
              {user.id !== admin.id && user.role !== "SUPER_ADMIN" ? (
                <form action={setUserActive}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="active" value={user.active ? "false" : "true"} />
                  <button className="text-sm font-bold text-navy-800">{user.active ? "Deactivate" : "Activate"}</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <UserForm superAdmin={admin.role === "SUPER_ADMIN"} />
    </div>
  );
}
