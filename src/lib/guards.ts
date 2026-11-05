import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { clearSession, getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdminRole, isStaffRole } from "@/lib/roles";

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  active: true,
} as const;

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: userSelect });
  if (!user?.active) return null;
  return user;
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

async function requireActive() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.id }, select: userSelect });
  if (!user?.active) {
    await clearSession();
    redirect("/login");
  }
  return user;
}

export async function requireUser() {
  return requireActive();
}

export async function requireStaff() {
  const user = await requireActive();
  if (!isStaffRole(user.role)) redirect("/account");
  return user;
}

export async function requireAdmin() {
  const user = await requireActive();
  if (!isAdminRole(user.role)) redirect("/admin");
  return user;
}

export function homeForRole(role: Role) {
  return isStaffRole(role) ? "/admin" : "/account";
}
