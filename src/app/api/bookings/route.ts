import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, photographyType, preferredDate, alternativeDate, location, peopleCount, budgetRange, details, inspirationUrl } = body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!photographyType || typeof photographyType !== "string") {
      return NextResponse.json({ error: "Please choose a photography type." }, { status: 400 });
    }

    const clean = (v: unknown, max = 200) =>
      typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

    const [created] = await db
      .insert(bookings)
      .values({
        name: name.trim().slice(0, 160),
        email: email.trim().slice(0, 200),
        phone: clean(phone, 60),
        photographyType: photographyType.trim().slice(0, 80),
        preferredDate: clean(preferredDate, 40),
        alternativeDate: clean(alternativeDate, 40),
        location: clean(location, 200),
        peopleCount: clean(peopleCount, 40),
        budgetRange: clean(budgetRange, 80),
        details: clean(details, 4000),
        inspirationUrl: clean(inspirationUrl, 1000),
        status: "new",
      })
      .returning({ id: bookings.id });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err) {
    console.error("booking POST failed", err);
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please try again." },
      { status: 500 }
    );
  }
}
