/**
 * Source-faithful figure inventory for US 2,708,656. This is deliberately a
 * staging artifact, not a published `CuratedSpecificationEdition`: the
 * complete 58-page textual edition and paragraph readings have not yet been
 * authored. Each image is a lossless 220-DPI render of its source drawing
 * sheet from the pinned facsimile, preserving the original figure labels and
 * reference numerals for later figure-specific crops.
 */
const sourceSheet = (sheet: number) => {
  const padded = String(sheet).padStart(2, "0");
  return {
    src: `/patents/figures/us-2708656-fermi-reactor/source-sheet-${padded}-${padded}.png`,
    width: 1702,
    height: 2500,
  } as const;
};

const figureSheets = {
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
} as const;

export const FERMI_REACTOR_SOURCE_PDF_SHA256 =
  "e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3";

/**
 * Every printed figure has a local source-sheet preview. Later semantic
 * references must take their preview from this inventory rather than linking
 * to a PDF page or guessing a diagram.
 */
export const FERMI_REACTOR_FIGURE_PREVIEWS = Object.fromEntries(
  Object.entries(figureSheets).map(([number, sheet]) => [
    `Fig. ${number}`,
    {
      ...sourceSheet(sheet),
      alt: `Source drawing sheet ${sheet} from US 2,708,656 containing Fig. ${number}.`,
    },
  ]),
) as Readonly<
  Record<
    `Fig. ${number}`,
    {
      readonly src: string;
      readonly alt: string;
      readonly width: 1702;
      readonly height: 2500;
    }
  >
>;

/** The direct, source-worded inventory printed in specification columns 14–16. */
export const FERMI_REACTOR_FIGURE_CAPTIONS: Readonly<Record<`Fig. ${number}`, string>> = {
  "Fig. 1":
    "Diagram or chart illustrating the balanced condition of a chain reaction in a system of practical size employing natural uranium in graphite.",
  "Fig. 2":
    "Graph with contour lines representing reproduction constants K for uranium-metal spheres and graphite.",
  "Fig. 3": "Graph similar to Fig. 2 for cylindrical rods of uranium metal.",
  "Fig. 4":
    "Graph with reproduction-constant K contour lines for a uranium-oxide (UO₂) and graphite system using spheres.",
  "Fig. 5":
    "Graph with K contour lines for uranium-oxide (UO₂) and graphite using cylindrical rods.",
  "Fig. 6": "Graph showing K contour lines for uranium-metal rods immersed in D₂O.",
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
