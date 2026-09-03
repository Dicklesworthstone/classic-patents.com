"use client";

import { useCallback, useSyncExternalStore } from "react";

export type WasmKernelSource = "wasm" | "ts-fallback" | "unloaded";

type SourceReader = () => WasmKernelSource;
type SourceSubscriber = (onStoreChange: () => void) => () => void;
type SourceLoader = () => Promise<WasmKernelSource>;

const SERVER_WASM_KERNEL_SOURCE: WasmKernelSource = "unloaded";

function getServerWasmKernelSource(): WasmKernelSource {
  return SERVER_WASM_KERNEL_SOURCE;
}

/**
 * Subscribe a status chip to a dedicated FrankenSim browser loader.
 *
 * SSR stays on the truthful `unloaded` snapshot, while client-only mounts read
 * the shared loader's current status so a warm module does not flash fallback.
 */
export function useWasmKernelSource(
  readSource: SourceReader,
  subscribeToSource: SourceSubscriber,
  ensureSource: SourceLoader,
): WasmKernelSource {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const unsubscribe = subscribeToSource(onStoreChange);
      void ensureSource();
      return unsubscribe;
    },
    [ensureSource, subscribeToSource],
  );

  return useSyncExternalStore(subscribe, readSource, getServerWasmKernelSource);
}
