import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { arkwrightWaterFramePatent } from "../patents/arkwright-water-frame";
import {
  ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS,
  arkwrightWaterFrameArchivalEdition,
  manualArkwrightClaimText,
} from "./arkwrightWaterFrameEdition";

describe("Richard Arkwright Water Frame Archival Edition Publication Contract", () => {
  const root = process.cwd();
  const pdfPath = resolve(root, "public/patents/pdfs/gb-931-arkwright-water-frame.pdf");
  const cropPath = resolve(
    root,
    "public/patents/figures/gb-931-arkwright-water-frame/fig-1-source-crop-v3.png",
  );
  const ledgerPath = resolve(
    root,
    "public/patents/transcripts/gb-931-arkwright-water-frame-reviewed.txt",
  );

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBuf = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBuf).digest("hex");
    expect(digest).toBe(arkwrightWaterFrameArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("3254894ae66cb4ddd2612d164e24af76f5efa8ee8ac6b741c8affc70d8fe62fd");
  });

  test("keeps the catalogue source face withheld pending independent acceptance", () => {
    expect(arkwrightWaterFramePatent.archivalEdition).toBeUndefined();
    expect(arkwrightWaterFramePatent.originalTextAsset).toBeUndefined();
  });

  test("maps Fig. 1 to the tightly bounded pinned-PDF-page-3 crop at exact path and pixels", () => {
    const figureReference = arkwrightWaterFrameArchivalEdition.blocks
      .filter((block) => block.kind === "paragraph")
      .flatMap((block) => block.inlines)
      .find(
        (inline) =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          inline.text === "Drawing hereunto annexed",
      );

    expect(figureReference?.kind).toBe("reference");
    if (figureReference?.kind !== "reference") {
      throw new Error("GB 931 must retain its authored Figure 1 reference.");
    }
    expect(figureReference.label).toContain("pinned-PDF-page-3");
    expect(figureReference.figurePreviews).toHaveLength(1);
    expect(figureReference.figurePreviews?.[0]).toEqual(
      expect.objectContaining({
        src: "/patents/figures/gb-931-arkwright-water-frame/fig-1-source-crop-v3.png",
        alt: "Tightly cropped upright Figure 1 water-frame mechanism from pinned PDF page 3, lettered A through G.",
        width: 1550,
        height: 1500,
      }),
    );

    expect(existsSync(cropPath)).toBe(true);
    const png = readFileSync(cropPath);
    expect(png.length).toBeGreaterThan(10000);
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1550);
    expect(png.readUInt32BE(20)).toBe(1500);
  });

  test("maps each drawing callout to the lettered marker in the tightly bounded page-3 crop", () => {
    expect(arkwrightWaterFramePatent.drawings).toContainEqual(
      expect.objectContaining({
        figureNumber: "1",
        title: "Water Frame Drawing Sheet (PDF Page 3)",
        callouts: [
          expect.objectContaining({ element: "A", x: 49, y: 88 }),
          expect.objectContaining({ element: "B", x: 21, y: 78 }),
          expect.objectContaining({ element: "C", x: 35, y: 19 }),
          expect.objectContaining({ element: "D", x: 27, y: 32 }),
          expect.objectContaining({ element: "E", x: 20, y: 46 }),
          expect.objectContaining({ element: "F", x: 29, y: 57 }),
          expect.objectContaining({ element: "G", x: 87, y: 66 }),
        ],
      }),
    );
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const content = readFileSync(ledgerPath, "utf-8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---");
    expect(content).toContain("RICHARD ARKWRIGHT");
    expect(content).toContain("Drawing out and attenuating cotton");
  });

  test("exposes all 4 claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 4; c++) {
      const claimText = manualArkwrightClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival blocks", () => {
    const _paragraphs = arkwrightWaterFrameArchivalEdition.blocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => block.kind === "paragraph");
    const keys = Object.keys(ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) {
      const block = arkwrightWaterFrameArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      const readings = ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS[key];
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].length).toBeGreaterThan(20);
    }
  });
});
