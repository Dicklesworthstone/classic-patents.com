import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { morseTelegraphPatent } from "@/data/patents/morse-telegraph";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  morseTelegraphArchivalEdition,
  morseTelegraphParallelReadings,
} from "./morseTelegraphEdition";

describe("morseTelegraphArchivalEdition", () => {
  const acceptedSourceSheets = {
    "/patents/figures/us-1647-morse-telegraph/source-sheet-1-v1.png": {
      sha256: "7b8d588e37946b44a183e405cb4c2636084063bf7bb4d587c7c81b85043e664d",
      width: 2320,
      height: 3408,
    },
    "/patents/figures/us-1647-morse-telegraph/source-sheet-2-v1.png": {
      sha256: "963b3cbd6c7d73a12cd819b4e88d8e0a3705ed1fc80e744eae06ed5a2adaa351",
      width: 2320,
      height: 3408,
    },
    "/patents/figures/us-1647-morse-telegraph/source-sheet-3-v1.png": {
      sha256: "b00e83560fdb7a650f65b376e928c8b89bf3d03ccc091fc8f01af109e799b832",
      width: 2320,
      height: 3408,
    },
  } as const;

  test("pins the nine-page US 1,647 facsimile and its complete printed claim set", () => {
    expect(validateCuratedSpecificationEdition(morseTelegraphArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(morseTelegraphArchivalEdition.sourcePdfSha256).toBe(
      "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
    );
    expect(morseTelegraphArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      morseTelegraphArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("pins every authored source block to a reviewed nine-page ledger", () => {
    const asset = morseTelegraphPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-1647-morse-telegraph-reviewed.txt",
      pageCount: 9,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-08-18",
      sourcePdfSha256: "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
    });
    if (!asset?.sourcePdfSha256) {
      throw new Error("Morse reviewed transcript asset or source digest is missing.");
    }

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(`${process.cwd()}/public${morseTelegraphPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    const textualBlocks = morseTelegraphArchivalEdition.blocks.filter(
      (block) => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of textualBlocks) {
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("uses an attested complete primary source sheet for every printed figure reference", () => {
    const serialized = JSON.stringify(morseTelegraphArchivalEdition.blocks);
    expect(serialized).not.toContain("SOURCE PDF PAGE");
    expect(serialized).not.toContain("pdftotext");

    for (const block of morseTelegraphArchivalEdition.blocks) {
      if (block.kind !== "paragraph") continue;
      for (const inline of block.inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews?.length).toBeGreaterThan(0);
        for (const preview of inline.figurePreviews ?? []) {
          const accepted = acceptedSourceSheets[preview.src as keyof typeof acceptedSourceSheets];
          expect(accepted).toBeDefined();
          expect(preview.width).toBe(accepted?.width);
          expect(preview.height).toBe(accepted?.height);
          const sourceSheet = resolve(process.cwd(), "public", preview.src.slice(1));
          expect(existsSync(sourceSheet)).toBe(true);
          expect(createHash("sha256").update(readFileSync(sourceSheet)).digest("hex")).toBe(
            accepted?.sha256,
          );
        }
      }
    }
  });

  test("does not leave a source figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of morseTelegraphArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("adds authored hover definitions for the patent's historical technical vocabulary", () => {
    const definitions = morseTelegraphArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );

    expect(definitions.map((definition) => definition.text)).toEqual(
      expect.arrayContaining([
        "galvanic",
        "type",
        "straight port-rule",
        "circular port-rule",
        "armature",
        "caoutchouc",
      ]),
    );
    for (const definition of definitions) {
      expect(definition.definition.length).toBeGreaterThan(40);
      expect(definition.definition).not.toContain("Definition available");
    }
  });

  test("retains source-checked mechanisms that were previously omitted or mistranscribed", () => {
    const source = morseTelegraphArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines.map((inline) => inline.text) : []))
      .join(" ");

    expect(source).toContain("first, of fourteen pieces or plates");
    expect(source).not.toContain("first, of five pieces or plates");
    expect(source).toContain("The type-rule in use is moved onward");
    expect(source).toContain("The straight port-rule consists");
    expect(source).toContain("a stationary type-feeder");
    expect(source).toContain("The signal-lever consists, secondly");
    expect(source).toContain("Thirdly, of an alarm-bell");
    expect(source).toContain("The electro-magnet thus used is made");
  });

  test("prepares a non-lossy patent-owned reading for every prose node", () => {
    for (const [index, block] of morseTelegraphArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = morseTelegraphParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(20);
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = reading?.join(" ").trim().split(/\s+/).length ?? 0;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("keeps the catalogue's nine claim decoders tied to the published legal nodes", () => {
    const editionClaims = morseTelegraphArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(morseTelegraphPatent.stats?.totalClaims).toBe(9);
    expect(morseTelegraphPatent.claims).toHaveLength(9);
    for (const claim of editionClaims) {
      const decoder = morseTelegraphPatent.claims.find(
        (candidate) => candidate.number === claim.number,
      );
      expect(decoder?.originalText).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(decoder?.plainEnglish.split(/\s+/).length).toBeGreaterThan(20);
    }
  });
});
