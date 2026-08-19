import { describe, expect, test } from "bun:test";
import { archivalEditionForPublication } from "@/components/patents/DualProjectionViewer";
import { allPatents } from "@/data/patents";

/**
 * A reader must be able to discover a cited source figure or drawing division
 * through an explicit authored reference node. Leaving one in a text node
 * makes it visually inert and, for figures, suppresses its source-crop preview.
 */
const BARE_DRAWING_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

describe("manual archival-edition semantics", () => {
  test("does not leave source drawing references as inert prose", () => {
    const violations: string[] = [];

    for (const patent of allPatents) {
      const edition = archivalEditionForPublication(patent);
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
            if (inline.kind !== "text") continue;
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
});
