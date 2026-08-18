import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  HOWE_SEWING_MACHINE_PARALLEL_READINGS,
  howeSewingMachineArchivalEdition,
} from "./us-4750-howe-sewing-machine";

describe("US 4,750 Howe manual archival edition", () => {
  test("pins the reviewed six-sheet facsimile and represents every printed claim", () => {
    expect(validateCuratedSpecificationEdition(howeSewingMachineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(howeSewingMachineArchivalEdition.sourcePdfSha256).toBe(
      "8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053",
    );
    expect(howeSewingMachineArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      howeSewingMachineArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("uses authored figure references with local source-facsimile previews", () => {
    const referencedFigures = new Set<number>();
    for (const block of howeSewingMachineArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews?.length).toBeGreaterThan(0);
        for (const preview of inline.figurePreviews ?? []) {
          expect(preview.src).toStartWith("/patents/figures/us-4750-howe-sewing-machine-");
          expect(existsSync(join(process.cwd(), "public", preview.src))).toBe(true);
          const match = preview.src.match(/fig-(\d+)-/);
          if (match?.[1]) referencedFigures.add(Number(match[1]));
        }
      }
    }
    expect([...referencedFigures].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("keeps page ledgers and raw source text out of the published continuous edition", () => {
    const publicText = JSON.stringify(howeSewingMachineArchivalEdition.blocks);
    expect(publicText).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("source-text/us-4750-howe-sewing-machine");
  });

  test("gives every authored Howe paragraph a patent-local, non-lossy companion", () => {
    const paragraphIndexes = howeSewingMachineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(HOWE_SEWING_MACHINE_PARALLEL_READINGS).map(Number);

    expect(companionIndexes.sort((left, right) => left - right)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      const block = howeSewingMachineArchivalEdition.blocks[index];
      if (!block || block.kind !== "paragraph") throw new Error(`Expected paragraph ${index}`);

      const companion = HOWE_SEWING_MACHINE_PARALLEL_READINGS[index];
      expect(companion).toBeArray();
      expect(companion.join(" ").trim().length).toBeGreaterThan(0);

      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const companionWords = companion.join(" ").trim().split(/\s+/).length;
      if (sourceWords >= 100) {
        expect(companionWords / sourceWords).toBeGreaterThanOrEqual(0.3);
      }
    }
  });
});
