import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lamarrPatent } from "@/data/patents/lamarr-frequency-hopping";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";
import {
  lamarrFrequencyHoppingArchivalEdition,
  lamarrFrequencyHoppingParallelReadings,
} from "./lamarrFrequencyHoppingEdition";
import { completeArchivalEditionForViewer } from "./publicationApproval";

const FIGURE_DIRECTORY = resolve(
  process.cwd(),
  "public/patents/figures/us-2292387-lamarr-frequency-hopping",
);
const SOURCE_SHEETS = {
  1: {
    filename: "source-sheet-1-v1.png",
    sha256: "9a53787fc9b2315de7d6bec159b9de1a696e08926098bb6649e18ddafd945591",
  },
  2: {
    filename: "source-sheet-2-v1.png",
    sha256: "5c9297937ebcc0fb659118588069ac494485d1a4e9fc51bf6c9fe8048d3669c7",
  },
} as const;

function activeFigurePreviews() {
  return lamarrFrequencyHoppingArchivalEdition.blocks.flatMap((block) => {
    const inlineGroups =
      block.kind === "paragraph" || block.kind === "claim"
        ? [block.inlines]
        : block.kind === "figure-sheet"
          ? [block.description]
          : block.kind === "table"
            ? [...block.headers, ...block.rows.flat()]
            : [];
    return inlineGroups.flatMap((inlines) =>
      inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure"
          ? (inline.figurePreviews ?? [])
          : [],
      ),
    );
  });
}

