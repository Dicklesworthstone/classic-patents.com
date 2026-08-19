import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { ALL_COLORIZED_EQUATIONS } from "./colorizedEquations";

describe("Colorized Equations Quality & Integrity Suite", () => {
  test("ensures all 54 classic patents have colorized mathematical equations", () => {
    for (const patent of allPatents) {
      const equations = ALL_COLORIZED_EQUATIONS[patent.id];
      expect(equations).toBeDefined();
      expect(Array.isArray(equations)).toBe(true);
      expect(equations.length).toBeGreaterThanOrEqual(1);
    }
  });

  test("validates structure, dual-coding sentences, and variables for every equation", () => {
    let totalEquations = 0;
    let totalVariables = 0;

    for (const [patentId, equations] of Object.entries(ALL_COLORIZED_EQUATIONS)) {
      for (const eq of equations) {
        totalEquations++;
        expect(eq.id.trim().length).toBeGreaterThan(0);
        expect(eq.patentId).toBe(patentId);
        expect(eq.title.trim().length).toBeGreaterThan(0);
        expect(eq.rawLatex.trim().length).toBeGreaterThan(0);
        expect(eq.colorizedLatex.trim().length).toBeGreaterThan(0);
        expect(eq.plainEnglishSentence.length).toBeGreaterThan(0);
        expect(eq.variables.length).toBeGreaterThan(0);

        const varIdSet = new Set(eq.variables.map((v) => v.id));

        for (const v of eq.variables) {
          totalVariables++;
          expect(v.id.trim().length).toBeGreaterThan(0);
          expect(v.symbol.trim().length).toBeGreaterThan(0);
          expect(v.name.trim().length).toBeGreaterThan(0);
          expect(v.color.trim().length).toBeGreaterThan(0);
          expect(v.role.trim().length).toBeGreaterThan(0);
          expect(v.unit.trim().length).toBeGreaterThan(0);
          expect(v.explanation.trim().length).toBeGreaterThan(10);
        }

        // Verify every sentence fragment with a variableId points to a declared variable
        for (const frag of eq.plainEnglishSentence) {
          if (frag.variableId) {
            expect(varIdSet.has(frag.variableId)).toBe(true);
          }
        }
      }
    }

    expect(totalEquations).toBeGreaterThanOrEqual(100);
    expect(totalVariables).toBeGreaterThanOrEqual(500);
  });
});
