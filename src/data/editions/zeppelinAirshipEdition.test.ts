import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { zeppelinAirshipPatent } from "@/data/patents/zeppelin-airship";
import {
  zeppelinAirshipArchivalEdition,
  zeppelinAirshipParallelReadings,
} from "./zeppelinAirshipEdition";

test("US 621,195 keeps its incomplete source face withheld until the missing cited figures are sourced", () => {
  expect(zeppelinAirshipPatent.archivalEdition).toBeUndefined();
  expect(zeppelinAirshipPatent.originalTextAsset).toBeUndefined();
  expect(validateCuratedSpecificationEdition(zeppelinAirshipArchivalEdition)).toEqual({
    valid: true,
    errors: [],
  });
  expect(zeppelinAirshipArchivalEdition.blocks.some((block) => block.kind === "figure-sheet")).toBe(
    false,
  );

  const paragraphIndexes = zeppelinAirshipArchivalEdition.blocks.flatMap((block, index) =>
    block.kind === "paragraph" ? [index] : [],
  );
  expect(Object.keys(zeppelinAirshipParallelReadings).map(Number)).toEqual(paragraphIndexes);
});

test("US 621,195 keeps every supplied figure preview at its source citation", () => {
  const references = zeppelinAirshipArchivalEdition.blocks.flatMap((block) => {
    if (!("inlines" in block)) return [];
    return block.inlines.filter(
      (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
        inline.kind === "reference" && inline.referenceType === "figure",
    );
  });

  for (const number of Array.from({ length: 10 }, (_, index) => index + 1)) {
    const preview = references
      .flatMap((reference) => reference.figurePreviews ?? [])
      .find((value) => value.alt.includes(`Fig. ${number} `));
    expect(preview).toBeDefined();
    if (!preview) continue;
    expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
  }

  const renderedSource = JSON.stringify(zeppelinAirshipArchivalEdition);
  expect(renderedSource).toContain('"text":"Figs. 11 and 12"');
  expect(renderedSource).toContain("no preview is fabricated");
});
