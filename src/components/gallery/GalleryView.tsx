"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { photos, photoCategories, type PhotoCategory } from "@/lib/photos";
import { Lightbox } from "./Lightbox";
import { Reticle } from "@/components/FadeIn";
import { site } from "@/lib/site";

type Filter = "All" | PhotoCategory;

export function GalleryView() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? photos : photos.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div className="min-h-screen bg-ink px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-10 max-w-3xl px-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            The Collection
          </p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] text-warmwhite sm:text-7xl">
            A walk through <em className="text-gold">the archive.</em>
          </h1>
          <p className="mt-5 font-sans text-sm font-light leading-relaxed text-smoke">
            {photos.length} frames from weddings, portrait sessions, editorial
            commissions, and journeys across {site.region.split("·")[0].trim()} and
            beyond.
          </p>
        </div>

        {/* filters */}
        <div
          role="tablist"
          aria-label="Filter gallery by category"
          className="no-scrollbar mb-10 flex gap-2 overflow-x-auto px-2 pb-2"
        >
          {(["All", ...photoCategories] as Filter[]).map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(cat)}
                className={`relative shrink-0 rounded-full border px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  active
                    ? "border-cream text-ink"
                    : "border-white/15 text-smoke hover:border-white/40 hover:text-cream"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-cream"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* animated grid */}
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((photo, i) => {
              const isLandscape = photo.width > photo.height;
              return (
                <motion.button
                  layout
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  initial={
                    reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }
                  }
                  animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -14 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`reticle group relative block overflow-hidden bg-charcoal text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                    isLandscape
                      ? "col-span-2 aspect-[16/10] lg:col-span-2"
                      : "aspect-[3/4]"
                  }`}
                  aria-label={`Open ${photo.title} — ${photo.category}`}
                >
                  <Reticle />
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-[transform,filter] duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-110"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                    <p className="font-serif text-lg text-warmwhite sm:text-xl">
                      {photo.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-gold">
                      {photo.category} · {photo.meta}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={visible}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
