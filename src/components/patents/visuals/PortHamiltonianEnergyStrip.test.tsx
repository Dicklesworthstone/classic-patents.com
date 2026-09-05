import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PortHamiltonianEnergyStrip } from "./PortHamiltonianEnergyStrip";

describe("Energy strip evidence labels", () => {
  test("Hall names partial bath heating and unknown storage without certifying a total balance", () => {
    const html = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip patentId="us-400766-hall-aluminium" params={{}} />,
    );
    expect(html).toContain('data-energy-input-watts="1329000"');
    expect(html).toContain('data-energy-dissipation-watts="810000"');
    expect(html).toContain("1.33 MW");
    expect(html).toContain("810.0 kW");
    expect(html).toContain("Bath Joule heat:");
    expect(html.match(/Unknown/g)?.length).toBe(1);
    expect(html).toContain("Balance unmeasured");
    expect(html).toContain("Modern teaching cell");
    expect(html).not.toContain("Steady power balanced");
    expect(html).not.toContain("Kinetic:");
    expect(html).not.toContain("0.0 J");
  });
  test("Goodyear displays energy density without relabeling it as total or kinetic energy", () => {
    const html = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip
        patentId="us-3633-goodyear-rubber"
        params={{ vulcanTemp: 145, sulfurPct: 8, appliedTensileStretch: 2 }}
      />,
    );
    expect(html).toContain("Strain energy density:");
    expect(html).toContain("19.31 MJ/m³");
    expect(html.match(/Unknown/g)?.length).toBe(3);
    expect(html).toContain("Balance unmeasured");
    expect(html).not.toContain("Kinetic:");
    expect(html).not.toContain("Steady power balanced");
    expect(html).not.toContain("0.0 W");
    const rest = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip
        patentId="us-3633-goodyear-rubber"
        params={{ appliedTensileStretch: 1 }}
      />,
    );
    expect(rest).toContain("0.0 J/m³");
    expect(rest).toContain("undeformed volume");
  });
  test("Watt displays separate air-pump and shaft power with unknown stored energy", () => {
    const html = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip patentId="gb-913-watt-separate-condenser" params={{}} />,
    );
    expect(html).toContain("Air pump:");
    expect(html).toContain("Output:");
    expect(html).toContain("Stored:");
    expect(html).toContain("Unknown");
    expect(html).toContain("Balance unmeasured");
    expect(html).toContain("Illustrative teaching scenario");
    expect(html).not.toContain("Steady power balanced");
    expect(html).not.toContain("Kinetic:");
    expect(html).not.toContain("0.0 J");
  });
  test("Wright displays changing kinetic energy with an unmeasured balance", () => {
    const slow = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip patentId="us-821393-wright-flyer" params={{ airspeed: 28 }} />,
    );
    const fast = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip patentId="us-821393-wright-flyer" params={{ airspeed: 40 }} />,
    );
    expect(slow).toContain("Kinetic:");
    expect(slow).toContain("Balance unmeasured");
    expect(slow).toContain("Unknown");
    expect(slow).not.toContain("ΔH≈0");
    expect(fast).not.toBe(slow);
  });

  test("Edison labels steady power closure and unknown stored energy", () => {
    const html = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip
        patentId="us-223898-edison-lightbulb"
        params={{ voltage: 110, hotResistanceOhm: 200 }}
      />,
    );
    expect(html).toContain("60.5 W");
    expect(html).toContain("Steady power balanced");
    expect(html).toContain("Unknown");
    expect(html).not.toContain("ΔH≈0");
    expect(html).not.toContain("0.0 J");
  });

  test("unsupported data is not displayed as zero joules or a green balance", () => {
    const html = renderToStaticMarkup(
      <PortHamiltonianEnergyStrip patentId="us-381968-tesla-motor" params={{}} />,
    );
    expect(html).toContain("Energy data unavailable:");
    expect(html).not.toContain("0.0 J");
    expect(html).not.toContain("ΔH≈0");
    expect(html).not.toContain("Steady power balanced");
  });
});
