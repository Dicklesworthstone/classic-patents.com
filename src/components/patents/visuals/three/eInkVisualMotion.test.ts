import { expect, test } from "bun:test";
import { eInkViewForViewport } from "./eInkCamera";

test("E-Ink 3D projects electrophoretic state without rotating the apparatus", async () => {
  const source = await Bun.file(new URL("./EInk3D.tsx", import.meta.url)).text();

  expect(source).toContain("model.updateElectrophoresis(current.state, current.simTimeSec)");
  expect(source).not.toContain("model.mainGroup.rotation");
});

test("E-Ink overview keeps the full electrode stack framed on desktop and phone", () => {
  const desktop = eInkViewForViewport("iso", 1200);
  const phone = eInkViewForViewport("iso", 320);
  const distance = (view: typeof desktop) =>
    Math.hypot(
      view.pos[0] - view.target[0],
      view.pos[1] - view.target[1],
      view.pos[2] - view.target[2],
    );

  expect(distance(desktop)).toBeGreaterThan(7);
  expect(distance(phone) / distance(desktop)).toBeCloseTo(1.2, 8);
  expect(desktop.target).toEqual([0, -0.1, 0]);
});
