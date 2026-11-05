import { setUserActive } from "@/actions/admin";
import { DataTable } from "@/components/data-table";
import { AddAccountButton } from "@/components/user-form";
import { prisma } from "@/lib/db";
import { formatStamp } from "@/lib/format";
import { requireAdmin } from "@/lib/guards";
import { roleLabel } from "@/lib/roles";

const columns = ["Name", "Email", "Phone", "Role", "Status", "Joined", ""];

export default async function UsersPage() {
  const admin = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-navy-900">People</h1>
          <p className="mt-2 text-muted">Customers, staff and admins. A disabled account cannot sign in.</p>
        </div>
        <AddAccountButton superAdmin={admin.role === "SUPER_ADMIN"} />
      </div>
      <DataTable columns={columns} empty={!users.length}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="font-bold text-navy-900">{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone ?? "—"}</td>
            <td>{roleLabel(user.role)}</td>
            <td>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${user.active ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                {user.active ? "Active" : "Disabled"}
              </span>
            </td>
            <td className="whitespace-nowrap">{formatStamp(user.createdAt)}</td>
            <td>
              {user.id !== admin.id && user.role !== "SUPER_ADMIN" && !(user.role === "ADMIN" && admin.role !== "SUPER_ADMIN") ? (
                <form action={setUserActive}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="active" value={user.active ? "false" : "true"} />
                  <button className="text-sm font-bold text-navy-800">{user.active ? "Deactivate" : "Activate"}</button>
                </form>
              ) : null}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
