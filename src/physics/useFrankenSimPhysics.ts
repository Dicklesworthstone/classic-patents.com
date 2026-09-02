"use client";

import { useCallback, useLayoutEffect, useRef, useSyncExternalStore } from "react";
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
type FrameScheduler = (callback: (nowMs: number) => void) => number;
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

  /** @internal Wired by TransportBus so subscribe() can complete the owner handshake. */
  attachBus(bus: TransportBus) {
    this.bus = bus;
  }

  subscribe(listener: TapeListener): () => void {
    this.listeners.add(listener);
    const frameBeforeAdoption = this.lastFrame;
    // Make the listener visible before adopt() restarts the rAF pump. This
    // closes the mount-time race where the pump could observe zero listeners,
    // idle out, and leave a newly mounted owner frozen until another render.
    this.bus?.adopt(this);
    // adopt() may synchronously admit the first fixed step, which already
    // notifies this listener. Prime it only when adoption left the frame alone.
    if (this.lastFrame === frameBeforeAdoption) listener(this.lastFrame);
    return () => {
      this.listeners.delete(listener);
    };
  }
  get hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  notifyListeners() {
    for (const listener of this.listeners) listener(this.lastFrame);
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
      this.notifyListeners();
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
    this.notifyListeners();
  }
}

export class TransportBus {
  private transports = new Map<string, PatentTransport>();
  private rafId: number | null = null;
  private updaters = new Map<string, { updater: TapeUpdater; provenance?: Provenance }>();
  private virtualNowMs = 0;
  private hostFrameAnchorMs: number | null = null;

  constructor(private readonly frameScheduler?: FrameScheduler) {}

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

  /** Canonicalize a render-time transport and complete its owner handshake. */
  adopt(transport: PatentTransport) {
    const current = this.transports.get(transport.patentId);
    // During hot replacement or an abandoned concurrent render, two objects
    // can briefly share an id. Prefer the transport that actually owns the
    // listener over an unsubscribed replacement so updater and listener do not
    // split across different objects.
    if (!current || (current !== transport && !current.hasListeners)) {
      this.transports.set(transport.patentId, transport);
    }
    this.activateRunnableOwner(transport.patentId, transport);
  }

  registerUpdater(patentId: string, updater: TapeUpdater, provenance?: Provenance) {
    const registration = { updater, provenance };
    this.updaters.set(patentId, registration);
    const existing = this.transports.get(patentId);
    if (existing) existing.declaredProvenance = provenance;
    this.activateRunnableOwner(patentId, existing);
    // React transitions can briefly overlap two owners for one patent. An old
    // effect cleanup must not remove the updater that replaced it.
    return () => {
      if (this.updaters.get(patentId) === registration) {
        this.updaters.delete(patentId);
      }
    };
  }

  /** Promote or demote an updater only after its latest step proves the source. */
  setUpdaterProvenance(patentId: string, provenance: Provenance): boolean {
    const entry = this.updaters.get(patentId);
    if (!entry) return false;
    entry.provenance = provenance;
    const existing = this.transports.get(patentId);
    if (existing) existing.declaredProvenance = provenance;
    return true;
  }

  unregisterUpdater(patentId: string) {
    this.updaters.delete(patentId);
  }

  /** Read-only receipt for route-level owner/lifecycle verification. */
  runtimeReceipt(patentId: string): {
    hasTransport: boolean;
    hasUpdater: boolean;
    hasListeners: boolean;
  } {
    const transport = this.transports.get(patentId);
    return {
      hasTransport: Boolean(transport),
      hasUpdater: this.updaters.has(patentId),
      hasListeners: transport?.hasListeners ?? false,
    };
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

  /**
   * Complete the listener/updater ownership handshake without depending on
   * React effect ordering relative to the first animation frame. The first
   * fixed step is admitted synchronously exactly once; later ownership
   * changes only restart the ordinary rAF pump.
   */
  private activateRunnableOwner(patentId: string, transport?: PatentTransport) {
    if (!transport?.hasListeners) {
      this.startPump();
      return;
    }
    const entry = this.updaters.get(patentId);
    if (!entry) {
      this.startPump();
      return;
    }
    transport.declaredProvenance = entry.provenance;
    if (transport.lastFrame.tick === 0) {
      const virtualNowMs = Math.max(
        this.virtualNowMs + TRANSPORT_TICK_MS,
        transport.lastFrame.atMs + TRANSPORT_TICK_MS,
      );
      transport.pump(virtualNowMs, entry.updater);
      this.virtualNowMs = virtualNowMs;
    }
    this.startPump();
  }

  private startPump() {
    if (this.rafId !== null) return;
    const scheduleFrame =
      this.frameScheduler ??
      (typeof window !== "undefined"
        ? (callback: (nowMs: number) => void) => requestAnimationFrame(callback)
        : undefined);
    if (!scheduleFrame) return;

    const loop = (hostNowMs: number) => {
      let pumpedAny = false;
      const safeHostNowMs = Number.isFinite(hostNowMs) ? hostNowMs : (this.hostFrameAnchorMs ?? 0);
      const elapsedMs =
        this.hostFrameAnchorMs === null ? 0 : Math.max(0, safeHostNowMs - this.hostFrameAnchorMs);
      const virtualNowMs = this.virtualNowMs + elapsedMs;
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
        // Idle out: stop the rAF chain entirely. Keep the small per-patent
        // transport object stable across React's render-to-subscribe window;
        // deleting it here can strand a pending subscription on a different
        // object than the updater. The finite catalogue bounds this map.
        this.rafId = null;
        this.hostFrameAnchorMs = null;
        // registerUpdater()/subscribe() may have arrived re-entrantly while
        // this callback still owned a non-null rafId. Re-check only after
        // clearing it so a newly runnable owner cannot be stranded.
        const runnableOwnerPresent = [...this.transports].some(
          ([patentId, transport]) => transport.hasListeners && this.updaters.has(patentId),
        );
        if (runnableOwnerPresent) this.startPump();
        return;
      }
      this.virtualNowMs = virtualNowMs;
      this.hostFrameAnchorMs = safeHostNowMs;
      this.rafId = scheduleFrame(loop);
    };
    this.rafId = scheduleFrame(loop);
  }
}

export const globalTransportBus = new TransportBus();

export function useFrankenSimPhysics(
  patentId: string,
  initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
) {
  const transport = globalTransportBus.getTransport(patentId, initialTelemetry);
  const subscribe = useCallback(
    (onStoreChange: () => void) => transport.subscribe(() => onStoreChange()),
    [transport],
  );
  const getSnapshot = useCallback(() => transport.lastFrame, [transport]);
  const frame = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const telemetryRef = useRef(frame.telemetry);
  useLayoutEffect(() => {
    telemetryRef.current = frame.telemetry;
  });

  useLayoutEffect(() => {
    globalTransportBus.publishSnapshot(patentId, initialTelemetry, "TS_FALLBACK");
  }, [initialTelemetry, patentId]);

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
      transport.notifyListeners();
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
