import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { daimlerEnginePatent } from "@/data/patents/daimler-engine";
import {
  DAIMLER_MARINE_ENGINE_PARALLEL_READINGS,
  daimlerMarineEngineArchivalEdition,
} from "./us-361931-daimler-engine";

describe("US 361,931 Daimler manual marine-engine edition", () => {
  test("pins the six-page facsimile and corrects the record to its printed subject", () => {
    expect(validateCuratedSpecificationEdition(daimlerMarineEngineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(daimlerMarineEngineArchivalEdition.sourcePdfSha256).toBe(
      "1c20cb38fad97fe6658cd711d7009dcb70da74af4cf22aec380882e055407159",
    );
    expect(daimlerMarineEngineArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(daimlerEnginePatent.title).toBe("Explosive-Gas Marine Engine");
    expect(daimlerEnginePatent.filingDate).toBe("1886-11-09");
    expect(daimlerEnginePatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-361931-daimler-engine-reviewed.txt",
      pageCount: 6,
      kind: "reviewed-transcription",
      sourcePdfSha256: daimlerMarineEngineArchivalEdition.sourcePdfSha256,
    });
  });

  test("represents each of the ten printed claims exactly once in record and edition", () => {
    const editionClaims = daimlerMarineEngineArchivalEdition.blocks
      .filter((block) => block.kind === "claim")
      .map((block) => ({
        number: block.number,
        originalText: block.inlines.map((inline) => inline.text).join(""),
      }));

    expect(editionClaims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(daimlerEnginePatent.claims.map((claim) => claim.number)).toEqual(
      editionClaims.map((claim) => claim.number),
    );
    expect(daimlerEnginePatent.claims.map((claim) => claim.originalText)).toEqual(
      editionClaims.map((claim) => claim.originalText),
    );
    expect(daimlerEnginePatent.stats).toMatchObject({ totalClaims: 10, independentClaims: 10 });
  });

  test("maps every cited figure to its own source-faithful crop, never a whole drawing sheet", () => {
    const expectedCropByFigure = {
      1: "/patents/figures/us-361931-daimler-engine/fig-1-source-crop-v1.png",
      2: "/patents/figures/us-361931-daimler-engine/fig-2-source-crop-v2.png",
      3: "/patents/figures/us-361931-daimler-engine/fig-3-source-crop-v1.png",
      4: "/patents/figures/us-361931-daimler-engine/fig-4-source-crop-v1.png",
      "4a": "/patents/figures/us-361931-daimler-engine/fig-4a-source-crop-v1.png",
      "4b": "/patents/figures/us-361931-daimler-engine/fig-4b-source-crop-v1.png",
      5: "/patents/figures/us-361931-daimler-engine/fig-5-source-crop-v2.png",
      6: "/patents/figures/us-361931-daimler-engine/fig-6-source-crop-v1.png",
    } as const;
    const previewSources = new Set<string>();
    for (const block of daimlerMarineEngineArchivalEdition.blocks) {
      const inlineGroups =
        block.kind === "paragraph" || block.kind === "claim"
          ? [block.inlines]
          : block.kind === "figure-sheet"
            ? [block.description]
            : [];
      for (const inlines of inlineGroups) {
        for (const inline of inlines) {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
          const sourceFigures = inline.text.match(/\b\d+[ab]?\b/gi) ?? [];
          const citedPreviewSources = new Set(inline.figurePreviews?.map((preview) => preview.src));
          for (const figureNumber of sourceFigures) {
            expect(citedPreviewSources).toContain(
              expectedCropByFigure[figureNumber.toLowerCase() as keyof typeof expectedCropByFigure],
            );
          }
          for (const preview of inline.figurePreviews ?? []) {
            previewSources.add(preview.src);
            expect(existsSync(join(process.cwd(), "public", preview.src))).toBe(true);
          }
        }
      }
    }
    expect([...previewSources].sort()).toEqual([...Object.values(expectedCropByFigure)].sort());
  });

  test("keeps every source figure citation as an authored preview node", () => {
    const bareFigureReference = /\b(?:fig(?:s)?\.?|figure)\s+\d+/i;
    for (const block of daimlerMarineEngineArchivalEdition.blocks) {
      const inlineGroups =
        block.kind === "paragraph" || block.kind === "claim"
          ? [block.inlines]
          : block.kind === "figure-sheet"
            ? [block.description]
            : [];
      for (const inlines of inlineGroups) {
        for (const inline of inlines) {
          if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureReference);
        }
      }
    }
  });

  test("has a reviewed full transcription with formal drawing matter and no carriage heading", () => {
    const transcript = readFileSync(
      join(process.cwd(), "public/patents/transcripts/us-361931-daimler-engine-reviewed.txt"),
      "utf8",
    );
    expect(transcript).toContain("EXPLOSIVE-GAS MARINE ENGINE.");
    expect(transcript).toContain("Application filed November 9, 1886. Serial No. 218,411.");
    expect(transcript).toContain("10. In a vessel propelled by a gas motor-engine");
    expect(transcript).toContain("N. Peters, Photo-Lithographer, Washington, D.C.");
    expect(transcript).not.toContain("MOTOR-CARRIAGE.");
  });

  test("keeps the visible Daimler visual lane source-bounded to the marine installation", () => {
    const visualSources = [
      "src/components/patents/visuals/DaimlerEngineSim.tsx",
      "src/components/patents/visuals/three/DaimlerEngine3D.tsx",
      "src/components/patents/visuals/three/daimlerEngineModel.ts",
    ].map((path) => readFileSync(join(process.cwd(), path), "utf8").toLowerCase());
    for (const source of visualSources) {
      expect(source).not.toMatch(
        /hot[- ]?tube|standuhr|bmep|flywheel|crankcase|motor[- ]?carriage|automobile/,
      );
    }
    expect(visualSources.every((source) => source.includes("shaftposition"))).toBe(true);
    expect(visualSources.every((source) => source.includes("coolingpumpenabled"))).toBe(true);
  });

  test("gives every authored source paragraph a patent-local, non-lossy companion", () => {
    const paragraphIndexes = daimlerMarineEngineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(DAIMLER_MARINE_ENGINE_PARALLEL_READINGS).map(Number);
    expect(companionIndexes.sort((left, right) => left - right)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      const block = daimlerMarineEngineArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph") throw new Error(`Expected paragraph ${index}`);

      const companion = DAIMLER_MARINE_ENGINE_PARALLEL_READINGS[index];
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
