

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";


const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "formflow-super-secret-jwt-key-2026-production-ready"
);

export const COOKIE_NAME = "formflow_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name?: string | null;
}


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}


export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}


export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}


export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | null,
    };
  } catch {
    return null;
  }
}

/**
 * বর্তমানে লগইন থাকা ইউজারের সেশন বের করার সার্ভার-সাইড ফাংশন
 * (Next.js Route Handlers বা Server Components থেকে সরাসরি কল করা যাবে)
 */
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await verifyToken(token);
    if (!session?.userId) return null;

    // ডাটাবেজ থেকে ইউজারের লেটেস্ট তথ্য আনা
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
