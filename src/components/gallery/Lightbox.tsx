"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo } from "@/lib/photos";

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index];
  const [zoomed, setZoomed] = useState(false);
  const touchX = useRef<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const prev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate]
  );

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!photo) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — ${photo.category}`}
      className="fixed inset-0 z-[110] flex flex-col bg-ink/97 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
    >
      {/* top chrome */}
      <div
        className="flex items-center justify-between px-5 py-4 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-smoke">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          <span className="ml-4 hidden text-gold sm:inline">{photo.meta}</span>
        </p>
        <button
          ref={closeBtn}
          onClick={onClose}
          aria-label="Close lightbox"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-cream transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {/* image stage */}
      <div
        className="relative flex-1 overflow-hidden px-4 sm:px-20"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
          touchX.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            className="absolute inset-0 sm:inset-x-20"
            initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.01, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            <motion.div
              className={`relative h-full w-full ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              animate={{ scale: zoomed ? 1.55 : 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* prev / next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous photograph"
          className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:flex"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next photograph"
          className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:flex"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {/* caption */}
      <div
        className="flex items-end justify-between gap-6 px-5 py-5 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-serif text-2xl font-light text-warmwhite sm:text-3xl">
            {photo.title}
          </p>
          {photo.description && (
            <p className="mt-1 max-w-xl font-sans text-xs font-light leading-relaxed text-smoke sm:text-sm">
              {photo.description}
            </p>
          )}
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
          {photo.category}
        </p>
      </div>
    </motion.div>
  );
}
