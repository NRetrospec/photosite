"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Phase = "idle" | "closing" | "closed" | "opening";

const BLADES = 8;
const OPEN_DEG = 88;
const CLOSED_DEG = 0;

/**
 * A mechanical camera-shutter overlay.
 * Eight metallic iris blades rotate inward around rim pivots,
 * closing over the screen like a real leaf shutter.
 */
export function ShutterOverlay({ phase }: { phase: Phase }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const active = phase !== "idle";
  const closingOrClosed = phase === "closing" || phase === "closed";

  // Reduced motion: a simple, elegant fade to black instead of blades.
  if (reduced) {
    return (
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[120] bg-[#87ceeb]"
        style={{ pointerEvents: active ? "auto" : "none" }}
        initial={false}
        animate={{ opacity: closingOrClosed ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[120] overflow-hidden"
      style={{
        pointerEvents: active ? "auto" : "none",
        visibility: active ? "visible" : "hidden",
      }}
    >
      {/* 1 — the frame darkens around the edges first */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(135,206,235,0) 30%, rgba(135,206,235,0.72) 72%, rgba(135,206,235,0.96) 100%)",
        }}
        initial={false}
        animate={{ opacity: closingOrClosed ? 1 : 0 }}
        transition={{
          duration: phase === "closing" ? 0.28 : 0.5,
          delay: phase === "opening" ? 0.35 : 0,
          ease: "easeInOut",
        }}
      />

      {/* 2 — the black chamber behind the blades (inside of the camera) */}
      <motion.div
        className="absolute inset-0 bg-[#6fbbdd]"
        initial={false}
        animate={{ opacity: phase === "closed" ? 1 : 0 }}
        transition={{ duration: phase === "closed" ? 0.12 : 0.3 }}
      />

      {/* 3 — the iris blades */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "165vmax",
          height: "165vmax",
          transform: "translate(-50%, -50%)",
        }}
      >
        {Array.from({ length: BLADES }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ transform: `rotate(${i * (360 / BLADES)}deg)` }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              style={{
                transformOrigin: "69.13% 3.81%",
                clipPath: "polygon(50% 50%, 30.87% 3.81%, 69.13% 3.81%)",
                background:
                  "linear-gradient(160deg, #b4e2f4 0%, #87ceeb 34%, #9bd7ee 52%, #6fbbdd 78%, #8fd0ea 100%)",
                boxShadow: "inset 0 0 60px rgba(20,70,100,0.35)",
                filter:
                  "drop-shadow(0 6px 18px rgba(20,70,100,0.35)) drop-shadow(0 0 1px rgba(255,255,255,0.5))",
              }}
              initial={false}
              animate={{
                rotate: closingOrClosed ? CLOSED_DEG : OPEN_DEG,
              }}
              transition={
                phase === "closing"
                  ? {
                      duration: 0.52,
                      delay: i * 0.016,
                      ease: [0.65, 0, 0.35, 1],
                    }
                  : phase === "opening"
                    ? {
                        duration: 0.62,
                        delay: 0.08 + i * 0.014,
                        ease: [0.22, 1, 0.36, 1],
                      }
                    : { duration: 0 }
              }
            >
              {/* metallic edge highlight along the leading edge */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(50% 50%, 30.87% 3.81%, 33.82% 2.58%, 52.96% 48.78%)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(79,191,139,0.06) 60%, rgba(255,255,255,0.02))",
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* 4 — exposure flash at the instant of full closure */}
      {phase === "closed" && (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.22, times: [0, 0.3, 1], ease: "easeOut" }}
        />
      )}

      {/* 5 — quiet mechanical detail while the chamber is dark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: phase === "closed" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-col items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle
              cx="22"
              cy="22"
              r="20"
              stroke="rgba(7,89,58,0.6)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <circle cx="22" cy="22" r="3" fill="rgba(7,89,58,0.8)" />
          </svg>
          <span className="font-mono text-[10px] tracking-[0.4em] text-[#07593a]/80">
            ƒ/1.8 · 1/250
          </span>
        </div>
      </motion.div>
    </div>
  );
}
