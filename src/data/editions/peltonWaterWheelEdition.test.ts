import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { peltonWaterWheelPatent } from "@/data/patents/pelton-water-wheel";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  peltonWaterWheelArchivalEdition,
  peltonWaterWheelParallelReadings,
} from "./peltonWaterWheelEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 233,692 manual source edition", () => {
  test("pins the three-sheet facsimile and the source's one printed claim", () => {
    expect(peltonWaterWheelPatent.archivalEdition).toBe(peltonWaterWheelArchivalEdition);
    expect(peltonWaterWheelPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt",
      pageCount: 3,
      kind: "reviewed-transcription",
      sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
    });
    expect(validateCuratedSpecificationEdition(peltonWaterWheelArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-233692-pelton-water-wheel.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      peltonWaterWheelArchivalEdition.sourcePdfSha256,
    );
    expect(peltonWaterWheelPatent.claims.map((claim) => claim.number)).toEqual([1]);
    expect(peltonWaterWheelPatent.claims[0]?.isIndependent).toBe(true);
  });

  test("keeps all authored source blocks in its review ledger", () => {
    const asset = peltonWaterWheelPatent.originalTextAsset;
    if (!asset) throw new Error("US 233,692 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );
    for (const block of peltonWaterWheelArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const source =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedLedger).toContain(normalized(source));
    }
  });

  test("pairs every paragraph with a companion and every figure with a local crop", () => {
    const paragraphIndexes = peltonWaterWheelArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(peltonWaterWheelParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const references = peltonWaterWheelArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4]) {
      expect(
        references.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of references) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("removes invented numeric turbine claims and the fabricated second claim", () => {
    const visibleData = JSON.stringify({
      summary: peltonWaterWheelPatent.summary,
      originalText: peltonWaterWheelPatent.originalText,
      plainEnglish: peltonWaterWheelPatent.plainEnglishExplanation,
      claims: peltonWaterWheelPatent.claims,
      drawings: peltonWaterWheelPatent.drawings,
      sourceFace: peltonWaterWheelArchivalEdition.blocks,
    });
    expect(visibleData).not.toContain("170-degree");
    expect(visibleData).not.toContain("over 90 percent");
    expect(visibleData).not.toContain("half the speed");
    expect(visibleData).not.toContain("Emergency Jet Deflector");
    expect(visibleData).not.toContain("needle nozzle");
    expect(visibleData).not.toContain("$\\");
    expect(visibleData).toContain("single printed claim");
    expect(visibleData).toContain("bucket-front b");
  });
});
