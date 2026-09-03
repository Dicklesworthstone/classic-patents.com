import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { PhysicsTelemetryBadge } from "./PhysicsTelemetryBadge";

describe("PhysicsTelemetryBadge component", () => {
  test("renders host-model telemetry and live computed SI metrics for Wright Flyer", () => {
    const html = renderToStaticMarkup(
      <PhysicsTelemetryBadge
        patentId="us-821393-wright-flyer"
        equations={getColorizedEquationsForPatent("us-821393-wright-flyer")}
        defaultExpanded={true}
      />,
    );

    expect(html).toContain("Host-Model Telemetry");
    expect(html).toContain("Computed Readout");
    expect(html).toContain("6-DoF Aerodynamics &amp; Lie-Group Multibody Dynamics");
    expect(html).toContain("Reset Baseline");
    expect(html).toContain("Hide Theory");
    expect(html).toContain('data-testid="physics-telemetry-badge"');
    expect(html).toContain('data-patent-id="us-821393-wright-flyer"');
    expect(html).toContain("data-kernel-method=");
    expect(html).toContain("data-telemetry-envelope=");
    expect(html).toContain('data-physics-control-id="airspeed"');
    expect(html).toContain("grid-template-columns:repeat(auto-fit, minmax(min(100%, 10rem), 1fr))");
    expect(html).toContain('title="Gross Lift"');
    expect(html).toContain('data-testid="coupled-dynamics-strip"');
    expect(html).toContain("Coupled Transfer Dynamics · fs-couple");
  });

  test("renders coupled transfer dynamics for Westinghouse Air Brake", () => {
    const html = renderToStaticMarkup(
      <PhysicsTelemetryBadge
        patentId="us-124404-westinghouse-air-brake"
        equations={getColorizedEquationsForPatent("us-124404-westinghouse-air-brake")}
        defaultExpanded={true}
      />,
    );

    expect(html).toContain('data-testid="coupled-dynamics-strip"');
    expect(html).toContain("train-pipe pressure");
    expect(html).toContain("brake shoe clamping force");
    expect(html).toContain("+1.746");
    expect(html).toContain("kN / psi");
  });

  test("keeps the accessible controls and no-equation theory fallback intact", () => {
    const html = renderToStaticMarkup(
      <PhysicsTelemetryBadge
        patentId="us-821393-wright-flyer"
        equations={[]}
        defaultExpanded={true}
      />,
    );

    expect(html).toContain('aria-label="Gross Airspeed"');
    expect(html).toContain('data-physics-control-id="wingWarp"');
    expect(html).toContain("Governing Equation:");
    expect(html).toContain("Physical Principle:");
    expect(html).toContain("Host calculation:");
  });
});
