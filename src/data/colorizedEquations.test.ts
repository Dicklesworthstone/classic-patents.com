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
    expect(teslaEqs[0].title).toContain("Two-Circuit Figure 9");

    const teslaEddyCard = teslaEqs.find(
      (equation) => equation.id === "tesla-eddy-current-subdivision",
    );
    expect(teslaEddyCard?.pedagogicalNote).not.toContain("inventing the laminated");
    expect(teslaEddyCard?.historicalSignificance).not.toContain("over 92%");

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

  test("returns empty array for unknown patent IDs and returns authentic authored cards for all catalog patents", () => {
    expect(getColorizedEquationsForPatent("unknown-patent-with-no-authored-card")).toEqual([]);
    expect(getColorizedEquationsForPatent("fake-patent-12345")).toEqual([]);

    const authoredCards = new Set(Object.values(ALL_COLORIZED_EQUATIONS).flat());
    expect(allPatents.length).toBe(54);
    for (const patent of allPatents) {
      const cards = getColorizedEquationsForPatent(patent.id);
      expect(cards.length).toBeGreaterThanOrEqual(1);
      for (const card of cards) {
        expect(authoredCards.has(card)).toBe(true);
        expect(card.patentId).toBe(patent.id);
      }
    }
  });
});
