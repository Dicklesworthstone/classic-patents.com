import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TwoClocksStrip } from "./TwoClocksStrip";

describe("TwoClocksStrip component", () => {
  test("renders dual timescale comparison cards", () => {
    const html = renderToStaticMarkup(
      <TwoClocksStrip
        title="Magnetron Cavity vs Cavity Thermal Expansion"
        fast={{
          name: "RF Cavity Mode",
          period: "408",
          scale: "ps",
          detail: "2.45 GHz resonant microwave frequency",
        }}
        slow={{
          name: "Thermal Dissipation",
          period: "1.2",
          scale: "s",
          detail: "Convective copper anode heat transfer",
        }}
      />,
    );

    expect(html).toContain("Two clocks · Magnetron Cavity vs Cavity Thermal Expansion");
    expect(html).toContain("RF Cavity Mode");
    expect(html).toContain("408");
    expect(html).toContain("ps");
    expect(html).toContain("Thermal Dissipation");
    expect(html).toContain("1.2");
  });
});
