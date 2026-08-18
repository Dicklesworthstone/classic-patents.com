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
  test("renders Wright Flyer colorized equation without errors", () => {
    const eq = ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"][0];
    expect(eq).toBeDefined();

    const html = renderToString(<ColorizedEquation equation={eq} />);
    expect(html).toContain("Prandtl Induced Drag");
    expect(html).toContain("Aerodynamics");
    expect(html).toContain("Plain English Decoder");
    expect(html).toContain("Induced Drag Coefficient");
  });

  test("renders Tesla Motor colorized equation with terms and drawer", () => {
    const eq = ALL_COLORIZED_EQUATIONS["us-381968-tesla-motor"][0];
    expect(eq).toBeDefined();

    const html = renderToString(<ColorizedEquation equation={eq} />);
    expect(html).toContain("Rotating Stator Magnetic Flux Vector");
    expect(html).toContain("Mathematical Governing Law");
  });

  test("color palette helper produces correct KaTeX color tags", () => {
    const wrapped = wrapKatexColor("C_L^2", "emerald", false);
    expect(wrapped).toBe(`\\textcolor{${COLOR_STYLES.emerald.hexLight}}{C_L^2}`);

    const wrappedDark = wrapKatexColor("C_L^2", "emerald", true);
    expect(wrappedDark).toBe(`\\textcolor{${COLOR_STYLES.emerald.hexDark}}{C_L^2}`);
  });

  test("renders collapsed view and custom initial active variable", () => {
    const eq = ALL_COLORIZED_EQUATIONS["us-821393-wright-flyer"][0];
    const html = renderToString(
      <ColorizedEquation equation={eq} initialActiveVariableId="cl" defaultExpanded={false} />,
    );
    expect(html).toContain("Lift Coefficient (Squared)");
    expect(html).toContain('aria-expanded="false"');
  });

  test("renders universal fallback equations for any catalog patent", () => {
    const { getColorizedEquationsForPatent } = require("@/data/colorizedEquations");
    const cottonGinEqs = getColorizedEquationsForPatent("us-x72-whitney-cotton-gin");
    expect(cottonGinEqs.length).toBeGreaterThan(0);

    const html = renderToString(<ColorizedEquation equation={cottonGinEqs[0]} />);
    expect(html).toContain("Mathematical Governing Law");
    expect(html).toContain("Plain English Decoder");
  });
});
