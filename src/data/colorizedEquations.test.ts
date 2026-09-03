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

  test("keeps Spencer's public card within the wavelength region printed by US 2,495,429", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-2495429-spencer-microwave"];
    expect(cards.map((card) => card.id)).toEqual(["spencer-source-wavelength-region"]);
    expect(cards[0]?.rawLatex).toContain("10\\,\\mathrm{cm}");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    for (const unsupported of [
      "2.45 ghz",
      "2450",
      "hull cutoff",
      "dielectric loss",
      "popcorn",
      "anode voltage",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Edison Indicator's public card within the circuit topology printed by US 307,031", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-307031-edison-indicator"];
    expect(cards.map((card) => card.id)).toEqual(["edison-indicator-source-circuit-path"]);
    expect(cards[0]?.rawLatex).toContain("terminal in vacuous globe");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    for (const unsupported of [
      "richardson",
      "4.60 ev",
      "1900",
      "2200",
      "carbonized bamboo",
      "current density",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Edison's lamp equations source-bounded and labels declared thermal inputs", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-223898-edison-lightbulb"];
    expect(cards.map((card) => card.id)).toEqual([
      "edison-high-resistance-carbon-filament",
      "edison-vacuum-mean-free-path",
      "edison-blackbody-radiation",
    ]);
    expect(cards[2]?.rawLatex).toContain("T_{\\text{ambient}}^4");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    expect(publicCopy).toContain("one-millionth");
    expect(publicCopy).toContain("seven one-thousandths");
    for (const unsupported of [
      "sprengel",
      "bamboo",
      "2,200",
      "1,200",
      "16 candlepower",
      "110 volts dc",
      "100x",
      "ultra-high",
      "operating lifespan",
      "to avoid melting",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Daimler's public card within the marine coupling relation printed by US 361,931", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-361931-daimler-engine"];
    expect(cards.map((card) => card.id)).toEqual(["daimler-source-thrust-maintained-coupling"]);
    expect(cards[0]?.rawLatex).toContain("propeller thrust");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    for (const unsupported of [
      "standuhr",
      "hot-tube",
      "800 rpm",
      "264",
      "4.5-meter",
      "motorcycle",
      "automobile",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Howe's public cards on the printed local geometry and declared display kinematics", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-4750-howe-sewing-machine"];
    expect(cards.map((card) => card.id)).toEqual([
      "howe-source-printed-local-dimensions",
      "howe-one-shaft-source-order-kinematics",
    ]);
    expect(cards[0]?.rawLatex).toContain("3.175\\,\\mathrm{mm}");
    expect(cards[1]?.rawLatex).toContain("K\\subset I");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    for (const unsupported of [
      "thread tension",
      "seam strength",
      "capstan",
      "newtons",
      "watts",
      "300 spm",
      "feed dog",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Pelton's public card on the bucket geometry printed by US 233,692", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-233692-pelton-water-wheel"];
    expect(cards.map((card) => card.id)).toEqual(["pelton-source-bucket-path"]);
    expect(cards[0]?.rawLatex).toContain("c_{\\mathrm{left/right}}");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    for (const unsupported of [
      "165-degree",
      "165^",
      "90%",
      "88%",
      "water head",
      "wheel rpm",
      "shaft power",
      "needle spear",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Otto's public cards on the printed graded-charge and shaft sequence", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-194047-otto-engine"];
    expect(cards.map((card) => card.id)).toEqual([
      "otto-graded-charge",
      "otto-four-stroke-shaft-timing",
    ]);
    expect(cards.map((card) => card.claimRef)).toEqual([1, 3]);
    expect(cards[0]?.rawLatex).toContain("\\phi(0)");
    expect(cards[1]?.rawLatex).toContain("\\theta_K");

    const publicCopy = JSON.stringify(cards).toLowerCase();
    expect(publicCopy).toContain("air");
    for (const unsupported of [
      "brake horsepower",
      "peak combustion",
      "indicated power",
      "1876 deutz shop",
      "fuel specific heat release",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
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

  test("keeps Lemelson US 3,081,379 at its source-bounded signal-path relation", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-3081379-lemelson-machine-vision"];
    expect(cards.map((card) => card.id)).toEqual(["lemelson-source-signal-path"]);
    expect(cards[0]?.claimRef).toBe(1);
    expect(cards[0]?.rawLatex).toBe("C = S \\land G \\land A \\land I");
    expect(cards[0]?.variables.every((variable) => variable.unit === "logical state")).toBe(true);

    const publicCards = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "scanbeamvelocitympers",
      "solenoidforcen",
      "gatereponsetimems",
      "measuredpartwidthmm",
      "f_{\\text{mag}}",
      "v_{\\text{scan}}",
      "15,750",
      "0.0006",
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

  test("keeps Otis US 31,128 on its source topology and refuses invented arrest dynamics", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-31128-otis-elevator"];
    expect(cards.map((card) => card.id)).toEqual([
      "otis-claim-one-hook-lock-topology",
      "otis-claim-three-stop-interlock",
      "otis-claim-four-opposite-counterpoise",
    ]);
    expect(cards.map((card) => card.claimRef)).toEqual([1, 3, 4]);
    expect(cards[0]?.rawLatex).toContain("G_{\\text{taut}}");
    expect(cards[1]?.rawLatex).toContain("(O,P)");
    expect(cards[2]?.rawLatex).toContain("dq_R = -dq_D");

    const published = JSON.stringify(cards).toLowerCase();
    for (const unsupportedLegacyAssertion of [
      "wagon-spring",
      "leaf spring stiffness",
      "arrest force",
      "stopping distance",
      "38 milliseconds",
      "0.040",
      "80\\text{ kn/m}",
      "2.4\\text{ kn}",
      "3.5\\text{ kg}",
      "1854 crystal palace",
    ]) {
      expect(published).not.toContain(unsupportedLegacyAssertion);
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

  test("keeps Kamen's public cards on claim topology rather than an illustrative dynamics model", () => {
    const cards = ALL_COLORIZED_EQUATIONS["us-5701965-kamen-transporter"];
    expect(cards.map((card) => card.id)).toEqual([
      "kamen-fore-aft-control-topology",
      "kamen-cluster-transfer-climb-topology",
    ]);
    expect(cards.map((card) => card.claimRef)).toEqual([1, 26]);

    const published = JSON.stringify(cards).toLowerCase();
    for (const unsupportedPublicAssertion of [
      "100 hz",
      "pid",
      "gyroscope",
      "accelerometer",
      "newton-meters",
      "meters per second",
      "harmonic drive",
      "planetary",
      "segway pt",
      "ibot",
    ]) {
      expect(published).not.toContain(unsupportedPublicAssertion);
    }
    expect(published).toContain("claim 1");
    expect(published).toContain("claim 26");
    expect(published).toContain("source-topology");
  });
});
