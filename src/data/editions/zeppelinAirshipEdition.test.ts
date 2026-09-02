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

test("US 621,195 derives all claims dynamically from edition", () => {
  expect(zeppelinAirshipPatent.claims.length).toBe(4);
  const editionClaims = zeppelinAirshipArchivalEdition.blocks.filter((b) => b.kind === "claim");
  expect(editionClaims.length).toBe(4);
  for (let i = 0; i < 4; i++) {
    const block = editionClaims[i];
    expect(block).toBeDefined();
    const expected = block.inlines.map((inl) => inl.text).join("");
    expect(zeppelinAirshipPatent.claims[i].originalText).toBe(expected);
  }
});

test("US 621,195 provides valid provenance classifications for all Zeppelin controls and metrics", () => {
  const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
  const entry = PATENT_PHYSICS_REGISTRY["us-621195-zeppelin-airship"];
  expect(entry).toBeDefined();
  for (const ctrl of entry.controls) {
    expect(ctrl.provenance).toBeDefined();
  }
  const metrics = entry.computeMetrics({});
  for (const m of metrics) {
    expect(m.provenance).toBeDefined();
  }
});

test("US 621,195 registers explicit energy channel omission reason", () => {
  const {
    energyChannelsFor,
    ENERGY_CHANNEL_OMISSION_REASONS,
  } = require("@/physics/energyChannels");
  expect(ENERGY_CHANNEL_OMISSION_REASONS["us-621195-zeppelin-airship"]).toBeDefined();
  expect(energyChannelsFor("us-621195-zeppelin-airship", {})).toEqual([]);
});

test("US 621,195 enforces ledger acceptance audit hold in publication state registry", () => {
  const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
  const decision = evaluateTypedArchivalPublicationState(zeppelinAirshipPatent, {
    hasCompanionReadings: true,
  });
  expect(decision.isPublished).toBe(false);
  expect(decision.state.kind).toBe("held");
  expect(decision.reasonCode).toBe("AUDIT_LEDGER_ACCEPTANCE_PENDING");
});
