import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { sholesTypewriterArchivalEdition } from "@/data/editions/sholesTypewriterEdition";
import { sholesTypewriterPatent } from "@/data/patents/sholes-typewriter";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";

const SHOLES_SOURCE_SHEETS = [
  {
    path: "/patents/figures/us-79265-sholes-typewriter/source-sheet-1-v1.png",
    sha256: "526827fee7019c7b1c0401d29a2ba655f4ec134b704f329e0d72f28c6f1cc2b8",
    width: 2320,
    height: 3408,
  },
  {
    path: "/patents/figures/us-79265-sholes-typewriter/source-sheet-2-v1.png",
    sha256: "8149998e7a6cfdf935a22ae7be61e0f4e00a35e3823f56654eed92fab774cb60",
    width: 2320,
    height: 3408,
  },
] as const;

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

  test("binds every active figure citation to the immutable full source sheet that contains it", () => {
    const figureReferences = sholesTypewriterArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      return inlines.filter(
        (
          inline,
        ): inline is CuratedSpecificationInline & {
          kind: "reference";
          referenceType: "figure";
          figurePreviews?: readonly { src: string }[];
        } => inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(figureReferences).toHaveLength(50);
    const previews = figureReferences.flatMap((reference) => reference.figurePreviews ?? []);
    expect(previews).toHaveLength(83);
    expect([...new Set(previews.map((preview) => preview.src))].sort()).toEqual(
      SHOLES_SOURCE_SHEETS.map((sheet) => sheet.path).sort(),
    );

    for (const sheet of SHOLES_SOURCE_SHEETS) {
      const contents = readFileSync(`${process.cwd()}/public${sheet.path}`);
      expect(createHash("sha256").update(contents).digest("hex")).toBe(sheet.sha256);
      expect(contents.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(contents.readUInt32BE(16)).toBe(sheet.width);
      expect(contents.readUInt32BE(20)).toBe(sheet.height);
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
    expect(sourceFace).toContain("source-sheet-1-v1.png");
    expect(sourceFace).toContain("source-sheet-2-v1.png");
    expect(sourceFace).not.toContain("tight-source-crop");
    expect(sourceFace).not.toContain("verified-source-crop");
    expect(sourceFace).not.toContain("SOURCE PDF PAGE");
    expect(sourceFace).not.toContain("QWERTY");
  });
});
