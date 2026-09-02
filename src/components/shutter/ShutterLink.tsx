"use client";

import { type ReactNode, type MouseEvent } from "react";
import { useShutter } from "./ShutterProvider";

interface ShutterLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

/** An anchor that triggers the camera-shutter transition before navigating. */
export function ShutterLink({ href, className, children, ariaLabel }: ShutterLinkProps) {
  const { navigate } = useShutter();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
