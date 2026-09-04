import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { farnsworthTvPatent } from "@/data/patents/farnsworth-tv";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { farnsworthTvArchivalEdition, farnsworthTvParallelReadings } from "./farnsworthTvEdition";
import { evaluateReviewedLedgerTextEvidence } from "./reviewedLedgerPublicationEvidence";

describe("US 1,773,980 manual source edition", () => {
  test("pins the inspected 13-page facsimile and its full printed claim sequence", () => {
    expect(validateCuratedSpecificationEdition(farnsworthTvArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${farnsworthTvPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      farnsworthTvArchivalEdition.sourcePdfSha256,
    );
    expect(farnsworthTvPatent.filingDate).toBe("1927-01-07");
    const masthead = farnsworthTvArchivalEdition.blocks.find((block) => block.kind === "masthead");
    expect(masthead?.kind === "masthead" && masthead.lines).toContain("1,773,980.");
    expect(farnsworthTvPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
    expect(farnsworthTvPatent.claims.map((claim) => claim.originalText)).toEqual(
      farnsworthTvArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("keeps every printed figure reference on a patent-local source sheet", () => {
    const refs = farnsworthTvArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      return inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure" ? [inline] : [],
      );
    });
    const sourceSheets: Readonly<Record<number, { page: number; sha256: string }>> = {
      1: {
        page: 1,
        sha256: "eb27560b188bd56be680648d130de208b2504ee1da54dd6498110f97e6e9c400",
      },
      2: {
        page: 2,
        sha256: "792aeed0d8422ae01f2647bddcd685ddbe6f3dee7daf35a83c464681bae5d8c9",
      },
      3: {
        page: 2,
        sha256: "792aeed0d8422ae01f2647bddcd685ddbe6f3dee7daf35a83c464681bae5d8c9",
      },
      4: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      5: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      6: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      7: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      8: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      9: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      10: {
        page: 3,
        sha256: "19ba9574fca6e379d7834a0a39e2768dd4231e9f1f62bcef04fdcfa6f8100b34",
      },
      11: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      12: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      13: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      14: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      15: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      16: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
      17: {
        page: 4,
        sha256: "3be324ceffb5ddc27c6feaa94bd6577aeb2d4939b3986c0871282b83ffc1d04e",
      },
    };

    expect(refs).toHaveLength(32);
    expect(
      refs.map((reference) =>
        (reference.figurePreviews ?? []).map((preview) => {
          const match = /source-sheet-(\d)-v1\.png$/.exec(preview.src);
          if (!match)
            throw new Error(`Figure preview is not a versioned source sheet: ${preview.src}`);
          return Number(match[1]);
        }),
      ),
    ).toEqual([
      [1],
      [2],
      [2],
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
      [3],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4],
      [4, 4, 4],
      [4, 4, 4],
      [4],
      [3, 3],
      [3, 3],
      [2],
    ]);

    for (const reference of refs) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-1773980-farnsworth-tv/");
        const path = resolve(process.cwd(), "public", preview.src.slice(1));
        expect(existsSync(path)).toBe(true);
        const image = readFileSync(path);
        expect(image.subarray(1, 4).toString("ascii")).toBe("PNG");
        expect(image.readUInt32BE(16)).toBe(preview.width);
        expect(image.readUInt32BE(20)).toBe(preview.height);
      }
    }

    for (const source of Object.values(sourceSheets)) {
      const previewPath = `/patents/figures/us-1773980-farnsworth-tv/source-sheet-${source.page}-v1.png`;
      const matchingReferences = refs.filter((reference) =>
        reference.figurePreviews?.some((preview) => preview.src === previewPath),
      );
      expect(matchingReferences.length).toBeGreaterThan(0);
      for (const reference of matchingReferences) {
        const preview = reference.figurePreviews?.find(
          (candidate) => candidate.src === previewPath,
        );
        expect(preview?.width).toBe(2320);
        expect(preview?.height).toBe(3408);
        expect(preview?.alt).toContain("Direct full source drawing sheet");
      }
      const path = resolve(process.cwd(), "public", previewPath.slice(1));
      const png = readFileSync(path);
      expect(createHash("sha256").update(png).digest("hex")).toBe(source.sha256);
    }
  });

  test("covers each authored prose block with a direct companion and has a page-marked ledger", () => {
    const paragraphs = farnsworthTvArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(farnsworthTvParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphs);
    for (const index of paragraphs)
      expect(farnsworthTvParallelReadings[index].join(" ").length).toBeGreaterThan(40);
    const asset = farnsworthTvPatent.originalTextAsset;
    if (!asset) throw new Error("Farnsworth reviewed ledger asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 13)).toEqual({ valid: true });
    expect(evaluateReviewedLedgerTextEvidence(farnsworthTvPatent, ledger)).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 65,
      coveredSectionCount: 65,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });
    for (const block of farnsworthTvArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        expect(ledger).toContain(block.inlines.map((inline) => inline.text).join(""));
      }
    }
  });

  test("provides valid provenance classifications for all Farnsworth controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-1773980-farnsworth-tv"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Farnsworth", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-1773980-farnsworth-tv"]).toBeDefined();
    expect(energyChannelsFor("us-1773980-farnsworth-tv", {})).toEqual([]);
  });

  test("never lets an internal figure-review decision withhold the complete source face", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const { completeArchivalEditionForViewer } = require("./publicationApproval");
    const decision = evaluateTypedArchivalPublicationState(farnsworthTvPatent, {
      hasCompanionReadings: true,
    });
    expect(completeArchivalEditionForViewer(farnsworthTvPatent, decision)).toBe(
      farnsworthTvPatent.archivalEdition,
    );
  });
});
