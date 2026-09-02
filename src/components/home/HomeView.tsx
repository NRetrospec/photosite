"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ShutterLink } from "@/components/shutter/ShutterLink";
import { FadeIn, Reticle } from "@/components/FadeIn";
import { site } from "@/lib/site";
import { heroPhoto, featuredPhotos, photos } from "@/lib/photos";

const easeOut = [0.22, 1, 0.36, 1] as const;

function HeadlineWord({ word, i }: { word: string; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-1 align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay: 0.9 + i * 0.12, ease: easeOut }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  );
}

export function HomeView() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  const exposure = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-30%"]);

  const quoteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start end", "end start"],
  });
  const quoteImgY = useTransform(quoteProgress, [0, 1], ["-12%", reduced ? "-12%" : "12%"]);

  const words = site.tagline.split(" ");

  return (
    <div className="bg-ink">
      {/* ————————— HERO ————————— */}
      <section ref={heroRef} className="relative h-[100svh] overflow-hidden" aria-label="Introduction">
        <motion.div className="absolute inset-0" style={{ y: imgY, scale: imgScale }}>
          <motion.div className="absolute inset-0" style={{ opacity: exposure }}>
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,11,0.55)_100%)]" />

        {/* camera metadata chrome */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="pointer-events-none absolute inset-x-0 top-24 hidden justify-between px-8 font-mono text-[10px] tracking-[0.35em] text-cream/50 sm:flex"
        >
          <span>
            <span className="rec-dot mr-2 inline-block h-[7px] w-[7px] rounded-full bg-gold align-middle" />
            {site.location.toUpperCase()}
          </span>
          <span>{heroPhoto.meta}</span>
        </motion.div>

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          style={{ y: titleY }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.45em" }}
            transition={{ delay: 0.7, duration: 1.4, ease: "easeOut" }}
            className="mb-6 font-mono text-[11px] uppercase text-gold"
          >
            {site.name} · Photographer
          </motion.p>

          <h1 className="max-w-5xl font-serif text-[13vw] font-light leading-[0.95] tracking-tight text-warmwhite sm:text-[9vw] lg:text-[7.5vw]">
            {words.map((w, i) => (
              <HeadlineWord key={i} word={w} i={i} />
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease: easeOut }}
            className="mt-8 max-w-xl font-sans text-sm font-light leading-relaxed text-cream/75 sm:text-base"
          >
            {site.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1, ease: easeOut }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <ShutterLink
              href="/booking"
              className="group relative overflow-hidden rounded-full bg-cream px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-transform duration-500 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="relative z-10">Book a Session</span>
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 group-hover:translate-x-0" />
            </ShutterLink>
            <ShutterLink
              href="/gallery"
              className="rounded-full border border-cream/30 px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-colors duration-500 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Explore Gallery
            </ShutterLink>
          </motion.div>
        </motion.div>

        {/* bottom info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1.2 }}
          className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-6 sm:px-8"
        >
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50 md:block">
            {site.specialties.join(" · ")}
          </p>
          <div className="mx-auto flex flex-col items-center gap-2 md:mx-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-cream/50">
              Scroll
            </span>
            <motion.span
              animate={reduced ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="block h-8 w-px bg-gradient-to-b from-gold to-transparent"
            />
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50 md:block">
            {site.travel.toUpperCase()}
          </p>
        </motion.div>
      </section>

      {/* ————————— MANIFESTO ————————— */}
      <section className="relative px-6 py-28 sm:px-10 sm:py-40" aria-label="Philosophy">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
              01 — The Approach
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-8 font-serif text-4xl font-light leading-[1.15] text-warmwhite sm:text-6xl lg:text-7xl">
              Photography, to me, isn&rsquo;t about perfect poses.{" "}
              <em className="text-gold">It&rsquo;s about the moments that happen between them.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              { n: "Light", d: "Chasing the honest kind — window light, last light, the light people carry in a room." },
              { n: "Emotion", d: "The half-second before the laugh. The exhale after the vow. That's the photograph." },
              { n: "Composition", d: "Frames built like sentences — deliberate, quiet, and impossible to unread." },
            ].map((item) => (
              <div key={item.n} className="border-t border-white/10 pt-6">
                <h3 className="font-serif text-2xl text-cream">{item.n}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-smoke">
                  {item.d}
                </p>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ————————— SELECTED WORKS ————————— */}
      <section className="px-4 pb-28 sm:px-8 sm:pb-40" aria-label="Selected works">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between px-2">
            <FadeIn>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                02 — Selected Works
              </p>
              <h2 className="mt-4 font-serif text-4xl font-light text-warmwhite sm:text-5xl">
                Recent frames
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <ShutterLink
                href="/gallery"
                className="hidden items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-gold sm:flex"
              >
                Full gallery <span aria-hidden>→</span>
              </ShutterLink>
            </FadeIn>
          </div>

          {/* asymmetrical editorial grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12">
            {featuredPhotos.map((photo, i) => {
              const spans = [
                "col-span-2 lg:col-span-5 aspect-[4/5]",
                "col-span-1 lg:col-span-7 aspect-[4/5] lg:aspect-[16/10] lg:mt-24",
                "col-span-1 lg:col-span-4 aspect-[4/5] lg:-mt-10",
                "col-span-2 lg:col-span-5 aspect-[16/11] lg:mt-16",
                "col-span-2 lg:col-span-3 aspect-[4/5]",
              ];
              return (
                <FadeIn key={photo.id} delay={i * 0.06} className={spans[i]}>
                  <ShutterLink
                    href="/gallery"
                    className="reticle group relative block h-full w-full overflow-hidden bg-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    ariaLabel={`${photo.title} — view in gallery`}
                  >
                    <Reticle />
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className="object-cover transition-[transform,filter] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:brightness-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-serif text-xl text-warmwhite">{photo.title}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                        {photo.category} · {photo.meta}
                      </p>
                    </div>
                  </ShutterLink>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————————— PARALLAX QUOTE ————————— */}
      <section ref={quoteRef} className="relative h-[80svh] overflow-hidden" aria-label="Quote">
        <motion.div className="absolute inset-[-14%_0]" style={{ y: quoteImgY }}>
          <Image
            src={photos.find((p) => p.id === "w3")!.src}
            alt={photos.find((p) => p.id === "w3")!.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-ink/65" />
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <FadeIn className="max-w-4xl text-center">
            <p className="font-serif text-3xl font-light italic leading-snug text-warmwhite sm:text-5xl">
              &ldquo;Light writes the story. I&rsquo;m just the one holding the pen
              steady.&rdquo;
            </p>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.4em] text-gold">
              — {site.name}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ————————— CLOSING CTA ————————— */}
      <section className="px-6 py-28 text-center sm:py-40" aria-label="Book a session">
        <FadeIn>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            03 — Begin
          </p>
          <h2 className="mx-auto mt-8 max-w-3xl font-serif text-5xl font-light leading-[1.05] text-warmwhite sm:text-7xl">
            Your story. <em className="text-gold">My perspective.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-smoke">
            Sessions open for {new Date().getFullYear()} — weddings, portraits, and
            editorial commissions. {site.travel.toLowerCase()}.
          </p>
          <div className="mt-10">
            <ShutterLink
              href="/booking"
              className="inline-block rounded-full bg-cream px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-all duration-500 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Book a Session
            </ShutterLink>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
