import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

type FermiReactorWipEdition = Omit<CuratedSpecificationEdition, "completeFacsimileReviewed"> & {
  completeFacsimileReviewed: false;
};

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];
const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const paragraph = (inlines: CuratedSpecificationInlines): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines,
});

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

// Versioned, upright crops for the bounded PDF pages 1–9 review. Complete
// source sheets remain on disk and in the provenance packet, but are never
// served as figure previews because their mastheads and signatures violate
// the isolated-preview framing contract.
type FermiSourceCrop = { src: string; width: number; height: number };

const sourceCrops: Partial<Record<number, FermiSourceCrop>> = {
  1: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v8-upper.png",
    width: 1400,
    height: 550,
  },
  2: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-2-source-crop-v4.png",
    width: 1380,
    height: 1000,
  },
  3: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-3-source-crop-v4.png",
    width: 1450,
    height: 1200,
  },
  4: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-4-source-crop-v7.png",
    width: 1500,
    height: 900,
  },
  5: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-5-source-crop-v7.png",
    width: 1500,
    height: 1350,
  },
  6: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-6-source-crop-v7.png",
    width: 1400,
    height: 1250,
  },
  7: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-7-source-crop-v7.png",
    width: 1450,
    height: 1400,
  },
  8: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-8-source-crop-v6.png",
    width: 1400,
    height: 1450,
  },
  9: {
    src: "/patents/figures/us-2708656-fermi-reactor/fig-9-source-crop-v10-main.png",
    width: 1450,
    height: 1450,
  },
};

const sourceCropExtras: Partial<Record<number, readonly FermiSourceCrop[]>> = {
  1: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v14-lower-full.png",
      width: 1400,
      height: 450,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v17-arrow-end.png",
      width: 400,
      height: 220,
    },
  ],
  7: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-7-source-crop-v11-lower-left.png",
      width: 700,
      height: 850,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-7-source-crop-v13-rail-end-clean.png",
      width: 400,
      height: 550,
    },
  ],
  8: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-8-source-crop-v6-left.png",
      width: 180,
      height: 1100,
    },
  ],
  9: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-9-source-crop-v10-leader.png",
      width: 500,
      height: 260,
    },
  ],
  5: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-5-source-crop-v7-axis.png",
      width: 100,
      height: 800,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-5-source-crop-v9-right.png",
      width: 100,
      height: 1000,
    },
  ],
};

/*
 * Retained crop attempts that failed root visual QC are intentionally not
 * served. Keep this comment adjacent to the active map so a future editor
 * does not accidentally reintroduce a formal-sheet or clipped preview.
 */
/*
const retiredSourceCropExtras: Partial<Record<number, readonly FermiSourceCrop[]>> = {
  1: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v8-lower.png",
      width: 1400,
      height: 1000,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v12-lower-continuation.png",
      width: 1400,
      height: 250,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-1-source-crop-v11-bottom.png",
      width: 200,
      height: 300,
    },
  ],
  7: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-7-source-crop-v5-left.png",
      width: 360,
      height: 500,
    },
  ],
  8: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-8-source-crop-v6-left.png",
      width: 180,
      height: 1100,
    },
  ],
  5: [
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-5-source-crop-v7-axis.png",
      width: 100,
      height: 800,
    },
    {
      src: "/patents/figures/us-2708656-fermi-reactor/fig-5-source-crop-v9-right.png",
      width: 100,
      height: 1000,
    },
  ],
};
*/

const figureSheets: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 11,
  13: 11,
  14: 11,
  15: 11,
  16: 12,
  17: 11,
  18: 13,
  19: 13,
  20: 13,
  21: 12,
  22: 14,
  23: 14,
  24: 15,
  25: 16,
  26: 17,
  27: 17,
  28: 17,
  29: 18,
  30: 19,
  31: 20,
  32: 21,
  33: 22,
  34: 23,
  35: 22,
  36: 23,
  37: 24,
  38: 25,
  39: 26,
  40: 26,
  41: 19,
  42: 27,
};

const figure = (
  num: number,
  label: string,
  extraNums: number[] = [],
): CuratedSpecificationInline => {
  const nums = [num, ...extraNums];
  const previews = nums.map((n) => {
    const sheet = figureSheets[n] ?? 1;
    const crop = sourceCrops[n];
    const cropPreviews = crop
      ? [
          {
            ...crop,
            alt: `US 2,708,656 Fig. ${n}, upright primary source crop on Drawing Sheet ${sheet}`,
          },
        ]
      : [];
    const supplementalPreviews = (sourceCropExtras[n] ?? []).map((extra, index) => ({
      ...extra,
      alt: `US 2,708,656 Fig. ${n}, upright supplemental source crop ${index + 1} on Drawing Sheet ${sheet}`,
    }));
    return [...cropPreviews, ...supplementalPreviews];
  });
  const firstSheet = figureSheets[num] ?? 1;
  return {
    kind: "reference",
    text: label,
    href: `#fermi-fig-${num}`,
    referenceType: "figure",
    label: `Preview ${label} on Sheet ${firstSheet} of US 2,708,656`,
    figurePreviews: previews.flat(),
  };
};

