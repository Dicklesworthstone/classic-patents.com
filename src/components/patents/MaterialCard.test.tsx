import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MaterialCard } from "./MaterialCard";

describe("MaterialCard component", () => {
  test("renders material name, formula, role, and property metric pairs", () => {
    const html = renderToStaticMarkup(
      // biome-ignore lint/a11y/useValidAriaRole: role is a custom component prop describing material role
      <MaterialCard
        name="Kevlar Aramid (PPD-T)"
        formula="[-NH-C6H4-NH-CO-C6H4-CO-]n"
        role="Liquid-crystalline polymer backbone with extended para-oriented aromatic rings."
        numbers={[
          { label: "Tensile Strength", value: "3.6 GPa" },
          { label: "Density", value: "1.44 g/cm³" },
        ]}
      />,
    );

    expect(html).toContain("Kevlar Aramid (PPD-T)");
    expect(html).toContain("[-NH-C6H4-NH-CO-C6H4-CO-]n");
    expect(html).toContain("Liquid-crystalline polymer backbone");
    expect(html).toContain("Tensile Strength");
    expect(html).toContain("3.6 GPa");
    expect(html).toContain("Density");
    expect(html).toContain("1.44 g/cm³");
  });
});
