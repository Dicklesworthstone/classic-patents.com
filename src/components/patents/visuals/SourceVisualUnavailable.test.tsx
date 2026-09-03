import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { SourceVisualUnavailable } from "./SourceVisualUnavailable";

describe("SourceVisualUnavailable Component", () => {
  test("renders a visual-only boundary without hiding the patent text", () => {
    const html = renderToStaticMarkup(
      <SourceVisualUnavailable
        title="Boyle & Smith CCD Visual Refusal"
        detail="Awaiting full figure-sheet synchronization."
      />,
    );

    expect(html).toContain("Visual-model boundary");
    expect(html).toContain("Boyle &amp; Smith CCD Visual Refusal");
    expect(html).toContain("Awaiting full figure-sheet synchronization.");
    expect(html).toContain(
      "The complete patent text remains available on the Original Patent Text",
    );
  });
});
