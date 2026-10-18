import type { Metadata } from "next";
import { BookingView } from "@/components/booking/BookingView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Session",
  description: `Request a photography session with ${site.name} in ${site.location}. Weddings, portraits, editorial, cars, animals, and nature — ${site.travel.toLowerCase()}.`,
};

export default function BookingPage() {
  return <BookingView />;
}
