import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { davinciArchivalEdition } from "@/data/editions/daVinciEdition";
import { daVinciPatent } from "@/data/patents/davinci";
import type { CuratedSpecificationInline } from "@/types/patent";

const PINNED_SHA256 = "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91";

describe("US 6,331,181 Surgical Robotic Tools Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,331,181", () => {
    const result = validateCuratedSpecificationEdition(davinciArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(daVinciPatent.archivalEdition).toBe(davinciArchivalEdition);
    expect(daVinciPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(davinciArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6331181-davinci.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 28 printed claims exactly matching manual claim text", () => {
    const claims = davinciArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(28);

    for (let i = 1; i <= 28; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
    }

    const recordClaims = daVinciPatent.claims;
    expect(recordClaims).toHaveLength(28);
    expect(
      recordClaims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 6, 17, 19]);
    for (const recordClaim of recordClaims) {
      const editionClaim = claims.find((claim) => claim.number === recordClaim.number);
      expect(editionClaim?.inlines.map((inline) => inline.text).join("")).toBe(
        recordClaim.originalText,
      );
      expect(recordClaim.plainEnglish.length).toBeGreaterThan(120);
      for (const parent of recordClaim.dependsOn ?? []) {
        expect(recordClaims.some((claim) => claim.number === parent)).toBe(true);
      }
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = davinciArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews).toHaveLength(25);

    for (const preview of figurePreviews) {
      const relPath = preview.src.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const buf = fs.readFileSync(fullPath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);

      expect(preview.width).toBe(width);
      expect(preview.height).toBe(height);
    }
  });

  test("maps later figure citations to the exact pinned source sheets", () => {
    const sourceReferences = davinciArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
              inline.kind === "reference" &&
              inline.referenceType === "figure" &&
              inline.figurePreviews?.some((preview) => preview.src.includes("/sheet-")) === true,
          )
        : [],
    );
    const expectedSheets: Readonly<Record<string, readonly number[]>> = {
      "FIGS. 3 and 3A": [5, 6],
      "FIG. 4": [7],
      "FIGS. 4A-B": [7, 8],
      "FIGS. 5A-H": [9, 10],
      "FIG. 6": [11],
      "FIGS. 7A-E and 7G-L": [11, 12, 13],
      "FIG. 8": [14],
      "FIGS. 8A-B": [15],
      "FIGS. 9-10": [16, 17],
      "FIGS. 11-13": [18, 19, 20],
      "FIGS. 14A-C": [21],
      "FIG. 15": [22],
    };

    expect(sourceReferences).toHaveLength(12);
    for (const reference of sourceReferences) {
      const expected = expectedSheets[reference.text];
      expect(expected).toBeDefined();
      if (!expected) throw new Error(`Unexpected Da Vinci figure reference: ${reference.text}`);
      expect(
        reference.figurePreviews?.map((preview) =>
          Number(preview.src.match(/\/sheet-(\d+)-source-crop-v1\.png$/)?.[1]),
        ),
      ).toEqual([...expected]);
    }

    const figure8 = sourceReferences.find((reference) => reference.text === "FIGS. 8A-B");
    expect(figure8?.label).toContain("FIG. 8B is cited");
    expect(figure8?.label).toContain("absent from the pinned drawing sheets");
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6331181-davinci-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 34 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(34);
  });
});
