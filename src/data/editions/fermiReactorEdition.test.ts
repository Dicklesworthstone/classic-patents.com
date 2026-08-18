import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fermiReactorPatent } from "../patents/fermi-reactor";
import {
  FERMI_REACTOR_FIGURE_CAPTIONS,
  FERMI_REACTOR_FIGURE_PREVIEWS,
  FERMI_REACTOR_SOURCE_PDF_SHA256,
} from "./fermiReactorEdition";

const publicFile = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

describe("US 2,708,656 Fermi/Szilárd source reconstruction", () => {
  test("pins the 58-page facsimile and does not falsely publish a partial edition", () => {
    const pdf = publicFile(fermiReactorPatent.originalPdfUrl);
    expect(createHash("sha256").update(readFileSync(pdf)).digest("hex")).toBe(
      FERMI_REACTOR_SOURCE_PDF_SHA256,
    );
    expect(fermiReactorPatent.originalTextAsset).toMatchObject({
      kind: "source-pdf-text-layer",
      pageCount: 58,
    });
    expect(fermiReactorPatent.archivalEdition).toBeUndefined();
  });

  test("uses the eight exact printed claims, all independent", () => {
    expect(fermiReactorPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(fermiReactorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(fermiReactorPatent.stats).toMatchObject({ totalClaims: 8, independentClaims: 8 });
    expect(fermiReactorPatent.claims[0]?.originalText).toContain("k=1.00 curve of Figure 3");
    expect(fermiReactorPatent.claims[7]?.originalText).toContain(
      "all dimensions thereof at least 0.5 centimeter",
    );
  });

  test("retains source-faithful local previews and captions for all forty-two figures", () => {
    expect(fermiReactorPatent.drawings).toHaveLength(42);
    expect(Object.keys(FERMI_REACTOR_FIGURE_CAPTIONS)).toHaveLength(42);
    expect(Object.keys(FERMI_REACTOR_FIGURE_PREVIEWS)).toHaveLength(42);

    for (let number = 1; number <= 42; number++) {
      const label = `Fig. ${number}` as const;
      const preview = FERMI_REACTOR_FIGURE_PREVIEWS[label];
      expect(preview.alt).toContain(label);
      expect(existsSync(publicFile(preview.src))).toBe(true);
      expect(fermiReactorPatent.drawings[number - 1]).toMatchObject({
        figureNumber: label,
        caption: FERMI_REACTOR_FIGURE_CAPTIONS[label],
        callouts: [],
      });
    }
  });
});
