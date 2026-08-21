import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { bardeenTransistorPatent } from "@/data/patents/bardeen-transistor";
import { bardeenTransistor2524035Patent } from "@/data/patents/bardeen-transistor-2524035";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationInline } from "@/types/patent";
import {
  bardeenTransistorArchivalEdition,
  bardeenTransistorParallelReadings,
} from "./bardeenTransistorEdition";

type FigureReference = Extract<CuratedSpecificationInline, { kind: "reference" }>;

describe("US 2,524,035 manual source edition", () => {
  test("keeps the former module path as a compatibility alias to the canonical grant", () => {
    expect(bardeenTransistorPatent).toBe(bardeenTransistor2524035Patent);
    expect(bardeenTransistorPatent.id).toBe("us-2524035-bardeen-transistor");
    expect(bardeenTransistorPatent.patentNumber).toBe("US 2,524,035");
  });

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

  test("uses forty explicit claim records with claim-specific innovations and the printed Rf relation", () => {
    const recordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/bardeen-transistor-2524035.ts"),
      "utf8",
    );
    expect(recordSource).not.toContain("Array.from({ length: 40 }");
    expect(recordSource).not.toContain("const claimText =");
    expect(recordSource).not.toContain("const MANUALLY_REVIEWED_CLAIM_TEXT");
    expect(recordSource).toContain("function manualClaimText");
    expect(recordSource).toContain("bardeenTransistorArchivalEdition.blocks.find");
    expect(recordSource).not.toContain("Semiconductor carrier control");
    expect(recordSource).not.toContain(`Claim \${number} limitation`);
    for (const claim of bardeenTransistor2524035Patent.claims) {
      expect(recordSource).toContain(`originalText: manualClaimText(${claim.number}),`);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
      expect(claim.keyInnovations).not.toContain(`Claim ${claim.number} limitation`);
    }
    const carrierPrinciple =
      bardeenTransistor2524035Patent.plainEnglishExplanation.scientificPrinciples.find(
        ({ principle }) => principle === "Carrier injection and collection",
      );
    expect(carrierPrinciple?.formula).toBe("I_E = f(V_E + R_f I_C); I_C = I_C^0(V_C) + a I_E");
    expect(carrierPrinciple?.formula).not.toContain("R_s");
  });

  test("keeps all forty printed claim blocks in the reviewed ledger", () => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    const ledger = normalize(
      readFileSync(
        resolve(
          process.cwd(),
          "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
        ),
        "utf8",
      ),
    );
    const claims = bardeenTransistorArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof bardeenTransistorArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(claims).toHaveLength(40);
    for (const claim of claims)
      expect(ledger).toContain(
        normalize(`${claim.number}. ${claim.inlines.map((inline) => inline.text).join("")}`),
      );
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
      "/patents/figures/us-2524035-bardeen-transistor/fig-12-source-crop-v2.png",
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
      .slice(4, 14)
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

  test("keeps the printed grant masthead and each omitted page-four opening paragraph literal", () => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageFour = ledger
      .split("--- REVIEWED TRANSCRIPTION PAGE 4 OF 14 ---\n")[1]
      ?.split("--- REVIEWED TRANSCRIPTION PAGE 5 OF 14 ---")[0];
    const masthead = bardeenTransistorArchivalEdition.blocks.find(
      (
        block,
      ): block is Extract<
        (typeof bardeenTransistorArchivalEdition.blocks)[number],
        { kind: "masthead" }
      > => block.kind === "masthead",
    );
    expect(masthead?.lines).toEqual(
      expect.arrayContaining(["Patented Oct. 3, 1950", "2,524,035", "UNITED STATES PATENT OFFICE"]),
    );

    const opening = [
      "This invention relates to a novel method of and means for translating electrical variations for such purposes as amplification, wave generation, and the like.",
      "The principal object of the invention is to amplify or otherwise translate electric signals or variations by use of compact, simple, and rugged apparatus of novel type.",
      "Another object is to provide a circuit element for use as an amplifier or the like which does not require a heated thermionic cathode for its operation, and which therefore is immediately operative when turned on. A related object is to provide such a circuit element which requires no evacuated or gas-filled envelope.",
    ];
    const paragraphText = bardeenTransistorArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      )
      .map((block) => block.inlines.map((inline) => inline.text).join(""));
    for (const sourceText of opening) {
      expect(paragraphText).toContain(sourceText);
      expect(normalize(pageFour ?? "")).toContain(normalize(sourceText));
    }
  });

  test("authors specialized source terms at their printed occurrences", () => {
    const terms = bardeenTransistorArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<CuratedSpecificationInline, { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    const expectedTerms = [
      "high resistance rectifying barrier",
      "space charge",
      "inversion region",
      "high resistance barrier",
      '"physical layer"',
      '"physical barrier"',
      '"chemical layer"',
      '"chemical barrier"',
      '"back voltage,"',
    ];
    for (const value of expectedTerms) {
      const occurrence = terms.find((term) => term.text === value);
      expect(occurrence).toBeDefined();
      expect(occurrence?.definition.length).toBeGreaterThan(80);
    }
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
      .slice(27, 34)
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
      .slice(34, 42)
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
    const figureOneApparatus = bardeenTransistorArchivalEdition.blocks[42];
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
      .slice(43, 48)
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
      normalize(paragraphText(51)),
    );
    for (let index = 52; index <= 60; index += 1)
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
    expect(normalize(`${pageNine ?? ""} ${pageTen ?? ""}`)).toContain(normalize(paragraphText(61)));
    for (const index of [62, 64, 65, 66])
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
      normalize(paragraphText(67)),
    );
    for (const index of [68, 69, 70, 71, 72, 74, 75, 78, 80, 82, 83, 84, 85, 86, 87, 88])
      expect(normalize(pageEleven ?? "")).toContain(normalize(paragraphText(index)));
  });

  test("keeps the p.10/p.11 displayed equations literal in both edition and ledger", () => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
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
    const editionEquations = bardeenTransistorArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "equation" }
        > => block.kind === "equation",
      )
      .map((block) => block.text);
    const pageTenEquations = ["d²V/dx² = −4πρ/ε     (2)"];
    const pageElevenEquations = [
      "C = n₁e₁μ₁ + n₂e₂μ₂     (3)",
      "n₁ = A₁e^(−eVₑ/KT)     (4a)",
      "n₂ = A₂e^(eVₕ/KT)     (4b)",
      "C = A₁μ₁e₁e^(−eVₑ/KT) + A₂μ₂e₂e^(e(Eg−Vₑ)/KT)     (5)",
      "Vₑ = Vₕ = Eg/2     (6)",
    ];
    for (const equation of [...pageTenEquations, ...pageElevenEquations])
      expect(editionEquations).toContain(equation);
    for (const equation of pageTenEquations)
      expect(normalize(pageTen ?? "")).toContain(normalize(equation));
    for (const equation of pageElevenEquations)
      expect(normalize(pageEleven ?? "")).toContain(normalize(equation));
  });

  test("authors every p.8–p.11 figure citation at its printed occurrence", () => {
    const referenceText = [
      49, 52, 53, 56, 57, 58, 59, 60, 61, 62, 66, 67, 68, 69, 78, 82, 83, 86, 87,
    ].flatMap((index) => {
      const block = bardeenTransistorArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph")
        throw new Error(`Missing expected figure-bearing paragraph at block ${index}.`);
      return block.inlines
        .filter(
          (inline): inline is FigureReference =>
            inline.kind === "reference" && inline.referenceType === "figure",
        )
        .map((inline) => inline.text);
    });
    expect(referenceText).toEqual([
      "Fig. 12",
      "Fig. 1a",
      "Fig. 1a",
      "Fig. 1a",
      "Fig. 3",
      "Fig. 3a",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
      "Fig. 7",
      "Fig. 6",
      "Fig. 11",
      "Fig. 10",
      "Fig. 8",
      "Fig. 9",
      "Fig. 13",
      "Fig. 14",
      "Fig. 15",
      "Fig. 15",
      "Fig. 1",
      "Fig. 15",
      "Fig. 15",
      "Fig. 15",
      "Fig. 15",
      "Fig. 16",
      "Fig. 15",
      "Figs. 13",
      "15",
      "Figs. 1",
      "10",
      "11",
      "12",
    ]);
  });

  test("keeps the inventor signatures, cited references, and certificate of correction in the source face and ledger", () => {
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2524035-bardeen-transistor-reviewed.txt",
      ),
      "utf8",
    );
    const pageFourteen = ledger.split("--- REVIEWED TRANSCRIPTION PAGE 14 OF 14 ---\n")[1];
    const paragraphs = bardeenTransistorArchivalEdition.blocks
      .filter(
        (
          block,
        ): block is Extract<
          (typeof bardeenTransistorArchivalEdition.blocks)[number],
          { kind: "paragraph" }
        > => block.kind === "paragraph",
      )
      .map((block) => block.inlines.map((inline) => inline.text).join(""));
    expect(paragraphs).toEqual(
      expect.arrayContaining([
        "JOHN BARDEEN.",
        "WALTER H. BRATTAIN.",
        "Patent No. 2,524,035. October 3, 1950. JOHN BARDEEN ET AL.",
        "It is hereby certified that error appears in the printed specification of the above numbered patent requiring correction as follows: Column 6, line 54, for “ar” read are; column 8, line 73, for “and” read end; column 17, line 51, for the word “side” read sign; and that the said Letters Patent should be read as corrected above, so that the same may conform to the record of the case in the Patent Office.",
        "Signed and sealed this 2nd day of January, A. D. 1951.",
        "[SEAL]",
        "THOMAS F. MURPHY, Assistant Commissioner of Patents.",
      ]),
    );
    const tables = bardeenTransistorArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof bardeenTransistorArchivalEdition.blocks)[number],
        { kind: "table" }
      > => block.kind === "table",
    );
    expect(
      tables.some((table) =>
        table.rows.some(
          (row) =>
            row.map((cell) => cell.map((inline) => inline.text).join("")).join("|") ===
            "439,457|Great Britain|Dec. 6, 1935",
        ),
      ),
    ).toBe(true);
    expect(pageFourteen).toContain("Column 6, line 54, for “ar” read are");
    expect(pageFourteen).toContain("column 8, line 73, for “and” read end");
    expect(pageFourteen).not.toContain("for “an” read are");
    expect(pageFourteen).not.toContain("for “and” read and");
    expect(pageFourteen).toContain("THOMAS F. MURPHY, Assistant Commissioner of Patents.");
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
      "Fig. 1",
      "Fig. 2",
      "Fig. 1",
      "Fig. 3",
      "Fig. 1",
      "Fig. 3a",
      "Fig. 3",
      "4",
      "5",
      "6",
      "7",
      "Fig. 1",
      "8",
      "9",
      "Fig. 1",
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
    ).toEqual(["Fig. 13", "Fig. 14", "Fig. 15", "Fig. 16", "Fig. 15"]);
  });
});
