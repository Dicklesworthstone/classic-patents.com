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

type MaimanRubyLaserWipEdition = Omit<CuratedSpecificationEdition, "completeFacsimileReviewed"> & {
  completeFacsimileReviewed: false;
};

export const maimanRubyLaserParallelReadings: Readonly<Record<number, readonly string[]>> = {
  8: ["The continuation statement identifies this grant as a continuation of the abandoned 1961 Laser Systems application."],
  9: ["Maiman defines the invention as generation, amplification, and use of coherent electromagnetic waves in infrared, visible, and ultraviolet portions of the spectrum."],
  10: ["The opening explains why coherent monochromatic light with waves propagating in phase would expand communications and metrology capabilities."],
  11: ["The specification contrasts optical wavelengths with microwave cavities: oversized cavities support many modes, degrade coherence, and demand excessive pump power."],
  12: ["Schawlow and Townes had proposed gaseous negative-temperature media, but the grant identifies the practical difficulty of operating such media."],
  13: ["The gas-laser proposal is described as complex, impurity-sensitive, and not yet demonstrated to provide net optical generation or amplification."],
  14: ["The listed objects call for a low-noise, mechanically stable, temperature-flexible, high-power laser and a laser-based optical radar system."],
  15: ["The invention answers those objects with a solid-state negative-temperature medium."],
  16: ["The representative ruby rod uses broadband pump light, reflecting end coatings, and an output opening so a resonating wave becomes a narrow monochromatic beam."],
  17: ["The drawing list identifies the patent's eighteen printed figures and assigns each to its source-described optical pumping, resonator, filtering, or colidar function."],
  18: ["The specification introduces the two-level absorption and emission model, where wave interaction depends on the difference between populations in the two levels."],
  19: ["A third higher level permits pumping and, with suitable relaxation times, creates an inverted population so the optical wave is emitted and amplified."],
  20: ["The model places the transition in the visible spectrum, allowing a material with suitable energy levels to amplify or generate visible light."],
  21: ["Figure 1's level 1 is the ground state and region 3 is a broad higher-energy band from which the chromium-doped material is pumped."],
  22: ["The preferred radiationless decay funnels broad pump energy into the narrow level 2, whose stimulated transition to level 1 emits coherent radiation."],
  23: ["Figure 2 follows the pump sequence in ruby rod 10: broadband light excites the dopant, relaxation populates level 2, and repeated axial reflections produce beam 16."],
  24: ["Figure 3 substitutes sunlight or another parallel white-light source, with lens 18 and mirror 24 concentrating and returning pump energy through active material 22."],
  25: ["Figure 4 places active rod 26 inside helical flash tube 28, with silvered ends, opening 32, power supply 36, and reflecting outer cylinder 38."],
  26: ["Figure 5 replaces the helical tube with hollow cylinder 50, flashing gas 52, electrodes 54 and 56, and a reflective pump interior around rod 40."],
  27: ["Figure 6 adds fluorescein 64 between rod 60 and flash tube 62, converting broadband white pump light 66 into green light for the ruby, as represented by Figure 7."],
  28: ["Figure 8 uses hollow active cylinder 70 around flash tube 72 and surrounds it with coolant cylinder 74 containing coolant 76."],
  29: ["Figure 9 refrigerates rod 78 near liquid nitrogen 90, with conductive rod 88, Dewar flask 92, flash tube 94, electrodes 98, and coolant 102."],
  30: ["Figure 10 distinguishes axial ray 106 from nonparallel rays 108 and 112 whose reflections lengthen the resonator and degrade frequency purity and beam coherence."],
  32: ["The formal claims that follow the specification define the three-level ruby medium, broadband optical pumping, population inversion, regenerative resonant path, and monochromatic output as the protected combinations."],
  36: ["The references cited identify Schawlow and Townes's United States patent and the two printed optical-maser publications, preserving the grant's research trail."],
  37: ["The primary examiner attribution is reproduced as printed in the formal matter."],
  38: ["The second examiner attribution is reproduced as printed in the formal matter."],
  39: ["The inventor and attorney signature lines are retained as source-formal matter, without treating the typed ledger as a substitute for the facsimile pixels."],
  40: ["The examiner names and cited works close the typed formal record while the pinned facsimile remains the authority for exact visual placement and signatures."],
  41: ["The closing signature block preserves Theodore H. Maiman as inventor and Daniel T. Chubb as attorney, while its visual inscription remains tied to the facsimile."],
};

