import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { goddardRocketPatent } from "@/data/patents/goddard-rocket";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  goddardRocketArchivalEdition,
  goddardRocketParallelReadings,
} from "./goddardRocketEdition";

describe("goddardRocketArchivalEdition", () => {
  test("pins the reviewed four-page US 1,102,653 facsimile and all eight printed claims", () => {
    expect(validateCuratedSpecificationEdition(goddardRocketArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(goddardRocketArchivalEdition.sourcePdfSha256).toBe(
      "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
    );
    expect(goddardRocketArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      goddardRocketArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("maps every visitor-reachable figure citation to its exact versioned source crop or documented source group", async () => {
    const serialized = JSON.stringify(goddardRocketArchivalEdition.blocks);
    expect(serialized).not.toContain("SOURCE PDF PAGE");
    expect(serialized).not.toContain("pdftotext");
    expect(serialized).not.toContain("ocr");

    const expectedPreviews = {
      "Fig. 1": {
        src: "/patents/figures/us-1102653-goddard-rocket-fig-1-source-crop-v8.png",
        width: 720,
        height: 2160,
        sha256: "77d43e7f37d6f89037510a44fbbd7c9b449ad999c3f7a1bb739177bda3b491ee",
      },
      "Fig. 2": {
        src: "/patents/figures/us-1102653-goddard-rocket-fig-2-source-crop-v5.png",
        width: 1050,
        height: 920,
        sha256: "18292325c5c392c25b0afd75cbad453b63b352ce2dffc6e32f20a7383d2ebbf6",
      },
      "Fig. 3": {
        src: "/patents/figures/us-1102653-goddard-rocket-fig-3-source-crop-v8.png",
        width: 650,
        height: 640,
        sha256: "e759f032d871373a9f9d24baf268ed41a50802e5e93a8b4f3e1f560f163e2e06",
      },
      "Fig. 4": {
        src: "/patents/figures/us-1102653-goddard-rocket-fig-4-source-crop-v7.png",
        width: 620,
        height: 620,
        sha256: "918e9bf70957b76b2e774b5e1c7582987c7938c582a117adf2abe2e51ecd5b95",
      },
      "Fig. 5": {
        src: "/patents/figures/us-1102653-goddard-rocket-fig-5-source-crop-v8.png",
        width: 740,
        height: 850,
        sha256: "1c83557e8cedfe583fb5c7cdaa43721f4fd1e03adcc83454fec9669b866e08a9",
      },
    } as const;

    const sourceFigureReferences = goddardRocketArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      return inlines.filter(
        (inline) => inline.kind === "reference" && inline.referenceType === "figure",
      );
    });

    expect(
      sourceFigureReferences.map((reference) => {
        if (reference.kind !== "reference" || reference.referenceType !== "figure") {
          throw new Error("Goddard source figure reference inventory is malformed.");
        }
        return [
          reference.text,
          reference.figurePreviews?.map(({ src, width, height }) => ({ src, width, height })),
        ];
      }),
    ).toEqual([
      [
        "Figs. 1 through 5",
        [
          expectedPreviews["Fig. 1"],
          expectedPreviews["Fig. 2"],
          expectedPreviews["Fig. 3"],
          expectedPreviews["Fig. 4"],
          expectedPreviews["Fig. 5"],
        ].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Figure 1",
        [expectedPreviews["Fig. 1"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 2",
        [expectedPreviews["Fig. 2"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Figs. 3 and 4",
        [expectedPreviews["Fig. 3"], expectedPreviews["Fig. 4"]].map(({ src, width, height }) => ({
          src,
          width,
          height,
        })),
      ],
      [
        "Fig. 2",
        [expectedPreviews["Fig. 2"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 5",
        [expectedPreviews["Fig. 5"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 1",
        [expectedPreviews["Fig. 1"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 3",
        [expectedPreviews["Fig. 3"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 5",
        [expectedPreviews["Fig. 5"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 3",
        [expectedPreviews["Fig. 3"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
      [
        "Fig. 1",
        [expectedPreviews["Fig. 1"]].map(({ src, width, height }) => ({ src, width, height })),
      ],
    ]);

    for (const preview of Object.values(expectedPreviews)) {
      const file = Bun.file(`public${preview.src}`);
      expect(await file.exists()).toBe(true);
      const bytes = new Uint8Array(await file.arrayBuffer());
      expect([...bytes.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
      expect({
        width: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(16),
        height: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(20),
      }).toEqual({ width: preview.width, height: preview.height });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(preview.sha256);
    }
  });

  test("turns every source figure citation into an authored preview node", () => {
    const bareFigureReference = /\b(?:fig(?:s)?\.?|figure)\s+\d+/i;

    for (const block of goddardRocketArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureReference);
      }
    }
  });

  test("defines period technical terms at their exact source occurrences", () => {
    const terms = goddardRocketArchivalEdition.blocks.flatMap((block) => {
      if (block.kind !== "paragraph") return [];
      return block.inlines.filter((inline) => inline.kind === "term");
    });

    expect(terms.map((term) => term.text)).toEqual([
      "combustion chamber",
      "truncated cone",
      "backwardly curved tubes or recesses",
      "key",
      "firing tube",
      "gyroscope",
      "three-phase induction motor",
    ]);
    for (const term of terms) expect(term.definition.split(/\s+/).length).toBeGreaterThan(8);
  });

  test("provides a complete-coverage, non-lossy companion for every source paragraph", () => {
    for (const [index, block] of goddardRocketArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = goddardRocketParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(20);
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = reading?.join(" ").trim().split(/\s+/).length ?? 0;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("keeps the repaired source closure withheld while preserving local claim-comparison evidence", async () => {
    const editionClaims = goddardRocketArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(goddardRocketPatent.id).toBe("us-1102653-goddard-rocket");
    expect(goddardRocketPatent.patentNumber).toBe("US 1,102,653");
    expect(goddardRocketPatent.archivalEdition).toBeUndefined();
    expect(goddardRocketPatent.originalTextAsset).toBeUndefined();
    expect(goddardRocketPatent.stats).toEqual({ totalClaims: 8, independentClaims: 8 });
    expect(goddardRocketPatent.claims).toHaveLength(8);
    for (const claim of editionClaims) {
      const decoder = goddardRocketPatent.claims.find(
        (candidate) => candidate.number === claim.number,
      );
      expect(decoder?.originalText).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(decoder?.plainEnglish.split(/\s+/).length).toBeGreaterThan(20);
    }

    const transcript = await Bun.file(
      "public/patents/transcripts/us-1102653-goddard-rocket.txt",
    ).text();
    expect(validateReviewedTranscription(transcript, 4)).toEqual({ valid: true });
    for (const claim of editionClaims) {
      expect(transcript).toContain(claim.inlines.map((inline) => inline.text).join(""));
    }
  });
});
