import { useRef } from "react";

/**
 * Holds the latest simulation parameters for a long-lived Three.js render loop.
 * Assign during render (not in an effect) so the already-running rAF callback
 * sees slider changes on the same frame, not one commit later.
 */
export function useLiveSimParams<T extends object>(params: T) {
  const ref = useRef(params);
  ref.current = params;
  return ref;
}
