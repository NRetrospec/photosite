"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShutterOverlay } from "./ShutterOverlay";

type Phase = "idle" | "closing" | "closed" | "opening";

interface ShutterContextValue {
  navigate: (href: string) => void;
  phase: Phase;
}

const ShutterContext = createContext<ShutterContextValue>({
  navigate: () => {},
  phase: "idle",
});

export const useShutter = () => useContext(ShutterContext);

const CLOSE_MS = 620;
const DARK_MS = 240;
const OPEN_MS = 700;

export function ShutterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("closed");
  const [focusKey, setFocusKey] = useState(0);
  const pendingHref = useRef<string | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => (reduced.current = e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Initial reveal: open the shutter on first load.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setPhase("opening");
      window.setTimeout(() => setPhase("idle"), OPEN_MS);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When route actually changes while the shutter is closed, open it again.
  useEffect(() => {
    if (pendingHref.current && pathname === pendingHref.current) {
      pendingHref.current = null;
      window.scrollTo(0, 0);
      setFocusKey((k) => k + 1);
      const dark = reduced.current ? 80 : DARK_MS;
      const open = reduced.current ? 300 : OPEN_MS;
      window.setTimeout(() => {
        setPhase("opening");
        window.setTimeout(() => setPhase("idle"), open);
      }, dark);
    }
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      const target = href.split("#")[0] || "/";
      if (target === pathname) {
        // Same page: just a playful half-blink.
        return;
      }
      if (phase !== "idle") return;
      pendingHref.current = target;
      router.prefetch(href);
      setPhase("closing");
      const close = reduced.current ? 240 : CLOSE_MS;
      window.setTimeout(() => {
        setPhase("closed");
        router.push(href);
        // Safety: if the route never resolves (error), reopen after a while.
        window.setTimeout(() => {
          if (pendingHref.current) {
            pendingHref.current = null;
            setPhase("opening");
            window.setTimeout(() => setPhase("idle"), OPEN_MS);
          }
        }, 4000);
      }, close);
    },
    [pathname, phase, router]
  );

  return (
    <ShutterContext.Provider value={{ navigate, phase }}>
      <div
        key={focusKey}
        className={phase === "opening" || phase === "idle" ? "focus-reveal" : ""}
      >
        {children}
      </div>
      <ShutterOverlay phase={phase} />
    </ShutterContext.Provider>
  );
}
