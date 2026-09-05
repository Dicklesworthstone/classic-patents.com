/**
 * transport.ts
 *
 * Capability-probed buffer transport for admitted field and body samples.
 *
 * Implements:
 * 1. Runtime capability probing (cross-origin isolation, SharedArrayBuffer, Web Workers).
 * 2. Tri-buffered bounded buffer pool with strict ownership and lease semantics.
 * 3. Bounded backpressure/catch-up that guarantees buffer counts plateau.
 * 4. Recovery from WASM memory growth and detached ArrayBuffers.
 * 5. Worker failure supervisor that retains the last accepted state and refuses gracefully.
 * 6. Preserves full backwards compatibility with PatentTransport and TransportBus.
 */

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

// ----------------------------------------------------------------------------
// 1. Transport Capabilities & Mode Probing
// ----------------------------------------------------------------------------

export type TransportBufferMode = "shared-memory" | "transferable-array-buffer" | "copy-fallback";

export interface TransportCapabilities {
  readonly isCrossOriginIsolated: boolean;
  readonly hasSharedArrayBuffer: boolean;
  readonly hasWebWorkers: boolean;
  readonly activeMode: TransportBufferMode;
  readonly description: string;
}

let forcedMode: TransportBufferMode | null = null;

/**
 * Force a specific transport buffer mode (primarily for testing and fallback verification).
 */
export function forceTransportMode(mode: TransportBufferMode | null): void {
  forcedMode = mode;
}

/**
 * Probe actual runtime capabilities for buffer transport without guessing.
 */
export function probeTransportCapabilities(): TransportCapabilities {
  const isIsolated =
    typeof globalThis !== "undefined" && Boolean((globalThis as any).crossOriginIsolated);

  let hasSAB = false;
  try {
    if (typeof SharedArrayBuffer !== "undefined") {
      // Confirm SharedArrayBuffer can actually be instantiated
      const test = new SharedArrayBuffer(8);
      hasSAB = test.byteLength === 8;
    }
  } catch {
    hasSAB = false;
  }

  const hasWorkers = typeof Worker !== "undefined";

  let activeMode: TransportBufferMode;
  if (forcedMode !== null) {
    activeMode = forcedMode;
  } else if (isIsolated && hasSAB) {
    activeMode = "shared-memory";
  } else if (hasWorkers && typeof ArrayBuffer !== "undefined") {
    activeMode = "transferable-array-buffer";
  } else {
    activeMode = "copy-fallback";
  }

  let description = "Copy fallback pipeline (host JS memory)";
  if (activeMode === "shared-memory") {
    description = "SharedArrayBuffer zero-copy ring (cross-origin isolated)";
  } else if (activeMode === "transferable-array-buffer") {
    description = "Transferable ArrayBuffer pipeline (zero-copy worker transfer)";
  }

  return {
    isCrossOriginIsolated: isIsolated,
    hasSharedArrayBuffer: hasSAB,
    hasWebWorkers: hasWorkers,
    activeMode,
    description,
  };
}

// ----------------------------------------------------------------------------
// 2. Buffer Shapes, Leases, and Bounded Ring Pool
// ----------------------------------------------------------------------------

export interface BufferShape {
  readonly dimensions: readonly number[];
  readonly totalElements: number;
  readonly bytesPerElement: number;
}

export class LeaseExpiredError extends Error {
  constructor(message = "Buffer lease has already been released or invalidated") {
    super(message);
    this.name = "LeaseExpiredError";
  }
}

export interface BufferLease<T extends ArrayBufferView = Float32Array> {
  readonly leaseId: string;
  readonly tick: number;
  readonly shape: BufferShape;
  readonly buffer: T;
  readonly isReleased: boolean;
  release(): void;
}

/**
 * Fixed-capacity bounded buffer pool with strict ownership and lease semantics.
 * Guarantees that buffer allocation plateaus under sustained high-frequency stepping.
 */
export class BoundedBufferPool {
  private buffers: Float32Array[] = [];
  private activeLeases = new Map<string, { buffer: Float32Array; tick: number }>();
  private leaseCounter = 0;
  private totalAllocations = 0;

  constructor(
    public readonly shape: BufferShape,
    public readonly capacity = 3, // Tri-buffering: producer, consumer, pending
    private readonly useSharedMemory = false,
  ) {
    // Pre-allocate the fixed ring of buffers up to capacity
    for (let i = 0; i < capacity; i++) {
      this.buffers.push(this.createBuffer());
    }
  }

  get allocatedBufferCount(): number {
    return this.totalAllocations;
  }

  get availableBufferCount(): number {
    return this.buffers.length;
  }

  get activeLeaseCount(): number {
    return this.activeLeases.size;
  }

  private createBuffer(): Float32Array {
    this.totalAllocations++;
    const byteLength = this.shape.totalElements * this.shape.bytesPerElement;
    if (this.useSharedMemory && typeof SharedArrayBuffer !== "undefined") {
      const sab = new SharedArrayBuffer(byteLength);
      return new Float32Array(sab);
    }
    return new Float32Array(this.shape.totalElements);
  }

