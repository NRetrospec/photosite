"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FadeIn, Reticle } from "@/components/FadeIn";
import { ShutterLink } from "@/components/shutter/ShutterLink";
import { site } from "@/lib/site";
import { portraitOfPhotographer, photos } from "@/lib/photos";

function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    const start = performance.now();
    const dur = 1600;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return (
    <div className="border-t border-white/10 pt-5">
      <span ref={ref} className="font-serif text-5xl font-light text-warmwhite sm:text-6xl">
        {n.toLocaleString()}
        <span className="text-gold">{suffix}</span>
      </span>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">{label}</p>
    </div>
  );
}

const milestones = [
  { year: "2012", text: "Picked up a camera for the first time and started learning the craft." },
  { year: "2015", text: "Opened the studio and took on a first full season of client work." },
  { year: "2019", text: "First editorial commission and features in print publications." },
  { year: "2022", text: "Expanded into travel and destination sessions." },
  { year: "Now", text: "Still chasing the light — and the seconds between the poses." },
];

export function AboutView() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const years = new Date().getFullYear() - site.since;

  return (
    <div className="min-h-screen bg-ink pb-24">
      {/* hero split */}
      <section ref={heroRef} className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-2">
        <div className="relative order-2 min-h-[60svh] overflow-hidden lg:order-1 lg:min-h-full">
          <motion.div className="absolute inset-[-8%_0]" style={{ y: portraitY }}>
            <Image
              src={portraitOfPhotographer.src}
              alt={portraitOfPhotographer.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/30 lg:bg-gradient-to-r lg:from-transparent lg:to-ink/40" />
          <p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.35em] text-cream/60">
            <span className="rec-dot mr-2 inline-block h-[7px] w-[7px] rounded-full bg-gold align-middle" />
            Self portrait · {site.location}
          </p>
        </div>

        <div className="order-1 flex flex-col justify-center px-6 pb-10 pt-32 sm:px-12 lg:order-2 lg:px-16 lg:pt-24">
          <FadeIn>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
              The Person Behind The Lens
            </p>
            <h1 className="mt-6 font-serif text-5xl font-light leading-[1.02] text-warmwhite sm:text-7xl">
              I&rsquo;m {site.name.split(" ")[0]}.
              <br />
              <em className="text-gold">I collect light.</em>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-8 max-w-lg font-sans text-sm font-light leading-relaxed text-cream/80 sm:text-base">
              For {years} years I&rsquo;ve photographed weddings, portraits, and
              everything in between, working with couples, families, and
              brands alike. My work lives where documentary honesty meets
              editorial craft.
            </p>
            <p className="mt-5 max-w-lg font-sans text-sm font-light leading-relaxed text-smoke">
              Based in {site.location} · {site.travel.toLowerCase()} ·{" "}
              {site.specialties.join(", ").toLowerCase()}.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-10">
              <ShutterLink
                href="/booking"
                className="inline-block rounded-full border border-cream/30 px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-colors duration-500 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                Work With Me
              </ShutterLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* philosophy */}
      <section className="px-6 py-24 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn>
            <p className="font-serif text-3xl font-light italic leading-snug text-warmwhite sm:text-5xl">
              &ldquo;Photography, to me, isn&rsquo;t about perfect poses. It&rsquo;s
              about capturing the moments that happen{" "}
              <span className="text-gold">between them</span>.&rdquo;
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl font-sans text-sm font-light leading-relaxed text-smoke">
              My approach is simple: I stay quiet, I stay close, and I wait. The
              best photographs are never taken — they&rsquo;re given, in half-seconds
              of unguarded truth. I shoot digital for precision and film for
              patience, and I treat every gallery like something worth keeping.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* counters */}
      <section className="px-6 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4">
          <Counter value={years} suffix="+" label="Years photographing" />
          <Counter value={640} suffix="+" label="Sessions & weddings" />
          <Counter value={27} label="Countries photographed" />
          <Counter value={12} label="Publications & features" />
        </div>
      </section>

      {/* timeline */}
      <section className="px-6 py-24 sm:px-10 sm:py-36">
        <div className="mx-auto max-w-6xl gap-16 lg:grid lg:grid-cols-[1fr_1.1fr]">
          <div>
            <FadeIn>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
                Milestones
              </p>
              <h2 className="mt-5 font-serif text-4xl font-light text-warmwhite sm:text-5xl">
                A short exposure history
              </h2>
            </FadeIn>
            <div className="mt-12 space-y-0">
              {milestones.map((m, i) => (
                <FadeIn key={m.year} delay={i * 0.05}>
                  <div className="flex gap-8 border-t border-white/10 py-6">
                    <span className="w-16 shrink-0 font-mono text-xs tracking-[0.2em] text-gold">
                      {m.year}
                    </span>
                    <p className="font-sans text-sm font-light leading-relaxed text-cream/80">
                      {m.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 lg:mt-0">
            {["t2", "p4", "l1", "c1"].map((id, i) => {
              const p = photos.find((ph) => ph.id === id)!;
              return (
                <FadeIn
                  key={id}
                  delay={i * 0.08}
                  className={`reticle relative overflow-hidden bg-charcoal ${
                    i % 2 === 1 ? "mt-10" : ""
                  } aspect-[3/4]`}
                >
                  <Reticle />
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.05]"
                  />
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 text-center">
        <FadeIn>
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-light leading-[1.1] text-warmwhite sm:text-6xl">
            Let&rsquo;s make something <em className="text-gold">worth remembering.</em>
          </h2>
          <div className="mt-10">
            <ShutterLink
              href="/booking"
              className="inline-block rounded-full bg-cream px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-500 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Book a Session
            </ShutterLink>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
