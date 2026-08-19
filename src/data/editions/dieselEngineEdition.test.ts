import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { dieselEnginePatent } from "@/data/patents/diesel-engine";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  dieselEngineArchivalEdition,
  dieselEngineParallelReadings,
  dieselManualClaimText,
} from "./dieselEngineEdition";

describe("US 542,846 manual source edition", () => {
  test("pins the actual ten-page facsimile and source identity", () => {
    if (dieselEnginePatent.archivalEdition) {
      expect(dieselEnginePatent.archivalEdition).toBe(dieselEngineArchivalEdition);
    }
    expect(dieselEnginePatent.title).toBe("Method of and Apparatus for Converting Heat into Work");
    expect(dieselEnginePatent.filingDate).toBe("1892-08-26");
    expect(validateCuratedSpecificationEdition(dieselEngineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${dieselEnginePatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      dieselEngineArchivalEdition.sourcePdfSha256,
    );
  });

  test("keeps all three printed claims bound to their authored nodes", () => {
    expect(dieselEnginePatent.claims.map((item) => item.number)).toEqual([1, 2, 3]);
    expect(dieselEnginePatent.claims.map((item) => item.originalText)).toEqual([
      dieselManualClaimText(1),
      dieselManualClaimText(2),
      dieselManualClaimText(3),
    ]);
    expect(
      dieselEnginePatent.claims.every((item) => item.plainEnglish.split(/\s+/).length > 30),
    ).toBe(true);
  });

  test("uses authored local figure crops and term nodes", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/dieselEngineEdition.ts"),
      "utf8",
    );
    expect(editionSource).not.toContain("SOURCE_FIGURE_CITATIONS");
    expect(editionSource).not.toMatch(/indexOf\s*\(/);
    expect(editionSource).not.toMatch(/replace\s*\(/);
    expect(editionSource).not.toMatch(/\.split\s*\(/);
    const references = dieselEngineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    for (const reference of references) {
      for (const source of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", source.src.slice(1)))).toBe(true);
      }
    }
    expect(references.length).toBeGreaterThan(5);
    const terms = dieselEngineArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    expect(terms.map((term) => term.text)).toContain("neutral gas or vapor");
    expect(terms.every((term) => term.definition.length > 80)).toBe(true);
    for (const block of dieselEngineArchivalEdition.blocks) {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      for (const inline of inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(/\bFig(?:s)?\.\s*\d/);
        }
      }
    }
    const approvedCrops = {
      1: { version: 1, width: 600, height: 470 },
      2: { version: 4, width: 635, height: 760 },
      3: { version: 4, width: 785, height: 720 },
      4: { version: 3, width: 800, height: 1580 },
      5: { version: 2, width: 560, height: 700 },
      6: { version: 2, width: 700, height: 650 },
      7: { version: 2, width: 1000, height: 1500 },
      8: { version: 3, width: 1000, height: 990 },
      9: { version: 3, width: 1000, height: 1600 },
      10: { version: 2, width: 1000, height: 700 },
    } as const;
    for (const [figureText, expected] of Object.entries(approvedCrops)) {
      const figure = Number(figureText);
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public",
            `patents/figures/us-542846-diesel-engine/fig-${figure}-source-crop-v${expected.version}.png`,
          ),
        ),
      ).toBe(true);
    }
    const figureTwoPreview = references
      .flatMap((reference) => reference.figurePreviews ?? [])
      .find((source) => source.src.includes("fig-2-source-crop"));
    expect(figureTwoPreview).toMatchObject({
      src: "/patents/figures/us-542846-diesel-engine/fig-2-source-crop-v4.png",
      width: 635,
      height: 760,
    });
    const figureThreePreview = references
      .flatMap((reference) => reference.figurePreviews ?? [])
      .find((source) => source.src.includes("fig-3-source-crop"));
    expect(figureThreePreview).toMatchObject({
      src: "/patents/figures/us-542846-diesel-engine/fig-3-source-crop-v4.png",
      width: 785,
      height: 720,
    });
    for (const [figureText, expected] of Object.entries(approvedCrops)) {
      const figure = Number(figureText);
      expect(
        references.some((reference) =>
          reference.figurePreviews?.some(
            (source) =>
              source.src ===
                `/patents/figures/us-542846-diesel-engine/fig-${figure}-source-crop-v${expected.version}.png` &&
              source.width === expected.width &&
              source.height === expected.height,
          ),
        ),
      ).toBe(true);
    }
    expect(dieselEngineParallelReadings).toBeDefined();
  });

  test("publishes a reviewed-transcription ledger with the correct ordered markers", () => {
    const transcriptPath = `${process.cwd()}/public/patents/transcripts/us-542846-diesel-engine-reviewed.txt`;
    if (!existsSync(transcriptPath)) return;
    const ledger = readFileSync(transcriptPath, "utf8");
    expect(validateReviewedTranscription(ledger, 10)).toEqual({ valid: true });
    expect(ledger).toContain(dieselManualClaimText(1));
    expect(ledger).toContain(dieselManualClaimText(2));
    expect(ledger).toContain(dieselManualClaimText(3));
    expect(JSON.stringify(dieselEngineArchivalEdition)).not.toContain("SOURCE PDF PAGE");
    const sourceBlocks = dieselEngineArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof dieselEngineArchivalEdition.blocks)[number],
        { kind: "paragraph" | "claim" }
      > => block.kind === "paragraph" || block.kind === "claim",
    );
    const continuousLedger = ledger
      .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 10 ---/g, "")
      .replace(/\s+/g, " ");
    for (const block of sourceBlocks) {
      expect(continuousLedger).toContain(
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .replace(/\s+/g, " "),
      );
    }

    const drawingSheet = (page: number) => {
      const marker = `--- REVIEWED TRANSCRIPTION PAGE ${page} OF 10 ---`;
      const nextMarker = `--- REVIEWED TRANSCRIPTION PAGE ${page + 1} OF 10 ---`;
      const start = ledger.indexOf(marker);
      const end = ledger.indexOf(nextMarker, start + marker.length);
      return ledger.slice(start, end === -1 ? undefined : end);
    };

    for (const page of [1, 2, 3, 4, 5]) {
      const sheet = drawingSheet(page);
      expect(sheet).toContain(`5 Sheets-Sheet ${page}.`);
      expect(sheet).toContain("METHOD OF AND APPARATUS FOR CONVERTING HEAT INTO WORK.");
      expect(sheet).toContain("No. 542,846. Patented July 16, 1895.");
    }
    expect(drawingSheet(1)).toContain("Fig. 1.");
    expect(drawingSheet(1)).toContain("Fig. 2.");
    expect(drawingSheet(1)).toContain("Fig. 3.");
    expect(drawingSheet(2)).toContain("Fig. 4.");
    expect(drawingSheet(2)).toContain("Fig. 5.");
    expect(drawingSheet(2)).toContain("Fig. 6.");
    expect(drawingSheet(3)).toContain("Fig. 7.");
    expect(drawingSheet(4)).toContain("Fig. 8.");
    expect(drawingSheet(4)).toContain("Fig. 10.");
    expect(drawingSheet(5)).toContain("Fig. 9.");
    expect(drawingSheet(5)).not.toContain("FIGURES 8 TO 10.");

    // The ledger is comparison evidence, so its page markers must follow the
    // supplied facsimile rather than an editor's continuous reading order.
    // In particular, it may not invent descriptive figure summaries.
    expect(drawingSheet(6)).not.toContain("FIGURES 1 TO 3.");
    expect(drawingSheet(6)).not.toContain("FIGURES 4 TO 6.");
    expect(drawingSheet(6)).not.toContain("FIGURES 8 TO 10.");
    expect(drawingSheet(7)).toMatch(/guides for the plunger\.\s*$/);
    expect(drawingSheet(7)).not.toContain("E is the governor");
    expect(drawingSheet(8)).toContain("E is the governor whose shaft g");
    expect(drawingSheet(8)).toMatch(/cock h of the air-vessel\.\s*$/);
    expect(drawingSheet(9)).toMatch(/adjustable from the governor\s*$/);
    expect(drawingSheet(9)).not.toContain("by means of the rod St");
    expect(drawingSheet(10)).toContain("by means of the rod St, (see Fig. 9,)");
    expect(drawingSheet(10)).toContain("What I claim as new, and desire to secure");
  });

  test("pairs every source paragraph with a concrete, source-specific companion", () => {
    const paragraphIndexes = dieselEngineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(dieselEngineParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(dieselEngineParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(80);
      expect(dieselEngineParallelReadings[index]?.join(" ")).not.toContain("source paragraph");
    }
  });
});
