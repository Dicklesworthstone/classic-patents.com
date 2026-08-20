import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { sholesTypewriterArchivalEdition } from "@/data/editions/sholesTypewriterEdition";
import { sholesTypewriterPatent } from "@/data/patents/sholes-typewriter";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";

describe("US 79,265 manual source edition", () => {
  test("pins the reviewed six-page facsimile and publishes an explicit manual edition", () => {
    expect(sholesTypewriterPatent.archivalEdition).toBe(sholesTypewriterArchivalEdition);
    expect(sholesTypewriterPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 6,
      sourcePdfSha256: "59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca",
    });
    expect(sholesTypewriterPatent.filingDate).toBeNull();
    expect(sholesTypewriterPatent.title).toBe("Improvement in Type-Writing Machines");
    expect(
      createHash("sha256")
        .update(readFileSync(`${process.cwd()}/public/patents/pdfs/us-79265-sholes-typewriter.pdf`))
        .digest("hex"),
    ).toBe("59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca");
    expect(validateCuratedSpecificationEdition(sholesTypewriterArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const asset = sholesTypewriterPatent.originalTextAsset;
    if (!asset) throw new Error("US 79,265 must retain its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, asset.pageCount)).toEqual({ valid: true });
    for (const sourceAnchor of [
      "circular annular disk B",
      "exact length of the radius",
      "spherical cavity or bowl",
      "Serrate the bar I",
      "fresh place of the inking-ribbon",
    ]) {
      expect(ledger).toContain(sourceAnchor);
    }
  });

  test("matches the five printed claims instead of the former invented three-claim summary", () => {
    expect(sholesTypewriterPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
    expect(sholesTypewriterPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(sholesTypewriterPatent.claims.some((claim) => claim.dependsOn)).toBe(false);
    expect(sholesTypewriterPatent.claims[0]?.originalText).toContain("key-levers L");
    expect(sholesTypewriterPatent.claims[1]?.originalText).toContain("bifurcated lever H");
    expect(sholesTypewriterPatent.claims[2]?.originalText).toContain("pins e");
    expect(sholesTypewriterPatent.claims[3]?.originalText).toContain("clasps or springs b");
    expect(sholesTypewriterPatent.claims[4]?.originalText).toContain("spools m");
    expect(sholesTypewriterPatent.stats).toMatchObject({ totalClaims: 5, independentClaims: 5 });
    const asset = sholesTypewriterPatent.originalTextAsset;
    if (!asset) throw new Error("US 79,265 must retain its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    for (const claim of sholesTypewriterPatent.claims) {
      expect(ledger).toContain(claim.originalText);
    }
  });

  test("keeps later-machine folklore and fabricated telemetry out of the published source face", () => {
    const visibleCopy = JSON.stringify({
      summary: sholesTypewriterPatent.summary,
      heroQuote: sholesTypewriterPatent.heroQuote,
      originalText: sholesTypewriterPatent.originalText,
      plainEnglish: sholesTypewriterPatent.plainEnglishExplanation,
      claims: sholesTypewriterPatent.claims,
    });

    expect(visibleCopy).not.toContain("QWERTY");
    expect(visibleCopy).not.toContain("2.54");
    expect(visibleCopy).not.toContain("$\\");
    expect(sholesTypewriterPatent.historicalContext.patentWars).toEqual([]);
    const sourceFace = JSON.stringify(sholesTypewriterArchivalEdition.blocks);
    expect(sourceFace).toContain('"kind":"reference"');
    expect(sourceFace).toContain("fig-6-isolated-source-crop-v2.png");
    expect(sourceFace).toContain("fig-7-verified-source-crop.png");
    expect(sourceFace).toContain("fig-8-verified-source-crop.png");
    expect(sourceFace).toContain("fig-9-tight-source-crop-v2.png");
    expect(sourceFace).not.toContain("SOURCE PDF PAGE");
    expect(sourceFace).not.toContain("QWERTY");
  });
});
