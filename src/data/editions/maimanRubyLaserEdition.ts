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

/**
 * Every active figure occurrence is deliberately previewed from its complete
 * primary drawing sheet. The legacy individual crops remain preserved on disk
 * as earlier editorial aids, but no longer stand in for the source sheet.
 */
const FIGURE_SOURCE_PDF_PAGE: Record<number, 1 | 2 | 3 | 4 | 5> = {
  1: 1,
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 3,
  11: 3,
  12: 4,
  13: 4,
  14: 4,
  15: 4,
  16: 5,
  17: 5,
  18: 5,
};

const SOURCE_SHEET_DIMENSIONS = { width: 2320, height: 3408 } as const;

const figure = (number: number, refText = `FIG. ${number}`): CuratedSpecificationInline => {
  const sourcePdfPage = FIGURE_SOURCE_PDF_PAGE[number];
  if (!sourcePdfPage) {
    throw new Error(`Maiman source sheet is not mapped for figure ${number}.`);
  }
  return {
    kind: "reference",
    text: refText,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Complete primary drawing sheet for ${refText} from US 3,353,115`,
    figurePreviews: [
      {
        src: `${FIGURE_ROOT}/sheet-${sourcePdfPage}-${String(sourcePdfPage).padStart(2, "0")}.png`,
        alt: `${refText}, complete primary drawing sheet ${sourcePdfPage} from US 3,353,115`,
        width: SOURCE_SHEET_DIMENSIONS.width,
        height: SOURCE_SHEET_DIMENSIONS.height,
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
  preparedBy: "Classic Patents editorial team (direct facsimile source-text reconciliation)",
  preparedAt: "2026-09-04",
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
      "The laser to be herein below described utilizes the interaction of electromagnetic radiation with a material having an appropriate set of discrete energy levels. Consider, for example, a pair of such levels with energies E₁ and E₂, where E₂ is greater than E₁. An electromagnetic wave of frequency ν₂₁ = (E₂ − E₁)/h, where h is Planck's constant, coupled to the system stimulates both absorption and emission. In other words, atoms in the lower level make transitions to the upper level, each absorbing energy E = hν₂₁ and similarly upper level atoms are stimulated downwardly, each of these giving up energy to the wave by radiating a like quantum of energy. The net absorption of the radiating wave interacting with the system is proportional to N₁ − N₂ where N₁ and N₂ are respectively the number of atoms in these two levels. Since in thermal equilibrium N₁ is greater than N₂ the indicated difference is positive and a wave propagating the length of the material is attenuated.",
    ),
    p(
      "In a substance with a third energy level E₃ higher than either of the other two levels, energy can be supplied to the system by a radiating wave of frequency ν₃₁ = (E₃ − E₁)/h. If other parameters, and, in particular, relaxation times, in the material are suitably related, an ",
      term(
        "inverted population",
        "The non-equilibrium condition in which the upper-state population exceeds the lower-state population, so stimulated emission can exceed absorption.",
      ),
      " will be produced such that N₂ is greater than N₁; then the net interaction with a radiating wave of frequency ν₂₁ is emission and the wave is amplified. Also, by providing a feedback mechanism oscillation can be produced.",
    ),
    p(
      "Visible light covers the electromagnetic spectrum approximately 4X10¹⁴ cycles per second, that is, red light to approximately 7.5X10¹⁴ cycles per second which is violet light. In substance as described above with energy levels such that ν₂₁ lies in this frequency range can therefore amplify or generate visible light. Referring specifically to ",
      figure(1),
      " an energy level diagram is illustrated for the atoms of a material such as Al₂O₃ which may exhibit laser action in accordance with the present invention. Level 1 may be considered the ground state corresponding to E₁ and region 3 in the relatively high energy state corresponding to E₃ which is actually a broadband of energy levels rather than a discrete energy level. The atoms, or ions, as the case may be, are excited or pumped from the level 1 to the region 3 by means of an optical pumping source having the energies or frequencies ν₃₁ corresponding to the difference between the energy of level 1 and those of the levels throughout region 3.",
    ),
    p(
      "Because of the broadness of region 3, doping atoms, which for example may be the chromium atoms, may accept pumping energy over a correspondingly broad band. The atoms thus excited may then decay from the region 3 back to the ground state or, alternatively, they may decay to level 2 corresponding to E₂ and thence to level 1. The latter course is definitely the favored one and the atoms in decaying to level 2 do not emit energy. In other words, it is a radiationless thermal type of transition which funnels the energy distributed in the broad region 3 into the very narrow region 2. The energy level 2 is in fact a single energy level, or may in the presence of a magnetic field be a doublet, and the atoms of this state of excitation will emit the correspondingly discrete frequency ν₂₁ corresponding to the difference between level 2 and level 1 that is E₂ − E₁ when they are appropriately stimulated or triggered to do so. Further, when an appropriate stimulation does occur, the atoms in the particular segment of laser material will fall together or emit their radiated energy coherently with each other and with the stimulating wave. Thus it may be seen that the mechanism is a funneling of energy from a broadband incoherent source into a discrete frequency that is monochromatic coherent radiation.",
    ),
    p(
      "Referring to ",
      figure(2),
      ', there is shown a schematic representation of the mechanism of optically pumping the atoms such as those of chromium in a ruby rod 10. A light pump 12 emits a high intensity "white" light or, in this example, it may be broadly green, toward the ruby rod 10. The broadband light thus radiated includes at least some light in the frequency range ν₃₁. This light is absorbed by the ruby rod and causes the doping atoms to be excited in the energy state represented by region 3 of the diagram of FIG. 1. This excitation is equivalent to an inversion of the population of the chromium atoms as discussed above. The excited atoms then relax by thermal processes down to the level 2 and may remain there until stimulated to fall to the level 1 thereby emitting the desired monochromatic light of frequency ν₂₁. This stimulation may be by an external source of radiation at frequency ν₂₁, or it may be triggered spontaneously as by optical noise. When the energy at frequency ν₂₁ is emitted from the atoms in the ruby rod 10 it causes a wave to propagate through the rod and if the wave is parallel to the axis it may reflect repeatedly from the ends of the rod. If the rod is of an appropriate length a standing wave 14 may be set up. In either event the repeated reflections through the material stimulate the emission of substantially all the atoms from level 2 to their ground state level 1. The emission of the energy at frequency ν₂₁ combines in phase with the stimulating wave 14 thus adding coherently with it. This energy may then be coupled out of the rod as a beam 16 which is monochromatic at frequency ν₂₁ and which is traveling or propagating in a direction parallel to the axis of the ruby rod 10.',
    ),
    p(
      figure(3),
      ' illustrates an example of the invention in which the light pump 12 of FIG. 2 is the sun or some other source of parallel "white" light. The lens 18 focuses the light so that it is of relatively high intensity in a region 20 where an element of active laser material 22 is disposed. An auxiliary mirror 24 may further intensify the light in the region of the laser material. The mirror 24 may be a spherical reflector which merely sends the unabsorbed pumping light back through the focal point of the lens 18 and thence through the laser material 22 a second time.',
    ),
    p(
      "Referring to ",
      figure(4),
      ", an embodiment of the invention is shown in which an active laser rod 26 is disposed coaxially within a helical gas-filled flash tube 28. The ends of the rod 26 may be suitably plated as by a partial coating of silver in order to provide the repetitive reflections of the monochromatic emitted light. The system of stimulation is so efficient that a plating 26 which will provide approximately 10 percent reflection is adequate. One end of the rod 30 has a nonreflective opening 32 in the end plating to provide unobstructed passage of the coherent monochromatic beam 34 as shown. A power supply 36 provides the flashing energy for the tube 28. An outer enclosing cylinder 38 is provided which has a very highly reflecting inner surface for reflecting the pumping energy repeatedly through the rod 26 for improved efficiency of the system as compared with operation when the light energy of the tube 28 is permitted to radiate indefinitely in all directions causing only a fraction of its energy to pass through the rod 26.",
    ),
    p(
      "Referring to ",
      figure(5),
      ', a rod of active laser material 40 is shown which again has reflectively coated ends 42, 44 with an opening 46 in the plating 44 to permit passage of the laser output beam 48. The light pump in this example is a hollow cylinder 50 which is coaxially disposed about the rod 42 with the radial space therebetween being filled with a flashing gas 52. Appropriate electrodes 54 and 56 at opposite ends of the cylinder 50 are energized by a power supply 58 to cause the gas 52 to emit high intensity "white" light when desired. Again, the inner surface of the cylinder 50 is highly reflective for added efficiency of the light pump mechanism.',
    ),
    p(
      figure(6),
      ' illustrates an embodiment of the invention in which a rod 60 of active laser material similar to rods 26 and 42 is disposed coaxially within a hollow flash tube 62. The radial space between the rod 60 and the flash tube 62 is filled with a fluorescent material 64, such as fluorescein. The fluorescent material efficiently absorbs the "white" light emitted by the flash tube 62 and re-emits predominantly green light which is more efficiently absorbed by the laser rod 60. Thus, as illustrated in ',
      figure(7),
      ', the broadband "white" light 66 is directed into the fluorescein which re-emits incoherent green light predominantly in the region 3 of the material discussed in connection with the description of FIG. 1. Thus the fluorescein effectively funnels the "white" light into green light which energy is further funneled and subsequently emitted as a single frequency or monochromatic light by the laser material, as indicated by the heavy vector 68 between level 2 and level 1 of FIG. 7. Again in FIG. 6 the inner surface of the cylinder surrounding the tube 62 may be highly polished for even greater efficiency of pumping.',
    ),
    p(
      figure(8, "Referring to FIG. 8"),
      ", there is illustrated an example of the invention in which the active laser material is in the form of a hollow cylinder 70 within which is coaxially disposed a cylindrical flash tube 72. Thus when the flash tube is energized, substantially all of its pumping radiation is emitted in a radial direction and must therefore pass through the laser material. The laser material 70 is in turn coaxially surrounded by a cylinder 74 filled with a coolant 76. The coolant 76 may be chosen to have a high index of refraction for the advantages and purposes discussed below. Cylinder 74 may have a highly polished internal surface for reflecting energy of the flash tube 72 back through the laser material 70.",
    ),
    p(
      figure(9, "Referring to FIG. 9"),
      ", an embodiment of the invention is shown in which the laser material is refrigerated to liquid nitrogen temperatures for the purpose of making its output beam even more purely monochromatic because the line width of the laser transition (frequency ν₂₁) is much sharper in most solids at low temperature. A rod 78 of active laser material has plated ends 80 and 82 with a coupling hole 84 in the upper end for emitting the laser beam 86. The opposite end of the rod is mounted on a thermally conductive rod 88 which may be of copper or sapphire. The major portion of the rod 88 is immersed in liquid nitrogen 90 within a Dewar flask 92. A hollow cylindrical flash tube 94 is disposed coaxially about the laser rod 78 and is energized from a power supply 96 through a set of annular electrodes 98 disposed at opposite ends of the gas tube 94. A further hollow cylinder is disposed coaxially about the flash tube 94 and is filled with a coolant 102 to cool the flash tube 94.",
    ),
    p(
      figure(10),
      " illustrates schematically a segment of laser material 104 for purposes of illustrating internal reflections of the stimulating wave when the segment is not coated but is merely surrounded by material of a low index of refraction, such as air. A ray of energy 106 is shown as propagating parallel with the axis of the rod and therefore never reflects against the side of the segment 104. A ray 108, however, has a radial component of direction and reflects, as shown, off the side boundary of the segment 104. Such reflections cause two deleterious effects. One is that the effective length of the resonating segment is greater than that for an axially traveling ray such as 106. Thus the ray 108 may represent a component of energy at a frequency slightly different from the desired or designed frequency of operation. Secondly, the ray 108, if it finds its way out of the coupling hole 110 of the segment 104, will cause a spreading of the beam thereby detracting from the otherwise extremely narrow beam of the laser and contributing to its noncoherence. A ray 112 propagating in a direction even further removed from that of the axis of the segment may obviously reverberate substantially endlessly through the segment causing by its interference with the desired energy a decrease in the coherence and narrowness of bandwidth of the laser output. To minimize the deleterious effects of the rays 108 and 112 of FIG. 10 a coating 114 may be applied to an active laser segment 116 as illustrated in ",
      figure(11),
      ". The coating 114 may be chosen to be transparent to the pumping energy but highly absorptive of the frequency of light energy near to that of the desired laser output frequency so that rays 118 and 120 which are not parallel to the axis 122 of the segment are absorbed at the boundary by the coating 114 and hence do not degrade the desired characteristics of the output beam 124.",
    ),
    p(
      figure(12),
      " illustrates an alternative system for minimizing the deleterious effects due to the reverberation of nonparallel rays of the active laser segment 126. The segment is shown surrounded by a coolant material 128 having a high index of refraction in immediate contact with the surface of the segment 126. Again an axially directed ray 130 which is propagated back and forth along the length of the segment 126 can ultimately be coupled out of the segment resonator as a portion of the laser output beam. Nonparallel rays 132, 134 strike the side boundaries of the segment 126 and tend to be transmitted through the material of high index of refraction where they would otherwise be reflected by the boundary surface with a material such as air. The prime reason for this is that the critical angle between the rays 132, 134 incident upon the boundary is increased in proportion to the ratio of n₁ to n₂ where n₁ is the index of refraction of the material beyond the boundary. The critical angle is defined as that angle between the incident ray and a line normal to the boundary at which substantially all the energy transmits the boundary instead of being reflected by it. It is highly desirable that the critical angle be as large as possible so as to minimize the energy which is reflected by the boundary. In other words, it is desired to transmit the nonparallel rays 132, 134 out of the laser material where they may be dissipated without interfering with the laser regeneration mechanism and the output beam 130. It is apparent that if n₁ is as large as n₂ the critical angle would be 90° and, optically speaking, there would be no boundary, so that even energy grazing the surface would be transmitted therethrough. A practical example of a material having a suitably high index of refraction, as well as being an effective coolant, is diiodomethane which has an index of refraction of 1.75 which compares to the index of refraction of ruby which is approximately 1.76. It is useful to provide a coolant for the active laser material in order to control its frequency of operation since the magnitude of the energy level 2 in a solid state substance is dependent upon temperature. This need not be a disadvantage since it affords a highly useful means for tuning the device over a relatively broad range, that is, approximately 5X10¹¹ cycles per second. However, it is important in many applications for the frequency to be controlled and constant by controlling or maintaining constant the temperature of the active substance. To this end, the active segment may be cooled and the heat energy of the pump removed by flowing appropriate coolants over their surfaces.",
    ),
    p(
      figure(13),
      ' illustrates a system in accordance with the present invention which utilizes an interferometer for providing even greater coherence and narrow bandwidth. In this embodiment a rod 136 of active laser material does not have coated ends but rather has prisms 138 and 140 coupled to each end of the rod 136. An additional pair of mirrors or prisms 142 and 144 are disposed so that a ray of light 146 which is axially directed through the rod 136 may propagate along the closed path determined by the reflecting surfaces of the 4 mirrors. Disposed between the mirrors 142 and 144 is an interferometer 148 which may be a Fabry-Perot interferometer. The interferometer comprises a pair of parallel plates 150 and 152, the distance between which may be adjusted to "tune" the regenerative circuit for the ray 146. Thus a ray of the proper wavelength will resonate between the parallel plates 150, 152 while waves of other frequencies will be dissipated and lost in the interferometer. The circuit defined by the reflective prisms and the interferometer is practically non-negotiable for rays of light which are not propagating exactly parallel to the axis of the rod 136. Nonparallel rays 154 and 156 in the figure illustrates how their energy is lost from the system because their direction precludes their traversal of the circuit past the first reflective prisms. Furthermore, even if a ray was almost parallel to the axis of the rod 136 it would not make a large number of traversals around the circuit before it would become lost from the edge of one of the prisms. Also the coupling through the interferometer may be made highly directive to further discriminate against waves which are not propagating in exactly the desired direction. As shown by rays 154 and 156 emanating from the interferometer, waves which are not propagated in the proper direction are lost out the sides of the interferometer and thereby removed from the system. The laser output beam 158 may be coupled out of the system in any appropriate manner such as for example by an appropriate discontinuity in the reflective face of the prism 140.',
    ),
    p(
      figure(14),
      " illustrates another type of interferometer in which the active laser segment 160 does not have reflective ends. Instead, mutually parallel plates 162 and 164 are disposed perpendicularly to the axis of the segment 160 which is the desired direction of propagation. The plates may be disposed at some distance from the laser material; the greater the distance and the smaller their size the more the system discriminates against nonparallel light rays 166 and 168. Again the desired energy may be coupled out of the system through a small opening in the reflective plate 164 to provide a laser output beam 170. ",
      figure(15),
      " illustrates the use of an interferometer similar in some respects to the device of ",
      figure(14),
      ". In ",
      figure(15),
      ", this example one of the reflective plates 172 may be placed directly on the active laser segment 174 while the other reflective plate 176 may be axially disposed at some distance from the segment 174. As shown, the nonparallel ray 178 will not be re-reflected between the two reflective plates 172 and 176 thereby minimizing its deleterious effects on the monochromatic output beam 180.",
    ),
    p(
      figure(16, "FIGS. 16"),
      " and ",
      figure(17, "17"),
      " illustrate methods of optically pumping the active laser segment 182 by a source 184 of broadband light which is disposed some distance from the laser segment. In each case the output beam 186 of the laser is directed out of the rod-shaped laser segment in a direction parallel to the axis of the rod. In ",
      figure(16),
      " two parabolic reflectors 189 and 190 are directed toward each other so that the light source 184 at the focal point of reflector 189 emits a substantially parallel beam of pumping light 188 which is collected by the parabolic reflector 190 and focused to pass through the laser segment 182. The parabolic surfaces 189 and 190 may be parabolic cylindrical surfaces as shown or they may be paraboloidal surfaces of revolution symmetrically disposed about the line joining their respective foci. ",
      figure(17),
      ' illustrates an elliptical system for reflecting the energy from the light source 184 to the laser segment 182 wherein the source 184 is disposed at one focus of an ellipse while the laser segment 182 is disposed at the opposite focus; hence, the elliptical surface 192 reflects substantially all of the energy radiating from the source 184 and refocuses it through the laser segment 182. The elliptical surface 192 may be an elliptical cylindrical surface or it may be an ellipsoid. The light source 184 in either of the above examples may make use of exploding wire phenomena in which an extremely high current at low voltage is sent through a wire thereby exploding and vaporizing it. The light energy emitted by this phenomena may be extremely intense "white" light. Alternatively, the source 184 may be other conventional light sources such as gas-filled flash tubes, or carbon arc lamps. An advantage of the systems depicted in FIGS. 16 and 17 is that the light source and the active laser material may be independently handled and cooled due to their spacing from each other.',
    ),
    p(
      "Referring to ",
      figure(18),
      ", there is illustrated a practical application of a laser in a ",
      term(
        "colidar",
        "The specification's acronym for coherent light ranging: an optical radar arrangement using a pulsed laser and return-time measurement.",
      ),
      ' optical radar system. "Colidar" is an acronym for coherent light ranging. A laser unit 200 is the colidar transmitter and includes an active laser segment 202. Surrounding the segment 202 is a gas-filled flash tube 204 which is pulsed from a pump power supply 206. A synchronizer 208 triggers the pump power supply which in turn fires the flash tube 204 and the laser 200 transmits a beam 210 of monochromatic coherent light toward a target 212, the range to which is to be determined. The synchronizer trigger also triggers the horizontal sweeps of a pair of oscillographs 214 and 216. A sample of the laser output is determined by a photoelectric cell 218 which is coupled to the oscillograph 214 and presented on the face thereof as a "transmitter" pulse 220 to indicate the time at which the laser output pulse was transmitted. The laser beam 210 is reflected off a target 212 and a minute portion thereof is received as a parallel beam 210\' by the colidar receiver 222. The received beam 210 impinges upon a parabolic reflector 224 and is focused into a photoelectric cell 226. The electrical cell of the photoelectric cell 226 is coupled to the receiver oscillograph 216 where it is presented on the face thereof as a "receiver" pulse 228. The time difference between the pulses 220 and 228 on the two oscillographs is, of course, a direct indication of the range from the colidar system to the target 212. The two oscillographs 214 and 216 may alternatively be a dual trace, single oscillograph tube or, as in conventional radar "B-scope" presentation, be displayed with a single horizontal trace. The advantages of such a ranging system which may obviously be extended to other forms of radar, such as plan position indicator types, include the fact that the transmitted beam is extremely narrow and may be sent over great distances with very little beam spreading. Also the wavelength is so small that extremely high resolution is obtained. It may also be seen that it is substantially impossible to jam a laser radar system because the jamming equipment would have to be placed precisely in line with the transmitter and the target would have to be directed at the receiver and would have to be at precisely the proper optical frequency in order to interfere with the laser receiver. For further improvements in this regard optical filters 230 may be placed in the receiver 222 to discriminate not only against deliberate jamming but also against the minute amount of optical noise at the operating frequency.',
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
