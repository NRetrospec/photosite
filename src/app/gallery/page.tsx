import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/GalleryView";
import { readOverrides } from "@/lib/photoStore";
import { canUpload } from "@/lib/uploadAuth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Wedding, portrait, editorial, car, animal, and nature photography by ${site.name}, based in ${site.location}. Browse the full portfolio.`,
};

// Uploaded replacements and the unlock cookie are read per request.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [overrides, unlocked] = await Promise.all([readOverrides(), canUpload()]);
  return <GalleryView overrides={overrides} unlocked={unlocked} />;
}
