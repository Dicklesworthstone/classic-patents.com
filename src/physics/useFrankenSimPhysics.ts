"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "./engine";
import { TickScheduler } from "./tickScheduler";
import type { UniversalPatentPhysicsTelemetry } from "./types";

export type Provenance = "WASM" | "TS_FALLBACK" | "HONEST_PLACEHOLDER";

export interface TransportTapeFrame {
  tick: number;
  atMs: number;
  digest: string;
  provenance: Provenance;
  telemetry: UniversalPatentPhysicsTelemetry;
}

type TapeListener = (frame: TransportTapeFrame) => void;
const TRANSPORT_TICK_S = 1 / 60;
const TRANSPORT_TICK_MS = TRANSPORT_TICK_S * 1000;

export type TapeUpdater = (
  prev: UniversalPatentPhysicsTelemetry,
  dt: number,
) => Partial<UniversalPatentPhysicsTelemetry> | null;

function canonicalizeTelemetry(value: unknown): unknown {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value * 1e6) / 1e6 : String(value);
  }
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(canonicalizeTelemetry);
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    if (key === "timestampMs") continue;
    out[key] = canonicalizeTelemetry((value as Record<string, unknown>)[key]);
  }
  return out;
}

/** Stable FNV-1a digest over canonically serialized telemetry (tape verification; wall clock excluded). */
export function telemetryDigest(telemetry: UniversalPatentPhysicsTelemetry): string {
  const json = JSON.stringify(canonicalizeTelemetry(telemetry));
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

class PatentTransport {
  public patentId: string;
  public scheduler: TickScheduler;
  public declaredProvenance?: Provenance;
  public lastFrame: TransportTapeFrame;
  private listeners = new Set<TapeListener>();
  private tickS: number;
  private bus?: TransportBus;

  constructor(
    patentId: string,
    tickS = TRANSPORT_TICK_S,
    initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
  ) {
    this.patentId = patentId;
    this.tickS = tickS;
    // Begin at the first virtual step. Machine uptime and mount timing must not
    // alter the first transport tick or replay digest.
    this.scheduler = new TickScheduler(tickS, tickS, 3);

    this.lastFrame = {
      tick: 0,
      atMs: 0,
      digest: "00000000",
      provenance: "HONEST_PLACEHOLDER",
      telemetry: FrankenSimEngine.createTelemetryEnvelope(patentId, initialTelemetry),
    };
  }

  /** @internal Wired up by TransportBus so subscribe() can re-adopt after an idle eviction. */
  attachBus(bus: TransportBus) {
    this.bus = bus;
  }

  subscribe(listener: TapeListener): () => void {
    // React effects run after paint: a frame can fire between getTransport()
    // (render) and this subscribe, idling the pump out and evicting this
    // instance. Re-insert it, or the face would pump a transport the bus
    // no longer knows about and freeze.
    this.bus?.adopt(this);
    this.listeners.add(listener);
    listener(this.lastFrame);
    return () => {
      this.listeners.delete(listener);
    };
  }
  get hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  pump(nowMs: number, updater: TapeUpdater) {
    let ran = 0;
    this.scheduler.pump(nowMs / 1000, () => {
      ran++;
      const tickNo = this.scheduler.ticksRun + 1;
      const update = updater(this.lastFrame.telemetry, this.tickS);
      if (update) {
        const merged: UniversalPatentPhysicsTelemetry = {
          ...this.lastFrame.telemetry,
          ...update,
          timestampMs: nowMs,
          timeStepDt: this.tickS,
        };
        this.lastFrame = {
          tick: tickNo,
          atMs: nowMs,
          digest: telemetryDigest(merged),
          provenance: this.declaredProvenance ?? "TS_FALLBACK",
          telemetry: merged,
        };
      }
    });

    if (ran > 0 && this.listeners.size > 0) {
      for (const listener of this.listeners) {
        listener(this.lastFrame);
      }
    }
  }

  publishSnapshot(
    nowMs: number,
    update: Partial<UniversalPatentPhysicsTelemetry>,
    provenance: Provenance,
  ) {
    const merged: UniversalPatentPhysicsTelemetry = {
      ...this.lastFrame.telemetry,
      ...update,
      timestampMs: nowMs,
    };
    const digest = telemetryDigest(merged);
    if (digest === this.lastFrame.digest && provenance === this.lastFrame.provenance) return;

    this.lastFrame = {
      tick: this.lastFrame.tick + 1,
      atMs: nowMs,
      digest,
      provenance,
      telemetry: merged,
    };
    for (const listener of this.listeners) listener(this.lastFrame);
  }
}

class TransportBus {
  private transports = new Map<string, PatentTransport>();
  private rafId: number | null = null;
  private updaters = new Map<string, { updater: TapeUpdater; provenance?: Provenance }>();
  private virtualNowMs = 0;

  getTransport(
    patentId: string,
    initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
  ): PatentTransport {
    let t = this.transports.get(patentId);
    if (!t) {
      t = new PatentTransport(patentId, 1 / 60, initialTelemetry);
      t.attachBus(this);
      this.transports.set(patentId, t);
    }
    this.startPump();
    return t;
  }

  /** Re-insert a transport after an idle eviction (see PatentTransport.subscribe). */
  adopt(transport: PatentTransport) {
    if (!this.transports.has(transport.patentId)) {
      this.transports.set(transport.patentId, transport);
    }
    this.startPump();
  }

  registerUpdater(patentId: string, updater: TapeUpdater, provenance?: Provenance) {
    this.updaters.set(patentId, { updater, provenance });
    const existing = this.transports.get(patentId);
    if (existing) existing.declaredProvenance = provenance;
    // The updater may arrive after the pump idled out (effect ordering).
    this.startPump();
  }

  unregisterUpdater(patentId: string) {
    this.updaters.delete(patentId);
  }

  publishSnapshot(
    patentId: string,
    update: Partial<UniversalPatentPhysicsTelemetry>,
    provenance: Provenance = "TS_FALLBACK",
  ): boolean {
    if (this.updaters.has(patentId)) return false;
    const transport = this.getTransport(patentId, update);
    transport.declaredProvenance = provenance;
    const virtualAtMs = transport.lastFrame.atMs + TRANSPORT_TICK_MS;
    this.virtualNowMs = Math.max(this.virtualNowMs, virtualAtMs);
    transport.publishSnapshot(virtualAtMs, update, provenance);
    return true;
  }

  private startPump() {
    if (this.rafId !== null) return;
    if (typeof window === "undefined") return;

    const loop = () => {
      let pumpedAny = false;
      const virtualNowMs = this.virtualNowMs + TRANSPORT_TICK_MS;
      for (const [patentId, transport] of this.transports) {
        // A transport with no subscribers or no registered updater cannot
        // emit a frame; pumping it would burn rAF iterations for nothing
        // (e.g. patent pages left behind after client-side navigation).
        if (!transport.hasListeners) continue;
        const entry = this.updaters.get(patentId);
        if (!entry) continue;
        transport.declaredProvenance = entry.provenance;
        transport.pump(virtualNowMs, entry.updater);
        pumpedAny = true;
      }
      if (!pumpedAny) {
        // Idle out: stop the rAF chain entirely and drop transports nobody
        // subscribes to, so memory stays bounded across navigation. A later
        // getTransport()/registerUpdater() restarts the loop on demand.
        this.rafId = null;
        for (const [patentId, transport] of this.transports) {
          if (!transport.hasListeners) this.transports.delete(patentId);
        }
        return;
      }
      this.virtualNowMs = virtualNowMs;
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}

export const globalTransportBus = new TransportBus();

export function useFrankenSimPhysics(
  patentId: string,
  initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
) {
  const transport = globalTransportBus.getTransport(patentId, initialTelemetry);
  const [frame, setFrame] = useState<TransportTapeFrame>(transport.lastFrame);

  const telemetryRef = useRef(frame.telemetry);
  useLayoutEffect(() => {
    telemetryRef.current = frame.telemetry;
  });

  useLayoutEffect(() => {
    globalTransportBus.publishSnapshot(patentId, initialTelemetry, "TS_FALLBACK");
  }, [initialTelemetry, patentId]);

  useEffect(() => {
    return transport.subscribe((newFrame) => {
      setFrame(newFrame);
    });
  }, [transport]);

  const updateTelemetry = useCallback(
    (
      updater: (prev: UniversalPatentPhysicsTelemetry) => Partial<UniversalPatentPhysicsTelemetry>,
    ) => {
      const atMs = transport.lastFrame.atMs + TRANSPORT_TICK_MS;
      const telemetry: UniversalPatentPhysicsTelemetry = {
        ...transport.lastFrame.telemetry,
        ...updater(transport.lastFrame.telemetry),
        timestampMs: atMs,
      };
      transport.lastFrame = {
        ...transport.lastFrame,
        tick: transport.lastFrame.tick + 1,
        atMs,
        digest: telemetryDigest(telemetry),
        telemetry,
      };
      setFrame(transport.lastFrame);
    },
    [transport],
  );

  return {
    telemetry: frame.telemetry,
    telemetryRef,
    frame,
    updateTelemetry,
  };
}
