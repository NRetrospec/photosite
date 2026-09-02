import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "studio_admin";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "aperture";
}

export function adminToken() {
  return createHash("sha256")
    .update(`marlowe-studio::${adminPassword()}`)
    .digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
