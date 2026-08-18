import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { maximMachineGunPatent } from "@/data/patents/maxim-machine-gun";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  maximMachineGunArchivalEdition,
  maximMachineGunParallelReadings,
} from "./maximMachineGunEdition";

const normalized = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 319,596 manual source edition", () => {
  test("pins the five-sheet source and all four printed claims", () => {
    expect(maximMachineGunPatent.archivalEdition).toBe(maximMachineGunArchivalEdition);
    expect(maximMachineGunPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-319596-maxim-machine-gun-reviewed.txt",
      pageCount: 5,
      kind: "reviewed-transcription",
      sourcePdfSha256: "ca385c254e2e390451a2eecd28273fee662afd0179451bcbf9f48bf8fde63dcb",
    });
    expect(validateCuratedSpecificationEdition(maximMachineGunArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-319596-maxim-machine-gun.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      maximMachineGunArchivalEdition.sourcePdfSha256,
    );
    expect(maximMachineGunPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(maximMachineGunPatent.claims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps all authored source blocks in its review ledger", () => {
    const asset = maximMachineGunPatent.originalTextAsset;
    if (!asset) throw new Error("US 319,596 is missing its reviewed source ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 5)).toEqual({ valid: true });
    const normalizedLedger = normalized(
      ledger.replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, ""),
    );
    for (const block of maximMachineGunArchivalEdition.blocks) {
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

  test("pairs every source paragraph with a companion and every source figure with a local crop", () => {
    const paragraphIndexes = maximMachineGunArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(maximMachineGunParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);

    const references = maximMachineGunArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3]) {
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

  test("removes unsupported recoil, cooling, rate, and claim assertions from public data", () => {
    const visibleData = JSON.stringify({
      title: maximMachineGunPatent.title,
      inventor: maximMachineGunPatent.inventors,
      filingDate: maximMachineGunPatent.filingDate,
      categoryLabel: maximMachineGunPatent.categoryLabel,
      summary: maximMachineGunPatent.summary,
      originalText: maximMachineGunPatent.originalText,
      plainEnglish: maximMachineGunPatent.plainEnglishExplanation,
      claims: maximMachineGunPatent.claims,
      drawings: maximMachineGunPatent.drawings,
      sourceFace: maximMachineGunArchivalEdition.blocks,
    });
    expect(visibleData).toContain("muzzle");
    expect(visibleData).toContain("1885-03-14");
    expect(visibleData).not.toContain("600 rounds");
    expect(visibleData).not.toContain("250-round");
    expect(visibleData).not.toContain("water jacket");
    expect(visibleData).not.toContain("toggle-lock");
    expect(visibleData).not.toContain("recoil-operated");
    expect(visibleData).not.toContain("Recoil Dynamics");
    expect(visibleData).not.toContain("$\\");
  });
});
