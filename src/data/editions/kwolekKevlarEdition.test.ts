import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { kwolekKevlarPatent } from "@/data/patents/kwolek-kevlar";
import { kwolekKevlarClaims, kwolekKevlarSourceAuthoringWip } from "./kwolekKevlarEdition";

describe("US 3,671,542 Stephanie Kwolek source-authoring boundary", () => {
  test("pins the 58-page facsimile without claiming an unfinished source edition is public", () => {
    expect(kwolekKevlarPatent.archivalEdition).toBeUndefined();
    expect(kwolekKevlarPatent.originalTextAsset).toBeUndefined();
    expect(kwolekKevlarPatent.filingDate).toBe("1969-05-23");
    expect(kwolekKevlarSourceAuthoringWip.sourcePdfSha256).toBe(
      "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
    );
    const pdf = readFileSync(`${process.cwd()}/public${kwolekKevlarPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      kwolekKevlarSourceAuthoringWip.sourcePdfSha256,
    );
    expect(kwolekKevlarSourceAuthoringWip.pageCount).toBe(58);
    expect(kwolekKevlarSourceAuthoringWip.manuallyCheckedPages).toBe(10);
    expect(kwolekKevlarSourceAuthoringWip.remainingWork).toContain("PDF pages 11–58");
  });

  test("keeps the two checked printed claims, without pretending to publish the specification", () => {
    expect(kwolekKevlarPatent.claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(kwolekKevlarClaims).toHaveLength(2);
    expect(kwolekKevlarPatent.claims[0]?.originalText).toBe(kwolekKevlarClaims[0].text);
    expect(kwolekKevlarPatent.claims[1]?.originalText).toBe(kwolekKevlarClaims[1].text);
    expect(kwolekKevlarPatent.stats).toMatchObject({
      totalClaims: 2,
      independentClaims: 1,
    });
    expect(kwolekKevlarPatent.originalText).toContain("The full 58-page historical instrument");
  });

  test("retains source-derived figure sheets and a ledger that labels its incomplete status", () => {
    for (let figure = 1; figure <= 9; figure += 1) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            `public/patents/figures/us-3671542-kwolek-kevlar/fig-${figure}-source-preview.png`,
          ),
        ),
      ).toBe(true);
    }
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-3671542-kwolek-kevlar-reviewed.txt`,
      "utf8",
    );
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 58 OF 58 ---");
    expect(ledger).toContain("What is claimed is:");
    expect(ledger).toContain("1. Optically anisotropic dope consisting essentially of:");
    expect(ledger).toContain("2. Dope of claim 1 wherein said liquid medium is concentrated");
  });
});
