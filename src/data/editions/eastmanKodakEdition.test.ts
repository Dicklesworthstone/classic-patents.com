import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { eastmanKodakPatent } from "@/data/patents/eastman-kodak";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { eastmanKodakArchivalEdition, eastmanKodakParallelReadings } from "./eastmanKodakEdition";

describe("US 388,850 Eastman Camera manual source edition", () => {
  test("pins the reviewed nine-page facsimile and all forty-one printed claims", () => {
    expect(eastmanKodakPatent.archivalEdition).toBe(eastmanKodakArchivalEdition);
    expect(eastmanKodakPatent.filingDate).toBe("1888-03-30");
    expect(validateCuratedSpecificationEdition(eastmanKodakArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${eastmanKodakPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      eastmanKodakArchivalEdition.sourcePdfSha256,
    );
    expect(eastmanKodakPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 41 }, (_, index) => index + 1),
    );
    expect(eastmanKodakPatent.stats).toEqual({ totalClaims: 41, independentClaims: 41 });
  });

  test("binds every canonical claim to the authored legal text", () => {
    const authored = eastmanKodakArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<(typeof eastmanKodakArchivalEdition.blocks)[number], { kind: "claim" }> =>
        block.kind === "claim",
    );
    expect(eastmanKodakPatent.claims.map((claim) => claim.originalText)).toEqual(
      authored.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    expect(
      eastmanKodakPatent.claims.every((claim) => claim.plainEnglish.split(/\s+/).length >= 15),
    ).toBe(true);
  });

  test("gives every printed claim a distinct, source-anchored decoder and innovation set", () => {
    const sourceAndEditorialAnchors = [
      ["tubular case", "tubular case", "front-chamber"],
      ["coincident openings", "coincident openings", "front chamber"],
      ["cap or end piece", "cap", "diaphragm"],
      ["shutter surrounding", "surrounds the lens", "encircling"],
      ["opposite faces", "opposite faces", "opposite-face"],
      ["covering-plates", "covering plates", "covering plates"],
      ["double shutter", "double shutter", "double shutter"],
      ["axis transverse", "transverse", "transverse-axis"],
      ["hollow shutter", "hollow", "hollow"],
      ["complete lens and shutter attachment", "detachable article", "detachable"],
      ["sustained wholly", "wholly", "self-supporting"],
      ["releasing and arresting", "release and arrest", "release-and-arrest"],
      ["stopping and releasing", "stopping and releasing", "stopping"],
      ["inclosing-walls", "chamber walls", "chamber-wall"],
      ["closed at both ends", "closed at both ends", "closed-end"],
      ["one end", "one shutter end", "opposite-end"],
      ["also mounted upon the lens support", "same lens-support", "lens-support-mounted"],
      ["plane of the axis", "plane of the lens axis", "axial-plane"],
      ["ratchet", "ratchet", "ratchet-coupled"],
      ["winding-drum", "winding drum", "winding motor"],
      ["abutments", "abutments", "abutments"],
      ["between the heads", "between the retaining heads", "support-head"],
      ["sustaining-heads", "sustaining heads", "post-journaled"],
      ["tension device", "tension device", "tension-regulated"],
      ["cam-plate", "cam-plate", "cam-plate"],
      ["both as a brake and stop", "brake and stop", "brake spring"],
      ["transverse groove", "transverse groove", "transverse shutter"],
      ["sectional block", "sectional", "sectional"],
      ["flexible connection", "flexible connection", "flexible winding"],
      ["single supporting-frame", "single supporting frame", "single-frame"],
      ["transverse aperture", "transverse lens aperture", "transversely apertured"],
      ["supply-spool", "supply spool", "supply"],
      ["flush with or below", "flush", "flush removable"],
      ["socket", "socket", "socket-and-pin"],
      ["camera-box", "camera-box wall", "camera-wall"],
      ["indicator and winding-key", "indicator and winding key", "indicator and winding-key"],
      ["longitudinal movement", "longitudinal movement", "longitudinal holder"],
      ["front and rear", "front and rear", "front-and-rear"],
      ["light-excluding media", "light-excluding media", "light-excluding media"],
      ["two light-excluding media", "two separately positioned", "separately positioned"],
      ["open at both ends", "open-ended", "open-ended"],
    ] as const;

    expect(sourceAndEditorialAnchors).toHaveLength(eastmanKodakPatent.claims.length);
    const innovationSignatures = eastmanKodakPatent.claims.map((claim) =>
      claim.keyInnovations.join(" | ").toLowerCase(),
    );
    expect(new Set(innovationSignatures).size).toBe(eastmanKodakPatent.claims.length);
    expect(innovationSignatures).not.toContain("lens-support and cylindrical shutter mechanism");
    expect(innovationSignatures).not.toContain("removable roller-holder and film transport");

    for (const [
      index,
      [legalAnchor, decoderAnchor, innovationAnchor],
    ] of sourceAndEditorialAnchors.entries()) {
      const claim = eastmanKodakPatent.claims[index];
      expect(claim.originalText.toLowerCase()).toContain(legalAnchor);
      expect(claim.plainEnglish.toLowerCase()).toContain(decoderAnchor);
      expect(innovationSignatures[index]).toContain(innovationAnchor);
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThanOrEqual(24);
    }
  });

  test("binds every authored figure reference to its complete, digest-pinned source sheet", () => {
    const references = eastmanKodakArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    const expectedSourceSheets = [
      ["Fig. 1", 1],
      ["Fig. 2", 1],
      ["Fig. 3", 1],
      ["Fig. 4", 2],
      ["Fig. 5", 2],
      ["Fig. 6", 2],
      ["Fig. 7", 2],
      ["Fig. 8", 2],
      ["Fig. 9", 3],
      ["Fig. 10", 3],
      ["Fig. 11", 2],
    ] as const;
    const sourceSheetDigests = {
      1: "67b465101abf5be4d2b653ce5e8a7df161e97a85d2166b229541484fbedc19a1",
      2: "2d6f3da0a93b5a4f5248db89f9dc950284ce6f94c836bee38540ae537534edcb",
      3: "b3d072a586e67e41c2fb960e8e92a646289f68122ce76f930df180fc107902d0",
    } as const;

    expect(references).toHaveLength(expectedSourceSheets.length);
    expect(references.map((reference) => reference.text)).toEqual(
      expectedSourceSheets.map(([figure]) => figure),
    );
    for (const [reference, [, sheet]] of references.map(
      (reference, index) => [reference, expectedSourceSheets[index]] as const,
    )) {
      const preview = reference.figurePreviews?.[0];
      const path = `/patents/figures/us-388850-eastman-kodak/source-sheet-${sheet}-v1.png`;
      expect(preview).toMatchObject({
        src: path,
        width: 2560,
        height: 3300,
      });
      const asset = resolve(process.cwd(), "public", path.slice(1));
      expect(existsSync(asset)).toBe(true);
      expect(createHash("sha256").update(readFileSync(asset)).digest("hex")).toBe(
        sourceSheetDigests[sheet],
      );
    }

    for (const number of Array.from({ length: 11 }, (_, index) => index + 1)) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            "public/patents/figures/us-388850-eastman-kodak",
            `fig-${number}-source-crop-v1.png`,
          ),
        ),
      ).toBe(true);
    }
  });

  test("keeps the visitor-facing source face free of generated drawing-sheet placeholders", () => {
    const editionSource = readFileSync(
      resolve(process.cwd(), "src/data/editions/eastmanKodakEdition.ts"),
      "utf8",
    );

    expect(editionSource).not.toContain("Array.from");
    expect(editionSource).not.toContain("Source drawing for Fig.");
    expect(eastmanKodakArchivalEdition.blocks.some((block) => block.kind === "figure-sheet")).toBe(
      false,
    );
  });

  test("covers every authored paragraph with a non-lossy local companion", () => {
    const paragraphIndices = eastmanKodakArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(eastmanKodakParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndices);
    for (const index of paragraphIndices) {
      expect(eastmanKodakParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }
  });

  test("keeps a reviewed ledger separate from the rejected source text layer", () => {
    const asset = eastmanKodakPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-388850-eastman-kodak-reviewed.txt",
      pageCount: 9,
      kind: "reviewed-transcription",
      sourcePdfSha256: eastmanKodakArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Eastman reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 9)).toEqual({ valid: true });
    expect(ledger).toContain("Application filed March 30, 1888. Serial No. 268,964. (No model.)");
    expect(ledger).toContain("41. In a camera such as described");
    expect(JSON.stringify(eastmanKodakArchivalEdition)).not.toContain("SOURCE PDF PAGE");
    expect(JSON.stringify(eastmanKodakPatent)).not.toContain("source-pdf-text-layer");
  });
});
