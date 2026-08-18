import { describe, expect, test } from "bun:test";
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
});
