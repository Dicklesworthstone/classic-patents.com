import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { einkArchivalEdition, manualClaimText } from "@/data/editions/eInkEdition";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
} from "@/data/editions/publicationApproval";
import { eInkPatent } from "@/data/patents/eink";

const PINNED_SHA256 = "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324";

describe("US 6,120,588 E-Ink Archival Edition Contract", () => {
  test("keeps a valid research draft while failing closed at the publication boundary", () => {
    const result = validateCuratedSpecificationEdition(einkArchivalEdition, {
      requireCompleteFacsimileReview: false,
    });
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(isArchivalEditionExplicitlyWithheld(eInkPatent.id)).toBe(false);
    expect(einkArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(validateCuratedSpecificationEdition(einkArchivalEdition).valid).toBe(false);
    expect(archivalEditionForPublication(eInkPatent)).toBeUndefined();
    expect(eInkPatent.archivalEdition).toBe(einkArchivalEdition);
    expect(eInkPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(einkArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6120588-eink.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("keeps front-page identity fields literal to the pinned grant", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6120588-eink-reviewed.txt",
    );
    const transcript = fs.readFileSync(transcriptPath, "utf-8");
    const masthead = einkArchivalEdition.blocks[0];
    if (masthead?.kind !== "masthead") {
      throw new Error("E Ink archival edition is missing its front-page masthead.");
    }

    for (const line of masthead.lines) {
      expect(transcript).toContain(line);
    }
    expect(masthead.lines).not.toContain("Jacobson et al.");
    expect(masthead.lines).not.toContain("Patent No.: US 6,120,588");
  });

  test("reconciles the printed abstract ahead of the raw two-column reference extraction", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6120588-eink-reviewed.txt",
    );
    const transcript = fs.readFileSync(transcriptPath, "utf-8");
    const abstract = einkArchivalEdition.blocks.find(
      (block) =>
        block.kind === "paragraph" &&
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .startsWith("We describe a system"),
    );
    if (abstract?.kind !== "paragraph") {
      throw new Error("E Ink archival edition is missing the printed abstract.");
    }

    expect(transcript).toContain("ABSTRACT");
    expect(transcript).toContain(abstract.inlines.map((inline) => inline.text).join(""));
  });

  test("contains all 18 printed claims and keeps the record dynamically sourced", () => {
    const claims = einkArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(18);
    expect(eInkPatent.claims).toHaveLength(18);
    expect(eInkPatent.stats).toEqual({ totalClaims: 18, independentClaims: 5 });

    for (let i = 1; i <= 18; i++) {
      const claim = claims.find((c) => c.number === i);
      if (!claim) {
        throw new Error(`eInk manual edition is missing printed claim ${i}.`);
      }
      expect(manualClaimText(i)).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(eInkPatent.claims.find((recordClaim) => recordClaim.number === i)?.originalText).toBe(
        manualClaimText(i),
      );
    }

    expect(manualClaimText(7)).toContain("form a compound having a second color state");
    expect(manualClaimText(7)).not.toContain("com- pound");
    expect(
      Object.fromEntries(
        eInkPatent.claims
          .filter((claim) => !claim.isIndependent)
          .map((claim) => [claim.number, claim.dependsOn]),
      ),
    ).toEqual({
      2: [1],
      3: [1],
      4: [1],
      5: [1],
      6: [1],
      7: [1],
      8: [7],
      9: [1],
      10: [9],
      13: [12],
      14: [13],
      16: [15],
      17: [16],
    });
    expect(eInkPatent.originalText).toContain("Means are known in the prior art");
    expect(eInkPatent.originalText).not.toContain("The patent begins with");
    expect(eInkPatent.originalText).not.toContain("\nCLAIMS\n");
  });

  test("keeps unverified figure prose out of the held source packet while preserving pinned sheets", () => {
    const figureReferences = einkArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureReferences).toHaveLength(0);

    for (let sheetNumber = 1; sheetNumber <= 16; sheetNumber += 1) {
      const sheetPath = path.join(
        process.cwd(),
        "public",
        "patents",
        "figures",
        "us-6120588-eink",
        `sheet-${sheetNumber}-source-crop-v1.png`,
      );
      expect(fs.existsSync(sheetPath)).toBe(true);
      const buf = fs.readFileSync(sheetPath);
      expect(buf.readUInt32BE(16)).toBe(928);
      expect(buf.readUInt32BE(20)).toBe(1364);
    }
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6120588-eink-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 26 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(26);
  });
});
