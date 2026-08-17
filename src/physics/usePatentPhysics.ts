/**
 * usePatentPhysics.ts
 *
 * Lightweight cross-component reactive state synchronization for FrankenSim physics parameters.
 * Allows PhysicsTelemetryBadge, 2D vector schematics, and 3D visual modules to share live parameter state with zero overhead.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PATENT_PHYSICS_REGISTRY, type PhysicsMetric } from "./telemetryData";

type Listener = (params: Record<string, number>) => void;
const listenersMap = new Map<string, Set<Listener>>();
const stateMap = new Map<string, Record<string, number>>();

export function getPatentPhysicsParams(patentId: string): Record<string, number> {
  if (stateMap.has(patentId)) {
    return stateMap.get(patentId) ?? {};
  }
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  if (!meta) return {};
  const initial: Record<string, number> = {};
  for (const c of meta.controls) {
    initial[c.id] = c.defaultValue;
  }
  stateMap.set(patentId, initial);
  return initial;
}

export function setPatentPhysicsParam(patentId: string, paramId: string, value: number) {
  const current = getPatentPhysicsParams(patentId);
  const updated = { ...current, [paramId]: value };
  stateMap.set(patentId, updated);
  const listeners = listenersMap.get(patentId);
  if (listeners) {
    for (const listener of listeners) {
      listener(updated);
    }
  }
}

export function resetPatentPhysicsParams(patentId: string) {
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  if (!meta) return;
  const initial: Record<string, number> = {};
  for (const c of meta.controls) {
    initial[c.id] = c.defaultValue;
  }
  stateMap.set(patentId, initial);
  const listeners = listenersMap.get(patentId);
  if (listeners) {
    for (const listener of listeners) {
      listener(initial);
    }
  }
}

export function usePatentPhysics(patentId: string) {
  const [params, setParams] = useState<Record<string, number>>(() =>
    getPatentPhysicsParams(patentId),
  );
  const meta = PATENT_PHYSICS_REGISTRY[patentId];

  useEffect(() => {
    setParams(getPatentPhysicsParams(patentId));
    let set = listenersMap.get(patentId);
    if (!set) {
      set = new Set();
      listenersMap.set(patentId, set);
    }
    const listener: Listener = (newParams) => {
      setParams(newParams);
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
    updateParam,
    setParam: updateParam,
    resetParams,
  };
}
