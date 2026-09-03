"use client";

import { useSyncExternalStore } from "react";
import {
  ensureGenericWasm,
  type GenericKernelSource,
  genericKernelSource,
  subscribeGenericKernelSource,
} from "./genericWasm";

const SERVER_GENERIC_WASM_SOURCE: GenericKernelSource = "unloaded";

function subscribeToGenericWasmSource(onStoreChange: () => void): () => void {
  const unsubscribe = subscribeGenericKernelSource(onStoreChange);
  void ensureGenericWasm();
  return unsubscribe;
}

function getServerGenericWasmSource(): GenericKernelSource {
  return SERVER_GENERIC_WASM_SOURCE;
}

/**
 * Subscribe status badges to the shared generic FrankenSim loader.
 *
 * The server snapshot deliberately remains `unloaded`: no browser-only loader
 * runs during SSR, while a client-side mount reads the actual shared source so
 * a warm cache does not flash a stale fallback badge.
 */
export function useGenericWasmSource(): GenericKernelSource {
  return useSyncExternalStore(
    subscribeToGenericWasmSource,
    genericKernelSource,
    getServerGenericWasmSource,
  );
}
