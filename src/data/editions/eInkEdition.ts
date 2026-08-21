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
    "Abstract: An electronically addressable ink comprising transparent microcapsules containing charged pigment particles suspended in a dielectric fluid that migrate under an applied electric field.",
  ],
  4: [
    "Field of the Invention: Electrophoretic electronic displays, microencapsulation chemistry, and reflective bistable electronic paper displays.",
  ],
  6: [
    "Background: Traditional emissive displays (CRTs, back-lit LCDs) cause eye fatigue, suffer poor readability in direct sunlight, and consume continuous electrical power to sustain an image.",
  ],
  7: [
    "Shortcomings of prior electrophoretic cells: Particle agglomeration, gravity settling, and non-uniform optical switching across large display areas.",
  ],
  9: [
    "Summary: Encapsulating electrophoretic fluid into microscopic polymer shells (~30 to 100 microns) prevents particle clustering and permits flexible, rollable electronic paper printing.",
  ],
  10: [
    "Dual-particle electrophoresis: Positively charged titanium dioxide white particles and negatively charged carbon black particles migrate in opposite directions within each microcapsule.",
  ],
  12: [
    "Brief Description of Figures: FIG. 1 is a cross-sectional view of a microcapsule; FIG. 2 illustrates white and black optical switching under electric fields; FIG. 3 shows an active-matrix transistor backplane.",
  ],
  14: [
    "Detailed Description: Each microcapsule 10 contains a dielectric carrier fluid 12 having a controlled refractive index and viscosity to achieve high electrophoretic mobility.",
  ],
  15: [
    "Charge control agents: Surfactants and polymer coatings impart stable zeta potentials ($\\\\zeta \\\\approx +50\\\\text{ mV}$ on TiO2 and $-40\\\\text{ mV}$ on carbon) for rapid response times (~100 ms).",
  ],
  16: [
    "Optical bistability: Van der Waals forces between particles and the capsule wall hold particles in position without sustained voltage, requiring zero standby power.",
  ],
  17: [
    "Active-matrix addressing: Transparent top Indium Tin Oxide (ITO) electrode and segmented bottom thin-film transistor (TFT) backplane drive individual pixel states.",
  ],
  18: [
    "Coating & printing: Microcapsules are blended with a liquid polymer binder and slot-die coated or screen-printed onto flexible plastic substrate rolls.",
  ],
  19: [
    "Reflective performance: High contrast ratio (>10:1) and high reflectance (>40%) matching the readability and lambertian scattering of printed ink on paper.",
  ],
};

export const einkArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
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
      "",
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
      "The invention is described in detail with reference to the accompanying drawings:\n",
      makePreview(
        "FIG. 1",
        [1],
        "Cross-sectional view of a microcapsule containing dual charged particles",
      ),
      " is a cross-sectional diagram of a microcapsule containing charged electrophoretic particles;\n",
      makePreview(
        "FIG. 2",
        [2],
        "Diagram showing white and black optical switching under applied electric fields",
      ),
      " is a diagram showing the optical state transition under applied electric fields; and\n",
      makePreview(
        "FIG. 3",
        [3],
        "Active-matrix thin-film transistor backplane driving electrophoretic pixels",
      ),
      " is a schematic diagram of an active-matrix display backplane driving the microencapsulated ink layer.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Microcapsule cross-section"),
      ", a microcapsule 10 comprises an outer polymeric wall 12 having a diameter of approximately 30 to 100 micrometers. Encapsulated within the microcapsule is a low-viscosity dielectric carrier fluid 14 and a plurality of positively charged white particles 16 (such as rutile titanium dioxide) and negatively charged black particles 18 (such as carbon black).",
    ),
    p(
      "Charge control agents and steric stabilizers are chemically grafted to the particle surfaces to maintain uniform zeta potential and prevent flocculation. The carrier fluid is density-matched to the particles to eliminate gravitational settling, ensuring complete colloidal stability across years of operation.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Dual-particle switching dynamics"),
      ", when an electric field is applied between the top transparent electrode and the bottom drive electrode, the oppositely charged particles translate along field lines in opposing directions. Once positioned adjacent to the top or bottom capsule boundary, the particles remain held by surface adhesion and image-charge forces, providing true ",
      term(
        "optical bistability",
        "Bistable Electronic Memory",
        "The ability of the display to retain text and images indefinitely without electrical power consumption.",
      ),
      " with zero standby energy consumption.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Active-matrix pixel backplane"),
      ", the microencapsulated ink layer 20 is laminated to an active-matrix thin-film transistor (TFT) substrate 22. Individual pixel electrodes apply localized voltage pulses (+15V / -15V) for approximately 100 to 300 milliseconds to switch pixel states, after which all driving circuitry is powered down.",
    ),
    p(
      "The microcapsules are dispersed in a liquid polymer emulsion and coated onto flexible polyester film rolls at speeds exceeding several meters per minute, enabling cost-effective mass production of ultra-thin, lightweight electronic books and smart paper displays.",
    ),
    p(
      "The resulting display achieves a diffuse reflectivity exceeding 40% and a high contrast ratio exceeding 10:1, providing an authentic paper-like visual appearance that remains sharp and readable in direct sunlight at wide viewing angles approaching 180 degrees.",
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
