import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { bardeenTransistor2524035Patent } from "@/data/patents/bardeen-transistor-2524035";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";
import { ClaimsDecoder, claimLiveState } from "./ClaimsDecoder";

describe("ClaimsDecoder component", () => {
  test("renders claim tabs, original legal text, and plain-English translation cards for Wright Flyer", () => {
    const html = renderToStaticMarkup(
      <ClaimsDecoder claims={wrightFlyerPatent.claims} patentId={wrightFlyerPatent.id} />,
    );

    expect(html).toContain("Legal Claims Decoder");
    expect(html).toContain("Claim #1");
    expect(html).toContain("Claim #18");
    expect(html).toContain("Independent Master Claim");
    expect(html).toContain("Verbatim Historical Legal Text");
    expect(html).toContain("Plain English Engineering Translation");
    expect(html).toContain("Differential wing warping");
  });

  test("renders dependent claims and parent claim references for Bardeen Transistor", () => {
    const html = renderToStaticMarkup(
      <ClaimsDecoder
        claims={bardeenTransistor2524035Patent.claims}
        patentId={bardeenTransistor2524035Patent.id}
      />,
    );

    expect(html).toContain("Claim #1");
    expect(html).toContain("Claim #40");
    expect(html).toContain("(Dep #1)");
    expect(html).toContain("Key Protected Innovations:");
    expect(html).toContain("Verbatim Historical Legal Text");
  });

  test("renders graceful message when no claims exist and claimStatus is provided", () => {
    const html = renderToStaticMarkup(
      <ClaimsDecoder
        claims={[]}
        claimStatus={{
          kind: "no-formal-claims-in-facsimile",
          evidence: "Historical patent description without formal claims.",
        }}
      />,
    );

    expect(html).toContain("Formal Claims");
    expect(html).toContain(
      "This reviewed historical facsimile contains no separately numbered formal claims.",
    );
    expect(html).toContain("Historical patent description without formal claims.");
  });

  test("does not claim facsimile review when an unverified record has no claim transcription", () => {
    const html = renderToStaticMarkup(<ClaimsDecoder claims={[]} />);

    expect(html).toContain(
      "A verified transcription of this record&#x27;s formal claims is not available yet.",
    );
    expect(html).not.toContain(
      "This reviewed historical facsimile contains no separately numbered",
    );
  });

  test("evaluates Pasteur Claim 1 from the claimed air-expulsion and cooling sequence", () => {
    const patentId = "us-135245-pasteur-fermentation";

    expect(
      claimLiveState(patentId, 1, {
        co2SweepPct: 100,
        sprayCoveragePct: 100,
        wortTempC: 21.25,
      }),
    ).toBe("held");
    expect(
      claimLiveState(patentId, 1, {
        co2SweepPct: 0,
        sprayCoveragePct: 100,
        wortTempC: 21.25,
      }),
    ).toBe("broken");
    expect(
      claimLiveState(patentId, 1, {
        co2SweepPct: 100,
        sprayCoveragePct: 0,
        wortTempC: 21.25,
      }),
    ).toBe("broken");
    expect(
      claimLiveState(patentId, 1, {
        co2SweepPct: 40,
        sprayCoveragePct: 60,
        wortTempC: 21.25,
      }),
    ).toBe("held");
    expect(
      claimLiveState(patentId, 1, {
        co2SweepPct: 100,
        sprayCoveragePct: 100,
        wortTempC: 80,
      }),
    ).toBe("held");
  });
});
