"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  photos as basePhotos,
  photoCategories,
  withOverride,
  type PhotoCategory,
  type PhotoOverrides,
} from "@/lib/photos";
import { Lightbox } from "./Lightbox";
import { UploadCodeDialog } from "./UploadCodeDialog";
import { Reticle } from "@/components/FadeIn";
import { site } from "@/lib/site";

type Filter = "All" | PhotoCategory;

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("decode"));
    img.src = url;
  }).finally(() => URL.revokeObjectURL(url));
}

interface GalleryViewProps {
  overrides: PhotoOverrides;
  unlocked: boolean;
}

export function GalleryView({ overrides: initialOverrides, unlocked: initialUnlocked }: GalleryViewProps) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [overrides, setOverrides] = useState(initialOverrides);
  const [unlocked, setUnlocked] = useState(initialUnlocked);
  const [codeOpen, setCodeOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const targetId = useRef<string | null>(null);

  const photos = useMemo(
    () => basePhotos.map((p) => withOverride(p, overrides)),
    [overrides]
  );
  const visible = useMemo(
    () => (filter === "All" ? photos : photos.filter((p) => p.category === filter)),
    [filter, photos]
  );

  function pickFile(id: string) {
    targetId.current = id;
    fileInput.current?.click();
  }

  async function onFileChosen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const id = targetId.current;
    e.target.value = "";
    if (!file || !id) return;

    setBusyId(id);
    setMessage(null);
    try {
      const size = await readImageSize(file).catch(() => null);
      const body = new FormData();
      body.append("file", file);
      if (size) {
        body.append("width", String(size.width));
        body.append("height", String(size.height));
      }
      const res = await fetch(`/api/photos/${id}`, { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setUnlocked(false);
        setMessage({ text: "Your session expired — enter your code again.", error: true });
        return;
      }
      if (!res.ok) {
        setMessage({ text: data.error ?? "Upload failed. Please try again.", error: true });
        return;
      }
      setOverrides((o) => ({ ...o, [id]: data.photo }));
      setMessage({ text: "Photo replaced.", error: false });
    } catch {
      setMessage({ text: "Upload failed. Please try again.", error: true });
    } finally {
      setBusyId(null);
    }
  }

  async function reset(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setMessage({ text: "Couldn't restore the original photo.", error: true });
        return;
      }
      setOverrides((o) => {
        const next = { ...o };
        delete next[id];
        return next;
      });
      setMessage({ text: "Original photo restored.", error: false });
    } catch {
      setMessage({ text: "Couldn't restore the original photo.", error: true });
    } finally {
      setBusyId(null);
    }
  }

  async function lock() {
    await fetch("/api/upload/unlock", { method: "DELETE" }).catch(() => undefined);
    setUnlocked(false);
    setMessage(null);
  }

  return (
    <div className="min-h-screen bg-ink px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-10 max-w-3xl px-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald">
            The Collection
          </p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] text-warmwhite sm:text-7xl">
            A walk through <em className="text-emerald">the archive.</em>
          </h1>
          <p className="mt-5 font-sans text-sm font-light leading-relaxed text-smoke">
            {photos.length} frames from weddings, portrait sessions, editorial
            commissions, and cars, animals, and nature across {site.region.split("·")[0].trim()} and
            beyond.
          </p>

          {/* upload access */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {unlocked ? (
              <>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald">
                  Upload mode on — choose “Replace” on any photo
                </span>
                <button
                  onClick={lock}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke underline underline-offset-4 transition-colors hover:text-cream"
                >
                  Lock
                </button>
              </>
            ) : (
              <button
                onClick={() => setCodeOpen(true)}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke underline underline-offset-4 transition-colors hover:text-emerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
              >
                Have an upload code?
              </button>
            )}
            <span
              role="status"
              aria-live="polite"
              className={`font-sans text-xs ${message?.error ? "text-red-700" : "text-emerald"}`}
            >
              {message?.text}
            </span>
          </div>
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
                className={`relative shrink-0 rounded-full border px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald ${
                  active
                    ? "border-cream text-ink"
                    : "border-black/15 text-smoke hover:border-black/40 hover:text-cream"
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

        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileChosen}
        />

        {/* animated grid */}
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((photo, i) => {
              const isLandscape = photo.width > photo.height;
              const busy = busyId === photo.id;
              return (
                <motion.div
                  layout
                  key={photo.id}
                  initial={
                    reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }
                  }
                  animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -14 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`reticle group relative block overflow-hidden bg-charcoal ${
                    isLandscape
                      ? "col-span-2 aspect-[16/10] lg:col-span-2"
                      : "aspect-[3/4]"
                  }`}
                >
                  <Reticle />
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-[transform,filter] duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:brightness-110 ${
                      busy ? "opacity-50" : ""
                    }`}
                  />
                  <div className="on-photo pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                    <p className="font-serif text-lg text-warmwhite sm:text-xl">
                      {photo.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-emerald">
                      {photo.category} · {photo.meta}
                    </p>
                  </div>

                  {/* opens the lightbox */}
                  <button
                    onClick={() => setLightboxIndex(i)}
                    className="absolute inset-0 z-[5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
                    aria-label={`Open ${photo.title} — ${photo.category}`}
                  />

                  {unlocked && (
                    <div className="on-photo absolute right-3 top-3 z-20 flex gap-2">
                      <button
                        onClick={() => pickFile(photo.id)}
                        disabled={busy}
                        className="rounded-full bg-ink/85 px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm transition-colors hover:text-emerald disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
                        aria-label={`Replace ${photo.title} with your own photo`}
                      >
                        {busy ? "Uploading…" : "Replace"}
                      </button>
                      {overrides[photo.id] && !busy && (
                        <button
                          onClick={() => reset(photo.id)}
                          className="rounded-full bg-ink/85 px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm transition-colors hover:text-emerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
                          aria-label={`Restore the original ${photo.title}`}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {codeOpen && (
          <UploadCodeDialog
            onClose={() => setCodeOpen(false)}
            onUnlocked={() => {
              setUnlocked(true);
              setCodeOpen(false);
              setMessage(null);
            }}
          />
        )}
      </AnimatePresence>

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
