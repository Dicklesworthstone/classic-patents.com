import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { landPolaroidPatent } from "@/data/patents/land-polaroid";
import { landPolaroidArchivalEdition, manualLandClaimText } from "./landPolaroidEdition";

const reviewedLedger = readFileSync(
  new URL(
    "../../../public/patents/transcripts/us-2543181-land-polaroid-reviewed.txt",
    import.meta.url,
  ),
  "utf8",
);

function normalizeClaimText(text: string): string {
  return text
    .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 32 ---/g, "")
    .replace(/-\s+(?=[a-z])/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function reconstructLedgerClaims(): { numbers: number[]; textByNumber: Map<number, string> } {
  const numbers: number[] = [];
  const textByNumber = new Map<number, string>();
  let currentNumber: number | undefined;
  let currentParts: string[] = [];

  const flush = () => {
    if (currentNumber === undefined) return;
    textByNumber.set(currentNumber, currentParts.join(" "));
  };

  for (const line of reviewedLedger.split(/\r?\n/)) {
    const claimHeader = line.match(/^(\d+)\.\s+(.+)$/);
    if (claimHeader) {
      flush();
      currentNumber = Number(claimHeader[1]);
      numbers.push(currentNumber);
      currentParts = [claimHeader[2]];
      continue;
    }
    if (currentNumber !== undefined && !line.startsWith("--- REVIEWED TRANSCRIPTION PAGE ")) {
      const trimmed = line.trim();
      if (trimmed) currentParts.push(trimmed);
    }
  }
  flush();
  return { numbers, textByNumber };
}

describe("US 2,543,181 Edwin Land Polaroid source-draft hold", () => {
  it("pins the draft to the correct PDF but keeps it out of the public source face", () => {
    expect(landPolaroidArchivalEdition.kind).toBe("manual-react-edition");
    expect(landPolaroidArchivalEdition.sourcePdfSha256).toBe(
      "4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013",
    );
    expect(landPolaroidArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(landPolaroidPatent.archivalEdition).toBeUndefined();
    expect(landPolaroidPatent.originalTextAsset).toBeUndefined();
  });

  it("retains all 116 staged claim nodes without treating them as reviewed publication text", () => {
    for (let c = 1; c <= 116; c++) {
      const claimText = manualLandClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(10);
    }
  });

  it("has exactly one ledger header per printed claim and matches the edition text", () => {
    const { numbers, textByNumber } = reconstructLedgerClaims();
    expect(numbers).toHaveLength(116);
    expect(new Set(numbers).size).toBe(116);
    expect(numbers).toEqual(Array.from({ length: 116 }, (_, index) => index + 1));

    for (let claimNumber = 1; claimNumber <= 116; claimNumber++) {
      const ledgerText = textByNumber.get(claimNumber);
      expect(ledgerText).toBeDefined();
      expect(normalizeClaimText(ledgerText ?? "")).toBe(
        normalizeClaimText(manualLandClaimText(claimNumber)),
      );
    }
  });

  it("provides distinct claim-specific decoders and concrete innovation signatures", () => {
    const claims = landPolaroidPatent.claims;
    expect(claims).toHaveLength(116);
    expect(claims.every((claim) => !claim.plainEnglish.startsWith("Refinement claim"))).toBe(true);
    expect(new Set(claims.map((claim) => claim.plainEnglish)).size).toBe(116);
    expect(new Set(claims.map((claim) => claim.keyInnovations.join(" | "))).size).toBe(116);

    const anchors: ReadonlyArray<readonly [number, string]> = [
      [1, "attached"],
      [21, "solution"],
      [35, "sheetlike"],
      [47, "silver halide"],
      [68, "film-forming colloid"],
      [79, "spreading"],
      [93, "sodium carboxymethyl cellulose"],
      [106, "dispensing passage"],
      [114, "hydroquinone"],
      [116, "adhesively secured"],
    ];
    for (const [number, anchor] of anchors) {
      const claim = claims.find((candidate) => candidate.number === number);
      expect(claim?.originalText.toLowerCase().replace(/-/g, " ")).toContain(
        anchor.toLowerCase().replace(/-/g, " "),
      );
      expect(claim?.plainEnglish.toLowerCase().replace(/-/g, " ")).toContain(
        anchor.toLowerCase().replace(/-/g, " "),
      );
    }
  });

  it("records every printed figure citation in the reconciled drawing list as an authored reference", () => {
    const references = landPolaroidArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter((inline) => inline.kind === "reference")
        : [],
    );
    expect(references.map((reference) => reference.text)).toEqual([
      "Figure 1",
      "Fig. 2",
      "Fig. 1",
      "Fig. 3",
      "Fig. 2",
      "Fig. 4",
      "Fig. 2",
      "Fig. 5",
      "Fig. 4",
      "Fig. 6",
      "Fig. 5",
      "Fig. 5",
      "Fig. 7",
      "Fig. 2",
      "Fig. 8",
      "Fig. 5",
      "Fig. 9",
      "Fig. 2",
      "Fig. 10",
      "Fig. 9",
      "Fig. 11",
      "Fig. 12",
      "Fig. 11",
      "Fig. 13",
      "Fig. 14",
      "Fig. 15",
      "Fig. 14",
      "Fig. 16",
      "Fig. 15",
      "Fig. 17",
      "Fig. 18",
      "Fig. 19",
      "Fig. 20",
      "Fig. 19",
      "Fig. 21",
      "Fig. 22",
      "Fig. 23",
      "Fig. 24",
      "Fig. 1",
      "Fig. 1",
      "Fig. 1",
      "Fig. 2",
      "Fig. 1",
      "Fig. 1",
      "Fig. 3",
      "Fig. 1",
      "Fig. 3",
      "Fig. 4",
      "Fig. 9",
      "Fig. 9",
      "Fig. 9",
      "Fig. 10",
      "Fig. 11",
      "Fig. 1",
      "Fig. 3",
      "Fig. 3",
      "Fig. 12",
      "Fig. 11",
      "Fig. 11",
      "Fig. 11",
      "Fig. 13",
      "Figs. 14 to 17",
      "Fig. 14",
      "Fig. 14",
      "Figs. 14 and 15",
      "Fig. 16",
      "Fig. 17",
      "Fig. 14",
      "Fig. 18",
      "Fig. 20",
      "Fig. 18",
      "Fig. 20",
      "Fig. 21",
      "Fig. 22",
      "Fig. 14",
      "Fig. 21",
      "Fig. 23",
      "Fig. 24",
      "Fig. 23",
    ]);
    expect(references.every((reference) => reference.figurePreviews === undefined)).toBe(true);
  });
});
