import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { EnergyFlowStrip } from "./EnergyFlowStrip";

describe("EnergyFlowStrip component", () => {
  test("renders conservative energy partitions with colored bar channels", () => {
    const html = renderToStaticMarkup(
      <EnergyFlowStrip
        title="Wright Flyer Propulsive Power Budget"
        channels={[
          { name: "Engine Power", watts: 8950, tone: "in" },
          { name: "Thrust Power", watts: 5907, tone: "useful" },
          { name: "Slipstream Loss", watts: 3043, tone: "loss" },
        ]}
      />,
    );

    expect(html).toContain("Energy · Wright Flyer Propulsive Power Budget");
    expect(html).toContain("Engine Power");
    expect(html).toContain("8,950 W");
    expect(html).toContain("Thrust Power");
    expect(html).toContain("5,907 W");
    expect(html).toContain("Slipstream Loss");
    expect(html).toContain("3,043 W");
  });
});
