import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

export const EINK_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1856, height: 2385 },
  2: { width: 1856, height: 2385 },
  3: { width: 1856, height: 2385 },
};

/**
 * Claims are authored once in the edition.  The catalogue record must never
 * carry a second literal transcription that can drift from this source face.
 */
export function manualClaimText(number: number): string {
  const block = einkArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`E Ink manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

const p = (
  ...inlines: string[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((text) => ({ kind: "text", text })),
});

export const einkParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Abstract: The grant describes electronically active inks and a printing system that patterns contrast media, conductors, insulators, resistors, semiconductors, magnetic, spin, piezoelectric, optoelectronic, thermoelectric, and radio-frequency materials.",
  ],
};

export const einkArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
  preparedBy: "Classic Patents source-audit draft",
  preparedAt: "2026-08-21",
  // This bounded draft remains attached for dynamic claim sourcing, but it is
  // not publishable until every specification paragraph is reconciled.
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jacobson",
        "Patent Number: 6,120,588",
        "Date of Patent: Sep. 19, 2000",
        "ELECTRONICALLY ADDRESSABLE MICROENCAPSULATED INK AND DISPLAY THEREOF",
        "Inventor: Joseph M. Jacobson, Cambridge, Mass.",
        "Assignee: E Ink Corporation, Cambridge, Mass.",
        "Appl. No.: 08/935,800",
        "Filed: Sep. 23, 1997",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "We describe a system of electronically active inks which may include electronically addressable contrast media, conductors, insulators, resistors, semiconductive materials, magnetic materials, spin materials, piezoelectric materials, optoelectronic, thermoelectric or radio frequency materials. We further describe a printing system capable of laying down said materials in a definite pattern. Such a system may be used for instance to: print a flat panel display complete with onboard drive logic; print a working logic circuit onto any of a large class of substrates; print an electrostatic or piezoelectric motor with onboard logic and feedback or print a working radio transmitter or receiver.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "An electrically addressable ink comprising a microcapsule, said microcapsule comprising: a first particle having a first charge; and a second particle having a second charge; wherein applying an electric field having a first polarity to said microcapsule effects a perceived optical property change by causing one of said first and second particles to migrate in a direction responsive to said field.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 1 wherein both said first and said second particles move in response to said electric field.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        { kind: "text", text: "The ink of claim 1 wherein said first particle has a color." },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        { kind: "text", text: "The ink of claim 1 wherein said first particle comprises a dye." },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 1 wherein the first particle further comprises a dye indicator system.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 1 wherein said microcapsule further comprises a material such that said first and second particles are substantially immobile in the absence of an electric field.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 1 wherein said second particle comprises a substance capable of reacting with said first particle, whereupon the application of a first electric field causes said first particle to be maintained separate from said substance such that said ink is maintained in a first color state; and whereupon application of a second electric field said first particle and said substance react to form a compound having a second color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 7 wherein said first particle and said substance react to form a compound having a color state when at least one of said first and second electric fields is zero.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 1 wherein said first particle comprises a ring structure coupled to a first head having a first charge, and said second particle comprises a substance coupled to a second head having a second charge; wherein application of an electric field causes said ring structure and said substance to become separated from each other, effecting a first color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 9 wherein application of a second electric field brings said ring structure and said substance into contact to effect a second color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "A microencapsulated ink system, comprising: a microcapsule comprising: a photoconductive semiconductor particle; and a dye indicator particle; wherein the application of an electric field to said microcapsule causes said photoconductive semiconductor particle to generate free charge, causing the dye indicator to effect a first color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "An electrically addressable ink comprising a microcapsule, said microcapsule comprising: a hairpin-shaped molecule having a first portion and a second portion, said hair-pin shaped molecule comprising: a first moiety having a first charge attached to said first portion of said hairpin-shaped molecule; and a second moiety having a second charge attached to said second portion of said hairpin-shaped molecule, said second moiety capable of reacting with said first moiety, said second charge being opposite to said first charge; the reaction between said first moiety and said second moiety defining a closed state of said hairpin-shaped molecule effecting a first color state; and the separation of said first moiety from said second moiety defining an open state of said hairpin-shaped molecule, effecting a second color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 12 wherein said hairpin-shaped molecule transitions between open and closed states upon application of an electric field.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 13 wherein said hairpin-shaped molecule transitions between open and closed states upon application of an alternating field having a frequency resonant with the vibrational mode of the first and second moieties.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "An electronically addressable ink comprising a microcapsule, said microcapsule comprising: a polymer molecule having a first non-linear shape in the presence of a first electric field, said polymer molecule comprising: a first moiety attached to a first location; and a second moiety attached to a second location; wherein the application of a second electric field causes said polymer molecule to assume a linear shape, separating said first and second moities to effect a first color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 15, wherein the application of a third electric field causes causing the polymer molecule to assume a second non-linear shape, causing said first and second moieties to react to effect a second color state.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "The ink of claim 16, wherein said first and third electric fields are the same field.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "An electrically addressable medium comprising a microcapsule, said microcapsule further comprising a non-colored dye solvent complex, said dye solvent complex being stable when no electric field is applied and wherein applying an electric field causes said dye solvent complex to separate into a dye complex and a solvent complex, effecting a first color state.",
        },
      ],
    },
  ],
};

export const einkEdition = einkArchivalEdition;
