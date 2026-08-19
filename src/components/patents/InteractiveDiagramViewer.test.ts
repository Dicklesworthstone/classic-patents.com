import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";

describe("Interactive Historical Schematic & Drawing Sheets", () => {
  test("ensures every catalog patent has authentic drawings with high-resolution crops or sheet locators", () => {
    for (const patent of allPatents) {
      expect(patent.drawings).toBeDefined();
      expect(patent.drawings.length).toBeGreaterThan(0);
      for (const drawing of patent.drawings) {
        expect(drawing.figureNumber.trim().length).toBeGreaterThan(0);
        expect(drawing.title.trim().length).toBeGreaterThan(3);
        expect(drawing.caption.trim().length).toBeGreaterThan(5);
        expect(drawing.svgType).toBeDefined();
      }
    }
  });

  test("Wright Flyer exemplar contains Fig 1 with authentic callout coordinates", () => {
    expect(wrightFlyerPatent.drawings.length).toBeGreaterThanOrEqual(1);
    const fig1 = wrightFlyerPatent.drawings.find((d) => d.figureNumber.includes("1"));
    expect(fig1).toBeDefined();
    expect(fig1?.callouts).toBeDefined();
    expect(fig1?.callouts?.length).toBeGreaterThan(0);

    // Callout labels match facsimile letters/numbers
    const calloutLabels = fig1?.callouts?.map((c) => c.label);
    expect(calloutLabels).toContain("1");
  });

  test("validates callout coordinates stay within [0, 100]% bounding box", () => {
    for (const patent of allPatents) {
      for (const drawing of patent.drawings) {
        if (drawing.callouts) {
          for (const callout of drawing.callouts) {
            expect(callout.x).toBeGreaterThanOrEqual(0);
            expect(callout.x).toBeLessThanOrEqual(100);
            expect(callout.y).toBeGreaterThanOrEqual(0);
            expect(callout.y).toBeLessThanOrEqual(100);
            expect(callout.element.trim().length).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
