import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "admin_session";
const maxAge = 60 * 60 * 24 * 7;

function username() {
  return process.env.ADMIN_USERNAME || "admin";
}

function password() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(payload: string) {
  return createHmac("sha256", password()).update(payload).digest("base64url");
}

function sameSecret(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function credentialsMatch(inputUsername: string, inputPassword: string) {
  const name = inputUsername.trim();
  const pass = inputPassword.trim();
  const expectedPassword = password();
  if (!expectedPassword || !username()) return false;
  const usernameOk = sameSecret(name, username());
  const passwordOk = sameSecret(pass, expectedPassword);
  return usernameOk && passwordOk;
}

export function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + maxAge * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function sessionCookie() {
  return {
    name: cookieName,
    maxAge,
  };
}

export async function isAdmin() {
  if (!password()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
