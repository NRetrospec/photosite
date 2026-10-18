"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
  onUnlocked: () => void;
}

export function UploadCodeDialog({ onClose, onUnlocked }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (code.length !== 9 || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/upload/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      onUnlocked();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Enter your access code"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-ink p-8 shadow-2xl sm:p-10"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald">
          Photo upload
        </p>
        <h2 className="mt-4 font-serif text-3xl font-light text-warmwhite">
          Enter your 9-digit code
        </h2>
        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-smoke">
          Once unlocked, you can upload your own photos in place of the ones in
          the gallery.
        </p>

        <label htmlFor="upload-code" className="field-label mt-8">
          Access code
        </label>
        <input
          ref={input}
          id="upload-code"
          inputMode="numeric"
          autoComplete="off"
          pattern="\d{9}"
          maxLength={9}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 9))}
          placeholder="000000000"
          className="field font-mono text-xl tracking-[0.35em]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "upload-code-error" : undefined}
        />
        <p
          id="upload-code-error"
          role="alert"
          className="mt-3 min-h-5 font-sans text-xs text-red-700"
        >
          {error}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={code.length !== 9 || busy}
            className="rounded-full bg-cream px-8 py-3.5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-300 hover:bg-emerald disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-smoke transition-colors hover:text-cream"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
