import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { maimanRubyLaserPatent } from "@/data/patents/maiman-ruby-laser";
import type { CuratedSpecificationBlock } from "@/types/patent";
import {
  maimanRubyLaserArchivalEdition,
  maimanRubyLaserParallelReadings,
  manualMaimanClaimText,
} from "./maimanRubyLaserEdition";

const FIGURE_PREVIEW_EXPECTATIONS = [
  {
    text: "FIG. 1",
    href: "#figure-1",
    label: "Figure 1",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v2.png",
    width: 1600,
    height: 1100,
    sha256: "798c14e708b1a4a339ddc742fba6b8766eb7f8b0040dca2d06942ac7a8439545",
  },
  {
    text: "FIG. 2",
    href: "#figure-2",
    label: "Figure 2",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v2.png",
    width: 1700,
    height: 620,
    sha256: "1ea50cb6c6d21b53f110c1c1e402a4323cb22530e1adddd73ed95268c0c55a6f",
  },
  {
    text: "FIG. 4",
    href: "#figure-4",
    label: "Figure 4",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png",
    width: 1600,
    height: 520,
    sha256: "c057f56dbc137a3235b77bd674c60178da14f304ce0634b884ef08ba77ea6538",
  },
  {
    text: "FIG. 7",
    href: "#figure-7",
    label: "Figure 7",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png",
    width: 1120,
    height: 700,
    sha256: "bb30cbd9d1907a49880c8f1ab3d9d501302874eb3d43685ff60007adc641c976",
  },
  {
    text: "FIG. 7",
    href: "#figure-7",
    label: "Figure 7",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png",
    width: 300,
    height: 300,
    sha256: "265e8d7121970512588fb134897a2b9f922178e09d70dc663df10a771edd393e",
  },
  {
    text: "FIG. 7",
    href: "#figure-7",
    label: "Figure 7",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png",
    width: 550,
    height: 480,
    sha256: "34a83a0bb1ae8b9fd9e9edd755e1e2722289fc5dfabef89bc4243faa9726ba99",
  },
  {
    text: "FIG. 7",
    href: "#figure-7",
    label: "Figure 7",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png",
    width: 380,
    height: 450,
    sha256: "75ac1b3f49cde5ec416ac8ae870d39491e3f9eb06e2759322c17b6831eeee3e9",
  },
  {
    text: "FIG. 18",
    href: "#figure-18",
    label: "Figure 18",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png",
    width: 1150,
    height: 1200,
    sha256: "1f396c6a3e80db1b17ca0bbdbc75dc3de16cca4da7309fac94f834b9ed7ef6a5",
  },
  {
    text: "FIG. 18",
    href: "#figure-18",
    label: "Figure 18",
    src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png",
    width: 900,
    height: 600,
    sha256: "c7ac6eabd4e14368a0be7818051e4e1104d10782d51ea271e6bd2663a56547e6",
  },
] as const;

function readPngDimensions(bytes: Buffer): { width: number; height: number } {
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("US 3,353,115 Theodore H. Maiman Ruby Laser Archival Edition publication contract", () => {
  const root = process.cwd();
  const pdfPath = join(root, "public/patents/pdfs/us-3353115-maiman-ruby-laser.pdf");
  const ledgerPath = join(
    root,
    "public/patents/transcripts/us-3353115-maiman-ruby-laser-reviewed.txt",
  );

  test("keeps the source candidate withheld after figure framing and mapping rejection", () => {
    expect(maimanRubyLaserPatent.archivalEdition).toBeUndefined();
    expect(maimanRubyLaserPatent.originalTextAsset).toBeUndefined();
  });

  test("pins the immutable facsimile PDF with matching lowercase SHA-256", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBytes = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(digest).toBe(maimanRubyLaserArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6");
  });

  test("verifies reviewed transcript ledger exists with 10-page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    for (let p = 1; p <= 10; p++) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 10 ---`);
    }
  });

  test("contains all 2 printed claims matching the reviewed ledger text", () => {
    const claims = maimanRubyLaserArchivalEdition.blocks.filter(
      (b: CuratedSpecificationBlock): b is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
        b.kind === "claim",
    );
    expect(claims.length).toBe(2);
    expect(claims.map((c) => c.number)).toEqual([1, 2]);

    const claim1Text = manualMaimanClaimText(1);
    const claim2Text = manualMaimanClaimText(2);

    expect(claim1Text).toContain("three energy level laser");
    expect(claim1Text).toContain("population inversion");
    expect(claim1Text).toContain("interferometer means");

    expect(claim2Text).toContain("three energy level ruby laser system");
    expect(claim2Text).toContain("radiationless energy transition");
    expect(claim2Text).toContain("light-resonating means");
  });

  test("pins every authored figure occurrence to its complete source-pixel preview set", () => {
    const actual = maimanRubyLaserArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference"
              ? (inline.figurePreviews ?? []).map((preview) => ({
                  text: inline.text,
                  href: inline.href,
                  label: inline.label,
                  src: preview.src,
                  width: preview.width,
                  height: preview.height,
                }))
              : [],
          )
        : [],
    );

    expect(actual).toEqual(
      FIGURE_PREVIEW_EXPECTATIONS.map(({ sha256: _sha256, ...expectation }) => expectation),
    );

    for (const expected of FIGURE_PREVIEW_EXPECTATIONS) {
      const figPath = join(root, "public", expected.src);
      expect(existsSync(figPath)).toBe(true);
      const bytes = readFileSync(figPath);
      expect(readPngDimensions(bytes)).toEqual({ width: expected.width, height: expected.height });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected.sha256);
    }

    const figure7Alts = maimanRubyLaserArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.text === "FIG. 7"
              ? (inline.figurePreviews ?? []).map(({ src, alt }) => ({ src, alt }))
              : [],
          )
        : [],
    );
    expect(figure7Alts).toEqual([
      {
        src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png",
        alt: "Figure 7 energy-level apparatus: white-light input, fluorescent stage, and ruby stage.",
      },
      {
        src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png",
        alt: "Printed Figure 7 label from the source drawing sheet.",
      },
      {
        src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png",
        alt: "Figure 7 upper-right labels: second energy level and level 2.",
      },
      {
        src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png",
        alt: "Figure 7 lower-right ruby path and downward arrow from level 2 to level 1.",
      },
    ]);
  });

  test("pairs every source paragraph with an explicit non-lossy reading", () => {
    const explainableBlocks = maimanRubyLaserArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(maimanRubyLaserParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(maimanRubyLaserParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });
});
