import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mergenthalerLinotypeClaims } from "./mergenthalerLinotypeEdition";

describe("US 313,224 source-led edition staging", () => {
  test("pins the reviewed 35-page facsimile and preserves every printed claim", () => {
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-313224-mergenthaler-linotype.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      "d85530ab4302e8be7e4c0ac280d438756f1dd21dabc844f2c5b2e76861d7444a",
    );
    expect(mergenthalerLinotypeClaims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 70 }, (_, index) => index + 1),
    );
    expect(mergenthalerLinotypeClaims.every((claim) => claim.isIndependent)).toBe(true);
  });

  test("keeps the source-specific apparatus vocabulary instead of legacy inventions", () => {
    const claims = mergenthalerLinotypeClaims.map((claim) => claim.originalText).join(" ");
    expect(claims).toContain("intaglio");
    expect(claims).toContain("stop-pins");
    expect(claims).toContain("melting-pot");
    expect(claims).toContain("force-pump");
    expect(claims).not.toContain("binary");
    expect(claims).not.toContain("spaceband");
  });
});
