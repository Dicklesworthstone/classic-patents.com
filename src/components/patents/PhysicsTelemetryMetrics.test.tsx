import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { coupleEdgesFor } from "@/physics/coupleGraph";
import { computeParameterSensitivity } from "@/physics/sensitivityKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { PhysicsTelemetryMetrics } from "./PhysicsTelemetryMetrics";

function renderMetrics(id: string, control: string, params: Record<string, number>) {
  return renderToStaticMarkup(
    <PhysicsTelemetryMetrics
      metrics={PATENT_PHYSICS_REGISTRY[id].computeMetrics(params)}
      coupleEdges={coupleEdgesFor(id, params)}
      sliderSensitivity={computeParameterSensitivity(id, control, params)}
      lastChange={null}
    />,
  );
}

describe("Telemetry sensitivities without a coupling graph", () => {
  test("Crump exposes the current road-geometry slope and its output identity", () => {
    const id = "us-5121329-crump-fdm";
    const params = { roadWidthMm: 0.6, layerHeightMm: 0.25, printSpeedMmS: 15 };
    expect(coupleEdgesFor(id, params)).toEqual([]);
    const html = renderMetrics(id, "printSpeedMmS", params);
    expect(html).toContain('data-testid="parameter-sensitivity"');
    expect(html).toContain("Volumetric Extrusion Flow Rate");
    expect(html).toContain("0.15");
    expect(html).toContain("mm³/s / (mm/s)");
    expect(html).toContain("proportional filament feed");
  });

  test("Clavel renders a normalized geometric slope but withholds it on a claim refusal", () => {
    const id = "us-4976582-clavel-delta-robot";
    const params = { armOneInput: 0.2, armTwoInput: -0.14, armThreeInput: 0.1 };
    const html = renderMetrics(id, "armOneInput", params);
    expect(html).toContain("Normalized Traveling Plate Height");
    expect(html).toContain("normalized / input fraction");
    expect(html).toContain("not millimetres per degree");
    const refused = renderMetrics(id, "armOneInput", { ...params, claim1TopologyEnabled: 0 });
    expect(refused).not.toContain('data-testid="parameter-sensitivity"');
    expect(refused).toContain("WITHHELD");
  });

  test("Segway mass changes the visible slope and preserves its modern-scenario boundary", () => {
    const id = "us-6302230-kamen-segway";
    const params = { riderPitchDeg: 3, riderMassKg: 110, groundFrictionCoeff: 0.85 };
    const slope = computeParameterSensitivity(id, "groundFrictionCoeff", params);
    const html = renderMetrics(id, "groundFrictionCoeff", params);
    expect(slope?.derivativeValue).toBeCloseTo(153 * 9.80665, 2);
    expect(html).toContain(String(slope?.derivativeValue));
    expect(html).toContain("Maximum Ground Grip Traction");
    expect(html).toContain("modern scenario, not source-specified hardware");
    expect(
      renderMetrics(id, "riderPitchDeg", { ...params, claim1BalanceEnabled: 0 }),
    ).not.toContain('data-testid="parameter-sensitivity"');
  });

  test("coupled Wright readouts remain available when the selected control has no sensitivity", () => {
    const html = renderMetrics("us-821393-wright-flyer", "rudder", { coupled: 1 });
    expect(html).toContain("wing warp");
    expect(html).toContain("adverse yaw");
    expect(html).not.toContain('data-testid="parameter-sensitivity"');
  });
});
