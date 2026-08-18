import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lincolnBuoyPatent } from "@/data/patents/lincoln-buoy";
import { lincolnBuoyArchivalEdition, lincolnBuoyParallelReadings } from "./lincolnBuoyEdition";

describe("lincolnBuoyArchivalEdition", () => {
  test("pins the corrected three-page Lincoln facsimile with explicit authored nodes", () => {
    expect(validateCuratedSpecificationEdition(lincolnBuoyArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(lincolnBuoyArchivalEdition.sourcePdfSha256).toBe(
      "0663103c4dc8e15ae66d7829ace7916bd4025bd1751afb8710fca8d3fdbf53be",
    );
    expect(lincolnBuoyArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("retains the sole source-exact claim and no invented second claim", () => {
    const claims = lincolnBuoyArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1]);
    expect(lincolnBuoyPatent.claims.map((claim) => claim.number)).toEqual([1]);
    const sourceClaim = claims[0]?.inlines.map((inline) => inline.text).join("");
    expect(sourceClaim).toContain("series of ropes and pullies");
    expect(lincolnBuoyPatent.claims[0]?.originalText).toBe(sourceClaim);
    expect(
      readFileSync(
        resolve(process.cwd(), "public/patents/transcripts/us-6469-lincoln-buoy.txt"),
        "utf8",
      ),
    ).toContain(sourceClaim);
  });

  test("uses only the corrected identity and local source asset", () => {
    expect(lincolnBuoyPatent.id).toBe("us-6469-lincoln-buoy");
    expect(lincolnBuoyPatent.originalPdfUrl).toBe("/patents/pdfs/us-6469-lincoln-buoy.pdf");
    expect(lincolnBuoyPatent.originalTextAsset?.url).toBe(
      "/patents/transcripts/us-6469-lincoln-buoy.txt",
    );
    expect(existsSync(resolve(process.cwd(), "public/patents/pdfs/us-6469-lincoln-buoy.pdf"))).toBe(
      true,
    );
    expect(
      readFileSync(
        resolve(process.cwd(), "public/patents/transcripts/us-6469-lincoln-buoy.txt"),
        "utf8",
      ),
    ).toContain("A. LINCOLN.");
  });

  test("binds every source figure citation to a local source-derived hover preview", () => {
    const references = lincolnBuoyArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );

    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) {
      expect(reference.figurePreviews).toHaveLength(1);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-6469-lincoln-buoy-");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.replace(/^\//, "")))).toBe(
          true,
        );
      }
    }
  });

  test("gives every authored prose paragraph a non-lossy local companion", () => {
    for (const [index, block] of lincolnBuoyArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(lincolnBuoyParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });
});
