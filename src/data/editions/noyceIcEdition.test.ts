import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";
import {
  noyceIcArchivalEdition,
  noyceIcOriginalTextExcerpt,
  noyceIcParallelReadings,
} from "./noyceIcEdition";

describe("US 2,981,877 manual source edition", () => {
  test("pins the eight-page facsimile and all ten printed claims", () => {
    expect(noyceIcPatent.archivalEdition).toBe(noyceIcArchivalEdition);
    expect(validateCuratedSpecificationEdition(noyceIcArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-2981877-noyce-ic.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      noyceIcArchivalEdition.sourcePdfSha256,
    );
    expect(noyceIcPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 10 }, (_, index) => index + 1),
    );
    expect(noyceIcPatent.claims.find((claim) => claim.number === 8)?.dependsOn).toEqual([7]);
    expect(noyceIcPatent.stats).toMatchObject({ totalClaims: 10, independentClaims: 9 });
  });

  test("has a complete review locator ledger and no source-PDF text-layer publication", () => {
    const asset = noyceIcPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-2981877-noyce-ic-reviewed.txt",
      kind: "reviewed-transcription",
      pageCount: 8,
      sourcePdfSha256: noyceIcArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Missing Noyce review ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(JSON.stringify(noyceIcPatent.archivalEdition)).not.toContain("source-pdf-text-layer");
  });

  test("contains every literal masthead, specification, claim, and cited-reference block in the reviewed ledger", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const ledgerText = normalize(ledger);
    const printedBlocks = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      if (block.kind === "heading") return [block.text];
      if (block.kind === "table") {
        return [
          ...block.rows.flatMap((row) =>
            row.map((cell) => cell.map((inline) => inline.text).join("")),
          ),
        ];
      }
      return [];
    });
    for (const printedBlock of printedBlocks) {
      expect(ledgerText).toContain(normalize(printedBlock));
    }
    expect(JSON.stringify(noyceIcArchivalEdition)).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
  });

  test("retains the citation headings' source punctuation", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    expect(ledger).toContain("References Cited in the file of this patent\nUNITED STATES PATENTS");
    expect(ledger).not.toContain("References Cited in the file of this patent:");
    expect(ledger).not.toContain("UNITED STATES PATENTS:");
  });

  test("preserves the printed drawing-sheet formal matter and labels rather than editorial summaries", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-2981877-noyce-ic-reviewed.txt`,
      "utf8",
    );
    for (const printedLine of [
      "R. N. NOYCE                         2,981,877",
      "SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE",
      "Filed July 30, 1959                                                     3 Sheets-Sheet 1",
      "FIG. 1",
      "FIG. 2",
      "FIG. 3",
      "FIG. 4",
      "FIG. 5",
      "FIG. 6",
      "FIG. 7",
      "~ OXIDE INSULATION ~",
      "INVENTOR.",
      "ROBERT N. NOYCE",
      "JEFFERS & KELLS",
      "ATTORNEYS",
    ]) {
      expect(ledger).toContain(printedLine);
    }
    expect(ledger).not.toContain("Drawing sheet 1 of 3:");
  });

  test("uses the source-form masthead, authored specialized-term occurrences, and claim-specific decoders", () => {
    const masthead = noyceIcArchivalEdition.blocks.find((block) => block.kind === "masthead");
    expect(masthead).toMatchObject({
      lines: [
        "UNITED STATES PATENT OFFICE",
        "2,981,877.",
        "SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE.",
        "Robert N. Noyce, Los Altos, Calif., assignor to Fairchild Semiconductor Corporation, Mountain View, Calif., a corporation of Delaware.",
        "Filed July 30, 1959, Ser. No. 830,507. 10 Claims. (Cl. 317-235.) Patented Apr. 25, 1961.",
      ],
    });
    const serializedEdition = JSON.stringify(noyceIcArchivalEdition);
    for (const term of [
      "dished junctions",
      "extrinsic semiconductor",
      "high-resistivity regions",
      "photoengraving techniques",
      "C-shaped, metal strip",
      "shunt capacitance",
      "reverse-bias junction 18",
      "parallel strips",
    ]) {
      expect(serializedEdition).toContain(`"text":"${term}"`);
    }
    const shuntCapacitance = noyceIcArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "term" && inline.text === "shunt capacitance");
    expect(shuntCapacitance?.kind).toBe("term");
    if (shuntCapacitance?.kind === "term") {
      expect(shuntCapacitance.definition.length).toBeGreaterThan(80);
      expect(shuntCapacitance.definition).toContain("lead");
      expect(shuntCapacitance.definition).toContain("semiconductor body");
    }
    expect(new Set(noyceIcPatent.claims.map((claim) => claim.plainEnglish)).size).toBe(10);
    for (const claim of noyceIcPatent.claims) {
      expect(claim.plainEnglish.length).toBeGreaterThan(180);
      expect(claim.keyInnovations.length).toBeGreaterThanOrEqual(3);
      expect(claim.plainEnglish).not.toMatch(/^Claim \d+ keeps the source's named/);
    }
    expect(noyceIcPatent.claims[5]?.plainEnglish).toContain("reverse-biases");
    expect(noyceIcPatent.claims[7]?.plainEnglish).toContain("C-shaped");
    expect(noyceIcPatent.claims[9]?.plainEnglish).toContain("parallel metal-strip");
  });

  test("derives the catalogue opening excerpt from the authored edition and removes the stale base claim copy", () => {
    expect(noyceIcPatent.originalText).toBe(noyceIcOriginalTextExcerpt);
    expect(noyceIcPatent.originalText).toContain(
      "This invention relates to electrical circuit structures incorporating semiconductor devices.",
    );
    expect(noyceIcPatent.originalText).toContain("In brief, the present invention utilizes");
    expect(noyceIcPatent.originalText).not.toContain(
      "This catalogue excerpt is not the archival edition",
    );
    const patentSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/noyce-ic.ts"),
      "utf8",
    );
    expect(patentSource).not.toMatch(/const baseNoyceIcPatent[\s\S]*?claims:\s*\[/);
    expect(patentSource).not.toContain("A semiconductor device as defined in claim 1");
  });

  test("records the exact cloud recrop plan without binding uncreated replacement assets", () => {
    const pendingPlan = [
      {
        figure: "Fig. 3",
        page: 2,
        rectangle: [430, 570, 1500, 800],
        src: "/patents/figures/us-2981877-noyce-ic/fig-3-source-crop-v4.png",
      },
      {
        figure: "Fig. 5 left source panel",
        page: 2,
        rectangle: [360, 2130, 860, 680],
        src: "/patents/figures/us-2981877-noyce-ic/fig-5-source-crop-v3-left.png",
      },
      {
        figure: "Fig. 5 right source panel",
        page: 2,
        rectangle: [1250, 2130, 780, 680],
        src: "/patents/figures/us-2981877-noyce-ic/fig-5-source-crop-v3-right.png",
      },
    ] as const;
    const serializedEdition = JSON.stringify(noyceIcArchivalEdition);
    for (const item of pendingPlan) {
      expect(serializedEdition).not.toContain(item.src);
      expect(existsSync(resolve(process.cwd(), "public", item.src.slice(1)))).toBe(false);
      expect(item.rectangle.every((coordinate) => Number.isInteger(coordinate))).toBe(true);
      expect(item.rectangle[2]).toBeGreaterThan(0);
      expect(item.rectangle[3]).toBeGreaterThan(0);
    }
    expect(serializedEdition).toContain("fig-3-source-crop-v3.png");
    expect(serializedEdition).toContain("fig-5-source-crop-v2-left.png");
    expect(serializedEdition).toContain("fig-5-source-crop-v2-right.png");
  });

  test("pairs each source paragraph explicitly and maps every literal figure occurrence to pinned source crops", () => {
    const paragraphIndexes = noyceIcArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(noyceIcParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const reading of Object.values(noyceIcParallelReadings)) {
      expect(reading.join(" ").trim().length).toBeGreaterThan(80);
    }
    const figureReferences = (inlines: readonly CuratedSpecificationInline[]) =>
      inlines.filter(
        (inline): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    const figures = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if ("inlines" in block) return figureReferences(block.inlines);
      if (block.kind === "figure-sheet") return figureReferences(block.description);
      return [];
    });
    const literalTargets: Record<string, number> = {
      "2": 2,
      "4": 4,
      "7": 7,
      "Fig. 1": 1,
      "Fig. 2": 2,
      "Fig. 3": 3,
      "Fig. 4": 4,
      "Fig. 5": 5,
      "Fig. 6": 6,
      "Fig. 7": 7,
      "Figs. 1": 1,
      "Figs. 3": 3,
      "Figs. 6": 6,
    };
    const literalCounts = {
      "2": 4,
      "4": 7,
      "7": 1,
      "Fig. 1": 3,
      "Fig. 2": 2,
      "Fig. 3": 3,
      "Fig. 4": 2,
      "Fig. 5": 16,
      "Fig. 6": 3,
      "Fig. 7": 2,
      "Figs. 1": 4,
      "Figs. 3": 7,
      "Figs. 6": 1,
    };
    const cropProofs: Record<
      number,
      readonly { src: string; width: number; height: number; sha256: string }[]
    > = {
      1: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-1-source-crop-v2.png",
          width: 1500,
          height: 1250,
          sha256: "4fbef84970dde39569b9f8a607cdf2170bbcec94a6bdb2f9dc251fe9ea84a8ed",
        },
      ],
      2: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-2-source-crop-v2.png",
          width: 1340,
          height: 660,
          sha256: "854980f3f0012457dba6caa6c3250757df9fbc2c2e86a51f3cc9a249e52c9064",
        },
      ],
      3: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-3-source-crop-v3.png",
          width: 1500,
          height: 950,
          sha256: "5f6537a7d1858b1d0560aa61f71486187c58fb1312a518980cbb5660f56a2268",
        },
      ],
      4: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-4-source-crop-v3.png",
          width: 1700,
          height: 570,
          sha256: "2875f0c90fed673c96ccff4df868c8864adf308318f2ec8887a8caab399549d5",
        },
      ],
      5: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-5-source-crop-v2-left.png",
          width: 950,
          height: 650,
          sha256: "e60e991620fc4cc6f65f6c2326ca79b4974b5e671e57b8fd29e05649b569d583",
        },
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-5-source-crop-v2-right.png",
          width: 800,
          height: 460,
          sha256: "31328131e8f5daaffd7f03c77aa6d4507d150740103440c3414b0de5b485add3",
        },
      ],
      6: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-6-source-crop-v2.png",
          width: 1200,
          height: 880,
          sha256: "9b00970bf243df426abacbd29a78b9c4ee3e335bc489c8e8b205b1603c2362c9",
        },
      ],
      7: [
        {
          src: "/patents/figures/us-2981877-noyce-ic/fig-7-source-crop-v2.png",
          width: 1100,
          height: 800,
          sha256: "366919a0b063462e7654d4cda3cf4c78dbc0f5fa3c865b7a3a2525345ded6815",
        },
      ],
    };
    expect(figures).toHaveLength(55);
    expect(
      Object.fromEntries(
        Object.entries(literalCounts).map(([literal]) => [
          literal,
          figures.filter((reference) => reference.text === literal).length,
        ]),
      ),
    ).toEqual(literalCounts);
    for (const reference of figures) {
      const target = literalTargets[reference.text];
      expect(target).toBeDefined();
      expect(reference.label).toBe(
        `Open the source-facsimile crop for Fig. ${target} in US 2,981,877`,
      );
      expect(
        reference.figurePreviews?.map(({ src, width, height }) => ({ src, width, height })),
      ).toEqual(cropProofs[target].map(({ src, width, height }) => ({ src, width, height })));
    }
    for (const proofs of Object.values(cropProofs)) {
      for (const proof of proofs) {
        const path = resolve(process.cwd(), "public", proof.src.slice(1));
        expect(existsSync(path)).toBe(true);
        expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(proof.sha256);
      }
    }
  });

  test("derives each published claim verbatim from the archival-edition claim node", () => {
    for (const claim of noyceIcPatent.claims) {
      const editionClaim = noyceIcArchivalEdition.blocks.find(
        (block) => block.kind === "claim" && block.number === claim.number,
      );
      expect(editionClaim?.kind).toBe("claim");
      if (editionClaim?.kind === "claim") {
        expect(claim.originalText).toBe(editionClaim.inlines.map((inline) => inline.text).join(""));
      }
    }
  });

  test("uses explicitly authored canonical drawing records", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/noyceIcEdition.ts"),
      "utf8",
    );
    expect(editionSource).not.toContain("drawings: [1, 2, 3, 4, 5, 6, 7].map");
    expect(noyceIcPatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "Fig. 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
      "Fig. 7",
    ]);
    expect(noyceIcPatent.drawings.map((drawing) => drawing.title)).not.toContain("Source Fig. 1");
  });

  test("does not leak the superseded speculative catalogue reconstruction", () => {
    expect(noyceIcPatent.shortTitle).toBe("Oxide-insulated semiconductor leads");
    expect(noyceIcPatent.historicalContext.patentWars).toEqual([]);
    const visitorCopy = JSON.stringify({
      summary: noyceIcPatent.summary,
      heroQuote: noyceIcPatent.heroQuote,
      plainEnglishExplanation: noyceIcPatent.plainEnglishExplanation,
      historicalContext: noyceIcPatent.historicalContext,
      tags: noyceIcPatent.tags,
    });
    for (const unsupportedLegacyClaim of [
      "Tyranny of Numbers",
      "Noyce v. Kilby",
      "million transistors",
      "gigahertz",
      "1,000°C",
      "Nobel Prize",
    ]) {
      expect(visitorCopy).not.toContain(unsupportedLegacyClaim);
    }
    expect(visitorCopy).toContain("surface-reaching P-N junction");
    expect(visitorCopy).toContain("reverse-biased junctions 18 and 22");
  });
});
