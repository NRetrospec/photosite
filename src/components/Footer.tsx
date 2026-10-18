"use client";

import { usePathname } from "next/navigation";
import { ShutterLink } from "./shutter/ShutterLink";
import { site } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-black/[0.06] bg-ink px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-serif text-3xl text-cream">{site.name}</p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-smoke">
            {site.location} · {site.travel}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: "/", label: "Home" },
            { href: "/gallery", label: "Gallery" },
            { href: "/about", label: "About" },
            { href: "/booking", label: "Book" },
          ].map((l) => (
            <ShutterLink
              key={l.href}
              href={l.href}
              className="font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-emerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald/70"
            >
              {l.label}
            </ShutterLink>
          ))}
        </nav>

        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex gap-6">
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-emerald">
              Instagram
            </a>
            <a href={site.social.pinterest} target="_blank" rel="noreferrer" className="font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-emerald">
              Pinterest
            </a>
            <a href={site.social.vimeo} target="_blank" rel="noreferrer" className="font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-emerald">
              Vimeo
            </a>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-smoke/60">
            © {new Date().getFullYear()} {site.studio} · ƒ/1.8 AND BE THERE
          </p>
        </div>
      </div>
    </footer>
  );
}