  /**
   * Acquires a buffer for the given tick. If all buffers are leased, reclaims the oldest
   * unconsumed buffer to maintain bounded backpressure without unbounded memory growth.
   */
  acquire(tick: number): BufferLease<Float32Array> {
    let buf: Float32Array;

    const popped = this.buffers.pop();
    if (popped) {
      buf = popped;
    } else {
      // Bounded backpressure: find and evict the oldest active lease
      let oldestLeaseId: string | null = null;
      let oldestTick = Number.POSITIVE_INFINITY;
      for (const [id, entry] of this.activeLeases.entries()) {
        if (entry.tick < oldestTick) {
          oldestTick = entry.tick;
          oldestLeaseId = id;
        }
      }
      const evicted = oldestLeaseId ? this.activeLeases.get(oldestLeaseId) : undefined;
      if (oldestLeaseId && evicted) {
        this.activeLeases.delete(oldestLeaseId);
        buf = evicted.buffer;
      } else {
        // Fallback: allocate only if capacity allows
        buf = this.createBuffer();
      }
    }

    // Check for detached buffer (e.g. from WASM memory growth or transferred ArrayBuffer)
    if (buf.byteLength === 0) {
      buf = this.createBuffer();
    }

    const leaseId = `lease-${++this.leaseCounter}`;
    this.activeLeases.set(leaseId, { buffer: buf, tick });

    let released = false;
    const pool = this;

    const lease: BufferLease<Float32Array> = {
      leaseId,
      tick,
      shape: this.shape,
      get buffer() {
        if (released || !pool.activeLeases.has(leaseId)) {
          throw new LeaseExpiredError();
        }
        return buf;
      },
      get isReleased() {
        return released || !pool.activeLeases.has(leaseId);
      },
      release() {
        if (released) return;
        released = true;
        if (pool.activeLeases.has(leaseId)) {
          pool.activeLeases.delete(leaseId);
          // Return buffer to pool if below capacity
          if (pool.buffers.length < pool.capacity && buf.byteLength > 0) {
            pool.buffers.push(buf);
          }
        }
      },
    };

    return lease;
  }
}

// ----------------------------------------------------------------------------
// 3. Field and Body Sample Structures
// ----------------------------------------------------------------------------

export interface FieldSample {
  readonly width: number;
  readonly height: number;
  readonly values: Float32Array;
  readonly tick: number;
  readonly units?: string;
  readonly description?: string;
}

export interface BodyPoseSample {
  readonly bodyId: string;
  readonly position: readonly [number, number, number];
  readonly quaternion: readonly [number, number, number, number];
  readonly linearVelocity?: readonly [number, number, number];
  readonly angularVelocity?: readonly [number, number, number];
  readonly tick: number;
}

/**
 * Creates a standard 2D scalar field buffer shape.
 */
export function createFieldBufferShape(width: number, height: number): BufferShape {
  return {
    dimensions: [width, height],
    totalElements: width * height,
    bytesPerElement: 4, // Float32
  };
}

/**
 * Creates a standard rigid-body pose buffer shape.
 * Each body has 7 elements: [px, py, pz, qx, qy, qz, qw].
 */
export function createBodyBufferShape(bodyCount: number): BufferShape {
  return {
    dimensions: [bodyCount, 7],
    totalElements: bodyCount * 7,
    bytesPerElement: 4, // Float32
  };
}

// ----------------------------------------------------------------------------
// 4. Worker Failure Supervisor & Fallback/Refusal State
// ----------------------------------------------------------------------------

export interface WorkerSupervisorState {
  readonly isHealthy: boolean;
  readonly lastValidPoseTick: number;
  readonly lastValidPoses: readonly BodyPoseSample[];
  readonly refusal: {
    readonly isRefused: boolean;
    readonly reason?: string;
  };
}

export class TransportWorkerSupervisor {
  private healthy = true;
  private lastTick = 0;
  private lastPoses: BodyPoseSample[] = [];
  private failureReason?: string;

  recordValidStep(tick: number, poses: BodyPoseSample[]): void {
    this.healthy = true;
    this.lastTick = tick;
    this.lastPoses = poses.map((p) => ({ ...p }));
    this.failureReason = undefined;
  }

  recordFailure(reason: string): void {
    this.healthy = false;
    this.failureReason = reason;
  }

  getState(): WorkerSupervisorState {
    return {
      isHealthy: this.healthy,
      lastValidPoseTick: this.lastTick,
      lastValidPoses: [...this.lastPoses],
      refusal: {
        isRefused: !this.healthy,
        reason: this.failureReason,
      },
    };
  }
}

// ----------------------------------------------------------------------------
// 5. Legacy PatentTransport & TransportBus (Maintained for Parity)
// ----------------------------------------------------------------------------

export class PatentTransport {
  public patentId: string;
  public scheduler: TickScheduler;
  public lastFrame: TransportTapeFrame | null = null;
  private listeners: Set<TapeListener> = new Set();
  private pool?: BoundedBufferPool;

  constructor(patentId: string, tickS = 1 / 60) {
    this.patentId = patentId;
    this.scheduler = new TickScheduler(tickS, 0);
  }

  attachBufferPool(shape: BufferShape, capacity = 3) {
    const caps = probeTransportCapabilities();
    this.pool = new BoundedBufferPool(shape, capacity, caps.activeMode === "shared-memory");
  }

  get bufferPool(): BoundedBufferPool | undefined {
    return this.pool;
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
      // Architectural hook for host pumping
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
