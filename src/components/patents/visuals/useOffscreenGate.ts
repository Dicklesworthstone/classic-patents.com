"use client";

import { useEffect, useRef } from "react";

/**
 * Offscreen gate for 2D sim tick loops. Attach `rootRef` to the sim's root
 * element; poll `onscreenRef.current` at the top of each rAF/interval tick and
 * early-return while scrolled out of view (200px margin so sims just below the
 * fold keep painting). Hidden tabs are already paused by the browser; this
 * covers the offscreen-but-visible case that rAF does not. Defaults to true
 * until the first IntersectionObserver callback, so above-fold sims never
 * stall on mount.
 */
export function useOffscreenGate<T extends HTMLElement>() {
  const rootRef = useRef<T | null>(null);
  const onscreenRef = useRef(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onscreenRef.current = entry?.isIntersecting ?? true;
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { rootRef, onscreenRef };
}