export const maimanRubyLaserArchivalEdition: MaimanRubyLaserWipEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6",
  preparedBy: "Classic Patents editorial agent (GPT-5.6 Luna; WIP source reconciliation)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
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
      kind: "figure-sheet",
      figureLabel: "FIGURES 1–3",
      title: "5 Sheets—Sheet 1",
      description: [text("Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. "), ref("FIG. 1", "#figure-1", "Figure 1"), text("; "), ref("FIG. 2", "#figure-2", "Figure 2"), text("; "), ref("FIG. 3", "#figure-3", "Figure 3"), text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb.")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 4–7",
      title: "5 Sheets—Sheet 2",
      description: [text("Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. "), ref("FIG. 4", "#figure-4", "Figure 4"), text("; "), ref("FIG. 5", "#figure-5", "Figure 5"), text("; "), ref("FIG. 6", "#figure-6", "Figure 6"), text("; "), ref("FIG. 7", "#figure-7", "Figure 7"), text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb.")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 8–11",
      title: "5 Sheets—Sheet 3",
      description: [text("Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. "), ref("FIG. 8", "#figure-8", "Figure 8"), text("; "), ref("FIG. 9", "#figure-9", "Figure 9"), text("; "), ref("FIG. 10", "#figure-10", "Figure 10"), text("; "), ref("FIG. 11", "#figure-11", "Figure 11"), text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb.")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 12–15",
      title: "5 Sheets—Sheet 4",
      description: [text("Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. "), ref("FIG. 12", "#figure-12", "Figure 12"), text("; "), ref("FIG. 13", "#figure-13", "Figure 13"), text("; "), ref("FIGS. 14 and 15", "#figure-14", "Figures 14 and 15"), text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb.")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 16–18",
      title: "5 Sheets—Sheet 5",
      description: [text("Nov. 14, 1967. T. H. Maiman. 3,353,115. RUBY LASER SYSTEMS. Original Filed April 13, 1961. "), ref("FIGS. 16 and 17", "#figure-16", "Figures 16 and 17"), text("; "), ref("FIG. 18", "#figure-18", "Figure 18", ["/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png", "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png"]), text(". Inventor Theodore H. Maiman; attorney Daniel T. Chubb.")],
    },
    { kind: "heading", level: 2, text: "SPECIFICATION" },
    p(text("This application is a continuation of my copending application Ser. No. 102,698 entitled, Laser Systems, filed Apr. 13, 1961, now abandoned.")),
    p(text("This invention relates to the generation, amplification, and utilization of electromagnetic waves in the infrared, visible and ultraviolet portion of the spectrum, and more specifically to lasers and laser systems. A "), term("laser", "The source's acronym for light amplification by stimulated emission of radiation."), text(", the term being an acronym for light amplification by stimulated emission of radiation, is a device capable of generating or amplifying coherent light. The principle of operation is similar to that of a maser and is therefore also referred to as an optical maser.")),
    p(text("Much effort has been expended in the fields of electronics and physics in attempts to generate or amplify coherent light. Such an achievement, it was known, would make available a vast new region of the electromagnetic spectrum for a multitude of purposes including communications and metrology (measurements) applications. Such coherent light would have the properties of being monochromatic and of having its component waves propagating in phase with each other. Thus, as at radio or microwave frequencies, a great deal of energy could be concentrated at or extremely near to a single frequency and be utilized in methods analogous to those at radio frequencies.")),
    p(text("Ordinary techniques of generating or amplifying electromagnetic waves, including microwave maser techniques, cannot be extended usefully into the optical frequencies because such techniques require components, such as maser cavities, for supporting wave oscillations which must have physical dimensions of the order of a wavelength. Obviously, such components can neither be manufactured nor meaningfully utilized at optical frequencies where the wavelengths are of the order of atomic dimensions. When it is attempted to use cavities which have dimensions corresponding to a large number of wavelengths, many modes are supported, coherence is degraded, and impracticably large sources of pumping power are required.")),
    p(text("A laser has been proposed by Schawlow and Townes, see United States Patent No. 2,929,922, issued March 22, 1960, which suggests using as the negative temperature medium certain gaseous state materials such as alkali metal vapors. Such materials may be shown to have energy levels in their atomic systems corresponding to appropriate optical frequencies for absorbing optical pump energy to invert the population from the stable equilibrium state and thus provide the material with what is known as a negative temperature or excited, nonequilibrium state. Then by stimulation or spontaneous relaxation the atomic system falls back to its normal equilibrium state by one or more steps emitting energy of certain optical frequencies.")),
    p(text("Such proposed gaseous state devices are of great interest as theoretical models and represent significant academic advances, however, they have not been shown to provide a net generation or amplification of light. In addition, the structure of gaseous state systems is complex and requires the maintenance of critical vapor pressures and temperatures. Impurities in the gas is another very serious problem. The inter-atomic spacing of the gas severely limits the efficiency of coupling between the stimulated emission and a coherent wave propagating through the medium. In addition, the frequency of operation of any given gas laser may be effectively tuned only by Stark or Zeeman effects which can provide a tuning range of only approximately 5X10^10 cycles per second. Further, the construction of a gas cell is extremely critical in that the end plates must be highly reflective and perfectly parallel so that the many reflections required because of the low density gaseous material will be accomplished.")),
    p(text("It is therefore an object of the present invention to provide an operable, low noise, efficient laser. It is another object to provide a laser which is mechanically stable and of noncritical construction. It is another object to provide a laser which operates at room temperature or cryogenic temperatures for additional simplicity and even greater flexibility in design parameters. It is another object to provide a laser which does not require critical vacuum or vapor pressure techniques and which operates in a medium of high dielectric constant. It is another object to provide a laser capable of much higher power handling. It is another object to provide a laser which is tunable over approximately a 5X10^11 cycles per second range. It is another object to provide an optical radar system utilizing the advantages of a laser.")),
    p(text("Briefly, these and other objects are achieved in accordance with the present invention in a system including a solid state negative temperature medium.")),
    p(text("In one example a segment of solid state active laser material such as a cylindrical ruby (Al2O3 doped with Cr2O3) rod with reflecting coating at each end is coaxially placed in a helical flash lamp. White light or, predominantly, the green and blue components thereof, is absorbed by the ruby; and red light is emitted therefrom and coupled out of the system through a hole in the reflective coating at one end of the rod. The reflecting coatings provide a regeneration related to the coupling between the reflecting wave, traveling back and forth many times, and the emitting atoms. In other words, a resonating, standing wave is provided which derives energy from the negative temperature dielectric. Thus the rod may be considered as a resonator having different Q's for different modes of oscillation. The mode having the highest Q corresponds to waves traveling nearly parallel to the rod axis since it supplies the highest degree of regeneration. This effect causes the output to be an extremely parallel beam so that it propagates immense distances without spreading. Inherent in the regeneration process is the coherent amplification of an extremely narrow band of frequencies, thus providing a monochromatic output.")),
    p(text("Additional discussion of principles of operation, of further objects and advantages, including uses, and of other examples will be presented below in connection with a description of the accompanying drawings in which: "), ref("FIG. 1", "#figure-1", "Figure 1", "/patents/figures/us-3353115-maiman-ruby-laser/fig-1-source-crop-v2.png"), text(" is an energy level diagram for the atoms of a substance exhibiting laser properties; "), ref("FIG. 2", "#figure-2", "Figure 2", "/patents/figures/us-3353115-maiman-ruby-laser/fig-2-source-crop-v2.png"), text(" is a schematic diagram illustrating optical pumping of negative temperature laser material; "), ref("FIG. 3", "#figure-3", "Figure 3"), text(" is a schematic diagram of means for optically pumping the laser material with sunlight energy; "), ref("FIG. 4", "#figure-4", "Figure 4", "/patents/figures/us-3353115-maiman-ruby-laser/fig-4-source-crop-v2.png"), text(" is a schematic diagram of one embodiment which utilizes a helical gas-filled flash tube; "), ref("FIG. 5", "#figure-5", "Figure 5"), text(" is a diagram of an alternative embodiment utilizing a hollow gas-filled cylinder; "), ref("FIG. 6", "#figure-6", "Figure 6"), text(" is another embodiment utilizing a hollow cylindrical gas-filled optical pumping means separated from active material by a fluorescent material;")),
    p(ref("FIG. 7", "#figure-7", "Figure 7", ["/patents/figures/us-3353115-maiman-ruby-laser/fig-7-apparatus-source-crop-v4.png", "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-label-source-crop-v4.png", "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-labels-source-crop-v4.png", "/patents/figures/us-3353115-maiman-ruby-laser/fig-7-right-path-source-crop-v4.png"]), text(" is an energy level diagram illustrating the method of operation of the embodiment of FIG. 6; "), ref("FIG. 8", "#figure-8", "Figure 8"), text(" is a schematic diagram of an embodiment in which active laser material is a hollow cylinder surrounding a cylindrical gas-filled flash tube, the entire assembly being surrounded by a second hollow cylinder of coolant of a high index of refraction; "), ref("FIG. 9", "#figure-9", "Figure 9"), text(" is a cut-away view of an embodiment in which the laser material is refrigerated; "), ref("FIG. 10", "#figure-10", "Figure 10"), text(" is a diagram of a segment of laser material; "), ref("FIG. 11", "#figure-11", "Figure 11"), text(" is a diagram of a coated segment of laser material;")),
    p(ref("FIG. 12", "#figure-12", "Figure 12"), text(" is a diagram of a segment of laser material which is surrounded by a coolant having a high index of refraction; "), ref("FIG. 13", "#figure-13", "Figure 13"), text(" is a schematic diagram of a portion of a laser system illustrating the use of an interferometer; "), ref("FIGS. 14 and 15", "#figure-14", "Figures 14 and 15"), text(" are schematic diagrams illustrating additional types of interferometers; "), ref("FIGS. 16 and 17", "#figure-16", "Figures 16 and 17"), text(" are diagrams of a laser system in which the optical pump utilizes an exploding wire; and "), ref("FIG. 18", "#figure-18", "Figure 18", ["/patents/figures/us-3353115-maiman-ruby-laser/fig-18-apparatus-source-crop-v4.png", "/patents/figures/us-3353115-maiman-ruby-laser/fig-18-output-source-crop-v4.png"]), text(" is a schematic diagram of a practical colidar system utilizing a laser.")),
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
      ),
      text(
        ", the active laser material is a hollow cylinder within which a cylindrical flash tube is coaxially disposed. The active material is surrounded by a coolant cylinder, which may have a high index of refraction and a polished internal surface for reflecting pump energy back through the laser material. In ",
      ),
      ref(
        "FIG. 9",
        "#figure-9",
        "Figure 9",
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
      ),
      text(
        " illustrates a segment of laser material surrounded by a low-index material such as air. An axial ray can travel without reflecting from the side, while nonparallel rays reflect at the boundary, increasing the effective resonating length and spreading the output. In ",
      ),
      ref(
        "FIG. 11",
        "#figure-11",
        "Figure 11",
      ),
      text(
        ", a coating transparent to pump energy and absorptive near the laser output frequency absorbs nonparallel rays at the boundary. ",
      ),
      ref(
        "FIG. 12",
        "#figure-12",
        "Figure 12",
      ),
      text(
        " shows a high-index coolant in immediate contact with the active segment, transmitting nonparallel rays that would otherwise reflect. The specification gives diodomethane as a practical coolant whose refractive index is close to that of ruby and explains that coolant also controls the operating frequency by controlling temperature.",
      ),
    ),
    p(
      ref(
        "FIG. 13",
        "#figure-13",
        "Figure 13",
      ),
      text(
        " illustrates an interferometer arrangement in which prisms and mirrors define a closed path through active material. A Fabry-Perot interferometer between parallel plates selects the proper wavelength while nonparallel rays are lost from the circuit. ",
      ),
      ref(
        "FIG. 14",
        "#figure-14",
        "Figure 14",
      ),
      text(" and "),
      ref(
        "FIG. 15",
        "#figure-15",
        "Figure 15",
      ),
      text(
        " show additional interferometers using mutually parallel reflective plates to discriminate against nonparallel rays and couple out the desired beam.",
      ),
    ),
    p(
      ref(
        "FIG. 16",
        "#figure-16",
        "Figure 16",
      ),
      text(" and "),
      ref(
        "FIG. 17",
        "#figure-17",
        "Figure 17",
      ),
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
    {
      kind: "heading",
      level: 2,
      text: "REFERENCES CITED",
    },
    p(text("UNITED STATES PATENTS")),
    p(text("2,929,922  Schawlow et al.  3/1960  331-94.5")),
    p(text("OTHER REFERENCES")),
    p(text("Townes et al.: \u201cInfrared and Optical Masers,\u201d Physical Review, vol. 112, No. 6, Dec. 15, 1958, pp. 1940\u20131949. Wieder: \u201cSolid State, High-Intensity Monochromatic Light Sources,\u201d The Review of Scientific Instruments, vol. 30, No. 1, November 1959, pp. 995\u2013996.")),
    p(text("JEWELL H. PEDERSEN, Primary Examiner. RONALD L. WILBERT, Examiner.")),
    p(text("THEODORE H. MAIMAN, Inventor. BY DANIEL T. CHUBB, ATTORNEY.")),
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
