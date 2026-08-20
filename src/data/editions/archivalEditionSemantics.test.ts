import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { allPatents } from "@/data/patents";
import { isArchivalEditionExplicitlyWithheld } from "./publicationApproval";

/**
 * A reader must be able to discover a cited source figure or drawing division
 * through an explicit authored reference node. Leaving one in a text node
 * makes it visually inert and, for figures, suppresses its source-crop preview.
 */
const BARE_DRAWING_REFERENCE = /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|division\s+\d+)\b/i;
const FIGURE_GROUP_REFERENCE =
  /\b(?:figs\.?|figures)\s+\d+[a-z′′]*(?:(?:\s*,\s*(?:and\s+)?|\s+(?:and|to|through)\s+|\s*[-–]\s*)\d+[a-z′′]*)+/i;
const FIGURE_LABEL = /\d+[a-z′′]*/gi;
const NUMERIC_FIGURE_RANGE = /(\d+)\s*(?:to|through|[-–])\s*(\d+)/i;
const SINGLE_FIGURE_REFERENCE = /^fig(?:ure)?\.?\s*(\d+[a-z′′]*)\.?$/i;

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function previewExplicitlyIdentifiesFigure(preview: { src: string; alt: string }, label: string) {
  const sourceIdentity = `${preview.src} ${preview.alt}`;
  const directIdentifier = new RegExp(
    `\\bfig(?:ure)?s?[-_\\s.]*${escapeForRegExp(label)}(?![a-z0-9])`,
    "i",
  );
  if (directIdentifier.test(sourceIdentity)) return true;

  const explicitFigureLists = sourceIdentity.matchAll(/\bfig(?:ure)?s?\.?\s+([^:;]+)/gi);
  for (const [, list] of explicitFigureLists) {
    const listedLabels = list.match(FIGURE_LABEL)?.map((entry) => entry.toLowerCase()) ?? [];
    if (listedLabels.includes(label)) return true;
  }

  const numericLabel = /^\d+$/.test(label) ? Number(label) : undefined;
  if (numericLabel === undefined) return false;

  const range = sourceIdentity.match(NUMERIC_FIGURE_RANGE);
  if (range !== null && numericLabel >= Number(range[1]) && numericLabel <= Number(range[2])) {
    return true;
  }

  return false;
}

function citedFigureLabels(citation: string): string[] {
  const labels = new Set((citation.match(FIGURE_LABEL) ?? []).map((entry) => entry.toLowerCase()));
  const range = citation.match(NUMERIC_FIGURE_RANGE);
  if (range === null) return [...labels];

  const first = Number(range[1]);
  const last = Number(range[2]);
  if (last < first || last - first > 50) return [...labels];
  for (let figure = first; figure <= last; figure += 1) {
    labels.add(String(figure));
  }
  return [...labels];
}

describe("manual archival-edition semantics", () => {
  test("parses every figure in comma-separated lists and numeric ranges", () => {
    expect("Figs. 2, 3, and 7".match(FIGURE_GROUP_REFERENCE)?.[0]).toBe("Figs. 2, 3, and 7");
    expect(citedFigureLabels("Figs. 2, 3, and 7")).toEqual(["2", "3", "7"]);
    expect("Figs. 4-10".match(FIGURE_GROUP_REFERENCE)?.[0]).toBe("Figs. 4-10");
    expect(citedFigureLabels("Figs. 4-10")).toEqual(["4", "10", "5", "6", "7", "8", "9"]);
  });

  test("does not leave source drawing references as inert prose", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      if (isArchivalEditionExplicitlyWithheld(patent.id)) continue;
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
      if (isArchivalEditionExplicitlyWithheld(patent.id)) continue;
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

  test("gives every figure in a multi-figure citation an explicitly identified preview", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      if (isArchivalEditionExplicitlyWithheld(patent.id)) continue;
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
            if (!citation || !inline.figurePreviews?.length) continue;

            for (const label of citedFigureLabels(citation)) {
              if (
                !inline.figurePreviews.some((preview) =>
                  previewExplicitlyIdentifiesFigure(preview, label),
                )
              ) {
                violations.push(
                  `${patent.id} block ${blockIndex}: ${inline.text} has no preview identifying Fig. ${label}.`,
                );
              }
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test("does not attach an exactly cited figure number to a differently numbered crop", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      if (isArchivalEditionExplicitlyWithheld(patent.id)) continue;
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
            const match = inline.text.trim().match(SINGLE_FIGURE_REFERENCE);
            if (!match || !inline.figurePreviews?.length) continue;

            const label = match[1].toLowerCase();
            const identified = inline.figurePreviews.some((preview) =>
              previewExplicitlyIdentifiesFigure(preview, label),
            );
            if (!identified) {
              violations.push(
                `${patent.id} block ${blockIndex}: ${inline.text} has no preview identifying Fig. ${label}.`,
              );
            }
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
