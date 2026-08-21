import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { kilbyIntegratedCircuitPatent } from "../patents/kilby-integrated-circuit";
import {
  kilbyIntegratedCircuitArchivalEdition,
  kilbyIntegratedCircuitParallelReadings,
  manualKilbyClaimText,
} from "./kilbyIntegratedCircuitEdition";

describe("US 3,138,743 Jack S. Kilby Monolithic Integrated Circuit Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-3138743-kilby-integrated-circuit.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-3138743-kilby-integrated-circuit-reviewed.txt",
  );

  test("attaches the reviewed archival edition and source asset to the public record", () => {
    expect(kilbyIntegratedCircuitPatent.archivalEdition).toBeDefined();
    expect(kilbyIntegratedCircuitPatent.originalTextAsset).toBeDefined();
  });

  test("passes full curated specification validation suite with zero errors", () => {
    const result = validateCuratedSpecificationEdition(kilbyIntegratedCircuitArchivalEdition);
    expect(result).toEqual({ valid: true, errors: [] });
  });

  test("matches the cryptographic SHA-256 digest of the pinned 9-page USPTO facsimile PDF", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const computedDigest = createHash("sha256").update(buffer).digest("hex");

    expect(kilbyIntegratedCircuitArchivalEdition.sourcePdfSha256).toBe(
      "e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef",
    );
    expect(computedDigest).toBe(kilbyIntegratedCircuitArchivalEdition.sourcePdfSha256);
  });

  test("pins and validates the 9-page reviewed ledger transcript", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 9; page++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 9 ---`);
    }
  });

  test("verifies all referenced source figure crops exist on disk", () => {
    for (const block of kilbyIntegratedCircuitArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "reference" && inline.figurePreviews) {
            for (const prev of inline.figurePreviews) {
              const cropPath = join(rootDir, "public", prev.src.replace(/^\//, ""));
              expect(existsSync(cropPath)).toBe(true);
            }
          }
        }
      }
    }
  });

  test("binds Figs. 1 and 2 to distinct, tightly framed source crops", () => {
    const references = kilbyIntegratedCircuitArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" &&
            inline.referenceType === "figure" &&
            ["Fig. 1", "Fig. 2"].includes(inline.text)
              ? [inline]
              : [],
          )
        : [],
    );
    expect(
      references.map((reference) =>
        reference.kind === "reference" ? reference.figurePreviews?.[0]?.src : undefined,
      ),
    ).toEqual([
      "/patents/figures/us-3138743-kilby-integrated-circuit/fig-1-source-crop-v2.png",
      "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v2.png",
    ]);
  });

  test("exposes all 25 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 25; c++) {
      const textVal = manualKilbyClaimText(c);
      expect(textVal).toBeDefined();
      expect(textVal.length).toBeGreaterThan(20);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = kilbyIntegratedCircuitArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndexes) {
      const readings = kilbyIntegratedCircuitParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0].trim().length).toBeGreaterThan(40);
    }
  });
});
