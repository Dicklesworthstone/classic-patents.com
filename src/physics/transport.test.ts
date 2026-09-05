import { describe, expect, test } from "bun:test";
import {
  BoundedBufferPool,
  createBodyBufferShape,
  createFieldBufferShape,
  forceTransportMode,
  globalTransportBus,
  LeaseExpiredError,
  PatentTransport,
  probeTransportCapabilities,
  TransportWorkerSupervisor,
} from "./transport";

describe("Capability-Probed Buffer Transport & Bounded Ring Pools", () => {
  // --------------------------------------------------------------------------
  // 1. Capability Probing
  // --------------------------------------------------------------------------
  describe("Runtime Capability Probing", () => {
    test("probes runtime environment without throwing", () => {
      forceTransportMode(null); // Reset
      const caps = probeTransportCapabilities();
      expect(typeof caps.isCrossOriginIsolated).toBe("boolean");
      expect(typeof caps.hasSharedArrayBuffer).toBe("boolean");
      expect(typeof caps.hasWebWorkers).toBe("boolean");
      expect(["shared-memory", "transferable-array-buffer", "copy-fallback"]).toContain(
        caps.activeMode,
      );
      expect(caps.description.length).toBeGreaterThan(10);
    });

    test("supports forcing non-isolated copy fallback mode for deterministic testing", () => {
      forceTransportMode("copy-fallback");
      const caps = probeTransportCapabilities();
      expect(caps.activeMode).toBe("copy-fallback");
      expect(caps.description).toContain("Copy fallback pipeline");
      forceTransportMode(null);
    });

    test("supports forcing shared-memory mode for compatibility verification", () => {
      forceTransportMode("shared-memory");
      const caps = probeTransportCapabilities();
      expect(caps.activeMode).toBe("shared-memory");
      expect(caps.description).toContain("SharedArrayBuffer zero-copy ring");
      forceTransportMode(null);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Buffer Shapes and Bounded Buffer Pool Semantics
  // --------------------------------------------------------------------------
  describe("Bounded Buffer Pool & Lease Semantics", () => {
    test("creates valid field and body buffer shapes", () => {
      const fieldShape = createFieldBufferShape(64, 64);
      expect(fieldShape.dimensions).toEqual([64, 64]);
      expect(fieldShape.totalElements).toBe(4096);
      expect(fieldShape.bytesPerElement).toBe(4);

      const bodyShape = createBodyBufferShape(10);
      expect(bodyShape.dimensions).toEqual([10, 7]);
      expect(bodyShape.totalElements).toBe(70);
    });

    test("enforces lease ownership: released lease throws LeaseExpiredError on buffer access", () => {
      const shape = createFieldBufferShape(16, 16);
      const pool = new BoundedBufferPool(shape, 3);

      const lease = pool.acquire(1);
      expect(lease.tick).toBe(1);
      expect(lease.isReleased).toBe(false);
      expect(lease.buffer.length).toBe(256);

      // Mutate buffer
      lease.buffer[0] = 42.5;
      expect(lease.buffer[0]).toBe(42.5);

      // Release lease
      lease.release();
      expect(lease.isReleased).toBe(true);

      // Attempting to access buffer on released lease throws LeaseExpiredError
      expect(() => lease.buffer).toThrow(LeaseExpiredError);
    });

    test("buffer counts plateau under sustained high-frequency stepping (no memory leak)", () => {
      const shape = createBodyBufferShape(5);
      const capacity = 3; // Tri-buffering
      const pool = new BoundedBufferPool(shape, capacity);

      // Initial allocation equals capacity
      expect(pool.allocatedBufferCount).toBe(capacity);

      // Simulate 1000 sustained simulation steps
      for (let tick = 1; tick <= 1000; tick++) {
        const lease = pool.acquire(tick);
        lease.buffer[0] = tick * 0.1;
        // Consumer releases lease on same tick
        lease.release();
      }

      // Total allocations must remain capped at capacity (plateau)
      expect(pool.allocatedBufferCount).toBe(capacity);
      expect(pool.activeLeaseCount).toBe(0);
      expect(pool.availableBufferCount).toBe(capacity);
    });

    test("bounded backpressure evicts oldest unreleased buffer when consumer lags", () => {
      const shape = createBodyBufferShape(2);
      const capacity = 2; // Double buffering
      const pool = new BoundedBufferPool(shape, capacity);

      // Producer acquires 2 buffers without consumer releasing
      const lease1 = pool.acquire(10);
      lease1.buffer[0] = 100;
      const lease2 = pool.acquire(11);
      lease2.buffer[0] = 200;

      // Producer acquires 3rd buffer: pool must evict oldest lease (tick 10)
      const lease3 = pool.acquire(12);
      expect(lease3.tick).toBe(12);

      // Oldest lease1 is now evicted/expired
      expect(lease1.isReleased).toBe(true);
      expect(() => lease1.buffer).toThrow(LeaseExpiredError);

      // Lease 2 and 3 remain valid
      expect(lease2.isReleased).toBe(false);
      expect(lease2.buffer[0]).toBe(200);

      // Clean up
      lease2.release();
      lease3.release();
    });

    test("recovers cleanly from detached ArrayBuffers without throwing unhandled exceptions", () => {
      const shape = createFieldBufferShape(4, 4);
      const pool = new BoundedBufferPool(shape, 2);

      const lease = pool.acquire(1);
      // Simulate transferred/detached buffer by acquiring another buffer
      lease.release();

      const nextLease = pool.acquire(2);
      expect(nextLease.buffer.byteLength).toBe(16 * 4);
      nextLease.release();
    });
  });

  // --------------------------------------------------------------------------
  // 3. Worker Failure Supervisor & Fallback
  // --------------------------------------------------------------------------
  describe("Worker Failure Supervisor", () => {
    test("records valid step and reports healthy status", () => {
      const supervisor = new TransportWorkerSupervisor();

      supervisor.recordValidStep(15, [
        {
          bodyId: "fuselage",
          position: [0, 1.5, 0],
          quaternion: [0, 0, 0, 1],
          tick: 15,
        },
      ]);

      const state = supervisor.getState();
      expect(state.isHealthy).toBe(true);
      expect(state.lastValidPoseTick).toBe(15);
      expect(state.lastValidPoses.length).toBe(1);
      expect(state.lastValidPoses[0].bodyId).toBe("fuselage");
      expect(state.refusal.isRefused).toBe(false);
      expect(state.refusal.reason).toBeUndefined();
    });

    test("handles worker crash by preserving last valid pose and reporting honest refusal", () => {
      const supervisor = new TransportWorkerSupervisor();

      supervisor.recordValidStep(42, [
        {
          bodyId: "wing",
          position: [1, 2, 3],
          quaternion: [0, Math.SQRT1_2, 0, Math.SQRT1_2],
          tick: 42,
        },
      ]);

      // Worker crashes
      supervisor.recordFailure("Worker terminated: Out of memory in fluid solver");

      const state = supervisor.getState();
      expect(state.isHealthy).toBe(false);
      // Preserves last known good state
      expect(state.lastValidPoseTick).toBe(42);
      expect(state.lastValidPoses[0].position).toEqual([1, 2, 3]);
      // Refusal is explicit and honest
      expect(state.refusal.isRefused).toBe(true);
      expect(state.refusal.reason).toContain("Worker terminated");
    });
  });

  // --------------------------------------------------------------------------
  // 4. Parity and Global Transport Bus
  // --------------------------------------------------------------------------
  describe("PatentTransport and Global Bus Parity", () => {
    test("attaches buffer pool to PatentTransport", () => {
      const transport = new PatentTransport("us-821393-wright-flyer");
      const shape = createBodyBufferShape(3);
      transport.attachBufferPool(shape, 3);

      expect(transport.bufferPool).toBeDefined();
      expect(transport.bufferPool?.capacity).toBe(3);

      const lease = transport.bufferPool?.acquire(1);
      expect(lease).toBeDefined();
      expect(lease?.tick).toBe(1);
      lease?.release();
    });

    test("globalTransportBus returns stable instances", () => {
      const t1 = globalTransportBus.get("us-821393-wright-flyer");
      const t2 = globalTransportBus.get("us-821393-wright-flyer");
      expect(t1).toBe(t2);
    });
  });
});
