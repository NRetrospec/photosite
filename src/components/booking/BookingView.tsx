"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { ShutterLink } from "@/components/shutter/ShutterLink";
import { site, bookingTypes, budgetRanges } from "@/lib/site";
import { bookingSideImage } from "@/lib/photos";

const initial = {
  name: "",
  email: "",
  phone: "",
  photographyType: "",
  preferredDate: "",
  alternativeDate: "",
  location: "",
  peopleCount: "",
  budgetRange: "",
  details: "",
  inspirationUrl: "",
};

export function BookingView() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof initial) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink pb-24 pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_420px]">
        <div>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[60vh] flex-col justify-center"
              >
                <motion.svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  fill="none"
                  aria-hidden
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <circle cx="36" cy="36" r="33" stroke="#07593a" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="36" cy="36" r="22" stroke="#07593a" strokeWidth="1" />
                  <path d="M27 36.5l6 6L46 29" stroke="#10151c" strokeWidth="1.6" strokeLinecap="round" />
                </motion.svg>
                <h1 className="mt-10 font-serif text-5xl font-light leading-[1.05] text-warmwhite sm:text-7xl">
                  Your story <em className="text-emerald">starts here.</em>
                </h1>
                <p className="mt-6 max-w-lg font-sans text-sm font-light leading-relaxed text-cream/75 sm:text-base">
                  Thank you, {form.name.split(" ")[0] || "friend"}. Your request is
                  safely in the darkroom. {site.name.split(" ")[0]} will personally
                  review it and reply within 48 hours with availability, pricing,
                  and next steps.
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-smoke">
                  Confirmation sent to {form.email}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <ShutterLink
                    href="/gallery"
                    className="rounded-full border border-cream/30 px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-colors duration-500 hover:border-emerald hover:text-emerald"
                  >
                    Keep Exploring
                  </ShutterLink>
                  <button
                    onClick={() => {
                      setForm(initial);
                      setDone(false);
                    }}
                    className="rounded-full px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-smoke transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald"
                  >
                    New Request
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
              >
                <FadeIn>
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald">
                    Booking Inquiry
                  </p>
                  <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] text-warmwhite sm:text-7xl">
                    Let&rsquo;s frame <em className="text-emerald">your moment.</em>
                  </h1>
                  <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-smoke">
                    Tell me about the day you&rsquo;re dreaming of. I&rsquo;ll reply
                    within 48 hours with availability and a tailored proposal — no
                    obligation, no pressure.
                  </p>
                </FadeIn>

                <form onSubmit={submit} className="mt-12 space-y-9" noValidate>
                  <div className="grid gap-9 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="field-label">Name *</label>
                      <input id="name" required value={form.name} onChange={set("name")} className="field" placeholder="Ava Chen" autoComplete="name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="field-label">Email *</label>
                      <input id="email" type="email" required value={form.email} onChange={set("email")} className="field" placeholder="ava@email.com" autoComplete="email" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="field-label">Phone</label>
                      <input id="phone" type="tel" value={form.phone} onChange={set("phone")} className="field" placeholder="+1 (555) 000-0000" autoComplete="tel" />
                    </div>
                    <div>
                      <label htmlFor="type" className="field-label">Photography Type *</label>
                      <select id="type" required value={form.photographyType} onChange={set("photographyType")} className="field bg-ink">
                        <option value="" disabled>Select a type…</option>
                        {bookingTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="pref" className="field-label">Preferred Date</label>
                      <input id="pref" type="date" value={form.preferredDate} onChange={set("preferredDate")} className="field [color-scheme:dark]" />
                    </div>
                    <div>
                      <label htmlFor="alt" className="field-label">Alternative Date</label>
                      <input id="alt" type="date" value={form.alternativeDate} onChange={set("alternativeDate")} className="field [color-scheme:dark]" />
                    </div>
                    <div>
                      <label htmlFor="loc" className="field-label">Location</label>
                      <input id="loc" value={form.location} onChange={set("location")} className="field" placeholder="Boynton Beach, the coast, anywhere…" />
                    </div>
                    <div>
                      <label htmlFor="people" className="field-label">Estimated People</label>
                      <input id="people" inputMode="numeric" value={form.peopleCount} onChange={set("peopleCount")} className="field" placeholder="e.g. 2, 6, 120" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="budget" className="field-label">Budget Range</label>
                      <select id="budget" value={form.budgetRange} onChange={set("budgetRange")} className="field bg-ink">
                        <option value="">Select a range…</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="details" className="field-label">Additional Details</label>
                      <textarea id="details" rows={5} value={form.details} onChange={set("details")} className="field resize-none" placeholder="The story, the people, the mood you're imagining…" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="insp" className="field-label">Inspiration Link (optional)</label>
                      <input id="insp" type="url" value={form.inspirationUrl} onChange={set("inspirationUrl")} className="field" placeholder="Pinterest board, Instagram post, mood board URL…" />
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="border-l-2 border-red-400/70 pl-4 font-sans text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative overflow-hidden rounded-full bg-cream px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-all duration-500 hover:bg-emerald disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
                    >
                      {submitting ? "Developing…" : "Request Booking"}
                    </button>
                    {submitting && (
                      <span className="h-px w-32 overflow-hidden bg-black/10" aria-hidden>
                        <span className="exposure-bar block h-full w-full bg-emerald" />
                      </span>
                    )}
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-smoke/70">
                      Response within 48h · No obligation
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* side panel */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="reticle relative aspect-[3/4] overflow-hidden bg-charcoal">
              <Image
                src={bookingSideImage.src}
                alt={bookingSideImage.alt}
                fill
                loading="lazy"
                sizes="420px"
                className="object-cover"
              />
              <div className="on-photo absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald">
                  <span className="rec-dot mr-2 inline-block h-[6px] w-[6px] rounded-full bg-emerald align-middle" />
                  Now booking · {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="border-t border-black/10 pt-5">
              <p className="font-serif text-xl text-cream">How it works</p>
              <ol className="mt-4 space-y-3">
                {["You send the inquiry", "I confirm availability & share a proposal", "We plan the session together", "We make photographs worth keeping"].map((s, i) => (
                  <li key={s} className="flex gap-4 font-sans text-sm font-light text-smoke">
                    <span className="font-mono text-[10px] leading-6 tracking-widest text-emerald">
                      0{i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.25em] text-smoke/60">
              {site.email}
              <br />
              {site.phone}
              <br />
              {site.location} · {site.travel}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
