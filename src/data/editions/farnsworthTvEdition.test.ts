import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { farnsworthTvPatent } from "@/data/patents/farnsworth-tv";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { farnsworthTvArchivalEdition, farnsworthTvParallelReadings } from "./farnsworthTvEdition";

describe("US 1,773,980 manual source edition", () => {
  test("pins the inspected 13-page facsimile and its full printed claim sequence", () => {
    expect(validateCuratedSpecificationEdition(farnsworthTvArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${farnsworthTvPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      farnsworthTvArchivalEdition.sourcePdfSha256,
    );
    expect(farnsworthTvPatent.filingDate).toBe("1927-01-07");
    const masthead = farnsworthTvArchivalEdition.blocks.find((block) => block.kind === "masthead");
    expect(masthead?.kind === "masthead" && masthead.lines).toContain("1,773,980.");
    expect(farnsworthTvPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
    expect(farnsworthTvPatent.claims.map((claim) => claim.originalText)).toEqual(
      farnsworthTvArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("keeps every printed figure reference on a patent-local source sheet", () => {
    const refs = farnsworthTvArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      return inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure" ? [inline] : [],
      );
    });
    const expectedDimensions: Readonly<Record<number, readonly [number, number]>> = {
      1: [1600, 1150],
      2: [1600, 450],
      3: [1500, 760],
      4: [1300, 270],
      5: [1300, 230],
      6: [500, 340],
      7: [650, 350],
      8: [380, 360],
      9: [450, 350],
      10: [350, 350],
      11: [1350, 360],
      12: [1350, 260],
      13: [1400, 280],
      14: [400, 560],
      15: [420, 420],
      16: [480, 420],
      17: [400, 400],
    };

    for (const reference of refs) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-1773980-farnsworth-tv/");
        const path = resolve(process.cwd(), "public", preview.src.slice(1));
        expect(existsSync(path)).toBe(true);
        const image = readFileSync(path);
        expect(image.subarray(1, 4).toString("ascii")).toBe("PNG");
        expect(image.readUInt32BE(16)).toBe(preview.width);
        expect(image.readUInt32BE(20)).toBe(preview.height);
      }
    }

    for (const [figureNumber, dimensions] of Object.entries(expectedDimensions)) {
      const number = Number(figureNumber);
      const previewPath = `/patents/figures/us-1773980-farnsworth-tv/fig-${number}-source-crop-v2.png`;
      const matchingReferences = refs.filter((reference) =>
        reference.figurePreviews?.some((preview) => preview.src === previewPath),
      );
      expect(matchingReferences.length).toBeGreaterThan(0);
      for (const reference of matchingReferences) {
        const preview = reference.figurePreviews?.find(
          (candidate) => candidate.src === previewPath,
        );
        expect(preview?.width).toBe(dimensions[0]);
        expect(preview?.height).toBe(dimensions[1]);
        expect(preview?.alt).toContain("oriented for legibility");
      }
    }
  });

  test("covers each authored prose block with a direct companion and has a page-marked ledger", () => {
    const paragraphs = farnsworthTvArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(farnsworthTvParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphs);
    for (const index of paragraphs)
      expect(farnsworthTvParallelReadings[index].join(" ").length).toBeGreaterThan(40);
    const asset = farnsworthTvPatent.originalTextAsset;
    if (!asset) throw new Error("Farnsworth reviewed ledger asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 13)).toEqual({ valid: true });
    for (const block of farnsworthTvArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        expect(ledger).toContain(block.inlines.map((inline) => inline.text).join(""));
      }
    }
  });

  test("provides valid provenance classifications for all Farnsworth controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1773980-farnsworth-tv"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Farnsworth", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-1773980-farnsworth-tv"]).toBeDefined();
    expect(energyChannelsFor("us-1773980-farnsworth-tv", {})).toEqual([]);
  });

  test("enforces figure acceptance pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(farnsworthTvPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FIGURE_ACCEPTANCE_PENDING");
  });
});
