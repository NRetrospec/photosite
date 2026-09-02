"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useShutter } from "./shutter/ShutterProvider";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "HOME" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/about", label: "ABOUT" },
  { href: "/booking", label: "BOOK" },
];

function ApertureMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1="16"
          y1="16"
          x2={16 + 13 * Math.cos(((i * 60 - 90) * Math.PI) / 180 + 0.55)}
          y2={16 + 13 * Math.sin(((i * 60 - 90) * Math.PI) / 180 + 0.55)}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { navigate } = useShutter();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
      {/* Brand */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
        className="group pointer-events-auto flex items-center gap-3 text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold/70"
        aria-label={`${site.name} — home`}
      >
        <ApertureMark className="h-7 w-7 transition-transform duration-700 group-hover:rotate-[60deg]" />
        <span className="hidden font-serif text-lg tracking-wide sm:block">
          {site.name}
        </span>
      </a>

      {/* Floating pill nav */}
      <nav
        aria-label="Primary"
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-black/40 px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-1"
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey) return;
                e.preventDefault();
                navigate(link.href);
              }}
              className={`relative rounded-full px-3 py-2 font-sans text-[11px] font-medium tracking-[0.22em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold/70 sm:px-4 ${
                active ? "text-black" : "text-cream/80 hover:text-cream"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-cream"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
