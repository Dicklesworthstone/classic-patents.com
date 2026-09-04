import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { teslaTeleautomatonPatent } from "@/data/patents/tesla-teleautomaton";
import { teslaTeleautomatonArchivalEdition } from "./teslaTeleautomatonEdition";

const PINNED_SHA256 = "b92da6bad46cca996f7ecc99a16a87bdd38d12b3e04a0fce11cc5f033aed849b";

describe("US 613,809 Nikola Tesla Teleautomaton manual archival edition", () => {
  test("pins the thirteen-page source candidate and publishes valid manual edition", () => {
    expect(teslaTeleautomatonPatent.archivalEdition).toBe(teslaTeleautomatonArchivalEdition);
    expect(teslaTeleautomatonPatent.originalTextAsset).toBeDefined();
    expect(teslaTeleautomatonArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    expect(validateCuratedSpecificationEdition(teslaTeleautomatonArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${teslaTeleautomatonPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(PINNED_SHA256);
    expect(teslaTeleautomatonPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    ]);
  });

  test("makes complete pinned drawing sheets primary and retains local crops", () => {
    const references = teslaTeleautomatonArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      expect(reference.figurePreviews?.[0]?.src).toMatch(
        /^\/patents\/figures\/us-613809-tesla-teleautomaton\/source-sheet-[1-5]-v1\.png$/,
      );
      expect(reference.figurePreviews?.[0]).toMatchObject({ width: 2320, height: 3408 });
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-613809-tesla-teleautomaton/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("verifies reviewed transcription ledger", () => {
    const transcriptPath = resolve(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-613809-tesla-teleautomaton-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    const validation = validateReviewedTranscription(transcript, 13);
    expect(validation.valid).toBe(true);
  });

  test("provides valid provenance classifications for all Tesla Teleautomaton controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-613809-tesla-teleautomaton"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Tesla Teleautomaton", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-613809-tesla-teleautomaton"]).toBeDefined();
    expect(energyChannelsFor("us-613809-tesla-teleautomaton", {})).toEqual([]);
  });

  test("enforces facsimile review pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(teslaTeleautomatonPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FACSIMILE_REVIEW_PENDING");
  });
});
