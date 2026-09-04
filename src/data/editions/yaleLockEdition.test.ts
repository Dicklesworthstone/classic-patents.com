import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { yaleLockPatent } from "../patents/yale-lock";
import { completeArchivalEditionForViewer } from "./publicationApproval";
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
const SOURCE_SHEET_URL = "/patents/figures/us-48475-yale-lock/source-sheet-1-v1.png";
const SOURCE_SHEET_PATH = resolve(process.cwd(), "public", SOURCE_SHEET_URL.replace(/^\//, ""));
const SOURCE_SHEET_SHA256 = "a4927cabec8906a14f8de33cfd7a39cb8d2083fdba6dae51eb5f971cfb68a938";

function activeFigurePreviews() {
  return yaleLockArchivalEdition.blocks.flatMap((block) => {
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

  test("binds every active figure citation to the full p. 1 source sheet", () => {
    const sourceSheet = readFileSync(SOURCE_SHEET_PATH);
    expect(createHash("sha256").update(sourceSheet).digest("hex")).toBe(SOURCE_SHEET_SHA256);
    expect(sourceSheet.readUInt32BE(16)).toBe(2320);
    expect(sourceSheet.readUInt32BE(20)).toBe(3408);

    const previews = activeFigurePreviews();
    expect(previews).toHaveLength(30);
    expect(previews.every((preview) => preview.src === SOURCE_SHEET_URL)).toBe(true);
    expect(previews.every((preview) => preview.width === 2320 && preview.height === 3408)).toBe(
      true,
    );
  });

  test("preserves every retired v1 figure crop as research evidence", () => {
    for (let figure = 1; figure <= 20; figure += 1) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public/patents/figures/us-48475-yale-lock",
            `fig-${figure}-source-crop-v1.png`,
          ),
        ),
      ).toBe(true);
    }
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

  test("never turns an internal figure-review decision into a source-reader gate", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(yaleLockPatent, {
      hasCompanionReadings: true,
    });
    expect(completeArchivalEditionForViewer(yaleLockPatent, decision)).toBe(
      yaleLockArchivalEdition,
    );
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
