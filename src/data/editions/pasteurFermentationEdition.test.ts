import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { parsePatentCatalog } from "@/data/patents/schema";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";
import { pasteurFermentationPatent } from "../patents/pasteur-fermentation";
import { pasteurFermentationArchivalEdition } from "./pasteurFermentationEdition";
import { pasteurFermentationParallelReadings } from "./pasteurFermentationParallelReading";

describe("pasteurFermentationArchivalEdition", () => {
  test("pins the three-sheet facsimile and its sole printed claim", () => {
    expect(validateCuratedSpecificationEdition(pasteurFermentationArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(pasteurFermentationArchivalEdition.sourcePdfSha256).toBe(
      "7c9145e813b652e9da76472a8e6d0b2fa3088aeb1cea34b5ae3163f4d673a649",
    );
    expect(
      createHash("sha256")
        .update(
          readFileSync(
            resolve(process.cwd(), "public/patents/pdfs/us-135245-pasteur-fermentation.pdf"),
          ),
        )
        .digest("hex"),
    ).toBe(pasteurFermentationArchivalEdition.sourcePdfSha256);
    expect(
      pasteurFermentationArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1]);
    expect(pasteurFermentationPatent.claims.map((claim) => claim.number)).toEqual([1]);
    const sourceClaim = pasteurFermentationArchivalEdition.blocks.find(
      (block) => block.kind === "claim" && block.number === 1,
    );
    if (sourceClaim?.kind !== "claim") {
      throw new Error("Pasteur archival edition is missing its sole claim.");
    }
    expect(pasteurFermentationPatent.claims[0]?.originalText).toBe(
      sourceClaim.inlines.map((inline) => inline.text).join(""),
    );
  });

  test("provides a non-lossy authored companion for every and only paragraph block", () => {
    const paragraphIndexes = pasteurFermentationArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(pasteurFermentationParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(pasteurFermentationParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("links each source figure occurrence to an owned facsimile crop", () => {
    const figureReferences = pasteurFermentationArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const expectedReferences = [
      {
        text: "Figure 1",
        src: "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
        width: 1750,
        height: 1150,
        sha256: "8c5e6f806cc5570a6364168b31e4dc3dcc48a85b2f73494574dce363bbf78541",
      },
      {
        text: "Fig. 1",
        src: "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
        width: 1750,
        height: 1150,
        sha256: "8c5e6f806cc5570a6364168b31e4dc3dcc48a85b2f73494574dce363bbf78541",
      },
      {
        text: "Fig. 2",
        src: "/patents/figures/us-135245-pasteur-fermentation/figure-2-v3.png",
        width: 900,
        height: 750,
        sha256: "adec6a5da1c2b0b36d2fe40412a06bb4bfcd27342fad78bbeec573195474658f",
      },
    ] as const;
    expect(figureReferences).toHaveLength(expectedReferences.length);
    expect(
      figureReferences.map((reference) => ({
        text: reference.text,
        src: reference.figurePreviews?.[0]?.src,
        width: reference.figurePreviews?.[0]?.width,
        height: reference.figurePreviews?.[0]?.height,
      })),
    ).toEqual(
      expectedReferences.map(({ text, src, width, height }) => ({ text, src, width, height })),
    );
    for (const expected of expectedReferences) {
      const filePath = resolve(process.cwd(), "public", expected.src.slice(1));
      expect(existsSync(filePath)).toBe(true);
      const image = readFileSync(filePath);
      expect(image.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect({ width: image.readUInt32BE(16), height: image.readUInt32BE(20) }).toEqual({
        width: expected.width,
        height: expected.height,
      });
      expect(createHash("sha256").update(image).digest("hex")).toBe(expected.sha256);
    }
  });

  test("keeps every visitor-facing literal source block in the reviewed ledger", () => {
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-135245-pasteur-fermentation-reviewed.txt",
      ),
      "utf8",
    );
    const literalBlocks = pasteurFermentationArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "heading") return [block.text];
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      return [];
    });
    const normalizedLedger = ledger.replace(/^---.*---$/gm, "").replace(/\s+/g, " ");
    for (const literal of literalBlocks) {
      expect(normalizedLedger).toContain(literal.trim().replace(/\s+/g, " "));
    }
    expect(ledger).toContain("exit or escape tubes at x");
    expect(ledger).toContain("16° to 18° Reaumur");
    expect(JSON.stringify(pasteurFermentationArchivalEdition)).not.toContain(
      "shows the three vessels and the spray arrangement",
    );
  });

  test("is catalog-importable with a reviewed transcription, no invented claims, and no substituted filing date", () => {
    expect(pasteurFermentationPatent.archivalEdition).toBe(pasteurFermentationArchivalEdition);
    expect(pasteurFermentationPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 3,
      sourcePdfSha256: pasteurFermentationArchivalEdition.sourcePdfSha256,
    });
    expect(pasteurFermentationPatent.stats).toMatchObject({ totalClaims: 1, independentClaims: 1 });
    expect(pasteurFermentationPatent.filingDate).toBeNull();
    expect(parsePatentCatalog([pasteurFermentationPatent])).toHaveLength(1);
  });

  test("keeps the visual page-to-ledger sequence aligned with all three facsimile pages", () => {
    const sourceAsset = pasteurFermentationPatent.originalTextAsset;
    if (!sourceAsset) {
      throw new Error("Pasteur canonical record is missing its reviewed source asset.");
    }
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-135245-pasteur-fermentation-reviewed.txt",
      ),
      "utf8",
    );
    expect(validateReviewedTranscriptionPageAnchors(ledger, 3, sourceAsset.pageAnchors)).toEqual({
      valid: true,
    });
  });
});
