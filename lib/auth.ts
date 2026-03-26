import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const SESSION_TOKEN_BYTES = 32;
const PASSWORD_SALT_BYTES = 16;

export const AUTH_SESSION_COOKIE = "heraldcup.identity-session";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64) as Buffer;
  const expectedBuffer = Buffer.from(hash, "hex");

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedBuffer);
}

export function createSessionToken() {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpiryDate() {
  return new Date(Date.now() + AUTH_SESSION_MAX_AGE_SECONDS * 1000);
}