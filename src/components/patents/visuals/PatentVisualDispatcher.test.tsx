import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PatentVisualDispatcher } from "./index";

describe("PatentVisualDispatcher Component", () => {
  test("renders 3D vs 2D mode switcher toolbar for Wright Flyer", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="us-821393-wright-flyer" />);

    expect(html).toContain("3D Physics Simulation");
    expect(html).toContain("2D Technical Diagram");
    expect(html).toContain('data-testid="patent-visual-dispatcher"');
    expect(html).toContain('data-patent-id="us-821393-wright-flyer"');
    expect(html).toContain('data-render-mode="3d-physics"');
    expect(html).toMatch(/data-physics-tick="\d+"/);
    expect(html).toContain('data-testid="patent-visual-surface"');
  });

  test("renders 3D vs 2D mode switcher toolbar for Noyce Planar IC", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="us-2981877-noyce-ic" />);

    expect(html).toContain("3D Physics Simulation");
    expect(html).toContain("2D Technical Diagram");
  });

  test("renders 3D vs 2D mode switcher toolbar for Fermi Reactor", () => {
    const html = renderToStaticMarkup(
      <PatentVisualDispatcher patentId="us-2708656-fermi-reactor" />,
    );

    expect(html).toContain("3D Physics Simulation");
    expect(html).toContain("2D Technical Diagram");
  });

  test("does not offer nonexistent 3D and 2D modes for the source-held Kwolek record", () => {
    const html = renderToStaticMarkup(
      <PatentVisualDispatcher patentId="us-3671542-kwolek-kevlar" />,
    );

    expect(html).toContain("Visual-model boundary");
    expect(html).not.toContain("3D Physics Simulation");
    expect(html).not.toContain("2D Technical Diagram");
  });

  test("renders fallback banner for unrecognized patent id", () => {
    const html = renderToStaticMarkup(<PatentVisualDispatcher patentId="non-existent-patent-id" />);

    expect(html).toContain("No interactive physics module is registered");
    expect(html).toContain('data-patent-id="non-existent-patent-id"');
  });
});
