import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  grammeDynamoArchivalEdition,
  grammeDynamoParallelReadings,
  grammeDynamoPreservedLegacyFigureCrops,
} from "@/data/editions/grammeDynamoEdition";
import { grammeDynamoPatent } from "@/data/patents/gramme-dynamo";
import type { CuratedSpecificationInline } from "@/types/patent";
import { completeArchivalEditionForViewer, patentForSourceReader } from "./publicationApproval";

describe("grammeDynamoArchivalEdition", () => {
  test("is a continuous manual edition of the complete nine-page primary facsimile", () => {
    expect(validateCuratedSpecificationEdition(grammeDynamoArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(grammeDynamoArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(grammeDynamoArchivalEdition.sourcePdfSha256).toBe(
      "b7ffe0d2354ea69f50616261005f1265fcbab643824f0293b91fc3d2b6523895",
    );
    expect(
      grammeDynamoArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3]);
  });

  test("binds every cited figure to its complete, visually reviewed source sheet", async () => {
    const sheets = grammeDynamoArchivalEdition.blocks.filter(
      (block) => block.kind === "figure-sheet",
    );
    expect(sheets.map((sheet) => sheet.figureLabel)).toEqual([
      "DRAWING SHEET 1",
      "DRAWING SHEET 2",
      "DRAWING SHEET 3",
      "DRAWING SHEET 4",
    ]);

    const figureReferences: Extract<CuratedSpecificationInline, { kind: "reference" }>[] = [];
    for (const block of grammeDynamoArchivalEdition.blocks) {
      const inlineGroups =
        block.kind === "paragraph" || block.kind === "claim"
          ? [block.inlines]
          : block.kind === "figure-sheet"
            ? [block.description]
            : [];
      for (const inlines of inlineGroups) {
        for (const inline of inlines) {
          if (inline.kind === "reference" && inline.referenceType === "figure") {
            figureReferences.push(inline);
          }
        }
      }
    }

    const publicText = JSON.stringify(grammeDynamoArchivalEdition.blocks);
    for (const figure of ["Fig. 1", "Fig. 4", "Fig. 7", "Fig. 10", "Fig. 12", "Fig. 14"]) {
      expect(publicText).toContain(figure);
    }

    const sourceSheets = [
      {
        sourcePdfPage: 1,
        filename: "drawing-sheet-1.png",
        sha256: "a7c2380f83a93fcdebba8c39ada3833984d845aad829898b1ac22f4d9c304bd2",
      },
      {
        sourcePdfPage: 2,
        filename: "drawing-sheet-2.png",
        sha256: "9f047812267a5e0f7d02f4e43f66b21936bd408e9fe29321fadea91050750e27",
      },
      {
        sourcePdfPage: 3,
        filename: "drawing-sheet-3.png",
        sha256: "9c58685c61fbaa91e460b7542cde68d37b39a1dd0d61cf14e2a0517478dc72ea",
      },
      {
        sourcePdfPage: 4,
        filename: "drawing-sheet-4.png",
        sha256: "d2a63bed87918eeb58eb9b2447a034fc5cc959bba92c9edd149a8efc04021512",
      },
    ] as const;
    const sourceSheetForFigure = {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 2,
      8: 2,
      9: 2,
      10: 3,
      11: 3,
      12: 3,
      13: 3,
      14: 4,
    } as const;

    expect(figureReferences).toHaveLength(31);
    for (const reference of figureReferences) {
      expect(reference.figurePreviews).toHaveLength(1);
      const sourcePdfPage = Number(reference.href?.match(/drawing-sheet-(\d+)/)?.[1]);
      const expected = sourceSheets.find((sheet) => sheet.sourcePdfPage === sourcePdfPage);
      const preview = reference.figurePreviews?.[0];
      expect(expected).toBeDefined();
      expect(preview).toMatchObject({
        src: `/patents/figures/us-120057-gramme-dynamo/${expected?.filename}`,
        width: 1392,
        height: 2045,
      });
      expect(preview?.alt).toContain("Complete unmodified source drawing sheet");
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }

    for (const figureNumber of Array.from({ length: 14 }, (_, index) => index + 1)) {
      const references = figureReferences.filter((reference) =>
        Boolean(reference.text.match(/\d+/g)?.includes(String(figureNumber))),
      );
      expect(references.length).toBeGreaterThan(0);
      const expectedSourcePdfPage =
        sourceSheetForFigure[figureNumber as keyof typeof sourceSheetForFigure];
      expect(
        references.some((reference) =>
          reference.figurePreviews?.[0]?.src.endsWith(
            `/drawing-sheet-${expectedSourcePdfPage}.png`,
          ),
        ),
      ).toBe(true);
    }

    for (const sourceSheet of sourceSheets) {
      const path = resolve(
        process.cwd(),
        "public/patents/figures/us-120057-gramme-dynamo",
        sourceSheet.filename,
      );
      expect(existsSync(path)).toBe(true);
      const bytes = new Uint8Array(await Bun.file(path).arrayBuffer());
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheet.sha256);
      const png = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      expect({ width: png.getUint32(16), height: png.getUint32(20) }).toEqual({
        width: 1392,
        height: 2045,
      });
    }

    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-120057-gramme-dynamo.md"),
      "utf8",
    );
    expect(provenance).toContain("## Source-sheet acceptance (2026-09-04)");
    expect(provenance).toContain("31 authored figure-reference nodes");
    for (const sourceSheet of sourceSheets) {
      expect(provenance).toContain(sourceSheet.filename);
      expect(provenance).toContain(sourceSheet.sha256);
    }

    for (const preview of [
      ...Object.values(grammeDynamoPreservedLegacyFigureCrops.figures),
      grammeDynamoPreservedLegacyFigureCrops.figure14Label,
    ]) {
      expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
    }
  });

  test("does not leave a source figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+|\bFigure\s+\d+/i;

    for (const block of grammeDynamoArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("pins the record to the reviewed transcription, all claims, and both named inventors", () => {
    expect(grammeDynamoPatent.archivalEdition).toBe(grammeDynamoArchivalEdition);
    expect(grammeDynamoPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-120057-gramme-dynamo-reviewed.txt",
      pageCount: 9,
      kind: "reviewed-transcription",
      sourcePdfSha256: grammeDynamoArchivalEdition.sourcePdfSha256,
    });
    expect(grammeDynamoPatent.inventors).toEqual([
      "Zénobe Théophile Gramme",
      "Eardley Louis Charles d’Ivernois",
    ]);
    expect(grammeDynamoPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });

  test("keeps canonical claim text sourced from explicit edition blocks", () => {
    const editionClaims = grammeDynamoArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof grammeDynamoArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    const editionClaimNumbers = editionClaims.map((claim) => claim.number);
    const canonicalClaims = grammeDynamoPatent.claims;

    expect(editionClaimNumbers).toEqual([1, 2, 3]);
    expect(new Set(editionClaimNumbers).size).toBe(editionClaimNumbers.length);
    expect(canonicalClaims.map((claim) => claim.number)).toEqual(editionClaimNumbers);
    expect(canonicalClaims.map((claim) => claim.originalText)).toEqual(
      editionClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    expect(grammeDynamoPatent.stats).toEqual({ totalClaims: 3, independentClaims: 3 });
    expect(grammeDynamoPatent.stats?.totalClaims).toBe(canonicalClaims.length);
    expect(grammeDynamoPatent.stats?.independentClaims).toBe(
      canonicalClaims.filter((claim) => claim.isIndependent).length,
    );
    const includedClaimNumbers = new Set(canonicalClaims.map((claim) => claim.number));
    for (const claim of canonicalClaims) {
      for (const dependency of claim.dependsOn ?? []) {
        expect(includedClaimNumbers.has(dependency)).toBe(true);
      }
    }

    const canonicalRecordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/gramme-dynamo.ts"),
      "utf8",
    );
    expect(canonicalRecordSource).toContain("function manualClaimText");
    expect(canonicalRecordSource).toContain("grammeDynamoArchivalEdition.blocks.find");
    expect(canonicalRecordSource).not.toContain("const MANUALLY_REVIEWED_CLAIM_TEXT");
    for (const claimNumber of editionClaimNumbers) {
      expect(canonicalRecordSource).toContain(`originalText: manualClaimText(${claimNumber}),`);
    }
  });

  test("keeps the reviewed text asset complete through the three printed claims and witnesses", async () => {
    const transcript = await Bun.file(
      "public/patents/transcripts/us-120057-gramme-dynamo-reviewed.txt",
    ).text();

    expect(transcript).toContain("1. The employment, in magneto-electric machines");
    expect(transcript).toContain(
      "2. The arrangements described for allowing of giving rise to alternate or opposite",
    );
    expect(transcript).toContain("3. The general arrangement and combination of parts");
    expect(transcript).toContain("AUGUSTE MEDARD.");
  });

  test("exports literal, patent-local non-lossy readings for every authored source paragraph", () => {
    const paragraphIndexes = grammeDynamoArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(grammeDynamoParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(companionIndexes).toEqual(paragraphIndexes);
    for (const reading of Object.values(grammeDynamoParallelReadings)) {
      expect(reading).toHaveLength(1);
      expect(reading[0]).not.toContain("$\\");
      expect(reading[0].trim().length).toBeGreaterThan(80);
    }
    expect(grammeDynamoParallelReadings[49][0]).toContain("Fig. 11");
    expect(grammeDynamoParallelReadings[51][0]).toContain("first to beginning of third");
    expect(grammeDynamoParallelReadings[59][0]).toContain("inside or outside");
  });

  test("provides valid provenance classifications for all Gramme Dynamo controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-120057-gramme-dynamo"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Gramme Dynamo", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-120057-gramme-dynamo"]).toBeDefined();
    expect(energyChannelsFor("us-120057-gramme-dynamo", {})).toEqual([]);
  });

  test("keeps the complete source edition available while archival audit evidence is reconciled", () => {
    expect(completeArchivalEditionForViewer(grammeDynamoPatent)).toBe(grammeDynamoArchivalEdition);
    expect(patentForSourceReader(grammeDynamoPatent).archivalEdition).toBe(
      grammeDynamoArchivalEdition,
    );
  });
});
