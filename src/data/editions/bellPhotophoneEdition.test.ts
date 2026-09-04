import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { bellPhotophonePatent } from "../patents/bell-photophone";
import {
  BELL_PHOTOPHONE_PARALLEL_READINGS,
  bellPhotophoneArchivalEdition,
  manualPhotophoneClaimText,
} from "./bellPhotophoneEdition";
import { completeArchivalEditionForViewer } from "./publicationApproval";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

const PINNED_SHA256 = "924fc983c2b53e84e122b7fb84014b5d37cf2461eae4132ea235211364f25e85";
const SOURCE_SHEETS = {
  1: {
    path: "/patents/figures/us-235199-bell-photophone/source-sheet-1-v1.png",
    sha256: "28d4be40b8c2cc3e6468337814d202e1f2001086f66ee96e1a79ef6be4fa9705",
  },
  2: {
    path: "/patents/figures/us-235199-bell-photophone/source-sheet-2-v1.png",
    sha256: "e624181efbebc2fbf30da6db8a322b8e9eb0431990045fb7bf04638394e908d7",
  },
  3: {
    path: "/patents/figures/us-235199-bell-photophone/source-sheet-3-v1.png",
    sha256: "b4e4616fd74a3c88ab2e05057cb2318b7b0467f4f9f1223b21f05e6c8b13bc92",
  },
} as const;

const SOURCE_SHEET_BY_ACTIVE_OCCURRENCE: Record<string, keyof typeof SOURCE_SHEETS> = {
  "edition-block-20-group-0-inline-0": 1,
  "edition-block-20-group-0-inline-2": 1,
  "edition-block-23-group-0-inline-1": 1,
  "edition-block-27-group-0-inline-1": 2,
  "edition-block-28-group-0-inline-0": 2,
  "edition-block-30-group-0-inline-1": 2,
  "edition-block-33-group-0-inline-3": 2,
  "edition-block-33-group-0-inline-5": 2,
  "edition-block-33-group-0-inline-7": 2,
  "edition-block-33-group-0-inline-9": 2,
  "edition-block-34-group-0-inline-1": 2,
  "edition-block-36-group-0-inline-1": 2,
  "edition-block-37-group-0-inline-0": 2,
  "edition-block-40-group-0-inline-1": 2,
  "edition-block-40-group-0-inline-3": 2,
  "edition-block-43-group-0-inline-1": 2,
  "edition-block-44-group-0-inline-1": 2,
  "edition-block-46-group-0-inline-1": 2,
  "edition-block-53-group-0-inline-0": 3,
  "edition-block-62-group-0-inline-1": 2,
  "edition-block-64-group-0-inline-1": 2,
  "edition-block-64-group-0-inline-3": 2,
  "edition-block-66-group-0-inline-1": 2,
  "edition-block-67-group-0-inline-1": 2,
  "edition-block-68-group-0-inline-1": 3,
  "edition-block-68-group-0-inline-3": 3,
  "edition-block-68-group-0-inline-5": 3,
  "edition-block-68-group-0-inline-7": 2,
  "edition-block-68-group-0-inline-9": 3,
  "edition-block-72-group-0-inline-1": 3,
  "edition-block-72-group-0-inline-3": 3,
  "edition-block-87-group-0-inline-1": 2,
};

