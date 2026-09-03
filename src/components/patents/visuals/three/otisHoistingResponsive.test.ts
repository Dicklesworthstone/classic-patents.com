import { expect, test } from "bun:test";
import { otisOverviewRadiusForViewport } from "./OtisHoistingApparatus3D";

test("Otis hoisting overview widens enough to preserve the whole apparatus on narrow screens", () => {
  expect(otisOverviewRadiusForViewport(283)).toBe(22);
  expect(otisOverviewRadiusForViewport(479)).toBe(22);
  expect(otisOverviewRadiusForViewport(480)).toBe(13);
  expect(otisOverviewRadiusForViewport(1140)).toBe(13);
});
