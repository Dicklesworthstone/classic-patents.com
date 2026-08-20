import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
} from "@/types/archivalEdition";

function text(content: string): CuratedSpecificationInline {
  return { kind: "text", text: content };
}

function term(
  content: string,
  key: string,
  definition: string,
): CuratedSpecificationInline {
  return { kind: "term", text: content, key, definition };
}

function figure(
  content: string,
  figureNumber: string,
  preview: {
    src: string;
    width: number;
    height: number;
    caption: string;
  },
): CuratedSpecificationInline {
  return {
    kind: "figure-ref",
    text: content,
    figureNumber,
    preview,
  };
}

export const maimanRubyLaserArchivalEdition: CuratedSpecificationEdition = {
  patentId: "us-3353115-maiman-ruby-laser",
  sourcePdfSha256:
    "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
  sourcePdfPath: "/patents/pdfs/us-3353115-maiman-ruby-laser.pdf",
  reviewedLedgerPath:
    "/patents/transcripts/us-3353115-maiman-ruby-laser-reviewed.txt",
  claimStatus: "complete",
  blocks: [
    {
      kind: "heading",
      level: 1,
      inlines: [text("United States Patent Office — Patent 3,353,115")],
    },
    {
      kind: "heading",
      level: 2,
      inlines: [
        text(
          "RUBY LASER SYSTEM (OPTICAL MASER APPARATUS)",
        ),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("Theodore H. Maiman, Pacific Palisades, Calif., assignor to Hughes Aircraft Company, Culver City, Calif., a corporation of Delaware."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("Filed Apr. 13, 1961, Ser. No. 102,698. 2 Claims. (Cl. 331—94.5). Patented Nov. 14, 1967."),
      ],
    },
    {
      kind: "heading",
      level: 3,
      inlines: [text("Specification & Detailed Description")],
    },
    {
      kind: "paragraph",
      inlines: [
        text("This invention relates to "),
        term(
          "solid-state optical masers",
          "solid-state optical maser",
          "A quantum-electronic device using a synthetic solid crystal (such as chromium-doped sapphire ruby) to generate or amplify coherent optical electromagnetic radiation via stimulated emission.",
        ),
        text(" or "),
        term(
          "lasers",
          "laser",
          "Light Amplification by Stimulated Emission of Radiation; optical counterpart of the microwave maser providing monochromatic, coherent, collimated light beams.",
        ),
        text(" and more particularly to such devices which use a "),
        term(
          "ruby crystal",
          "ruby crystal",
          "Single-crystal corundum (aluminum oxide, Al2O3) doped with trivalent chromium ions (Cr3+) providing metastable optical energy states for stimulated emission.",
        ),
        text(" as the active laser material. In the past, devices operating on the principles of stimulated emission of radiation were primarily confined to the microwave region of the spectrum and were commonly known as "),
        term(
          "masers",
          "maser",
          "Microwave Amplification by Stimulated Emission of Radiation, operating in the centimeter and millimeter radio wavelength bands.",
        ),
        text(". More recently, theoretical proposals have suggested extending these quantum amplification principles into the infrared and optical spectrum, but practical realization has encountered severe difficulties regarding pumping efficiency, crystal stability, and continuous threshold inversion."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("In accordance with the present invention, a practical, high-power solid-state optical maser is provided comprising a synthetic "),
        term(
          "ruby element",
          "ruby element",
          "A cylindrical rod or shaped crystal of pink ruby containing approximately 0.05% Cr2O3 by weight in an Al2O3 crystal host lattice.",
        ),
        text(" having optical reflecting faces at its ends forming an "),
        term(
          "optical resonant cavity",
          "optical resonant cavity",
          "A Fabry-Perot resonator formed by parallel silvered end faces that recirculates photons along the longitudinal crystal axis to sustain stimulated emission avalanche.",
        ),
        text(", directly coupled to a high-intensity "),
        term(
          "helical flash tube",
          "helical flash tube",
          "A coiled quartz xenon discharge tube surrounding the ruby rod to deliver concentrated broadband optical pumping energy in the green and violet absorption bands.",
        ),
        text(" as illustrated in "),
        figure(
          "FIG. 1",
          "1",
          {
            src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v1.png",
            width: 928,
            height: 733,
            caption: "Helical flash tube optical pumping geometry and ruby rod assembly of US Patent 3,353,115.",
          },
        ),
        text("."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("The quantum mechanics of the "),
        term(
          "three-level laser system",
          "three-level laser",
          "A laser architecture where atoms are pumped from a ground state (Level 1) to broad excitation bands (Level 3), rapidly decay nonradiatively to a long-lived metastable state (Level 2), and undergo stimulated emission back to the ground state (Level 1).",
        ),
        text(" are illustrated in "),
        figure(
          "FIG. 2",
          "2",
          {
            src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v1.png",
            width: 928,
            height: 630,
            caption: "Three energy level diagram showing ground state 1, broadband pump level 3, and metastable laser level 2.",
          },
        ),
        text(". Chromium atoms in the ruby crystal initially reside in the "),
        term(
          "ground state",
          "ground state",
          "The lowest 4A2 energy level of trivalent chromium ions in the crystal field.",
        ),
        text(" (Level 1). High-intensity broadband optical pumping light in the green (560 nm) and violet (410 nm) absorption bands excites the chromium ions to the broad "),
        term(
          "third energy levels",
          "third energy levels",
          "The broadband 4F1 and 4F2 absorption bands of Cr3+ that efficiently absorb pumping photons from xenon flash emission.",
        ),
        text(" (Level 3). From these levels, the excited ions undergo an extremely rapid "),
        term(
          "radiationless transition",
          "radiationless transition",
          "A fast sub-microsecond non-radiative phonon relaxation wherein ions lose excess vibrational energy to the sapphire crystal lattice without emitting photons.",
        ),
        text(" to the discrete "),
        term(
          "metastable second energy level",
          "metastable second energy level",
          "The long-lived 2E doublet state of Cr3+ with a spontaneous fluorescence lifetime of approximately 3.0 to 4.3 milliseconds at room temperature.",
        ),
        text(" (Level 2)."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("Because the lifetime of the metastable level 2 ($3.0\\text{--}4.3\\text{ ms}$) is several orders of magnitude longer than the relaxation time from level 3, intense optical pumping populates level 2 faster than spontaneous decay occurs. When more than half of the total chromium ion population is transferred from level 1 to level 2, a true "),
        term(
          "population inversion",
          "population inversion",
          "The non-equilibrium quantum state where the number of atoms in an excited upper energy level exceeds the number of atoms in the lower terminal state (N2 > N1).",
        ),
        text(" is established between level 2 and ground state 1 ($N_2 > N_1$). Under this condition, photons traversing the crystal induce "),
        term(
          "stimulated emission",
          "stimulated emission",
          "The quantum process predicted by Einstein where an incoming photon induces an excited atom to emit an identical second photon of the exact same frequency, phase, polarization, and direction.",
        ),
        text(" rather than absorption, producing net optical amplification at the deep-red wavelength of "),
        term(
          "694.3 nanometers",
          "694.3 nm (6943 A)",
          "The exact R1 fluorescence line emission wavelength of ruby at room temperature (vacuum wavenumber 14,400 cm^-1).",
        ),
        text(" ($6943\\ \\text{\\AA}$)."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("The cylindrical ruby rod is prepared with optically flat, mutually parallel end faces perpendicular to the rod axis as shown in "),
        figure(
          "FIG. 4",
          "4",
          {
            src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v1.png",
            width: 928,
            height: 511,
            caption: "Cylindrical ruby laser rod with polished, mutually parallel silvered Fabry-Perot end reflectors.",
          },
        ),
        text(". One end face is coated with an opaque silver reflecting layer ($R_1 \\approx 99.9\\%$) while the opposite end face is coated with a partially transmitting silver layer or provided with a central transmission aperture ($R_2 \\approx 90\\%\\text{--}98\\%$) to permit extraction of the output beam."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("For high repetition rates or continuous operation, the ruby rod and flash tube are enclosed within a cooled optical cavity structure as shown in "),
        figure(
          "FIG. 7",
          "7",
          {
            src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-source-crop-v1.png",
            width: 928,
            height: 733,
            caption: "Water-cooled laser head structure housing the ruby rod and helical xenon flash lamp.",
          },
        ),
        text(", utilizing circulating liquid or forced nitrogen coolant to maintain crystal thermal stability during intense excitation discharges."),
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        text("The invention further encompasses practical optical radar and ranging systems, termed "),
        term(
          "Colidar",
          "colidar",
          "Coherent Light Detection and Ranging (the earliest form of modern LIDAR), transmitting microsecond laser pulses and measuring echo time-of-flight with picosecond-scale optical resolution.",
        ),
        text(", as illustrated in "),
        figure(
          "FIG. 18",
          "18",
          {
            src: "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-source-crop-v1.png",
            width: 928,
            height: 715,
            caption: "Colidar laser radar ranging system block diagram utilizing ruby laser transmitter and photoelectric receiver.",
          },
        ),
        text(". The narrow beam divergence and extreme monochromaticity of the pulsed ruby laser beam permit pinpoint ranging over tens of miles with complete immunity to conventional electromagnetic jamming."),
      ],
    },
    {
      kind: "heading",
      level: 3,
      inlines: [text("Claims")],
    },
    {
      kind: "paragraph",
      inlines: [
        text(
          "What is claimed is:",
        ),
      ],
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "A three energy level laser comprising: a ruby having atoms exhibiting a first energy level corresponding to a ground atomic state, a substantially discrete second energy level above said ground state and third energy levels defining a relatively broadband absorption third region extending above said second level; a pumping source of broadband light energy optically coupled to said ruby for illuminating it and exciting atoms thereof to exhibit excitation at said third energy levels from whence they decay without substantial radiation loss to said discrete second energy level so as to establish a population inversion between said discrete second energy level and said ground state; interferometer means optically coupled to said ruby and tuned to the frequency corresponding to that of the energy difference between said second energy level and said first energy level for reflecting light energy of said frequency repeatedly through portions of said ruby to generate a coherent light beam; and coupling means for extracting the monochromatic coherent light beam from said ruby.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "A three energy level ruby laser system, comprising: a ruby having atoms exhibiting a first energy level corresponding to a ground atomic state, a substantially discrete second energy level above said ground state and third energy levels defining a relatively broadband absorption third region extending above said second level; broadband optical pumping means directly coupled to said ruby for exciting atoms of said ruby from said first energy level to said third energy levels from which radiationless energy transition of said atoms takes place to said second energy level to establish a population inversion between said second energy level and said ground state; and light-resonating means coupled to and forming a regenerative optical path through said ruby to stimulate radiant energy transitions of said atoms from said second energy level toward said ground state to produce a coherent monochromatic light beam having a frequency substantially corresponding to the energy difference between said ground state and said second energy level.",
        ),
      ],
    },
  ],
};

export function manualMaimanClaimText(claimNumber: number): string {
  const claim = maimanRubyLaserArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (!claim || claim.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Maiman Ruby Laser archival edition`);
  }
  return claim.inlines.map((i) => i.text).join("");
}

export const maimanRubyLaserParallelReadings: Record<number, string[]> = {
  0: ["Formal United States Patent Office masthead and registration of US Patent 3,353,115 granted to Theodore H. Maiman."],
  1: ["Granted title designating the ruby laser system and solid-state optical maser apparatus."],
  2: ["Inventor identity: Theodore H. Maiman of Pacific Palisades, California, assignor to Hughes Aircraft Company."],
  3: ["Official application filing date of April 13, 1961, grant date of November 14, 1967, and classification 331—94.5."],
  4: ["Specification section heading."],
  5: ["Background of quantum electronics: transition from microwave masers to optical wavelengths and the prior-art challenge of creating an optical resonator and pumping engine."],
  6: ["The core apparatus: synthetic ruby crystal rod coupled to a high-intensity helical xenon flash tube and optical Fabry-Perot resonator."],
  7: ["Quantum mechanical three-level system: optical absorption into broad green/violet bands (Level 3) followed by sub-microsecond non-radiative phonon relaxation to the metastable 2E state (Level 2)."],
  8: ["Achievement of population inversion (N2 > N1) over the ground state, overcoming spontaneous emission losses to trigger coherent stimulated emission avalanche at 694.3 nm."],
  9: ["Fabry-Perot resonator fabrication: precision polished, parallel end faces with dielectric or silver coatings for mode selection and beam extraction."],
  10: ["Cooled optical cavity architecture: liquid and forced nitrogen cooling jackets to maintain ruby rod low-temperature stability during high-energy discharge cycling."],
  11: ["Colidar application: the world's first laser radar system utilizing monochromatic microsecond optical pulses for high-precision, jam-proof spatial ranging."],
  12: ["Claims heading."],
  13: ["Introductory legal preamble to the granted claims."],
  14: ["Claim 1: The foundational apparatus combination claiming a three-energy-level ruby crystal, broadband optical pumping source, radiationless transition establishing population inversion, tuned interferometer resonator, and beam extraction coupling means."],
  15: ["Claim 2: The system claim protecting three-level optical pumping directly coupled to ruby, radiationless energy transition creating population inversion, and regenerative light-resonating path stimulating 694.3 nm coherent beam emission."],
};
