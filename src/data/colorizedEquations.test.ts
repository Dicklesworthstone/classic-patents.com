/**
 * src/data/colorizedEquations.test.ts
 *
 * Integrity tests for Interactive Colorized Math Equations.
 */

import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import {
  ALL_COLORIZED_EQUATIONS,
  getColorizedEquationsForPatent,
} from "./colorizedEquations";

describe("Colorized Equations Master Registry Integrity", () => {
  test("every patent in catalog resolves at least one valid colorized equation", () => {
    for (const patent of allPatents) {
      const eqs = getColorizedEquationsForPatent(patent.id);
      expect(eqs.length).toBeGreaterThan(0);

      for (const eq of eqs) {
        expect(eq.id).toBeDefined();
        expect(eq.title).toBeTruthy();
        expect(eq.rawLatex).toBeTruthy();
        expect(eq.plainEnglishSentence.length).toBeGreaterThan(0);
        expect(eq.variables.length).toBeGreaterThan(0);

        // Verify variable integrity
        const varIds = new Set<string>();
        for (const v of eq.variables) {
          expect(v.id).toBeTruthy();
          expect(varIds.has(v.id)).toBe(false); // Unique IDs
          varIds.add(v.id);

          expect(v.symbol).toBeTruthy();
          expect(v.name).toBeTruthy();
          expect(v.role).toBeTruthy();
          expect(v.unit).toBeTruthy();
          expect(v.explanation).toBeTruthy();
          expect([
            "crimson",
            "sapphire",
            "emerald",
            "amber",
            "amethyst",
            "cyan",
            "coral",
            "rose",
            "teal",
          ]).toContain(v.color);
        }

        // Verify plain English sentence fragment linkage
        for (const fragment of eq.plainEnglishSentence) {
          expect(fragment.text).toBeDefined();
          if (fragment.variableId) {
            expect(varIds.has(fragment.variableId)).toBe(true);
          }
        }
      }
    }
  });

  test("bespoke equations contain deep SI physics and claim citations", () => {
    const wrightEqs = ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"];
    expect(wrightEqs).toBeDefined();
    expect(wrightEqs[0].title).toContain("Induced Drag");
    expect(wrightEqs[0].claimRef).toBe(1);

    const teslaEqs = ALL_COLORIZED_EQUATIONS["us-381968-tesla-motor"];
    expect(teslaEqs).toBeDefined();
    expect(teslaEqs[0].title).toContain("Rotating Stator");

    const fermiEqs = ALL_COLORIZED_EQUATIONS["us-2708656-fermi-reactor"];
    expect(fermiEqs).toBeDefined();
    expect(fermiEqs[0].title).toContain("Delayed Neutron");
  });

  test("all LaTeX equations compile cleanly through KaTeX without syntax errors", async () => {
    const katex = (await import("katex")).default;

    for (const patent of allPatents) {
      const eqs = getColorizedEquationsForPatent(patent.id);
      for (const eq of eqs) {
        // Test rawLatex
        expect(() => {
          katex.renderToString(eq.rawLatex, {
            displayMode: true,
            throwOnError: true,
            trust: true,
          });
        }).not.toThrow();

        // Test colorizedLatex
        if (eq.colorizedLatex) {
          expect(() => {
            katex.renderToString(eq.colorizedLatex, {
              displayMode: true,
              throwOnError: true,
              trust: true,
            });
          }).not.toThrow();
        }
      }
    }
  });
});
