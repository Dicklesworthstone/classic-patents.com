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
    // The editorial source face stays deliberately unbound while the root
    // reviewer completes independent page-to-PDF and source-text acceptance.
    expect(dieselEnginePatent.archivalEdition).toBeDefined();
    expect(dieselEnginePatent.originalTextAsset).toBeDefined();
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
    expect(
      dieselEnginePatent.claims.map(
        (item: { number: number; originalText: string; plainEnglish: string }) => item.number,
      ),
    ).toEqual([1, 2, 3]);
    expect(
      dieselEnginePatent.claims.map(
        (item: { number: number; originalText: string; plainEnglish: string }) => item.originalText,
      ),
    ).toEqual([dieselManualClaimText(1), dieselManualClaimText(2), dieselManualClaimText(3)]);
    expect(
      dieselEnginePatent.claims.every(
        (item: { number: number; originalText: string; plainEnglish: string }) =>
          item.plainEnglish.split(/\s+/).length > 30,
      ),
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
      1: {
        src: "/patents/figures/us-542846-diesel-engine/fig-1-source-crop-v1.png",
        width: 600,
        height: 470,
        sha256: "5d83fe4c2918a24fcfda560cd0b4df15fca02644d18f9bd2946e96edf90ec9f4",
      },
      2: {
        src: "/patents/figures/us-542846-diesel-engine/fig-2-source-crop-v4.png",
        width: 635,
        height: 760,
        sha256: "7c1d31ac4cbf1bd879e92ed5be23b6e4777d048224825b1d648bd67077e5e0e4",
      },
      3: {
        src: "/patents/figures/us-542846-diesel-engine/fig-3-source-crop-v4.png",
        width: 785,
        height: 720,
        sha256: "5679bb3ce9db974e049979ebba6f1b7bacfb72790b1a9d09396d0b42374f55ce",
      },
      4: {
        src: "/patents/figures/us-542846-diesel-engine/figs-4-6-source-crop-v3.png",
        width: 2100,
        height: 2450,
        sha256: "3d137a3ea53d6fbc19052d7fbfa1b4a7cbbc4098f082fec89e015777d62aa50c",
      },
      5: {
        src: "/patents/figures/us-542846-diesel-engine/figs-4-6-source-crop-v3.png",
        width: 2100,
        height: 2450,
        sha256: "3d137a3ea53d6fbc19052d7fbfa1b4a7cbbc4098f082fec89e015777d62aa50c",
      },
      6: {
        src: "/patents/figures/us-542846-diesel-engine/figs-4-6-source-crop-v3.png",
        width: 2100,
        height: 2450,
        sha256: "3d137a3ea53d6fbc19052d7fbfa1b4a7cbbc4098f082fec89e015777d62aa50c",
      },
      7: {
        src: "/patents/figures/us-542846-diesel-engine/fig-7-source-crop-v7.png",
        width: 1450,
        height: 2200,
        sha256: "7ba5b22c6a4ce28051a8b545332687bcce99af6e319f968ec4bc6fc26772e188",
      },
      8: {
        src: "/patents/figures/us-542846-diesel-engine/figs-8-and-10-source-crop-v2.png",
        width: 2100,
        height: 2350,
        sha256: "43912b42435410bba1468cb6724c37b7bb3ba563fd7f95a2dae64a08e40fe8d5",
      },
      9: {
        src: "/patents/figures/us-542846-diesel-engine/fig-9-source-crop-v7.png",
        width: 1600,
        height: 2350,
        sha256: "4de683e9443bb072b0f56857bdefee8ee95b2c5e67b2a184f12c25ab1885a3fe",
      },
      10: {
        src: "/patents/figures/us-542846-diesel-engine/figs-8-and-10-source-crop-v2.png",
        width: 2100,
        height: 2350,
        sha256: "43912b42435410bba1468cb6724c37b7bb3ba563fd7f95a2dae64a08e40fe8d5",
      },
    } as const;
    for (const expected of Object.values(approvedCrops)) {
      const asset = resolve(process.cwd(), "public", expected.src.slice(1));
      const png = readFileSync(asset);
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(png.readUInt32BE(16)).toBe(expected.width);
      expect(png.readUInt32BE(20)).toBe(expected.height);
      expect(createHash("sha256").update(png).digest("hex")).toBe(expected.sha256);
    }

    const expectedAssetsByOccurrence: Readonly<Record<string, string[]>> = {
      "Figure 1": [approvedCrops[1].src],
      "Fig. 1": [approvedCrops[1].src],
      "Fig. 2": [approvedCrops[2].src],
      "Fig. 3": [approvedCrops[3].src],
      "Fig. 4": [approvedCrops[4].src],
      "Fig. 5": [approvedCrops[5].src],
      "Fig. 6": [approvedCrops[6].src],
      "Fig. 7": [approvedCrops[7].src],
      "Fig. 8": [approvedCrops[8].src],
      "Fig. 9": [approvedCrops[9].src],
      "Fig. 10": [approvedCrops[10].src],
      "Figs. 4 and 5": [approvedCrops[4].src],
      "Figs. 8 to 10": [approvedCrops[8].src, approvedCrops[9].src],
      "Figs. 9 and 10": [approvedCrops[9].src, approvedCrops[10].src],
      "Figs. 8 and 10": [approvedCrops[8].src],
    };
    for (const reference of references) {
      const expectedAssets = expectedAssetsByOccurrence[reference.text];
      expect(expectedAssets).toBeDefined();
      expect(reference.figurePreviews?.map((preview) => preview.src)).toEqual(expectedAssets);
    }
    expect(dieselEngineParallelReadings).toBeDefined();
  });

  test("keeps a reviewed-transcription ledger with the correct ordered markers", () => {
    const transcriptPath = `${process.cwd()}/public/patents/transcripts/us-542846-diesel-engine-reviewed.txt`;
    if (!existsSync(transcriptPath)) return;
    const ledger = readFileSync(transcriptPath, "utf8");
    expect(validateReviewedTranscription(ledger, 10)).toEqual({ valid: true });
    expect(JSON.stringify(dieselEngineArchivalEdition)).not.toContain("SOURCE PDF PAGE");
    const continuousLedger = ledger
      .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 10 ---/g, "")
      .replace(/\s+/g, " ");
    const sourceBlocks = dieselEngineArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof dieselEngineArchivalEdition.blocks)[number],
        { kind: "paragraph" | "claim" }
      > => block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of sourceBlocks) {
      const blockText = block.inlines
        .map((inline) => inline.text)
        .join("")
        .replace(/\s+/g, " ");
      expect(continuousLedger).toContain(blockText);
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
