import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { parsePatentCatalog } from "@/data/patents/schema";
import { otisElevatorPatent } from "../patents/otis-elevator";
import { otisElevatorArchivalEdition } from "./otisElevatorEdition";
import { otisElevatorParallelReadings } from "./otisElevatorParallelReading";

describe("otisElevatorArchivalEdition", () => {
  test("pins the reviewed facsimile and presents all four printed claims", () => {
    expect(validateCuratedSpecificationEdition(otisElevatorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(otisElevatorArchivalEdition.sourcePdfSha256).toBe(
      "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
    );
    expect(
      otisElevatorArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.number),
    ).toEqual([1, 2, 3, 4]);
  });

  test("gives every descriptive paragraph a substantial authored companion and every figure a local crop", () => {
    for (const [index, block] of otisElevatorArchivalEdition.blocks.entries()) {
      if (block.kind === "paragraph" && otisElevatorParallelReadings[index]) {
        expect(otisElevatorParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(20);
      }
      if (block.kind !== "paragraph") continue;
      for (const inline of block.inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews?.[0]?.src).toStartWith(
          "/patents/figures/us-31128-otis-elevator/",
        );
      }
    }
  });

  test("uses the tightly framed, upright source crop for the detached Fig. 3 stop mechanism", () => {
    const fig3 = otisElevatorArchivalEdition.blocks
      .flatMap((block) =>
        block.kind === "paragraph"
          ? block.inlines.filter(
              (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
      )
      .find((inline) => inline.text === "Fig. 3");

    expect(fig3).toBeDefined();
    if (fig3?.kind !== "reference") {
      throw new Error("Otis Fig. 3 must remain an authored source-figure reference.");
    }

    expect(fig3.figurePreviews).toEqual([
      expect.objectContaining({
        src: "/patents/figures/us-31128-otis-elevator/figure-3-oriented-cw-v3.png",
        width: 160,
        height: 1300,
      }),
    ]);
  });

  test("keeps the catalogue record in parity with the four-claim source edition", () => {
    expect(otisElevatorPatent.archivalEdition).toBe(otisElevatorArchivalEdition);
    expect(otisElevatorPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(otisElevatorPatent.stats).toMatchObject({ totalClaims: 4, independentClaims: 4 });
    expect(otisElevatorPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 3,
      sourcePdfSha256: otisElevatorArchivalEdition.sourcePdfSha256,
    });
  });

  test("passes the catalogue schema with its reviewed transcript metadata", () => {
    expect(parsePatentCatalog([otisElevatorPatent])).toHaveLength(1);
  });
});
