import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const bookingStatuses = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  photographyType: varchar("photography_type", { length: 80 }).notNull(),
  preferredDate: varchar("preferred_date", { length: 40 }),
  alternativeDate: varchar("alternative_date", { length: 40 }),
  location: varchar("location", { length: 200 }),
  peopleCount: varchar("people_count", { length: 40 }),
  budgetRange: varchar("budget_range", { length: 80 }),
  details: text("details"),
  inspirationUrl: text("inspiration_url"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
