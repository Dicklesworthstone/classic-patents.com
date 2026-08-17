import { useLayoutEffect, useRef } from "react";

/**
 * Holds the latest simulation parameters for a long-lived Three.js render loop.
 * Sync in useLayoutEffect (before paint) so the rAF callback sees slider
 * changes without mutating a ref during render.
 */
export function useLiveSimParams<T extends object>(params: T) {
  const ref = useRef(params);
  useLayoutEffect(() => {
    ref.current = params;
  });
  return ref;
}
