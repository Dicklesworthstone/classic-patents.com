import { describe, expect, test } from "bun:test";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { mccormickReaperPatent } from "./mccormick-reaper";
import { parsePatentCatalog } from "./schema";

describe("mccormickReaperPatent", () => {
  test("accepts the pinned manual edition and the two unnumbered source claims", () => {
    expect(parsePatentCatalog([mccormickReaperPatent])).toEqual([mccormickReaperPatent]);
    expect(mccormickReaperPatent.claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(mccormickReaperPatent.stats).toMatchObject({
      totalClaims: 2,
      independentClaims: 2,
    });
  });

  test("derives presentation motion only from dimensions printed in the specification", () => {
    const estimate = stepMcCormickReaper({ forwardSpeedMph: 2.5 });

    expect(estimate).toMatchObject({
      groundWheelRpm: 35,
      cutterCrankRpm: 350.1,
      reelRpm: 37.9,
      groundSpeedMps: 1.12,
      cutterHz: 5.83,
    });
    expect(Object.keys(estimate)).not.toContain("harvestAcresPerDay");
    expect(Object.keys(estimate)).not.toContain("cutFrequencyHz");
  });
});
