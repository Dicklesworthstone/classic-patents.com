import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import type { UniversalPatentPhysicsTelemetry } from "./types";
import { TransportBus, useFrankenSimPhysics } from "./useFrankenSimPhysics";

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

  test("uses one stable empty initial envelope when a caller omits telemetry", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/physics/useFrankenSimPhysics.ts"),
      "utf8",
    );
    const hookSource = source.slice(source.indexOf("export function useFrankenSimPhysics("));
    expect(source).toContain("const EMPTY_INITIAL_TELEMETRY");
    expect(hookSource).toContain("= EMPTY_INITIAL_TELEMETRY");
    expect(hookSource).not.toContain(
      "initialTelemetry: Partial<UniversalPatentPhysicsTelemetry> = {}",
    );
  });

  test("admits the first fixed step when the updater registers before the listener", () => {
    const bus = new TransportBus();
    const transport = bus.getTransport("test-updater-first");
    bus.registerUpdater("test-updater-first", () => ({
      machine: {
        poseXMeters: 1,
        poseYMeters: 0,
        headingRad: 0.25,
        modeLabel: "running",
        wheelSpeedMps: 0,
      },
    }));

    const frames: number[] = [];
    const unsubscribe = transport.subscribe((frame) => frames.push(frame.tick));

    expect(transport.lastFrame.tick).toBe(1);
    expect(transport.lastFrame.telemetry.machine?.headingRad).toBe(0.25);
    expect(frames).toEqual([1]);
    unsubscribe();
    bus.unregisterUpdater("test-updater-first");
  });

  test("admits the first fixed step when the listener subscribes before the updater", () => {
    const bus = new TransportBus();
    const transport = bus.getTransport("test-listener-first");
    const frames: number[] = [];
    const unsubscribe = transport.subscribe((frame) => frames.push(frame.tick));

    bus.registerUpdater("test-listener-first", () => ({
      machine: {
        poseXMeters: 2,
        poseYMeters: 0,
        headingRad: 0.5,
        modeLabel: "running",
        wheelSpeedMps: 0,
      },
    }));

    expect(frames[0]).toBe(0);
    expect(transport.lastFrame.tick).toBe(1);
    expect(transport.lastFrame.telemetry.machine?.headingRad).toBe(0.5);
    expect(frames.at(-1)).toBe(1);
    unsubscribe();
    bus.unregisterUpdater("test-listener-first");
  });

  test("old updater cleanup cannot unregister a replacement owner", () => {
    const bus = new TransportBus();
    const releaseOld = bus.registerUpdater("test-owner-lease", () => null);
    const releaseReplacement = bus.registerUpdater("test-owner-lease", () => null);

    releaseOld();
    expect(bus.runtimeReceipt("test-owner-lease").hasUpdater).toBe(true);

    releaseReplacement();
    expect(bus.runtimeReceipt("test-owner-lease").hasUpdater).toBe(false);
  });

  test("fixed-step transport advances at the same rate across display refresh cadences", () => {
    const runOneSecond = (refreshHz: number) => {
      const queuedFrames: Array<(nowMs: number) => void> = [];
      let requestId = 0;
      const bus = new TransportBus((callback) => {
        queuedFrames.push(callback);
        requestId += 1;
        return requestId;
      });
      const transport = bus.getTransport(`test-${refreshHz}-hz`);
      let steps = 0;
      const releaseUpdater = bus.registerUpdater(`test-${refreshHz}-hz`, () => {
        steps += 1;
        return { timeStepDt: 1 / 60 };
      });
      const unsubscribe = transport.subscribe(() => undefined);

      for (let frame = 0; frame <= refreshHz; frame++) {
        const callback = queuedFrames.shift();
        if (!callback) throw new Error("transport failed to schedule its next animation frame");
        callback((frame * 1000) / refreshHz);
      }

      unsubscribe();
      releaseUpdater();
      return steps;
    };

    const stepsAt30Hz = runOneSecond(30);
    expect(runOneSecond(60)).toBe(stepsAt30Hz);
    expect(runOneSecond(120)).toBe(stepsAt30Hz);
    expect(stepsAt30Hz).toBeGreaterThanOrEqual(60);
    expect(stepsAt30Hz).toBeLessThanOrEqual(61);
  });
});
