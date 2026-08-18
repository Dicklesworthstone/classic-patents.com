import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { corlissSteamEnginePatent } from "@/data/patents/corliss-steam-engine";
import {
  corlissSteamEngineArchivalEdition,
  corlissSteamEngineParallelReadings,
} from "./corlissSteamEngineEdition";

describe("corlissSteamEngineArchivalEdition", () => {
  test("pins the reviewed local facsimile and uses explicit typed source nodes", () => {
    expect(validateCuratedSpecificationEdition(corlissSteamEngineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(corlissSteamEngineArchivalEdition.sourcePdfSha256).toBe(
      "22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5",
    );
    expect(corlissSteamEngineArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("keeps the two printed claims source-exact and independently decoded", () => {
    const claims = corlissSteamEngineArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(corlissSteamEnginePatent.claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(corlissSteamEnginePatent.claims.every((claim) => claim.isIndependent)).toBe(true);
    expect(corlissSteamEnginePatent.claims.every((claim) => claim.plainEnglish.length > 180)).toBe(
      true,
    );
  });

  test("makes every printed figure group an explicit preview reference", () => {
    const publicText = JSON.stringify(corlissSteamEngineArchivalEdition.blocks);
    for (const figure of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const filename = `us-6162-corliss-steam-engine-fig-${figure}-preview.png`;
      expect(publicText).toContain(filename);
      expect(existsSync(resolve(process.cwd(), "public/patents/figures", filename))).toBe(true);
    }
  });

  test("pairs each authored source paragraph with a substantial manual reading", () => {
    for (const [index, block] of corlissSteamEngineArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(corlissSteamEngineParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        40,
      );
    }
  });
});
