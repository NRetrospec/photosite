import { NextResponse } from "next/server";
import {
  UPLOAD_COOKIE,
  canUpload,
  codeMatches,
  uploadToken,
} from "@/lib/uploadAuth";

// Light brute-force protection: 8 wrong guesses per IP per 15 minutes.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;
const fails = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
}

export async function GET() {
  return NextResponse.json({ unlocked: await canUpload() });
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const entry = fails.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_FAILS) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const { code } = await request.json().catch(() => ({ code: "" }));

  if (!codeMatches(code)) {
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    fails.set(key, current);
    return NextResponse.json({ error: "That code isn't right." }, { status: 401 });
  }

  fails.delete(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(UPLOAD_COOKIE, uploadToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(UPLOAD_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
