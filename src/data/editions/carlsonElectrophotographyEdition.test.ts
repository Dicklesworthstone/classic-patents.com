import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  carlsonElectrophotographyArchivalEdition,
  carlsonElectrophotographyParallelReadings,
  manualCarlsonClaimText,
} from "./carlsonElectrophotographyEdition";

describe("US 2,297,691 Chester F. Carlson Electrophotography Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-2297691-carlson-electrophotography.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-2297691-carlson-electrophotography-reviewed.txt",
  );

  test("remains explicitly withheld until Luna source review is complete", () => {
    expect(Boolean(carlsonElectrophotographyArchivalEdition.completeFacsimileReviewed)).toBe(false);
  });

  test("matches the cryptographic SHA-256 digest of the pinned 10-page USPTO facsimile PDF", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const computedDigest = createHash("sha256").update(buffer).digest("hex");

    expect(carlsonElectrophotographyArchivalEdition.sourcePdfSha256).toBe(
      "5b521a7f4b7fad3c258cc3b5bbbae2d593a28f03641e78938ec73e3fdbab8422",
    );
    expect(computedDigest).toBe(carlsonElectrophotographyArchivalEdition.sourcePdfSha256);
  });

  test("keeps the 10-page ledger fail-closed with ordered WIP markers", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 10; page++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 10 ---`);
    }
    expect(transcript).toContain("Luna");
    expect(transcript).toContain("signature glyphs");
  });

  test("keeps rejected candidates and reserved v2 paths off the visitor preview surface", () => {
    let references = 0;
    for (const block of carlsonElectrophotographyArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "reference" && inline.referenceType === "figure") {
            references += 1;
            expect(inline.figurePreviews).toBeUndefined();
          }
        }
      }
    }
    expect(references).toBeGreaterThan(0);
    const editionSource = readFileSync(
      join(rootDir, "src/data/editions/carlsonElectrophotographyEdition.ts"),
      "utf8",
    );
    expect(editionSource).toContain("fig-1-source-crop-v2.png");
    expect(editionSource).toContain("ATTACH_ACCEPTED_FIGURE_PREVIEWS = false");
  });

  test("exposes all 27 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 27; c++) {
      const textVal = manualCarlsonClaimText(c);
      expect(textVal).toBeDefined();
      expect(textVal.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = carlsonElectrophotographyArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndexes) {
      const readings = carlsonElectrophotographyParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0].trim().length).toBeGreaterThan(40);
    }
  });

  test("provides valid provenance classifications for all Carlson controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2297691-carlson-electrophotography"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("enforces figure acceptance pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const {
      carlsonElectrophotographyPatent,
    } = require("@/data/patents/carlson-electrophotography");
    const decision = evaluateTypedArchivalPublicationState(carlsonElectrophotographyPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("held");
    expect(decision.reasonCode).toBe("AUDIT_FIGURE_ACCEPTANCE_PENDING");
  });
});
