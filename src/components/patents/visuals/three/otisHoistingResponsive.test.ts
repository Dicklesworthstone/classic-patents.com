import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { otisOverviewRadiusForViewport } from "./otisHoistingCamera";

test("Otis hoisting overview widens enough to preserve the whole apparatus on narrow screens", () => {
  expect(otisOverviewRadiusForViewport(283)).toBe(22);
  expect(otisOverviewRadiusForViewport(479)).toBe(22);
  expect(otisOverviewRadiusForViewport(480)).toBe(13);
  expect(otisOverviewRadiusForViewport(1140)).toBe(13);
});

test("Otis claim status pills live below the studio rather than covering the model or view rail", () => {
  const source = readFileSync(
    join(process.cwd(), "src/components/patents/visuals/three/OtisHoistingApparatus3D.tsx"),
    "utf8",
  );
  const studioStart = source.indexOf('data-testid="otis-three-viewport"');
  const claimPanelStart = source.indexOf('data-testid="otis-claim-status-panel"');

  expect(studioStart).toBeGreaterThanOrEqual(0);
  expect(claimPanelStart).toBeGreaterThan(studioStart);
  // The whole studio viewport precedes the dedicated lower control deck. Keeping
  // ClaimConstraintToggle out of that range prevents a third full-text status
  // pill from wrapping over the hoist beam or its first two pills.
  expect(source.slice(studioStart, claimPanelStart)).not.toContain("<ClaimConstraintToggle");

  const claimPanel = source.slice(claimPanelStart);
  expect(claimPanel).toContain('data-claim-layout="below-studio"');
  expect(claimPanel).toContain("<ClaimConstraintToggle");
  expect(claimPanel).toContain("min-w-0 flex-1");
  // Desktop/tablet retain legible text; compact phones retain the existing
  // single-row icon treatment instead of creating a narrow wrapped overlay.
  expect(claimPanel).toContain("max-[480px]:flex-nowrap");
  expect(claimPanel).toContain("max-[480px]:[&>button>span]:sr-only");
});
