import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/GalleryView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Wedding, portrait, editorial, and travel photography by ${site.name}, based in ${site.location}. Browse the full portfolio.`,
};

export default function GalleryPage() {
  return <GalleryView />;
}