describe("US 235,199 Alexander Graham Bell Photophone Archival Edition Contract", () => {
  test("catalogue record links the verified archival edition and reviewed transcript", () => {
    expect(bellPhotophonePatent.archivalEdition).toBeDefined();
    expect(bellPhotophonePatent.originalTextAsset).toBeDefined();
    expect(bellPhotophonePatent.archivalEdition?.sourcePdfSha256).toBe(PINNED_SHA256);
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(bellPhotophoneArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-235199-bell-photophone.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 18 printed claims exactly matching manual claim text", () => {
    const claims = bellPhotophoneArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(18);

    for (let i = 1; i <= 18; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      const text = manualPhotophoneClaimText(i);
      expect(text.length).toBeGreaterThan(30);
    }
  });

  test("uses direct complete drawing sheets for every active figure occurrence", () => {
    const activeReferences = bellPhotophoneArchivalEdition.blocks.flatMap((block, blockIndex) => {
      if (block.kind !== "paragraph") return [];
      return block.inlines.flatMap((inline, inlineIndex) =>
        inline.kind === "reference" && inline.referenceType === "figure"
          ? [
              {
                occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
                previews: inline.figurePreviews ?? [],
              },
            ]
          : [],
      );
    });
    const previewsByOccurrence = new Map(
      activeReferences.map((reference) => [reference.occurrenceKey, reference.previews]),
    );

    expect([...previewsByOccurrence.keys()]).toEqual(
      Object.keys(SOURCE_SHEET_BY_ACTIVE_OCCURRENCE),
    );
    for (const [occurrenceKey, sourceSheet] of Object.entries(SOURCE_SHEET_BY_ACTIVE_OCCURRENCE)) {
      const previews = previewsByOccurrence.get(occurrenceKey);
      expect(previews).toHaveLength(1);
      expect(previews?.[0]).toEqual({
        src: SOURCE_SHEETS[sourceSheet].path,
        alt: expect.stringContaining(`drawing sheet ${sourceSheet}`),
        width: 2320,
        height: 3408,
      });
    }
  });

  test("pins direct full-sheet source renders without replacing legacy crops", () => {
    for (const { path: sourceSheetPath, sha256 } of Object.values(SOURCE_SHEETS)) {
      const fullPath = path.join(process.cwd(), "public", sourceSheetPath);
      expect(fs.existsSync(fullPath)).toBe(true);
      const png = fs.readFileSync(fullPath);
      expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(png.readUInt32BE(16)).toBe(2320);
      expect(png.readUInt32BE(20)).toBe(3408);
      expect(createHash("sha256").update(png).digest("hex")).toBe(sha256);
    }

    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "public/patents/figures/us-235199-bell-photophone/fig-1-source-crop-v3.png",
        ),
      ),
    ).toBe(true);
  });

  test("every paragraph block has a corresponding parallel reading", () => {
    const paragraphIndices = bellPhotophoneArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    const readingIndices = Object.keys(BELL_PHOTOPHONE_PARALLEL_READINGS)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndices).toEqual(paragraphIndices);

    for (const idx of paragraphIndices) {
      const reading = BELL_PHOTOPHONE_PARALLEL_READINGS[idx];
      expect(reading).toBeDefined();
      expect(reading?.length).toBeGreaterThan(0);
      expect(reading?.[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("reviewed transcription is a page-complete literal source ledger, not a drawing summary", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-235199-bell-photophone-reviewed.txt",
    );
    expect(fs.existsSync(ledgerPath)).toBe(true);
    const content = fs.readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 13; page++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 13 ---`);
    }

    expect(evaluateReviewedLedgerTextEvidence(bellPhotophonePatent, content)).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 121,
      coveredSectionCount: 121,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  });

  test("every authored source block is present in the reviewed ledger", () => {
    const ledger = fs
      .readFileSync(
        path.join(
          process.cwd(),
          "public",
          "patents",
          "transcripts",
          "us-235199-bell-photophone-reviewed.txt",
        ),
        "utf8",
      )
      .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 13 ---/g, "")
      .replace(/\s+/g, " ");
    const authoredBlocks = bellPhotophoneArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      return [];
    });
    for (const sourceText of authoredBlocks) {
      expect(ledger).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("parallel readings are authored companions rather than boilerplate echoes", () => {
    for (const reading of Object.values(BELL_PHOTOPHONE_PARALLEL_READINGS)) {
      expect(reading[0]).toBeDefined();
      expect(reading[0]).not.toContain("This companion preserves the source proposition");
    }
  });

  test("provides valid provenance classifications for all Bell Photophone controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-235199-bell-photophone"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("keeps the complete continuous source edition readable during figure-evidence review", () => {
    expect(completeArchivalEditionForViewer(bellPhotophonePatent)).toBe(
      bellPhotophoneArchivalEdition,
    );
  });
});
