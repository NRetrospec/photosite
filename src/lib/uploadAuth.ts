import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const UPLOAD_COOKIE = "studio_upload";

/** The 9-digit access code. Set UPLOAD_CODE in the environment to change it. */
export function uploadCode() {
  return process.env.UPLOAD_CODE ?? "123456789";
}

const digest = (value: string) =>
  createHash("sha256").update(`upload-code::${value}`).digest();

export function uploadToken() {
  return digest(uploadCode()).toString("hex");
}

export function codeMatches(input: unknown): boolean {
  if (typeof input !== "string" || !/^\d{9}$/.test(input)) return false;
  return timingSafeEqual(digest(input), digest(uploadCode()));
}

export async function canUpload(): Promise<boolean> {
  const store = await cookies();
  return store.get(UPLOAD_COOKIE)?.value === uploadToken();
}
