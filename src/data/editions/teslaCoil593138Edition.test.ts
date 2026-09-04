import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "@/data/editions/archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "@/data/editions/figureOccurrenceSourceLocators";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { teslaCoil593138Patent } from "@/data/patents/tesla-coil-593138";
import {
  teslaCoil593138ArchivalEdition,
  teslaCoil593138ParallelReadings,
} from "./teslaCoil593138Edition";

describe("US 593,138 Electrical Transformer manual source edition", () => {
  test("pins the reviewed four-page facsimile and its four exact claim nodes", () => {
    expect(validateCuratedSpecificationEdition(teslaCoil593138ArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(teslaCoil593138ArchivalEdition.sourcePdfSha256).toBe(
      "393b0a9cee0baa191c5cf8fac0f65738b9d77ce5318e74324b4792aaf17ddf44",
    );
    const pdf = readFileSync(`${process.cwd()}/public${teslaCoil593138Patent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      teslaCoil593138ArchivalEdition.sourcePdfSha256,
    );
    expect(
      teslaCoil593138ArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4]);
  });

  test("binds the canonical record and its exact claim text to the authored edition", () => {
    expect(teslaCoil593138Patent.id).toBe("us-593138-tesla-coil");
    expect(teslaCoil593138Patent.patentNumber).toBe("US 593,138");
    expect(teslaCoil593138Patent.archivalEdition).toBe(teslaCoil593138ArchivalEdition);
    expect(teslaCoil593138Patent.filingDate).toBe("1897-03-20");
    expect(teslaCoil593138Patent.stats).toEqual({ totalClaims: 4, independentClaims: 4 });
    const editionClaims = teslaCoil593138ArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof teslaCoil593138ArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(teslaCoil593138Patent.claims.map((claim) => claim.originalText)).toEqual(
      editionClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of teslaCoil593138Patent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
    }
  });

  test("makes every figure citation an explicit complete source-sheet preview", () => {
    const references = teslaCoil593138ArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : block.kind === "figure-sheet"
          ? block.description.filter(
              (
                inline,
              ): inline is Extract<(typeof block.description)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
    );
    expect(references.length).toBeGreaterThanOrEqual(7);
    const previewSources = new Set<string>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toMatch(
          /^\/patents\/figures\/us-593138-tesla-coil\/source-sheet-[12]\.png$/,
        );
        expect(preview).toMatchObject({ width: 2320, height: 3408 });
        expect(preview.alt).toContain("Complete upright source drawing sheet");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        previewSources.add(preview.src);
      }
    }
    expect([...previewSources].sort()).toEqual([
      "/patents/figures/us-593138-tesla-coil/source-sheet-1.png",
      "/patents/figures/us-593138-tesla-coil/source-sheet-2.png",
    ]);
    const sourceSheets = [
      {
        file: "source-sheet-1.png",
        sha256: "1cd9e455b7277744b52865ac27aba4b43180494bb608c2c33d69c59bc371004a",
      },
      {
        file: "source-sheet-2.png",
        sha256: "a7112e2d25055cb226c93504977020e5322e68005a61744b6506e3bb282b49d7",
      },
    ];
    for (const sourceSheet of sourceSheets) {
      const bytes = readFileSync(
        resolve(process.cwd(), "public/patents/figures/us-593138-tesla-coil", sourceSheet.file),
      );
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceSheet.sha256);
      expect({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }).toEqual({
        width: 2320,
        height: 3408,
      });
    }
    for (const legacyCrop of [
      "fig-1-source-crop-v2.png",
      "fig-2-source-crop-v2.png",
      "fig-3-source-crop-v3.png",
    ]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-593138-tesla-coil", legacyCrop),
        ),
      ).toBe(true);
    }
  });

  test("accepts all eleven source citations internally without gating the source edition", () => {
    const patentId = teslaCoil593138Patent.id;
    const decision = evaluateArchivalPublicationState(teslaCoil593138Patent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 11,
      acceptedFigureCount: 11,
    });
    expect(decision.figureManifest.figures.every((figure) => figure.status === "accepted")).toBe(
      true,
    );
    expect(completeArchivalEditionForViewer(teslaCoil593138Patent)).toBe(
      teslaCoil593138ArchivalEdition,
    );
    expect(
      (ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS as Record<string, unknown>)[patentId],
    ).toMatchObject({
      sourcePdfSha256: teslaCoil593138ArchivalEdition.sourcePdfSha256,
      reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
      reviewedAt: "2026-09-03",
      acceptedOccurrenceCount: 11,
      assets: {
        "/patents/figures/us-593138-tesla-coil/source-sheet-1.png": {
          sha256: "1cd9e455b7277744b52865ac27aba4b43180494bb608c2c33d69c59bc371004a",
          width: 2320,
          height: 3408,
        },
        "/patents/figures/us-593138-tesla-coil/source-sheet-2.png": {
          sha256: "a7112e2d25055cb226c93504977020e5322e68005a61744b6506e3bb282b49d7",
          width: 2320,
          height: 3408,
        },
      },
    });
    const locators = (FIGURE_OCCURRENCE_SOURCE_LOCATORS as Record<string, readonly unknown[]>)[
      patentId
    ];
    expect(locators).toHaveLength(11);
    for (const locator of locators ?? []) {
      expect(locator).toMatchObject({
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
      });
    }
  });

  test("covers every source paragraph with a non-lossy local companion and preserves the review ledger", () => {
    for (const [index, block] of teslaCoil593138ArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = teslaCoil593138ParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(40);
    }
    const serialized = JSON.stringify(teslaCoil593138ArchivalEdition);
    expect(serialized).not.toContain("source-pdf-text-layer");
    expect(serialized).not.toContain("raw HTML");
    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-593138-tesla-coil.md"),
      "utf8",
    );
    expect(provenance).toContain("Two complete visual passes");
    expect(provenance).toContain("Claims 1–4");
    expect(provenance).toContain("source-sheet-2.png");
  });
});
