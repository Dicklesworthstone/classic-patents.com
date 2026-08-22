import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { zeppelinAirshipPatent } from "@/data/patents/zeppelin-airship";
import {
  zeppelinAirshipArchivalEdition,
  zeppelinAirshipParallelReadings,
} from "./zeppelinAirshipEdition";

test("US 621,195 publishes its source face with the reviewed transcript bound", () => {
  expect(zeppelinAirshipPatent.archivalEdition).toBe(zeppelinAirshipArchivalEdition);
  expect(zeppelinAirshipPatent.originalTextAsset?.url).toBe(
    "/patents/transcripts/us-621195-zeppelin-airship-reviewed.txt",
  );
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

test("US 621,195 rotates the supplied Fig. 7 crop into its printed reading orientation", () => {
  const figureSeven = zeppelinAirshipArchivalEdition.blocks
    .flatMap((block) => ("inlines" in block ? block.inlines : []))
    .flatMap((inline) =>
      inline.kind === "reference" && inline.referenceType === "figure"
        ? (inline.figurePreviews ?? [])
        : [],
    )
    .find((preview) => preview.alt.includes("Fig. 7 "));

  expect(figureSeven).toEqual(
    expect.objectContaining({
      src: "/patents/figures/us-621195-zeppelin-airship/fig-7-source-crop-v2.png",
      width: 720,
      height: 480,
    }),
  );
});
