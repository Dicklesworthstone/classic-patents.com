import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { yaleLockPatent } from "../patents/yale-lock";
import {
  manualYaleClaimText,
  yaleLockArchivalEdition,
  yaleLockParallelReadings,
} from "./yaleLockEdition";

const PDF_PATH = resolve(process.cwd(), "public/patents/pdfs/us-48475-yale-lock.pdf");
const LEDGER_PATH = resolve(
  process.cwd(),
  "public/patents/transcripts/us-48475-yale-lock-reviewed.txt",
);

describe("US 48,475 Linus Yale Jr. Lock Archival Edition Contract", () => {
  test("pinned PDF SHA-256 matches archival edition", () => {
    const pdfBuffer = readFileSync(PDF_PATH);
    const hash = createHash("sha256").update(pdfBuffer).digest("hex");
    expect(hash).toBe("8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250");
    expect(yaleLockArchivalEdition.sourcePdfSha256).toBe(hash);
  });

  test("contains all 5 printed claims exactly matching manual claim text", () => {
    const claimBlocks = yaleLockArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claimBlocks.length).toBe(5);
    const ledger = readFileSync(LEDGER_PATH, "utf-8");

    for (let i = 1; i <= 5; i++) {
      const claimText = manualYaleClaimText(i);
      expect(claimText.length).toBeGreaterThan(20);
      expect(claimText).toContain(`${i}.`);
      expect(ledger).toContain(claimText);
    }
  });

  test("canonical drawing metadata covers every printed figure exactly once", () => {
    const figureNumbers = yaleLockPatent.drawings
      .map((drawing) => drawing.figureNumber)
      .sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")));
    expect(figureNumbers).toEqual(Array.from({ length: 20 }, (_, index) => `Fig. ${index + 1}`));
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const referencedFigures = new Set<number>();
    for (const block of yaleLockArchivalEdition.blocks) {
      if (block.kind === "paragraph") {
        for (const inline of block.inlines) {
          if (inline.kind === "reference" && inline.figurePreviews) {
            for (const preview of inline.figurePreviews) {
              const figureMatch = preview.src.match(/fig-(\d+)-source-crop-v\d+\.png$/);
              expect(figureMatch).not.toBeNull();
              referencedFigures.add(Number(figureMatch?.[1]));
              const diskPath = resolve(process.cwd(), "public", preview.src.replace(/^\//, ""));
              const fileBuffer = readFileSync(diskPath);
              expect(fileBuffer.length).toBeGreaterThan(100);

              // Verify PNG header dimensions (bytes 16-23: width [16..20], height [20..24])
              const width = fileBuffer.readUInt32BE(16);
              const height = fileBuffer.readUInt32BE(20);
              expect(preview.width).toBe(width);
              expect(preview.height).toBe(height);
            }
          }
        }
      }
    }
    expect(referencedFigures).toEqual(new Set(Array.from({ length: 20 }, (_, index) => index + 1)));
  });

  test("records versioned source-crop targets while the crop lane is reviewed", () => {
    const previews = yaleLockArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.figurePreviews ? inline.figurePreviews : [],
          )
        : [],
    );
    expect(previews.length).toBeGreaterThan(0);
    expect(previews.every((preview) => /-source-crop-v\d+\.png$/.test(preview.src))).toBe(true);
  });

  test("every paragraph block has a corresponding parallel reading", () => {
    yaleLockArchivalEdition.blocks.forEach((block, index) => {
      if (block.kind === "paragraph") {
        const reading = yaleLockParallelReadings[index];
        expect(reading).toBeDefined();
        expect(reading.length).toBeGreaterThan(0);
        expect(reading[0].length).toBeGreaterThan(20);
      }
    });
  });

  test("reviewed transcription ledger matches page boundary markers", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf-8");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 4 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 4 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 4 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 4 OF 4 ---");
    expect(ledger).toContain("LINUS YALE, JR.");
    expect(ledger).toContain("IMPROVEMENT IN LOCKS.");
  });

  test("provides valid provenance classifications for all Yale Lock controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-48475-yale-lock"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Yale Lock", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-48475-yale-lock"]).toBeDefined();
    expect(energyChannelsFor("us-48475-yale-lock", {})).toEqual([]);
  });

  test("enforces figure acceptance audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(yaleLockPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FIGURE_ACCEPTANCE_PENDING");
  });

  test("claim constraints accurately describe Claim 1 bolt-holding arrangement", () => {
    const { CATALOG_CLAIM_CONSTRAINTS } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-48475-yale-lock"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThan(0);
    expect(constraints[0].claimNumber).toBe(1);
    expect(constraints[0].claimTitle).toContain("Bolt-Holding Contrivance");
    expect(constraints[0].activeDescription).toContain("mortise faceplate");
  });
});
