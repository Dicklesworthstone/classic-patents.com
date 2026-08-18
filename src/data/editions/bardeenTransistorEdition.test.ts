import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { bardeenTransistor2524035Patent } from "@/data/patents/bardeen-transistor-2524035";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";
import {
  bardeenTransistorArchivalEdition,
  bardeenTransistorParallelReadings,
} from "./bardeenTransistorEdition";

type FigureReference = Extract<CuratedSpecificationInline, { kind: "reference" }>;

describe("US 2,524,035 manual source edition", () => {
  test("pins the correct fourteen-page Bardeen and Brattain facsimile and all printed claims", () => {
    expect(bardeenTransistor2524035Patent.patentNumber).toBe("US 2,524,035");
    expect(bardeenTransistor2524035Patent.grantDate).toBe("1950-10-03");
    expect(bardeenTransistor2524035Patent.filingDate).toBe("1948-06-17");
    expect(validateCuratedSpecificationEdition(bardeenTransistorArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public${bardeenTransistor2524035Patent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      bardeenTransistorArchivalEdition.sourcePdfSha256,
    );
    expect(bardeenTransistor2524035Patent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 40 }, (_, index) => index + 1),
    );
    expect(bardeenTransistor2524035Patent.stats).toMatchObject({
      totalClaims: 40,
      independentClaims: 18,
    });
  });

  test("keeps catalogue claims sourced solely from the manual edition and gives each one a substantial decoder", () => {
    const sourceClaims = bardeenTransistorArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof bardeenTransistorArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(bardeenTransistor2524035Patent.claims.map((claim) => claim.originalText)).toEqual(
      sourceClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of bardeenTransistor2524035Patent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(24);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("maps every printed figure to its own locally derived source crop", () => {
    const figureReferences = (inlines: readonly CuratedSpecificationInline[]) =>
      inlines.filter(
        (inline): inline is FigureReference =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    const references = bardeenTransistorArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") return figureReferences(block.description);
      if ("inlines" in block) return figureReferences(block.inlines);
      return [];
    });
    const sources = new Set<string>();
    for (const reference of references)
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
        sources.add(preview.src);
      }
    expect([...sources].sort()).toEqual([
      "/patents/figures/us-2524035-bardeen-transistor/fig-1-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-10-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-11-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-12-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-13-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-14-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-15-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-16-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-1a-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-2-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-3-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-3a-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-4-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-5-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-6-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-7-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-8-source-crop-v1.png",
      "/patents/figures/us-2524035-bardeen-transistor/fig-9-source-crop-v1.png",
    ]);
  });

  test("has a page-marked reviewed ledger and non-lossy paragraph companions", () => {
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 14)).toEqual({ valid: true });
    const paragraphs = bardeenTransistorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(bardeenTransistorParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphs);
    for (const index of paragraphs)
      expect(bardeenTransistorParallelReadings[index]?.join(" ").length).toBeGreaterThan(40);
  });

  test("keeps every manually completed page-four prose block in the reviewed ledger", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replace(/[–—]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = normalize(
      readFileSync(
        resolve(
          process.cwd(),
          "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
        ),
        "utf8",
      ),
    );
    const sourceBlocks = bardeenTransistorArchivalEdition.blocks
      .slice(4, 11)
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      );
    for (const block of sourceBlocks)
      expect(ledger).toContain(normalize(block.inlines.map((inline) => inline.text).join("")));
  });

  test("keeps every literal page-five source block in its page-marked ledger section", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replace(/(\p{L})-\s+(\p{L})/gu, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageFive = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 5 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 6 OF 14 ---")[0];
    expect(pageFive).toBeDefined();

    const editionText = bardeenTransistorArchivalEdition.blocks
      .map((block) => {
        if ("inlines" in block) return block.inlines.map((inline) => inline.text).join("");
        return block.kind === "equation" ? block.text : "";
      })
      .join("\n");
    const literalPageFive = [
      "It is a feature of the invention that the input and output impedances of the device are controlled by choice and treatment of the semiconductor material body and of its surface, as well as by choice of the bias potentials of the electrodes.",
      'From the standpoint of its external behavior and uses, the device of the invention resembles a vacuum tube triode; and while the electrodes are designated emitter, collector and base electrode, respectively, they may be externally interconnected in the various ways which have become recognized as appropriate for triodes, such as the conventional, the "grounded grid," the "grounded plate" or cathode follower, and the like. Indeed, the discovery on which the invention is based, was first made with circuit connections which are extremely similar to the so-called "grounded grid" vacuum tube connections. However, the analogies among the circuits is, of course, no better than the analogy between emitter and cathode, base electrode and grid, collector and anode.',
      "By feeding back a portion of the output voltage in proper phase to the input terminals, the device may be caused to oscillate at a frequency determined by its external circuit elements, and, among other tests, power amplification was confirmed by a feedback connection which caused it to oscillate.",
      "It has been found that the performance of the device is expressed, to a good approximation, by the following functional relations:",
      "Ie = f(Ve + RfIc). (1)",
      "Ic = Ic⁰(Vc) + aIe. (1a)",
      "where Ie = emitter current; Ic = collector current; Ic⁰(Vc) = collector current with emitter disconnected; Ve = voltage of emitter electrode measured with respect to the base electrode; Vc = voltage of collector electrode measured with respect to the base electrode; Rf = an equivalent resistance independent of bias; a = a numerical factor which depends on the bias voltages; f(Ve) gives the relation between emitter current and emitter voltage with the collector circuit open.",
      "The interpretation of the foregoing Equation 1 is that the collector current lowers the potential of the surface of the block in the vicinity of the emitter relative to the base electrode by an amount RfIc, and thus increases the effective bias voltage on the emitter by the same amount. The term RfIc thus represents positive feedback.",
      "The invention will be fully apprehended from the following detailed description of one embodiment thereof, taken in connection with the appended drawings, in which:",
      'Fig. 1 is a schematic diagram, partly in perspective, showing a preferred embodiment of the invention; Fig. 1a is a cross-section of a part of Fig. 1 to a greatly enlarged scale; Fig. 2 is the equivalent vacuum tube schematic circuit of Fig. 1; Fig. 3 is a plan view of the block of Fig. 1, showing the disposition of the electrodes; Fig. 3a is like Fig. 3 but shows the influence of the collector in modifying the emitter current; Figs. 4, 5, 6 and 7 show electrode dispositions alternative to those of Fig. 1; Figs. 8 and 9 show electrode structures alternative to those of Fig. 1; Fig. 10 shows a modified unit of the invention connected for operation in the circuit of a conventional triode; Fig. 11 shows another modified unit of the invention connected for operation in a "grounded plate" or cathode follower circuit; Fig. 12 shows the unit of the invention connected for self-sustained oscillation;',
    ];
    for (const sourceText of literalPageFive) {
      expect(normalize(editionText)).toContain(normalize(sourceText));
      expect(normalize(pageFive ?? "")).toContain(normalize(sourceText));
    }
  });

  test("keeps every manually completed page-six source block in its page-marked ledger section", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replace(/(\p{L})-\s+(\p{L})/gu, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageSix = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 6 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 7 OF 14 ---")[0];
    expect(pageSix).toBeDefined();

    const pageSixBlocks = bardeenTransistorArchivalEdition.blocks
      .slice(24, 31)
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      );
    expect(pageSixBlocks).toHaveLength(7);
    for (const block of pageSixBlocks) {
      expect(normalize(pageSix ?? "")).toContain(
        normalize(block.inlines.map((inline) => inline.text).join("")),
      );
    }
  });

  test("keeps every manually completed page-seven source block in its page-marked ledger section", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replace(/(\p{L})-\s+(\p{L})/gu, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageSeven = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 7 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---")[0];
    expect(pageSeven).toBeDefined();

    const pageSevenBlocks = bardeenTransistorArchivalEdition.blocks
      .slice(31, 39)
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      );
    expect(pageSevenBlocks).toHaveLength(8);
    for (const block of pageSevenBlocks) {
      expect(normalize(pageSeven ?? "")).toContain(
        normalize(block.inlines.map((inline) => inline.text).join("")),
      );
    }
  });

  test("keeps the Fig. 1 apparatus paragraph continuous across the page-seven and page-eight ledger boundary", () => {
    const normalize = (value: string) =>
      value.replaceAll("“", '"').replaceAll("”", '"').replace(/\s+/g, " ").trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageSeven = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 7 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---")[0];
    const pageEight = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---")[0];
    const figureOneApparatus = bardeenTransistorArchivalEdition.blocks[39];
    expect(figureOneApparatus.kind).toBe("paragraph");
    if (figureOneApparatus.kind !== "paragraph")
      throw new Error("Missing continuous Fig. 1 apparatus paragraph.");
    expect(normalize(`${pageSeven ?? ""} ${pageEight ?? ""}`)).toContain(
      normalize(figureOneApparatus.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("keeps every manually completed page-eight source block in its page-marked ledger section", () => {
    const normalize = (value: string) =>
      value.replaceAll("“", '"').replaceAll("”", '"').replace(/\s+/g, " ").trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageEight = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---")[0];
    expect(pageEight).toBeDefined();
    const pageEightBlocks = bardeenTransistorArchivalEdition.blocks
      .slice(40, 45)
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      );
    expect(pageEightBlocks).toHaveLength(5);
    for (const block of pageEightBlocks) {
      expect(normalize(pageEight ?? "")).toContain(
        normalize(block.inlines.map((inline) => inline.text).join("")),
      );
    }
  });

  test("keeps the printed page-eight operating data table cell-for-cell in the reviewed ledger", () => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageEight = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---")[0];
    const table = bardeenTransistorArchivalEdition.blocks.find(
      (
        block,
      ): block is Extract<
        (typeof bardeenTransistorArchivalEdition.blocks)[number],
        { kind: "table" }
      > => block.kind === "table",
    );
    expect(table).toBeDefined();
    if (!table) throw new Error("Missing printed operating-data table.");
    for (const row of [table.headers, ...table.rows]) {
      expect(normalize(pageEight ?? "")).toContain(
        normalize(row.map((cell) => cell.map((inline) => inline.text).join("")).join(" ")),
      );
    }
  });

  test("keeps the p.8/p.9 layer hypothesis and every completed p.9 prose block in the ledger", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replaceAll(/(\w+)-\s+(\w+)/g, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageEight = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 8 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---")[0];
    const pageNine = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 10 OF 14 ---")[0];
    const paragraphText = (index: number) => {
      const block = bardeenTransistorArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph")
        throw new Error(`Missing expected p.9 paragraph at block ${index}.`);
      return block.inlines.map((inline) => inline.text).join("");
    };
    expect(normalize(`${pageEight ?? ""} ${pageNine ?? ""}`)).toContain(
      normalize(paragraphText(48)),
    );
    for (let index = 49; index <= 57; index += 1)
      expect(normalize(pageNine ?? "")).toContain(normalize(paragraphText(index)));
  });

  test("keeps the p.9/p.10 apparatus boundary and p.10 potential analysis in the ledger", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replaceAll(/(\w+)-\s+(\w+)/g, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageNine = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 9 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 10 OF 14 ---")[0];
    const pageTen = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 10 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 11 OF 14 ---")[0];
    const paragraphText = (index: number) => {
      const block = bardeenTransistorArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph")
        throw new Error(`Missing expected p.10 paragraph at block ${index}.`);
      return block.inlines.map((inline) => inline.text).join("");
    };
    expect(normalize(`${pageNine ?? ""} ${pageTen ?? ""}`)).toContain(normalize(paragraphText(58)));
    for (const index of [59, 61, 62, 63])
      expect(normalize(pageTen ?? "")).toContain(normalize(paragraphText(index)));
  });

  test("keeps the p.10/p.11 potential-curve boundary and all completed p.11 prose in the ledger", () => {
    const normalize = (value: string) =>
      value
        .replaceAll("“", '"')
        .replaceAll("”", '"')
        .replaceAll(/(\w+)-\s+(\w+)/g, "$1$2")
        .replace(/\s+/g, " ")
        .trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageTen = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 10 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 11 OF 14 ---")[0];
    const pageEleven = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 11 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 12 OF 14 ---")[0];
    const paragraphText = (index: number) => {
      const block = bardeenTransistorArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph")
        throw new Error(`Missing expected p.11 paragraph at block ${index}.`);
      return block.inlines.map((inline) => inline.text).join("");
    };
    expect(normalize(`${pageTen ?? ""} ${pageEleven ?? ""}`)).toContain(
      normalize(paragraphText(64)),
    );
    for (const index of [65, 66, 67, 68, 69, 71, 72, 75, 77, 79, 80, 81, 82, 83, 84, 85])
      expect(normalize(pageEleven ?? "")).toContain(normalize(paragraphText(index)));
  });

  test("authors every page-five and continued figure citation as a distinct source node", () => {
    const figureGuide = bardeenTransistorArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      )
      .filter((block) =>
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .startsWith("Fig. 1 is a schematic diagram"),
      );
    expect(figureGuide).toHaveLength(1);
    const figureLabels = figureGuide[0].inlines
      .filter((inline) => inline.kind === "reference" && inline.referenceType === "figure")
      .map((inline) => inline.text);
    expect(figureLabels).toEqual([
      "Fig. 1",
      "Fig. 1a",
      "Fig. 2",
      "Fig. 3",
      "Fig. 3a",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Fig. 10",
      "Fig. 11",
      "Fig. 12",
    ]);

    const continuedGuide = bardeenTransistorArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      )
      .filter((block) =>
        block.inlines
          .map((inline) => inline.text)
          .join("")
          .startsWith("Fig. 13 is a diagram"),
      );
    expect(continuedGuide).toHaveLength(1);
    expect(
      continuedGuide[0].inlines
        .filter((inline) => inline.kind === "reference" && inline.referenceType === "figure")
        .map((inline) => inline.text),
    ).toEqual(["Fig. 13", "Fig. 14", "Fig. 15", "Fig. 16"]);
  });
});
