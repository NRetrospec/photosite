import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, bookingStatuses, type BookingStatus } from "@/db/schema";
import { isAdmin } from "@/lib/adminAuth";

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauthorized = await guard();
  if (unauthorized) return unauthorized;

  if (!db) return NextResponse.json({ bookings: [] });

  const rows = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  return NextResponse.json({ bookings: rows });
}

export async function PATCH(request: Request) {
  const unauthorized = await guard();
  if (unauthorized) return unauthorized;

  const { id, status } = await request.json().catch(() => ({}));
  if (!Number.isInteger(id) || !bookingStatuses.includes(status as BookingStatus)) {
    return NextResponse.json({ error: "Invalid id or status." }, { status: 400 });
  }

  if (!db) return NextResponse.json({ error: "No database configured." }, { status: 501 });

  const [updated] = await db
    .update(bookings)
    .set({ status })
    .where(eq(bookings.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  return NextResponse.json({ booking: updated });
}

export async function DELETE(request: Request) {
  const unauthorized = await guard();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  if (!db) return NextResponse.json({ error: "No database configured." }, { status: 501 });

  await db.delete(bookings).where(eq(bookings.id, id));
  return NextResponse.json({ ok: true });
}
