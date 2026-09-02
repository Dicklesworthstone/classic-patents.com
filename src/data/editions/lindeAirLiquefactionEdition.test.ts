import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lindeAirLiquefactionPatent } from "@/data/patents/linde-air-liquefaction";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  lindeAirLiquefactionArchivalEdition,
  lindeAirLiquefactionParallelReadings,
} from "./lindeAirLiquefactionEdition";

describe("US 727,650 Carl Linde Air Liquefaction manual archival edition", () => {
  test("pins the complete five-page facsimile and its fourteen printed claims", () => {
    expect(lindeAirLiquefactionPatent.archivalEdition).toBe(lindeAirLiquefactionArchivalEdition);
    expect(lindeAirLiquefactionArchivalEdition.sourcePdfSha256).toBe(
      "6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776",
    );
    expect(validateCuratedSpecificationEdition(lindeAirLiquefactionArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${lindeAirLiquefactionPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lindeAirLiquefactionArchivalEdition.sourcePdfSha256,
    );
    expect(lindeAirLiquefactionPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
  });

  test("makes the sole apparatus diagrammatic drawing available as a local crop", () => {
    const references = lindeAirLiquefactionArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews).toHaveLength(2);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-727650-linde-air-liquefaction/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
      expect(reference.figurePreviews).toContainEqual({
        src: "/patents/figures/us-727650-linde-air-liquefaction/fig-1-source-crop-v2.png",
        alt: "Upright source-facsimile crop of the sole apparatus drawing in US 727,650, excluding the witness and inventor-signature blocks.",
        width: 1640,
        height: 1500,
      });
      expect(reference.figurePreviews).toContainEqual({
        src: "/patents/figures/us-727650-linde-air-liquefaction/fig-1-left-pipe-source-crop-v2.png",
        alt: "Upright source-facsimile detail preserving the left-hand pipe and flow arrow cropped from the main US 727,650 apparatus preview.",
        width: 360,
        height: 120,
      });
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = lindeAirLiquefactionArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(lindeAirLiquefactionParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(lindeAirLiquefactionParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("does not misname Linde's counter-current route as the rejected refrigerant cascade", () => {
    const pressureDropReading = lindeAirLiquefactionParallelReadings[7]?.join(" ") ?? "";
    expect(pressureDropReading).toContain("earlier cascade of volatile refrigerants");
    expect(pressureDropReading).toContain("repeated counter-current cooling route");
    expect(pressureDropReading).not.toContain("regenerative cascade liquefaction");
  });

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = lindeAirLiquefactionPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-727650-linde-air-liquefaction-reviewed.txt",
      pageCount: 5,
      kind: "reviewed-transcription",
      sourcePdfSha256: lindeAirLiquefactionArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Linde reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 5)).toEqual({ valid: true });
  });

  test("provides valid provenance classifications for all Linde controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-727650-linde-air-liquefaction"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ inletPressureAtm: 75, coolerOutletC: 10 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason and avoids unsupported 45 kW plant model", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-727650-linde-air-liquefaction"]).toBeDefined();
    expect(energyChannelsFor("us-727650-linde-air-liquefaction", {})).toEqual([]);
  });
});
