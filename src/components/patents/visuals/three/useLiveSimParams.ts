import { useRef } from "react";

/**
 * Holds the latest simulation parameters for a long-lived Three.js render loop.
 * Reading `.current` inside `requestAnimationFrame` avoids tearing down the
 * WebGL scene on every slider tick.
 */
export function useLiveSimParams<T extends object>(params: T) {
  const ref = useRef(params);
  ref.current = params;
  return ref;
}
