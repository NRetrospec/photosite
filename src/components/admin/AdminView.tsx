"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Booking, BookingStatus } from "@/db/schema";
import { bookingStatuses } from "@/db/schema";

const statusStyles: Record<string, string> = {
  new: "bg-gold/15 text-gold border-gold/40",
  contacted: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  confirmed: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  completed: "bg-white/10 text-cream border-white/25",
  cancelled: "bg-red-400/10 text-red-300 border-red-400/30",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function AdminView() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRows(data.bookings ?? []);
    setAuthed(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Incorrect password.");
      return;
    }
    setPassword("");
    load();
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setRows([]);
  };

  const setStatus = async (id: number, status: BookingStatus) => {
    setRows((r) => r.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const remove = async (id: number) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    setRows((r) => r.filter((b) => b.id !== id));
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
  };

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <span className="h-px w-40 overflow-hidden bg-white/10">
          <span className="exposure-bar block h-full w-full bg-gold" />
        </span>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <div className="w-full max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            Studio Access
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light text-warmwhite">
            The darkroom.
          </h1>
          <form onSubmit={login} className="mt-10 space-y-6">
            <div>
              <label htmlFor="pw" className="field-label">Password</label>
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {loginError && (
              <p role="alert" className="font-sans text-sm text-red-300">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-cream py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold"
            >
              Enter
            </button>
            <p className="text-center font-mono text-[10px] tracking-[0.2em] text-smoke/50">
              default password: aperture
            </p>
          </form>
        </div>
      </div>
    );
  }

  const counts = bookingStatuses.map((s) => ({
    s,
    n: rows.filter((r) => r.status === s).length,
  }));

  return (
    <div className="min-h-screen bg-ink px-4 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
              <span className="rec-dot mr-2 inline-block h-[7px] w-[7px] rounded-full bg-gold align-middle" />
              Studio Admin
            </p>
            <h1 className="mt-3 font-serif text-4xl font-light text-warmwhite sm:text-5xl">
              Booking requests
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={load}
              className="rounded-full border border-white/15 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-smoke transition-colors hover:border-gold hover:text-gold"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="rounded-full border border-white/15 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-smoke transition-colors hover:border-red-400/60 hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {counts.map(({ s, n }) => (
            <span
              key={s}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${statusStyles[s]}`}
            >
              {s} · {n}
            </span>
          ))}
        </div>

        {loading ? (
          <p className="mt-16 font-mono text-xs tracking-[0.3em] text-smoke">DEVELOPING…</p>
        ) : rows.length === 0 ? (
          <div className="mt-20 border-t border-white/10 pt-10 text-center">
            <p className="font-serif text-2xl font-light text-smoke">
              No inquiries yet. The frame is empty — for now.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-3">
            <AnimatePresence initial={false}>
              {rows.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="rounded-xl border border-white/[0.08] bg-coal/80"
                >
                  <button
                    onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                    className="grid w-full grid-cols-2 items-center gap-3 px-5 py-4 text-left sm:grid-cols-[1.4fr_1fr_1fr_auto]"
                    aria-expanded={expanded === b.id}
                  >
                    <div>
                      <p className="font-serif text-lg text-cream">{b.name}</p>
                      <p className="font-mono text-[10px] tracking-[0.15em] text-smoke">
                        {b.email}
                      </p>
                    </div>
                    <p className="font-sans text-xs uppercase tracking-[0.15em] text-smoke">
                      {b.photographyType}
                    </p>
                    <p className="hidden font-mono text-[11px] text-smoke sm:block">
                      {fmtDate(b.preferredDate)}
                    </p>
                    <span
                      className={`justify-self-end rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${statusStyles[b.status] ?? statusStyles.new}`}
                    >
                      {b.status}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded === b.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-6 border-t border-white/[0.06] px-5 py-5 sm:grid-cols-2">
                          <dl className="space-y-2 font-sans text-sm font-light text-cream/85">
                            {[
                              ["Phone", b.phone ?? "—"],
                              ["Preferred date", fmtDate(b.preferredDate)],
                              ["Alternative date", fmtDate(b.alternativeDate)],
                              ["Location", b.location ?? "—"],
                              ["People", b.peopleCount ?? "—"],
                              ["Budget", b.budgetRange ?? "—"],
                              [
                                "Received",
                                new Date(b.createdAt).toLocaleString("en-US", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }),
                              ],
                            ].map(([k, v]) => (
                              <div key={k} className="flex gap-3">
                                <dt className="w-36 shrink-0 font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-smoke">
                                  {k}
                                </dt>
                                <dd>{v}</dd>
                              </div>
                            ))}
                            {b.inspirationUrl && (
                              <div className="flex gap-3">
                                <dt className="w-36 shrink-0 font-mono text-[10px] uppercase leading-5 tracking-[0.2em] text-smoke">
                                  Inspiration
                                </dt>
                                <dd>
                                  <a
                                    href={b.inspirationUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gold underline underline-offset-4"
                                  >
                                    View link
                                  </a>
                                </dd>
                              </div>
                            )}
                          </dl>
                          <div>
                            <p className="field-label">Notes</p>
                            <p className="whitespace-pre-wrap font-sans text-sm font-light leading-relaxed text-cream/80">
                              {b.details || "No additional details provided."}
                            </p>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                              <label htmlFor={`status-${b.id}`} className="field-label !mb-0">
                                Status
                              </label>
                              <select
                                id={`status-${b.id}`}
                                value={b.status}
                                onChange={(e) => setStatus(b.id, e.target.value as BookingStatus)}
                                className="rounded-full border border-white/15 bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-cream focus:border-gold focus:outline-none"
                              >
                                {bookingStatuses.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => remove(b.id)}
                                className="ml-auto rounded-full border border-red-400/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-red-300 transition-colors hover:bg-red-400/10"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