describe("US 2,292,387 manual source edition", () => {
  test("retains all seven source sheets and every printed claim for continued authoring", () => {
    expect(validateCuratedSpecificationEdition(lamarrFrequencyHoppingArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lamarrFrequencyHoppingArchivalEdition.sourcePdfSha256,
    );
    expect(lamarrPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(
      lamarrPatent.claims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 4]);
    expect(lamarrPatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "Fig. 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
      "Fig. 7",
    ]);
    expect(lamarrPatent.drawings.every((drawing) => drawing.callouts.length === 0)).toBe(true);
  });

  test("keeps the source distinctions in the two repaired companion readings", () => {
    expect(lamarrFrequencyHoppingParallelReadings[6]?.[0]).toContain(
      "calibrated constant-speed spring motors",
    );
    expect(lamarrFrequencyHoppingParallelReadings[6]?.[0]).toContain("clocks and chronometers");
    expect(lamarrFrequencyHoppingParallelReadings[6]?.[0]).toContain(
      "automatic telegraphy and television",
    );
    expect(lamarrFrequencyHoppingParallelReadings[24]?.[0]).toContain("D, E, F, and G");
    expect(lamarrFrequencyHoppingParallelReadings[24]?.[0]).toContain("A, B, and C");
  });

  test("derives the canonical claims from authored claim nodes", () => {
    const authored = lamarrFrequencyHoppingArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof lamarrFrequencyHoppingArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(lamarrPatent.claims.map((claim) => claim.originalText)).toEqual(
      authored.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("retains a non-lossy, claim-specific reading for every substantial legal combination", () => {
    for (const claim of lamarrPatent.claims) {
      const sourceWords = claim.originalText.trim().split(/\s+/).length;
      const readingWords = claim.plainEnglish.trim().split(/\s+/).length;
      if (sourceWords >= 75) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("pairs every source paragraph and points every figure reference at a local source sheet", () => {
    const paragraphIndexes = lamarrFrequencyHoppingArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(lamarrFrequencyHoppingParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    const figures = lamarrFrequencyHoppingArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    expect(new Set(figures.map((figure) => figure.text))).toEqual(
      new Set(["Fig. 1", "Fig. 2", "Fig. 3", "Fig. 4", "Fig. 5", "Fig. 6", "Fig. 7"]),
    );
    for (const figure of figures) {
      const preview = figure.figurePreviews?.[0];
      expect(preview).toBeDefined();
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
  });

  test("binds all active figure citations to direct, complete source sheets", () => {
    for (const sourceSheet of Object.values(SOURCE_SHEETS)) {
      const source = readFileSync(resolve(FIGURE_DIRECTORY, sourceSheet.filename));
      expect(createHash("sha256").update(source).digest("hex")).toBe(sourceSheet.sha256);
      expect(source.readUInt32BE(16)).toBe(2320);
      expect(source.readUInt32BE(20)).toBe(3408);
    }

    const previews = activeFigurePreviews();
    expect(previews).toHaveLength(35);
    expect(
      previews.filter(
        (preview) =>
          preview.src ===
          "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-1-v1.png",
      ),
    ).toHaveLength(14);
    expect(
      previews.filter(
        (preview) =>
          preview.src ===
          "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-2-v1.png",
      ),
    ).toHaveLength(21);
    expect(previews.every((preview) => preview.width === 2320 && preview.height === 3408)).toBe(
      true,
    );
  });

  test("preserves all retired figure previews as research evidence", () => {
    for (const filename of [
      "fig-1.png",
      "fig-2.png",
      "fig-3.png",
      "fig-3-v2.png",
      "fig-4.png",
      "fig-5.png",
      "fig-6.png",
      "fig-6-v2.png",
      "fig-7.png",
    ]) {
      expect(existsSync(resolve(FIGURE_DIRECTORY, filename))).toBe(true);
    }
  });

  test("keeps every substantial source paragraph paired with a non-lossy reading", () => {
    for (const [index, block] of lamarrFrequencyHoppingArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = lamarrFrequencyHoppingParallelReadings[index]
        .join(" ")
        .trim()
        .split(/\s+/).length;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    if (lamarrPatent.archivalEdition)
      expect(lamarrPatent.archivalEdition).toBe(lamarrFrequencyHoppingArchivalEdition);
    if (lamarrPatent.originalTextAsset?.kind === "reviewed-transcription")
      expect(lamarrPatent.originalTextAsset).toMatchObject({
        kind: "reviewed-transcription",
        url: "/patents/transcripts/us-2292387-lamarr-frequency-hopping-reviewed.txt",
        pageCount: 7,
        sourcePdfSha256: lamarrFrequencyHoppingArchivalEdition.sourcePdfSha256,
      });

    const asset = lamarrPatent.originalTextAsset;
    if (asset?.kind !== "reviewed-transcription") {
      throw new Error("US 2,292,387 must retain its reviewed transcription asset.");
    }
    const ledger = readFileSync(resolve(process.cwd(), `public${asset.url}`), "utf8");
    expect(
      validateReviewedTranscriptionPageAnchors(ledger, asset.pageCount, asset.pageAnchors),
    ).toEqual({ valid: true });
  });

  test("preserves the printed formal matter and never substitutes editorial drawing summaries", () => {
    expect(lamarrFrequencyHoppingArchivalEdition.blocks[0]).toMatchObject({
      kind: "masthead",
      lines: [
        "Patented Aug. 11, 1942.",
        "2,292,387.",
        "UNITED STATES PATENT OFFICE.",
        "SECRET COMMUNICATION SYSTEM",
        "Hedy Kiesler Markey, Los Angeles, and George Antheil, Manhattan Beach, Calif.",
        "Application June 10, 1941, Serial No. 397,412.",
        "6 Claims. (Cl. 250-2.)",
      ],
    });

    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2292387-lamarr-frequency-hopping-reviewed.txt",
      ),
      "utf8",
    );
    expect(ledger).toContain("2 Sheets-Sheet 1");
    expect(ledger).toContain("2 Sheets-Sheet 2");
    expect(ledger).toContain("By Lyon Lyon");
    expect(ledger).not.toContain("[Drawing Sheet");
    expect(ledger).not.toContain("[FIGS. 4-7:");
  });

  test("keeps fabricated preamble and synthetic claims out of visitor-facing data", () => {
    const visible = JSON.stringify({
      originalText: lamarrPatent.originalText,
      claims: lamarrPatent.claims,
      source: lamarrFrequencyHoppingArchivalEdition.blocks,
    });
    expect(visible).not.toContain("To all whom it may concern");
    expect(visible).not.toContain("The method of transmitting secret control signals");
    expect(visible).toContain("means at the transmitting station for transmitting radio signals");
  });

  test("keeps canonical interpretation source-bounded and free of raw math markup", () => {
    const canonical = JSON.stringify({
      summary: lamarrPatent.summary,
      plainEnglishExplanation: lamarrPatent.plainEnglishExplanation,
      drawings: lamarrPatent.drawings,
      historicalContext: lamarrPatent.historicalContext,
      tags: lamarrPatent.tags,
      stats: lamarrPatent.stats,
    });

    for (const unsupportedLegacyClaim of [
      "10 ms",
      "88-channel LC bank",
      "455 kHz",
      "Shannon",
      "processing gain",
      "Bluetooth",
      "Wi-Fi",
      "GPS",
      "Ballet Mécanique",
      "Mark 14",
      "Pioneer Award",
      "Sylvania",
    ]) {
      expect(canonical).not.toContain(unsupportedLegacyClaim);
    }
    expect(canonical).not.toContain("$");
    expect(canonical).not.toContain("\\");
    expect(canonical).toContain("Seven tuning condensers");
    expect(canonical).toContain("Selector 61 is tuned by four capacitors");
    expect(canonical).toContain("100-cycle");
    expect(canonical).toContain("500-cycle");
    expect(canonical).toContain("record strip 37");
    expect(lamarrPatent.historicalContext.patentWars).toEqual([]);
  });

  test("provides valid provenance classifications for all Lamarr controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2292387-lamarr-frequency-hopping"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBe("source-disclosed");
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBe("source-disclosed");
    }
  });

  test("registers explicit energy channel omission reason for Lamarr", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-2292387-lamarr-frequency-hopping"]).toBeDefined();
    expect(energyChannelsFor("us-2292387-lamarr-frequency-hopping", {})).toEqual([]);
  });

  test("never turns figure-audit status into a source-reader gate", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(lamarrPatent, {
      hasCompanionReadings: true,
    });
    expect(completeArchivalEditionForViewer(lamarrPatent, decision)).toBe(
      lamarrFrequencyHoppingArchivalEdition,
    );
  });
});
