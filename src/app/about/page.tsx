import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${site.name}, a ${site.specialties.join(", ").toLowerCase()} photographer based in ${site.location}. Philosophy, experience, and the person behind the lens.`,
};

export default function AboutPage() {
  return <AboutView />;
}
