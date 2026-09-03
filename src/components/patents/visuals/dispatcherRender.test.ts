import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { allPatents } from "@/data/patents";
import { PatentVisualDispatcher } from "./index";

describe("PatentVisualDispatcher React SSR rendering", () => {
  test("renders without throwing for all catalog patents in SSR environment", () => {
    expect(allPatents.length).toBeGreaterThanOrEqual(55);

    for (const patent of allPatents) {
      const element = React.createElement(PatentVisualDispatcher, { patentId: patent.id });
      const html = renderToStaticMarkup(element);
      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(0);
      if (patent.id === "us-3671542-kwolek-kevlar") {
        expect(html).toContain("Visual-model boundary");
      } else {
        expect(html).toContain("3D Physics Simulation");
        expect(html).toContain("2D Technical Diagram");
      }
      expect(html).not.toContain("Pinned facsimile guide");
      expect(html).not.toContain("source-crop");
    }
  });
});
