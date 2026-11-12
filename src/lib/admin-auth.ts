import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminSessionCookieName = "talent_one_admin";
const sessionDurationMs = 8 * 60 * 60 * 1000;

function sessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createAdminSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({
      expiresAt: Date.now() + sessionDurationMs,
      nonce: randomBytes(16).toString("base64url"),
    }),
  ).toString("base64url");

  return payload + "." + signature(payload);
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;

  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return false;

  let supplied: Buffer;
  let expected: Buffer;
  try {
    supplied = Buffer.from(suppliedSignature, "base64url");
    expected = Buffer.from(signature(payload), "base64url");
  } catch {
    return false;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      expiresAt?: number;
      nonce?: string;
    };
    return (
      Number.isFinite(session.expiresAt) &&
      (session.expiresAt ?? 0) > Date.now() &&
      typeof session.nonce === "string"
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(
    cookieStore.get(adminSessionCookieName)?.value,
  );
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, createAdminSessionToken(), {
    httpOnly: true,
    maxAge: sessionDurationMs / 1000,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export function verifyAdminPin(pin: string, encodedHash: string) {
  const parts = encodedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const cost = Number(parts[1]);
  const blockSize = Number(parts[2]);
  const parallelization = Number(parts[3]);
  if (cost !== 16384 || blockSize !== 8 || parallelization !== 1) return false;

  try {
    const salt = Buffer.from(parts[4], "base64url");
    const expected = Buffer.from(parts[5], "base64url");
    if (salt.length < 16 || expected.length !== 64) return false;

    const actual = scryptSync(pin, salt, expected.length, {
      N: cost,
      maxmem: 64 * 1024 * 1024,
      p: parallelization,
      r: blockSize,
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function hashClientAddress(request: Request) {
  const address =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "unknown";
  return createHmac("sha256", sessionSecret()).update(address).digest("hex");
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
