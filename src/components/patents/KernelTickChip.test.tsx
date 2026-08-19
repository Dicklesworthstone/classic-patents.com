import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { KernelTickChip } from "./KernelTickChip";

describe("KernelTickChip component", () => {
  test("renders idle kernel tick state", () => {
    const html = renderToStaticMarkup(
      <KernelTickChip tick={42} lastChange={null} face="3D Studio" />,
    );

    expect(html).toContain("3D Studio");
    expect(html).toContain("tick 42");
    expect(html).toContain("idle");
  });

  test("renders live parameter change rate", () => {
    const html = renderToStaticMarkup(
      <KernelTickChip
        tick={43}
        lastChange={{
          id: "warpAngleDeg",
          from: 0,
          to: 15,
          ratePerSec: 30.5,
          atMs: 1000,
        }}
        face="Schematic"
      />,
    );

    expect(html).toContain("Schematic");
    expect(html).toContain("tick 43");
    expect(html).toContain("+30.5 warpAngleDeg/s");
  });
});
