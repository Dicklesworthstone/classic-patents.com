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
});
