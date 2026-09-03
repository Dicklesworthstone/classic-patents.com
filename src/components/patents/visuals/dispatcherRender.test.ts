import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { allPatents } from "@/data/patents";
import { PatentVisualDispatcher } from "./index";
import { planPhoneFocusClearance } from "./phoneFocusClearance";

function rect(top: number, bottom: number, left = 0, right = 375) {
  return { top, bottom, left, right };
}

function shiftRect<T extends { top: number; bottom: number }>(
  rectangle: T,
  scrollTopDelta: number,
) {
  return {
    ...rectangle,
    top: rectangle.top - scrollTopDelta,
    bottom: rectangle.bottom - scrollTopDelta,
  };
}

function verticallyIntersects(
  first: { top: number; bottom: number },
  second: { top: number; bottom: number },
) {
  return first.top < second.bottom && first.bottom > second.top;
}

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

  test("clears real focused-phone canvas/header overlaps without hiding the active control", () => {
    const cases = [
      {
        name: "Hull primary range focus moves the canvas below the masthead",
        viewportHeight: 800,
        header: rect(0, 65, 0, 320),
        canvas: rect(-17.75, 340.25, 59, 261.03125),
        control: rect(545.25, 561.25, 71, 249.03125),
        placement: "below-header" as const,
      },
      {
        name: "Clavel claim focus moves the canvas above the masthead",
        viewportHeight: 812,
        header: rect(0, 65),
        canvas: rect(-274.5, 165.5, 17, 358),
        control: rect(471.5, 515.5, 29, 226.90625),
        placement: "above-header" as const,
      },
      {
        name: "Colt claim focus moves the canvas above the masthead",
        viewportHeight: 812,
        header: rect(0, 65),
        canvas: rect(-199.5, 220.5, 17, 358),
        control: rect(703.5, 747.5, 33, 230.90625),
        placement: "above-header" as const,
      },
    ];

    for (const scenario of cases) {
      const plan = planPhoneFocusClearance(
        scenario.canvas,
        scenario.header,
        scenario.control,
        scenario.viewportHeight,
      );
      expect(plan, scenario.name).not.toBeNull();
      if (!plan) continue;

      expect(plan.canvasPlacement, scenario.name).toBe(scenario.placement);
      const movedCanvas = shiftRect(scenario.canvas, plan.scrollTopDelta);
      const movedControl = shiftRect(scenario.control, plan.scrollTopDelta);
      expect(verticallyIntersects(movedCanvas, scenario.header), scenario.name).toBe(false);
      expect(movedControl.top, scenario.name).toBeGreaterThanOrEqual(scenario.header.bottom + 8);
      expect(movedControl.bottom, scenario.name).toBeLessThanOrEqual(scenario.viewportHeight - 8);
    }
  });

  test("does not scroll when the canvas already clears the masthead", () => {
    expect(planPhoneFocusClearance(rect(73, 420), rect(0, 65), rect(500, 516), 800)).toBeNull();
  });
});
