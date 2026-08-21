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

    const figureTwoReferences = references.filter((reference) => reference.text === "Fig. 2");
    expect(figureTwoReferences.length).toBeGreaterThan(0);
    for (const reference of figureTwoReferences) {
      expect(reference.figurePreviews).toContainEqual(
        expect.objectContaining({
          src: "/patents/figures/us-808897-carrier-air-conditioner/fig-2-source-crop-v2.png",
          width: 480,
          height: 610,
        }),
      );
    }
  });

  test("keeps the archival face and canonical drawings explicitly authored", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/carrierAirConditionerEdition.ts"),
      "utf8",
    );
    const recordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/carrier-air-conditioner.ts"),
      "utf8",
    );

    expect(editionSource).not.toContain("SOURCE DRAWING SHEET");
    expect(editionSource).not.toContain('kind: "figure-sheet"');
    expect(recordSource).not.toContain("drawings: [1, 2, 3, 4, 5, 6].map");
    expect(carrierAirConditionerPatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "Fig. 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
    ]);
    expect(new Set(carrierAirConditionerPatent.drawings.map((drawing) => drawing.svgType)).size).toBe(6);
    for (const drawing of carrierAirConditionerPatent.drawings) {
      for (const callout of drawing.callouts) {
        expect(callout.label).toMatch(/^[a-z]?$|^[a-z]$/);
      }
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
    expect(JSON.stringify(carrierAirConditionerPatent).toLowerCase()).not.toContain("dew-point");
    expect(JSON.stringify(carrierAirConditionerPatent).toLowerCase()).not.toContain("reheat");
  });

  test("gives every printed claim a distinct, source-specific decoder and innovation set", () => {
    const claims = carrierAirConditionerPatent.claims;
    expect(claims).toHaveLength(5);
    expect(new Set(claims.map((claim) => claim.plainEnglish)).size).toBe(5);
    expect(new Set(claims.map((claim) => claim.keyInnovations.join(" | "))).size).toBe(5);

    expect(claims[0]).toMatchObject({
      number: 1,
      plainEnglish: expect.stringContaining("unobstructed"),
      keyInnovations: expect.arrayContaining([
        "Two-zone plate surface with unobstructed wet front portion",
      ]),
    });
    expect(claims[1]).toMatchObject({
      number: 2,
      plainEnglish: expect.stringContaining("air-moistening"),
      keyInnovations: expect.arrayContaining(["Air-moistening means coupled to the separator"]),
    });
    expect(claims[2]).toMatchObject({
      number: 3,
      plainEnglish: expect.stringContaining("projecting flanges"),
      keyInnovations: expect.arrayContaining(["Upright gutters formed by the flanges"]),
    });
    expect(claims[3]).toMatchObject({
      number: 4,
      plainEnglish: expect.stringContaining("zigzig"),
      keyInnovations: expect.arrayContaining(["Gutters located at salient surface portions"]),
    });
    expect(claims[4]).toMatchObject({
      number: 5,
      plainEnglish: expect.stringContaining("separate angled sections"),
      keyInnovations: expect.arrayContaining([
        "Junction gutter created by overlapping section geometry",
      ]),
    });
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
    expect(carrierAirConditionerParallelReadings[9]?.join(" ")).toContain("trap J");
  });
});
