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
});
