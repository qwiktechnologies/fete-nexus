import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

export type Session = { id: string; role: Role };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(value);
}

export async function signToken(session: Session) {
  return new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = payload.role;
    if (typeof payload.sub !== "string") return null;
    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "STAFF" && role !== "CUSTOMER") return null;
    return { id: payload.sub, role };
  } catch {
    return null;
  }
}
