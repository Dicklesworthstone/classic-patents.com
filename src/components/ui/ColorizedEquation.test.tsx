/**
 * src/components/ui/ColorizedEquation.test.tsx
 *
 * Component tests for ColorizedEquation.
 */

import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { ColorizedEquation } from "./ColorizedEquation";
import { COLOR_STYLES, wrapKatexColor } from "./colorPalette";

describe("ColorizedEquation Component", () => {
  const wrightFlyerInducedDrag =
    ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"].find((e) => e.id === "wright-induced-drag") ??
    ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"][0];

  test("renders Wright Flyer colorized equation without errors", () => {
    const eq = wrightFlyerInducedDrag;
    expect(eq).toBeDefined();

    const html = renderToString(<ColorizedEquation equation={eq} />);
    expect(html).toContain('data-testid="colorized-equation"');
    expect(html).toContain(`data-equation-id="${eq.id}"`);
    expect(html).toContain(`data-patent-id="${eq.patentId}"`);
    expect(html).toContain("Prandtl Induced Drag");
    expect(html).toContain("Aerodynamics");
    expect(html).toContain("Plain English Decoder");
    expect(html).toContain("Induced Drag Coefficient");
  });

  test("renders Tesla Motor colorized equation with terms and drawer", () => {
    const eq =
      ALL_COLORIZED_EQUATIONS["us-381968-tesla-motor"].find(
        (e) => e.id === "tesla-fig9-pole-shift",
      ) ?? ALL_COLORIZED_EQUATIONS["us-381968-tesla-motor"][0];
    expect(eq).toBeDefined();

    const html = renderToString(<ColorizedEquation equation={eq} />);
    expect(html).toContain("Figure 9 Progressive Pole Shift");
  });

  test("renders serializable custom-format Ethernet and mechanical equations", () => {
    const ethernet = ALL_COLORIZED_EQUATIONS["us-4063220-metcalfe-ethernet"][0];
    const helicopter = ALL_COLORIZED_EQUATIONS["us-2318259-sikorsky-helicopter"][0];

    const ethernetHtml = renderToString(<ColorizedEquation equation={ethernet} />);
    const helicopterHtml = renderToString(<ColorizedEquation equation={helicopter} />);

    expect(ethernetHtml).toContain("Coaxial Cable Electromagnetic Wave Propagation");
    expect(helicopterHtml).toContain("Modern Anti-Torque Moment-Balance Lens");
    expect(JSON.stringify([ethernet, helicopter])).not.toContain("formatValue");
  });

  test("color palette helper produces correct KaTeX color tags", () => {
    const wrapped = wrapKatexColor("C_L^2", "emerald", false);
    expect(wrapped).toBe(`\\textcolor{${COLOR_STYLES.emerald.hexLight}}{C_L^2}`);

    const wrappedDark = wrapKatexColor("C_L^2", "emerald", true);
    expect(wrappedDark).toBe(`\\textcolor{${COLOR_STYLES.emerald.hexDark}}{C_L^2}`);
  });

  test("renders collapsed view and custom initial active variable", () => {
    const eq = wrightFlyerInducedDrag;
    const html = renderToString(
      <ColorizedEquation equation={eq} initialActiveVariableId="cl" defaultExpanded={false} />,
    );
    expect(html).toContain("Lift Coefficient (Squared)");
    expect(html).toContain('aria-expanded="false"');
  });

  test("does not render an unreviewed generated equation for an unknown patent ID", () => {
    const { getColorizedEquationsForPatent } = require("@/data/colorizedEquations");
    const unauthoredEqs = getColorizedEquationsForPatent("completely-unknown-patent-id");
    expect(unauthoredEqs).toEqual([]);
  });

  test("renders all variable symbols and inline explanation math via KaTeX without raw LaTeX strings", () => {
    const eq = wrightFlyerInducedDrag;
    const html = renderToString(
      <ColorizedEquation equation={eq} initialActiveVariableId="cl" defaultExpanded={true} />,
    );

    // KaTeX spans should be present
    expect(html).toContain("katex");
    expect(html).toContain("katex-mathml");

    // Raw unparsed dollar signs should NOT be present in the output
    expect(html).not.toContain("($C_L^2$)");
    expect(html).not.toContain("$AR$");
  });

  test("renders mathematical notation in visible equation labels without leaking delimiters", () => {
    const eq = {
      ...wrightFlyerInducedDrag,
      title: "Wing warping and $\\alpha$",
      category: "Circulation $\\Gamma$",
    };
    const html = renderToString(<ColorizedEquation equation={eq} showLiveTelemetry={false} />);

    expect(html).toContain("katex");
    expect(html).not.toContain("$\\alpha$");
    expect(html).not.toContain("$\\Gamma$");
  });

  test("injects interactive equation token targets with data-var attributes for direct formula hover", () => {
    const eq = wrightFlyerInducedDrag;
    const html = renderToString(<ColorizedEquation equation={eq} />);

    // Check that direct equation terms have interactive classes and data-var attributes
    expect(html).toContain('data-var="ar"');
    expect(html).toContain("eq-term-ar");
    expect(html).toContain('data-var="cl"');
    expect(html).toContain("eq-term-cl");
    expect(html).toContain('data-var="c_di"');
    expect(html).toContain("eq-term-c_di");
    expect(html).toContain('data-var="e"');
    expect(html).toContain("eq-term-e");
    expect(html).toContain(
      'aria-label="Interactive governing formula. Use the arrow keys to inspect each term."',
    );
  });
});
