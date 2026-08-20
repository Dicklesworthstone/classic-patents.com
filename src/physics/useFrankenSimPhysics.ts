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

class PatentTransport {
  public patentId: string;
  public scheduler: TickScheduler;
  public lastFrame: TransportTapeFrame;
  private listeners = new Set<TapeListener>();
  private tickS: number;

  constructor(
    patentId: string,
    tickS = 1 / 60,
    initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
  ) {
    this.patentId = patentId;
    this.tickS = tickS;
    const nowS = typeof performance !== "undefined" ? performance.now() / 1000 : 0;
    this.scheduler = new TickScheduler(tickS, nowS, 3);

    // Create initial envelope
    this.lastFrame = {
      tick: 0,
      atMs: nowS * 1000,
      digest: "00000000",
      provenance: "HONEST_PLACEHOLDER",
      telemetry: FrankenSimEngine.createTelemetryEnvelope(patentId, initialTelemetry),
    };
  }

  subscribe(listener: TapeListener): () => void {
    this.listeners.add(listener);
    listener(this.lastFrame);
    return () => this.listeners.delete(listener);
  }

  pump(nowMs: number, updater: () => Partial<UniversalPatentPhysicsTelemetry> | null) {
    let ran = 0;
    this.scheduler.pump(nowMs / 1000, () => {
      ran++;
      const update = updater();
      if (update) {
        this.lastFrame = {
          ...this.lastFrame,
          tick: this.scheduler.ticksRun,
          atMs: nowMs,
          telemetry: {
            ...this.lastFrame.telemetry,
            ...update,
            timestampMs: nowMs,
            timeStepDt: this.tickS,
          },
        };
      }
    });

    if (ran > 0 && this.listeners.size > 0) {
      for (const listener of this.listeners) {
        listener(this.lastFrame);
      }
    }
  }
}

class TransportBus {
  private transports = new Map<string, PatentTransport>();
  private rafId: number | null = null;
  private updaters = new Map<string, () => Partial<UniversalPatentPhysicsTelemetry> | null>();

  getTransport(
    patentId: string,
    initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {},
  ): PatentTransport {
    let t = this.transports.get(patentId);
    if (!t) {
      t = new PatentTransport(patentId, 1 / 60, initialTelemetry);
      this.transports.set(patentId, t);
    }
    this.startPump();
    return t;
  }

  registerUpdater(
    patentId: string,
    updater: () => Partial<UniversalPatentPhysicsTelemetry> | null,
  ) {
    this.updaters.set(patentId, updater);
  }

  private startPump() {
    if (this.rafId !== null) return;
    if (typeof window === "undefined") return;

    const loop = () => {
      const now = performance.now();
      for (const [patentId, transport] of this.transports) {
        const updater = this.updaters.get(patentId) || (() => null);
        transport.pump(now, updater);
      }
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

  useEffect(() => {
    return transport.subscribe((newFrame) => {
      setFrame(newFrame);
    });
  }, [transport]);

  const updateTelemetry = useCallback(
    (
      updater: (prev: UniversalPatentPhysicsTelemetry) => Partial<UniversalPatentPhysicsTelemetry>,
    ) => {
      transport.lastFrame.telemetry = {
        ...transport.lastFrame.telemetry,
        ...updater(transport.lastFrame.telemetry),
        timestampMs: Date.now(),
      };
      setFrame({ ...transport.lastFrame });
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
