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

export type TapeListener = (frame: TransportTapeFrame) => void;

class PatentTransport {
  public patentId: string;
  public scheduler: TickScheduler;
  public lastFrame: TransportTapeFrame | null = null;
  private listeners: Set<TapeListener> = new Set();

  constructor(patentId: string, tickS = 1 / 60) {
    this.patentId = patentId;
    this.scheduler = new TickScheduler(
      tickS,
      typeof performance !== "undefined" ? performance.now() / 1000 : 0,
    );
  }

  subscribe(listener: TapeListener): () => void {
    this.listeners.add(listener);
    if (this.lastFrame) {
      listener(this.lastFrame);
    }
    return () => this.listeners.delete(listener);
  }

  pump(nowMs: number) {
    this.scheduler.pump(nowMs / 1000, () => {
      // In a full implementation, we'd look up the specific step function
      // and compute the telemetry. For now, this is the architectural hook.
    });
  }
}

export class TransportBus {
  private transports = new Map<string, PatentTransport>();

  get(patentId: string): PatentTransport {
    let t = this.transports.get(patentId);
    if (!t) {
      t = new PatentTransport(patentId);
      this.transports.set(patentId, t);
    }
    return t;
  }
}

export const globalTransportBus = new TransportBus();
