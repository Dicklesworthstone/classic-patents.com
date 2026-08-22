/**
 * usePatentPhysics.ts
 *
 * Lightweight cross-component reactive state synchronization for FrankenSim physics parameters.
 * Allows PhysicsTelemetryBadge, 2D vector schematics, and 3D visual modules to share live parameter state with zero overhead.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { canonicalizeParam, expandParamAliases } from "./paramAliases";
import { PATENT_PHYSICS_REGISTRY, type PhysicsMetric } from "./telemetryData";

type Listener = (params: Record<string, number>) => void;
const listenersMap = new Map<string, Set<Listener>>();
const stateMap = new Map<string, Record<string, number>>();
const tickMap = new Map<string, number>();
const changeMap = new Map<string, ParamChange | null>();

export interface ParamChange {
  id: string;
  from: number;
  to: number;
  ratePerSec: number;
  atMs: number;
}

export function getPhysicsTick(patentId: string): number {
  return tickMap.get(patentId) ?? 0;
}

export function getLastParamChange(patentId: string): ParamChange | null {
  return changeMap.get(patentId) ?? null;
}

function bumpTick(patentId: string, change: ParamChange | null) {
  tickMap.set(patentId, (tickMap.get(patentId) ?? 0) + 1);
  changeMap.set(patentId, change);
}

function getRawPatentPhysicsParams(patentId: string): Record<string, number> {
  const existing = stateMap.get(patentId);
  if (existing) return existing;
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  if (!meta) return {};
  const initial: Record<string, number> = {};
  for (const c of meta.controls) {
    initial[c.id] = c.defaultValue;
  }
  stateMap.set(patentId, initial);
  return initial;
}

function publishParams(patentId: string, raw: Record<string, number>) {
  const expanded = expandParamAliases(patentId, raw);
  const listeners = listenersMap.get(patentId);
  if (!listeners) return;
  for (const listener of listeners) {
    listener(expanded);
  }
}

export function getPatentPhysicsParams(patentId: string): Record<string, number> {
  return expandParamAliases(patentId, getRawPatentPhysicsParams(patentId));
}

export function subscribePatentPhysics(patentId: string, listener: Listener): () => void {
  let set = listenersMap.get(patentId);
  if (!set) {
    set = new Set();
    listenersMap.set(patentId, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
  };
}

export function setPatentPhysicsParam(patentId: string, paramId: string, value: number) {
  const canonical = canonicalizeParam(patentId, paramId, value);
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  const current = getRawPatentPhysicsParams(patentId);
  paramId = canonical.id;
  value = canonical.value;
  let updated = { ...current, [paramId]: value };
  if (meta?.enforceConstraints) {
    updated = meta.enforceConstraints(updated, paramId, value);
  }

  // Report what was actually committed. Constraints may clamp or couple the
  // touched parameter, so the tick must carry the stored value rather than
  // the pre-constraint input, and a first touch on a missing key reports
  // zero rate instead of a spike from an out-of-range raw input.
  const from = current[paramId] ?? updated[paramId];
  const to = updated[paramId];
  const now =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  const prev = changeMap.get(patentId);
  const dtSec = prev ? Math.max(0.016, (now - prev.atMs) / 1000) : 0.05;
  bumpTick(patentId, {
    id: paramId,
    from,
    to,
    ratePerSec: (to - from) / dtSec,
    atMs: now,
  });

  stateMap.set(patentId, updated);
  publishParams(patentId, updated);
}

export function resetPatentPhysicsParams(patentId: string) {
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  if (!meta) return;
  const initial: Record<string, number> = {};
  for (const c of meta.controls) {
    initial[c.id] = c.defaultValue;
  }
  stateMap.set(patentId, initial);
  bumpTick(patentId, null);
  publishParams(patentId, initial);
}

export function usePatentPhysics(patentId: string) {
  const [params, setParams] = useState<Record<string, number>>(() =>
    getPatentPhysicsParams(patentId),
  );
  const [tick, setTick] = useState(() => getPhysicsTick(patentId));
  const [lastChange, setLastChange] = useState<ParamChange | null>(() =>
    getLastParamChange(patentId),
  );
  const meta = PATENT_PHYSICS_REGISTRY[patentId];

  useEffect(() => {
    setParams(getPatentPhysicsParams(patentId));
    setTick(getPhysicsTick(patentId));
    setLastChange(getLastParamChange(patentId));
    let set = listenersMap.get(patentId);
    if (!set) {
      set = new Set();
      listenersMap.set(patentId, set);
    }
    const listener: Listener = (newParams) => {
      setParams(newParams);
      setTick(getPhysicsTick(patentId));
      setLastChange(getLastParamChange(patentId));
    };
    set.add(listener);
    return () => {
      set?.delete(listener);
    };
  }, [patentId]);

  const metrics: PhysicsMetric[] = useMemo(() => {
    if (!meta) return [];
    return meta.computeMetrics(params);
  }, [meta, params]);

  const updateParam = useCallback(
    (id: string, value: number) => {
      setPatentPhysicsParam(patentId, id, value);
    },
    [patentId],
  );

  const resetParams = useCallback(() => {
    resetPatentPhysicsParams(patentId);
  }, [patentId]);

  return {
    meta,
    params,
    metrics,
    tick,
    lastChange,
    updateParam,
    setParam: updateParam,
    resetParams,
  };
}
