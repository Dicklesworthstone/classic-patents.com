import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PhysicsTelemetryBadge } from "./PhysicsTelemetryBadge";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";

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
  });
});
