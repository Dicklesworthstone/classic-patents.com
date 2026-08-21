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
      if (patentId.startsWith("_")) continue;
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

  test("keeps Ericsson's public cards within the printed source geometry and shaft relation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-588-ericsson-propeller"];
    expect(cards.map((card) => card.id)).toEqual([
      "ericsson-source-helical-development",
      "ericsson-source-opposed-shaft-motion",
    ]);
    expect(cards[0]?.rawLatex).toBe("P = 3D");
    expect(cards[1]?.rawLatex).toContain("\\omega_b");

    const publicCards = JSON.stringify(cards);
    for (const unsupportedPublicAssertion of [
      "10 - 15",
      "15% efficiency gain",
      "USS Monitor",
      "slipstream rotation",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Goddard US 1,102,653 on its printed solid-charge tapered-tube limitation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-1102653-goddard-rocket"];
    expect(cards.map((card) => card.id)).toEqual(["goddard-source-tapered-tube-minimum"]);
    expect(cards[0]?.rawLatex).toBe("L \\ge 3D");
    expect(cards[0]?.claimRef).toBe(2);

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "turbopump",
      "apollo",
      "space launch vehicle",
      "new york times",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Noyce US 2,981,877 on its printed oxide-supported crossing relation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-2981877-noyce-ic"];
    expect(cards.map((card) => card.id)).toEqual(["noyce-source-oxide-crossing-lead"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("retained oxide layer");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "35 v planar oxide",
      "gigahertz switching",
      "11.7",
      "10^-8",
      "microprocessors, ram, and gpus",
      "silicon valley",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Pasteur US 135,245 on its printed gas-sweep and spray-cooling sequence", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-135245-pasteur-fermentation"];
    expect(cards.map((card) => card.id)).toEqual(["pasteur-source-gas-sweep-and-spray-cooling"]);
    expect(cards[0]?.rawLatex).toContain("external spray cooling");
    expect(cards[0]?.claimRef).toBe(1);

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "log kill",
      "arrhenius",
      "shelf life",
      "cfu/ml",
      "65^",
      "glycolysis",
      "germ theory of disease",
      "swan-neck",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Diesel US 542,846 on its printed Claim 1 process sequence", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-542846-diesel-engine"];
    expect(cards.map((card) => card.id)).toEqual([
      "diesel-source-claim-one-controlled-combustion-sequence",
    ]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("gradual fuel admission during expansion");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "18:1",
      "680",
      "65",
      "210",
      "common rail",
      "brake thermal efficiency",
      "droplet diameter",
      "65 bar",
      "cylinder dimension",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Carrier US 808,897 on its printed wet-plate separator relation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-808897-carrier-air-conditioner"];
    expect(cards.map((card) => card.id)).toEqual(["carrier-source-wet-plate-separator"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("unobstructed wet front plates");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "constant enthalpy air conditioning",
      "saturation dew-point humidity",
      "20\\text{ to }150\\text{ kw}",
      "10^\\circ\\text{c} to 13^\\circ\\text{c}",
      "foggy train platform",
      "pittsburgh",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Edison US 200,521 on its printed helical-recording boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-200521-edison-phonograph"];
    expect(cards.map((card) => card.id)).toEqual(["edison-source-helical-recording-chain"]);
    expect(cards[0]?.claimRef).toBe(4);
    expect(cards[0]?.rawLatex).toContain("10\\,\\text{grooves/in}");
    expect(cards[0]?.rawLatex).toContain("10\\,\\text{threads/in}");

    const sourceVariables = JSON.stringify(cards[0]?.variables).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "brass drum",
      "mica diaphragm",
      "0.1016",
      "60 rpm",
      "0.32 m/s",
      "3,000 hz",
    ]) {
      expect(sourceVariables).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Parsons US 608,969 on its printed marine-routing relation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-608969-parsons-turbine"];
    expect(cards.map((card) => card.id)).toEqual(["parsons-source-selectable-turbine-routing"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("plural screw-shafts");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "multistage reaction enthalpy",
      "40,000 rpm",
      "50% degree of reaction",
      "80% of the world's electricity",
      "\u0394h_{\\text{stage}}",
      "u_{\\text{blade}}",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Boyle-Smith US 3,858,232 on its source-review boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-3858232-boyle-smith-ccd"];
    expect(cards.map((card) => card.id)).toEqual(["boyle-smith-source-adjacent-storage-minima"]);
    expect(cards[0]?.claimRef).toBe(2);
    expect(cards[0]?.rawLatex).toContain("stored minority carriers");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "3-phase mos",
      "0.99999",
      "dark current",
      "hubble",
      "megapixel",
      "camera performance",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Kwolek US 3,671,542 on its checked-claim boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-3671542-kwolek-kevlar"];
    expect(cards.map((card) => card.id)).toEqual(["kwolek-source-anisotropic-dope"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("optically anisotropic dope");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "130 gpa",
      "3,600 mpa",
      "9,500",
      "ballistic",
      "body armor",
      "dry-jet geometry",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Marconi US 586,193 at its held contact-and-reset claim boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-586193-marconi-radio"];
    expect(cards.map((card) => card.id)).toEqual(["marconi-source-contact-reset"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("imperfect electrical contact");
    expect(cards[0]?.rawLatex).toContain("shaking means");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "36.56",
      "estimated range",
      "transatlantic",
      "nickel-silver",
      "50 kv",
      "10^5",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Lamarr US 2,292,387 at its held synchronized-record claim boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-2292387-lamarr-frequency-hopping"];
    expect(cards.map((card) => card.id)).toEqual(["lamarr-source-synchronized-record-tuning"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("first record strip");
    expect(cards[0]?.rawLatex).toContain("synchronous motion");

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "19.44",
      "anti-jam",
      "wi-fi",
      "bluetooth",
      "10\\text{ to }50",
      "milliseconds",
    ]) {
      expect(publicCards).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Fermi US 2,708,656 at its held Claim 1 contour boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-2708656-fermi-reactor"];
    expect(cards.map((card) => card.id)).toEqual(["fermi-source-claim-one-criticality-contour"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("natural-uranium rods");
    expect(JSON.stringify(cards).toLowerCase()).not.toContain("delayed neutron fraction");
  });

  test("keeps Engelbart US 3,541,541 at its held Claim 1 apparatus boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-3541541-engelbart-mouse"];
    expect(cards.map((card) => card.id)).toEqual(["engelbart-source-position-signal-chain"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("perpendicular position wheels");
    expect(cards[0]?.rawLatex).toContain("flexible conductor");
    const published = JSON.stringify(cards).toLowerCase();
    expect(published).not.toContain("steel tracking wheel radius");
    expect(published).not.toContain("kinetic friction coefficient");
  });

  test("keeps Mergenthaler US 313,224 at its held Claim 1 matrix-bar boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-313224-mergenthaler-linotype"];
    expect(cards.map((card) => card.id)).toEqual(["mergenthaler-source-continuous-matrix-bar"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("continuous matrix-bar");
    expect(cards[0]?.rawLatex).toContain("intaglio characters read transversely");

    const published = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "90 magazine channels",
      "7-bit binary keyway",
      "240^\\circ",
      "water-cooled mold",
      "eutectic solidification",
    ]) {
      expect(published).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Hollerith US 395,781 at its held Claim 1 record-card boundary", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-395781-hollerith-tabulating"];
    expect(cards.map((card) => card.id)).toEqual(["hollerith-source-record-card-circuit-chain"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toContain("separate record-cards");
    expect(cards[0]?.rawLatex).toContain("circuit-controlling index-points");

    const published = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "288 grid positions",
      "12v electrical circuit",
      "80 cards/min",
      "mercury-cup current",
      "solenoid force",
    ]) {
      expect(published).not.toContain(unsupportedPublicAssertion);
    }
  });

  test("keeps Westinghouse US 124,404 at its authentic double-pipe and signalling boundary without triple-valve anachronisms", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-124404-westinghouse-air-brake"];
    expect(cards.map((card) => card.id)).toEqual([
      "westinghouse-double-pipe-receiver-expansion",
      "westinghouse-pneumatic-signalling-index",
    ]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[1]?.claimRef).toBe(5);
    expect(cards[0]?.rawLatex).toContain("V_D");
    expect(cards[0]?.rawLatex).toContain("V_C");
    expect(cards[1]?.rawLatex).toContain("N_{\\text{signal}}");

    const published = JSON.stringify(cards).toLowerCase();
    for (const unsupportedLegacyAssertion of [
      "triple-valve",
      "triple valve",
      "\\mu_{\\text{shoe}}",
      "p_{\\text{pipe}}",
      "f_{\\text{piston}}",
      "f_{\\text{spring}}",
      "graduating spring",
      "slide valve",
    ]) {
      expect(published).not.toContain(unsupportedLegacyAssertion);
    }
  });
});
