import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  goodyearRubberArchivalEdition,
  goodyearRubberParallelReadings,
} from "@/data/editions/goodyearRubberEdition";
import { goodyearRubberPatent } from "@/data/patents/goodyear-rubber";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";

describe("goodyearRubberArchivalEdition", () => {
  test("is a complete, continuous manual edition of the pinned two-page facsimile", () => {
    expect(validateCuratedSpecificationEdition(goodyearRubberArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(goodyearRubberArchivalEdition.sourcePdfSha256).toBe(
      "efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7",
    );
    expect(goodyearRubberArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = goodyearRubberArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });

  test("preserves the facsimile's no-figure, no-table document shape without synthetic artifacts", () => {
    const publicText = JSON.stringify(goodyearRubberArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("FIG.");
    expect(
      goodyearRubberArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
    expect(goodyearRubberArchivalEdition.blocks.some((block) => block.kind === "table")).toBe(
      false,
    );
  });

  test("pins the record to the reviewed transcription and complete authored claim nodes", () => {
    expect(goodyearRubberPatent.archivalEdition).toBe(goodyearRubberArchivalEdition);
    expect(goodyearRubberPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-3633-goodyear-rubber-reviewed.txt",
      pageCount: 2,
      kind: "reviewed-transcription",
      sourcePdfSha256: goodyearRubberArchivalEdition.sourcePdfSha256,
    });
    const asset = goodyearRubberPatent.originalTextAsset;
    if (asset?.kind !== "reviewed-transcription") {
      throw new Error("US 3,633 must retain its reviewed transcription asset.");
    }
    const ledger = readFileSync(resolve(process.cwd(), `public${asset.url}`), "utf8");
    expect(
      validateReviewedTranscriptionPageAnchors(ledger, asset.pageCount, asset.pageAnchors),
    ).toEqual({ valid: true });
    expect(goodyearRubberPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });

  test("keeps source-bounded engineering copy free of raw TeX and invented polymer metrics", () => {
    const visible = JSON.stringify({
      subtitle: goodyearRubberPatent.subtitle,
      plainEnglish: goodyearRubberPatent.plainEnglishExplanation,
      claims: goodyearRubberPatent.claims,
    });

    expect(visible).not.toContain("$");
    expect(visible).not.toContain("\\\\");
    expect(visible).not.toContain("105 kJ/mol");
    expect(visible).not.toContain("Disulfide and polysulfide bridges");
    expect(visible).not.toContain("hydrogen sulfide");
    expect(visible).not.toContain("two billion pneumatic tires");
    expect(visible).toContain("25 parts India-rubber : 5 parts sulphur : 7 parts white lead");
    expect(visible).toContain("212°F–350°F; best effect approaching 270°F");
    expect(visible).toContain("does not state a molecular reaction");
  });

  test("exports renderer-ready, non-lossy readings for every authored source paragraph", () => {
    const paragraphIndexes = goodyearRubberArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(goodyearRubberParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(companionIndexes).toEqual(paragraphIndexes);
    for (const reading of Object.values(goodyearRubberParallelReadings)) {
      expect(reading).toHaveLength(1);
      expect(reading[0].length).toBeGreaterThan(100);
      expect(reading[0]).not.toContain("$\\");
    }
  });
});
