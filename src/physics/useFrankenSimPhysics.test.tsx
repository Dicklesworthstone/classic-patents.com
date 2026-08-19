import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { UniversalPatentPhysicsTelemetry } from "./types";
import { useFrankenSimPhysics } from "./useFrankenSimPhysics";

function TestPhysicsHarness(props: {
  patentId: string;
  initial: Partial<UniversalPatentPhysicsTelemetry>;
  onResult?: (result: ReturnType<typeof useFrankenSimPhysics>) => void;
}) {
  const result = useFrankenSimPhysics(props.patentId, props.initial);
  props.onResult?.(result);
  return <div data-patent={result.telemetry.patentId} data-domain={result.telemetry.domain} />;
}

describe("useFrankenSimPhysics Hook", () => {
  const testPatentId = "us-821393-wright-flyer";

  test("initializes typed telemetry envelope with default engine metadata", () => {
    let captured: ReturnType<typeof useFrankenSimPhysics> | undefined;
    const html = renderToStaticMarkup(
      <TestPhysicsHarness
        patentId={testPatentId}
        initial={{
          aero: {
            airspeedMps: 12.5,
            altitudeMeters: 3,
            angleOfAttackRad: 0.08,
            sideslipRad: 0,
            pitchRateRps: 0,
            rollRateRps: 0,
            yawRateRps: 0,
            liftNewtons: 3400,
            inducedDragNewtons: 280,
            parasiticDragNewtons: 190,
            thrustNewtons: 470,
            elevatorDeflectionDeg: 2.0,
            rudderDeflectionDeg: 0,
            wingWarpDeflectionDeg: 0,
          },
        }}
        onResult={(r) => {
          captured = r;
        }}
      />,
    );

    expect(html).toContain(`data-patent="${testPatentId}"`);
    expect(html).toContain('data-domain="aerodynamics_mbd"');
    expect(captured).toBeDefined();
    expect(captured?.telemetry.patentId).toBe(testPatentId);
    expect(captured?.telemetry.domain).toBe("aerodynamics_mbd");
    expect(captured?.telemetry.aero?.airspeedMps).toBe(12.5);
    expect(typeof captured?.updateTelemetry).toBe("function");
    expect(captured?.telemetryRef.current).toBeDefined();
  });
});
