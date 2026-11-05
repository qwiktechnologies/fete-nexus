"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { homeForRole } from "@/lib/guards";
import { safeNextPath } from "@/lib/format";
import { emailSchema, field, passwordSchema, type FormState } from "@/lib/validators";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email").toLowerCase();
  const password = field(formData, "password");
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success || !password) return { error: "Enter the email and password for your account." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active) return { error: "Those details don't match an active account." };
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return { error: "Those details don't match an active account." };

  await setSession({ id: user.id, role: user.role });
  redirect(safeNextPath(formData.get("next")) ?? homeForRole(user.role));
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const phone = field(formData, "phone");
  const password = field(formData, "password");
  if (name.length < 2) return { error: "Enter your name." };
  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) return { error: "Enter a valid email address." };
  const parsedPassword = passwordSchema.safeParse(password);
  if (!parsedPassword.success) return { error: parsedPassword.error.issues[0]?.message ?? "Check the password." };
  if (phone.length < 7) return { error: "Enter a phone number we can reach you on." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "That email already has an account. Sign in instead." };

  const user = await prisma.user.create({
    data: { name, email, phone, passwordHash: await bcrypt.hash(password, 10), role: "CUSTOMER" },
  });
  await setSession({ id: user.id, role: user.role });
  redirect(safeNextPath(formData.get("next")) ?? "/account");
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { requireUser } = await import("@/lib/guards");
  const currentUser = await requireUser();
  const current = field(formData, "current");
  const next = field(formData, "next");
  const parsed = passwordSchema.safeParse(next);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Use at least 8 characters." };

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user) return { error: "Account not found." };
  const matches = await bcrypt.compare(current, user.passwordHash);
  if (!matches) return { error: "The current password is wrong." };
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: "Password updated." };
}
