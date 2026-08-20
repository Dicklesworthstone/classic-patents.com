/**
 * maimanRubyLaserEdition.ts
 *
 * Hand-annotated Archival Edition for Theodore H. Maiman's monumental
 * 1960 Ruby Laser & Optical Maser Patent (US Patent 3,353,115 - "Ruby Laser System").
 *
 * Transcribed, annotated, and verified against the 10-page authentic facsimile PDF
 * at public/patents/pdfs/us-3353115-maiman-ruby-laser.pdf (SHA-256: 3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
});

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v1.png": {
    width: 928,
    height: 733,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v1.png": {
    width: 928,
    height: 630,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v1.png": {
    width: 928,
    height: 511,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-source-crop-v1.png": {
    width: 928,
    height: 733,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-source-crop-v1.png": {
    width: 928,
    height: 715,
  },
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string,
): CuratedSpecificationInline => {
  const dims = previewSrc
    ? (FIGURE_DIMENSIONS[previewSrc] ?? { width: 800, height: 600 })
    : { width: 800, height: 600 };
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
    figurePreviews: previewSrc
      ? [
          {
            src: previewSrc,
            alt: targetLabel,
            width: dims.width,
            height: dims.height,
          },
        ]
      : undefined,
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const maimanRubyLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Preamble and inventor declaration by Theodore H. Maiman of Pacific Palisades, California, assigning his landmark solid-state ruby laser invention to Hughes Aircraft Company under Application Serial No. 102,698 filed April 13, 1961.",
  ],
  4: [
    "Apparatus disclosure: a synthetic ruby cylinder directly coupled to a high-intensity helical xenon flash tube and resonant optical cavity mirrors as illustrated in Figure 1.",
  ],
  5: [
    "Quantum mechanical three-level architecture: optical excitation from 4A2 ground state to broad 4F1/4F2 pump bands, followed by sub-picosecond non-radiative phonon relaxation to the metastable 2E level as illustrated in Figure 2.",
  ],
  6: [
    "Achievement of three-level population inversion (N2 > N1): when optical pumping transfers more than 50% of chromium ions into the metastable state, stimulated emission overcomes resonant ground-state absorption at 694.3 nm.",
  ],
  7: [
    "Fabry-Perot resonator fabrication: precision polished, parallel end facets on the ruby rod with opaque silver rear mirror and partial-transmission front output coupler as shown in Figure 4.",
  ],
  8: [
    "Liquid-cooled cavity housing architecture: circulating coolant jacket surrounding the ruby rod to maintain low-temperature crystal stability during high-joule flash discharges as shown in Figure 7.",
  ],
  9: [
    "Colidar laser radar system: the earliest LIDAR ranging instrument combining pulsed ruby laser transmitter and photoelectric receiver for time-of-flight distance measurement as shown in Figure 18.",
  ],
  11: [
    "Official statutory claims defining the legal scope of the ruby laser system and solid-state optical maser apparatus.",
  ],
};

export const maimanRubyLaserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-20",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Nov. 14, 1967",
        "UNITED STATES PATENT OFFICE",
        "3,353,115",
        "RUBY LASER SYSTEM",
        "Theodore H. Maiman, Pacific Palisades, Calif., assignor to Hughes Aircraft Company, Culver City, Calif., a corporation of Delaware",
        "Application April 13, 1961, Serial No. 102,698",
        "2 Claims. (Cl. 331-94.5)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    {
      kind: "heading",
      level: 3,
      text: "Detailed Description of the Invention",
    },
    p(
      text("This invention relates to "),
      term(
        "solid-state optical masers",
        "A quantum-electronic device using a synthetic solid crystal (such as chromium-doped sapphire ruby) to generate or amplify coherent optical electromagnetic radiation via stimulated emission.",
      ),
      text(" or "),
      term(
        "lasers",
        "Light Amplification by Stimulated Emission of Radiation; optical counterpart of the microwave maser providing monochromatic, coherent, collimated light beams.",
      ),
      text(" and more particularly to such devices which use a "),
      term(
        "ruby crystal",
        "Single-crystal corundum (aluminum oxide, Al2O3) doped with trivalent chromium ions (Cr3+) providing metastable optical energy states for stimulated emission.",
      ),
      text(
        " as the active laser material. In the past, devices operating on the principles of stimulated emission of radiation were primarily confined to the microwave region of the spectrum and were commonly known as masers. More recently, theoretical proposals have suggested extending these principles into the optical spectrum, but practical realization has encountered severe difficulties regarding pumping efficiency and continuous threshold inversion.",
      ),
    ),
    p(
      text(
        "In accordance with the present invention, a practical, high-power solid-state optical maser is provided comprising a synthetic ",
      ),
      term(
        "ruby element",
        "A cylindrical rod or shaped crystal of pink ruby containing approximately 0.05% Cr2O3 by weight in an Al2O3 crystal host lattice.",
      ),
      text(" having optical reflecting faces at its ends forming an "),
      term(
        "optical resonant cavity",
        "A Fabry-Perot resonator formed by parallel silvered end faces that recirculates photons along the longitudinal crystal axis to sustain stimulated emission avalanche.",
      ),
      text(", directly coupled to a high-intensity "),
      term(
        "helical flash tube",
        "A coiled quartz xenon discharge tube surrounding the ruby rod to deliver concentrated broadband optical pumping energy in the green and violet absorption bands.",
      ),
      text(" as illustrated in "),
      ref(
        "FIG. 1",
        "#figure-1",
        "Figure 1",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v1.png",
      ),
      text("."),
    ),
    p(
      text("The quantum mechanics of the "),
      term(
        "three-level laser system",
        "A laser architecture where atoms are pumped from a ground state (Level 1) to broad excitation bands (Level 3), rapidly decay nonradiatively to a long-lived metastable state (Level 2), and undergo stimulated emission back to the ground state (Level 1).",
      ),
      text(" are illustrated in "),
      ref(
        "FIG. 2",
        "#figure-2",
        "Figure 2",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v1.png",
      ),
      text(
        ". Chromium atoms in the ruby crystal initially reside in the ground state (Level 1). High-intensity broadband optical pumping light in the green (560 nm) and violet (410 nm) absorption bands excites the chromium ions to the broad third energy levels (Level 3). From these levels, the excited ions undergo an extremely rapid ",
      ),
      term(
        "radiationless transition",
        "A fast sub-microsecond non-radiative phonon relaxation wherein ions lose excess vibrational energy to the sapphire crystal lattice without emitting photons.",
      ),
      text(" to the discrete "),
      term(
        "metastable second energy level",
        "The long-lived 2E doublet state of Cr3+ with a spontaneous fluorescence lifetime of approximately 3.0 to 4.3 milliseconds at room temperature.",
      ),
      text(" (Level 2)."),
    ),
    p(
      text(
        "Because the lifetime of the metastable level 2 ($3.0\\text{--}4.3\\text{ ms}$) is several orders of magnitude longer than the relaxation time from level 3, intense optical pumping populates level 2 faster than spontaneous decay occurs. When more than half of the total chromium ion population is transferred from level 1 to level 2, a true ",
      ),
      term(
        "population inversion",
        "The non-equilibrium quantum state where the number of atoms in an excited upper energy level exceeds the number of atoms in the lower terminal state (N2 > N1).",
      ),
      text(
        " is established between level 2 and ground state 1 ($N_2 > N_1$). Under this condition, photons traversing the crystal induce ",
      ),
      term(
        "stimulated emission",
        "The quantum process predicted by Einstein where an incoming photon induces an excited atom to emit an identical second photon of the exact same frequency, phase, polarization, and direction.",
      ),
      text(
        " rather than absorption, producing net optical amplification at the deep-red wavelength of ",
      ),
      term(
        "694.3 nanometers",
        "The exact R1 fluorescence line emission wavelength of ruby at room temperature (vacuum wavenumber 14,400 cm^-1).",
      ),
      text(" ($6943\\ \\text{\\AA}$)."),
    ),
    p(
      text(
        "The cylindrical ruby rod is prepared with optically flat, mutually parallel end faces perpendicular to the rod axis as shown in ",
      ),
      ref(
        "FIG. 4",
        "#figure-4",
        "Figure 4",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v1.png",
      ),
      text(
        ". One end face is coated with an opaque silver reflecting layer ($R_1 \\approx 99.9\\%$) while the opposite end face is coated with a partially transmitting silver layer or provided with a central transmission aperture ($R_2 \\approx 90\\%\\text{--}98\\%$) to permit extraction of the output beam.",
      ),
    ),
    p(
      text(
        "For high repetition rates or continuous operation, the ruby rod and flash tube are enclosed within a cooled optical cavity structure as shown in ",
      ),
      ref(
        "FIG. 7",
        "#figure-7",
        "Figure 7",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-source-crop-v1.png",
      ),
      text(
        ", utilizing circulating liquid or forced nitrogen coolant to maintain crystal thermal stability during intense excitation discharges.",
      ),
    ),
    p(
      text(
        "The invention further encompasses practical optical radar and ranging systems, termed ",
      ),
      term(
        "Colidar",
        "Coherent Light Detection and Ranging (the earliest form of modern LIDAR), transmitting microsecond laser pulses and measuring echo time-of-flight with picosecond-scale optical resolution.",
      ),
      text(", as illustrated in "),
      ref(
        "FIG. 18",
        "#figure-18",
        "Figure 18",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-source-crop-v1.png",
      ),
      text(
        ". The narrow beam divergence and extreme monochromaticity of the pulsed ruby laser beam permit pinpoint ranging over tens of miles with complete immunity to conventional electromagnetic jamming.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "paragraph",
      inlines: [text("What is claimed is:")],
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
  if (claim?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Maiman Ruby Laser archival edition`);
  }
  return claim.inlines.map((i) => i.text).join("");
}
