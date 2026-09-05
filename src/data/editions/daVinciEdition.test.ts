import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { davinciArchivalEdition } from "@/data/editions/daVinciEdition";
import { archivalEditionForPublication } from "@/data/editions/publicationApproval";
import { daVinciPatent } from "@/data/patents/davinci";

const PINNED_SHA256 = "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91";

describe("US 6,331,181 Surgical Robotic Tools Archival Research Boundary", () => {
  test("keeps the source-bound draft valid internally while withholding the abridged source face", () => {
    const result = validateCuratedSpecificationEdition(davinciArchivalEdition, {
      requireCompleteFacsimileReview: false,
    });
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(daVinciPatent.archivalEdition).toBe(davinciArchivalEdition);
    expect(daVinciPatent.originalTextAsset).toBeDefined();
    expect(davinciArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(validateCuratedSpecificationEdition(davinciArchivalEdition).valid).toBe(false);
    expect(archivalEditionForPublication(daVinciPatent)).toBeUndefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(davinciArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6331181-davinci.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("keeps visually checked front-page identity and abstract literal to the pinned grant", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6331181-davinci-reviewed.txt",
    );
    const transcript = fs.readFileSync(transcriptPath, "utf-8");
    const masthead = davinciArchivalEdition.blocks[0];
    if (masthead?.kind !== "masthead") {
      throw new Error("Da Vinci held packet is missing the front-page masthead.");
    }
    for (const line of masthead.lines) {
      expect(transcript).toContain(line);
    }

    const abstract = davinciArchivalEdition.blocks.find(
      (block) =>
        block.kind === "paragraph" &&
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .startsWith("Robotic surgical tools, systems"),
    );
    if (abstract?.kind !== "paragraph") {
      throw new Error("Da Vinci held packet is missing the printed abstract.");
    }
    expect(transcript).toContain("ABSTRACT");
    expect(transcript).toContain(abstract.inlines.map((inline) => inline.text).join(""));
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

  test("keeps unverified figure prose out of the held source packet while preserving pinned sheets", () => {
    const figureReferences = davinciArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureReferences).toHaveLength(0);

    for (let sheetNumber = 1; sheetNumber <= 22; sheetNumber += 1) {
      const sheetPath = path.join(
        process.cwd(),
        "public",
        "patents",
        "figures",
        "us-6331181-davinci",
        `sheet-${sheetNumber}-source-crop-v1.png`,
      );
      expect(fs.existsSync(sheetPath)).toBe(true);
      const png = fs.readFileSync(sheetPath);
      expect(png.readUInt32BE(16)).toBe(928);
      expect(png.readUInt32BE(20)).toBe(1364);
    }
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
