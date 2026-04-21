import { randomBytes, timingSafeEqual, scryptSync } from "node:crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, existingHash] = storedHash.split(":");

  if (!salt || !existingHash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64);
  const existing = Buffer.from(existingHash, "hex");

  if (derived.length !== existing.length) {
    return false;
  }

  return timingSafeEqual(derived, existing);
}