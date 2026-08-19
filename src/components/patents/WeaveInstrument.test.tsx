import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { WeaveInstrument } from "./WeaveInstrument";

describe("WeaveInstrument component", () => {
  test("renders Kitty Hawk residuals, coupled channels, and prior-art controls for Wright Flyer", () => {
    const html = renderToStaticMarkup(<WeaveInstrument patentId="us-821393-wright-flyer" />);

    expect(html).toContain("Kitty Hawk residual · 17 Dec 1903");
    expect(html).toContain("lift − 750 lbf");
    expect(html).toContain("airspeed − 30 mph");
    expect(html).toContain("Prior-art failure · visitor as bank");
    expect(html).toContain("Uncouple rudder (1901 failure)");
  });

  test("renders plume refusal boundary for Goddard Rocket", () => {
    const html = renderToStaticMarkup(<WeaveInstrument patentId="us-1102653-goddard-rocket" />);

    expect(html).toContain("Plume");
  });
});
