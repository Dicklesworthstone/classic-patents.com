import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { bellPhotophonePatent } from "../patents/bell-photophone";
import {
  BELL_PHOTOPHONE_PARALLEL_READINGS,
  bellPhotophoneArchivalEdition,
  manualPhotophoneClaimText,
} from "./bellPhotophoneEdition";

const PINNED_SHA256 = "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85";

describe("US 235,199 Alexander Graham Bell Photophone Archival Edition Contract", () => {
  test("catalogue record remains unbound until the literal source edition and ledger are independently reviewed", () => {
    expect(bellPhotophonePatent.archivalEdition).toBeUndefined();
    expect(bellPhotophonePatent.originalTextAsset).toBeUndefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(bellPhotophoneArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-235199-bell-photophone.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 18 printed claims exactly matching manual claim text", () => {
    const claims = bellPhotophoneArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(18);

    for (let i = 1; i <= 18; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      const text = manualPhotophoneClaimText(i);
      expect(text.length).toBeGreaterThan(30);
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = bellPhotophoneArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews.length).toBeGreaterThanOrEqual(10);

    for (const preview of figurePreviews) {
      const relativePath = preview.src.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(preview.width).toBeGreaterThan(0);
      expect(preview.height).toBeGreaterThan(0);

      const png = fs.readFileSync(fullPath);
      expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(png.readUInt32BE(16)).toBe(preview.width);
      expect(png.readUInt32BE(20)).toBe(preview.height);
    }
  });

  test("uses upright source-faithful crops for every drawing-sheet-3 figure", () => {
    const figureReferences = bellPhotophoneArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const figurePreviews = figureReferences.flatMap((reference) => reference.figurePreviews ?? []);

    expect(figurePreviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/patents/figures/us-235199-bell-photophone/figs-16-and-17-source-crop-v5.png",
          width: 360,
          height: 560,
        }),
        ...(
          [
            [18, 500, 510],
            [19, 310, 480],
            [20, 280, 480],
            [21, 320, 480],
            [22, 260, 340],
            [23, 200, 340],
            [24, 230, 470],
          ] as const
        ).map(([number, width, height]) =>
          expect.objectContaining({
            src: `/patents/figures/us-235199-bell-photophone/fig-${number}-source-crop-v5.png`,
            width,
            height,
          }),
        ),
      ]),
    );

    expect(
      figureReferences.some(
        (reference) =>
          reference.text.includes("24") &&
          reference.figurePreviews?.some((preview) =>
            preview.src.endsWith("fig-24-source-crop-v5.png"),
          ),
      ),
    ).toBe(true);
  });

  test("uses individually reviewed upright source crops for Figures 14 and 15", () => {
    const figurePreviews = bellPhotophoneArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? (inline.figurePreviews ?? [])
              : [],
          )
        : [],
    );

    expect(figurePreviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/patents/figures/us-235199-bell-photophone/fig-14-source-crop-v4.png",
          width: 900,
          height: 1100,
        }),
        expect.objectContaining({
          src: "/patents/figures/us-235199-bell-photophone/fig-15-source-crop-v4.png",
          width: 700,
          height: 900,
        }),
      ]),
    );
  });

  test("every paragraph block has a corresponding parallel reading", () => {
    const paragraphIndices = bellPhotophoneArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    const readingIndices = Object.keys(BELL_PHOTOPHONE_PARALLEL_READINGS)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndices).toEqual(paragraphIndices);

    for (const idx of paragraphIndices) {
      const reading = BELL_PHOTOPHONE_PARALLEL_READINGS[idx];
      expect(reading).toBeDefined();
      expect(reading?.length).toBeGreaterThan(0);
      expect(reading?.[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("reviewed transcription ledger matches page boundary markers", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-235199-bell-photophone-reviewed.txt",
    );
    expect(fs.existsSync(ledgerPath)).toBe(true);
    const content = fs.readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 13; page++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 13 ---`);
    }
  });
});
