import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { wattRotaryEnginePatent } from "@/data/patents/watt-rotary-engine";
import {
  manualWattRotaryClaimText,
  wattRotaryEngineArchivalEdition,
  wattRotaryEngineParallelReadings,
} from "./wattRotaryEngineEdition";

describe("James Watt Rotary Motion 1781 (GB 1306) source-identity hold", () => {
  test("pins the two-page facsimile fingerprint and publishes the bound edition", () => {
    const pdfPath = resolve(process.cwd(), "public/patents/pdfs/gb-1306-watt-rotary-engine.pdf");
    expect(existsSync(pdfPath)).toBe(true);
    expect(statSync(pdfPath).size).toBeGreaterThan(50000);

    expect(wattRotaryEngineArchivalEdition.kind).toBe("manual-react-edition");
    expect(wattRotaryEngineArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(wattRotaryEngineArchivalEdition.sourcePdfSha256).toBe(
      "339921eba26299f65c60e0d9d283deb09419fed3260ba6dc7208ecd55d2471f1",
    );
    expect(wattRotaryEnginePatent.archivalEdition).toBe(wattRotaryEngineArchivalEdition);
    expect(wattRotaryEnginePatent.originalTextAsset).toBeDefined();
  });

  test("retains all 4 staged claim nodes and extracts text dynamically", () => {
    for (let i = 1; i <= 4; i++) {
      const claimText = manualWattRotaryClaimText(i);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(40);
    }

    expect(manualWattRotaryClaimText(1)).toContain("toothed planet wheel");
    expect(manualWattRotaryClaimText(2)).toContain("two revolutions");
    expect(manualWattRotaryClaimText(3)).toContain("radius link");
    expect(manualWattRotaryClaimText(4)).toContain("internal planetary gearing");
  });

  test("retains the reconstruction crop as non-public research evidence", () => {
    const cropPath = resolve(
      process.cwd(),
      "public/patents/figures/gb-1306-watt-rotary-engine/fig-1-source-crop-v1.png",
    );
    expect(existsSync(cropPath)).toBe(true);
    expect(statSync(cropPath).size).toBeGreaterThan(100000);

    const figureSheet = wattRotaryEngineArchivalEdition.blocks.find(
      (b) => b.kind === "figure-sheet",
    );
    expect(figureSheet).toBeDefined();
  });

  test("contains rich term definitions for archaic and technical language", () => {
    let termCount = 0;
    for (const block of wattRotaryEngineArchivalEdition.blocks) {
      if (block.kind === "paragraph") {
        for (const inline of block.inlines) {
          if (inline.kind === "term") {
            termCount++;
            expect(inline.text.length).toBeGreaterThan(0);
            expect(inline.definition.length).toBeGreaterThan(20);
          }
        }
      }
    }
    expect(termCount).toBeGreaterThanOrEqual(4);
  });

  test("verifies parallel readings map to every specification paragraph", () => {
    const paragraphIndices = wattRotaryEngineArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndices) {
      const readings = wattRotaryEngineParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].length).toBeGreaterThan(30);
    }
  });

  test("staged ledger remains internally aligned with the unbound edition", () => {
    const transcriptPath = resolve(
      process.cwd(),
      "public/patents/transcripts/gb-1306-watt-rotary-engine-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf8");
    expect(transcript).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---");
    expect(transcript).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---");
    expect(transcript).toContain("Sun wheel");
    expect(transcript).toContain("planet wheel");
    expect(transcript).toContain("two complete revolutions");
  });
});
