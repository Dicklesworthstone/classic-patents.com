import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { marconiRadioPatent } from "@/data/patents/marconi-radio";
import { marconiRadioArchivalEdition, marconiRadioParallelReadings } from "./marconiRadioEdition";

describe("US 586,193 manual source edition", () => {
  test("retains the eleven-page facsimile evidence and every printed claim", () => {
    expect(validateCuratedSpecificationEdition(marconiRadioArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${marconiRadioPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      marconiRadioArchivalEdition.sourcePdfSha256,
    );
    expect(marconiRadioPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 56 }, (_, index) => index + 1),
    );
    expect(marconiRadioPatent.claims.map((claim) => claim.originalText)).toEqual(
      marconiRadioArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("uses local source crops and authored term annotations", () => {
    const references = marconiRadioArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) {
      if (reference.kind !== "reference" || reference.referenceType !== "figure") continue;
      for (const preview of reference.figurePreviews ?? [])
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
    }
    const terms = marconiRadioArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.map((term) => term.text)).toEqual(["Ruhmkorff coil", "choking-coils"]);
  });

  test("keeps the unfinished source treatment unbound from the public archival face", () => {
    const paragraphIndices = marconiRadioArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(marconiRadioParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndices);
    expect(marconiRadioPatent.archivalEdition).toBeUndefined();
    expect(marconiRadioPatent.originalTextAsset).toMatchObject({
      kind: "source-pdf-text-layer",
      url: "/patents/source-text/us-586193-marconi-radio.txt",
    });
  });
});
