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
    const html = renderToStaticMarkup(<CuratedSpecificationEdition edition={edition} />);

    expect(html).toContain("&lt;script&gt;text&lt;/script&gt;");
    expect(html).not.toContain("<script>text</script>");
    expect(html).toContain("aeroplane");
    expect(html).toContain("Definition available.");
    expect(html).toContain("A lifting wing surface in period usage.");
    expect(html).toContain("FIG. 1");
    expect(html).toContain("An authored historical table");
    expect(html).toContain("F = ma");
  });
});
