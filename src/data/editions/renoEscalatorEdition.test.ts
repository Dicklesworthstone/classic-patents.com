import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { renoEscalatorPatent } from "@/data/patents/reno-escalator";
import { parsePatentCatalog } from "@/data/patents/schema";
import type { CuratedSpecificationInline } from "@/types/patent";
import {
  renoEscalatorArchivalEdition,
  renoEscalatorParallelReadings,
} from "./renoEscalatorEdition";

const root = resolve(import.meta.dir, "../../..");
const isFigureReference = (
  inline: CuratedSpecificationInline,
): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
  inline.kind === "reference" && inline.referenceType === "figure";

describe("renoEscalatorArchivalEdition", () => {
  test("pins the reviewed four-page facsimile and all three printed claims", () => {
    expect(validateCuratedSpecificationEdition(renoEscalatorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(resolve(root, "public/patents/pdfs/us-470918-reno-escalator.pdf"));
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      renoEscalatorArchivalEdition.sourcePdfSha256,
    );
    expect(
      renoEscalatorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3]);
  });

  test("keeps each printed figure and its complete primary source sheet explicit", () => {
    const sourceSheets = {
      "/patents/figures/us-470918-reno-escalator/source-sheet-1-v1.png": {
        sha256: "e4c403f7b5488eea9b9caa05b60f97e7e7de333cd7716e87e2561baced4b929b",
        width: 2320,
        height: 3408,
      },
      "/patents/figures/us-470918-reno-escalator/source-sheet-2-v1.png": {
        sha256: "44d861a61cb0ee2fe65807af565940742a5f52effb04302eb64d47f0808e8856",
        width: 2320,
        height: 3408,
      },
    } as const;
    const figures = renoEscalatorArchivalEdition.blocks
      .filter((block) => block.kind === "figure-sheet")
      .map((block) => block.figureLabel);
    expect(figures).toEqual(["DRAWING SHEETS", "Fig. 1", "Fig. 2", "Fig. 3", "Fig. 4"]);

    const figureReferences = renoEscalatorArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" ? block.inlines.filter(isFigureReference) : [],
    );
    expect(figureReferences.length).toBeGreaterThanOrEqual(10);
    for (const reference of figureReferences) {
      const source = reference.figurePreviews?.[0]?.src;
      expect(source).toStartWith("/patents/figures/us-470918-reno-escalator/");
      expect(existsSync(resolve(root, `public${source}`))).toBe(true);
      expect(source && source in sourceSheets).toBe(true);
      expect(reference.figurePreviews?.[0]).toMatchObject({ width: 2320, height: 3408 });
    }
    for (const [src, expected] of Object.entries(sourceSheets)) {
      const bytes = readFileSync(resolve(root, `public${src}`));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
      expect(bytes.readUInt32BE(16)).toBe(expected.width);
      expect(bytes.readUInt32BE(20)).toBe(expected.height);
    }
  });

  test("gives each descriptive source paragraph and claim a non-lossy local companion", () => {
    const indexes = renoEscalatorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(renoEscalatorParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(indexes);
    for (const [index, companion] of Object.entries(renoEscalatorParallelReadings)) {
      expect(Number(index)).toBeGreaterThanOrEqual(0);
      expect(companion.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  test("links the canonical record to the manual edition and exact source claims", () => {
    expect(renoEscalatorPatent.archivalEdition).toBe(renoEscalatorArchivalEdition);
    expect(renoEscalatorPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 4,
      sourcePdfSha256: renoEscalatorArchivalEdition.sourcePdfSha256,
    });
    expect(renoEscalatorPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
    expect(renoEscalatorPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(renoEscalatorPatent.claims[0]?.originalText).toContain("channeled longitudinally");
    expect(renoEscalatorPatent.claims[1]?.originalText).toContain("traveling hand-rail");
    expect(renoEscalatorPatent.claims[2]?.originalText).toContain("combed landing");
    expect(parsePatentCatalog([renoEscalatorPatent])).toHaveLength(1);
  });

  test("fails closed if a claim or an explicit figure preview is removed", () => {
    expect(
      validateCuratedSpecificationEdition({
        ...renoEscalatorArchivalEdition,
        blocks: renoEscalatorArchivalEdition.blocks.filter((block) => block.kind !== "claim"),
      }).valid,
    ).toBe(false);
    const firstFigureParagraph = renoEscalatorArchivalEdition.blocks.find(
      (block) =>
        block.kind === "paragraph" && block.inlines.some((inline) => inline.kind === "reference"),
    );
    expect(firstFigureParagraph?.kind).toBe("paragraph");
    if (firstFigureParagraph?.kind !== "paragraph") return;
    const referenceIndex = firstFigureParagraph.inlines.findIndex(isFigureReference);
    expect(referenceIndex).toBeGreaterThanOrEqual(0);
    const malformedInlines = firstFigureParagraph.inlines.map((inline, index) =>
      index === referenceIndex && inline.kind === "reference"
        ? { ...inline, figurePreviews: undefined }
        : inline,
    );
    const malformedReferences = malformedInlines.filter(isFigureReference);
    expect(malformedReferences.every((inline) => inline.figurePreviews?.length)).toBe(false);
  });
});
