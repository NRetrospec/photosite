import { HomeView } from "@/components/home/HomeView";
import { readOverrides } from "@/lib/photoStore";

// Uploaded replacements are read per request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <HomeView overrides={await readOverrides()} />;
}
