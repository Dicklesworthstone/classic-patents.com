import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { HistoricalContextPanel } from "./HistoricalContextPanel";

describe("HistoricalContextPanel component", () => {
  test("renders bottleneck, prior art limitations, breakthrough insight, and patent wars", () => {
    const html = renderToStaticMarkup(
      <HistoricalContextPanel context={wrightFlyerPatent.historicalContext} />,
    );

    expect(html).toContain("The Historical Bottleneck");
    expect(html).toContain("Why Prior Art Failed");
    expect(html).toContain("The Breakthrough Insight");
    expect(html).toContain("Patent Wars &amp; Legal Litigations");
    expect(html).toContain("Civilizational Impact");
    expect(html).toContain("Glenn H. Curtiss");
  });
});
