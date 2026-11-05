import { z } from "zod";

export type FormState = { error?: string; ok?: string };

export function field(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export const passwordSchema = z.string().min(8, "Use at least 8 characters.").max(100);

export const emailSchema = z.string().email("Enter a valid email address.").max(160);
