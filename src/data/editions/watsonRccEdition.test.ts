import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { watsonRccPatent } from "@/data/patents/watson-rcc";
import { watsonRccArchivalEdition, watsonRccParallelReadings } from "./watsonRccEdition";

describe("US 4,098,001 manual source edition", () => {
  test("pins the complete eight-page facsimile and both printed claims", () => {
    expect(watsonRccPatent.id).toBe("us-4098001-watson-rcc");
    expect(watsonRccPatent.archivalEdition).toBe(watsonRccArchivalEdition);
    expect(validateCuratedSpecificationEdition(watsonRccArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${watsonRccPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      watsonRccArchivalEdition.sourcePdfSha256,
    );
    expect(watsonRccPatent.claims.map((item) => item.number)).toEqual([1, 2]);
    expect(watsonRccPatent.stats).toMatchObject({
      totalClaims: 2,
      independentClaims: 1,
    });
  });

  test("reads legal text from the edition rather than a duplicate patent-data transcription", () => {
    const claims = watsonRccArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof watsonRccArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    expect(watsonRccPatent.claims.map((item) => item.originalText)).toEqual(
      claims.map((item) => item.inlines.map((inline) => inline.text).join("")),
    );
    expect(watsonRccPatent.claims[1]?.dependsOn).toEqual([1]);
    for (const item of watsonRccPatent.claims) {
      expect(item.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
    }
  });

  test("cites source-derived crops and annotates technical historical language", () => {
    const references = watsonRccArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [];
      return inlines.filter((inline) => inline.kind === "reference");
    });
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-4098001-watson-rcc/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
    const terms = watsonRccArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [];
      return inlines.filter(
        (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
          inline.kind === "term",
      );
    });
    expect(terms.map((item) => item.text)).toEqual([
      "remote center compliance",
      "concatenated",
      "operator means",
      "flexures",
    ]);
    expect(terms.every((item) => item.definition.length > 80)).toBe(true);
  });

  test("pairs every source paragraph with an explanatory reading and a page-complete ledger", () => {
    const indices = watsonRccArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(watsonRccParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(indices);
    for (const index of indices)
      expect(watsonRccParallelReadings[index]?.join(" ").length).toBeGreaterThan(40);

    const asset = watsonRccPatent.originalTextAsset;
    if (!asset) throw new Error("Watson reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionPageAnchors(ledger, 8, asset.pageAnchors ?? [])).toEqual({
      valid: true,
    });
    for (const block of watsonRccArchivalEdition.blocks.filter(
      (item) => item.kind === "paragraph" || item.kind === "claim",
    )) {
      expect(ledger.replace(/\s+/g, " ")).toContain(
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .replace(/\s+/g, " "),
      );
    }
  });

  test("provides valid provenance classifications for all Watson RCC controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    for (const key of ["us-4098001-watson-rcc", "us-4098001-watson-remote-center-compliance"]) {
      const entry = PATENT_PHYSICS_REGISTRY[key];
      expect(entry).toBeDefined();
      for (const ctrl of entry.controls) {
        expect(ctrl.provenance).toBeDefined();
      }
      const metrics = entry.computeMetrics({});
      for (const m of metrics) {
        expect(m.provenance).toBeDefined();
      }
    }
  });

  test("registers explicit energy channel omission reason for Watson RCC", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-4098001-watson-rcc"]).toBeDefined();
    expect(energyChannelsFor("us-4098001-watson-rcc", {})).toEqual([]);
  });
});
