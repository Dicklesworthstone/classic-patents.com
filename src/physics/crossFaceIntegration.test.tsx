import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { globalTransportBus, useFrankenSimPhysics } from "./useFrankenSimPhysics";

function TestTelemetrySink(props: { patentId: string }) {
  const result = useFrankenSimPhysics(props.patentId, {});
  return <div data-patent={result.telemetry.patentId}>{result.frame.tick}</div>;
}

describe("Cross-Face Integration", () => {
  test("divergence test: two sinks reading from the same patent transport receive identical ticks (tape-bound determinism)", () => {
    // Reset bus for test isolation
    const transport = globalTransportBus.getTransport("us-821393-wright-flyer");
    transport.lastFrame.tick = 42;

    // Sink A
    const htmlA = renderToStaticMarkup(<TestTelemetrySink patentId="us-821393-wright-flyer" />);
    // Sink B
    const htmlB = renderToStaticMarkup(<TestTelemetrySink patentId="us-821393-wright-flyer" />);

    expect(htmlA).toContain(">42<");
    expect(htmlB).toContain(">42<");
    expect(htmlA).toEqual(htmlB); // Proves they do not diverge!
  });

  test("pump publishes frames with stable digest and honest provenance", () => {
    const id = "us-971501-haber-ammonia";
    const transport = globalTransportBus.getTransport(id);
    expect(transport.lastFrame.provenance).toBe("HONEST_PLACEHOLDER");

    globalTransportBus.registerUpdater(id, () => ({ timeStepDt: 1 / 60 }), "TS_FALLBACK");
    const step = () => ({ timeStepDt: 1 / 60 });
    transport.pump(performance.now() + 16, step);
    expect(transport.lastFrame.tick).toBeGreaterThan(0);
    expect(transport.lastFrame.provenance).toBe("TS_FALLBACK");
    const first = transport.lastFrame.digest;
    expect(first).not.toBe("00000000");

    // Identical logical state (wall clock excluded from digest) -> identical tape digest.
    transport.pump(performance.now() + 32, step);
    expect(transport.lastFrame.digest).toBe(first);

    globalTransportBus.unregisterUpdater(id);
  });

  test("declared provenance travels on the frame (WASM vs fallback honesty)", () => {
    const id = "us-879532-de-forest-audion";
    const transport = globalTransportBus.getTransport(id);
    globalTransportBus.registerUpdater(id, () => ({ timeStepDt: 1 / 60 }), "WASM");
    const step = () => ({ timeStepDt: 1 / 60 });
    transport.pump(performance.now() + 16, step);
    expect(transport.lastFrame.provenance).toBe("WASM");
    globalTransportBus.unregisterUpdater(id);
  });

  test("a computed subscriber snapshot replaces the cold-start placeholder honestly", () => {
    const id = "us-test-snapshot-publisher";
    const transport = globalTransportBus.getTransport(id);

    expect(transport.lastFrame.provenance).toBe("HONEST_PLACEHOLDER");
    expect(
      globalTransportBus.publishSnapshot(id, {
        domain: "aerodynamics_mbd",
        refusal: { isRefused: false },
        aero: {
          airspeedMps: 12,
          altitudeMeters: 3,
          angleOfAttackRad: 0,
          sideslipRad: 0,
          pitchRateRps: 0,
          rollRateRps: 0,
          yawRateRps: 0,
          liftNewtons: 400,
          inducedDragNewtons: 20,
          parasiticDragNewtons: 10,
          thrustNewtons: 0,
          elevatorDeflectionDeg: 0,
          rudderDeflectionDeg: 0,
          wingWarpDeflectionDeg: 0,
        },
      }),
    ).toBe(true);
    expect(transport.lastFrame.provenance).toBe("TS_FALLBACK");
    expect(transport.lastFrame.telemetry.aero?.liftNewtons).toBe(400);
    expect(transport.lastFrame.digest).not.toBe("00000000");
  });

  test("a subscriber snapshot cannot overwrite a registered owner", () => {
    const id = "us-test-snapshot-with-owner";
    const transport = globalTransportBus.getTransport(id);
    globalTransportBus.registerUpdater(id, () => ({ timeStepDt: 1 / 60 }), "WASM");

    expect(globalTransportBus.publishSnapshot(id, { timeStepDt: 1 })).toBe(false);
    expect(transport.lastFrame.telemetry.timeStepDt).not.toBe(1);

    globalTransportBus.unregisterUpdater(id);
  });

  test("production-style integrating updater advances tick and moves the tape digest", () => {
    const id = "us-test-integrating-updater";
    const transport = globalTransportBus.getTransport(id);
    expect(transport.lastFrame.tick).toBe(0);
    expect(transport.lastFrame.provenance).toBe("HONEST_PLACEHOLDER");

    // Mirrors the component contract landed on br-ixl.3: one closure owns the
    // per-tick integration and is both registered and pumped.
    let headingRad = 0;
    const integrate = () => {
      headingRad += 1 / 60;
      return {
        refusal: { isRefused: false },
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad,
          modeLabel: "spin",
          wheelSpeedMps: 1,
        },
      };
    };
    globalTransportBus.registerUpdater(id, integrate, "TS_FALLBACK");

    transport.pump(performance.now() + 16, integrate);
    const first = transport.lastFrame.digest;
    const tickAfterOne = transport.lastFrame.tick;
    expect(tickAfterOne).toBeGreaterThan(0);
    expect(first).not.toBe("00000000");

    transport.pump(performance.now() + 32, integrate);
    expect(transport.lastFrame.tick).toBeGreaterThan(tickAfterOne);
    expect(transport.lastFrame.digest).not.toBe(first); // state advanced -> tape moved
    expect(transport.lastFrame.provenance).toBe("TS_FALLBACK");

    globalTransportBus.unregisterUpdater(id);
  });
});
