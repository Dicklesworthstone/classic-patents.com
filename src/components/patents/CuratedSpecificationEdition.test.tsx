import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { CuratedSpecificationEdition as CuratedSpecificationEditionData } from "@/types/patent";
import { CuratedSpecificationEdition } from "./CuratedSpecificationEdition";

const edition: CuratedSpecificationEditionData = {
  kind: "manual-react-edition",
  sourcePdfSha256: "a".repeat(64),
  preparedBy: "Classic Patents editorial agent",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    { kind: "masthead", lines: ["UNITED STATES PATENT OFFICE"] },
    { kind: "heading", level: 2, text: "Specification" },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Literal <script>text</script> remains historical text. " },
        { kind: "emphasis", text: "Emphasized historical words." },
        { kind: "text", text: " " },
        { kind: "small-caps", text: "CAPITALS" },
        { kind: "text", text: " " },
        {
          kind: "reference",
          text: "Fig. 1",
          href: "?view=pdf-facsimile",
          referenceType: "figure",
          label: "Open Fig. 1 in the primary facsimile",
          figurePreviews: [
            {
              src: "/patents/figures/us-1/fig-1-source-crop-v1.png",
              alt: "Source crop of Fig. 1",
              width: 800,
              height: 600,
            },
            {
              src: "/patents/figures/us-1/fig-1-source-crop-v1.png",
              alt: "Repeated source crop with a second authored locator",
              width: 800,
              height: 600,
            },
          ],
        },
        { kind: "text", text: " " },
        {
          kind: "term",
          text: "aeroplane",
          definition: "A lifting wing surface in period usage.",
          label: "Period term",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Test drawing",
      description: [{ kind: "text", text: "An authored figure-sheet description." }],
    },
    {
      kind: "table",
      caption: "An authored historical table",
      headers: [[{ kind: "text", text: "Part" }], [{ kind: "text", text: "Function" }]],
      rows: [[[{ kind: "text", text: "A" }], [{ kind: "text", text: "Moves the mechanism." }]]],
    },
    {
      kind: "equation",
      text: "F = ma",
      description: "An exact historical formula when the source contains one.",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [{ kind: "text", text: "A flying-machine substantially as described." }],
    },
  ],
};

describe("CuratedSpecificationEdition", () => {
  test("escapes historical text while rendering only explicit authored term UI", () => {
    const html = renderToStaticMarkup(
      <CuratedSpecificationEdition
        edition={edition}
        paragraphReadings={{
          2: [
            "A source-specific explanation prepared by an editor.",
            "A second authored paragraph retains another material detail.",
          ],
        }}
        claimDecoders={[{ number: 1, plainEnglish: "The legal scope of the example claim." }]}
      />,
    );

    expect(html).toContain("&lt;script&gt;text&lt;/script&gt;");
    expect(html).not.toContain("<script>text</script>");
    expect(html).toContain("aeroplane");
    expect(html).toContain("A lifting wing surface in period usage.");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain("Fig. 1");
    expect(html).toContain("Open Fig. 1 in the primary facsimile");
    expect(html).toContain('data-testid="source-figure-reference"');
    expect(html).toContain('data-figure-preview-count="2"');
    expect(html).toContain("/patents/figures/us-1/fig-1-source-crop-v1.png");
    expect(html).toContain("Repeated source crop with a second authored locator");
    expect(html).toContain("Plain English");
    expect(html).toContain("A source-specific explanation prepared by an editor.");
    expect(html).toContain("A second authored paragraph retains another material detail.");
    expect(html).toContain("The legal scope of the example claim.");
    expect(html).not.toContain("FIG. 1");
    expect(html).not.toContain("Test drawing");
    expect(html).not.toContain("An authored figure-sheet description.");
    expect(html).toContain("An authored historical table");
    expect(html).toContain("F = ma");
  });
});
