import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SourceVisualUnavailable } from "./SourceVisualUnavailable";

describe("SourceVisualUnavailable Component", () => {
  test("renders source-integrity hold banner with title, detail, and explanation", () => {
    const html = renderToStaticMarkup(
      <SourceVisualUnavailable
        title="Boyle & Smith CCD Visual Refusal"
        detail="Awaiting full figure-sheet synchronization."
      />,
    );

    expect(html).toContain("Source-integrity hold");
    expect(html).toContain("Boyle &amp; Smith CCD Visual Refusal");
    expect(html).toContain("Awaiting full figure-sheet synchronization.");
    expect(html).toContain("The original facsimile remains available elsewhere on this page.");
    expect(html).toContain("A public source edition is shown only after review.");
  });
});
