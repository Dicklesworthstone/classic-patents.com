/**
 * maimanRubyLaserEdition.ts
 *
 * Hand-annotated Archival Edition for Theodore H. Maiman's monumental
 * 1960 Ruby Laser & Optical Maser Patent (US Patent 3,353,115 - "Ruby Laser Systems").
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
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-1-01.png": { width: 2320, height: 3408 },
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png": { width: 2320, height: 3408 },
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png": { width: 2320, height: 3408 },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v2.png": {
    width: 1600,
    height: 1100,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v2.png": {
    width: 1700,
    height: 620,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png": {
    width: 1600,
    height: 520,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png": {
    width: 1120,
    height: 700,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png": {
    width: 300,
    height: 300,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png": {
    width: 550,
    height: 480,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png": {
    width: 380,
    height: 450,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png": {
    width: 1150,
    height: 1200,
  },
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png": {
    width: 900,
    height: 600,
  },
};

const FIGURE_PREVIEW_ALTS: Readonly<Record<string, string>> = {
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-1-01.png":
    "Source drawing sheet 1 containing Figures 1 through 3.",
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png":
    "Source drawing sheet 2 containing Figures 4 through 7.",
  "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png":
    "Source drawing sheet 3 containing Figures 8 through 17.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png":
    "Figure 7 energy-level apparatus: white-light input, fluorescent stage, and ruby stage.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png":
    "Printed Figure 7 label from the source drawing sheet.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png":
    "Figure 7 upper-right labels: second energy level and level 2.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png":
    "Figure 7 lower-right ruby path and downward arrow from level 2 to level 1.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png":
    "Figure 18 transmitter, receiver, synch power, and numbered optical apparatus.",
  "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png":
    "Figure 18 output beam, target 212, and printed Figure 18 label.",
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string | readonly string[],
): CuratedSpecificationInline => {
  const previewSources = previewSrc
    ? typeof previewSrc === "string"
      ? [previewSrc]
      : previewSrc
    : [];
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
    figurePreviews: previewSources.length
      ? previewSources.map((src) => {
          const dims = FIGURE_DIMENSIONS[src] ?? { width: 800, height: 600 };
          return {
            src,
            alt: FIGURE_PREVIEW_ALTS[src] ?? targetLabel,
            width: dims.width,
            height: dims.height,
          };
        })
      : undefined,
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const maimanRubyLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Overview of patent drawing Figures 1 through 18 illustrating the optical maser apparatus, three-level energy pumping schematics, cooling jackets, interferometer coatings, and practical optical radar ranging systems.",
  ],
  4: [
    "Field of invention: solid-state optical masers and ruby lasers using synthetic single-crystal corundum doped with chromium ions to achieve coherent stimulated emission in the optical spectrum.",
  ],
  5: [
    "Apparatus disclosure: a synthetic ruby cylinder is placed coaxially within a helical gas-filled flash tube, with reflective end plating and an output opening forming an optical resonant cavity.",
  ],
  6: [
    "The energy-level discussion explains pumping from ground state level 1 to a broad absorption band 3, followed by radiationless decay to metastable level 2 and stimulated emission back to level 1.",
  ],
  7: [
    "The specification describes the population inversion condition where level 2 atom population exceeds ground state level 1 (N2 > N1), enabling optical wave amplification rather than net absorption.",
  ],
  8: [
    "The rod ends provide repeated reflections across optically flat, parallel faces, and an opening in one end plating couples the coherent beam out.",
  ],
  9: [
    "An embodiment using a cooled optical cavity structure and energy-level operation is shown for Figure 7.",
  ],
  10: [
    "Figures 8 and 9 show hollow and refrigerated laser arrangements: a coolant cylinder surrounds the active material, and a cooled rod is paired with a coaxial flash tube.",
  ],
  11: [
    "Figures 10 through 12 explain how coatings and a high-index coolant suppress nonparallel rays and preserve a narrow, coherent output beam while controlling the active material's temperature.",
  ],
  12: [
    "Figure 13 uses prisms, mirrors, and a Fabry-Perot interferometer to select the proper wavelength while rejecting nonparallel rays; Figures 14 and 15 use parallel reflective plates for the same discrimination.",
  ],
  13: [
    "Figures 16 and 17 use parabolic and elliptical reflectors to transfer broadband pump light from a separated source through the active laser segment.",
  ],
  14: [
    "Figure 18 applies the laser to a colidar optical-radar system: a synchronizer triggers the transmitter and time-separated transmitter and receiver pulses indicate target range.",
  ],
  15: [
    "Summary of the solid-state ruby laser invention: monochromatic optical amplification, room-temperature operation, 5x10^11 cps tuning capability, high power handling for colidar radar, and precise beam focusing for physics and medicine.",
  ],
  17: [
    "Official statutory claims defining the legal scope of the three-level ruby laser system and solid-state optical maser apparatus.",
  ],
};

export const maimanRubyLaserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
  preparedBy: "Classic Patents editorial agent (GPT-5.6 Luna)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Nov. 14, 1967",
        "UNITED STATES PATENT OFFICE",
        "3,353,115",
        "RUBY LASER SYSTEMS",
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
      text("The accompanying drawings are described as follows: "),
      ref(
        "FIG. 1",
        "#figure-1",
        "Figure 1",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v2.png",
      ),
      text(" is an energy-level diagram; "),
      ref(
        "FIG. 2",
        "#figure-2",
        "Figure 2",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v2.png",
      ),
      text(" illustrates optical pumping; "),
      ref(
        "FIG. 3",
        "#figure-3",
        "Figure 3",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-1-01.png",
      ),
      text(" shows optical pumping with sunlight; "),
      ref(
        "FIG. 4",
        "#figure-4",
        "Figure 4",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png",
      ),
      text(" shows a helical gas-filled flash tube; "),
      ref(
        "FIG. 5",
        "#figure-5",
        "Figure 5",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png",
      ),
      text(" an alternative hollow gas-filled cylinder; "),
      ref(
        "FIG. 6",
        "#figure-6",
        "Figure 6",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png",
      ),
      text(" a hollow optical pump separated by fluorescent material; "),
      ref(
        "FIG. 7",
        "#figure-7",
        "Figure 7",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png",
      ),
      text(" its energy-level operation; "),
      ref(
        "FIG. 8",
        "#figure-8",
        "Figure 8",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" a hollow active laser cylinder and coolant; "),
      ref(
        "FIG. 9",
        "#figure-9",
        "Figure 9",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" a refrigerated laser material; "),
      ref(
        "FIG. 10",
        "#figure-10",
        "Figure 10",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" an uncoated segment; "),
      ref(
        "FIG. 11",
        "#figure-11",
        "Figure 11",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" a coated segment; "),
      ref(
        "FIG. 12",
        "#figure-12",
        "Figure 12",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" a segment surrounded by high-index coolant; "),
      ref(
        "FIG. 13",
        "#figure-13",
        "Figure 13",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" an interferometer system; "),
      ref(
        "FIG. 14",
        "#figure-14",
        "Figure 14",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" and "),
      ref(
        "FIG. 15",
        "#figure-15",
        "Figure 15",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" additional interferometers; "),
      ref(
        "FIG. 16",
        "#figure-16",
        "Figure 16",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" and "),
      ref(
        "FIG. 17",
        "#figure-17",
        "Figure 17",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(" laser systems using an exploding-wire optical pump; and "),
      ref(
        "FIG. 18",
        "#figure-18",
        "Figure 18",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png",
      ),
      text(" a practical colidar system using a laser."),
    ),
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
        "A cylindrical rod or shaped crystal of ruby serving as the active solid-state laser material.",
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
        "FIG. 4",
        "#figure-4",
        "Figure 4",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png",
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
        "FIG. 1",
        "#figure-1",
        "Figure 1",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v2.png",
      ),
      text(
        ". Chromium atoms in the ruby crystal initially reside in the ground state (Level 1). Broadband optical pumping light excites the chromium ions to the broad third energy region (Level 3). From this region, the excited ions undergo a ",
      ),
      term(
        "radiationless transition",
        "A non-radiative transition in which excited ions lose energy to the crystal lattice without emitting light.",
      ),
      text(" to the discrete "),
      term(
        "metastable second energy level",
        "The discrete upper state in which excited ions remain until stimulated or spontaneous emission returns them toward the ground state.",
      ),
      text(" (Level 2)."),
    ),
    p(
      text(
        "Because the relaxation into level 2 is favored over direct return to the ground state, optical pumping can establish a population inversion. When the population of level 2 exceeds that of level 1, a true ",
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
        " rather than absorption, producing net optical amplification at the transition frequency.",
      ),
    ),
    p(
      text(
        "The cylindrical ruby rod is prepared with optically flat, mutually parallel end faces perpendicular to the rod axis as shown in ",
      ),
      ref(
        "FIG. 4",
        "#figure-4",
        "Figure 4",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png",
      ),
      text(
        ". One end face is coated to reflect light while the opposite end face is coated to transmit part of the light or provided with a central transmission aperture to permit extraction of the output beam.",
      ),
    ),
    p(
      text("An embodiment using a cooled optical cavity structure is shown in "),
      ref("FIG. 7", "#figure-7", "Figure 7", [
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png",
      ]),
      text("."),
    ),
    p(
      text("Referring to "),
      ref(
        "FIG. 8",
        "#figure-8",
        "Figure 8",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(
        ", the active laser material is a hollow cylinder within which a cylindrical flash tube is coaxially disposed. The active material is surrounded by a coolant cylinder, which may have a high index of refraction and a polished internal surface for reflecting pump energy back through the laser material. In ",
      ),
      ref(
        "FIG. 9",
        "#figure-9",
        "Figure 9",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(
        ", the laser material is refrigerated. A rod has plated ends and a coupling hole for the output beam; a thermally conductive rod extends into liquid nitrogen in a Dewar flask, while a coaxial flash tube and coolant cylinder surround the laser rod.",
      ),
    ),
    p(
      ref(
        "FIG. 10",
        "#figure-10",
        "Figure 10",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(
        " illustrates a segment of laser material surrounded by a low-index material such as air. An axial ray can travel without reflecting from the side, while nonparallel rays reflect at the boundary, increasing the effective resonating length and spreading the output. In ",
      ),
      ref(
        "FIG. 11",
        "#figure-11",
        "Figure 11",
        "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
      ),
      text(
        ", a coating transparent to pump energy and absorptive near the laser output frequency absorbs nonparallel rays at the boundary. ",
      ),
      ref("FIG. 12", "#figure-12", "Figure 12"),
      text(
        " shows a high-index coolant in immediate contact with the active segment, transmitting nonparallel rays that would otherwise reflect. The specification gives diodomethane as a practical coolant whose refractive index is close to that of ruby and explains that coolant also controls the operating frequency by controlling temperature.",
      ),
    ),
    p(
      ref("FIG. 13", "#figure-13", "Figure 13"),
      text(
        " illustrates an interferometer arrangement in which prisms and mirrors define a closed path through active material. A Fabry-Perot interferometer between parallel plates selects the proper wavelength while nonparallel rays are lost from the circuit. ",
      ),
      ref("FIG. 14", "#figure-14", "Figure 14"),
      text(" and "),
      ref("FIG. 15", "#figure-15", "Figure 15"),
      text(
        " show additional interferometers using mutually parallel reflective plates to discriminate against nonparallel rays and couple out the desired beam.",
      ),
    ),
    p(
      ref("FIG. 16", "#figure-16", "Figure 16"),
      text(" and "),
      ref("FIG. 17", "#figure-17", "Figure 17"),
      text(
        " illustrate remote optical pumping of an active laser segment by broadband light. In the first arrangement parabolic reflectors collimate and refocus pump light through the segment; in the second, an elliptical surface reflects light from one focus to the laser segment at the other focus. The source may use an exploding wire, a gas-filled flash tube, or a carbon arc lamp.",
      ),
    ),
    p(
      text(
        "The invention further encompasses practical optical radar and ranging systems, termed ",
      ),
      term(
        "Colidar",
        "Coherent Light Ranging, a laser transmitter and photoelectric receiver arranged to compare the times of transmitted and received pulses.",
      ),
      text(", as illustrated in "),
      ref("FIG. 18", "#figure-18", "Figure 18", [
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png",
        "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png",
      ]),
      text(
        ". The specification explains that the narrow beam and short wavelength permit long-distance propagation and high resolution; range is read from the time difference between the transmitter and receiver pulses.",
      ),
    ),
    p(
      text(
        "There has thus been disclosed a laser system in which the active laser substance is solid state and which provides coherent monochromatic amplification and generation of electromagnetic wave energy in the optical or visible spectrum. The invention is effectively an efficient device which is mechanically stable and which may be operated at room temperature without complex vacuum or vapor pressure techniques. The invention as disclosed also is capable of tuning over a 5X10^11 cycles per second range and may handle high powers for practical optical radar and communications utilization. In addition, because it provides light which can be focused extremely precisely, the laser opens new possibilities in the investigation of basic properties of matter, as well as in medicine where objects or very minute portions thereof can be selectively sterilized or vaporized.",
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
