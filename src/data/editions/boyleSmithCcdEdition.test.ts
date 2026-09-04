import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdParallelReadings,
} from "./boyleSmithCcdEdition";

describe("US 3,858,232 Willard S. Boyle & George E. Smith Charge-Coupled Devices Archival Edition Publication Contract", () => {
  const root = process.cwd();
  const sourceSheets = {
    2: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-2-v1.png",
      sha256: "3eadfb055efca66b0116ff900775b88e5e493f5de014deadb417af2cfb7e148e",
    },
    3: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-3-v1.png",
      sha256: "e9d21a6993f081c55ba9f17d4afd69ffd76836197ce49484b668ea3a1dfbc7dd",
    },
    4: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-4-v1.png",
      sha256: "95618e2f9ae328298d3a0bc202274a7bac994142e60fb6e817bef91752d8ef44",
    },
    5: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-5-v1.png",
      sha256: "8c67fdddfbaaf962729dee6a64b2961e90c00a7828ef333ebb4cb8c53de61252",
    },
    6: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-6-v1.png",
      sha256: "4f499eb79a992470055dae6279c91e3181b6ad768d5e9493ee0e070774c49695",
    },
    7: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-7-v1.png",
      sha256: "47d30c7190bee3deabe9794a0dbf71b7d60bba733fa3d846f77a9b6da2a6dfa6",
    },
    8: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-8-v1.png",
      sha256: "9d425dbf2e213f644b589592befee0128d5bdb233f08cd80c31e5a78d8153598",
    },
    9: {
      path: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-9-v1.png",
      sha256: "12ef9c4683041aec68fca877ea42fcaf35fda276f729c1b8c67b2bd90b857c75",
    },
  } as const;

  test("matches the cryptographic SHA-256 digest of the pinned 19-page USPTO facsimile PDF", () => {
    const pdfPath = join(root, "public/patents/pdfs/us-3858232-boyle-smith-ccd.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(readFileSync(pdfPath));
    const digest = hasher.digest("hex");

    expect(digest).toBe("769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2");
    expect(boyleSmithCcdArchivalEdition.sourcePdfSha256).toBe(digest);
    expect(boyleSmithCcdPatent.originalTextAsset?.sourcePdfSha256).toBe(digest);
  });

  test("pins and validates the 19-page reviewed ledger transcript", () => {
    const ledgerPath = join(
      root,
      "public/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);

    const ledger = readFileSync(ledgerPath, "utf8");
    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 19 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 19 OF 19 ---");
  });

  test("binds every active source figure occurrence to a complete, digest-pinned drawing sheet", () => {
    const figureOccurrences = boyleSmithCcdArchivalEdition.blocks.flatMap((block, blockIndex) => {
      const groups =
        block.kind === "paragraph" || block.kind === "claim"
          ? [block.inlines]
          : block.kind === "figure-sheet"
            ? [block.description]
            : [];
      return groups.flatMap((group, groupIndex) =>
        group.flatMap((inline, inlineIndex) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? [
                {
                  occurrenceKey: `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`,
                  preview: inline.figurePreviews?.[0],
                },
              ]
            : [],
        ),
      );
    });

    expect(figureOccurrences).toHaveLength(104);
    for (const occurrence of figureOccurrences) {
      const preview = occurrence.preview;
      expect(preview).toBeDefined();
      const match = preview?.src.match(/source-sheet-(\d+)-v1\.png$/);
      expect(match).not.toBeNull();
      const sourcePdfPage = Number(match?.[1]);
      expect(sourceSheets[sourcePdfPage as keyof typeof sourceSheets]).toBeDefined();
      expect(preview).toEqual({
        src: sourceSheets[sourcePdfPage as keyof typeof sourceSheets].path,
        alt: expect.stringContaining(
          `Complete unmodified source drawing sheet (PDF page ${sourcePdfPage})`,
        ),
        width: 2320,
        height: 3408,
      });
      expect(occurrence.occurrenceKey).toMatch(/^edition-block-\d+-group-0-inline-\d+$/);
    }

    for (const { path, sha256 } of Object.values(sourceSheets)) {
      const fullPath = join(root, "public", path);
      const bytes = readFileSync(fullPath);
      expect(existsSync(fullPath)).toBe(true);
      expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }).toEqual({
        width: 2320,
        height: 3408,
      });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(sha256);
    }

    const provenance = readFileSync(
      join(root, "docs/provenance/us-3858232-boyle-smith-ccd.md"),
      "utf8",
    );
    expect(provenance).toContain("## Complete source-sheet acceptance (2026-09-04)");
    for (const { sha256 } of Object.values(sourceSheets)) expect(provenance).toContain(sha256);
  });

  test("preserves legacy per-figure source crops while complete sheets are active", () => {
    const figureRefs = [
      "1a",
      "1b",
      "1c",
      "1d",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7a",
      "7b",
      "7c",
      "8",
      "9a",
      "9b",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ];

    for (const fig of figureRefs) {
      const figPath = join(
        root,
        `public/patents/figures/us-3858232-boyle-smith-ccd-fig-${fig}-preview.png`,
      );
      expect(existsSync(figPath)).toBe(true);
    }
  });

  test("exposes all 32 printed claims via dynamic single-source lookup", () => {
    expect(boyleSmithCcdClaimTexts.length).toBe(32);
    expect(boyleSmithCcdPatent.claims.length).toBe(32);

    for (let i = 1; i <= 32; i++) {
      const claimText = boyleSmithCcdClaimText(i);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(20);
      expect(boyleSmithCcdPatent.claims[i - 1].originalText).toBe(claimText);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = boyleSmithCcdArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(boyleSmithCcdParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndexes).toEqual(paragraphIndexes);
  });

  test("provides valid provenance classifications for all Boyle-Smith CCD controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
    const publicPhysics = JSON.stringify(entry);
    for (const unsupported of [
      "gateVoltageV",
      "clockFrequencyMhz",
      "incidentLux",
      "fullWellCapacityElectrons",
      "snrDb",
      "darkElectrons",
    ]) {
      expect(publicPhysics).not.toContain(unsupported);
    }
  });

  test("maps Claim 1 inversion only to the printed single-conductivity storage boundary", () => {
    const result = applyClaimConstraintModifications(
      "us-3858232-boyle-smith-ccd",
      { pulseWidthToStepRatio: 0.5 },
      { 1: false },
    );
    expect(result.modifiedParams).toMatchObject({
      pulseWidthToStepRatio: 0.5,
      claim1SingleConductivityPresent: 0,
    });
    expect(result.modifiedParams.chargeTransferEfficiencyPct).toBeUndefined();
    expect(result.modifiedParams.gateVoltageV).toBeUndefined();
    expect(result.activeFailures[0]).toContain("continuous single-conductivity");
    expect(result.refusalWarning).toContain("not inferred");
  });

  test("keeps editorial audit facts separate from the verified reviewed ledger", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(boyleSmithCcdPatent);
    expect(decision.state.evidence.ledgerContent.valid).toBe(true);
    expect(decision.state.evidence.ledgerContent.status).toBe("verified");
    expect(decision.reasonCode).toBeDefined();
  });
});
