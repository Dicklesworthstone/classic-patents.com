import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

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
  if (!block || block.kind !== "claim") {
    throw new Error(`E Ink manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

function figureAssetPath(number: number): string {
  return `/patents/figures/us-6120588-eink/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    // Source crops are withheld until each occurrence is cloud-verified as an
    // upright isolated crop from the matching printed drawing sheet.
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const einkParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Abstract: The grant describes electronically active inks and a printing system that patterns contrast media, conductors, insulators, resistors, semiconductors, magnetic, spin, piezoelectric, optoelectronic, thermoelectric, and radio-frequency materials.",
  ],
  4: [
    "Field: the source concerns electronically active inks and printing systems that form electronically functional structures.",
  ],
  6: [
    "Background: the specification starts from known bichromal particles and microspheres whose electronic behavior is limited when it relies only on naturally occurring zeta potential.",
  ],
  7: [
    "The source identifies the linked material/electronic-property limitation and introduces particles with implanted dipole moments for electrostatic or dielectrophoretic displays.",
  ],
  9: [
    "Microencapsulation discussion: the source seeks shells with optical clarity, dielectric strength, impermeability, and pressure resistance for electronically active internal phases.",
  ],
  10: [
    "Electrophoretic embodiment: oppositely charged particles of different colors migrate toward the capsule surface according to field polarity, producing a perceived color change.",
  ],
  12: [
    "Drawing inventory: the grant has 16 sheets covering particle fabrication, microencapsulation, top/bottom/in-plane contrast media, dielectrophoresis, printed inks and circuits, displays, motors, watches, and a spin computer.",
  ],
  14: [
    "The source describes atomizing nozzles, charged droplets, and electrostatic coalescence to make bichromal or monochromal particles with implanted dipole moments.",
  ],
  15: [
    "The source describes microencapsulation by interfacial polymer formation, layered liquid films, or a photomask-exposed crosslinkable polymer cellular structure.",
  ],
  16: [
    "The specification gives top-electrode, in-plane, chemical, photoconductive, and dielectrophoretic contrast-media embodiments rather than one commercial pigment recipe.",
  ],
  17: [
    "Later figures extend the ink concept to printed semiconductor, transistor, solar-cell, capacitor, resistor, inductor, display, motor, watch, and spin-computer structures.",
  ],
  18: [
    "Printing systems include fluid delivery, screen printing, ink jets with reducing agents, electron-beam or light reduction, electroplating, and a movable deposition head.",
  ],
  19: [
    "The final specification states that changes in form and detail may be made without departing from the invention as defined by the appended claims.",
  ],
};

export const einkArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
  preparedBy: "Classic Patents source-audit draft (withheld pending full cloud reconciliation)",
  preparedAt: "2026-08-21",
  // Typed edition drafts require this field, but this draft is not attached to
  // the served record until the remaining specification and figure coverage
  // receives independent acceptance.
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jacobson et al.",
        "Patent No.: US 6,120,588",
        "Date of Patent: Sep. 19, 2000",
        "ELECTRONICALLY ADDRESSABLE MICROENCAPSULATED INK AND DISPLAY THEREOF",
        "Inventor: Joseph M. Jacobson, Cambridge, Mass.",
        "Assignee: E Ink Corporation, Cambridge, Mass.",
        "Application No.: 08/935,800 · Filed: Sep. 23, 1997",
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
      text: "FIELD OF THE INVENTION",
    },
    p(
      "The present invention relates generally to electronically active inks and printing systems for forming electronically functional structures.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "Means are known in the prior art for producing bichromal particles or microspheres for use in electronic displays. Such techniques produce a particle that does not have an implanted dipole moment but rather relies in general on the Zeta potential of the material to create a permanent dipole.",
    ),
    p(
      "Such a scheme suffers from the fact that it links the material properties to the electronic properties thus limiting the size of the dipole moment which may be created. FIG. 1 details means of producing particles, either bichromal as might be used in an electrostatic display, or monochromal as might be used in a dielectrophoretic display, with an implanted dipole moment.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "A large number of techniques are known in the literature for microencapsulating one material inside another material. Such techniques are generally used in the paper or pharmaceutical industry and do not generally produce a microcapsule which embodies simultaneously the properties of optical clarity, high dielectric strength, impermeability and resistance to pressure. With proper modification however these techniques may be made amenable to microencapsulating systems with electronic properties.",
    ),
    p(
      "Referring to FIG. 3B a microcapsule 120 may contain positively charged particles of one color 210 and negatively charged particles of another color 220 such that application of an electric field to said electrodes causes a migration of the one color or the other color, depending on the polarity of the field, toward the surface of said microcapsule and thus effecting a perceived color change. Such a system constitutes a microencapsulated electrophoretic system.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWING FIGURES",
    },
    p(
      "FIGS. 1A, 1B, 1C, 1D, 1E, and 1F are schematic representations of means of fabricating particles with a permanent dipole moment. FIGS. 2A, 2B and 2C are schematic representations of means of microencapsulation. FIGS. 3A, 3B, 3C, 3D, and 3E are schematic representations of microencapsulated electronically addressable contrast media systems suitable for top to bottom addressing. FIGS. 4A through 4M are schematic representations of systems suitable for bottom addressing. FIGS. 5A through 6E describe dielectrophoretic and frequency-dependent systems. FIGS. 7 through 10 depict electronic inks, printing systems, and printed structures. FIGS. 11 through 14 depict displays, an electrostatic motor, a watch, and a spin computer.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to FIG. 1A atomizing nozzles 1 are loaded with materials 12 and 13 which may be differently colored. A first atomizing nozzle may be held at a positive potential 3 and a second nozzle may be held at a negative potential 4. Such potentials aid in atomization and impart a charge to droplets which form from said nozzles producing positively charge droplets 5 and negatively charged droplets 6. Such opposite charged droplets are attracted to each other electrostatically forming an overall neutral pair.",
    ),
    p(
      "A large number of techniques are known in the literature for microencapsulating one material inside another material. With proper modification, these techniques may be made amenable to microencapsulating systems with electronic properties.",
    ),
    p(
      "Referring to FIG. 3B a microcapsule 120 may contain positively charged particles of one color 210 and negatively charged particles of another color 220 such that application of an electric field to said electrodes causes a migration of the one color or the other color, depending on the polarity of the field, toward the surface of said microcapsule and thus effecting a perceived color change. Such a system constitutes a microencapsulated electrophoretic system.",
    ),
    p(
      "Referring to FIGS. 4A and B the chemistry described in reference to FIGS. 3C-D may be employed with in-plane electrodes such that said chemistry undergoes a color switch from one color state to a second color state upon application of an electric field to in-plane electrodes 270 and 280.",
    ),
    p(
      "In one printing system a semiconductor ink 350 may be fabricated by dispersing a semiconductor powder 355 in a suitable binder 356. The semiconductive ink may be applied by printing techniques to form switch or logic structures.",
    ),
    p(
      "Referring to FIG. 14, a spin computer is depicted in which dipoles 912 with dipole moment 914 are situated at the nodes of row 920 and column 930 address lines. Such a computer works by means of initially addressing said dipoles to an initial condition and then allowing dipole interactions to produce a final state of the system as a whole.",
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
          text: "The ink of claim 1 wherein said second particle comprises a substance capable of reacting with said first particle, whereupon the application of a first electric field causes said first particle to be maintained separate from said substance such that said ink is maintained in a first color state; and whereupon application of a second electric field said first particle and said substance react to form a com- pound having a second color state.",
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
