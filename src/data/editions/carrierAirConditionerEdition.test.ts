import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { carrierAirConditionerPatent } from "@/data/patents/carrier-air-conditioner";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  carrierAirConditionerArchivalEdition,
  carrierAirConditionerParallelReadings,
} from "./carrierAirConditionerEdition";

describe("carrierAirConditionerArchivalEdition", () => {
  test("pins the complete four-sheet source and its five printed claims", () => {
    expect(validateCuratedSpecificationEdition(carrierAirConditionerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(carrierAirConditionerArchivalEdition.sourcePdfSha256).toBe(
      "b8cfbb69e27934862236ecabf03396e67d04a4b4011c98083f1205cd76f0291e",
    );
    expect(
      carrierAirConditionerArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("makes every source figure reference an explicit local preview", () => {
    const references = carrierAirConditionerArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(references).toHaveLength(8);
    for (const reference of references) {
      const [preview] = reference.figurePreviews ?? [];
      expect(preview).toBeDefined();
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
  });

  test("corrects the former unrelated humidity-control record", () => {
    expect(carrierAirConditionerPatent.archivalEdition).toBe(carrierAirConditionerArchivalEdition);
    expect(carrierAirConditionerPatent.filingDate).toBe("1904-09-16");
    expect(carrierAirConditionerPatent.stats).toMatchObject({
      totalClaims: 5,
      independentClaims: 5,
    });
    expect(carrierAirConditionerPatent.claims.map((claim) => claim.originalText)).toEqual(
      carrierAirConditionerArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
    expect(JSON.stringify(carrierAirConditionerPatent)).not.toContain("123,618");
    expect(JSON.stringify(carrierAirConditionerPatent)).not.toContain("dew-point regulator");
    expect(JSON.stringify(carrierAirConditionerPatent)).not.toContain("Sackett-Wilhelms");
  });

  test("pins every published source block to the reviewed ledger and source PDF", () => {
    const asset = carrierAirConditionerPatent.originalTextAsset;
    if (!asset?.sourcePdfSha256) throw new Error("US 808,897 lacks a pinned reviewed ledger.");

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${carrierAirConditionerPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    for (const block of carrierAirConditionerArchivalEdition.blocks) {
      if (block.kind !== "masthead" && block.kind !== "paragraph" && block.kind !== "claim") {
        continue;
      }
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });

  test("pairs every meaningful paragraph with an authored, non-lossy reading", () => {
    const paragraphIndexes = carrierAirConditionerArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(carrierAirConditionerParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    expect(carrierAirConditionerParallelReadings[10]?.join(" ")).toContain("trap J");
  });
});
