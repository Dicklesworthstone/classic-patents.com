import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { allPatents } from "@/data/patents";

/**
 * A reader must be able to discover a cited source figure or drawing division
 * through an explicit authored reference node. Leaving one in a text node
 * makes it visually inert and, for figures, suppresses its source-crop preview.
 */
const BARE_DRAWING_REFERENCE = /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|division\s+\d+)\b/i;
const FIGURE_GROUP_REFERENCE =
  /\b(?:figs\.?|figures)\s+\d+[a-z′′]*(?:\s*(?:,|and|to|through)\s*\d+[a-z′′]*)+/i;
const FIGURE_LABEL = /\d+[a-z′′]*/gi;
const NUMERIC_FIGURE_RANGE = /(\d+)\s*(?:to|through|[-–])\s*(\d+)/i;

function sourcePngDimensions(path: string): { width: number; height: number } | undefined {
  const bytes = readFileSync(path);
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    bytes.subarray(12, 16).toString("ascii") !== "IHDR"
  ) {
    return undefined;
  }

  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("manual archival-edition semantics", () => {
  test("does not leave source drawing references as inert prose", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        const inlineGroups =
          block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : block.kind === "figure-sheet"
              ? [block.description]
              : block.kind === "table"
                ? [...block.headers, ...block.rows.flat()]
                : [];

        for (const [groupIndex, inlines] of inlineGroups.entries()) {
          for (const [inlineIndex, inline] of inlines.entries()) {
            if (inline.kind === "reference" && inline.referenceType === "figure") continue;
            const matches = inline.text.match(new RegExp(BARE_DRAWING_REFERENCE, "gi"));
            if (matches) {
              violations.push(
                `${patent.id} block ${blockIndex} group ${groupIndex} inline ${inlineIndex}: ${matches.join(", ")}`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("makes every attached source-figure reference a local renderable preview", () => {
    const violations: string[] = [];
    let figureReferenceCount = 0;

    for (const patent of allPatents) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        const inlineGroups =
          block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : block.kind === "figure-sheet"
              ? [block.description]
              : block.kind === "table"
                ? [...block.headers, ...block.rows.flat()]
                : [];

        for (const inlines of inlineGroups) {
          for (const inline of inlines) {
            if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
            figureReferenceCount += 1;

            if (!inline.figurePreviews?.length) {
              violations.push(
                `${patent.id} block ${blockIndex}: ${inline.text} has no source-figure preview.`,
              );
              continue;
            }

            for (const preview of inline.figurePreviews) {
              if (!preview.src.startsWith("/patents/figures/")) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} points outside local figure assets (${preview.src}).`,
                );
                continue;
              }

              const previewPath = resolve(process.cwd(), "public", preview.src.slice(1));
              if (!existsSync(previewPath)) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} preview is missing (${preview.src}).`,
                );
                continue;
              }

              if (statSync(previewPath).size < 512) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} preview is not a meaningful image asset (${preview.src}).`,
                );
              }
              if (preview.width < 1 || preview.height < 1) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} preview has invalid dimensions (${preview.src}).`,
                );
              }

              const sourceDimensions = sourcePngDimensions(previewPath);
              if (!sourceDimensions) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} preview is not a decodable PNG (${preview.src}).`,
                );
              } else if (
                sourceDimensions.width !== preview.width ||
                sourceDimensions.height !== preview.height
              ) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} preview dimensions disagree with its source image (${preview.src}).`,
                );
              }
            }
          }
        }
      }
    }

    expect(figureReferenceCount).toBeGreaterThan(0);
    expect(violations).toEqual([]);
  });

  test("does not let a multi-figure citation pretend one figure crop covers unnamed figures", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      const edition = patent.archivalEdition;
      if (!edition) continue;

      for (const [blockIndex, block] of edition.blocks.entries()) {
        const inlineGroups =
          block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : block.kind === "figure-sheet"
              ? [block.description]
              : block.kind === "table"
                ? [...block.headers, ...block.rows.flat()]
                : [];

        for (const inlines of inlineGroups) {
          for (const inline of inlines) {
            if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
            const citation = inline.text.match(FIGURE_GROUP_REFERENCE)?.[0];
            if (!citation || inline.figurePreviews?.length !== 1) continue;

            const alt = inline.figurePreviews[0]?.alt.toLowerCase() ?? "";
            const citationLabels = citation.match(FIGURE_LABEL) ?? [];
            const explicitlyNamed = citationLabels.every((label) =>
              alt.includes(label.toLowerCase()),
            );
            const numericLabels = citationLabels.map((label) => Number(label));
            const range = alt.match(NUMERIC_FIGURE_RANGE);
            const rangeCoversCitation =
              citationLabels.every((label) => /^\d+$/.test(label)) &&
              range !== null &&
              Math.min(...numericLabels) >= Number(range[1]) &&
              Math.max(...numericLabels) <= Number(range[2]);
            if (!explicitlyNamed && !rangeCoversCitation) {
              violations.push(
                `${patent.id} block ${blockIndex}: ${inline.text} has one preview that does not identify both cited figure endpoints.`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
