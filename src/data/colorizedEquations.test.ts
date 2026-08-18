/**
 * src/data/colorizedEquations.test.ts
 *
 * Integrity tests for Interactive Colorized Math Equations.
 */

import { describe, expect, test } from "bun:test";
import { ALL_COLORIZED_EQUATIONS, getColorizedEquationsForPatent } from "./colorizedEquations";
import { allPatents } from "./patents";

describe("Colorized Equations Master Registry Integrity", () => {
  test("bespoke equations contain deep SI physics and claim citations", () => {
    const wrightEqs = ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"];
    expect(wrightEqs).toBeDefined();
    expect(wrightEqs.length).toBe(5);

    const inducedDragEq = wrightEqs.find((e) => e.id === "wright-induced-drag");
    expect(inducedDragEq).toBeDefined();
    expect(inducedDragEq?.title).toContain("Induced Drag");
    expect(inducedDragEq?.claimRef).toBe(1);

    const liftEq = wrightEqs.find((e) => e.id === "wright-lift-circulation");
    expect(liftEq).toBeDefined();
    expect(liftEq?.title).toContain("Aerodynamic Lift");

    const turnEq = wrightEqs.find((e) => e.id === "wright-coordinated-turn");
    expect(turnEq).toBeDefined();
    expect(turnEq?.title).toContain("Coordinated Turn");

    const teslaEqs = ALL_COLORIZED_EQUATIONS["us-381968-tesla-motor"];
    expect(teslaEqs).toBeDefined();
    expect(teslaEqs[0].title).toContain("Rotating Stator");

    const fermiEqs = ALL_COLORIZED_EQUATIONS["us-2708656-fermi-reactor"];
    expect(fermiEqs).toBeDefined();
    expect(fermiEqs[0].title).toContain("Delayed Neutron");
  });

  test("all LaTeX equations compile cleanly through KaTeX without syntax errors", async () => {
    const katex = (await import("katex")).default;

    for (const [_patentId, eqs] of Object.entries(ALL_COLORIZED_EQUATIONS)) {
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

        // Test rawLatex
        expect(() => {
          katex.renderToString(eq.rawLatex, {
            displayMode: true,
            throwOnError: true,
            trust: true,
            strict: false,
          });
        }).not.toThrow();

        // Test colorizedLatex
        if (eq.colorizedLatex) {
          expect(() => {
            katex.renderToString(eq.colorizedLatex, {
              displayMode: true,
              throwOnError: true,
              trust: true,
              strict: false,
            });
          }).not.toThrow();
        }
      }
    }
  });

  test("never fabricates an interactive equation card from a patent formula or physics registry", () => {
    expect(getColorizedEquationsForPatent("us-x72-whitney-cotton-gin")).toEqual([]);
    expect(getColorizedEquationsForPatent("unknown-patent-with-no-authored-card")).toEqual([]);

    const authoredCards = new Set(Object.values(ALL_COLORIZED_EQUATIONS).flat());
    for (const patent of allPatents) {
      for (const card of getColorizedEquationsForPatent(patent.id)) {
        expect(authoredCards.has(card)).toBe(true);
      }
    }
  });
});