// The drawing sheets are an additive WIP packet. They are appended to the
// edition below so the existing paragraph-indexed parallel-reading evidence
// remains stable while pages 1–9 are independently reconciled.
const fermiDrawingSheetBlocks1To9: readonly CuratedSpecificationBlock[] = [
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 1 OF 27",
    title: "Chain-reaction neutron balance diagram",
    description: [
      figure(1, "FIG. 1"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 1. Visible diagram labels include A through I; Thermal Neutrons; Radioactive Fission Fragments; Beta Rays; Gamma Rays; Fast Neutron Leakage from System; Volume Resonance Absorption; Surface Resonance Absorption; Neutrons Reaching Thermal Energy; Neutrons Absorbed by Impurities in System and Controls; and Neutrons Absorbed by Carbon. Readable nuclide and timing labels include U235, U238, U239, 93-239, 94-239, 23 minutes, 2.3 days, and 100 fast neutrons. Witnesses: three handwritten signatures, with the second reading Francis W. Toy and the third Henry H. Johnson; the first is not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature, surname not reliably legible; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 2 OF 27",
    title: "Uranium-metal spheres in graphite K contours",
    description: [
      figure(2, "FIG. 2"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 2. Graph labels: Radius of Spheres (cm), Vc/Vu, and K contour values from 1.00 through 1.10. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 3 OF 27",
    title: "Uranium-metal rods in graphite K contours",
    description: [
      figure(3, "FIG. 3"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 3. Graph labels: Radius of Rods (cm), Vc/Vu, and K contour values from 1.00 through 1.10. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 4 OF 27",
    title: "Uranium-oxide spheres in graphite K contours",
    description: [
      figure(4, "FIG. 4"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 4. Graph labels: Radius of Spheres (cm), Vc/Vox, and K contour values from 1.00 through 1.10. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 5 OF 27",
    title: "Uranium-oxide rods in graphite K contours",
    description: [
      figure(5, "FIG. 5"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 5. Graph labels: Radius of Rods (cm), Vc/Vox, and K contour values from 1.00 through 1.10. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 6 OF 27",
    title: "Uranium rods in heavy-water K contours",
    description: [
      figure(6, "FIG. 6"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 6. Graph labels: Radius of Rods (cm), Vaq/Vu, and K contour values from 1.00 through 1.09. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 7 OF 27",
    title: "Perspective view of a uranium-graphite reactor in a radiation shield",
    description: [
      figure(7, "FIG. 7"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 7. Readable component reference numerals include 10–17, 20–23, 25–26, 29, 29a, 30–37, 40–43, 45–46, 95–96, and 202a. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 8 OF 27",
    title: "Front-end plan and central vertical section of the Fig. 7 reactor",
    description: [
      figure(8, "FIG. 8"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 8. Readable component reference numerals include 10–12, 14–15, 17, 20–21, 26–27, 29a, 30, 32, 36–37, 50–52, 54, 56, 60–61, 73, 75, and 79. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
  {
    kind: "figure-sheet",
    figureLabel: "SHEET 9 OF 27",
    title: "Side plan and central vertical section of the reactor",
    description: [
      figure(9, "FIG. 9"),
      text(
        ". Printed headings: May 17, 1955; E. FERMI ET AL; 2,708,656; NEUTRONIC REACTOR; Filed Dec. 19, 1944; 27 Sheets—Sheet 9. Readable component reference numerals include 10–11, 14, 17, 20–21, 26–27, 30–32, 40–41, 50–52, 54, 56, 56a, 60, and 72. Witnesses: three handwritten signatures; the second reads Francis W. Toy and the third Henry H. Johnson, while the first and the attorney signature are not reliably legible. Inventors: Enrico Fermi; Leo Szilard. By: handwritten attorney signature; Attorney.",
      ),
    ],
  },
];

// Cloud-facsimile reconciliation packet: PDF pages 30–35 (printed
// specification pages 6–15).  These blocks are intentionally kept before
// the older p36–40 WIP intake and the edition remains withheld until the
// remaining specification, claims, references, and certificate are reviewed.
const fermiPages30To35ReconciledBlocks: readonly CuratedSpecificationBlock[] = [
  paragraph([
    text(
      "Cb, Mo, Nb, Ru, Rh. Atomic mass, 83–99, inclusive. Atomic number, 35–45, inclusive. B=heavy fission fragment, e. g., Sb, Te, I, Xe, Cs, Ba, La, Ce, Pr, Nd. Atomic mass, 127–141, inclusive. Atomic number, 51–60, inclusive. In any practical system, impurities will be present in both the moderator and the uranium. In the chain described, a small fraction of the neutrons can be captured and absorbed by impurities in the system without the reproduction factor of the system falling below unity. Thus, for example in ",
    ),
    figure(1, "Fig. 1"),
    text(
      ", if impurities necessarily present in the materials do not consume too many neutrons, some excess neutrons are available to be captured by impurities intentionally introduced for control purposes, that is, by a control rod, later to be described. Furthermore, since many of the thermal neutrons diffusing through the moderator are not in a position to promptly enter a uranium mass when they reach thermal energy, these thermal neutrons must continue to diffuse through the moderator until they do reach a uranium body. During this diffusion, a small percentage of the neutrons are absorbed by the moderator, leaving sufficient thermal neutrons to enter a uranium body to produce new fast neutrons by fission, to repeat the cycle. In the uranium-graphite system about 72 thermal neutrons enter the uranium body to produce 100 new fast neutrons, that is, a survival of about 72 per cent of the original 100 fast neutrons during the slowing process. The four neutron losses from the chain reaction referred to above are represented in ",
    ),
    figure(1, "Fig. 1"),
    text(
      ", where the resonance absorption at C and the fraction of thermal neutrons absorbed by U238 at I represent the uranium absorption losses. Losses due to impurities are represented at F, those due to absorption in the moderator at G, and the leakage losses due to the finite size of the system at B and E. These losses will be considered in detail in the order named, as any one of these losses, or their total if too high, can prevent a self-sustaining chain reaction from being attained in a system of any size.",
    ),
  ]),
  paragraph([
    text(
      "1. Neutron loss by absorption in uranium. It is possible by proper physical arrangement of the materials substantially to reduce uranium resonance absorption, as will be shown later. By the use of light elements for moderators, fewer collisions are required to slow the neutrons to thermal energies with large increments of energy loss per collision, thus decreasing the probability of a neutron being at a resonance energy as it enters a uranium atom. During the moderation, however, neutrons are moving through the slowing medium over random paths and distances so that the uranium is not only exposed to thermal neutrons but also to neutrons of energies varying between the energy of fission and thermal energy. Neutrons at uranium resonance energies will, if they enter uranium at these energies, be absorbed on the surface of a uranium body whatever its size, giving rise to surface absorption. Any substantial reduction of overall surface of the same amount of uranium will reduce surface absorption, and any such reduction in surface absorption will release neutrons to enter directly into the chain reaction. For a given ratio of moderator to uranium, surface resonance absorption losses of neutrons in the uranium can be substantially reduced by a large factor when the uranium is aggregated into substantial masses in which the mean spatial diameter is at least about 0.5 centimeter for natural uranium metal and somewhat larger when the bodies are of a uranium compound, as hereinafter more fully discussed. For example with UO2 the minimum radius is larger and with other uranium compounds a similar variation from metallic uranium may be observed. The degree of this variation is dependent upon the density of the uranium compound, its bulk density, and the absorption coefficient of other elements therein. In any event the uranium may be placed in the system in the form of geometrically spaced uranium masses or bodies of substantial size, preferably either of metal, oxide, carbide, or combinations thereof, the moderator being in a substantially continuous phase. The term geometric is used to mean any pattern or arrangement wherein the uranium bodies are distributed in the moderator with at least a roughly uniform spacing and are roughly uniform in size and shape, or are systematic in variations of size, shape or spacing to produce a volume pattern conforming to a generally symmetrical system. If the pattern is a repeating or rather exactly regular one, the structure may be conveniently described as a lattice. The uranium bodies can be in the form of layers, rods, or cylinders, cubes or spheres, or approximate shapes, dispersed throughout the moderator. Optimum conditions are obtained with natural uranium by using metal spheres.",
    ),
  ]),
  paragraph([
    text(
      "The resonance losses in uranium constitute one of the critical factors in coordinating the total losses permissible in a neutronic reactor. Proper sizes and shapes of the uranium bodies and volume ratios of uranium to moderator must be fairly accurately known in order that optimum geometry be approached, or if the use of near-optimum geometry is not desirable, then the permissible ranges of departure from the optimum should be determined, so that a reproduction ratio greater than unity can be maintained in a reactor of practical size. The K constant of a mixture of fine uranium oxide particles in a light element such as graphite, found to be satisfactory as a neutron moderator, assuming both of them to be theoretically pure, would only be about .785. Actual K constants as high as about 1.04 have been obtained using aggregation of natural uranium oxide in graphite, and with as pure materials as it is presently possible to obtain, showing a substantial gain due solely to reduction of resonance loss. Assuming theoretically pure graphite, and theoretically pure natural uranium metal, with the presently obtainable densities of 1.65 and 18 gms./cm.3, respectively, the maximum possible K constant theoretically obtainable is about 1.1. When heavy water (D2O) is used as a moderator, higher K constants approaching 1.3 are obtainable. Still higher K constants can be obtained in uranium having more than the naturally occurring content of thermal neutron fissionable elements. Adding such fissionable material is termed enrichment of the uranium. 2. Neutron loss by absorption in the moderator. Neutrons are also subject to capture by the moderator. While carbon and beryllium have very small capture cross sections for thermal neutrons, and deuterium still smaller, a fraction of the thermal neutrons present in the system even under best conditions is lost by capture in the moderator during diffusion therethrough. It is therefore desirable to have the neutrons reaching thermal energy enter uranium as promptly as possible. This may be taken care of by using optimum or near optimum geometry where the resonance absorption is substantially equal to absorption in the moderator. Moderators differ in their ability to slow down neutrons and in their capacity to absorb neutrons. The ability to slow down neutrons may be expressed by what is known as the scattering cross section of the nucleus, whereas the ability to absorb or capture neutrons is expressed by what is known as the capture cross section of the nucleus. The ratios of absorption cross section to scattering cross section for moderators discussed herein are approximately as follows: Light water (H2O), .00478; diphenyl, .00453; beryllium, .00127; graphite, .000726; heavy water (D2O), .00017. It is also to be noted that beryllium and heavy water inherently possess the property of emitting neutrons in response to irradiation with gamma rays. The choice of moderators therefore will depend on many considerations, as will be apparent from further discussions herein.",
    ),
  ]),
  paragraph([
    text(
      "3. Neutron loss by absorption by impurities in the system. However, even when resonance and moderator losses are reduced to a practical minimum, no self-sustaining chain reaction can be obtained in any system unless impurities in the materials used for the reaction are reduced to such an extent that the loss by parasitic capture by such impurities will not, in combination with the other losses, prevent the reaction from becoming self-sustaining. Impurities present in both the uranium and the moderator consequently constitute a very important neutron loss factor in the chain. The effectiveness of various elements as neutron absorbers varies tremendously. Certain elements such as boron, cadmium, samarium, gadolinium, and some others, for example, if present even in a few parts per million, could very likely prevent a self-sustaining chain reaction from taking place. It is highly important, therefore, to remove as far as possible all impurities capturing neutrons to the detriment of the chain reaction from both the slowing material and the uranium. The permissible amounts of impurities will vary for each specific geometry, depending upon such considerations as the form in which the uranium is used—that is, whether natural or enriched, whether as metal or oxide. The type of slowing down material used also influences the effect of impurities, as do the weight ratios between the uranium and the slowing down material. Elements such as oxygen may be present, and the uranium may be in the form of oxide, such as UO2 or U3O8, a carbide, or fluoride, but the metal is preferred. Nitrogen may be present in the reactor in fairly large amounts, and its effect on the chain reaction is such that the neutron reproduction ratio of the system may be changed by changes in atmospheric pressure. This latter effect may be eliminated by excluding nitrogen from the system, or by sealing the system from the effects of changes of atmospheric pressure. The effect of impurities on the optimum reproduction factor K may be conveniently evaluated by means of certain constants known as danger coefficients which are assigned to the various elements. The danger coefficients for the impurities are each multiplied by the per cent by weight of the corresponding impurity, with respect to the weight of uranium in the system, and the total sum of these coefficients gives a value known as the total danger sum. This total danger sum is subtracted from the reproduction constant K as calculated for theoretically pure materials and for the specific geometry under consideration. The danger coefficients are defined in terms of the ratio of the weight of impurity per unit mass of uranium and are based on the cross section for absorption of thermal neutrons of the various elements. These values may be obtained from physics textbooks on the subject, and by direct measurement, and the danger coefficient computed by the formula shown on the facsimile.",
    ),
  ]),
  paragraph([
    text(
      "The sum of the danger coefficients of the impurities in any given composition, as multiplied by the per cent by weight of the uranium in the reactor, is known as total danger sum of the composition. This figure is a dimensionless constant like K and can be directly subtracted from K. As a specific example of the use of danger coefficients, if the materials of a system under consideration have 0.01 per cent by weight of each of the elements H, Co, and Ag with respect to the weight of the uranium in the system, the total danger sum in K units for such an analysis would be: .0001 x 10 + .0001 x 17 + .0001 x 18 = .0045. This figure can then be subtracted from the K calculated for a particular geometry of theoretically pure materials to give the actual K constant for the materials used. If, on the other hand, the impurities in the uranium are Li, Co, and Rh in the same percentage, the total danger sum would be: .0310 + .0017 + .0050 = .0377 reduction in K due to impurities. The maximum possible K constants for neutronic reaction systems when natural uranium aggregates in optimum geometry are used, and where the materials used are assumed to be theoretically pure, have been calculated as follows: for U metal—graphite moderator, 1.1; U oxide—graphite moderator, 1.07; U metal—beryllium metal moderator, 1.1; U metal—beryllium oxide moderator, 1.1; U metal—heavy water moderator, about 1.3; U metal—light water moderator, about 1. The table of individual danger coefficients is preserved in the page-marked ledger; several column glyphs remain visually uncertain in the cloud text and are not silently normalized here.",
    ),
  ]),
  paragraph([
    text(
      "The total danger sum for impurities in both the uranium and moderator must be less than about .3 in order that the K factor remain equal to or greater than unity with a deuterium ",
    ),
    term(
      "moderator",
      "A material such as graphite, beryllium, heavy water, or light water that slows neutrons while minimizing parasitic capture so the chain reaction can continue.",
    ),
    text(
      ", about .11 with a beryllium moderator, and about .1 with a graphite moderator. Light water can be used as a moderator, at least in part of a reactor, as will be pointed out later. In the chain reaction outlined in ",
    ),
    figure(1, "Fig. 1"),
    text(
      " for a natural uranium reactor of practical size, a small percentage of neutrons can be absorbed by impurities without reducing the neutron reproduction ratio below unity. Not all of these neutrons, however, should be absorbed by the residual impurities in the uranium and the moderator, because if this were so the system would always just be self-sustaining and no exponential rise in neutron density could be obtained. Some means must be provided to release additional neutrons to enter the chain. For example, in ",
    ),
    figure(1, "Fig. 1"),
    text(
      ", it may be considered that only half of the neutrons that can be absorbed by impurities are absorbed by materials actually present as impurities in the uranium and the moderator, and that the other half are absorbed by a strong neutron absorbing material, such as cadmium, that is wholly or partially removable from the system. Under these conditions, with the chain reaction in balance, if the amount of cadmium is reduced to a point where fewer neutrons are absorbed, the neutron density will rise exponentially when the system is large enough. To stabilize the reaction at any desired neutron density, the absorbing material is reinserted until the total permissible absorption is restored; to reduce density, more absorber is introduced. The reaction is stopped by leaving sufficient absorber in the system to prevent the reaction from building up. 4. Exterior neutron loss in a neutronic reactor of practical size. In an infinite-size system there is no exterior leakage. In a finite reactor, fast neutrons can escape while slowing in the moderator near the periphery, and slow neutrons can escape while diffusing near the periphery. The smaller the reactor, the greater this exterior loss. A reflector of low absorption-to-scattering ratio can reduce the loss. Measurement of neutron losses. An exponential pile is a deliberately non-operating pile of known uranium-graphite geometry. A neutron source at the bottom produces a density distribution that declines exponentially with distance. The slope measures the effects of geometry, moderator, uranium composition, and impurities on the reproduction constant K.",
    ),
  ]),
  paragraph([
    text("The symmetrical arrangement of the uranium lumps in the moderator is called a "),
    term(
      "lattice",
      "A repeating geometric arrangement of uranium bodies in moderator, with spacing and shape controlled so neutron slowing and absorption can be evaluated as a reactor system.",
    ),
    text(
      ". Briefly, the theory of exponential pile measurements is as follows. Considering a uranium-graphite lattice structure or column of square cross section with sides equal to a, and semi-infinite height, with a source of fast neutrons at the center of the base of the column, then, at points sufficiently far removed from the source, the neutron density due to any chain reaction present will be given by an equation of the following form where x, y, and z are the axes of the structure. The symbols i and j represent the orders and arguments of the Bessel function series and A is a constant which varies with the Bessel functions included in the summation. The x axis is taken along the vertical axis of the structure, and the x=0 plane coincides with the base of the pile. Thus, for points close to the vertical axis, each harmonic of the neutron density decreases exponentially, with a ",
    ),
    term(
      "relaxation distance or length",
      "The axial distance over which the measured neutron flux falls to 1/e of its starting value, used to infer the reproduction factor from an exponential-pile profile.",
    ),
    text(
      " equal to b. The relaxation distance or length is the distance in which the neutron flux is reduced to a fraction of 1/e of its original value. At a sufficiently large distance from the source the first harmonic only is important. The relaxation length can then be taken as b, and b alone is related to the reproduction factor K through the equation printed as Equation (3). Here a is the length of side of the structure; b is relaxation distance; lambda is mean free path of thermal neutrons in graphite; lambda sub a is mean free path for absorption collision; and tau is the age of nascent thermal neutrons. The quantity B squared signifies a number given by the ratio of the Laplacian of n to n, where n is the number of thermal neutrons per cubic centimeter at the point x, y, z. The Laplacian is an abbreviation for the sum of the three second derivatives of n with respect to x, y, and z. For cases where K is close to unity, the Laplacian is small. By defining M squared as the sum of the age of nascent thermal neutrons and the diffusion-length term, M is the migration length of neutrons in the structure and is roughly proportional to the average distance between the place of birth of a neutron as a fission neutron and its place of death by thermal absorption. Equation (5) is K = 1 minus M squared times the Laplacian. Equation (6) writes K in terms of M squared, a, and b. M squared has been found to be from about 650 cm squared to 750 cm squared for uranium-graphite chain-reacting structures.",
    ),
  ]),
  paragraph([
    text(
      "The length of a side, a, to be used in calculating K from Equation (6) must be that value for which the neutron intensity actually becomes equal to 0. Because of the finite length of the mean free path lambda, compared to the dimensions of the pile, the effective side is larger than the physical side. From neutron density measurements made at the outer surface of the pile, the effective value of a can be estimated for various x planes. Using the quantities found for M and a, a measurement of the relaxation distance b, associated with the first harmonic of the neutron density, will then determine, from Equation (6), the reproduction factor corresponding to a lattice of infinite dimensions similar in geometry and materials to the structure being tested. This reproduction factor must be modified when used in conjunction with reactors attaining high neutron densities for prolonged time periods by an ",
    ),
    term(
      "operational poisoning factor",
      "A neutron-absorption allowance representing products or equivalent absorbers that reduce the effective reproduction factor during prolonged high-density reactor operation.",
    ),
    text(
      ". This factor can be added into the exponential pile by adding equivalent absorbers to each cell and then finding the Laplacian or K. When K is found without such absorbers this factor can be directly deducted. To determine the relaxation distance b, thin ",
    ),
    term(
      "indium foils",
      "Thin activation detectors placed at measured axial positions so their induced radioactivity reveals the local neutron density used to calculate relaxation distance.",
    ),
    text(
      ", 0.0924 gram per square centimeter, are placed at positions along the axis of the pile for a predetermined time and the 54-minute radioactivity induced by neutron bombardment is measured on Geiger-Mueller counters for a predetermined time. For these measurements the indium foil is held in a nickel holder. Thus the activation of the foil is due to absorption of both thermal and indium-resonance neutrons. All measurements are corrected to give foil-activity values for infinite times of irradiation. The emission of neutrons by spontaneous fission of the uranium in the pile produces a small neutron background which must be subtracted from the density measurements. Because of the finite height of an exponential pile, two corrections may be applied: a harmonic correction due to higher harmonics near the source, and an end-correction due to the proximity of the top of a practical column to the measuring positions. Finally, after making the harmonic and end corrections, b is calculated from the relation printed as Equation (7), where D is the distance between the two positions x1 and x2 along the vertical axis at which the foil activities are measured and ln is the mean logarithm to base e. Two neutron-density measurements made in adjacent positions along the vertical axis will therefore give b and a value for the Laplacian or a value for K when M squared is known.",
    ),
  ]),
  paragraph([
    text("The same procedure can be used when "),
    term(
      "liquid moderators",
      "Fluid neutron-slowing materials held in a tank around suspended uranium bodies, allowing the exponential-pile measurement procedure to be applied without a solid moderator block.",
    ),
    text(
      " are involved by placing the liquid in a tank and suspending the uranium, in the form of rods, for example, so that it enters the moderator. Measurements are made as set forth herein for solid moderators. The ",
    ),
    term(
      "migration length",
      "A neutron-transport distance measure, defined through the mean-square displacement from fission-neutron production to eventual disappearance by absorption in the lattice.",
    ),
    text(
      " has been described as roughly proportional to the average displacement of a neutron from the point of its origin as a fast neutron in a uranium lump to the point of its disappearance in the pile. More precisely, we define the square of the migration length by the formula in Equation (8), where M squared is the mean square distance between production and disappearance of neutrons in the lattice. In principle, an experiment for the actual measurement of the migration length could be performed as follows: a lattice of a given type is set up as for the exponential pile; multiplication is suppressed by using uranium completely depleted in the fissionable isotope and readjusting neutron absorption to equal that of normal uranium by addition of boron; a point source of fission neutrons is introduced; and foil techniques measure the distribution of thermal neutrons through the lattice so that the mean square distance can be computed. Such experiments have not to date been performed because preparation is very expensive and no proper fission source is presently available. Actually the best existing knowledge of M squared for the present lattices is obtained by measurements made in an exponential pile using Formula 5 above. The Laplacian can be measured directly in the exponential pile using the formula printed as Equation (10); by finding a and b as outlined above, the value of the Laplacian may be determined. A neutron absorber of known capture cross section is then introduced in known amounts, the change in the Laplacian is measured, and M squared is calculated. In one specific instance, borated water in various concentrations was passed through a lattice of uranium rods arranged in graphite. It was found that there was a change in the Laplacian of 0.0584 x 10 to the minus 8 for one part per million of boron in the water. From this change M squared was calculated to be about 590 square centimeters, accurate within about 10 per cent of error.",
    ),
  ]),
  paragraph([
    text(
      "The practical calculations for pile design do not even depend upon this procedure but upon a more theoretical one still. M squared can be written as Equation (11), where the symbol tau designates the age of nascent neutrons and is essentially the mean square distance that fission neutrons may travel before becoming thermal. This can be directly measured in the moderator used, since the metal has a very small effect on slowing down. The second term is the diffusion length squared for thermal neutrons in the lattice in question, which is equal simply to the diffusion length in the moderator. The diffusion length can also be directly measured in the moderator used and is multiplied by the fraction of neutrons absorbed in the moderator, which is (1-f), where f is the ",
    ),
    term(
      "thermal utilization",
      "The fraction of thermal neutrons absorbed by uranium rather than by the moderator, combining ordinary capture and fission-producing absorption in the reactor balance.",
    ),
    text(
      " defined as the fraction of the thermal neutrons absorbed by the uranium rather than by the moderator. Such calculations are adequate to 10 to 15 per cent and are suitable for design purposes in finding K minus 1. The following values of M squared have been found by measurements and calculation to be indicative for preliminary design purposes: for water, 40 square centimeters; for D2O, 230 square centimeters; for beryllium, on the order of 300 square centimeters; for graphite, 600 to 700 square centimeters. By the use of the exponential pile, various sizes and shapes of uranium bodies have been tested and the related K factors found for various moderators. By testing uranium compositions in the exponential pile, the neutronic purity can be determined in terms of K when the same moderator is used or when the effect of moderator impurities is known, with geometry unchanged. The test is equally reliable for uranium compounds such as uranium oxides U3O8 and UO3, uranium carbide, uranium tetrafluoride, and uranium hexafluoride. When M squared is known, this factor can be used to determine ",
    ),
    term(
      "critical size",
      "The minimum reactor dimensions required for neutron production and retention to overcome absorption and leakage so a self-sustaining chain reaction can exist.",
    ),
    text(" of the structure for various moderators."),
  ]),
  paragraph([
    text(
      "Thus the determination of (1) the proper size, shape and disposition of the uranium bodies in the moderator to reduce resonance losses; (2) the amounts of neutron absorbing impurities that can be tolerated in addition to other losses before a self-sustaining chain reaction will become impossible in a system of practical size; and (3) the nuclear characteristics of the moderator with respect to requirements of critical size and tolerable exterior losses, has enabled us to provide a means and method of building neutronic reactors capable of sustaining a chain neutron reaction by virtue of nuclear fission, even when individual values for constants entering into the nuclear processes are only imperfectly known. It is, therefore, an object of the present invention to provide a means and method of designing and building and operating neutronic reactors capable of sustaining a chain nuclear reaction by virtue of nuclear fission, and to outline the variations that can be tolerated before the reaction will become impossible of attainment in structures of practical size. Other objects and advantages of this invention will be apparent from a description of several operative reactors as shown in the attached drawings, wherein: ",
    ),
    figure(1, "Fig. 1"),
    text(
      " is a diagram or chart illustrating the balanced condition of a chain reaction in a system of practical size employing natural uranium in graphite; ",
    ),
    figure(2, "Fig. 2"),
    text(
      " is a graph on which are plotted contour lines representing various reproduction constants K for systems employing uranium metal spheres and graphite; ",
    ),
    figure(3, "Fig. 3"),
    text(" is a graph similar to that of "),
    figure(2, "Fig. 2"),
    text(" for cylindrical rods of uranium metal; and "),
    figure(4, "Fig. 4"),
    text(
      " is a graph on which are plotted contour lines representing various values for the reproduction constants K for a uranium oxide (UO2)-graphite system wherein the oxide is in the form of spheres.",
    ),
  ]),
  paragraph([
    text("The remainder of the drawing inventory continues: "),
    figure(5, "Fig. 5"),
    text(
      " is a graph showing various reproduction constants K for uranium oxide and graphite with the oxide in cylindrical rods; ",
    ),
    figure(6, "Fig. 6"),
    text(" is a graph showing K contour lines for uranium metal rods immersed in D2O; "),
    figure(7, "Fig. 7"),
    text(" is a perspective view of a uranium-graphite reactor enclosed in a radiation shield; "),
    figure(8, "Fig. 8"),
    text(" is a front end plan view of that reactor, partly in central vertical section; "),
    figure(9, "Fig. 9"),
    text(" is a side plan view, partly in central vertical section; "),
    figure(10, "Fig. 10"),
    text(" is a top plan view, partly in central horizontal section; "),
    figure(11, "Fig. 11"),
    text(
      " is a plan view of a graphite block containing uranium metal, partly broken away to show a uranium-metal cylinder in section; ",
    ),
    figure(12, "Fig. 12"),
    text(" is a longitudinal sectional view taken on line 12–12 of "),
    figure(11, "Fig. 11"),
    text("; "),
    figure(13, "Fig. 13"),
    text(
      " is a longitudinal sectional view of a graphite block showing uranium-oxide pseudospheres in place of uranium metal; ",
    ),
    figure(14, "Fig. 14"),
    text(
      " is a plan view of a graphite block loaded with uranium-oxide pseudospheres, partly broken away to show a pseudosphere in section on line 14–14 of ",
    ),
    figure(13, "Fig. 13"),
    text("; "),
    figure(15, "Fig. 15"),
    text(" is a plan view of a dead graphite brick, partly broken away and shown in section; "),
    figure(16, "Fig. 16"),
    text(" is a schematic wiring diagram of a neutron-density monitoring circuit; "),
    figure(17, "Fig. 17"),
    text(
      " is a graph showing neutron-density values plotted in relation to the number of layers as a cubical reactor is built; ",
    ),
    figure(18, "Fig. 18"),
    text(" is a diagrammatic side view of a safety rod; "),
    figure(19, "Fig. 19"),
    text(" is a diagrammatic side view of a shim or limiting rod; "),
    figure(20, "Fig. 20"),
    text(" is a diagrammatic side view of a control rod; "),
    figure(21, "Fig. 21"),
    text(
      " is a graph on which are plotted neutron-density value relations found in the active portion of the system against number of layers of graphite bricks for an ellipsoidal reactor; ",
    ),
    figure(22, "Fig. 22"),
    text(
      " is an enlarged, fragmentary perspective view of a modified active portion in the form of a cube or parallelepiped with uranium arranged horizontally in cylinders or rods; ",
    ),
    figure(23, "Fig. 23"),
    text(
      " is a second modification of the active portion wherein the overall shape is cylindrical and the uranium is disposed vertically in cylinders or rods; ",
    ),
    figure(24, "Fig. 24"),
    text(" is a diagram illustrating the distribution of neutron density in a spherical reactor."),
  ]),
  paragraph([
    text("The remaining figures are: "),
    figure(25, "Fig. 25"),
    text(
      " is a vertical sectional view of a neutronic reactor employing deuterium oxide as moderator; ",
    ),
    figure(26, "Fig. 26"),
    text(
      " is an enlarged fragmentary vertical sectional view through a portion of that reactor, particularly a uranium rod; ",
    ),
    figure(27, "Fig. 27"),
    text(" is a fragmentary detail sectional view corresponding to "),
    figure(26, "Fig. 26"),
    text(" but showing a modification of the ball-valve seal; "),
    figure(28, "Fig. 28"),
    text(
      " is an enlarged vertical sectional view of a portion of a uranium rod equipped with an adapter for removing the rod; ",
    ),
    figure(29, "Fig. 29"),
    text(" is a horizontal sectional view, partly in elevation, taken on line 29–29 of "),
    figure(25, "Fig. 25"),
    text("; "),
    figure(30, "Fig. 30"),
    text(" is a diagram showing change of critical size in U-C reactors with change in K; "),
    figure(31, "Fig. 31"),
    text(
      " is a longitudinal view, partly in section and partly in elevation, of an air-cooled neutronic reactor system; ",
    ),
    figure(32, "Fig. 32"),
    text(" is a cross-sectional view, partly in elevation, taken on line 32–32 of "),
    figure(31, "Fig. 31"),
    text("; "),
    figure(33, "Fig. 33"),
    text(" is a plan view of the system shown in "),
    figure(31, "Figs. 31 and 32", [32]),
    text("; "),
    figure(34, "Fig. 34"),
    text(" is a longitudinal sectional view, partly in elevation, of a jacketed slug; "),
    figure(35, "Fig. 35"),
    text(
      " is a longitudinal sectional view, partly in elevation, of a horizontal channel during a loading and unloading operation; ",
    ),
    figure(36, "Fig. 36"),
    text(" is a cross-sectional view taken on line 36–36 of "),
    figure(35, "Fig. 35"),
    text("; "),
    figure(37, "Fig. 37"),
    text(" is a vertical sectional view, partly in elevation, of a liquid-cooled reactor; "),
    figure(38, "Fig. 38"),
    text(" is a vertical sectional view, partly in elevation, of the reactor shown in "),
    figure(37, "Fig. 37"),
    text(", taken on line 38–38 of "),
    figure(37, "Fig. 37"),
    text("; "),
    figure(39, "Fig. 39"),
    text(" is a diagrammatic perspective view of a uranium rod and associated coolant channel; "),
    figure(40, "Fig. 40"),
    text(
      " is a diagram showing the statistical weight of concentric lattice portions of uniform K plotted against the extent of the same lattice portions within the structure; ",
    ),
    figure(41, "Fig. 41"),
    text(
      " is a diagram showing the effect of reflectors of various thickness on the size of the reactor; and ",
    ),
    figure(42, "Fig. 42"),
    text(" is a diagram showing the outline of a reactor in the shape, roughly, of an ellipsoid."),
  ]),
  {
    kind: "equation",
    text: "K = 1 − M²A (5)",
  },
  {
    kind: "equation",
    text: "M² = τ + L₀²(1 − f) (11)",
  },
];

const fermiPages30To35ParallelReadings: Readonly<Record<number, readonly string[]>> = {
  18: [
    "PDF page 30 completes the fission-fragment definitions, then explains in Fig. 1 how impurity capture, moderator absorption, and finite-size leakage consume neutrons while about 72 thermal neutrons sustain 100 new fast neutrons in the uranium-graphite chain.",
  ],
  19: [
    "PDF page 30 begins the numbered uranium-resonance-loss and moderator-loss sections: aggregation into bodies at least about 0.5 centimeter reduces surface capture, while the printed absorption-to-scattering ratios compare H2O, diphenyl, beryllium, graphite, and D2O.",
  ],
  20: [
    "PDF page 30 defines danger coefficients from impurity and uranium absorption cross sections, their weighted total danger sum, and the worked H/Co/Ag and Li/Co/Rh examples that reduce the reproduction constant K.",
  ],
  21: [
    "PDF page 31 continues the impurity-loss section, preserving the warnings that boron, cadmium, samarium, and gadolinium can defeat criticality at parts-per-million levels, while nitrogen pressure, oxide/carbide/fluoride chemistry, and moderator choice also affect the chain.",
  ],
  22: [
    "PDF page 31 records the danger-coefficient table and the maximum K values for pure uranium with graphite, beryllium metal or oxide, heavy water, and light water; unresolved column glyphs remain explicitly uncertain in the ledger rather than being fabricated.",
  ],
  23: [
    "PDF page 32 gives the permissible danger-sum thresholds for D2O, beryllium, and graphite, explains removable cadmium control headroom in Fig. 1, distinguishes finite-reactor leakage from infinite-medium K, and introduces the exponential-pile measurement method.",
  ],
  24: [
    "Page 33 presents the exponential-pile lattice model, relaxation distance, migration length, Bessel-series description, and the K equations used to infer reproduction from neutron-density measurements.",
  ],
  25: [
    "Page 33 continues the effective-side, operational-poisoning, indium-foil, harmonic-correction, end-correction, and adjacent-position measurement procedure for K.",
  ],
  26: [
    "Page 34 describes liquid-moderator measurements and defines the migration length as the mean-square displacement between neutron production and disappearance in the lattice.",
  ],
  27: [
    "Page 34 gives the proposed depleted-uranium experiment, exponential-pile Laplacian measurement, borated-water calibration, and the measured migration-length example.",
  ],
  28: [
    "Page 34 states the theoretical migration-length calculation, moderator values, neutron-purity test, and use of M squared in determining critical structure size.",
  ],
  29: [
    "Page 34 states the invention's object and begins the printed drawing inventory with authored semantic references for Figures 1 through 4.",
  ],
  30: [
    "Page 35 preserves the complete printed captions for Figures 5 through 42, including each figure's geometry, reactor embodiment, control component, measurement, reflector, or coolant role.",
  ],
};

export const fermiReactorClaims = [
  {
    number: 1,
    text: "A neutronic reactor which comprises a moderator of graphite and natural uranium rods disposed in a geometric pattern therein, the size of the rods and the volume ratio of moderator to uranium being within the area encompassed by the k = 1.00 curve of Figure 3, the purity of the graphite and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 2,
    text: "A neutronic reactor which comprises a moderator selected from the group consisting of heavy water and graphite and bodies of a thermal neutron fissionable material selected from the group consisting of natural uranium and natural uranium oxide disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the shape of the bodies and the radius of the bodies and the volume ratio of moderator to thermal neutron fissionable material being within the area encompassed by the k = 1.00 curve of Figures 2 through 6, the purity of the moderator and the thermal neutron fissionable material and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 3,
    text: "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium in the form of spheres disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium being within the area encompassed by the k = 1.00 curve of Figure 2, the purity of the moderator and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 4,
    text: "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium oxide in the form of spheres disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium oxide being within the area encompassed by the k = 1.00 curve of Figure 4, the purity of the moderator and the uranium oxide and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 5,
    text: "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium oxide in the form of rods disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium oxide being within the area encompassed by the k = 1.00 curve of Figure 5, the purity of the moderator and the uranium oxide and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 6,
    text: "A neutronic reactor which comprises a moderator of heavy water and bodies of natural uranium in the form of rods disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium being within the area encompassed by the k = 1.00 curve of Figure 6, the purity of the moderator and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
  },
  {
    number: 7,
    text: "In a neutronic reactor having an active portion comprising a moderator of graphite having dispersed therein uranium containing U235 and U238, the improved construction wherein the uranium is aggregated in the form of bodies substantially free of moderator and of neutron absorbers other than U238, said bodies being in the moderator, geometrically spaced therein, and surrounded by the moderator, the moderator being in a substantially continuous phase, said bodies having all dimensions thereof at least 0.5 centimeter, the purity of the moderator and the uranium, the size and spacing of the bodies of uranium in the moderator, and the total mass of uranium and moderator being sufficient to sustain a chain reaction.",
  },
  {
    number: 8,
    text: "In a neutronic reactor having an active portion comprising a mass of moderator selected from the group consisting of graphite and heavy water, having dispersed therein a thermal neutron fissionable material containing a thermal neutron fissionable isotope and an isotope having a resonance absorption for neutrons, the improved construction wherein the thermal neutron fissionable material is aggregated in the form of bodies substantially free of moderator and of neutron absorbers other than said latter isotope, said bodies being in the moderator, geometrically spaced therein, and surrounded by the moderator, the moderator being in a substantially continuous phase, said bodies having all dimensions thereof at least 0.5 centimeter, the purity of the moderator and the thermal neutron fissionable material, the size and spacing of the bodies of fissionable material in the moderator, and the total mass of fissionable material and moderator being sufficient to sustain a chain reaction.",
  },
] as const;

export const FERMI_REACTOR_FIGURE_CAPTIONS: Readonly<Record<`Fig. ${number}`, string>> = {
  "Fig. 1":
    "Diagram or chart illustrating the balanced condition of a chain reaction in a system of practical size employing natural uranium in graphite.",
  "Fig. 2":
    "Graph with contour lines representing reproduction constants K for uranium-metal spheres and graphite.",
  "Fig. 3": "Graph similar to Fig. 2 for cylindrical rods of uranium metal.",
  "Fig. 4":
    "Graph with reproduction-constant K contour lines for a uranium-oxide (UO2) and graphite system using spheres.",
  "Fig. 5":
    "Graph with K contour lines for uranium-oxide (UO2) and graphite using cylindrical rods.",
  "Fig. 6": "Graph showing K contour lines for uranium-metal rods immersed in D2O.",
  "Fig. 7": "Perspective view of a uranium-graphite reactor enclosed in a radiation shield.",
  "Fig. 8": "Front end plan view of the Fig. 7 reactor, partly in central vertical section.",
  "Fig. 9": "Side plan view of the reactor, partly in central vertical section.",
  "Fig. 10": "Top plan view of the reactor, partly in central horizontal section.",
  "Fig. 11":
    "Plan view of a graphite block containing uranium metal, partly broken away to show a uranium-metal cylinder in section.",
  "Fig. 12": "Longitudinal section on line 12–12 of Fig. 11.",
  "Fig. 13":
    "Longitudinal section of a graphite block with uranium-oxide pseudospheres in place of uranium metal.",
  "Fig. 14":
    "Plan view of a graphite block loaded with uranium-oxide pseudospheres, partly broken away on line 14–14 of Fig. 13.",
  "Fig. 15": "Plan view of a dead graphite brick, partly broken away and shown in section.",
  "Fig. 16": "Schematic wiring diagram of a neutron-density monitoring circuit.",
  "Fig. 17":
    "Graph of neutron-density values against the number of layers while a cubical reactor is built.",
  "Fig. 18": "Diagrammatic side view of a safety rod.",
  "Fig. 19": "Diagrammatic side view of a shim or limiting rod.",
  "Fig. 20": "Diagrammatic side view of a control rod.",
  "Fig. 21":
    "Graph of neutron-density value relations against graphite-brick layers for an ellipsoidal reactor.",
  "Fig. 22":
    "Fragmentary perspective view of a modified cubic or parallelepiped active portion with horizontal uranium cylinders or rods.",
  "Fig. 23":
    "Modified cylindrical active portion with vertically disposed uranium cylinders or rods.",
  "Fig. 24": "Diagram of neutron-density distribution in a spherical reactor.",
  "Fig. 25": "Vertical section of a neutronic reactor using deuterium oxide as moderator.",
  "Fig. 26":
    "Enlarged fragmentary vertical section of the Fig. 25 reactor, particularly a uranium rod.",
  "Fig. 27": "Fragmentary detail section of a modified ball-valve seal from Fig. 26.",
  "Fig. 28":
    "Enlarged vertical section of a uranium-rod portion with an adapter for removing the rod.",
  "Fig. 29": "Horizontal section, partly in elevation, on line 29–29 of Fig. 25.",
  "Fig. 30": "Diagram of change in critical size in uranium-carbon reactors with change in K.",
  "Fig. 31":
    "Longitudinal view, partly in section and elevation, of an air-cooled neutronic reactor.",
  "Fig. 32": "Cross section, partly in elevation, on line 32–32 of Fig. 31.",
  "Fig. 33": "Plan view of the system shown in Figs. 31 and 32.",
  "Fig. 34": "Longitudinal section, partly in elevation, of a jacketed slug.",
  "Fig. 35":
    "Longitudinal section, partly in elevation, of a horizontal channel during loading and unloading.",
  "Fig. 36": "Cross section on line 36–36 in Fig. 35.",
  "Fig. 37": "Vertical section, partly in elevation, of a liquid-cooled reactor.",
  "Fig. 38": "Vertical section, partly in elevation, of the Fig. 37 reactor on line 38–38.",
  "Fig. 39": "Diagrammatic perspective view of a uranium rod and associated coolant channel.",
  "Fig. 40":
    "Diagram of statistical weight of concentric, uniform-K lattice portions against their extent within the structure.",
  "Fig. 41": "Diagram of the effect of reflectors of various thickness on reactor size.",
  "Fig. 42": "Diagram of the outline of a roughly ellipsoidal reactor.",
};

export const FERMI_REACTOR_SOURCE_PDF_SHA256 =
  "e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3";
export const FERMI_REACTOR_FIGURE_PREVIEWS = FERMI_REACTOR_FIGURE_CAPTIONS;

function claimInlines(claimText: string) {
  const parts = claimText.split(/(Figures?\s+\d+(?:\s+(?:through|to|and)\s+\d+)?)/i);
  return parts.flatMap((part) => {
    const rangeMatch = part.match(/^Figures?\s+(\d+)\s+(?:through|to)\s+(\d+)/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const nums: number[] = [];
      for (let n = start + 1; n <= end; n++) {
        nums.push(n);
      }
      return [figure(start, part, nums)];
    }
    const match = part.match(/^Figures?\s+(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      return [figure(num, part)];
    }
    return part ? [text(part)] : [];
  });
}

// Bounded WIP intake for the p36–40 continuation inside the requested p30–40
// source range. This is intentionally not publication-complete.
const fermiPages30To40LegacyBlocks: readonly CuratedSpecificationBlock[] = [
  {
    kind: "heading",
    level: 2,
    text: "Specification source chunk, PDF pages 36–40 (p30–40 WIP range)",
  },
  paragraph([
    text(
      "One side of the reactor side wall 11 is pierced by spaced safety-rod apertures 40, through which safety rods 41 can be horizontally inserted from platform 42. The basic construction unit is a graphite block 4 3/4 inches by 4 3/4 inches in cross section, carefully planed so blocks stack in vault space 14 without substantial air spaces. This construction has led the device to be termed a ",
    ),
    term(
      "pile",
      "The patent's period term for the reactor assembled by stacking successive graphite and uranium-bearing layers; reactor is the preferred generic term.",
    ),
    text(
      ". Blocks 50 drilled with cylindrical holes are termed live graphite; blocks 51 containing no uranium, shown in ",
    ),
    figure(15, "Fig. 15"),
    text(
      ", are termed dead graphite. Uranium-metal cylinders 52 and uranium-oxide pseudospheres 54 are placed in the live blocks.",
    ),
  ]),
  paragraph([
    text(
      "Live and dead graphite blocks form a substantially cubical uranium-lump lattice surrounded by dead graphite acting as a ",
    ),
    term(
      "reflector",
      "A surrounding scattering layer that reduces neutron leakage from the active lattice.",
    ),
    text(". Rows are spaced and aligned through vault space 14; removable stringers 36a in "),
    figure(9, "Figs. 9", [10]),
    text(" and "),
    figure(10, "10"),
    text(
      " and removable test unit 56 permit central uranium rows to be withdrawn for tests. Ionization chamber 60 in channel 43 uses boron-fluoride ionization, a 450-volt battery, and galvanometer 70 to monitor neutron density through the ",
    ),
    figure(16, "Fig. 16"),
    text(" circuit."),
  ]),
  paragraph([
    text(
      "From at least the halfway point of construction, natural neutron density is monitored as layers are added. Indium foils are exposed near the approximate center, allowed to stand exactly three minutes, and counted with a standardized Geiger counter; the results are converted to saturation activity A0. ",
    ),
    figure(17, "Fig. 17"),
    text(
      " plots these values against layers and predicts the approach to critical size. Additional dead-graphite layers provide operating margin beyond the slightly-above-fiftieth critical layer, while concrete and water shield against gamma rays and escaping neutrons.",
    ),
  ]),
  paragraph([
    text("The control rod 32 of "),
    figure(20, "Fig. 20"),
    text(
      " uses boron steel, rack 82, pinion 83, motors 85 and 86, limit switches, and a selsyn indicator. The shim or limiting rod 30 of ",
    ),
    figure(19, "Fig. 19"),
    text(" is a cadmium sheet on fiber backing. Safety rods 41 of "),
    figure(18, "Fig. 18"),
    text(
      " are cadmium sheets held out by a solenoid latch; interruption of current releases the latch and gravity inserts the rods. The reactor is useful for isotope manufacture, intense neutron and gamma sources, and material tests; indium-foil activity supplies the printed power calibration.",
    ),
  ]),
  paragraph([
    text("The ellipsoidal prototype used an effective radius to predict the critical layer in "),
    figure(21, "Fig. 21"),
    text(" and became chain reacting after the fifty-seventh layer. "),
    figure(22, "Figs. 22–24", [23, 24]),
    text(
      " relate neutron density to rod lattices and spherical geometry. A D2O reactor uses cylindrical tank 101 with 136 aluminum-sheathed uranium rods 102; raising the heavy-water level predicted criticality at 122.4 centimeters, with doubling times of 37.6 seconds at 123.1 centimeters and 6.52 seconds at 124.7 centimeters. Graphite reflector 104, concrete and lead-cadmium shields, helium circulation, and the sealed, evacuable rod assembly of ",
    ),
    figure(25, "Figs. 25–29", [26, 27, 28, 29]),
    text(
      " complete this chunk. The described D2O reactor operated continuously at 250 kilowatts when properly shimmed.",
    ),
  ]),
];

void fermiPages30To40LegacyBlocks;

// Cloud-facsimile reconciliation packet: PDF pages 36–42. The ledger is the
// page-marked comparison boundary; these blocks are the continuous source face.
const fermiPages36To42ReconciledBlocks: readonly CuratedSpecificationBlock[] = [
  paragraph([
    text("AN ILLUSTRATIVE NEUTRONIC REACTOR HAVING A "),
    term(
      "SOLID MODERATOR",
      "A fixed neutron-slowing medium, here graphite, that surrounds the uranium bodies and provides the continuous matrix in which the chain reaction is arranged.",
    ),
    text(
      "\n\nOne of the simplest ways to accomplish a self-sustaining chain reaction operating by virtue of nuclear fission is to utilize either uranium metal, uranium oxide, or both, aggregated into bodies of substantial size and spaced in a solid moderator such as graphite to form a lattice, and built without the introduction of a cooling system into the reactor. Such a neutronic reactor is shown in ",
    ),
    figure(7, "Figs. 7 to 21", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]),
    text(
      ", inclusive. Fig. 7 shows the neutronic reactor system diagrammatically in perspective and will be first referred to. As the active portion of the reactor loses large quantities of neutrons during operation, and the fission reaction creates gamma radiation, it is desirable to protect operating personnel from the radiations resulting from the chain reaction. In this instance protection is provided by surrounding substantially all of the reactor with concrete or equivalent ",
    ),
    term(
      "shielding",
      "Dense or hydrogenous material placed around the active reactor to attenuate escaping neutron and gamma radiation before it reaches operating personnel.",
    ),
    text(
      ". A heavy concrete foundation 10 is first poured and side walls 11 and connecting backwall 12 are then erected. This provides a ",
    ),
    term(
      "vault space",
      "The enclosed structural volume in which the uranium-graphite lattice is stacked, shielded, monitored, and fitted with rod and removal access.",
    ),
    text(" 14 ("),
    figure(8, "Figs. 8, 9 and 10", [9, 10]),
    text(
      ") in which the chain reacting lattice of uranium and graphite is erected until the vault is filled within about five feet of the top and five feet of the front, as will be later described. The front of the vault is then closed by a front wall 15 formed of concrete, and the top is closed by a top wall 16 which may be of wood and lead layers. The top wall 16 is pierced by a large opening 20, leading to a well 21 extending inwardly to the peripheral layer of uranium bodies in the internal lattice. A smaller adjacent aperture 25 is the exterior opening of a shaft 26 (",
    ),
    figure(8, "Fig. 8"),
    text(
      ") extending into the central portion of the reactor. Front wall 15 is pierced by shim and regulating rod apertures 29 and 29a respectively, positioned on each side of and slightly above the center of front wall 15. A “shim” or limiting rod 30 is positioned on a limiting rod platform 31 and is movable to enter aperture 29 in a horizontal plane; and a regulating or control rod 32 is positioned on a control rod platform 33 to enter aperture 29a in a horizontal plane. Below the plane of these two rod platforms is a removal platform 34 positioned to receive lattice portions that may be removed from the reactor through a removable section channel 35 and from removable stringer channels 36. Details of the rod mechanisms and use of the platforms will later be described.\n\nOne side of the reactor side wall 11 is pierced by a pair of spaced safety-rod apertures 40 through which two safety rods 41 can be horizontally inserted into the reactor from safety-rod platform 42. Just below the safety-rod apertures is an ",
    ),
    term(
      "ionization-chamber channel",
      "A dedicated passage beside the active lattice that houses the neutron-sensitive ionization chamber and its monitoring connection.",
    ),
    text(
      " 43. This completes the description of the exterior of the reactor.\n\nThe basic construction unit used to fill vault space 14 is a graphite block 4 3/4 inches by 4 3/4 inches in cross section, used in a number of lengths. The blocks are carefully planed by woodworking machinery to have smooth rectangular sides and end faces, so that they may be readily piled or stacked to fill the vault space 14 without substantial air spaces. Such construction has led the device to be termed a ",
    ),
    term(
      "pile",
      "The stacked graphite-and-uranium reactor assembly, named for its block construction even though the specification prefers the more generic term reactor.",
    ),
    text(
      ", but the more generic term “reactor” is preferred.\n\nTwo main types of graphite blocks are used as shown in ",
    ),
    figure(11, "Figs. 11–15"),
    text(
      ". Certain blocks 50 are drilled with cylindrical holes spaced 8 1/4 inches center to center to receive the uranium bodies and are termed live graphite. Other blocks 51, as shown in ",
    ),
    figure(15, "Fig. 15"),
    text(
      ", contain no uranium and may be termed dead graphite. The uranium bodies are cast uranium-metal cylinders 52 and uranium-oxide pseudospheres 54, with a few U3O8 cylinders; the oxides are compressed to a density of about 6 grams/cm.³.\n\nThe uranium bodies are placed in holes in blocks 50. These live graphite blocks, together with dead graphite blocks 51, build a uranium-lump lattice of substantially cubical form surrounded by several layers of dead graphite acting as a reflector 17. Three bottom layers of dead graphite are laid on the foundation, and alternate layers may have their blocks crossed at right angles for more uniform distribution of weight.",
    ),
  ]),
  paragraph([
    text(
      "The uranium-bearing rows are spaced by rows of dead graphite, with the uranium bodies aligned across and in depth in vault space 14. The uranium-bearing rows do not begin until 12 inches of dead graphite is laid next to the concrete walls and open front, and three sides have 16 inches of dead graphite. The uranium-bearing portion of the layer is about 17.2 feet wide by 19 1/2 feet deep.\n\nA layer of dead graphite is laid over the first uranium-bearing layer, and the next uranium-bearing layer is laid with the uranium bodies substantially aligned vertically. Thus the uranium lumps form a ",
    ),
    term(
      "cubic lattice",
      "A three-dimensional repeating arrangement in which uranium bodies occupy regular positions within graphite along the rectangular axes of the reactor vault.",
    ),
    text(
      " aligned with the rectangular coordinates of vault space 14. A central portion of metal lumps is positioned in stepped relation between the sixteenth and forty-eighth layers. Removable stringers, indicated at 36a in ",
    ),
    figure(9, "Figs. 9 and 10", [10]),
    text(
      ", permit rows near a central diameter to be removed for test purposes. A horizontal removable section 56 extends from front to rear through the central portion containing metal and is eight rows wide and eight rows high.\n\nAs the reactor is built, matching blocks bored with a vertical 2 3/8-inch hole provide continuity of shaft 26. ",
    ),
    term(
      "Ionization chamber",
      "A gas-filled detector in the reactor channel whose neutron-induced ionization is converted into an electrical signal for monitoring the pile.",
    ),
    text(
      " 60 is installed in channel 43 just inside wall 11; wire line 61 is connected to the monitoring circuit of ",
    ),
    figure(16, "Fig. 16"),
    text(". The sealed chamber casing 62 contains approximately 18 liters of "),
    term(
      "boron fluoride",
      "The detector gas whose neutron absorption produces charged particles and alpha-ray ionization measured by the chamber and galvanometer circuit.",
    ),
    text(
      " at one atmosphere and a central electrode 63. A battery of about 450 volts and galvanometer 70 measure alpha-ray ionization caused by neutron absorption in the boron.\n\nSlots 71 and 72 are provided for the shim and regulating rods, and safety-rod slots 73 are provided at right angles in a higher dead-graphite layer. Construction is continued with the shim rod, control rod, and safety rods fully inserted.",
    ),
  ]),
  paragraph([
    text(
      "At least from the halfway point of construction, the natural neutron density in the pile is monitored as layers are added. Until critical size is reached, the short chains are ",
    ),
    term(
      "convergent",
      "A subcritical chain behavior in which successive generations produce a declining neutron population rather than a self-sustaining or growing reaction.",
    ),
    text(
      ". By plotting neutron density within the pile against the layers, a prediction can be made in advance of the size at which the chain reaction will become self-sustaining. In ",
    ),
    figure(17, "Fig. 17"),
    text(" the results of "),
    term(
      "indium-foil measurements",
      "Activation readings from thin indium detectors placed at known layers, used to estimate neutron density as the pile approaches criticality.",
    ),
    text(
      " are plotted against the number of layers.\n\nThe indium foils are exposed near the approximate center of the structure for a predetermined period, then removed and allowed to stand exactly three minutes so short-lived radioactivity decays substantially to zero. A standardized Geiger counter counts the beta rays. The results are converted to ",
    ),
    term(
      "saturation values",
      "Activity readings normalized to the value expected after sufficiently long irradiation, allowing foil measurements at different exposure histories to be compared.",
    ),
    text(
      " A0. The foils are preferably 4 cm. x 6.4 cm. and have a thickness corresponding to 0.094 grams/cm.².\n\nAs critical size is approached, the steady-state values of A0 approach infinity. The curve therefore indicates in advance the layer at which the system will become chain reacting. The described reactor reached critical size slightly above the fiftieth layer. Four additional dead-graphite layers completed the reflector across the top and gave an effective operating size; the reported doubling times were 90 seconds at layer 51, 32.9 seconds at layer 52, 9.0 seconds at layer 53, and 12.5 seconds at layer 54.\n\nThe concrete walls serve as the main shield against gamma radiation. The water in the concrete slows and absorbs escaping neutrons. The control rod 32 in ",
    ),
    figure(20, "Fig. 20"),
    text(
      " is a boron-steel composite moved by rack 82, pinion 83, motors 85 and 86, and a selsyn indicator 86a. The shim or limiting rod 30 in ",
    ),
    figure(19, "Fig. 19"),
    text(" is a cadmium sheet on fiber backing. The safety rods 41 in "),
    figure(18, "Fig. 18"),
    text(
      " are cadmium sheets held out by a solenoid latch; interruption of current releases the latch and gravity inserts the rods.",
    ),
  ]),
  paragraph([
    text(
      "The reactor is capable of operation at an output as high as 10,000 kilowatts for short periods. Since it is ",
    ),
    term(
      "conductively cooled",
      "Cooled by transferring reaction heat through the reactor's surrounding structure rather than circulating a fluid directly through the active lattice.",
    ),
    text(
      " only small powers can be continuously maintained without appreciable internal temperature rise. It is useful for manufacture of radioactive elements, as an intense source of neutrons through well 21 and shaft 26, as a generator of high-energy gamma rays, and for testing materials with removable stringers.\n\nThe power at a measurement location can be calculated from standard indium-foil ",
    ),
    term(
      "saturation activity",
      "The normalized radioactivity reached by an indium foil after irradiation, used as a proxy for local neutron density and calibrated reactor power.",
    ),
    text(
      " A0. Assuming the total energy produced per fission is 200 million electron volts, equivalent to 3.2 x 10^-4 ergs, the specification gives the power relation in its printed formula [PDF p. 39 formula glyphs unresolved]. Indium-foil measurements can calibrate galvanometer 70 in terms of watts.\n\nA prototype operated at about 200 watts and was then dismantled for incorporation in the larger reactor. Its active portion was a ",
    ),
    term(
      "flattened rotational ellipsoid",
      "An ellipsoidal active region compressed along one axis, described by polar and equatorial semi-axes for estimating its neutron behavior and effective size.",
    ),
    text(
      " with a polar semi-axis of 309 centimeters, an equatorial semi-axis of 388 centimeters, an ",
    ),
    term(
      "effective radius",
      "A radius assigned to a non-spherical reactor shape so its measured neutron-density and critical-layer behavior can be compared with a simpler equivalent geometry.",
    ),
    text(
      " of about 355 centimeters, and an average K constant of about 1.054. It was surrounded by about 12 inches of graphite.\n\nThe changing shape during construction is represented by an effective radius R_eff calculated from the sides a, b, and c of a rectangular parallelepiped fitted to the structure. Values of R_eff are plotted against A0 and layers to predict the critical layer in ",
    ),
    figure(21, "Fig. 21"),
    text(". This reactor became chain reacting after the fifty-seventh layer."),
  ]),
  paragraph([
    text("The "),
    term(
      "neutron-density distribution",
      "The spatial variation of neutron population through the active reactor, used to identify the center maximum and peripheral leakage behavior.",
    ),
    text(" in a spherical reactor is shown in "),
    figure(24, "Fig. 24"),
    text(
      ". The maximum density occurs at the center and falls toward the periphery approximately as a ",
    ),
    term(
      "cosine curve",
      "The approximate radial profile of neutron density in a spherical reactor, highest at the center and declining toward the boundary.",
    ),
    text(". Rod geometries can also be used: in "),
    figure(22, "Fig. 22"),
    text(" the uranium rods 75 are horizontal in bores 76 in live graphite blocks 77, while in "),
    figure(23, "Fig. 23"),
    text(" the rods and blocks are stacked vertically to form a cylindrical active portion."),
  ]),
  paragraph([
    text("A chain reaction can also be maintained in a uranium-"),
    term(
      "D2O reactor",
      "A reactor using heavy water as the neutron moderator, allowing low absorption during slowing and a comparatively high reproduction factor K.",
    ),
    text(
      ". Tank 101 is cylindrical and is made of a material relatively non-corrosive at low temperatures and relatively non-absorbent to neutrons, such as aluminum or stainless steel. One suitable tank is 6 feet in diameter and 7 feet 4 inches high. It contains 136 uranium-metal rods 102, each 1.1 inches in diameter and sheathed by aluminum about .035 inch thick.\n\nThe ",
    ),
    term(
      "critical size",
      "The reactor dimensions or filled moderator level at which neutron production balances absorption and leakage so a self-sustaining chain reaction can be maintained.",
    ),
    text(
      " is predicted by raising the level of D2O and plotting reciprocal neutron densities against the overall size of the filled portion. In the described reactor criticality occurred at a D2O level of 122.4 centimeters; an operating size with a neutron-density doubling time of 37.6 seconds was obtained at 123.1 centimeters, and at 124.7 centimeters the doubling time was 6.52 seconds. Graphite reflector 104 surrounds tank 101, and concrete shield 105 prevents neutron and gamma radiation from escaping.\n\nThe ",
    ),
    term(
      "liquid-moderator structure",
      "The tanked reactor arrangement in which heavy water surrounds the uranium rods and carries the moderator, shielding, gas space, and control hardware.",
    ),
    text(
      " further includes a cooled lead-cadmium shield 107, cover plate 108, iron and Masonite shield 109a, and a central ",
    ),
    term(
      "irradiation well",
      "A central access space through which materials can be exposed to the reactor's neutron and gamma flux without dismantling the active tank.",
    ),
    text(
      " 109b. Helium is circulated above the D2O to remove gases formed by decomposition. Rod 102 in ",
    ),
    figure(26, "Fig. 26"),
    text(" is sealed in aluminum tubing and can be evacuated and leak-tested; "),
    figure(27, "Fig. 27"),
    text(" shows a gasket seal, "),
    figure(28, "Fig. 28"),
    text(" an attachment used during fabrication, and "),
    figure(29, "Fig. 29"),
    text(
      " hollow cadmium control and safety rods. The described uranium-D2O reactor was operated continuously at 250 kilowatts when filled to higher levels and properly shimmed.",
    ),
  ]),
  paragraph([
    text(
      "The following table sets forth constants for representative beryllium-uranium reactors, as presently known.\n\nBERYLLIUM METAL, DENSITY 1.85 GM./CM.3",
    ),
  ]),
  {
    kind: "table",
    headers: [[text("")], [text("U sphere")], [text("U rod")], [text("Slab")]],
    rows: [
      [
        [text("Radius of uranium bodies")],
        [text("5.0 cm.")],
        [text("3.5 cm.")],
        [text("1.5 cm. (thickness)")],
      ],
      [
        [text("Critical cylinder")],
        [text("165 x 309.1 cm.")],
        [text("165 x 304.9 cm.")],
        [text("79 x 343.8 cm.")],
      ],
      [[text("Amount of beryllium")], [text("515 tons")], [text("48.9 tons")], [text("63 tons")]],
      [[text("Amount of uranium")], [text("")], [text("47.3 tons")], [text("69.2 tons")]],
      [[text("K constant")], [text("")], [text("1.0982")], [text(".842")]],
    ],
  },
  paragraph([
    text(
      "BERYLLIUM OXIDE, DENSITY 2 GM./CM.3\n\nRadius of uranium bodies: 3.0 cm. (U sphere); 1.5 cm. (U rod). Critical cylinder: 94.2 x 358 cm. (U sphere); 199.3 x 368 cm. (U rod). Amount of beryllium oxide: 134 tons (U sphere); 145 tons (U rod).",
    ),
  ]),
  paragraph([
    text(
      "With an efficient reflector, critical amounts of beryllium and uranium can be reduced a few per cent. Sphere and rod geometry as shown herein can be used with light water to give K factors around unity even with natural uranium. For example, a K constant slightly over 1 has been obtained by using uranium rods 1.5 centimeters in diameter, placed parallel in light water with a volume ratio of water to uranium metal of 1.65. ",
    ),
    term(
      "Diphenyl",
      "An organic liquid moderator whose low neutron-absorption behavior resembles light water while requiring closed circulation and offering a modest K advantage.",
    ),
    text(
      " can also be used as a moderator and closely resembles light water, giving a gain of from 2 to 4 per cent in K. With either moderator, slight enrichment of the uranium with U233, U235, or U239 will provide a K sufficiently greater than unity to enable construction of operating reactors.\n\nA water or diphenyl lattice may be used as part of a reactor, with a ",
    ),
    term(
      "seed portion",
      "A central lattice zone deliberately given a higher reproduction factor so it raises the average K of a composite reactor to a practical operating value.",
    ),
    text(
      " having a higher K in the center so that the average K is sufficiently above unity for a practical size. A heavy-water lattice can provide the higher-K center of a composite device. Water lattices are also useful as reflectors around other reactors and are efficient because neutron reproduction takes place in them.",
    ),
  ]),
  {
    kind: "heading",
    level: 2,
    text: "REDUCTION OF LOSSES DUE TO RESONANCE CAPTURE",
  },
  paragraph([
    text(
      "Limit curves for theoretically pure natural-uranium metal spheres and rods and oxide spheres and rods are shown in ",
    ),
    figure(2, "Figs. 2, 3, 4, 5, and 6", [3, 4, 5, 6]),
    text(
      " for various moderators. The shapes and extents of the curves are based on K being proportional to the product of three factors: p, the probability that a fast fission neutron escapes ",
    ),
    term(
      "resonance capture",
      "Absorption of a slowing neutron by uranium at an intermediate resonance energy before it reaches the thermal range where it can support the chain reaction.",
    ),
    text(
      " and becomes a thermal neutron; f, the fraction of thermal neutrons absorbed by uranium rather than carbon; and e, the factor by which fission increases the number of neutrons before the fast fission neutrons leave the uranium lump. The factors can be computed separately from experimentally determined constants. The proportionality factor was fixed from measurements of subcritical pile structures and operating reactors, so the K values are accurate within the limits of this measurement.",
    ),
  ]),
  paragraph([
    text("The contours in "),
    figure(2, "Figs. 2 and 4", [4]),
    text(" represent spherical uranium metal and UO2 lumps embedded in graphite. "),
    figure(3, "Figs. 3 and 5", [5]),
    text(" represent cylindrical rods extending through the reactor, and "),
    figure(6, "Fig. 6"),
    text(
      " represents uranium-metal rods in a D2O moderator. Radii are plotted on the ordinates and moderator-to-uranium volume ratios on the abscissae; the parenthetical values give ",
    ),
    term(
      "unit-cell ratios",
      "The moderator-to-fuel volume relationships assigned to one repeating spherical or cylindrical lattice cell in the plotted geometry.",
    ),
    text(" for the spherical or cylindrical lattice geometry."),
  ]),
  paragraph([
    text("In "),
    figure(2, "Fig. 2"),
    text(
      ", if the radii of metallic uranium spheres are less than about 0.3 centimeter, K is less than unity for all volume ratios and a self-sustaining chain reaction cannot be built, regardless of overall size. For spheres larger than 0.3 centimeter, K can exceed unity when the graphite-to-uranium ratio lies within the graph limits. ",
    ),
    figure(3, "Fig. 3"),
    text(
      " shows that rod geometry permits a limiting radius of about 0.25 centimeter. The innermost contour in ",
    ),
    figure(2, "Fig. 2"),
    text(
      " is about K = 1.09; the maximum is about K = 1.10 for theoretically pure spheres of about 2.75 centimeters radius and a volume ratio of about 54 carbon to 1 uranium.",
    ),
  ]),
  paragraph([
    text("For uranium-oxide spheres in "),
    figure(4, "Fig. 4"),
    text(
      ", no chain reaction occurs below about 1.2 centimeters radius. The optimum is about K = 1.06 for spheres of about 5.75 centimeters radius and a volume ratio of 18.7 carbon to 1 uranium. In ",
    ),
    figure(5, "Fig. 5"),
    text(
      " the minimum oxide-rod radius for K greater than unity is about 0.75 centimeter; the optimum, over K = 1.04, is near 3.75 centimeters radius and a volume ratio of about 17.5 carbon to 1 uranium. Rod geometry gives somewhat smaller K values than sphere geometry, but aggregation still permits a practical reactor with uranium oxide.",
    ),
  ]),
  paragraph([
    text(
      "Rods or rods made from short slugs in end-to-end relation are often preferable to spheres because they can be removed without tearing down the reactor and readily incorporated into fluid heat-absorbing systems. The K curves for uranium-metal rods in ",
    ),
    figure(6, "Fig. 6"),
    text(
      " have higher K constants than the graphite curves. Optimum K values of about 1.3 can be obtained with rods of about 2.25 to 2.5 centimeters radius at volume ratios from 40 to 80 D2O to 1 uranium. The favorable scattering-to-absorption ratio and the shorter neutron migration length make a D2O reactor smaller than a graphite or beryllium reactor.\n\nFor any fixed body size, K falls from its maximum when the volume ratio increases or decreases from the optimum. The same occurs when body size changes from its optimum. The designer can choose a contour point to save uranium, reduce moderator, maximize production of U239, or limit the overall size. The curves are shown only through the economical ranges, but extrapolated areas also sustain reactions above critical size. Aggregation and enrichment with U233, U235, or U239 increase K and reduce the required overall size; enrichment widens the volume-ratio limits but does not remove the need for aggregation.",
    ),
  ]),
];

// Cloud-facsimile reconciliation packet: PDF pages 43–49. Pages 50–58 remain
// WIP below; no paragraph from that downstream range is included here.
const fermiPages43To49ReconciledBlocks: readonly CuratedSpecificationBlock[] = [
  paragraph([
    text(
      "The curves account for resonance and moderator losses only. True K values for available materials must include impurity losses.",
    ),
  ]),
  {
    kind: "heading",
    level: 2,
    text: "REDUCTION OF NEUTRON LOSSES DUE TO IMPURITIES IN THE MATERIALS",
  },
  paragraph([
    text(
      "Uranium and its compounds can be produced substantially free from neutron-absorbing impurities. A composition with high neutronic purity need not be chemically pure; it is substantially free of elements having a high danger sum, while oxygen, fluorine, carbon, beryllium, and other low-danger elements may remain. Hydrochloric-acid leaching of pitchblende can give uranium oxide better than 99.5 per cent chemically pure while leaving high neutron-capture elements in parts-per-million quantities. High-neutronic-purity compositions have danger sums in K units below 0.3, preferably below 0.01.",
    ),
  ]),
  paragraph([
    text(
      "One illustrative process forms an ether solution of uranyl nitrate, washes impurities from it with small quantities of water, and recovers purified uranyl nitrate. Impure uranium oxide is treated with nitric acid, filtered, boiled to uranyl nitrate hexahydrate, and evaporated. The crystals are treated with ether; the resulting ether solution is extracted with small portions of water. High-absorption impurities dissolve more readily in water than in ether. Uranium loss is kept low by using only one-half to five per cent water by volume and by using water already saturated with uranyl nitrate. The term water extraction includes aqueous uranyl-nitrate solutions.",
    ),
  ]),
  paragraph([
    text(
      "Successive water portions give purified uranyl nitrate of extremely high neutronic purity. It may be recovered by evaporating the ether or by extracting it with substantially pure water, then converted to U3O8, UO2, uranium tetrafluoride, uranium hexafluoride, metal, or carbide. For large-scale production, one ether solution and as many water extractions as necessary are used. The final water extraction removes most uranyl nitrate from the ether.",
    ),
  ]),
  paragraph([
    text(
      "The purified nitrate can be calcined to UO3 and reduced with hydrogen to UO2. UO2 is neutronically pure enough for a self-sustaining system despite its oxygen content, but its uranium density is lower than metal and its critical size is larger. UO2 can be converted with fluorine to uranium tetrafluoride, which is reduced with finely divided magnesium in a calcium-oxide-lined iron bomb. The uranium collects as massive billets weighing 10 to 200 pounds and can be recast in graphite crucibles without air, then machined into rods, tubes, or other forms.",
    ),
  ]),
  paragraph([
    text(
      "Uranium carbide, uranium tetrafluoride, and uranium hexafluoride will also support a chain reaction with a proper moderator and allowance for bulk-density changes. To determine the efficiency of purification, an exponential pile with the same geometry and moderator can compare compositions directly in terms of K. A simpler ",
    ),
    term(
      "“shotgun test”",
      "A comparative neutron-absorption test in which impurities removed from a known uranium sample replace a standard boron absorber near a detector foil.",
    ),
    text(
      " places a thin neutron detector, such as indium foil near a neutron source inside paraffin, and compares its induced radioactivity with that produced when a standard boron pellet is replaced by a pellet containing impurities removed from a known uranium sample. The resulting danger sum is expressed as an equivalent boron absorption, from which K reduction is calculated.",
    ),
  ]),
  paragraph([
    text(
      "For a representative 10-kilogram uranium sample, the impurity pellet is made by exhaustive ether-water purification. The absorption ratio is the absorption of impurities in the pellet, expressed in equivalent milligrams of boron, divided by the absorption of 10 kilograms of uranium, also expressed in equivalent milligrams of boron. The latter is about 4,560 milligrams of boron. The ratio approximates the change in K. Analyses of residual impurities in metallic uranium produced from purified UO2 show danger sums on the order of 0.003 to 0.0053 K units when contamination is avoided.",
    ),
  ]),
  paragraph([
    text(
      "Graphite impurities are important because a uranium-graphite reactor uses roughly ten times as much moderator by weight as uranium. Graphite is made by impregnating calcined petroleum coke with pitch and graphitizing it under heat; careful selection of the raw materials, particularly for boron and vanadium, can limit the K reduction to about 0.01 to 0.015. D2O is produced at about 99.8 per cent purity, with light water as its principal impurity. Other contamination generally comes from tanks and uranium rod sheaths and can be removed by distillation. Neutron bombardment tends to purify a moderator: boron is converted to lithium, and light water in D2O is converted toward heavy water.",
    ),
  ]),
  paragraph([
    text(
      "The neutron detector foil test measures thermal-neutron density by induced radioactivity. A boron absorber lowers the density near the foil; replacing it with the extracted impurities permits a direct comparison. This gives the impurity danger sum and the corresponding K reduction without relying solely on chemical analysis.",
    ),
  ]),
  { kind: "heading", level: 2, text: "EFFECT OF A COOLING SYSTEM IN A NEUTRONIC REACTOR" },
  paragraph([
    text(
      "Reactors conductively cooled by dissipating reaction heat through their exterior can operate continuously only at low power, or at high power for short periods. A coolant may be circulated for continuous high-power operation, but its neutron absorption and that of any coolant pipes must be included in the neutronic design.",
    ),
  ]),
  paragraph([
    text(
      "In a uranium-graphite reactor, the approximate heat sources are: gamma radiation, 23 million electron volts per fission (11 per cent); beta radiation, 11 (6 per cent); kinetic energy of fission fragments, 159 (79 per cent); and kinetic energy of neutrons, 7, for a total of 200 million electron volts per fission. About 184 MeV, or 92 per cent, is generated in uranium, 12 MeV, or 6 per cent, in graphite, and 4 MeV, or 2 per cent, outside the pile. Coolant and pipes may be arranged in heat-exchange relation to the moderator, the uranium bodies, or both.",
    ),
  ]),
  paragraph([
    text(
      "Aluminum tubes carrying water through the moderator provide one simple cooling system, but moderator cooling alone is limited to about 1,000 kilowatts because most moderators conduct heat poorly. Direct cooling of uranium is useful at higher powers, although uranium must be protected from chemical reaction with the coolant and radioactive fission fragments must be kept out of the coolant stream. Otherwise the external piping and circulating machinery would require heavy shielding and could remain inaccessible after shutdown.",
    ),
  ]),
  paragraph([
    text(
      "Air cooling has been used for a uranium-graphite reactor operating continuously up to 3,000 kilowatts, in the construction shown in ",
    ),
    figure(31, "Figs. 31 through 36", [32, 33, 34, 35, 36]),
    text(
      ". In any moderator, neutron bombardment during operation tends to reduce some absorbers: boron captures a neutron and emits an alpha particle to become lithium, and light water contamination in D2O is reduced by neutron capture. Absorbing materials formed in uranium during high-neutron-density operation are considered separately.",
    ),
  ]),
  { kind: "heading", level: 2, text: "AN ILLUSTRATIVE GAS-COOLED NEUTRONIC REACTOR" },
  paragraph([
    text(
      "A gas-cooled structure comprises closely stacked graphite blocks 209 forming a cube 210, as shown in ",
    ),
    figure(31, "Figs. 31 and 32", [32]),
    text(
      ". The cube may be 24 to 26 feet on a side on concrete foundation 211. Horizontal square air channels 212, with one diagonal vertical, pass from inlet face 214 to outlet face 215; about 2,000 channels may be provided, and unused channels may be plugged. A concrete inlet duct 216, air filter 220, and electrically driven fan 221 supply air to the inlet chamber 225. Concrete top shield 226 and side shields 228 enclose the cube. Outlet shield 230, outlet chamber 231, and stack 234 carry air above ground; the concrete shields, five to twenty feet thick, reduce escaping neutrons and gamma radiation.",
    ),
  ]),
  paragraph([
    text(
      "Uranium bodies are placed in the channels so that the reproduction ratio is slightly above unity, after accounting for internal and exterior losses. About 700 channels, each loaded with 68 aluminum-jacketed uranium slugs 235 end to end at seven-inch spacing, give a reproduction ratio of unity for a roughly cylindrical active portion. Graphite and uranium should have the highest available purity. To obtain a rise in neutron density, about 1,000 channels may be loaded, giving an operating ratio near 1.005; neutron-absorbing material is then inserted to hold the ratio at unity. Unloaded channels may be plugged with graphite, while peripheral channels may remain open for cooling.",
    ),
  ]),
  paragraph([
    text("The preferred slug construction is shown in "),
    figure(34, "Fig. 34"),
    text(
      ". Each uranium slug 235 is 1.1 inches in diameter and 4 inches long in an aluminum jacket about 20 mils thick. The uranium portion 236 is machined and cleaned, inserted into a jacket can 237, drawn through a sizing die for thermal contact, and sealed with cap 238 and seam weld 240. The jacket prevents air corrosion and keeps fission fragments from entering the air stream.",
    ),
  ]),
  paragraph([
    text(
      "The active portion of the air-cooled reactor is loaded above critical size, for example at a reproduction ratio of about 1.005 with absorbers withdrawn. At seven-inch slug spacing the volume ratio is about 47 carbon to 1 uranium and the rod-lattice K is about 1.06. With about one per cent of fission neutrons delayed for a mean time of about five seconds, neutron density doubles every eight to fifteen seconds. Partial insertion of absorbers slows the rise; near the critical rod position a single doubling may take several hours. When the desired density is reached, inserted absorbers reduce the ratio to unity.",
    ),
  ]),
  paragraph([
    text("Control rod 241, shown diagrammatically in "),
    figure(32, "Fig. 32"),
    text(
      ", slides in a graphite channel and is moved by rack and pinion 242. It contains cadmium or boron; shim and safety rods 241a and 241b are also provided. Heat is generated chiefly in the uranium. Aluminum jackets melt at 658 C., and uranium melts at about 1,100 C.; stable temperature must therefore remain below these limits. Atmospheric air passed through the graphite channels and directly over the aluminum jackets permits continuous operation at 250 kilowatts with 32,000 cubic feet per minute and at 500 kilowatts with about 50,000 cubic feet per minute. Increasing fan capacity has permitted continuous operation at 3,000 kilowatts.",
    ),
  ]),
  paragraph([
    text("Loading apertures 245 in the inlet shield, shown in "),
    figure(31, "Figs. 31 and 35", [35]),
    text(
      ", align with the slug channels. Lead plugs 246 normally close the apertures. A charging tube 247 and plunger mechanism 251 push slugs into a channel while air continues to circulate. The loading mechanism is carried by elevator platform 256 and frame 257 alongside supply car 261. Initial loading starts with central channels and proceeds outward while neutron activity is checked. The control rod is inserted as critical size is approached; removal of the rod and measurement of neutron-density doubling time gives the reproduction ratio. The active core may contain 34 to 50 tons of uranium, and graphite plugs fill unused channels.",
    ),
  ]),
  paragraph([
    text(
      "After loading, the fan is started and the control rod withdrawn until the desired power and stable temperature are reached, then advanced until the reproduction ratio is unity. Air passing through the reactor becomes radioactive and is exhausted from a stack, for example 200 feet above ground. After a run sufficient to produce U239, such as 100 days at 500 kilowatts, the reactor is shut down by fully inserting the control rod and waiting about one-half hour for delayed neutron emission and short-lived activity to subside.",
    ),
  ]),
  { kind: "heading", level: 2, text: "AN ILLUSTRATIVE LIQUID-COOLED NEUTRONIC REACTOR" },
  paragraph([
    text(
      "Unloading may be performed by pushing slugs out of the channels, or by inserting fresh slugs so that they push irradiated slugs out. The slugs fall from outlet face 215 into outlet chamber 231 and onto angular pad plates 290, then roll into outlet pipe 291 with valves 292 and 294. The pipe opens into coffin chamber 295 and tunnel 296, where coffin car 299 carries slug coffins 301. Rods 302 and 304 operate the valves behind lead shield 305; crane 306 places caps on filled coffins. Water fills the upper pipe while air circulation is maintained at about one-quarter operating flow. The slugs are cooled in water, then aged under water for about thirty days before chemical treatment.",
    ),
  ]),
  paragraph([
    text(
      "The additional losses in this air- or helium-cooled system are principally absorption in the aluminum jackets, with a small loss from moderator removed to form the air channels. The K reduction can be about 0.005. Liquid cooling requires pipes to keep the coolant out of the moderator; both the coolant and its pipes can have substantial neutron absorption.",
    ),
  ]),
  paragraph([
    text(
      "For powers above 1,000 to 3,000 kilowatts, water or diphenyl may be used as a liquid coolant. Jacketed uranium slugs or rods are placed in pipes so the coolant flows around them. A representative reactor for outputs up to 100,000 kilowatts is shown in ",
    ),
    figure(37, "Figs. 37, 38, and 39", [38, 39]),
    text(
      ". Graphite-block reactor 350 is surrounded by graphite reflector 351 and enclosed in fluid-tight steel casing 352, supported by I-beams 354 in concrete tank 355. Water 356 shields neutrons and gamma radiation; charging face 357 has shield tank 358 filled with lead shot and water. Aluminum coolant tubes 359 pass through the concrete wall, shield tank, graphite moderator, and casing outlet face 362. Water enters through manifolds, discharges into tank 355, and leaves through outlet pipe 365.",
    ),
  ]),
  paragraph([
    text(
      "The tubes are loaded with aluminum-jacketed uranium slugs 372 in end-to-end relation. Water may pass once through the reactor or be cooled and recirculated; diphenyl requires a closed system. Loading and unloading use the gas-cooled mechanisms. Control rod 370, ionization chamber 371, and shim and safety rods 370a and 370b provide control and monitoring. In ",
    ),
    figure(39, "Fig. 39"),
    text(
      " the slugs rest on projections 373 inside coolant tubes 359, providing a uniform coolant annulus.",
    ),
  ]),
  paragraph([
    text(
      "For one liquid-cooled uranium-graphite example designed for continuous operation at about 100,000 kilowatts, uranium rods in near-optimum graphite geometry give K about 1.07. Aluminum jackets and pipes reduce K by 0.013, coolant reduces K by 0.023, and the total reduction is 0.036, leaving K about 1.034. The principal dimensions are: active-cylinder axial length 7 meters; radius 4.94 meters; uranium-metal weight 200 metric tons; graphite weight 850 metric tons; uranium-rod radius 1.7 centimeters; aluminum jacket thickness 0.5 millimeter; aluminum-pipe thickness 1.5 millimeters; liquid annulus 2.2 millimeters with water or 4 millimeters with diphenyl; 1,695 rods; aluminum weight 8.7 metric tons; and square-array rod spacing 21.3 centimeters.",
    ),
  ]),
  paragraph([
    text(
      "Diphenyl permits a thicker coolant annulus because its danger sum is smaller for a given volume and its boiling temperature is higher. Against this advantage are the need for closed circulation and possible polymerization, which requires make-up fluid. Liquid coolants are suited to outputs up to 500,000 kilowatts. Since K minus 1 for uranium-graphite reactors is only about 0.1, coolant quantity must be limited. D2O uranium-rod reactors can tolerate a larger impurity fraction because K minus 1 can approach 0.3. D2O can itself be used as coolant, reducing parasitic absorption.",
    ),
  ]),
  paragraph([
    text(
      "By treating coolant and structural elements as parasitic impurities, evaluating their K reduction, and using the resulting K to determine critical and operating sizes, reactors for desired powers can be designed.",
    ),
  ]),
  { kind: "heading", level: 2, text: "USE OF DIFFERENT LATTICES IN THE SAME NEUTRONIC REACTOR" },
  paragraph([
    text(
      "The first uranium-graphite reactor used two lattice zones with different uranium forms. Other reactors may have zones with different K values and wholly different moderators. A D2O-moderated central portion can raise the average K of a composite reactor; a uranium-H2O lattice can be used around a uranium-D2O center. Such arrangements permit a practical operating size even when one lattice has a low K.",
    ),
  ]),
];

// Bounded WIP intake for PDF pages 41–50. These blocks continue the source
// reading after p30–40 and remain explicitly unpublished until the complete
// 58-page facsimile, ledger, figures, and certificate are independently checked.
const fermiPages41To50Blocks: readonly CuratedSpecificationBlock[] = [
  {
    kind: "heading",
    level: 2,
    text: "Specification source chunk, PDF pages 41–50 (p41–50 WIP range)",
  },
  paragraph([
    text(
      "The patent tabulates representative beryllium-uranium reactors and notes that an efficient ",
    ),
    term(
      "reflector",
      "A surrounding moderator or scattering layer that reduces neutron leakage and therefore lowers the critical quantity of fuel and moderator.",
    ),
    text(
      " can reduce critical amounts by a few per cent. Light-water lattices can give K around unity with natural uranium; diphenyl resembles light water and can increase K by roughly two to four per cent. A higher-K seed or central heavy-water portion can raise the average K of a composite reactor, while water lattices can also serve as efficient reflectors.",
    ),
  ]),
  paragraph([
    text("The resonance-loss curves in "),
    figure(2, "Fig. 2"),
    text(", "),
    figure(3, "Fig. 3"),
    text(", "),
    figure(4, "Fig. 4"),
    text(", "),
    figure(5, "Fig. 5"),
    text(", and "),
    figure(6, "Fig. 6"),
    text(
      " are based on K = pfe: p is the probability that a fast fission neutron escapes resonance capture and becomes thermal, f is the fraction of thermal neutrons absorbed by uranium rather than carbon, and e is the fission-neutron multiplication factor. The graphs use uranium-metal and uranium-oxide spheres and rods in graphite and uranium rods in D2O, with body radius and moderator-to-uranium volume ratio as coordinates.",
    ),
  ]),
  paragraph([
    text(
      "The curves show minimum body radii and optimum K values for metal spheres, metal rods, oxide spheres, oxide rods, and D2O rods. Rods or short slugs in end-to-end relation are useful where fuel must be removed without dismantling the moderator or incorporated into a heat-absorbing system. K decreases when body size or moderator ratio moves away from the optimum. Enrichment with U233, U235, or U239 increases K and reduces the required overall size, but does not eliminate the need for uranium aggregation.",
    ),
  ]),
  paragraph([
    text(
      "The true reproduction factor must include losses from impurities. A composition of high ",
    ),
    term(
      "neutronic purity",
      "A composition substantially free of elements with large neutron-capture danger sums; it need not be chemically pure if remaining elements have low capture effects.",
    ),
    text(
      " may contain oxygen, fluorine, carbon, or beryllium while remaining suitable for a chain reaction. The specification describes nitric-acid conversion of impure uranium oxide to uranyl nitrate, ether solution, and repeated water extraction. High-capture impurities preferentially dissolve in the water. Purified nitrate can be calcined to UO3, reduced to UO2, or converted through uranium tetrafluoride and magnesium reduction to massive metal billets.",
    ),
  ]),
  paragraph([
    text("The purification process is evaluated by an exponential-pile comparison or by a "),
    term(
      "shotgun test",
      "A neutron-absorption comparison in which a detector foil and a standard boron absorber are replaced by a pellet containing impurities removed from a known uranium sample.",
    ),
    text(
      ". The absorption is expressed in equivalent boron and divided by the absorption of ten kilograms of uranium; the ratio approximates the K reduction caused by the impurities. Graphite requires careful selection of petroleum coke and pitch, especially for boron and vanadium. D2O is ordinarily about 99.8 per cent pure and can be redistilled if tank or sheath contamination becomes important.",
    ),
  ]),
  paragraph([
    text(
      "A cooling system must remove fission heat without adding excessive neutron absorption. Gamma radiation contributes about 11 per cent, beta radiation 6 per cent, fission-fragment kinetic energy 79 per cent, and neutron kinetic energy the balance of the approximately 200 MeV per fission. About 92 per cent is generated in uranium, 6 per cent in graphite, and 2 per cent outside the pile. Coolant and tubes may exchange heat with the moderator, the uranium, or both; direct uranium cooling is preferred at higher powers because graphite conducts heat poorly.",
    ),
  ]),
  paragraph([
    text("The gas-cooled reactor of "),
    figure(31, "Figs. 31 through 36", [32, 33, 34, 35, 36]),
    text(
      " uses a 24- to 26-foot graphite cube with roughly 2,000 square air channels, inlet filter and fan, concrete top and side shields, outlet chamber, and elevated stack. About 700 channels loaded with 68 aluminum-jacketed uranium slugs can reach unity; loading about 1,000 channels produces a small excess that is absorbed by movable cadmium or boron rods. Each slug in ",
    ),
    figure(34, "Fig. 34"),
    text(
      " is about 1.1 inches in diameter and 4 inches long, sealed in an aluminum jacket to conduct heat and retain fission fragments.",
    ),
  ]),
  paragraph([
    text(
      "Air cooling can operate continuously at 250 or 500 kilowatts with the stated flow rates and at higher output with increased fan capacity. Loading apertures and a plunger mechanism in ",
    ),
    figure(35, "Fig. 35"),
    text(
      " push slugs through the channels while air continues to circulate. The control rod is inserted as critical size is approached; neutron-density doubling time after withdrawal gives the reproduction ratio. After a run, the rod is fully inserted, delayed emission is allowed to cease, and irradiated slugs are pushed into a water-filled outlet and aged under water before chemical treatment. The added K reduction from jackets and air channels is about 0.005.",
    ),
  ]),
  paragraph([
    text("The liquid-cooled reactor in "),
    figure(37, "Figs. 37, 38, and 39", [38, 39]),
    text(
      " places aluminum-jacketed uranium slugs in coolant tubes through a graphite core surrounded by a reflector, steel casing, concrete tank, and water or lead-shot shield. Water may flow once through the tubes or be recirculated; diphenyl requires a closed system. A representative 100,000-kilowatt design has a seven-meter active length, 4.94-meter radius, 200 metric tons of uranium, 850 metric tons of graphite, 1,695 rods, and a 21.3-centimeter square-array spacing. Jacket, pipe, and coolant parasitic losses reduce K from about 1.07 to about 1.034.",
    ),
  ]),
  paragraph([
    text(
      "Different moderator lattices can be combined in concentric zones. A D2O center can raise the average K of a graphite or light-water structure; a lower-K center can flatten the neutron-density curve. The statistical-weight curves in ",
    ),
    figure(40, "Fig. 40"),
    text(
      " weight material by position, because a given mass near the center is more effective than the same mass near the edge. For concentric cylinders, cubes, or spheres, the average K follows from the zone K values, migration lengths, and the weighted radii or side lengths. Critical size can then be obtained from an exponential pile's measured relaxation constant A: spherical, rectangular, and cylindrical forms use their corresponding leakage relations, while known migration length M permits K to be recovered from (K − 1)/M and A.",
    ),
  ]),
];

// Pages 41–49 are replaced by literal reconciliation packets above; retain
// only the bounded p50 WIP continuation in the public block order.
const fermiPages50WipBlocks = fermiPages41To50Blocks.slice(-1);

const fermiPages36To42ParallelReadings: Readonly<Record<number, readonly string[]>> = {
  33: [
    "The page-35 continuation introduces the solid-moderator reactor and its Figures 7–21 before page 36 completes the exterior safety-rod apertures, planed graphite construction blocks, live and dead graphite, uranium cylinders and oxide pseudospheres, and reflector layers supporting the cubical lattice.",
  ],
  34: [
    "Page 37 gives the graphite spacing and layer dimensions, removable stringers and section, the boron-fluoride ionization chamber and galvanometer circuit in Figure 16, and the fully inserted construction rods.",
  ],
  35: [
    "Page 38 explains indium-foil monitoring during construction, the three-minute decay interval, saturation activity A0, the predicted fiftieth-layer critical size, doubling times, shielding, and the Figure 18–20 control mechanisms.",
  ],
  36: [
    "Page 39 states the short-period 10,000-kilowatt capability, the conductively cooled operating limit, the unresolved printed power formula, the 200-watt prototype dimensions, and the effective-radius plot of Figure 21.",
  ],
  37: [
    "Page 40 describes spherical neutron-density falloff and horizontal or vertical rod lattices in Figures 22–24.",
  ],
  38: [
    "Page 40 gives the uranium-D2O tank dimensions, rod sheathing, critical levels, shields, helium circulation, seals, and Figures 26–29.",
  ],
  39: [
    "Page 41 introduces the representative beryllium-uranium reactor constants table and preserves its beryllium-metal heading before the typed table rows.",
  ],
  41: [
    "Page 41 continues with the beryllium-oxide density and body-radius, critical-cylinder, and material-amount values, preserving the source's sphere and rod alternatives.",
  ],
  42: [
    "Page 41 explains reflector savings, light-water and diphenyl lattices, enrichment, and a higher-K seed or heavy-water center in a composite reactor.",
  ],
  44: [
    "Page 41 begins the resonance-capture section and explains the K proportionality factors p, f, and e used for the uranium and moderator contour curves in Figures 2–6.",
  ],
  45: [
    "Page 41 identifies the spherical, cylindrical-rod, and D2O contour families and states that radii and moderator-to-uranium volume ratios form the graph axes.",
  ],
  46: [
    "Page 42 gives the metallic-sphere radius threshold, the Figure 2 and Figure 3 limits, and the approximately 1.09 to 1.10 K contours for aggregated uranium metal.",
  ],
  47: [
    "Page 42 gives the uranium-oxide sphere and rod thresholds and optima in Figures 4 and 5, including their radii and moderator-to-uranium volume ratios.",
  ],
  48: [
    "Page 42 compares removable rods with spheres, gives the higher-K D2O rod curves in Figure 6, and states the design tradeoffs among body size, volume ratio, aggregation, enrichment, uranium, and moderator.",
  ],
};

const fermiPages43To49ParallelReadings: Readonly<Record<number, readonly string[]>> = {
  49: [
    "Page 43 records that the curves account only for resonance and moderator losses, so true K values for available materials must also include impurity losses.",
  ],
  51: [
    "Page 43 defines neutronic purity, distinguishes chemical purity from low danger sum, and gives hydrochloric-acid leaching and the stated impurity limits.",
  ],
  52: [
    "Page 43 describes the ether solution and repeated water extraction of uranyl nitrate, including nitric-acid treatment, crystallization, and the one-half to five per cent water proportion.",
  ],
  53: [
    "Page 43 continues the purification sequence from uranyl nitrate through U3O8, UO2, uranium fluorides, metal, and carbide, including the large-scale extraction arrangement.",
  ],
  54: [
    "Page 43 closes the purification account with calcination, hydrogen reduction, fluorination, magnesium reduction, billet casting, and machining into reactor bodies.",
  ],
  55: [
    "Page 44 introduces the exponential-pile and shotgun comparisons for uranium compounds and expresses impurity danger as equivalent boron absorption and K reduction.",
  ],
  56: [
    "Page 44 defines the ten-kilogram impurity absorption ratio and gives the 4,560-milligram boron reference and the observed 0.003 to 0.0053 K-unit danger sums.",
  ],
  57: [
    "Page 44 explains why graphite purity matters at the moderator-to-uranium mass ratio, gives the boron and vanadium K reduction range, and describes D2O contamination and neutron purification.",
  ],
  58: [
    "Page 44 states how the detector-foil comparison with a boron absorber measures impurity danger and the corresponding K reduction independently of chemical analysis.",
  ],
  60: [
    "Page 45 distinguishes conductive low-power cooling from circulated high-power cooling and requires coolant and pipe absorption to be included in neutronic design.",
  ],
  61: [
    "Page 45 itemizes the approximately 200-MeV fission-energy budget and its uranium, graphite, and external shares, then relates coolant and pipes to the moderator and fuel bodies.",
  ],
  62: [
    "Page 45 explains the aluminum-tube water system, its moderator-conduction limit, and why direct uranium cooling needs chemical protection and fission-fragment containment.",
  ],
  63: [
    "Page 45 identifies the air-cooled 3,000-kilowatt construction in Figures 31–36 and explains neutron conversion of boron and light-water impurities.",
  ],
  65: [
    "Page 46 describes the graphite cube, square air channels, inlet and outlet equipment, fan, stack, and thick concrete shielding in Figures 31 and 32.",
  ],
  66: [
    "Page 46 gives the 700-channel unity loading and 1,000-channel near-1.005 operating loading, with purity, graphite plugs, peripheral cooling, and absorber control.",
  ],
  67: [
    "Page 46 gives the Figure 34 fuel slug dimensions, aluminum jacket, sizing die, cap, seam weld, corrosion protection, and fission-fragment containment.",
  ],
  68: [
    "Page 47 states the above-critical loading ratio, seven-inch spacing, 47-to-1 volume ratio, K about 1.06, delayed-neutron doubling time, and absorber insertion behavior.",
  ],
  69: [
    "Page 47 describes the Figure 32 control rod, cadmium or boron absorber, shim and safety rods, melting limits, air-flow rates, and continuous operating powers.",
  ],
  70: [
    "Page 47 describes Figure 31 and 35 loading apertures, plugs, charging tube, plunger, elevator, staged loading, rod calibration, core uranium mass, shutdown, and delayed activity.",
  ],
  71: [
    "Page 47 records the post-loading fan startup, control-rod withdrawal and unity adjustment, radioactive-air exhaust, U239 production run, and delayed-neutron shutdown interval.",
  ],
  73: [
    "Page 48 describes underwater cooling and aging during unloading, including outlet plates, valves, coffin chamber, lead shielding, crane handling, and the thirty-day water period.",
  ],
  74: [
    "Page 48 identifies jacket and air-channel neutron losses, the approximately 0.005 K reduction, and the additional absorption introduced by liquid-coolant pipes.",
  ],
  75: [
    "Page 48 introduces the liquid-cooled reactor in Figures 37–39, describing its graphite core, reflector, steel casing, concrete tank, water and lead-shot shields, manifolds, and coolant tubes.",
  ],
  76: [
    "Page 48 explains the jacketed uranium slugs, recirculated water or closed diphenyl system, control and monitoring rods, and the uniform coolant annulus shown in Figure 39.",
  ],
  77: [
    "Page 49 quantifies the 100,000-kilowatt liquid-cooled design, including K reductions from jackets, pipes, coolant, principal active dimensions, fuel and graphite masses, annulus, rod count, and square spacing.",
  ],
  78: [
    "Page 49 compares diphenyl's thicker annulus and higher boiling point with its closed-circulation and polymerization costs, then limits coolant quantity by K minus 1 for graphite and D2O systems.",
  ],
  79: [
    "Page 49 states the design method: treat coolant and structural elements as parasitic impurities, evaluate their K reduction, and use the result to determine critical and operating sizes.",
  ],
  81: [
    "Page 49 introduces different lattice zones and moderators, including a D2O center or uranium-H2O surround, to obtain a practical composite operating size when one lattice has low K.",
  ],
};

const fermiPages50To58ParallelReadings: Readonly<Record<number, readonly string[]>> = {
  82: [
    "Page 50 explains statistical weighting for concentric lattice zones, using Fig. 40 to value material near the high-neutron-density center more heavily than material near the edge.",
  ],
  83: [
    "Page 50 applies Fig. 40 to three cylindrical lattice zones with separate K values and migration lengths, preserving the relation between zone sizes and the overall reproduction factor.",
  ],
  84: [
    "Page 50 gives the Fig. 40 example with K1 1.05, K2 1.06, weights 0.525 and 0.475, and average K about 1.0548, including the high-K and flattening effects of central zones.",
  ],
  85: [
    "Page 50 explains that, after neutron losses are evaluated, measured exponential-pile relaxation distance A determines critical dimensions and, with migration length M, the reproduction factor K.",
  ],
  87: [
    "Page 51 states that measured relaxation distance A gives critical size directly, while the relation involving (K - 1)/M and A permits critical and operating sizes without assigning every nuclear constant.",
  ],
  88: [
    "Page 51 explains delayed-neutron timing, the growth rates at reproduction ratios 1.001 through 1.03, and the approximately 1.005 maximum safe operating ratio.",
  ],
  89: [
    "Page 51 connects material buckling and migration length to critical sphere, parallelepiped, and cylinder dimensions, with Figure 30 giving D2O uranium-rod relations.",
  ],
  90: [
    "Page 52 records the reflector correction: returning otherwise escaping neutrons increases effective size, although the all-energy approximation remains an engineering limitation.",
  ],
  91: [
    "Page 52 describes control by D2O leakage or cadmium and boron rods, including fully inserted shutdown, unity reproduction, and the permitted maximum withdrawal position.",
  ],
  92: [
    "Page 52 explains ionization-chamber monitoring and the control-rod movements that raise, stabilize, reduce, or restore neutron density after delayed-neutron growth.",
  ],
  93: [
    "Page 53 describes motor-driven control rods and gravity-released safety rods, relating the one-percent reproduction limit to rod insertion time and delayed neutron response.",
  ],
  94: [
    "Page 53 accounts for temperature, pressure, isotope conversion, fission products, and the tellurium–iodine–xenon chain as operating changes to K.",
  ],
  95: [
    "Page 53 explains xenon-135's large capture cross section, its formation and removal, and why high-power sizing and rod withdrawal must include xenon reduction.",
  ],
  96: [
    "Page 54 quantifies equilibrium xenon reductions, shim-rod compensation, full shutdown insertion, cinch calibration, inhour period, and the pressure correction at 760 millimeters.",
  ],
  97: [
    "Page 54 describes intermittent low-power operation, xenon decay, cinch rod calibration, the e = 2.718 reactor period, inhour measurement, and atmospheric-pressure correction.",
  ],
  100: [
    "Page 54 introduces reactor uses for neutron and gamma sources, thorium-to-uranium-233 conversion, and carbon-14 production from nitrogen irradiation.",
  ],
  101: [
    "Page 55 describes thermal-neutron columns, collimated research beams, radiographs, neutron screens, and bismuth filtering for separating radiation components.",
  ],
  102: [
    "Page 55 describes removable-stringer tests of absorbers, producers, impurities, coatings, dimensions, and temperature, with corrected control-rod position measuring neutron economy.",
  ],
  103: [
    "Page 55 records post-irradiation recovery of U239 and fission products, steam and heat-production adaptations, and the specification's reservation for later experimental modification.",
  ],
  104: [
    "The page-56 claim preface introduces the eight printed claims that follow in the patent's formal claim section.",
  ],
  114: ["The United States reference is Fermi et al., U.S. Patent 2,206,634, dated July 2, 1940."],
  116: [
    "The foreign references preserve the Australian, Swiss, French, and Great Britain patent numbers, jurisdictions, and dates printed on page 57.",
  ],
  118: [
    "The other references preserve Power, Kelly et al. in Physical Review, and Flügge in Naturwissenschaften, including the copy locations printed in the patent file.",
  ],
  121: [
    "Page 58 identifies the United States Patent Office correction certificate, Patent No. 2,708,656, dated May 17, 1955, and Enrico Fermi et al.",
  ],
  122: [
    "The certificate states that errors appear in the printed specification and that the Letters Patent should read as corrected below.",
  ],
  123: [
    "The correction paragraph preserves every printed column and line correction, including BT to A, friction to fraction, ether-water, the K-1.005... formula correction, and CC to CS.",
  ],
  124: ["The certificate records the July 26, 1955 signing and sealing date."],
  125: ["The formal certificate preserves the printed seal marker."],
  126: [
    "The attestation preserves E. J. Murry as Attesting Officer and Robert C. Watson as Commissioner of Patents.",
  ],
};

// Final bounded WIP intake for PDF pages 51–58. The exact claim nodes remain
// the canonical claim source above; these paragraphs carry the remaining
// specification, references, signatures, and correction certificate without
// introducing a second claim transcription.
const fermiPages51To58Blocks: readonly CuratedSpecificationBlock[] = [
  {
    kind: "heading",
    level: 2,
    text: "Specification source chunk, PDF pages 51–58 (final WIP range)",
  },
  paragraph([
    text(
      "Critical dimensions may be obtained from an exponential pile's relaxation distance or exponential constant A. The corresponding diffusion relations give the critical radius of a sphere, the side lengths of a rectangular parallelepiped, or the height and radius of a cylinder. Where the migration length M is known, K follows from the relation involving (K − 1)/M and A. The critical-size relations and representative D2O curves are shown in ",
    ),
    figure(30, "Fig. 30"),
    text(
      ". A reflector increases effective size by returning some neutrons that would otherwise escape, although the reflector calculation remains an approximation because neutrons of many energies enter it.",
    ),
  ]),
  paragraph([
    text(
      "Delayed neutrons are essential to practical control. About one per cent of fission neutrons may be delayed, with a mean delay near five seconds; roughly half are emitted within six seconds and ninety per cent within forty-five seconds. At a reproduction ratio r = 1.001, the population can increase by a factor of 2.75 in about 28.5 seconds, whereas r = 1.01 gives a doubling in a fraction of a second. Ratios of 1.02 and 1.03 can increase the population by approximately 1,100 and 700,000 per second, so a maximum safe ratio is about 1.005.",
    ),
    term(
      "delayed neutrons",
      "Neutrons emitted seconds or minutes after fission as radioactive precursor fragments beta-decay; their slower time scale makes mechanical reactor control possible.",
    ),
  ]),
  paragraph([
    text(
      "Control varies neutron losses in or from the reactor. Changing D2O leakage can return a heavy-water system to unity reproduction; cadmium or boron rods absorb neutrons between the uranium bodies. A rod is fully inserted for shutdown, partly inserted at unity, and withdrawn to the permitted maximum. Neutron density is monitored with ionization chambers, and the critical position is adjusted as density, temperature, pressure, or absorber products change. Emergency safety rods are shown in ",
    ),
    figure(1, "Fig. 1"),
    text(", "),
    figure(25, "Fig. 25"),
    text(", "),
    figure(31, "Fig. 31"),
    text(", and "),
    figure(38, "Fig. 38"),
    text("."),
  ]),
  paragraph([
    text(
      "Fission products can change K during operation. The tellurium–iodine–xenon chain produces radioactive xenon-135, whose neutron-capture cross section is exceptionally large. Xenon formation reduces K and requires withdrawal of absorbers; xenon decay or neutron absorption later removes that poison. The effect must be included in the final operating K for high-power reactors, and shutdown requires full insertion of the control, shim, and safety rods so that decay of xenon cannot restart the reaction. Shim rods for xenon compensation are illustrated in ",
    ),
    figure(7, "Fig. 7"),
    text(", "),
    figure(25, "Fig. 25"),
    text(", "),
    figure(31, "Fig. 31"),
    text(", and "),
    figure(37, "Fig. 37"),
    text("."),
    term(
      "xenon-135 poisoning",
      "Operation-dependent neutron absorption by xenon-135 formed from fission-product decay, which lowers the reproduction factor and changes the required control position.",
    ),
  ]),
  paragraph([
    text("The control rod may be calibrated in a corrected unit called a "),
    term(
      "cinch",
      "A rod-travel unit selected so that one unit has the same reproduction-ratio effect at different depths, compensating for the neutron-density gradient.",
    ),
    text(
      ". The reactor period is the time required for neutron intensity to increase by e = 2.718, and is used for the so-called ",
    ),
    term(
      "inhour calibration",
      "A control calibration expressed through reactor period, with atmospheric-pressure correction; one inhour is tied to the e-fold neutron-intensity rise.",
    ),
    text(
      ". The pressure correction stated is 0.323 inhour for each millimeter of mercury from the standard 760-millimeter pressure.",
    ),
  ]),
  paragraph([
    text(
      "The reactors provide intense neutron and gamma-ray sources for isotope production, transmutation, radiography, and nuclear research. Thorium-232 may be converted through thorium-233 and protactinium-233 to uranium-233; nitrogen irradiation can produce carbon-14. A graphite-filled shaft can act as a thermal-neutron column, while internal shafts and tube 109b collimate fast neutrons and gamma rays into external beams. Neutron screens and a bismuth filter separate the desired radiation components.",
    ),
    term(
      "thermal-neutron column",
      "A graphite-filled extension that uses the reactor's escaping and moderated neutrons as an intense external thermal-neutron source.",
    ),
  ]),
  paragraph([
    text(
      "Removable stringer 36a and tube 109b permit testing of neutron absorbers, neutron producers, impurities, coatings, dimensions, and temperature. Known uranium bodies are replaced by test bodies at balanced neutron density; after pressure and temperature corrections, the change in control-rod position measures the change in neutron economy. Irradiated bodies can be removed for recovery of U239 and fission products. With suitable modifications, D2O, light-water, gas-cooled, and diphenyl-cooled reactors can transfer heat to steam. The stated chain-reaction theory is based on the best experimental evidence then available and is not intended to exclude later data.",
    ),
  ]),
  {
    kind: "heading",
    level: 2,
    text: "Formal claims, references, and certificate of correction",
  },
  paragraph([
    text(
      "The eight claims define graphite and heavy-water moderators, natural uranium and uranium oxide bodies, geometric spacing, purity, mass, and the minimum 0.5-centimeter body dimensions. The cited prior patent is Fermi et al., U.S. Patent 2,206,634 (July 2, 1940); the foreign references are Australia 14,150 and 14,151, Switzerland 233,011, France 861,390, and Great Britain 648,293. Other references are Power (July 1940, page 58), Kelly et al., Physical Review 73, 1135–1139 (1948), and Flügge, Naturwissenschaften 27, 402–410 (1939). The correction certificate repairs the printed entries for A, fraction, thermal-neutron placement, representation, 1945, 11.9, protecting, ether-water, .015, K, K − 1.005..., as, and CS.",
    ),
  ]),
  paragraph(
    literal(
      "References Cited in the file of this patent: United States Patent 2,206,634, Fermi et al., July 2, 1940; Foreign Patents 14,150, Australia, May 2, 1940; 14,151, Australia, May 3, 1940; 233,011, Switzerland, October 2, 1944; 861,390, France, October 28, 1940; 648,293, Great Britain, January 3, 1951; Other References: Power, July 1940, page 58. Copy in 204-154.2. Kelly et al., Physical Review 73, 1135–1139 (1948). Copy in Patent Office Library (204/154.2). Flügge, Naturwissenschaften, volume 27, pages 402–410 (1939). Copy in Patent Office Library (204/154.2).",
    ),
  ),
  paragraph(
    literal(
      "UNITED STATES PATENT OFFICE. CERTIFICATE OF CORRECTION. Patent No. 2,708,656, May 17, 1955, Enrico Fermi et al. It is hereby certified that error appears in the printed specification of the above numbered patent requiring correction and that the said Letters Patent should read as corrected below. Column 4, line 51, both occurrences, and line 53, both occurrences, for BT read -- A --; column 5, line 31, for friction read -- fraction --; column 6, line 46, strike out thermal neutron and insert the same before fissionable in line 47; column 19, line 52, for represensation read -- representation --; column 23, line 52, for 945 read -- 1945 --; column 25, line 45, for l'9 read -- 11.9 --; line 64, for protectting read -- protecting --; column 34, line 23, for either-water read -- ether-water --; column 38, line 16, for ...lib read -- .015 --; column 45, line 75, for K read -- K --; column 48, line 56, for formula portion K=1.0052 read -- K-1.005... --; column 51, line 35, for and read -- as --; column 53, line 72, for CC read -- CS --. Signed and sealed this 26th day of July, 1955. (SEAL) Attest: E. J. MURRY, Attesting Officer. ROBERT C. WATSON, Commissioner of Patents.",
    ),
  ),
];

// Final cloud-facsimile reconciliation packet: PDF pages 50–58. This carries
// the remaining specification, the printed claims, references, and correction
// certificate in source order. Drawing sheets 1–27 remain outside this packet.
const fermiPages50To58ReconciledBlocks: readonly CuratedSpecificationBlock[] = [
  paragraph([
    text(
      "When reactors are constructed of concentric layers, the average K can be calculated. Curves in ",
    ),
    figure(40, "Fig. 40"),
    text(
      " give the statistical weight w of a sub-side or sub-radius of a zone having a specified lattice, plotted against S/R, where R is the side or radius of the entire active portion and S is the extent of the zone. Statistical weight is the value of a mass of lattice weighted by its position: a mass near the center is worth more than the same mass near the edge because neutron density is higher at the center. The effectiveness of a lattice varies approximately with the square of the average neutron density to which it is exposed.",
    ),
  ]),
  paragraph([
    text(
      "For a cylindrical active portion of radius R, a central lattice with K1 and migration length M1 may extend to radius S1, a second lattice with K2 and M2 to radius S2, and a third lattice with K3 and M3 to the outer radius R. The curves in ",
    ),
    figure(40, "Fig. 40"),
    text(
      " permit calculation of the overall K for concentric cubic, spherical, or cylindrical structures with uranium rods. When migration lengths are equal, the average K minus 1 is obtained directly from the separate K minus 1 values; with different moderators, the appropriate migration length is inserted.",
    ),
  ]),
  paragraph([
    text(
      "As an example, if the central zone has K1 = 1.05 and the surrounding zone has K2 = 1.06, the ",
    ),
    figure(40, "Fig. 40"),
    text(
      " curves give weights of approximately 0.525 and 0.475, producing an average K of about 1.0548. A center with high K can raise the average enough to reduce reactor size; a center with lower K can flatten the neutron-density curve.",
    ),
  ]),
  paragraph([
    text(
      "After all neutron losses except exterior leakage have been evaluated, the reactor size for operation must be determined. A satisfactory method, especially for low-power reactors, is to measure the relaxation distance or exponential constant A in an exponential pile similar in every respect to the proposed reactor. For a sphere the critical radius is obtained from A; for a rectangular parallelepiped the critical side lengths are obtained from the corresponding relation; and for a cylinder the critical height and radius follow from the cylindrical relation containing 2.405/R. Thus critical size can be obtained directly from measured A without first determining a numerical K. If migration length M is known, K can be determined from the relation involving (K - 1)/M and A, and the result can be used for critical and operating sizes at any power.",
    ),
  ]),
  { kind: "heading", level: 2, text: "CRITICAL AND OPERATING SIZES OF NEUTRONIC REACTORS" },
  paragraph([
    text(
      "The critical size of a reactor may be obtained from the measured relaxation distance or exponential constant A. For a sphere, parallelepiped, or cylinder, the corresponding leakage relation gives the critical radius, side lengths, or height and radius. Where the migration length M is known, K may be obtained from the relation involving (K - 1)/M and A. These relations permit critical and operating sizes to be determined without first assigning exact values to every nuclear constant.",
    ),
  ]),
  paragraph([
    text(
      "The delayed neutrons emitted by fission fragments are of special importance in controlling the reaction. Approximately one per cent of fission neutrons may be delayed, with a mean delay of about five seconds; about half are emitted within six seconds and about ninety per cent within forty-five seconds. At a reproduction ratio r = 1.001, a neutron population may increase by a factor of 2.75 in about 28.5 seconds, or double in roughly twenty seconds. At r = 1.01 the doubling time is a fraction of a second, and at r = 1.02 or 1.03 the population can increase by factors of approximately 1,100 or 700,000 per second. A maximum safe operating ratio is therefore about 1.005, depending on the reactor and control system.",
    ),
  ]),
  paragraph([
    text(
      "For a homogeneous reactor, critical dimensions follow from the neutron diffusion equations. The critical radius of a sphere, the critical side of a rectangular parallelepiped, and the critical height and radius of a cylinder are expressed in terms of the material buckling and the migration length. ",
    ),
    figure(30, "Figure 30"),
    text(" gives representative critical-size relations for D2O-moderated uranium-rod reactors."),
  ]),
  paragraph([
    text(
      "The critical-size relations may be corrected for a reflector. A reflector returns some neutrons that would otherwise escape, increasing the effective size of the reactor. The calculated relations are approximations because neutrons of all energies between fission and thermal energy enter the reflector, but they are sufficiently accurate for designing and operating reactors with reflectors.",
    ),
  ]),
  paragraph([
    text(
      "Control is obtained by varying neutron losses in or from the reactor. In a D2O reactor, changing the amount of heavy water wetting the uranium changes the leakage factor: a reactor may be brought to unity reproduction by removing part of the D2O after the desired neutron density is reached. In other reactors, cadmium or boron control rods absorb neutrons between the uranium bodies. Low-power reactors are generally built so that the maximum reproduction ratio with the rods removed is less than 1.01. A rod may be fully inserted to stop the reaction, partly inserted at unity reproduction, or fully withdrawn at the permitted maximum. The intermediate unity setting is the critical position.",
    ),
  ]),
  paragraph([
    text(
      "Ionization chambers and indicators monitor neutron density. With the control rod fully inserted, the density may be about one hundred times the natural uranium background; withdrawing the rod makes the chains divergent and the density rises with a doubling time determined by delayed neutrons. When the desired density is reached, the rod is inserted to the unity position and later moved inward or outward to reduce or restore the selected density.",
    ),
  ]),
  paragraph([
    text(
      "Control rods are preferably driven by reversible electric motors, but safety rods are provided for accidents such as a drive motor running the rod completely out or a power-line failure. Safety rods are normally held out and are released manually or automatically at a predetermined neutron density so that gravity inserts them rapidly. This is why the operating reproduction ratio must not greatly exceed 1.01: at r = 1.01 the density may double in about one-third of a second, while safety rods need several seconds to enter.",
    ),
  ]),
  paragraph([
    text(
      "Temperature and atmospheric-pressure changes normally alter K only slightly and can be compensated by short rod movements. During high-power operation, however, fission products can change K substantially. U235 depletion and conversion of U238 to U239 tend to increase K, while stable fission products and radioactive absorbers tend to reduce it. The important fission-product chain is tellurium-135 to iodine-135 to xenon-135 and then cesium and barium; the parenthetical times in the specification are half-lives.",
    ),
  ]),
  paragraph([
    text(
      "Xenon-135 has an exceptionally large neutron-capture cross section. It is formed from iodine during operation, absorbs neutrons and reduces K, and is converted by neutron absorption or decay into isotopes of smaller capture cross section. In a high-power reactor the rod must be withdrawn as xenon builds up, and the reactor must be sized with the xenon reduction included in the final K. A reactor can otherwise become dangerous before xenon appears and can later shut down or restart as xenon forms and decays.",
    ),
  ]),
  paragraph([
    text(
      "At equilibrium, xenon-135 may reduce K by about 0.03 in a high-power reactor. The reduction depends on power: representative reductions are about 0.0012 at 10,000 kilowatts, 0.009 at 100,000 kilowatts, and larger values at still higher outputs. Shim rods can compensate for the xenon effect while preserving a maximum reproduction ratio below 1.01 with the main control rod withdrawn. At shutdown, all control, shim, and safety rods should be fully inserted so that the reaction does not restart when xenon decays.",
    ),
  ]),
  paragraph([
    text(
      "Low-power reactors operated intermittently are less affected by xenon poisoning because xenon does not become important for several hours. Such a reactor may reach a high density for a short period, wait for xenon to decay, and then be operated again. A control rod can be calibrated in a conventional inch or in a corrected unit called a cinch, which gives the same reproduction-ratio effect at different rod depths. The reactor period is the time required for neutron intensity to increase by e = 2.718; this is the inhour calibration. Atmospheric pressure is corrected at 0.323 inhour per millimeter of mercury from 760 millimeters.",
    ),
  ]),
  { kind: "heading", level: 2, text: "USES OF NEUTRONIC REACTORS" },
  paragraph([
    text(
      "Neutronic reactors are powerful neutron and gamma-ray sources. Materials placed in or near the reactor can be made radioactive, and the larger leakage of a D2O reactor permits a large external neutron flux. Thorium-232 can be converted by slow-neutron exposure to thorium-233, then protactinium-233, and finally uranium-233, a fissionable material comparable in action to U235 and U239. Neutrons reacting with nitrogen can produce radioactive carbon-14 for medical and physiological tracer work.",
    ),
  ]),
  paragraph([
    text(
      "Neutrons escaping from the reactor can be used for transmutation and isotope production. A graphite-filled shaft can form a thermal-neutron column. Internal shafts and tubes reaching the reactor center collimate fast neutrons into an external beam for nuclear research. Gamma rays can be used for radiographs of large castings; neutron screens and a bismuth filter can separate the desired radiation components.",
    ),
  ]),
  paragraph([
    text(
      "The reactor is also useful for testing neutron absorbers and neutron producers. A removable stringer containing uranium bodies of known constants can be balanced at a fixed neutron density, replaced by test bodies, and returned to the reactor. The corrected control-rod position shows whether the new bodies are better or worse, and similar tests can measure the effects of size, impurities, coatings, and temperature. The method of determining these effects is not itself claimed.",
    ),
  ]),
  paragraph([
    text(
      "At least part of the uranium bodies can be removed after irradiation so that U239 and fission products may be recovered. With suitable modifications, D2O reactors can produce steam under pressure, enriched-uranium/light-water systems can provide heat, gas-cooled reactors can heat helium for steam generation, and diphenyl-cooled reactors can transfer heat in exchangers. The theory is based on the best experimental evidence then available and is not intended to exclude later experimental modification.",
    ),
  ]),
  paragraph(literal("The following are the claims of the patent:")),
  {
    kind: "claim",
    number: 1,
    inlines: claimInlines(fermiReactorClaims[0].text),
  },
  {
    kind: "claim",
    number: 2,
    inlines: claimInlines(fermiReactorClaims[1].text),
  },
  {
    kind: "claim",
    number: 3,
    inlines: claimInlines(fermiReactorClaims[2].text),
  },
  {
    kind: "claim",
    number: 4,
    inlines: claimInlines(fermiReactorClaims[3].text),
  },
  {
    kind: "claim",
    number: 5,
    inlines: claimInlines(fermiReactorClaims[4].text),
  },
  {
    kind: "claim",
    number: 6,
    inlines: claimInlines(fermiReactorClaims[5].text),
  },
  {
    kind: "claim",
    number: 7,
    inlines: claimInlines(fermiReactorClaims[6].text),
  },
  {
    kind: "claim",
    number: 8,
    inlines: claimInlines(fermiReactorClaims[7].text),
  },
  { kind: "heading", level: 2, text: "References Cited in the file of this patent" },
  { kind: "heading", level: 3, text: "UNITED STATES PATENTS" },
  paragraph(literal("2,206,634 — Fermi et al. — July 2, 1940")),
  { kind: "heading", level: 3, text: "FOREIGN PATENTS" },
  paragraph(
    literal(
      "14,150 — Australia — May 2, 1940\n14,151 — Australia — May 3, 1940\n233,011 — Switzerland — October 2, 1944\n861,390 — France — October 28, 1940\n648,293 — Great Britain — January 3, 1951",
    ),
  ),
  { kind: "heading", level: 3, text: "OTHER REFERENCES" },
  paragraph(
    literal(
      "Power, July 1940, page 58. Copy in 204-154.2.\nKelly et al., Physical Review 73, 1135–1139 (1948). Copy in Patent Office Library (204/154.2).\nFlügge, Naturwissenschaften, volume 27, pages 402–410 (1939). Copy in Patent Office Library (204/154.2).",
    ),
  ),
  { kind: "heading", level: 2, text: "UNITED STATES PATENT OFFICE" },
  { kind: "heading", level: 2, text: "CERTIFICATE OF CORRECTION" },
  paragraph(literal("Patent No. 2,708,656 May 17, 1955\nEnrico Fermi et al.,")),
  paragraph(
    literal(
      "It is hereby certified that error appears in the printed specification of the above numbered patent requiring correction and that the said Letters Patent should read as corrected below.",
    ),
  ),
  paragraph(
    literal(
      'Column 4, line 51, both occurrences, and line 53, both occurrences, for "BT" read -- A --; column 5, line 31, for "friction" read -- fraction --; column 6, line 46, strike out "thermal neutron" and insert the same before "fissionable" in line 47; column 19, line 52, for "represensation" read -- representation --; column 23, line 52, for "945" read -- 1945 --; column 25, line 45, for "l\'9" read -- 11.9 --; line 64, for "protectting" read -- protecting --; column 34, line 23, for "either-water" read -- ether-water --; column 38, line 16, for "...lib" read -- .015 --; column 45, line 75, for "K" read -- K --; column 48, line 56, for formula portion "K=1.0052" read -- K-1.005... --; column 51, line 35, for "and" read -- as --; column 53, line 72, for "CC" read -- CS --.',
    ),
  ),
  paragraph(literal("Signed and sealed this 26th day of July, 1955.")),
  paragraph(literal("(SEAL)")),
  paragraph(
    literal("Attest:\nE. J. MURRY, Attesting Officer.\nROBERT C. WATSON, Commissioner of Patents."),
  ),
];

export const fermiReactorArchivalEdition: FermiReactorWipEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3",
  preparedBy: "Classic Patents editorial agent (SteelNeedle)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "2,708,656 — Patented May 17, 1955",
        "NEUTRONIC REACTOR",
        "Enrico Fermi, Santa Fe, N. Mex., and Leo Szilard, Chicago, Ill., assignors to the United States of America as represented by the United States Atomic Energy Commission",
        "Application December 19, 1944, Serial No. 568,904",
        "8 Claims. (Cl. 204—193)",
      ],
    },
    { kind: "heading", level: 2, text: "Field of the Invention" },
    paragraph(
      literal(
        "The present invention relates to the general subject of nuclear fission and particularly to the establishment of self-sustaining neutron chain fission reactions in systems embodying uranium having a natural isotopic content with the production of power in the form of heat.",
      ),
    ),
    { kind: "heading", level: 2, text: "Background and Nuclear Physics Principles" },
    paragraph(
      literal(
        "Following the discovery of nuclear fission by Hahn and Strassmann in 1939, it was determined that bombardment of natural uranium by slow (thermal) neutrons causes fission principally in the scarce uranium isotope U235 (present as approximately 1/139 part of natural uranium), releasing two lighter fission fragment nuclei, energetic beta and gamma rays, and an average of approximately two fast secondary neutrons per fission.",
      ),
    ),
    paragraph([
      text("In a natural-uranium system, reactions involve both "),
      term(
        "U235",
        "The rare, slow-neutron fissionable isotope of uranium comprising approximately 0.7% of natural uranium.",
      ),
      text(" and "),
      term(
        "U238",
        "The predominant uranium isotope (99.3%) which exhibits strong resonance capture of intermediate-energy neutrons, yielding plutonium-239 via intermediate beta decay.",
      ),
      text(
        ". Fast neutrons released by U235 fission must be slowed down to thermal equilibrium (0.025 eV) by elastic scattering collisions in a low-absorption ",
      ),
      term(
        "moderator",
        "A material composed of light nuclei (such as carbon graphite or heavy water D2O) used to slow fast neutrons without capturing them.",
      ),
      text(" to induce subsequent slow-neutron fissions."),
    ]),
    { kind: "heading", level: 2, text: "Heterogeneous Lattice and Reproduction Factor K" },
    paragraph([
      text(
        "The fundamental problem in achieving a chain reaction with natural uranium is overcoming neutron losses. Neutrons may be lost by (1) non-fission resonance capture in U238, (2) capture in the moderator, (3) absorption by chemical impurities, or (4) leakage across the outer periphery of the system. In a theoretical system of infinite size, the ratio of fast neutrons produced in one generation to the original number is denoted by the reproduction constant ",
      ),
      term(
        "K",
        "The infinite-medium neutron multiplication factor, representing the ratio of neutrons produced in one generation to those absorbed in the preceding generation in the absence of leakage.",
      ),
      text(
        ". For a finite reactor of practical size, the effective reproduction ratio must exceed unity (k_eff > 1.0) so that neutron production overcomes peripheral leakage.",
      ),
    ]),
    paragraph(
      literal(
        "A central discovery of this invention is that aggregating the uranium into discrete bodies (lumps, spheres, or cylinders) of substantial dimensions (at least 0.5 cm) embedded in a continuous moderator lattice drastically reduces U238 resonance absorption compared to homogeneous dispersions, enabling K to exceed unity with natural uranium in graphite or heavy water.",
      ),
    ),
    { kind: "heading", level: 2, text: "Lattice Criticality Contours and Moderator Systems" },
    paragraph([
      text(
        "The operational boundaries for achieving K >= 1.0 are defined by the contour graphs in the drawings. ",
      ),
      figure(1, "Fig. 1"),
      text(" illustrates the complete neutron balance of a chain reaction. "),
      figure(2, "Fig. 2"),
      text(" and "),
      figure(3, "Fig. 3"),
      text(
        " map the K reproduction constant contours for uranium metal spheres and cylindrical rods in graphite as a function of body radius and volume ratio.",
      ),
    ]),
    paragraph([
      figure(4, "Fig. 4"),
      text(" and "),
      figure(5, "Fig. 5"),
      text(
        " show corresponding K contours for uranium oxide (UO2) spheres and rods in graphite, while ",
      ),
      figure(6, "Fig. 6"),
      text(
        " demonstrates the superior multiplication factor achieved with uranium rods immersed in heavy water (deuterium oxide, D2O).",
      ),
    ]),
    { kind: "heading", level: 2, text: "Reactor Structures, Shielding, and Cooling" },
    paragraph([
      figure(7, "Fig. 7"),
      text(", "),
      figure(8, "Fig. 8"),
      text(", "),
      figure(9, "Fig. 9"),
      text(", and "),
      figure(10, "Fig. 10"),
      text(
        " disclose complete structural embodiments of a natural uranium-graphite reactor enclosed within biological radiation shielding. Graphite blocks loaded with uranium cylinders (",
      ),
      figure(11, "Fig. 11"),
      text(", "),
      figure(12, "Fig. 12"),
      text(") or oxide pseudospheres ("),
      figure(13, "Fig. 13"),
      text(", "),
      figure(14, "Fig. 14"),
      text(") are stacked in layers alongside pure graphite reflector bricks ("),
      figure(15, "Fig. 15"),
      text(")."),
    ]),
    paragraph([
      text("Neutron density is monitored through ionization chambers ("),
      figure(16, "Fig. 16"),
      text(") and plotted during layer-by-layer assembly ("),
      figure(17, "Fig. 17"),
      text(", "),
      figure(21, "Fig. 21"),
      text(
        "). Reactor reactivity and power level are controlled by movable neutron-absorbing rods, including emergency safety rods (",
      ),
      figure(18, "Fig. 18"),
      text("), shim limiting rods ("),
      figure(19, "Fig. 19"),
      text("), and regulating control rods ("),
      figure(20, "Fig. 20"),
      text(") containing cadmium or boron."),
    ]),
    paragraph([
      text("Alternative reactor embodiments include heavy-water moderated cores ("),
      figure(25, "Fig. 25"),
      text(" through "),
      figure(29, "Fig. 29"),
      text("), air-cooled channel configurations ("),
      figure(31, "Fig. 31"),
      text(" through "),
      figure(33, "Fig. 33"),
      text("), jacketed fuel slugs ("),
      figure(34, "Fig. 34"),
      text("), and liquid-cooled production piles ("),
      figure(37, "Fig. 37"),
      text(" through "),
      figure(39, "Fig. 39"),
      text(") with external radiation reflectors ("),
      figure(41, "Fig. 41"),
      text(")."),
    ]),
    { kind: "heading", level: 2, text: "Delayed Neutron Dynamics and Reactor Safety" },
    paragraph(
      literal(
        "Safe regulation of the chain reaction is made possible by the phenomenon of delayed neutron emission. While the vast majority of fission neutrons are emitted promptly (within 10^-14 seconds), a fraction (approximately 0.65%) are delayed by seconds to minutes as precursor fission fragments undergo beta decay. Operating the reactor in the delayed-critical regime (k_eff slightly above 1.0 but below 1.0 + beta) ensures that the reactor period is measured in tens of seconds or minutes, allowing mechanical control rods to maintain stable, precise power equilibrium.",
      ),
    ),
    ...fermiPages30To35ReconciledBlocks,
    ...fermiPages36To42ReconciledBlocks,
    ...fermiPages43To49ReconciledBlocks,
    ...fermiPages50To58ReconciledBlocks,
    ...fermiDrawingSheetBlocks1To9,
  ],
};

const fermiLegacyParallelReadings: Readonly<Record<number, readonly string[]>> = {
  ...fermiPages30To35ParallelReadings,
  2: [
    "The patent defines its subject as establishing self-sustaining neutron chain fission reactions in natural-uranium systems to generate nuclear power as heat.",
  ],
  4: [
    "Slow-neutron bombardment of natural uranium splits the scarce U-235 isotope, yielding lighter radioactive fission fragments, beta/gamma radiation, and ~2 fast secondary neutrons.",
  ],
  5: [
    "Fast fission neutrons must be slowed by elastic collisions in a moderator (graphite or heavy water) to thermal energy (0.025 eV) before causing further U-235 fissions, while avoiding parasitic capture.",
  ],
  7: [
    "Four neutron loss channels exist: U-238 resonance capture, moderator capture, impurity absorption, and peripheral leakage. For an infinite system, multiplication is K; in finite cores, k_eff must exceed unity.",
  ],
  8: [
    "Aggregating uranium into discrete bodies of at least 0.5 cm inside a continuous moderator matrix suppresses U-238 resonance capture, enabling K > 1.0 with un-enriched natural uranium.",
  ],
  10: [
    "Figure 1 traces the complete generation-to-generation neutron budget. Figures 2 and 3 chart reproduction constant K contours for uranium metal spheres and rods in graphite.",
  ],
  11: [
    "Figures 4 and 5 establish working K >= 1.0 geometries for uranium-oxide fuels, while Figure 6 documents the superior neutron economy of heavy-water moderated lattices.",
  ],
  13: [
    "Figures 7-15 illustrate the structural assembly of graphite blocks, uranium metal cylinders, and oxide pseudospheres surrounded by external radiation shielding.",
  ],
  14: [
    "Neutron density is tracked with ionization detectors (Fig. 16) during construction (Figs. 17, 21), and reactivity is governed by motorized cadmium/boron control and safety rods (Figs. 18-20).",
  ],
  15: [
    "Detailed reactor engineering variants include heavy-water cores (Figs. 25-29), air cooling (Figs. 31-33), jacketed fuel slugs (Fig. 34), and liquid-cooled production piles (Figs. 37-39).",
  ],
  17: [
    "Delayed neutron emission (~0.65% from fission fragments) expands the reactor time constant from microseconds to minutes, enabling safe, stable mechanical control rod regulation.",
  ],
  19: [
    "The formal claims define the legal scope of the patent, covering graphite and heavy-water natural uranium reactors matching the specified criticality contours and discrete fuel dimensions.",
  ],
  29: [
    "Live graphite blocks carry fuel bodies, dead graphite blocks contain no uranium, and the basic 4 3/4 inch planed graphite blocks stack tightly inside vault space 14.",
  ],
  30: [
    "Live and dead graphite blocks form a substantially cubical lattice surrounded by a dead graphite reflector, with removable stringers and ionization chamber 60 tracking neutron density.",
  ],
  31: [
    "Indium foils exposed during construction measure neutron density and saturation activity A0, plotting the approach to critical size on Figure 17.",
  ],
  32: [
    "Motor-driven boron-steel regulating rods, cadmium shim rods, and gravity-inserted solenoid-latched safety rods maintain safe operational control.",
  ],
  33: [
    "Ellipsoidal prototype scaling, cylindrical and spherical geometries, and heavy-water liquid moderated reactor assemblies complete the detailed engineering embodiments.",
  ],
  35: [
    "Pages 41-50 begin with beryllium, light-water, diphenyl, and composite seed lattices, then explain how the K contour families in Figures 2-6 quantify neutron economy for spheres and rods.",
  ],
  36: [
    "The resonance-loss analysis defines K as p times f times e and records the minimum radii, optimum volume ratios, and practical tradeoffs for uranium metal, uranium oxide, graphite, and heavy-water lattices.",
  ],
  37: [
    "The patent explains neutronic purity, nitric-acid and ether-water purification, and conversion of purified uranium compounds to UO2, tetrafluoride, metal, and carbide without introducing high-capture impurities.",
  ],
  38: [
    "Exponential-pile and shotgun tests express impurity absorption as equivalent boron and estimate its reduction of K, while selected graphite and D2O manufacturing practices limit parasitic neutron capture.",
  ],
  39: [
    "The cooling discussion accounts for the approximately 200 MeV released per fission and warns that coolant, pipes, and direct uranium cooling must remove heat without consuming the neutron economy.",
  ],
  40: [
    "The gas-cooled reactor uses a shielded graphite cube, thousands of air channels, aluminum-jacketed slugs, and movable absorbers, with Figures 31-36 documenting structure, loading, and fuel-jacket details.",
  ],
  41: [
    "Air cooling, controlled loading, delayed-neutron timing, and underwater unloading keep the gas-cooled reactor within temperature and radiation limits while the measured doubling time supplies the reproduction ratio.",
  ],
  42: [
    "The liquid-cooled embodiments in Figures 37-39 route water or diphenyl around jacketed uranium slugs inside a shielded graphite core and quantify the K penalty from jackets, pipes, and coolant.",
  ],
  43: [
    "A liquid-cooled design is sized from its active cylinder, fuel and graphite masses, rod spacing, and coolant annulus; different moderator choices trade boiling point, circulation, and neutron absorption.",
  ],
  44: [
    "Figure 40 weights concentric lattice zones by neutron density, allowing average K and critical dimensions to be calculated from zone factors, migration lengths, and an exponential-pile relaxation constant.",
  ],
  46: [
    "Pages 51-52 derive critical dimensions from measured exponential-pile constants, reflector corrections, migration length, and the D2O size relations shown in Figure 30.",
  ],
  47: [
    "Delayed neutrons slow the reactor response from fractions of a second to many seconds, explaining why a reproduction ratio near 1.005 is a practical safety limit.",
  ],
  48: [
    "D2O leakage control and cadmium or boron rods vary neutron losses; chambers measure density while Figures 1, 25, 31, and 38 show the safety-rod embodiments.",
  ],
  49: [
    "Fission-product xenon-135 absorbs neutrons and depresses K, so high-power reactors include its equilibrium effect and use shim rods shown in Figures 7, 25, 31, and 37.",
  ],
  50: [
    "Cinch travel and inhour period calibrations make control-rod response comparable across the neutron-density gradient, with a stated atmospheric-pressure correction.",
  ],
  51: [
    "Neutron and gamma sources support isotope production, thorium-to-U233 transmutation, carbon-14 tracing, thermal-neutron columns, radiography, and collimated research beams.",
  ],
  52: [
    "Removable stringers and tubes test materials and reactor changes; irradiated fuel can be processed, and modified moderator/coolant systems can transfer reactor heat to steam.",
  ],
  54: [
    "The eight claims define graphite, heavy-water, uranium-metal, uranium-oxide, and aggregated-body reactor constructions whose geometry, purity, mass, and moderator arrangement sustain a chain reaction.",
  ],
  55: [
    "The cited references identify Fermi et al.'s earlier United States patent, five foreign patents, Power, Kelly et al.'s Physical Review paper, and Flügge's Naturwissenschaften paper.",
  ],
  56: [
    "The correction certificate lists the column-and-line repairs to the printed specification, then records the July 26, 1955 seal and attestation by E. J. Murry and Robert C. Watson.",
  ],
};

void fermiPages50WipBlocks;
void fermiPages51To58Blocks;

const fermiSourceSpecificParallelReadings: Readonly<Record<number, readonly string[]>> = {
  ...fermiLegacyParallelReadings,
  ...fermiPages36To42ParallelReadings,
  ...fermiPages43To49ParallelReadings,
  ...fermiPages50To58ParallelReadings,
  99: [
    "The specification's uses section identifies neutron and gamma sources, thorium-to-uranium-233 conversion, carbon-14 production, thermal columns, radiography, and controlled irradiation experiments.",
  ],
};

/** Every key is a final-edition paragraph block index, never a claim or heading. */
export const fermiReconciledParagraphIndices = Object.freeze(
  fermiReactorArchivalEdition.blocks.flatMap((block, index) =>
    block.kind === "paragraph" ? [index] : [],
  ),
);

export const fermiReactorParallelReadings: Readonly<Record<number, readonly string[]>> =
  Object.freeze(
    Object.fromEntries(
      fermiReconciledParagraphIndices.map((index) => {
        const reading = fermiSourceSpecificParallelReadings[index];
        if (!reading) {
          throw new Error(`Fermi manual edition paragraph ${index} lacks an authored reading.`);
        }
        return [index, reading] as const;
      }),
    ),
  );

/** Read a printed claim from the authored edition blocks only. */
export function fermiReactorManualClaimText(number: number): string {
  const block = fermiReactorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Fermi manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
