import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { type ControlTape, WRIGHT_FLYER_TEACHING_TAPE } from "@/physics/controlTape";
import { ControlTapeScrubber } from "./ControlTapeScrubber";

describe("ControlTapeScrubber Component", () => {
  test("renders accessible timeline scrubber with teaching tape checkpoints", () => {
    const html = renderToStaticMarkup(
      <ControlTapeScrubber
        patentId="us-821393-wright-flyer"
        modelIdentity="wrightKernel.ts@v1"
        currentParams={{ airspeed: 30, wingWarp: 0 }}
        onApplyParams={() => {}}
      />,
    );

    // Region label
    expect(html).toContain('aria-label="Simulation Control Tape &amp; Replay Panel"');

    // Range input with accessible ARIA attributes
    expect(html).toContain('aria-label="Simulation timeline scrubber"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="180"');
    expect(html).toContain('aria-valuenow="0"');

    // Title and state digest badge
    expect(html).toContain("Wright Flyer: Lateral Control &amp; Rudder Coordination");
    expect(html).toContain('data-testid="state-digest-badge"');
    expect(html).toContain("host:b859f218");

    // Checkpoint buttons
    expect(html).toContain("t:0");
    expect(html).toContain("t:50");
    expect(html).toContain("t:75");
    expect(html).toContain("t:120");
    expect(html).toContain("t:180");

    // Teaching note for initial state
    expect(html).toContain("Straight and Level Trim");
    expect(html).toContain(
      "Aircraft in trimmed 30 mph horizontal flight; wings level, zero yaw moment.",
    );
  });

  test("renders Lamarr frequency hopping teaching tape correctly", () => {
    const html = renderToStaticMarkup(
      <ControlTapeScrubber
        patentId="us-2292387-lamarr-frequency-hopping"
        modelIdentity="lamarrSharedKernel.ts@v1"
        currentParams={{ recordPosition: 0 }}
        onApplyParams={() => {}}
      />,
    );

    expect(html).toContain("Hedy Lamarr: 88-Frequency Synchronized Hopping");
    expect(html).toContain("host:7eb898fd");
    expect(html).toContain("Baseline: Cylinder Slot 0 (Row A)");
    expect(html).toContain("t:0");
    expect(html).toContain("t:40");
    expect(html).toContain("t:70");
    expect(html).toContain("t:100");
    expect(html).toContain("t:150");
  });

  test("refusal boundary: incompatible patent displays alert and disables controls", () => {
    const incompatibleTape: ControlTape = {
      ...WRIGHT_FLYER_TEACHING_TAPE,
      patentId: "us-other-patent",
    };

    const html = renderToStaticMarkup(
      <ControlTapeScrubber
        patentId="us-821393-wright-flyer"
        modelIdentity="wrightKernel.ts@v1"
        currentParams={{ airspeed: 30 }}
        onApplyParams={() => {}}
        defaultTape={incompatibleTape}
      />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("cannot replay on &#x27;us-821393-wright-flyer&#x27;");
    expect(html).toContain("disabled");
  });

  test("renders smoothly inside a 320px viewport without errors", () => {
    const html = renderToStaticMarkup(
      <div style={{ width: "320px" }}>
        <ControlTapeScrubber
          patentId="us-821393-wright-flyer"
          modelIdentity="wrightKernel.ts@v1"
          currentParams={{ airspeed: 30 }}
          onApplyParams={() => {}}
        />
      </div>,
    );

    expect(html).toContain('style="width:320px"');
    expect(html).toContain("Replay Tape");
  });
});
