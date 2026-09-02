import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { mccormickReaperPatent } from "../patents/mccormick-reaper";
import {
  mccormickReaperArchivalEdition,
  mccormickReaperParallelReadings,
} from "./mccormickReaperEdition";

const servedFigureUrl = "/patents/figures/us-x8277-mccormick-reaper-drawing-preview-v2.png";
const servedFigurePath = join(process.cwd(), "public", servedFigureUrl.replace(/^\//, ""));
const servedFigureSha256 = "d149fb663fe501a72fc49521f7a1b6293e7fa982c014b24c37ef0c82ff3748ea";

function pngDimensions(path: string): { width: number; height: number } {
  const bytes = readFileSync(path);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("mccormickReaperArchivalEdition", () => {
  test("pins the entire three-sheet facsimile in a continuous manual edition", () => {
    expect(validateCuratedSpecificationEdition(mccormickReaperArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(mccormickReaperArchivalEdition.sourcePdfSha256).toBe(
      "24712ca3e966994d72716ccca6df6ef9a1fb3751b30fe34bfeb549ab6ba7f400",
    );
    expect(mccormickReaperArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = mccormickReaperArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1, 2]);
  });

  test("keeps scan-page metadata and OCR output out of visitor-facing nodes", () => {
    const publicText = JSON.stringify(mccormickReaperArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("OCR");
    expect(publicText).not.toContain("Application filed April 19");
  });

  test("pins the served source drawing crop, dimensions, digest, and semantic mapping", () => {
    expect(existsSync(servedFigurePath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(servedFigurePath)).digest("hex")).toBe(
      servedFigureSha256,
    );
    expect(pngDimensions(servedFigurePath)).toEqual({ width: 3000, height: 1900 });

    const preview = mccormickReaperArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") {
        const inlines = Array.isArray(block.description) ? block.description : [];
        return inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      if ("inlines" in block && Array.isArray(block.inlines)) {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      return [];
    })[0];
    expect(preview).toMatchObject({
      src: servedFigureUrl,
      width: 3000,
      height: 1900,
    });
    expect(preview?.width).toBeGreaterThan(preview?.height ?? Number.POSITIVE_INFINITY);

    const figureSheet = mccormickReaperArchivalEdition.blocks.find(
      (block) => block.kind === "figure-sheet",
    );
    expect(figureSheet?.kind).toBe("figure-sheet");
    if (figureSheet?.kind !== "figure-sheet") throw new Error("McCormick figure sheet is missing.");
    const figureReference = figureSheet.description.find((inline) => inline.kind === "reference");
    expect(figureReference).toMatchObject({
      kind: "reference",
      referenceType: "figure",
      text: "The single drawing sheet",
      figurePreviews: [{ src: servedFigureUrl }],
    });

    const drawing = mccormickReaperPatent.drawings.find(
      (candidate) => candidate.figureNumber === "Unnumbered drawing sheet",
    );
    expect(drawing?.svgType).toBe("mccormick-reaper");
    expect(drawing?.callouts.map((callout) => callout.label)).toEqual([
      "A",
      "B",
      "D",
      "L",
      "W",
      "T",
    ]);
    expect(drawing?.callouts.map((callout) => callout.element)).toEqual([
      "Platform",
      "Tongue",
      "Cross-bar",
      "Divider",
      "Reel",
      "Cutter",
    ]);
  });

  test("provides a non-lossy companion reading for every rendered paragraph block only", () => {
    const paragraphIndexes = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14];
    expect(Object.keys(mccormickReaperParallelReadings).map(Number)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      expect(mccormickReaperParallelReadings[index]).toBeDefined();
      expect(mccormickReaperParallelReadings[index][0].length).toBeGreaterThan(30);
    }
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    expect(mccormickReaperPatent.claims.length).toBe(2);
    const editionClaims = mccormickReaperArchivalEdition.blocks.filter(
      (b): b is Extract<typeof b, { kind: "claim" }> => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(2);

    for (let i = 0; i < 2; i++) {
      const editionBlock = editionClaims[i];
      const expectedText = editionBlock.inlines.map((inl) => inl.text).join("");
      expect(mccormickReaperPatent.claims[i].originalText).toBe(expectedText);
    }
  });

  test("binds canonical reviewed ledger with complete ordered page markers", () => {
    const sourceAsset = mccormickReaperPatent.originalTextAsset;
    expect(sourceAsset).toBeDefined();
    expect(sourceAsset?.url).toBe("/patents/transcripts/us-x8277-mccormick-reaper-reviewed.txt");
    const ledgerPath = join(process.cwd(), `public${sourceAsset?.url}`);
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    expect(ledger).toContain("CYRUS H. McCORMICK");
  });

  test("provides valid provenance classifications for all McCormick reaper controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x8277-mccormick-reaper"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ forwardSpeedMph: 2.5 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason and returns empty channels", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-x8277-mccormick-reaper"]).toBeDefined();
    expect(energyChannelsFor("us-x8277-mccormick-reaper", {})).toEqual([]);
  });
});
