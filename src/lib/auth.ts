import { cookies } from "next/headers";
import { readToken, signToken, type Session } from "@/lib/token";

const COOKIE = "fn_session";

export type { Session };

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return readToken(token);
}

export async function setSession(session: Session) {
  const jar = await cookies();
  jar.set(COOKIE, await signToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
