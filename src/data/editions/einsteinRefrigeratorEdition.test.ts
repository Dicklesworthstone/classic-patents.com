import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "@/data/editions/archivalFigureAcceptance";
import { FIGURE_OCCURRENCE_SOURCE_LOCATORS } from "@/data/editions/figureOccurrenceSourceLocators";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "@/data/editions/publicationApproval";
import { einsteinRefrigeratorPatent } from "@/data/patents/einstein-refrigerator";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  einsteinRefrigeratorArchivalEdition,
  einsteinRefrigeratorParallelReadings,
} from "./einsteinRefrigeratorEdition";

describe("einsteinRefrigeratorArchivalEdition", () => {
  test("pins the complete four-page facsimile and its five printed claims", () => {
    expect(validateCuratedSpecificationEdition(einsteinRefrigeratorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(einsteinRefrigeratorArchivalEdition.sourcePdfSha256).toBe(
      "5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4",
    );
    const masthead = einsteinRefrigeratorArchivalEdition.blocks.find(
      (block) => block.kind === "masthead",
    );
    expect(masthead?.kind === "masthead" && masthead.lines).toContain("1,781,541.");
    expect(
      einsteinRefrigeratorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("uses a complete local source sheet for every explicit source-drawing reference", () => {
    const references = einsteinRefrigeratorArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(references).toHaveLength(2);
    for (const reference of references) {
      expect(reference.figurePreviews).toHaveLength(1);
      const [preview] = reference.figurePreviews ?? [];
      expect(preview?.src).toBe(
        "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png",
      );
      expect(preview?.width).toBe(2320);
      expect(preview?.height).toBe(3408);
      expect(preview?.alt).toContain("Complete upright source drawing sheet 1 of 1");
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
    expect(
      existsSync(
        resolve(
          process.cwd(),
          "public/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png",
        ),
      ),
    ).toBe(true);
  });

  test("internally accepts complete source-sheet evidence without gating the source edition", () => {
    const patentId = einsteinRefrigeratorPatent.id;
    const decision = evaluateArchivalPublicationState(einsteinRefrigeratorPatent);
    expect(decision.isPublished).toBe(true);
    expect(decision.reasonCode).toBe("ACCEPTED");
    expect(decision.figureManifest).toMatchObject({
      requiredFigureCount: 2,
      acceptedFigureCount: 2,
    });
    expect(completeArchivalEditionForViewer(einsteinRefrigeratorPatent)).toBe(
      einsteinRefrigeratorArchivalEdition,
    );
    expect(
      (ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS as Record<string, any>)[patentId],
    ).toMatchObject({
      sourcePdfSha256: einsteinRefrigeratorArchivalEdition.sourcePdfSha256,
      reviewedAt: "2026-09-03",
      acceptedOccurrenceCount: 2,
      assets: {
        "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png": {
          sha256: "8ad5c0284168c3bc123b82b79693f49e1774dcb16c93b8b90c708bf0e2483a05",
          width: 2320,
          height: 3408,
        },
      },
    });
    expect((FIGURE_OCCURRENCE_SOURCE_LOCATORS as Record<string, any>)[patentId]).toEqual([
      expect.objectContaining({
        occurrenceKey: "edition-block-2-group-0-inline-1",
        activeAsset: "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png",
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
      }),
      expect.objectContaining({
        occurrenceKey: "edition-block-3-group-0-inline-1",
        activeAsset: "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png",
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
      }),
    ]);
  });

  test("presents the source as continuous prose rather than a scan-sheet card", () => {
    expect(
      einsteinRefrigeratorArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
  });

  test("keeps the canonical claim set and parallel reading map source-faithful", () => {
    expect(einsteinRefrigeratorPatent.archivalEdition).toBe(einsteinRefrigeratorArchivalEdition);
    expect(einsteinRefrigeratorPatent.stats).toMatchObject({
      totalClaims: 5,
      independentClaims: 5,
    });
    expect(einsteinRefrigeratorPatent.stats?.impactScore).toBeUndefined();
    expect(einsteinRefrigeratorPatent.claims.map((claim) => claim.originalText)).toEqual(
      einsteinRefrigeratorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
    expect(archivalParallelReadingsFor(einsteinRefrigeratorPatent.id)).toBe(
      einsteinRefrigeratorParallelReadings,
    );
    expect(JSON.stringify(einsteinRefrigeratorPatent)).not.toContain("240,436");
    expect(JSON.stringify(einsteinRefrigeratorPatent)).not.toContain("Magnetohydrodynamic");
  });

  test("provides valid provenance classifications for all Einstein controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1781541-einstein-refrigerator"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ heatInput: 220, totalPressure: 15 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("pins every published source block to the reviewed ledger and PDF", () => {
    const asset = einsteinRefrigeratorPatent.originalTextAsset;
    if (!asset?.sourcePdfSha256) throw new Error("US 1,781,541 lacks a pinned reviewed ledger.");

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${einsteinRefrigeratorPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    for (const block of einsteinRefrigeratorArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("pairs every source paragraph with an explicit non-lossy reading", () => {
    const paragraphIndexes = einsteinRefrigeratorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(einsteinRefrigeratorParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    expect(einsteinRefrigeratorParallelReadings[12]?.join(" ")).toContain("h₂");
  });
});
