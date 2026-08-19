import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PatentVisualDispatcher } from "./index";

describe("PatentVisualDispatcher Component", () => {
  test("renders 3D vs 2D mode switcher toolbar for verified visual grants", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="us-821393-wright-flyer" />);

    expect(html).toContain("3D Physics Simulation");
    expect(html).toContain("2D Technical Diagram");
  });

  test("hides mode switcher toolbar for patents with verified static/source drawing guides", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="us-2981877-noyce-ic" />);

    expect(html).not.toContain("3D Physics Simulation");
    expect(html).not.toContain("2D Technical Diagram");
  });

  test("renders refusal state for patents under source-integrity hold", () => {
    const html = renderToStaticMarkup(
      <PatentVisualDispatcher patentId="us-2708656-fermi-reactor" />,
    );

    expect(html).toContain("Source-integrity hold");
    expect(html).toContain("Neutronic-reactor visual under source review");
  });

  test("renders fallback banner for unrecognized patent id", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="non-existent-patent-id" />);

    expect(html).toContain("No interactive physics module is registered");
  });
});
