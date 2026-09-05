import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { stackhouseManipulatorPatent } from "@/data/patents/stackhouse-manipulator-source-bounded";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
} from "./publicationApproval";
import { stackhouseManipulatorArchivalEdition } from "./stackhouseManipulatorEdition";

describe("US 4,068,536 source boundary", () => {
  test("pins the eight-page facsimile without certifying the withdrawn draft", () => {
    const pdfPath = `${process.cwd()}/public/patents/pdfs/us-4068536-stackhouse-manipulator.pdf`;
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBuffer = readFileSync(pdfPath);
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(pdfBuffer);
    const computedDigest = hasher.digest("hex");

    expect(computedDigest).toBe("dcd6652f996f2583bb6bd39f341bac2474b08472adb931972e94137aea1b7846");
    expect(stackhouseManipulatorPatent.originalTextAsset).toBeUndefined();
    expect(stackhouseManipulatorArchivalEdition.sourcePdfSha256).toBe(
      "dcd6652f996f2583bb6bd39f341bac2474b08472adb931972e94137aea1b7846",
    );
    expect(stackhouseManipulatorArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(isArchivalEditionExplicitlyWithheld(stackhouseManipulatorPatent.id)).toBe(true);
    expect(archivalEditionForPublication(stackhouseManipulatorPatent)).toBeUndefined();
  });

  test("preserves direct, full-sheet drawing evidence without promoting the withdrawn draft", () => {
    const figureRoot = `${process.cwd()}/public/patents/figures/us-4068536-stackhouse-manipulator`;
    const sourceSheets = [
      {
        file: "sheet-1-source-crop-v2.png",
        digest: "024e21e4cb3434111466a5bfe129012eef80b17b79277eb8becb33bb244946bd",
      },
      {
        file: "sheet-2-source-crop-v2.png",
        digest: "b55771dd6a708c55937e09db3de6bba82f8225349ff12d091d7e48d687190844",
      },
    ] as const;

    for (const sourceSheet of sourceSheets) {
      const sheetPath = `${figureRoot}/${sourceSheet.file}`;
      expect(existsSync(sheetPath)).toBe(true);
      const bytes = readFileSync(sheetPath);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(bytes.readUInt32BE(16)).toBe(2320);
      expect(bytes.readUInt32BE(20)).toBe(3408);
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(bytes);
      expect(hasher.digest("hex")).toBe(sourceSheet.digest);
    }

    expect(stackhouseManipulatorPatent.drawings).toEqual([]);
    expect(archivalEditionForPublication(stackhouseManipulatorPatent)).toBeUndefined();
  });

  test("publishes no claim decoder, drawing annotation, or reviewed-ledger assertion", () => {
    expect(stackhouseManipulatorPatent.claims).toEqual([]);
    expect(stackhouseManipulatorPatent.drawings).toEqual([]);
    expect(stackhouseManipulatorPatent.stats).toEqual({ totalClaims: 0, independentClaims: 0 });
  });

  test("keeps the public excerpt on literal facsimile text", () => {
    expect(stackhouseManipulatorPatent.originalText).toContain(
      "This invention relates to mechanical manipulators",
    );
    expect(stackhouseManipulatorPatent.originalText).toContain(
      "spot welding, spray painting, and assembly operations",
    );
    expect(stackhouseManipulatorPatent.originalText).not.toContain("2π");
    expect(stackhouseManipulatorPatent.originalText).not.toContain("singularity");
  });

  test("states the source's actual geometric boundary without invented performance", () => {
    const publicText = JSON.stringify(stackhouseManipulatorPatent);
    expect(publicText).toContain("greater than 45 degrees");
    expect(publicText).toContain("small orientation ‘holes.’");
    expect(publicText).not.toContain("exactly 45");
    expect(publicText).not.toContain("2π steradian");
    expect(publicText).not.toContain("provides singularity-free");
    expect(publicText).not.toContain("payload capacity");
  });
});
