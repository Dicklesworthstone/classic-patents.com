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

const FIGURE_ROOT = "/patents/figures/us-3353115-maiman-ruby-laser";

const FIGURE_DIMENSIONS: Record<number, { width: number; height: number }> = {
  1: { width: 1720, height: 1020 },
  2: { width: 1720, height: 500 },
  3: { width: 1720, height: 680 },
  4: { width: 1720, height: 650 },
  5: { width: 1720, height: 450 },
  6: { width: 1720, height: 490 },
  7: { width: 1720, height: 580 },
  8: { width: 1720, height: 750 },
  9: { width: 1720, height: 700 },
  10: { width: 900, height: 650 },
  11: { width: 900, height: 650 },
  12: { width: 1720, height: 620 },
  13: { width: 1720, height: 620 },
  14: { width: 1720, height: 350 },
  15: { width: 1720, height: 560 },
  16: { width: 1720, height: 650 },
  17: { width: 1720, height: 550 },
  18: { width: 1800, height: 900 },
};

const figure = (number: number, refText = `FIG. ${number}`): CuratedSpecificationInline => {
  const dims = FIGURE_DIMENSIONS[number] ?? { width: 1720, height: 800 };
  return {
    kind: "reference",
    text: refText,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Source crop of ${refText} from US 3,353,115`,
    figurePreviews: [
      {
        src: `${FIGURE_ROOT}/fig-${number}-source-crop-v1.png`,
        alt: `${refText}, source drawing crop from US 3,353,115`,
        width: dims.width,
        height: dims.height,
      },
    ],
  };
};

const p = (...inlines: (string | CuratedSpecificationInline)[]) => ({
  kind: "paragraph" as const,
  inlines: inlines.map((i) => (typeof i === "string" ? text(i) : i)),
});

export const maimanRubyLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  8: [
    "The continuation statement identifies this grant as a continuation of the 1961 application Serial No. 102,698, Laser Systems, filed April 13, 1961.",
  ],
  9: [
    "Maiman defines the field of invention: generating and amplifying coherent electromagnetic radiation in the optical spectrum using solid-state stimulated emission.",
  ],
  10: [
    "The opening explains the technological significance of coherent light: waves propagating in phase allow immense energy concentration at a single optical frequency for communications and precise metrology.",
  ],
  11: [
    "The specification contrasts optical wavelengths with microwave cavities: scaling microwave resonators down to optical wavelengths is physically impossible, while multimode oversized cavities degrade coherence.",
  ],
  12: [
    "Maiman analyzes Schawlow and Townes's prior gas-discharge optical maser proposal (US Patent 2,929,922), noting the difficulty of vapor pressure maintenance and low gain.",
  ],
  13: [
    "The gas-laser model suffered from severe atomic density limitations, critical vapor control, narrow tuning, and extreme cavity tolerance requirements that prevented high-power operation.",
  ],
  14: [
    "Maiman articulates the primary engineering objects: a mechanically robust, high-efficiency, solid-state laser capable of room-temperature operation, wide tunability, and pulsed high peak power.",
  ],
  15: [
    "The invention achieves these objects by employing a solid-state negative-temperature dielectric crystal, specifically chromium-doped ruby.",
  ],
  16: [
    "The core embodiment uses a cylindrical ruby rod positioned coaxially inside a helical xenon flashlamp, with reflective end coatings forming an optical resonant cavity and an output aperture extracting a parallel beam.",
  ],
  17: [
    "The specification introduces the eighteen drawings illustrating energy-level diagrams, flashlamp coupling geometries, cooling arrangements, internal reflection suppression, Fabry-Perot cavities, and the Colidar optical radar system.",
  ],
  18: [
    "Maiman introduces the two-level quantum interaction model governed by Planck's relation, showing that thermal equilibrium yields net absorption rather than stimulated emission.",
  ],
  19: [
    "A third higher-energy state allows broadband optical pumping to overcome thermal distribution, establishing a population inversion when relaxation kinetics favor the intermediate metastable level.",
  ],
  20: [
    "The quantum transition corresponds to deep red visible light (694.3 nm), allowing solid-state crystals to operate directly in the optical frequency domain.",
  ],
  21: [
    "Figure 1 illustrates the three-level scheme: ground state Level 1, discrete metastable Level 2, and broadband absorption Region 3.",
  ],
  22: [
    "Non-radiative phonon relaxation rapidly transfers excited chromium ions from Region 3 into metastable Level 2, accumulating population until N2 exceeds N1.",
  ],
  23: [
    "Figure 2 illustrates the physical mechanism in ruby rod 10: broadband flash excitation pumps the ions, stimulated transitions trigger photon avalanches, and axial reflection produces coherent output beam 16.",
  ],
  24: [
    "Figure 3 shows solar optical pumping using concentrating lenses and mirrors to focus sunlight into the active laser crystal.",
  ],
  25: [
    "Figure 4 details the helical flash tube embodiment: quartz envelope 28 surrounds ruby rod 26 inside an outer reflective cylinder 38 with output opening 32.",
  ],
  26: [
    "Figure 5 details a coaxial gas-discharge pump configuration where annular flash discharge directly encloses the active laser crystal.",
  ],
  27: [
    "Figure 6 and Figure 7 introduce fluorescent liquid converter jackets (fluorescein), shifting broadband blue-white flash spectrum into the green absorption band of ruby.",
  ],
  28: [
    "Figure 8 illustrates an inverted hollow-cylinder ruby geometry with internal flash tube and surrounding high-index coolant jacket.",
  ],
  29: [
    "Figure 9 details cryogenic cooling with liquid nitrogen in Dewar flask 92, conductively connected to ruby rod 78 for narrowed spectral linewidth and enhanced thermal transfer.",
  ],
  30: [
    "Figures 10 and 11 address off-axis parasitic modes, using absorptive surface coatings to attenuate non-parallel rays.",
  ],
  31: [
    "Figure 12 illustrates index-matched immersion fluids (diiodomethane) to suppress internal reflection while cooling the crystal.",
  ],
  32: [
    "Figure 13 illustrates an interferometer resonator system with roof prisms that define a closed optical path.",
  ],
  33: [
    "Figures 14 and 15 detail external Fabry-Perot interferometer cavities that discriminate against off-axis rays and couple out the coherent beam.",
  ],
  34: [
    "Figures 16 and 17 illustrate remote parabolic and elliptical optical pump cavities that focus light into the active rod.",
  ],
  35: [
    "Figure 18 details the complete Colidar (Coherent Light Detection and Ranging) optical radar system, synchronizing pulsed laser transmission with dual-trace oscilloscopic timing.",
  ],
  37: [
    "Maiman summarizes the foundational advantages of solid-state lasers: high peak optical power, mechanical stability, non-critical room-temperature operation, and applications in radar, communications, materials processing, and surgery.",
  ],
  41: [
    "The formal claims define the protected patent boundaries for three-level ruby lasers, broadband optical pumping, radiationless decay, population inversion, and resonant cavity feedback.",
  ],
  42: [
    "The references cited record the prior art background, including Schawlow & Townes (US Patent 2,929,922) and early physical publications.",
  ],
  43: [
    "The cited publications include the foundational 1958 Townes paper in Physical Review and Wieder's 1959 solid-state optical source study.",
  ],
  44: ["Townes et al. and Wieder are formally cited in the specification record."],
  45: [
    "Primary Examiner Jewell H. Pedersen and Examiner Ronald L. Wilbert close the official examination record.",
  ],
  46: [
    "The formal signature block records inventor Theodore H. Maiman and patent attorney Daniel T. Chubb.",
  ],
};

export const maimanRubyLaserArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
  preparedBy: "Classic Patents editorial team (full-facsimile review completed)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "3,353,115",
        "Patented Nov. 14, 1967",
        "RUBY LASER SYSTEMS",
        "Theodore H. Maiman, Los Angeles, Calif., assignor to Hughes Aircraft Company, Culver City, Calif., a corporation of Delaware",
        "Continuation of application Ser. No. 102,698, Apr. 13, 1961. This application Nov. 29, 1965, Ser. No. 516,830",
        "2 Claims. (Cl. 331—94.5)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "DRAWINGS",
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1–3",
      title: "5 Sheets—Sheet 1",
      description: [
        text(
          "Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. ",
        ),
        figure(1),
        text("; "),
        figure(2),
        text("; "),
        figure(3),
        text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb."),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 4–7",
      title: "5 Sheets—Sheet 2",
      description: [
        text(
          "Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. ",
        ),
        figure(4),
        text("; "),
        figure(5),
        text("; "),
        figure(6),
        text("; "),
        figure(7),
        text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb."),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 8–11",
      title: "5 Sheets—Sheet 3",
      description: [
        text(
          "Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. ",
        ),
        figure(8),
        text("; "),
        figure(9),
        text("; "),
        figure(10),
        text("; "),
        figure(11),
        text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb."),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 12–15",
      title: "5 Sheets—Sheet 4",
      description: [
        text(
          "Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. ",
        ),
        figure(12),
        text("; "),
        figure(13),
        text("; "),
        figure(14),
        text("; "),
        figure(15),
        text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb."),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 16–18",
      title: "5 Sheets—Sheet 5",
      description: [
        text(
          "Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. ",
        ),
        figure(16),
        text("; "),
        figure(17),
        text("; "),
        figure(18),
        text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb."),
      ],
    },
    { kind: "heading", level: 2, text: "SPECIFICATION" },
    p(
      "This application is a continuation of my copending application Ser. No, 102,698 entitled, Laser Systems, filed Apr. 13, 1961, now abandoned.",
    ),
    p(
      "This invention relates to the generation, amplification, and utilization of electromagnetic waves in the infrared, visible and ultraviolet portion of the spectrum, and more specifically to lasers and laser systems. A ",
      term(
        "laser",
        "The source's acronym for light amplification by stimulated emission of radiation, denoting a device providing coherent optical generation or amplification.",
      ),
      ", the term being an acronym for light amplification by stimulated emission of radiation, is a device capable of generating or amplifying coherent light. The principle of operation is similar to that of a maser and is therefore also referred to as an optical maser.",
    ),
    p(
      "Much effort has been expended in the fields of electronics and physics in attempts to generate or amplify coherent light. Such an achievement, it was known, would make available a vast new region of the electromagnetic spectrum for a multitude of purposes including communications and metrology (measurements) applications. Such coherent light would have the properties of being monochromatic and of having its component waves propagating in phase with each other. Thus, as at radio or microwave frequencies, a great deal of energy could be concentrated at or extremely near to a single frequency and be utilized in methods analogous to those at radio frequencies.",
    ),
    p(
      "Ordinary techniques of generating or amplifying electromagnetic waves, including microwave maser techniques, cannot be extended usefully into the optical frequencies because such techniques require components, such as maser cavities, for supporting wave oscillations which must have physical dimensions of the order of a wavelength. Obviously, such components can neither be manufactured nor meaningfully utilized at optical frequencies where the wavelengths are of the order of atomic dimensions. When it is attempted to use cavities which have dimensions corresponding to a large number of wavelengths, many modes are supported, coherence is degraded, and impracticably large sources of pumping power are required.",
    ),
    p(
      "A laser has been proposed by Schawlow and Townes, see United States Patent No. 2,929,922, issued March 22, 1960, which suggests using as the negative temperature medium certain gaseous state materials such as alkali metal vapors. Such materials may be shown to have energy levels in their atomic systems corresponding to appropriate optical frequencies for absorbing optical pump energy to invert the population from the stable equilibrium state and thus provide the material with what is known as a negative temperature or excited, nonequilibrium state. Then by stimulation or spontaneous relaxation the atomic system falls back to its normal equilibrium state by one or more steps emitting energy of certain optical frequencies.",
    ),
    p(
      "Such proposed gaseous state devices are of great interest as theoretical models and represent significant academic advances, however, they have not been shown to provide a net generation or amplification of light. In addition, the structure of gaseous state systems is complex and requires the maintenance of critical vapor pressures and temperatures. Impurities in the gas is another very serious problem. The inter-atomic spacing of the gas severely limits the efficiency of coupling between the stimulated emission and a coherent wave propagating through the medium. In addition, the frequency of operation of any given gas laser may be effectively tuned only by Stark or Zeeman effects which can provide a tuning range of only approximately 5X10^10 cycles per second. Further, the construction of a gas cell is extremely critical in that the end plates must be highly reflective and perfectly parallel so that the many reflections required because of the low density gaseous material will be accomplished.",
    ),
    p(
      "It is therefore an object of the present invention to provide an operable, low noise, efficient laser. It is another object to provide a laser which is mechanically stable and of noncritical construction. It is another object to provide a laser which operates at room temperature or cryogenic temperatures for additional simplicity and even greater flexibility in design parameters. It is another object to provide a laser which does not require critical vacuum or vapor pressure techniques and which operates in a medium of high dielectric constant. It is another object to provide a laser capable of much higher power handling. It is another object to provide a laser which is tunable over approximately a 5X10^11 cycles per second range. It is another object to provide an optical radar system utilizing the advantages of a laser.",
    ),
    p(
      "Briefly, these and other objects are achieved in accordance with the present invention in a system including a solid state negative temperature medium.",
    ),
    p(
      "In one example a segment of solid state active laser material such as a cylindrical ruby (Al2O3 doped with Cr2O3) rod with reflecting coating at each end is coaxially placed in a helical flash lamp. White light or, predominantly, the green and blue components thereof, is absorbed by the ruby; and red light is emitted therefrom and coupled out of the system through a hole in the reflective coating at one end of the rod. The reflecting coatings provide a regeneration related to the coupling between the reflecting wave, traveling back and forth many times, and the emitting atoms. In other words, a resonating, standing wave is provided which derives energy from the negative temperature dielectric. Thus the rod may be considered as a resonator having different Q's for different modes of oscillation. The mode having the highest Q corresponds to waves traveling nearly parallel to the rod axis since it supplies the highest degree of regeneration. This effect causes the output to be an extremely parallel beam so that it propagates immense distances without spreading. Inherent in the regeneration process is the coherent amplification of an extremely narrow band of frequencies, thus providing a monochromatic output.",
    ),
    p(
      "Additional discussion of principles of operation, of further objects and advantages, including uses, and of other examples will be presented below in connection with a description of the accompanying drawings in which: ",
      figure(1),
      " is an energy level diagram for the atoms of a substance exhibiting laser properties; ",
      figure(2),
      " is a schematic diagram illustrating optical pumping of negative temperature laser material; ",
      figure(3),
      " is a schematic diagram of means for optically pumping the laser material with sunlight energy; ",
      figure(4),
      " is a schematic diagram of one embodiment which utilizes a helical gas-filled flash tube; ",
      figure(5),
      " is a diagram of an alternative embodiment utilizing a hollow gas-filled cylinder; ",
      figure(6),
      " is another embodiment utilizing a hollow cylindrical gas-filled optical pumping means separated from active material by a fluorescent material; ",
      figure(7),
      " is an energy level diagram illustrating the method of operation of the embodiment of ",
      figure(6),
      "; ",
      figure(8),
      " is a schematic diagram of an embodiment in which active laser material is a hollow cylinder surrounding a cylindrical gas-filled flash tube, the entire assembly being surrounded by a second hollow cylinder of coolant of a high index of refraction; ",
      figure(9),
      " is a cut-away view of an embodiment in which the laser material is refrigerated; ",
      figure(10),
      " is a diagram of a segment of laser material; ",
      figure(11),
      " is a diagram of a coated segment of laser material; ",
      figure(12),
      " is a diagram of a segment of laser material which is surrounded by a coolant having a high index of refraction; ",
      figure(13),
      " is a schematic diagram of a portion of a laser system illustrating the use of an interferometer; ",
      figure(14, "FIGS. 14"),
      " and ",
      figure(15, "15"),
      " are schematic diagrams illustrating additional types of interferometers; ",
      figure(16, "FIGS. 16"),
      " and ",
      figure(17, "17"),
      " are diagrams of a laser system in which the optical pump utilizes an exploding wire; and ",
      figure(18),
      " is a schematic diagram of a practical colidar system utilizing a laser.",
    ),
    p(
      "The laser to be herein below described utilizes the interaction of electromagnetic wave energy with atoms of an active material. In the classical model of the atom, electrons may occupy only certain discrete energy levels. If an atom in a lower energy level E1 absorbs an amount of energy E2 - E1 = h nu, it is excited to a higher energy level E2. Conversely, an atom in an upper energy level E2 can relax to the lower level E1 with the emission of a photon of energy h nu = E2 - E1. In thermal equilibrium, the population of the energy levels is governed by the Boltzmann distribution, and the lower state is more populated than the higher state. When electromagnetic radiation of frequency nu = (E2 - E1)/h is passed through the substance, stimulated absorption and stimulated emission occur simultaneously. Because the lower state population N1 exceeds the upper state population N2 under normal thermal equilibrium, stimulated absorption dominates and the net effect is attenuation of the light wave.",
    ),
    p(
      "In a substance with a third energy level E3 higher than either of the other two levels, atoms may be pumped from level E1 to level E3 by electromagnetic wave energy of frequency nu_p = (E3 - E1)/h. If the relaxation from level E3 to level E2 is rapid and radiationless, the energy is transferred without the emission of radiation at the pump frequency. If the relaxation time from level E2 back to ground state E1 is sufficiently long, atoms accumulate in level E2. When the pumping rate is sufficiently intense, the population N2 of the intermediate level exceeds the population N1 of the ground state, establishing a ",
      term(
        "population inversion",
        "The non-equilibrium quantum condition where the population density of an upper energy level exceeds that of a lower energy level, enabling net stimulated emission amplification.",
      ),
      " between level E2 and level E1 ($N_2 > N_1$). Under these inverted conditions, stimulated emission exceeds absorption, and an incident optical wave of frequency $\\nu = (E_2 - E_1)/h$ stimulates coherent photon avalanches, producing net optical amplification.",
    ),
    p(
      "Visible light covers the electromagnetic spectrum approximately 4X10^14 cycles per second to 7.5X10^14 cycles per second. The energy levels in a solid state crystal such as ruby are particularly suited for laser operation in this region. Referring specifically to ",
      figure(1),
      ", an energy level diagram is illustrated for ruby (single crystal aluminum oxide Al2O3 doped with chromium oxide Cr2O3). The ground state is designated Level 1, the discrete metastable intermediate state is designated Level 2, and the broad absorption band is designated Region 3.",
    ),
    p(
      "Because of the broadness of Region 3, chromium doping atoms absorb pump light over a broad band centered in the green (around 5600 Angstroms) and in the violet (around 4150 Angstroms). Excited atoms in Region 3 undergo rapid non-radiative relaxation to metastable Level 2 via phonon interactions with the crystal lattice. Because Level 2 is a relatively long-lived metastable state (lifetime of approximately 3 milliseconds at room temperature), a high density of excited atoms accumulates in Level 2. When the optical pumping intensity exceeds the threshold value where more than half of the total chromium ions are excited out of the ground state, population inversion ($N_2 > N_1$) is achieved, and stimulated emission of deep red monochromatic light at 6943 Angstroms (frequency approximately 4.32X10^14 cycles per second) takes place.",
    ),
    p(
      "Referring to ",
      figure(2),
      ", there is shown a schematic representation of the mechanism of optical pumping and laser generation. Active ruby rod 10 is illuminated by broadband optical pump source 12. Pumping light 14 excites atoms into Region 3, rapid radiationless transfer populates Level 2, and coherent monochromatic output beam 16 is extracted from the resonator.",
    ),
    p(
      figure(3),
      " illustrates an embodiment in which sunlight concentrated by lens 18 and redirected by mirror 24 optically pumps active laser material 22 to generate coherent beam 20.",
    ),
    p(
      "Referring to ",
      figure(4),
      ", an embodiment of the invention is shown in which an active ruby rod 26 is positioned coaxially within a helical xenon flash tube 28. The ends of the ruby rod are optically polished flat and parallel. One end has a highly reflective silver coating 30, and the opposite end has a reflective coating with a central nonreflective aperture 32 for extracting coherent monochromatic beam 34. A power supply 36 supplies pulsed electrical discharge energy to flash tube 28. A cylindrical outer reflector 38 encloses the assembly, redirecting pump light back through the rod for high coupling efficiency.",
    ),
    p(
      "Referring to ",
      figure(5),
      ", a rod of active laser material 40 is coaxially surrounded by an annular hollow gas-filled discharge cylinder 50 filled with gas 52 and energized by electrodes 54 and 56 from power supply 58.",
    ),
    p(
      figure(6),
      " illustrates an embodiment in which active laser rod 60 is surrounded by flash tube 62 and an intermediate liquid filter jacket containing fluorescent material 64 such as fluorescein. As illustrated in the energy diagram of ",
      figure(7),
      ", white light 66 from the flash lamp excites the fluorescein, which re-emits green light matching absorption Region 3 of the ruby, increasing optical pumping efficiency and reducing ultraviolet solarization.",
    ),
    p(
      figure(8),
      " illustrates an embodiment in which active laser material 70 is formed as a hollow cylinder coaxially surrounding cylindrical flash tube 72, with the entire assembly surrounded by coolant cylinder 74 containing high-index coolant 76.",
    ),
    p(
      figure(9),
      " illustrates a refrigerated laser system wherein ruby rod 78 is thermally coupled via conductive rod 88 to liquid nitrogen in Dewar flask 92, energized by flash tube 94 and power supply 100 with coolant 102.",
    ),
    p(
      figure(10),
      " illustrates schematically a segment of laser material 104 in air to show ray reflections. Axial ray 106 travels parallel to the axis without reflecting from the cylindrical sidewalls. Nonparallel rays 108 and 112 undergo internal reflection, lengthening the effective optical path and degrading spatial coherence. To suppress these off-axis modes, ",
      figure(11),
      " shows an absorptive cladding 124 surrounding active core 114 to attenuate nonparallel rays.",
    ),
    p(
      figure(12),
      " illustrates an alternative method of mode suppression wherein active laser rod 126 is immersed in high-index coolant fluid 130 within jacket 128. Fluid 130 has a refractive index closely matching the index of ruby (n approximately 1.76), allowing nonparallel rays to escape into the coolant while simultaneously dissipating heat and stabilizing operating temperature.",
    ),
    p(
      figure(13),
      " illustrates an interferometer resonator system in which active laser segment 132 is placed within an optical cavity formed by external roof prisms 138 and 140. Monochromatic coherent beam 136 is extracted through aperture 134.",
    ),
    p(
      figure(14),
      " and ",
      figure(15),
      " illustrate external Fabry-Perot interferometer cavities. In ",
      figure(14),
      ", uncoated laser rod 160 is bounded by external parallel plates 162 and 164 with output opening 170, discriminating against off-axis rays 166 and 168. In ",
      figure(15),
      ", reflective plate 172 is disposed on rod 174 while plate 176 is spaced from the rod to decouple nonparallel ray 178 from output beam 180.",
    ),
    p(
      figure(16, "FIGS. 16"),
      " and ",
      figure(17, "17"),
      " illustrate remote optical pumping configurations. In ",
      figure(16),
      ", facing parabolic reflectors 189 and 190 focus light from source 184 into laser rod 182 to produce beam 186. In ",
      figure(17),
      ", elliptical reflector 192 positions pump source 184 at one focus and laser rod 182 at the conjugate focus. Pumping light source 184 may be an exploding wire, a xenon flash tube, or a carbon arc lamp.",
    ),
    p(
      "Referring to ",
      figure(18),
      ", there is illustrated a practical application of the laser in a ",
      term(
        "Colidar",
        "Coherent Light Detection and Ranging (optical radar), utilizing high-intensity pulsed laser beams for precision target rangefinding and tracking.",
      ),
      " (coherent light detection and ranging) optical radar system. Laser transmitter 200 includes active ruby segment 202, flash tube 204, and pump power supply 206 triggered by synchronizer 208. Transmitted pulse 210 is directed toward target 212 while a sample is detected by photoelectric cell 218 and displayed as transmitter pulse 220 on oscillograph 214. Reflected pulse 210' is collected by receiver 222 via parabolic reflector 224 onto photodetector 226 and displayed as receiver pulse 228 on oscillograph 216. The time difference between pulses 220 and 228 directly determines the range to target 212. Optical filters 230 reject ambient background light and jamming.",
    ),
    p(
      "There has thus been disclosed a laser system in which the active laser substance is solid state and which provides coherent monochromatic amplification and generation of electromagnetic wave energy in the optical or visible spectrum. The invention is effectively an efficient device which is mechanically stable and which may be operated at room temperature without complex vacuum or vapor pressure techniques. The invention as disclosed also is capable of tuning over a 5X10^11 cycles per second range and may handle high powers for practical optical radar and communications utilization. In addition, because it provides light which can be focused extremely precisely, the laser opens new possibilities in the investigation of basic properties of matter, as well as in medicine where objects or very minute portions thereof can be selectively sterilized or vaporized.",
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
    {
      kind: "heading",
      level: 2,
      text: "REFERENCES CITED",
    },
    p("UNITED STATES PATENTS"),
    p("2,929,922  Schawlow et al.  3/1960  331-94.5"),
    p("OTHER REFERENCES"),
    p(
      "Townes et al.: “Infrared and Optical Masers,” Physical Review, vol. 112, No. 6, Dec. 15, 1958, pp. 1940–1949. Wieder: “Solid State, High-Intensity Monochromatic Light Sources,” The Review of Scientific Instruments, vol. 30, No. 1, November 1959, pp. 995–996.",
    ),
    p("JEWELL H. PEDERSEN, Primary Examiner. RONALD L. WILBERT, Examiner."),
    p("THEODORE H. MAIMAN, Inventor. BY DANIEL T. CHUBB, ATTORNEY."),
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
