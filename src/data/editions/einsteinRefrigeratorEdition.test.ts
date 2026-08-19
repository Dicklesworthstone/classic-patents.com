import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import { einsteinRefrigeratorPatent } from "@/data/patents/einstein-refrigerator";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  einsteinRefrigeratorArchivalEdition,
  einsteinRefrigeratorParallelReadings,
} from "./einsteinRefrigeratorEdition";

describe("einsteinRefrigeratorArchivalEdition", () => {
  test("pins the complete four-page facsimile and its five printed claims", () => {
    expect(validateCuratedSpecificationEdition(einsteinRefrigeratorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(einsteinRefrigeratorArchivalEdition.sourcePdfSha256).toBe(
      "5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4",
    );
    const masthead = einsteinRefrigeratorArchivalEdition.blocks.find(
      (block) => block.kind === "masthead",
    );
    expect(masthead?.kind === "masthead" && masthead.lines).toContain("1,781,541.");
    expect(
      einsteinRefrigeratorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("uses a local facsimile preview for every explicit source-drawing reference", () => {
    const references = einsteinRefrigeratorArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(references).toHaveLength(2);
    for (const reference of references) {
      expect(reference.figurePreviews).toHaveLength(1);
      const [preview] = reference.figurePreviews ?? [];
      expect(preview?.src).toBe(
        "/patents/figures/us-1781541-einstein-refrigerator/fig-1-source-crop-v1.png",
      );
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
  });

  test("presents the source as continuous prose rather than a scan-sheet card", () => {
    expect(
      einsteinRefrigeratorArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
  });

  test("keeps the canonical claim set and parallel reading map source-faithful", () => {
    expect(einsteinRefrigeratorPatent.archivalEdition).toBe(einsteinRefrigeratorArchivalEdition);
    expect(einsteinRefrigeratorPatent.stats).toMatchObject({
      totalClaims: 5,
      independentClaims: 5,
    });
    expect(einsteinRefrigeratorPatent.claims.map((claim) => claim.originalText)).toEqual(
      einsteinRefrigeratorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
    expect(archivalParallelReadingsFor(einsteinRefrigeratorPatent.id)).toBe(
      einsteinRefrigeratorParallelReadings,
    );
    expect(JSON.stringify(einsteinRefrigeratorPatent)).not.toContain("240,436");
    expect(JSON.stringify(einsteinRefrigeratorPatent)).not.toContain("Magnetohydrodynamic");
  });

  test("pins every published source block to the reviewed ledger and PDF", () => {
    const asset = einsteinRefrigeratorPatent.originalTextAsset;
    if (!asset?.sourcePdfSha256) throw new Error("US 1,781,541 lacks a pinned reviewed ledger.");

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${einsteinRefrigeratorPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    for (const block of einsteinRefrigeratorArchivalEdition.blocks) {
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

  test("pairs every source paragraph with an explicit non-lossy reading", () => {
    const paragraphIndexes = einsteinRefrigeratorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(einsteinRefrigeratorParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    expect(einsteinRefrigeratorParallelReadings[12]?.join(" ")).toContain("h₂");
  });
});
