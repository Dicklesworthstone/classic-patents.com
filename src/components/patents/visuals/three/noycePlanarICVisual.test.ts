import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 2,981,877 source-bounded visual", () => {
  test("routes the public patent to the pinned-source guide rather than the unverified 2D/3D reconstruction", () => {
    const dispatcherSource = readFileSync(join(VISUALS_DIRECTORY, "index.tsx"), "utf8");
    expect(dispatcherSource).toContain(
      'import { NoycePlanarSourceVisual } from "./NoycePlanarSourceVisual"',
    );
    expect(dispatcherSource).toContain(
      'case "us-2981877-noyce-ic":\n            return <NoycePlanarSourceVisual />;',
    );
    expect(dispatcherSource).not.toContain('return renderMode === "3d-physics" ? <NoycePlanarIC3D');
    expect(dispatcherSource).toContain('"us-2981877-noyce-ic"');
  });

  test("uses four direct facsimile crops and source-specific claim relations", () => {
    const sourceVisual = readFileSync(
      join(VISUALS_DIRECTORY, "NoycePlanarSourceVisual.tsx"),
      "utf8",
    );
    for (const figure of [1, 3, 5, 6]) {
      expect(sourceVisual).toContain(`figure: ${figure}`);
    }
    for (const sourcePhrase of [
      "oxide tongue 5″",
      "junctions 14 through 22",
      "reverse-biased junctions 18 and 22",
      "parallel metal-strip contacts",
      "Claim-linked probe",
      "sourceFocus",
    ]) {
      expect(sourceVisual).toContain(sourcePhrase);
    }
  });

  test("states the source boundary rather than fabricated package or performance details", () => {
    const sourceVisual = readFileSync(
      join(VISUALS_DIRECTORY, "NoycePlanarSourceVisual.tsx"),
      "utf8",
    );
    for (const unsupportedClaim of [
      "clock-speed",
      "depletion-width",
      "fabrication-yield",
      "does not print a voltage",
      "quantitative semiconductor model",
    ]) {
      expect(sourceVisual).toContain(unsupportedClaim);
    }
    expect(sourceVisual).not.toContain("gold leadframe");
    expect(sourceVisual).not.toContain("9 isolated");
  });
});
