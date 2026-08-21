import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { wattSeparateCondenserPatent } from "../patents/watt-separate-condenser";
import {
  manualWattClaimText,
  WATT_SEPARATE_CONDENSER_PARALLEL_READINGS,
  wattSeparateCondenserArchivalEdition,
} from "./wattSeparateCondenserEdition";

describe("Watt Separate Condenser source-identity hold", () => {
  const root = process.cwd();

  test("preserves the currently pinned reconstruction fingerprint for provenance", () => {
    const pdfPath = resolve(
      root,
      "public",
      "patents",
      "pdfs",
      "gb-913-watt-separate-condenser.pdf",
    );
    expect(existsSync(pdfPath)).toBe(true);

    const buf = readFileSync(pdfPath);
    const sha = createHash("sha256").update(buf).digest("hex");
    expect(sha).toBe(wattSeparateCondenserArchivalEdition.sourcePdfSha256);
    expect(sha).toBe("ba8638c99df583d72958f9ef8125bc30cd4e0f8784656cd561aecdc58b8b8fad");
  });

  test("preserves the staged transcription as research evidence", () => {
    const txtPath = resolve(
      root,
      "public",
      "patents",
      "transcripts",
      "gb-913-watt-separate-condenser-reviewed.txt",
    );
    expect(existsSync(txtPath)).toBe(true);
    const content = readFileSync(txtPath, "utf-8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---");
    expect(content).toContain(
      "NEW INVENTED METHOD OF LESSENING THE CONSUMPTION OF STEAM AND FUEL IN FIRE ENGINES",
    );
    expect(content).toContain("these vessels I call condensers");
  });

  test("keeps the reconstruction and staged edition out of the public source face", () => {
    expect(wattSeparateCondenserPatent.originalTextAsset).toBeUndefined();
    expect(wattSeparateCondenserPatent.archivalEdition).toBeUndefined();
    expect(
      wattSeparateCondenserArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
  });

  test("retains the seven staged principles through dynamic single-source lookup", () => {
    for (let c = 1; c <= 7; c++) {
      const txt = manualWattClaimText(c);
      expect(typeof txt).toBe("string");
      expect(txt.length).toBeGreaterThan(25);
    }
    expect(manualWattClaimText(1)).toContain(
      "First, That vessel in which the powers of steam are to be employed",
    );
    expect(manualWattClaimText(2)).toContain("these vessels I call condensers");
    expect(manualWattClaimText(3)).toContain(
      "drawn out of the steam vessels or condensers by means of pumps",
    );
    expect(manualWattClaimText(7)).toContain(
      "employ oils, wax, resinous bodies, fat of animals, quicksilver",
    );
  });

  test("keeps staged parallel readings aligned with the unbound WIP blocks", () => {
    const keys = Object.keys(WATT_SEPARATE_CONDENSER_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) {
      const block = wattSeparateCondenserArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      const readings = WATT_SEPARATE_CONDENSER_PARALLEL_READINGS[key];
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].length).toBeGreaterThan(20);
    }
  });
});
