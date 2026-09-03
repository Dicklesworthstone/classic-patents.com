import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { CoupleEdge } from "@/physics/coupleGraph";
import { CoupledDynamicsStrip } from "./CoupledDynamicsStrip";

describe("CoupledDynamicsStrip component", () => {
  test("returns empty output when no coupled edges exist", () => {
    const html = renderToStaticMarkup(<CoupledDynamicsStrip edges={[]} />);
    expect(html).toBe("");
  });

  test("renders transfer dynamics and edge gains accurately", () => {
    const sampleEdges: CoupleEdge[] = [
      {
        from: "wing warp",
        to: "adverse yaw",
        gain: 12.4,
        unit: "N·m / deg",
        crate: "fs-couple",
        source: "ts-fallback",
      },
      {
        from: "generator G",
        to: "disk D",
        gain: -0.95,
        unit: "rpm / rpm",
        crate: "fs-couple",
        source: "wasm",
      },
    ];

    const html = renderToStaticMarkup(<CoupledDynamicsStrip edges={sampleEdges} />);
    expect(html).toContain('data-testid="coupled-dynamics-strip"');
    expect(html).toContain('data-coupled-edge-count="2"');
    expect(html).toContain("Coupled Transfer Dynamics · fs-couple");
    expect(html).toContain("wing warp");
    expect(html).toContain("adverse yaw");
    expect(html).toContain("+12.4");
    expect(html).toContain("N·m / deg");
    expect(html).toContain("generator G");
    expect(html).toContain("disk D");
    expect(html).toContain("-0.95");
    expect(html).toContain("rpm / rpm");
  });
});
