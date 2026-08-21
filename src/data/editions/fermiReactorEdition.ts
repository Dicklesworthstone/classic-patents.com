import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

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

const sourceSheet = (sheet: number) => {
  const padded = String(sheet).padStart(2, "0");
  return {
    src: `/patents/figures/us-2708656-fermi-reactor/source-sheet-${padded}-${padded}.png`,
    width: 1702,
    height: 2500,
  } as const;
};

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
    const s = sourceSheet(sheet);
    return {
      src: s.src,
      alt: `US 2,708,656 Fig. ${n} on Drawing Sheet ${sheet}`,
      width: s.width,
      height: s.height,
    };
  });
  const firstSheet = figureSheets[num] ?? 1;
  return {
    kind: "reference",
    text: label,
    href: `#fermi-fig-${num}`,
    referenceType: "figure",
    label: `Preview ${label} on Sheet ${firstSheet} of US 2,708,656`,
    figurePreviews: previews,
  };
};

const drawingSheet = (
  sheet: number,
  figures: readonly number[],
  title: string,
): CuratedSpecificationBlock => ({
  kind: "figure-sheet",
  figureLabel: figures.map((number) => `FIG. ${number}`).join(", "),
  title: `Drawing Sheet ${sheet}: ${title}`,
  description: figures.map((number) => figure(number, `FIG. ${number}.`)),
});

// The pinned facsimile contains 27 drawing sheets before the specification.
// Keep these source-sheet companions explicit so every printed figure label
// resolves to the existing cloud-reviewed source-sheet inventory.
const _fermiDrawingSheetBlocks: readonly CuratedSpecificationBlock[] = [
  drawingSheet(1, [1], "chain-reaction neutron balance"),
  drawingSheet(2, [2], "uranium-metal spheres in graphite"),
  drawingSheet(3, [3], "uranium-metal rods in graphite"),
  drawingSheet(4, [4], "uranium-oxide spheres in graphite"),
  drawingSheet(5, [5], "uranium-oxide rods in graphite"),
  drawingSheet(6, [6], "uranium rods in heavy water"),
  drawingSheet(7, [7], "uranium-graphite reactor perspective"),
  drawingSheet(8, [8], "front plan and central section"),
  drawingSheet(9, [9], "side plan and central section"),
  drawingSheet(10, [10], "top plan and horizontal section"),
  drawingSheet(11, [11, 12, 13, 14, 15, 17], "graphite blocks and construction measurement"),
  drawingSheet(12, [16, 21], "neutron-density monitoring and ellipsoidal scaling"),
  drawingSheet(13, [18, 19, 20], "safety, shim, and control rods"),
  drawingSheet(14, [22, 23], "modified cubic and cylindrical active portions"),
  drawingSheet(15, [24], "spherical neutron-density distribution"),
  drawingSheet(16, [25], "deuterium-oxide moderated reactor"),
  drawingSheet(17, [26, 27, 28], "uranium-rod details and removal seal"),
  drawingSheet(18, [29], "horizontal section of the D2O reactor"),
  drawingSheet(19, [30, 41], "critical size and reflector relations"),
  drawingSheet(20, [31], "air-cooled reactor"),
  drawingSheet(21, [32], "air-cooled reactor cross section"),
  drawingSheet(22, [33, 35], "air system plan and loading channel"),
  drawingSheet(23, [34, 36], "jacketed slug and channel cross section"),
  drawingSheet(24, [37], "liquid-cooled reactor"),
  drawingSheet(25, [38], "liquid-cooled reactor section"),
  drawingSheet(26, [39, 40], "coolant channel and statistical weights"),
  drawingSheet(27, [42], "ellipsoidal reactor outline"),
];

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
const fermiPages30To40Blocks: readonly CuratedSpecificationBlock[] = [
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
      "The exact printed Claims 1–8 are represented by the claim blocks above and are repeated in the reviewed ledger on PDF pages 56–57. The cited prior patent is Fermi et al., U.S. Patent 2,206,634 (July 2, 1940). Foreign references are Australia 14,150 and 14,151, Switzerland 233,011, France 861,390, and Great Britain 648,293. Other references are Power (July 1940, page 58), Kelly et al., Physical Review 73, 1135–1139 (1948), and Flügge, Naturwissenschaften 27, 402–410 (1939). The signed correction certificate dated July 26, 1955 corrects the printed specification's entries for A, fraction, thermal-neutron placement, representation, 1945, 11.9, protecting, ether-water, .015, K, K − 1.005..., as, and CS; it is retained verbatim in the p58 ledger boundary.",
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

const fermiLiteralSpecificationBlocks: readonly CuratedSpecificationBlock[] = [
  paragraph(literal("United States Patent O\n\n2,708,656\nPatented May 17, 1955\n\n1ce\n\n1\n\n2,708,656\nNEUTRONIC REACTOR\n\nEnrico Fermi, Santa Fe, N. Mex., and Leo Szilard, Chi-\ncago, IL, assiguors to the United States of America\nas represented by the United States Atomic Energy\nCommission\n\nApplication December 19, 1944, Serial No. 568,904\n8 Claims. (Cl. 204—193)\n\nThe present invention relates to the general subject\nof nuclear fission and particularly to the establishment of\nself-sustaining neutron chain fission reactions in sys-\ntems embodying uranium having a natural isotopic con-\ntent.\n\nExperiments by Hahn and Strassman, the results of\nwhich were published in January 1939.\nschaften, vol. 27, page 11, led to the conclusion that\nnuclear bombardment of natural uranium by slow neu-\ntrons causes explosion or fission of the nucleus, which\nsplits into particles of smaller charge and mass with\n\nenergy being released in the process. Later it was found .\n\nthat neutrons were emitted during the process and that\nthe fission was principally confined to the uranium iso-\ntope U5 present as 4g9 part of the natural uranium.\n\nWhen it became known that the isotope U255 in naturai\nuranium could be split or fissioned by bombardment with\nthermal neutrons, i. e., neutrons at or near thermal equi-\nlibrium with the surrounding medium, many predictions\nwere made as to the possibility of obtaining a self-sustain-\ning chain reacting system operating at high neutron densi-\nties. In such a system, the fission neutrons produced give\nrise to new fission neutrons in sufficiently large numbers\nto overcome the neutron losses in the system. Since the\nresult of the fission of the uranium nucleus is the produc-\ntion of two lighter elements with great kinetic energy,\nplus approximately 2 fast neutrons on the average for\neach fission along with beta and gamma radiation, a\nlarge amount of power could be made available if a self-\nsustaining system could be built.\n\nIn order to attain such a self-sustaining chain reaction\nin a system of practical size, the ratio of the number of\nneutrons produced in one generation by the fissions, to\nthe original number of neutrons initiating the fissions,\nmust be known to be greater than unity after all neutron\nlosses are deducted, and this ratio is, of course, dependent\nupon the values of the pertinent constants.\n\nIn the co-pending application of Enrico Fermi, Serial\nNo. 534,129, filed May 4, 1944, and entitled “Nuclear\nChain Reacting Systems,” there is described and claimed\na means and method of determining the neutron repro-\nduction ratio for any type of uranium-containing struc-\nture, directly as a result of a simple measurement which\ncan be performed with precision. Accurate values for\nall of the pertinent nuclear constants need not be known.\n\nWe have discovered certain essential principles re-°\n\nquired for the successful construction and operation of\nself-sustaining neutron chain reacting systems (known as\nneutronic reactors) with the production of power in\nthe form of heat. These principles have been confirmed\nwith the aid of measurements made in accordance with\nthe means and method set forth in the above-identified\napplication, and neutronic reactors have been constructed\nand operated at various power outputs, in accordance\nwith these principles, as will be more fully brought out\nhereinafter.\n\nIn a self-sustaining chain reaction of natural uranium\nwith slow neutrons, as presently understood, reactions\noccur involving the isotopes U** and U5, Thus, 92238\n\nNaturwissen- -\n\n35\n\n40\n\n60\n\n85\n\n70\n\n2\n\nis converted by neutron capture to the isotope 92739,\nThe latter is converted by beta decay to 93259 and this\n93238 in turn is converted by beta decay to 943°, Other\nisotopes of 93 and 94 may be formed in small quantities.\nBy slow or thermal neutron capture, 92735, on the other\nhand, can undergo nuclear fission to release energy ap-\npearing as heat and gamma and beta radiation, together\nwith the formation of fission fragments appearing as\nradioactive isotopes of elements of lower mass numbers,\nand with the release of secondary neutrons.\n\nThe secondary neutrons thus produced by the fissioning\nof the 92235 nuclei have a high average energy, and must\nbe slowed down to thermal energies in order to be in\ncondition to cause slow neutron fission in other 92235\nnuclei. This slowing down, or moderation of the neutron\nenergy, is accomplished by passing the neutrons through\na material where the neutrons are slowed by collision.\nSuch a material is known as a moderator. While some of\nthe secondary neutrons are absorbed by the uranium\nisotope 92738 leading to the production of element 94,\nand by other materials such as the moderator, enough\nneutrons can remain to sustain the chain reaction, when\nproper conditions are maintained.\n\nUnder these proper conditions, the chain reaction will\nsupply not only the neutrons necessary for maintaining\nthe neutronic reaction, but also will supply the neutrons\nfor capture by the isotope 92238 leading to the production\nof 94, and excess neutrons for use as desired.\n\nAs 94 is a transuranic element, it can be separated from\nthe unconverted uranium by chemical methods, and as it\nis fissionable by slow neutrons in a manner similar to the\nisotope 92335, it is valuable, for example, for enriching\nnatural uranium for use in other chain reacting systems\nof smaller overall size. The fission fragments are also\nvaluable as sources of radioactivity.\n\nThe ratio of the fast neutrons produced in one genera-\ntion by the fissions to the original number of fast neu-\ntrons in a theoretical system of infinite size where there can\nbe no external Joss of neutrons is called the reproduction\nof multiplication factor or constant of the system, and is\ndenoted by the symbol K. For any finite system, some\nneutrons will escape from the periphery of the system.\nConsequently a system of finite size may be said to have\na K constant, even though the value thereof would only\nexist if the system as built were extended to infinity\nwithout change of geometry or materials. Thus when\nK is referred to herein as a constant of a system of practi-\ncal size, it always refers to what would exist in the same\ntype of system of infinite size. If K can be made suffi-\nciently greater than unity to indicate a net gain in neu-\ntrons in the theoretical system of infinite size, and then\nan actual system is built to be sufficiently large so that\nthis gain is not entirely lost by leakage from the exterior\nsurface of the system, then a self-sustaining chain react-\ning system of finite and practical size can be built to\nproduce power and related by-products by nuclear fis-\nsion of natural uranium. The neutron reproduction ratio\nin a system of finite size therefore differs from K by\nthe external leakage factor, and by a factor due to the\nneutron absorption by localized neutron absorber, and\nthe reproduction ratio must still be sufficiently greater\nthan unity to permit the neutron density to rise exponen-\ntially with time in the system as built.\n\nProgressive empirical enlargement of any proposed\nsystem for which the factor K is not accurately known,\nin an attempt to attain the overall size of a structure of\nfinite size above which the rate of loss of neutrons by\ndiffusion through the periphery of the structure is less\nthan the rate of production of neutrons in the system,\nleads only to an expensive gamble with no assurance of\nsuccess. The fact that K is greater than unity and the\nfact that the critical size is within practical limits must")),
  paragraph(literal("2,708,656\n\n3\n\nbe known rather accurately in advance, as otherwise a\nproposed structure having a K factor less than unity, or\neven a K factor greater than but sufficiently close to unity,\nwould not sustain a chain reaction even if all of the urani-\num in the world were included.\n\nThe earliest attempts to predict a structure capable\nof sustaining a chain reaction, using natural uranium,\ninvolved the use of fine uranium particles such as uranium\noxide powder, dispersed in hydrogen in combined form as\nthe slowing agent. However, these attempts were not\nsuccessful, and analysis of experiments made has indi-\ncated that the neutron losses in such a system when natural\nuranium is used, can prevent a chain reaction from being\nsustained, irrespective of the size of the system.\n\nHowever, in considering such experiments, it was found\nthat neutron losses caused by absorption of neutrons by\nU?38 which is present in natural or even enriched uranium,\ncould be very substantially reduced by aggregating the\nuranium into bodies of substantial dimensions as com-\npared to the uranium powder-hydrogen mixture pre-\nviously suggested. It was also found that such aggrega-\ntion will reduce resonance losses when a moderator such\nas graphite is used. This gain in neutrons, saved for\nuse in the chain, has proved to be one of the major factors\nin obtaining a sufficiently Jow over-all neutron loss as\nto make possible the attainment of a self-sustaining chain\nreaction in various moderators, when other losses are\nalso controlled. _\n\nDuring the interchange of neutrons in a system of\nfinite size, comprising bodies of any size disposed in a\nneutron moderator, neutrons may be lost to the chain\nreaction in four ways:\n\n1. By absorption or capture in the uranium content\nof the bodies without producing fission,\n\n2. By absorption or capture in the moderator material\nitself,\n\n3. By absorption or capture by the impurities present\nin both the uranium bodies and the moderator,\n\n4, By leakage out of the system through the periphery\nthereof.\n\nTHE CHAIN FISSION REACTION\n\nTo illustrate the importance of the various factors\nentering into a chain reaction, we next describe the\nchain reaction process as it is presently understood to\noccur in any system of finite size utilizing natural uranium\nbodies dispersed in a graphite (a selected example)\nmoderator at some position in the reactor where the neu-\ntron density is substantially constant. For better explana-\ntion, reference is here made to the diagram constituting\nFig. 1 of the accompanying drawings, description of the\nremaining figures being more conveniently set forth in a\nsubsequent part of this specification.\n\nIn Fig. 1, the letter\n\nA represents a uranium body of any size from which\nfast neutrons are set free as a result of the fission process.\n\nB represents a fast neutron loss due to leakage out of\nthe system.\n\nC represents a uranium body of any size in which both\nvolume and surface resonance absorption of neutrons\nby U238 takes place, at resonance energies above thermal\nenergy, leading to the formation of element 94.\n\nD represents the number of neutrons reaching thermal\nenergy.\n\nE represents a thermal neutron loss by diffusion of\nthermal neutrons out of the system.\n\nF represents a neutron loss caused by capture of neu-\ntrons by impurities in uranium, graphite, and controls.\n\nG represents a neutron loss due to capture of thermal\nneutrons by the graphite as the thermal neutrons diffuse\ntherethrough before entering uranium.\n\nH represents the number of thermal neutrons entering\nuranium body.\n\nI represents a uranium body of any size in which part\nof the thermal neutrons entering the body are absorbed\nby U5 leading to the formation of 94359, the remaining\n\nfs\n\nut\n\na\n\nu\n\n30\n\noo\nuu\n\n40\n\n45\n\nul\n\n50\n\n60\n\n6.\n\nvt\n\n75\n\n4\n\nthermal neutrons causing new fissions in U5 thereby\nproducing fast neutrons, a few of which produce addi-\ntional fast neutrons by fission of U?38 atoms in the same\nbody.\n\nWe will first consider the condition obtaining where\nthermal neutrons enter uranium body A. Some of these\nthermal neutrons will cause fission in the U2%5 content\nof the uranium body A to produce fast neutrons, the yield\nbeing at an average rate of about 2 neutrons per fission.\nAs a result of this fission, fission fragments are released\ntogether with beta and gamma rays, thereby producing\nenergy which, in the system, is manifested mostly by the\nheating of the uranium bodies with only a slight release\nof heat in the graphite. The actual average yield of fast\nneutrons by fission of U?35 is slightly higher, e. g., by a\nfew per cent, than the average of 2 mentioned above.\nSome of the fast neutrons released in the fission of U235 by\nthe thermal neutrons of this example almost immediately\nproduce fast fission of U2%8 in the same uranium body,\nwith the production of additional fast neutrons.\n\nThe fast neutrons leaving the uranium body, for exam-\nple 100” neutrons, enter the mass of moderator, travel\ntherethrough, and through the uranium bodies over\npaths long in comparison with the spacing of the uranium\nbodies, to undergo successive collisions that slow them\ndown. A substantial proportion of the fast neutrons are\nthus destined to be reduced, by about 100 elastic collisions\napiece in the case of graphite and mostly in the mod-\nerator, to thermal energy. During this travel, before\nthe neutrons arrive at thermal energies, a small percentage\nof the higher energy neutrons on the average may leak\nout of the system because of the finite size of the reactor,\nand be lost to the chain reaction. Furthermore, during\nthe extremely irregular path of the neutrons while they\nare being slowed down by elastic collisions in the graph-\nite, some of the neutrons will reach a uranium resonance\nabsorption energy as they are about to enter a uranium\nbody, such as C, and are absorbed immediately on or\nclose to the surface of the uranium body. In addition\nsome neutrons are reduced to resonance energy after\nentering the uranium body by an elastic collision with\nthe uranium, and are therefore immediately absorbed\nwithin the uranium body. Irrespective of whether the\nneutron resonance absorption in U38 is on the surface,\nor in the volume of the uranium body, element 94 is pro-\nduced by the resonance absorption according to the fol-\nlowing process:\n\nU3 +2 ——> 0% + [6 m. 6. v. of y rays, not necessarily\n\nall of one frequency)\n\n23 min.\n\nU3 ——>\n\n2.3 day\nwNp% ——+ Pu) + B-[600 kv. upper B~ energy limit, Also 2y\nrays, 400 ky. and 270 Kv., about 34 con-\nverted to electrons}\n\naNp’ + B-[1 m.e. v. B-, 00 y rays)\n\nA small amount of 94240 may also be found, formed by\naddition of a neutron to 94239, Capture of thermal neu-\ntrons by U88, as indicated in bodies A and C of Fig. 1,\nalso results in production of element 94 by the same\nprocess.\n\nThe predominant isotope produced, 94239, is a long\nlived radioactive product with a half life of about 20,000\nyears.\n\nA large percentage of the original fast neutrons escape\nresonance capture and fast neutron leakage, and are re-\nduced to thermal energy within the system. Of these\nthermal neutrons, a small number on the average may\nleak by diffusion out of the system and be lost from the\nchain reaction, leaving the remainder of the thermal neu-\ntrons diffusing through the moderator in condition to\nproduce fission if they promptly enter U255 or element 94\nwithout being captured by any other material.\n\nThe fission reaction is as follows:\n\n92U235 4-neutron=A+B-+-n neutrons (average)\nA=“light” fission fragment, e. g., Br, Kr, Rb, Sr, Y, Zr,")),
  paragraph(literal("2,708,656\n\nCb, Mo, 43, Ru, Rh. Atomic mass, 83-99, inclusive.\nAtomic number, 35-45, inclusive.\n\nB=“heavy” fission fragment, e. g., Sb, Te, I, Xe, Cs, Ba,\nLa, Ce, Pr, Nd. Atomic mass, 127—141 inclusive.\nAtomic number, 51-60 inclusive.\n\nIn any practical system, impurities will be present in\nboth the moderator and the uranium. In the chain de-\nscribed, a small fraction of the neutrons can be captured\nand absorbed by impurities in the system without the\nreproduction factor of the system falling below unity.\nThus for example in Fig. 1, if impurities necessarily pres-\nent in the materials do not consume too many neutrons,\nsome excess neutrons are available to be captured by\n“impurities” intentionally introduced for control pur-\nposes, i. e., by a control rod, later to be described. Fur-\nthermore, since many of the thermal neutrons diffusing\nthrough the moderator are not in a position to promptly\nenter a uranium mass when they reach thermal energy,\n\nthese thermal neutrons must continue to diffuse through ,,\n\nthe moderator until they do reach a uranium body. Dur-\ning this diffusion, a small percentage of the neutrons are\nabsorbed by the moderator, leaving sufficient thermal\nneutrons to enter a uranium body to produce new fast\nneutrons by fission, to repeat the cycle. In the uranium-\ngraphite system about 72n thermal neutrons enter the\nuranium body to produce 100” new fast neutrons, i. e.,\na survival of about 72 per cent of the original 100” fast\nneutrons during the slowing process.\n\nThe four neutron losses from the chain reaction re- ,\n\nferred to above are represented in Fig. 1, where the reso-\nnance absorption at Cand the friction of thermal neu-\ntrons absorbed by U238 at I represent the uranium ab-\nsorption losses, Losses due to impurities are represented\nat F, those due to absorption in the moderator at G, and\nthe leakage losses due to the finite size of the system at\nBand E.\n\nThese losses will be considered in detail in the order\nnamed, as any one of these losses, or their total if too\nhigh, can prevent a self-sustaining chain reaction from\nbeing attained in a system of any size.\n\n1. Neutron loss by absorption in uranium\n\nIt is possible by proper physical arrangement of the\nmaterials substantially to reduce uranium resonance ab-\nsorption, as will be shown later. By the use of light\nelements for moderators, fewer collisions are required to\nslow the neutrons to thermal energies with large incre-\nments of energy loss per collision, thus decreasing the\nprobability of a neutron being at a resonance energy as it\nenters a uranium atom. During the moderation, how-\never, neutrons are moving through the slowing medium\nover random paths and distances so that the uranium is\nnot only exposed to thermal neutrons but also to neutrons\nof energies varying between the energy of fission and\nthermal energy. Neutrons at uranium resonance energies\nwill, if they enter uranium at these energies, be absorbed\non the surface of a uranium body whatever its size, giving\nrise to surface absorption. Any substantial reduc-\ntion of overall surface of the same amount of uranium\nwill reduce surface absorption, and any such reduction\nin surface absorption will release neutrons to enter di-\nrectly into the chain reaction.\n\nFor a given ratio of moderator to uranium, surface\nresonance absorption losses of neutrons in the uranium\ncan be substantially reduced by a large factor when the\nuranium is aggregated into substantial masses in which\nthe mean spatial diameter is at least about 0.5 centimeter\nfor natural uranium metal and somewhat larger when the\nbodies are of a uranium compound, as hereinafter more\nfully discussed. For example with UO2 the minimum\nradius is larger and with other uranium compounds a\nsimilar variation from metallic uranium may be ob-\nserved, The degree of this variation is dependent upon\nthe density of the uranium compound, its bulk density,\nand the absorption coefficient of other elements therein\n\n1d\n\n40\n\n4:\n\nwet\n\n60\n\n70\n\n7\n\n6\n\nfor neutrons. In any event the uranium may be placed\nin the system in the form of geometrically spaced uranium\nmasses or bodies of substantial size, preferably either\nof metal, oxide, carbide, or combinations thereof the\nmoderator being in a substantially continuous phase. The\nterm geometric is used to mean any pattern or arrange-\nment wherein the uranium bodies are distributed in the\nmoderator with at least a roughly uniform spacing and\nare roughly uniform in size and shape, or are systematic\nin variations of size, shape or spacing to produce a volume\npattern conforming to a generally symmetrical system.\nIf the pattern is a repeating or rather exactly regular\none, the structure may be conveniently described as a\nlattice. The uranium bodies can be in the form of layers,\nrods, or cylinders, cubes or spheres, or approximate\nshapes, dispersed throughout the moderator. Optimum\nconditions are obtained with natural uranium by using\nmetal spheres.\n\nThe resonance losses in uranium constitute one of the\ncritical factors in coordinating the total losses permissible\nin a neutronic reactor. Proper sizes and shapes of the\nuranium bodies and volume ratios of uranium to modera-\ntor must be fairly accurately known in order that optimum\ngeometry be approached, or if the use of near-optimum\ngeometry is not desirable, then the permissible ranges of\ndeparture from the optimum should be determined, so\nthat a reproduction ratio greater than unity can be main-\ntained in a reactor of practical size.\n\nThe K constant of a mixture of fine uranium oxide\nparticles in a light element such as graphite, found to\nbe satisfactory as a neutron moderator, assuming both\nof them to be theoretically pure, would only be about\n.785. Actual K constants as high as about 1.04 have\nbeen obtained using aggregation of natural uranium\noxide in graphite, and with as pure materials as it is\npresently possible to obtain, showing a substantial gain\ndue solely to reduction of resonance loss.\n\nAssuming theoretically pure graphite, and theoretical-\nly pure natural uranium metal, with the presently obtain-\nable densities of 1.65 and 18 gms./cm.3, respectively,\nthe maximum possible K constant theoretically obtainable\nis about 1.1. When heavy water (D20) is used as a\nmoderator, higher K constants approaching 1.3 are ob-\ntainable. Still higher K constants can be obtained in\nuranium having more than the naturally occurring con-\ntent of thermal neutron fissionable elements. Adding such\nfissionable material is termed enrichment of the uranium.\n\n2. Neutron loss by absorption in the moderator\n\nNeutrons are also subject to capture by the modera-\ntor. While carbon and beryllium have very small cap-\nture cross sections for thermal neutrons, and deuterium\nstill smaller, a fraction of the thermal neutrons present\nin the system even under best conditions is lost by cap-\nture in the moderator during diffusion therethrough. It\nis therefore desirable to have the neutrons reaching\nthermal energy enter uranium as promptly as possible.\nThis may be taken care of by using optimum or near\noptimum geometry where the resonance absorption is\nsubstantially equal to absorption in the moderator.\n\nModerators differ in their ability to slow down neutrons\nand in their capacity to absorb neutrons. The ability to\nslow down neutrons may be expressed by what is known\n\n“as the scattering cross section of the nucleus, whereas\n\nthe ability to absorb or capture neutrons is expressed by\nwhat is known as the capture cross section of the nucleus,\nThe ratios of absorption cross section to scattering cross\nsection for moderators discussed herein are approximately\nas follows:\n\nLight water (H20)------------------------ 00478\nDiphenyl ~------------------------------- 00453\nBeryllium .2...--.----------------------- 00127\nGraphite ...-....------------------------ .000726\nHeavy water (D20)_-----------------~-----+ 00017")),
  paragraph(literal("2,708,656\n\n7\n\nIt is also to be noted that beryllium and heavy water\ninherently possess the property of emitting neutrons in\nresponse to irradiation with gamma rays.\n\nThe choice of moderators therefore will depend on\nmany considerations, as will be apparent from further\ndiscussions herein.\n\n3. Neutron loss by absorption by impurities in the system\n\nHowever, even when resonance and moderator losses\nare reduced to a practical minimum, no self-sustaining\nchain reaction can be obtained in any system unless im-\npurities in the materials used for the reaction are reduced\nto such an extent that the loss by parasitic capture by\nsuch impurities will not, in combination with the other\nlosses, prevent the reaction from becoming self-sustain-\ning. Impurities present in both the uranium and the\nmoderator consequently constitute a very important\nneutron loss factor in the chain. The effectiveness of\nvarious elements as neutron absorbers varies tremend-\nously.\n\nCertain elements such as boron, cadmium, samarium,\ngadolinium, and some others, for example, if present\neven in a few parts per million, could very likely prevent\na self-sustaining chain reaction from taking place. It\nis highly important, therefore, to remove as far as pos-\nsible all impurities capturing neutrons to the detriment\nof the chain reaction from both the slowing material and\nthe uranium. If these impurities are present in too great\nquantity, the self-sustaining chain reaction cannot be at-\ntained. The permissible amounts of impurities will vary\nfor each specific geometry, depending upon such con-\nsiderations as the form in which the uranium is used—\nthat is, whether natural or enriched, whether as metal\nor oxide. The type of slowing down material used also\ninfluences the effect of impurities, as do the weight ratios\nbetween the uranium and the slowing down material.\nElements such as oxygen may be present, and the uranium\nmay be in the form of oxide, such as UOz or U30s, a\ncarbide, or fluoride, but the metal is preferred. Nitrogen\nmay be present in the reactor in fairly large amounts,\nand its effect on the chain reaction is such that the\nneutron reproduction ratio of the system may be changed\nby changes in atmospheric pressure. This latter effect\nmay be eliminated by excluding nitrogen from the system,\nor by sealing the system from the effects of changes of\natmospheric pressure.\n\nThe effect of impurities on the optimum reproduction\nfactor K may be conveniently evaluated by means of\ncertain constants known as “danger coefficients” which\nare assigned to the various elements.\nefficients for the impurities are each multiplied by the\nper cent by weight of the corresponding impurity, with\nrespect to the weight of uranium in the system, and the\ntotal sum of these coefficients gives a value known as the\n\ntotal danger sum. This total danger sum is subtracted §\n\nfrom the reproduction constant K as calculated for theo-\nretically pure materials and for the specific geometry\nunder consideration.\n\nThe danger coefficients are defined in terms of the\nratio of the weight of impurity per unit mass of uranium\nand are based on the cross section for absorption of\nthermal neutrons of the various elements. These values\nmay be obtained from physics textbooks on the subject,\nand by direct measurement, and the danger coefficient\ncomputed by the formula\n\nT; As\n\nT.A;\n\nwherein Ti and Tu represent the cross sections for the\nimpurity and the uranium respectively, Ar the atomic\nweight of the impurity and Az the atomic weight for\nuranium. Regardless whether the impurities are in the\nmoderator or in the uranium, they are computed as their\nper cent by weight of the uranium in the system.\n\nDanger coefficients for some elements are given in\n\nThe danger co- 5\n\n30\n\n40\n\n60\n\nthe following table, wherein the elements are listed in\norder of their atomic number:\n\nElement Coefaient Element Coothaient\n10 1.5\n0.1 7\n3\n310 1.8\n0 0.61\n2150 wi\n0.012 2\n6.3\n0.002 25\n: 18\n0.48 870\n0.30 54.2\n0.26 0.18\n0.3 16\noe 16\n0.30\n2.1 ~1430\n0.37 435\n38 ~6320\n4 0.03\n2 0. 0025\n7.5 11\n\nThe sum of the danger coefficients of the impurities\nin any given composition entering into a reactor, as\nmultiplied by the per cent by weight of the uranium in\nthe reactor, is known as total danger sum of the com-\nposition. This figure is a dimensionless constant like\nK and can be directly subtracted from K. It will be\nnoted that the danger coefficients given are related to the\nneutron absorption value of unity for uranium.\n\nAs a specific example of the use of danger coefficients,\nif the materials of a system under consideration have 0.01\nper cent by weight of each of the elements H, Co, and\nAg with respect to the weight of the uranium in the\nsystem, the total danger sum in K units for such an\nanalysis would be:\n\n0001 10+.0001 x 17+ .0001 X 18=.0045\n\nThis figure can then be subtracted from the K cal-\nculated for a particular geometry of theoreticaliy pure\nmaterials to give the actual K constant for the materials\nused, This would be a rather unimportant reduction in\nthe reproduction factor K unless the reproduction factor\nK for a given geometry and materials without consider-\ning impurities, is very nearly unity. If, on the other\nhand, the impurities in the uranium are Li, Co, and\nRh in the same percentage, the total danger sum would\nbe:\n\n.0310-+.0017+-.0050—.0377 reduction in K due to im-\npurities\n\nThis fatter reduction in the reproduction factor for a\n\ngiven system would be serious and might well reduce\n\nthe reproduction factor below unity for certain geom-\n\netries.\n\nThe maximum possible K constants for neutronic re-\naction systems when natural uranium aggregates in opti-\nmum geometry (i. ¢., best apportionment of resonance\nand moderator losses) are used, and where the materials\nused are assumed to be theoretically pure, have been\ncalculated as follows:\n\nK for Pure\nMaterials Materials\n\nU metal—graphite moderator... -| i\nU oxide—graphite moderator- -. 1.07.\nU metal—beryllium metal moderator. Li\nU metal—beryHium oxide moderator. - -) 1.1.\nU metal—heavy water rthoderator-....._- -| About 1.3.\nU metal—light water moderator--__-.......-------------- About 1.\n\nIn reactors operating at high neutron densities an\nequilibrium poisoning factor up to .024 K can develop\nand must be taken into consideration, as will be brought\nout later.\n\nIt can readily be seen from the above tabulation that")),
  paragraph(literal("2,708,656\n\n10\n\nThe total danger sum for impurities in both the uranium and moderator must be less than about .3 in order that the K factor remain equal to or greater than unity with a deuterium moderator, about .11 with a beryllium moderator, and about .1 with a graphite moderator. Light water can be used as a moderator, at least in part of a reactor, as will be pointed out later.\n\nIn the chain reaction outlined in Fig. 1 for a natural uranium reactor of practical size, a small percentage of neutrons can be absorbed by impurities without reducing the neutron reproduction ratio below unity. Not all of these neutrons, however, should be absorbed by the residual impurities in the uranium and the moderator, because if this were so the system would always just be self-sustaining and no exponential rise in neutron density could be obtained. Some means must be provided to release additional neutrons to enter the chain.\n\nFor example, in Fig. 1, it may be considered that only half of the neutrons that can be absorbed by impurities are absorbed by materials actually present as impurities in the uranium and the moderator, and that the other half are absorbed by a strong neutron absorbing material, such as cadmium, that is wholly or partially removable from the system. Under these conditions, with the chain reaction in balance, if the amount of cadmium is reduced to a point where fewer neutrons are absorbed, the neutron density will rise exponentially when the system is large enough. To stabilize the reaction at any desired neutron density, the absorbing material is reinserted until the total permissible absorption is restored; to reduce density, more absorber is introduced. The reaction is stopped by leaving sufficient absorber in the system to prevent the reaction from building up.\n\n4. Exterior neutron loss in a neutronic reactor of practical size\n\nIn an infinite-size system there is no exterior leakage. In a finite reactor, fast neutrons can escape while slowing in the moderator near the periphery, and slow neutrons can escape while diffusing near the periphery. The smaller the reactor, the greater this exterior loss. A reflector of low absorption-to-scattering ratio can reduce the loss.\n\nMEASUREMENT OF NEUTRON LOSSES\n\nAn exponential pile is a deliberately non-operating pile of known uranium-graphite geometry. A neutron source at the bottom produces a density distribution that declines exponentially with distance. The slope measures the effects of geometry, moderator, uranium composition, and impurities on the reproduction constant K.")),
  paragraph(literal("2,708,656\n\n11\nmetrical arrangement of the uranium lumps in the mod-\nerator is called a lattice.\n\nBriefly, the theory of exponential pile measurements is\nas follows:\n\nConsidering a uranium-graphite lattice structure or\ncolumn of square cross section with sides equal to a, and\nsemi-infinite height, with a source of fast neutrons at the\ncenter of the base of the column, then, at points suffi-\nciently far removed from the source, the neutron density\ndue to any chain reaction present will be given by an\nequation of the following form where x, y, and z are the\naxes of the structure:\n\nz\nn=Li,Aie © cos = cos 222\n\n= ()\n\nwhere the symbols “ij” represent the orders and argu-\nments of the Bessel function series and “A” is a constant\nwhich varies with the Bessel functions included in the\nsummation.\n\nThe x axis is taken along the vertical axis of the struc-\nture, and the x=0 plane coincides with the base of the\npile. Thus, for points close to the vertical axis, each\nharmonic of the neutron density decreases exponentially\nas follows:\n\n4\n\nny= Ae OM (2)\nwith a relaxation distance or length equal to 51, the re-\nlaxation distance or length being the distance in which\nthe neutron flux is reduced to a fraction of 1/e of its orig-\ninal value. Ata sufficiently large distance from the source\nthe first harmonic only is important. The relaxation\nlength can then be taken as 4, and b taken alone is re-\nlated to the reproduction factor, K, through the following\n\nequation:\n2x3 -\nR=1-F(5- ee |\nwhere\n\na=length of side of the structure.\n\nb=relaxation distance.\n\nA= mean free path of thermal neutrons in graphite.\nA=mean free path for absorption collision.\n\ni 2x\n(3)\n\n2\nT=the age of nascent thermal neutrons.\nThe quantity\n1_ 2a\nBa\n\nA signifies a number given by the ratio of An to n\nwhere n is the number of thermal neutrons per cubic\ncentimeter at the point x, y, z. An is an abbreviation for\nthe sum of the three second derivatives of n with respect\nto the three variables x, y, z. A is found to be constant\nthroughout any structure utilizing given geometries and\nmaterials. For the cases where K is close to unity, A is\nsmall, so that the equation can be ate\n\nAA 1\nKa1—(F+ 79) ‘a (4)\nBy defining\nnA te\ntaf O°\nM 5 +— Z\n\nthen M is the migration length of neutrons in the struc-\nture, and is roughly proportional to the average distance\nbetween the place of birth of a neutron as a fission neutron\nand its place of death by thermal absorption.\n\nSubstituting in (4) the quantity A for the quantity\n\ni _ 2x8\n\n& a!\nand M? for\n\ndA ro\n\nata\nthe equation can be written\n\n10\n\n30\n\n40\n\n45\n\n50\n\n53\n\n60\n\n65\n\n70\n\n75\n\n12\nK=1—M%A (5)\n\nThe final equation for K can then be written to include\nM2, a and 6 as follows:\n\nK=1-— M( 5 a) (6)\n\nM2? has been found to be from about 650 cm.? to 750\ncm.? for chain reacting structures of uranium and graph-\nite, for example, and can be used in Equation 6 to find K\nfor such structures.\n\nThe length of a side, a, to be used in calculating K\nfrom Equation 6 must be that value for which the neutron\nintensity actually becomes equal to 0. Because of the\nfinite length of the mean free path A, compared to the\ndimensions of the pile, the effective side is larger than\nthe physical side. From neutron density measurements\nmade at the outer surface of the pile, the effective value\nof a can be estimated, for various x planes. Using the\nquantities found for M and a, a measurement of the re-\nlaxation distance 6, associated with the first harmonic of\nthe neutron density will then determine, from Equation\n6, the reproduction factor corresponding to a lattice of\ninfinite dimensions similar in geometry and materials to\nthe structure being tested. This reproduction factor must\nbe modified when used in conjunction with reactors attain-\ning high neutron densities for prolonged time periods, by\nan operational poisoning factor. This factor can be added\ninto the exponential pile by adding equivalent absorbers\nto each cell and then finding A or K. When K is found\nwithout such absorbers this factor can be directly de-\nducted.\n\nTo determine the relaxation distance 6, thin indium\nfoils, (.0924 gm./cm.?) are placed at positions along the\naxis of the pile for a predetermined time for example and\nthe 54 minute radioactivity induced by neutron bom-\nbardment is measured on Geiger-Mueller counters for a\npredetermined time. For these measurements the indium\nfoil is held in a nickel holder. Thus the activation of\nthe foil (Ani) is due to the absorption of both thermal\nand indium resonance neutrons. All measurements are\ncorrected to give the foil activity values for iniinite times\nof irradiation. The emission of neutrons by spontaneous\nfission of the uranium in the pile produces a small neu-\ntron background which must be subtracted from the\ndensity measurements.\n\nBecause of the finite height of an exponential pile,\ntwo corrections may be applied to neutron density meas-\nurements. First, a harmonic correction due to the pres-\nence of higher harmonics in the neutron density curve in\nhorizontal planes near the source; and second, an end-\ncorrection due to the proximity of the top of any prac-\ntical column to the measuring positions.\n\nFinally after making the harmonic and end-corrections,\n6 is calculated from the relation\n\nD\nb= = nas (7)\n\n(Andi\n\nwhere D is the distance between the two positions x: and\nx2 along the vertical axis at which (Ani)1, and (Ani)2\nare measured and Jn the mean [ogarithm to the base e.\n\nFor measurements near the top of the pile the har-\nmonic correction may be ignored. For measurements\naway from the top the end-correction may be ignored.\nThus the best values are obtained from measurements\nin x planes intermediate between the sources and top.\n\nTwo neutron density measurements made in adjacent\npositions along the vertical axis of the exponential pile\nwill, therefore, give 6 and a value A or a value for K\nwhen the value of M? is known. It is customary to aver-\nage the values obtained by using measurements made in\nseveral adjacent and equally spaced positions along the\nvertical axis.to obtain the average A or K constant for\nthe entire pile.\n\nThe same procedure can be used when liquid modera-\ntors are involved by placing the liquid in a tank and sus-")),
  paragraph(literal("2,708,656\n\n13\npending the uranium, in the form of rods, for example,\nso that it enters the moderator. Measurements are made\nas set forth herein for solid moderators.\n\nThe migration length has been described as roughly\nproportional to the average displacement of a neutron\nfrom the point of its origin as a fast neutron in a uranium\nlump to the point of its disappearance in the pile. More\nprecisely, we define the square of the migration length\nby the formula,\n\n(8)\n\nwhere M? is the mean square distance between production\nand disappearance of neutrons in the lattice.\n\nIn principle, an experiment for the actual measure-\nment of the migration length could be performed as\nfollows: A lattice of a given type is set up, as for the\nexponential pile. For best results it would be desirable\nto suppress neutron multiplication in this lattice, which\ncould be done, for example, by using instead of normal\nuranium, uranium completely depleted in the fissionable\nisotope, and readjusting the neutron absorption to equal\nthat of normal uranium by the addition, say, of boron\nas a neutron absorber. Into this prepared lattice intro-\nduce a point source of fission neutrons, which might be\na lump of spontaneously fissioning material. Then, by\nthe usual foil techniques we could measure the distribu-\ntion of thermal neutrons through the lattice, and com-\npute the mean square distance by known methods. In\nprinciple one would thus obtain the correct value of M?,\n\nSuch experiments have not to date been performed,\nbecause the preparation of the material is very expensive,\nand no proper fission source is presently available. Ac-\ntually the best existing knowledge of M? for the present\nlattices is obtained by measurements made in an expo-\nnential pile using the formula:\nwhich is Formula 5 above. The Laplacian A can be\nmeasured directly in the exponential pile as follows using\nthe formula:\n\natt, AA\nmatt +e\n\n(10)\n\nand by finding the values of a and b as outlined above,\nthe value of A may be determined. A neutron absorber\nof known neutron capture cross section is then introduced\ninto the exponential pile in known amounts, the change\nin the Laplacian measured, and M2? calculated from the\nmeasurements.\n\nIn one specific instance of an exponential pile having\nuranium rods arranged in graphite in such a manner that\nliquid could be passed over the uranium bodies, borated\nwater in various concentrations of boron was passed\nthrough the lattice. It was found that there was a change\n\nin A of\n10-8\n-0584 X Ta\nfor one part per million of boron in the water. From\n\nthis change the value of M? was calculated to be about\n590 cm.?, accurate within about 10 per cent of error.\nIt is to be noted however that M? enters into K—1 only\nso that the error in K would then be only about 1 per\ncent at the most. M2? in this case is slightly lower than\nin a reactor without a cooling system and for a uranium\nmetal sphere-graphite lattice M? has been found to be\nabout 700 cm.?.\n\nThe practical calculations for pile design do not even\ndepend upon this procedure but upon a more theoretical\none still, M? can be written:\n\nM?=7+L0?(1—f) (11)\n\nwhere the symbol r designates the “age” of nascent neu-\ntrons and is essentially the mean square distance that fis-\n\n10\n\n15\n\n20\n\n25\n\n30\n\n35\n\n45\n\n50\n\n55\n\n60\n\n65\n\n75\n\n14\n\nsion neutrons may travel before becoming thermal. This\ncan be directly measured in the moderator used, since\nthe metal has a very small effect on slowing down. The\nsecond term (Lo?) is the diffusion length squared for\nthermal neutrons in the lattice in question, which is equal\nsimply to the diffusion length in the moderator. Lo can\nalso be directly measured in the moderator used, and\nis multiplied by the fraction of neutrons absorbed in the\nmoderator, which is (1—/), where f is the thermal utiliza-\ntion defined as the fraction of the thermal neutrons ab-\nsorbed by the uranium (both by simple capture and to\nproduce fission) rather than by the moderator. Such\ncalculations find many objections but are adequate to 10\nto 15 per cent and are suitable, therefore, for design pur-\nposes in finding K—1.\n\nThe following values of M? have been found by meas-\nurements and calculation to be indicative for preliminary\ndesign purposes in building reactors:\n\nFor water, M?=40 cm.?\n\nFor D2O, 1?=230 cm.?\n\nFor beryllium, M?=on the order of 300 cm.?\nFor graphite, M?—600 cm.2—700 cm.\n\nBy the use of the exponential pile, various sizes and\nshapes of uranium bodies have been tested and the re-\nlated K factors found for various moderators.\n\nBy testing uranium compositions in the exponential pile,\nthe neutronic purity can be determined in terms of K\nwhen the same moderator is used or when the effect of\nthe moderator impurities is known, with geometry un-\nchanged. The test is equally reliable for uranium com-\npounds such as the uranium oxides U3Os and UOa,\nuranium carbide, uranium tetrafluoride, uranium hexa-\nfluoride, etc., compounds which contain, in addition to\ntraces of elements having high neutron capture cross sec-\ntions, large amounts of elements such as O, C, and F, all\nof which have relatively low neutron capture cross sec-\ntion. The test can evaluate the total effect of both types\nof impurities in terms of K reduction, as well as the effect\nof changing geometries on K.\n\nWhen M? is known, this factor can be used to deter-\nmine critical size of the structure for various moderators.\n\nThus the determination of (1) the proper size, shape\nand disposition of the uranium bodies in the moderator\nto reduce resonance losses; the determination of the\n(2) amounts of neutron absorbing impurities that can\nbe tolerated in addition to other losses before a self-sus-\ntaining chain reaction will become impossible in a sys-\ntem of practical size; and determination of (3) the nuclear\ncharacteristics of the moderator with respect to require-\nments of critical size and tolerable exterior losses; has\nenabled us to provide a means and method of building\nneutronic reactors capable of sustaining a chain neutron\nreaction by virtue of nuclear fission, even when individual\nvalues for constants entering into the nuclear processes are\nonly imperfectly known.\n\nIt is, therefore, an object of the present invention to\nprovide a means and method of designing and building\nand operating neutronic reactors capable of sustaining a\nchain nuclear reaction by virtue of nuclear fission, and to\noutline the variations that can be tolerated before the\nreaction wil! become impossible of attainment in structures\nof practical size.\n\nOther objects and advantages of this invention will be\napparent from a description of several operative reactors\nas shown in the attached drawings, wherein:\n\nFig. 1 is a diagram or chart illustrating the balanced\ncondition of a chain reaction in a system of practical size\nemploying natural uranium in graphite;\n\nFig. 2 is a graph on which are plotted contour lines\nrepresenting various reproduction constants K for systems\nemploying uranium metal spheres and graphite;\n\nFig. 3 is a graph similar to that of Fig. 2 for cylindrical\nrods of uranium metal;\n\nFig. 4 is a graph on which are plotted contour lines")),
  paragraph(literal("2,708,656\n\n15\n\nrepresenting various values for the reproduction con-\nstants K for a uranium oxide (UOz)-graphite system\nwherein the oxide is in the form of spheres;\n\nFig. 5 is a graph on which are plotted contour lines\nrepresenting various reproduction constants K for systems\nemploying uranium oxide (UOz) and graphite wherein\nthe oxide is in the form of cylindrical rods;\n\nFig. 6 is a graph showing K contour lines for uranium\nmetal rods immersed in D20;\n\nFig. 7 is a perspective view of a uranium-graphite re-\nactor completely enclosed in a radiation shield;\n\nFig. 8 is a front end plan view of the reactor shown in\nFig. 7, a portion of which is shown in central vertical\nsection;\n\nFig. 9 is a side plan view of the reactor a portion of\nwhich is shown in central vertical section;\n\nFig. 10 is a top plan view of the reactor a portion of\nwhich is shown in central horizontal section;\n\nFig. 11 is a plan view of one of the graphite blocks\ncontaining uranium metal with a portion broken away to\nshow in section one of the uranium metal cylinders;\n\nFig. 12 is a longitudinal sectional view taken on the\nline 12—12 of Fig. 11;\n\nFig. 13 is a longitudinal sectional view of a graphite\nblock and showing pseudospheres of uranium oxide in\nplace of the uranium metal;\n\nFig. 14 is a plan view of a graphite block loaded with\npseudospheres of uranium oxide, with a portion of the\nblock broken away to show a pseudosphere in a section\ntaken as indicated by line 14—14 in Fig. 13;\n\nFig. 15 is a plan view of a dead graphite brick with a\nportion broken away and shown in section;\n\nFig. 16 is a schematic wiring diagram of a neutron den-\nsity monitoring circuit;\n\nFig. 17 is a graph showing neutron density values\nplotted with relation to the number of layers as a cubical\nreactor is built;\n\nFig. 18 is a diagrammatic side view of a safety rod;\n\nFig. 19 is a diagrammatic side view of a shim or limit-\ning rod;\n\nFig, 20 is a diagrammatic side view of a control rod;\n\nFig. 21 is a graph on which are plotted neutron density\nvalue relations found in the active portion of the system\nplotted against number of layers of graphite bricks for\nan ellipsoidal reactor;\n\nFig. 22 is an enlarged, fragmentary, perspective view\nof a modified active portion in which the overall shape\nis in the form of a cube or parallelepiped and the\nuranium is arranged horizontally in cylinders or rods;\n\nFig. 23 is a second modification of the active portion ;\n\nof the system wherein the overall shape is cylindrical\nand the uranium is disposed vertically in the form of\ncylinders or rods;\n\nFig. 24 is a diagram illustrating the distribution of\nneutron density in a spherical reactor;\n\nFig. 25 is a vertical sectional view of a neutronic re-\nactor employing deuterium oxide as the moderator;\n\nFig. 26 is an enlarged fragmentary vertical sectional\nview through a portion of the reactor showing in par-\nticular a uranium rod used in the reactor shown in\nFig. 25;\n\nFig. 27 is a fragmentary detail sectional view corre-\nsponding to Fig. 26 but showing only a modification of\nthe ball valve seal shown in Fig. 26;\n\nFig. 28 is an enlarged vertical sectional view of a\nportion of a uranium rod equipped with an attached\nadapter for removing the uranium rod from the reactor;\n\nFig. 29 is a horizontal sectional view shown partially\nin elevation, the section being taken on the line 29-29\nFig. 25;\n\nFig. 30 is a diagram showing change of critical size\nin U-C reactors with change in K;\n\nFig. 31 is a longitudinal view partly in section and\npartly in elevation of an air cooled neutronic reactor\nsystem);\n\n10\n\n15\n\n20\n\n25\n\n40\n\n45\n\n60\n\n75\n\n16\n\nFig. 32 is a cross sectional view, partly in elevation,\ntaken as indicated by the line 32—32 in Fig. 31;\n\nFig. 33 is a plan view of the system shown in Figs.\n31 and 32;\n\nFig. 34 is a longitudinal sectional view, partly in eleva-\ntion, of a jacketed slug;\n\nFig. 35 is a longitudinal sectional view, partly in eleva-\ntion of a horizontal channel during a loading and un-\nloading operation;\n\nFig. 36 is a cross sectional view taken as indicated\nby the line 36—36 in Fig. 35;\n\nFig. 37 is a vertical sectional view (partly in eleva-\ntion) of a liquid cooled reactor;\n\nFig. 38 is a vertical section view (partly in elevation)\nof the reactor shown in Fig. 37, and taken as indicated\nby the line 38—38 in Fig. 37;\n\nFig. 39 is a diagrammatic perspective view of a uranium\nrod and associated coolant channel;\n\nFig. 40 is a diagram showing the statistical weight of\nconcentric lattice portions of uniform K plotted against\nthe extent of the same lattice portions within the struc-\nture;\n\nFig. 41 is a diagram showing the effect of reflectors\nof various thickness on the size of the reactor; and\n\nFig. 42 is a diagram showing the outline of a reactor\nin the shape, roughly, of an ellipsoid.\n\nAN ILLUSTRATIVE NEUTRONIC REACTOR\nHAVING A SOLID MODERATOR\n\nOne of the simplest ways to accomplish a self-sustain-\ning chain reaction operating by virtue of nuclear fission\nis to utilize either uranium metal, uranium oxide, or\nboth, aggregated into bodies of substantial size and spaced\nin a.solid moderator such as graphite to form a lattice,\nand built without the introduction of a cooling system\ninto the reactor. Such a neutronic reactor is shown\nin Figs. 7 to 21, inclusive.\n\nFig. 7 shows the neutronic reactor system diagram-\nmatically in perspective and will be first referred to. As\nthe active portion of the reactor loses large quantities\nof neutrons during operation, and the fission reaction\ncreates gamma radiation, it is desirable to protect operat-\ning personnel from the radiations resulting from the chain\nreaction. In this instance protection is provided by sur-\nrounding substantially all of the reactor with concrete\nor equivalent shielding.\n\nA heavy concrete foundation 10 is first poured and\nside walls 11 and connecting backwall 12 are then erected.\nThis provides a vault space 14 (Figs. 8, 9 and 10) in\nwhich the chain reacting lattice of uranium and graphite\nis erected until the vault is filled within about five feet\nof the top and five feet of the front, as will be later\ndescribed. The front of the vault is then closed by a\nfront wall 15 formed of concrete, and the top is closed\nby a top wall 16 which may be of wood and lead layers.\nThe top wall 16 is pierced by a large opening 20, leading\nto a well 21 extending inwardly to the peripheral layer\nof uranium bodies in the internal lattice. A smaller\nadjacent aperture 25 is the exterior opening of a shaft\n26 (Fig. 8) extending into the central portion of the\nreactor.\n\nFront wall 15 is pierced by shim and regulating rod\napertures 29 and 29a respectively, positioned on each\nside of and slightly above the center of front wall 15.\nA “shim” or limiting rod 30 is positioned on a limiting\nrod platform 31 and is movable to enter aperture 29 in\na horizontal plane; and a regulating or control rod 32 is\npositioned on a control rod platform 33 to enter aperture\n29a in a horizontal plane. Below the plane of these\ntwo rod platforms is a removal platform 34 positioned\nto receive lattice portions that may be removed from\nthe reactor through a removable section channel 35 and\nfrom removable stringer channels 36. Details of the\nrod mechanisms and use of the platforms will later be\ndescribed.")),
  paragraph(literal("2,708,656\n\nOne side of the reactor side wall 11 is pierced by a pair of spaced safety-rod apertures 40 through which two safety rods 41 can be horizontally inserted into the reactor from safety-rod platform 42. Just below the safety-rod apertures is an ionization-chamber channel 43. This completes the description of the exterior of the reactor.\n\nThe basic construction unit used to fill vault space 14 is a graphite block 4 3/4 inches by 4 3/4 inches in cross section, used in a number of lengths. The blocks are carefully planed by woodworking machinery to have smooth rectangular sides and end faces, so that they may be readily piled or stacked to fill the vault space 14 without substantial air spaces. Such construction has led the device to be termed a “pile,” but the more generic term “reactor” is preferred.\n\nTwo main types of graphite blocks are used as shown in Figs. 11–15. Certain blocks 50 are drilled with cylindrical holes spaced 8 1/4 inches center to center to receive the uranium bodies and are termed live graphite. Other blocks 51, as shown in Fig. 15, contain no uranium and may be termed dead graphite. The uranium bodies are cast uranium-metal cylinders 52 and uranium-oxide pseudospheres 54, with a few U3O8 cylinders; the oxides are compressed to a density of about 6 grams/cm.³.\n\nThe uranium bodies are placed in holes in blocks 50. These live graphite blocks, together with dead graphite blocks 51, build a uranium-lump lattice of substantially cubical form surrounded by several layers of dead graphite acting as a reflector 17. Three bottom layers of dead graphite are laid on the foundation, and alternate layers may have their blocks crossed at right angles for more uniform distribution of weight.")),
  paragraph(literal("2,708,656\n\nThe uranium-bearing rows are spaced by rows of dead graphite, with the uranium bodies aligned across and in depth in vault space 14. The uranium-bearing rows do not begin until 12 inches of dead graphite is laid next to the concrete walls and open front, and three sides have 16 inches of dead graphite. The uranium-bearing portion of the layer is about 17.2 feet wide by 19 1/2 feet deep.\n\nA layer of dead graphite is laid over the first uranium-bearing layer, and the next uranium-bearing layer is laid with the uranium bodies substantially aligned vertically. Thus the uranium lumps form a cubic lattice aligned with the rectangular coordinates of vault space 14. A central portion of metal lumps is positioned in stepped relation between the sixteenth and forty-eighth layers. Removable stringers, indicated at 36a in Figs. 9 and 10, permit rows near a central diameter to be removed for test purposes. A horizontal removable section 56 extends from front to rear through the central portion containing metal and is eight rows wide and eight rows high.\n\nAs the reactor is built, matching blocks bored with a vertical 2 3/8-inch hole provide continuity of shaft 26. Ionization chamber 60 is installed in channel 43 just inside wall 11; wire line 61 is connected to the monitoring circuit of Fig. 16. The sealed chamber casing 62 contains approximately 18 liters of boron fluoride at one atmosphere and a central electrode 63. A battery of about 450 volts and galvanometer 70 measure alpha-ray ionization caused by neutron absorption in the boron.\n\nSlots 71 and 72 are provided for the shim and regulating rods, and safety-rod slots 73 are provided at right angles in a higher dead-graphite layer. Construction is continued with the shim rod, control rod, and safety rods fully inserted.")),
  paragraph(literal("2,708,656\n\nAt least from the halfway point of construction, the natural neutron density in the pile is monitored as layers are added. Until critical size is reached, the short chains are convergent. By plotting neutron density within the pile against the layers, a prediction can be made in advance of the size at which the chain reaction will become self-sustaining. In Fig. 17 the results of indium-foil measurements are plotted against the number of layers.\n\nThe indium foils are exposed near the approximate center of the structure for a predetermined period, then removed and allowed to stand exactly three minutes so short-lived radioactivity decays substantially to zero. A standardized Geiger counter counts the beta rays. The results are converted to saturation values A0. The foils are preferably 4 cm. x 6.4 cm. and have a thickness corresponding to 0.094 grams/cm.².\n\nAs critical size is approached, the steady-state values of A0 approach infinity. The curve therefore indicates in advance the layer at which the system will become chain reacting. The described reactor reached critical size slightly above the fiftieth layer. Four additional dead-graphite layers completed the reflector across the top and gave an effective operating size; the reported doubling times were 90 seconds at layer 51, 32.9 seconds at layer 52, 9.0 seconds at layer 53, and 12.5 seconds at layer 54.\n\nThe concrete walls serve as the main shield against gamma radiation. The water in the concrete slows and absorbs escaping neutrons. The control rod 32 in Fig. 20 is a boron-steel composite moved by rack 82, pinion 83, motors 85 and 86, and a selsyn indicator 86a. The shim or limiting rod 30 in Fig. 19 is a cadmium sheet on fiber backing. The safety rods 41 in Fig. 18 are cadmium sheets held out by a solenoid latch; interruption of current releases the latch and gravity inserts the rods.")),
  paragraph(literal("2,708,656\n\nThe reactor is capable of operation at an output as high as 10,000 kilowatts for short periods. Since it is conductively cooled, only small powers can be continuously maintained without appreciable internal temperature rise. It is useful for manufacture of radioactive elements, as an intense source of neutrons through well 21 and shaft 26, as a generator of high-energy gamma rays, and for testing materials with removable stringers.\n\nThe power at a measurement location can be calculated from standard indium-foil saturation activity A0. Assuming the total energy produced per fission is 200 million electron volts, equivalent to 3.2 x 10^-4 ergs, the specification gives the power relation in its printed formula. Indium-foil measurements can calibrate galvanometer 70 in terms of watts.\n\nA prototype operated at about 200 watts and was then dismantled for incorporation in the larger reactor. Its active portion was a flattened rotational ellipsoid with a polar semi-axis of 309 centimeters, an equatorial semi-axis of 388 centimeters, an effective radius of about 355 centimeters, and an average K constant of about 1.054. It was surrounded by about 12 inches of graphite.\n\nThe changing shape during construction is represented by an effective radius R_eff calculated from the sides a, b, and c of a rectangular parallelepiped fitted to the structure. Values of R_eff are plotted against A0 and layers to predict the critical layer in Fig. 21. This reactor became chain reacting after the fifty-seventh layer.")),
  paragraph(literal("2,708,656\n\nThe neutron-density distribution in a spherical reactor is shown in Fig. 24. The maximum density occurs at the center and falls toward the periphery approximately as a cosine curve. Rod geometries can also be used: in Fig. 22 the uranium rods 75 are horizontal in bores 76 in live graphite blocks 77, while in Fig. 23 the rods and blocks are stacked vertically to form a cylindrical active portion.\n\nA chain reaction can also be maintained in a uranium-D2O reactor. Tank 101 is cylindrical and is made of a material relatively non-corrosive at low temperatures and relatively non-absorbent to neutrons, such as aluminum or stainless steel. One suitable tank is 6 feet in diameter and 7 feet 4 inches high. It contains 136 uranium-metal rods 102, each 1.1 inches in diameter and sheathed by aluminum about .035 inch thick.\n\nThe critical size is predicted by raising the level of D2O and plotting reciprocal neutron densities against the overall size of the filled portion. In the described reactor criticality occurred at a D2O level of 122.4 centimeters; an operating size with a neutron-density doubling time of 37.6 seconds was obtained at 123.1 centimeters, and at 124.7 centimeters the doubling time was 6.52 seconds. Graphite reflector 104 surrounds tank 101, and concrete shield 105 prevents neutron and gamma radiation from escaping.\n\nThe liquid-moderator structure further includes a cooled lead-cadmium shield 107, cover plate 108, iron and Masonite shield 109a, and a central irradiation well 109b. Helium is circulated above the D2O to remove gases formed by decomposition. Rod 102 in Fig. 26 is sealed in aluminum tubing and can be evacuated and leak-tested; Fig. 27 shows a gasket seal, Fig. 28 an attachment used during fabrication, and Fig. 29 hollow cadmium control and safety rods. The described uranium-D2O reactor was operated continuously at 250 kilowatts when filled to higher levels and properly shimmed.")),
  paragraph(literal("2,708,656\n\nThe following table sets forth constants for representative beryllium-uranium reactors, as presently known.\n\nBERYLLIUM METAL, DENSITY 1.85 GM./CM.3\n\n                                      U sphere       U rod        Slab\nRadius of uranium bodies              5.0 cm.        3.5 cm.     1.5 cm. (thickness)\nCritical cylinder                     165 x 309.1 cm. 165 x 304.9 cm. 79 x 343.8 cm.\nAmount of beryllium                   515 tons       48.9 tons    63 tons\nAmount of uranium                                    47.3 tons    69.2 tons\nK constant                                           1.0982       .842\n\nBERYLLIUM OXIDE, DENSITY 2 GM./CM.3\n\nRadius of uranium bodies              3.0 cm.        1.5 cm.\nCritical cylinder                     94.2 x 358 cm. 199.3 x 368 cm.\nAmount of beryllium oxide             134 tons       145 tons\n\nWith an efficient reflector, critical amounts of beryllium and uranium can be reduced a few per cent. Sphere and rod geometry as shown herein can be used with light water to give K factors around unity even with natural uranium. For example, a K constant slightly over 1 has been obtained by using uranium rods 1.5 centimeters in diameter, placed parallel in light water with a volume ratio of water to uranium metal of 1.65. Diphenyl can also be used as a moderator and closely resembles light water, giving a gain of from 2 to 4 per cent in K. With either moderator, slight enrichment of the uranium with U233, U235, or U239 will provide a K sufficiently greater than unity to enable construction of operating reactors.\n\nA water or diphenyl lattice may be used as part of a reactor, with a seed portion having a higher K in the center so that the average K is sufficiently above unity for a practical size. A heavy-water lattice can provide the higher-K center of a composite device. Water lattices are also useful as reflectors around other reactors and are efficient because neutron reproduction takes place in them.\n\nREDUCTION OF LOSSES DUE TO RESONANCE CAPTURE\n\nLimit curves for theoretically pure natural-uranium metal spheres and rods and oxide spheres and rods are shown in Figs. 2, 3, 4, 5, and 6 for various moderators. The shapes and extents of the curves are based on K being proportional to the product of three factors: p, the probability that a fast fission neutron escapes resonance capture and becomes a thermal neutron; f, the fraction of thermal neutrons absorbed by uranium rather than carbon; and e, the factor by which fission increases the number of neutrons before the fast fission neutrons leave the uranium lump. The factors can be computed separately from experimentally determined constants. The proportionality factor was fixed from measurements of subcritical pile structures and operating reactors, so the K values are accurate within the limits of this measurement.\n\nThe contours in Figs. 2 and 4 represent spherical uranium metal and UO2 lumps embedded in graphite. Figs. 3 and 5 represent cylindrical rods extending through the reactor, and Fig. 6 represents uranium-metal rods in a D2O moderator. Radii are plotted on the ordinates and moderator-to-uranium volume ratios on the abscissae; the parenthetical values give unit-cell ratios for the spherical or cylindrical lattice geometry.")),
  paragraph(literal("2,708,656\n\nIn Fig. 2, if the radii of metallic uranium spheres are less than about 0.3 centimeter, K is less than unity for all volume ratios and a self-sustaining chain reaction cannot be built, regardless of overall size. For spheres larger than 0.3 centimeter, K can exceed unity when the graphite-to-uranium ratio lies within the graph limits. Fig. 3 shows that rod geometry permits a limiting radius of about 0.25 centimeter. The innermost contour in Fig. 2 is about K = 1.09; the maximum is about K = 1.10 for theoretically pure spheres of about 2.75 centimeters radius and a volume ratio of about 54 carbon to 1 uranium.\n\nFor uranium-oxide spheres in Fig. 4, no chain reaction occurs below about 1.2 centimeters radius. The optimum is about K = 1.06 for spheres of about 5.75 centimeters radius and a volume ratio of 18.7 carbon to 1 uranium. In Fig. 5 the minimum oxide-rod radius for K greater than unity is about 0.75 centimeter; the optimum, over K = 1.04, is near 3.75 centimeters radius and a volume ratio of about 17.5 carbon to 1 uranium. Rod geometry gives somewhat smaller K values than sphere geometry, but aggregation still permits a practical reactor with uranium oxide.\n\nRods or rods made from short slugs in end-to-end relation are often preferable to spheres because they can be removed without tearing down the reactor and readily incorporated into fluid heat-absorbing systems. The K curves for uranium-metal rods in D2O in Fig. 6 have higher K constants than the graphite curves. Optimum K values of about 1.3 can be obtained with rods of about 2.25 to 2.5 centimeters radius at volume ratios from 40 to 80 D2O to 1 uranium. The favorable scattering-to-absorption ratio and the shorter neutron migration length make a D2O reactor smaller than a graphite or beryllium reactor.\n\nFor any fixed body size, K falls from its maximum when the volume ratio increases or decreases from the optimum. The same occurs when body size changes from its optimum. The designer can choose a contour point to save uranium, reduce moderator, maximize production of U239, or limit the overall size. The curves are shown only through the economical ranges, but extrapolated areas also sustain reactions above critical size. Aggregation and enrichment with U233, U235, or U239 increase K and reduce the required overall size; enrichment widens the volume-ratio limits but does not remove the need for aggregation.")),
  paragraph(literal("2,708,656\n\nThe curves account for resonance and moderator losses only. True K values for available materials must include impurity losses.\n\nREDUCTION OF NEUTRON LOSSES DUE TO IMPURITIES IN THE MATERIALS\n\nUranium and its compounds can be produced substantially free from neutron-absorbing impurities. A composition with high neutronic purity need not be chemically pure; it is substantially free of elements having a high danger sum, while oxygen, fluorine, carbon, beryllium, and other low-danger elements may remain. Hydrochloric-acid leaching of pitchblende can give uranium oxide better than 99.5 per cent chemically pure while leaving high neutron-capture elements in parts-per-million quantities. High-neutronic-purity compositions have danger sums in K units below 0.3, preferably below 0.01.\n\nOne illustrative process forms an ether solution of uranyl nitrate, washes impurities from it with small quantities of water, and recovers purified uranyl nitrate. Impure uranium oxide is treated with nitric acid, filtered, boiled to uranyl nitrate hexahydrate, and evaporated. The crystals are treated with ether; the resulting ether solution is extracted with small portions of water. High-absorption impurities dissolve more readily in water than in ether. Uranium loss is kept low by using only one-half to five per cent water by volume and by using water already saturated with uranyl nitrate. The term water extraction includes aqueous uranyl-nitrate solutions.\n\nSuccessive water portions give purified uranyl nitrate of extremely high neutronic purity. It may be recovered by evaporating the ether or by extracting it with substantially pure water, then converted to U3O8, UO2, uranium tetrafluoride, uranium hexafluoride, metal, or carbide. For large-scale production, one ether solution and as many water extractions as necessary are used. The final water extraction removes most uranyl nitrate from the ether.\n\nThe purified nitrate can be calcined to UO3 and reduced with hydrogen to UO2. UO2 is neutronically pure enough for a self-sustaining system despite its oxygen content, but its uranium density is lower than metal and its critical size is larger. UO2 can be converted with fluorine to uranium tetrafluoride, which is reduced with finely divided magnesium in a calcium-oxide-lined iron bomb. The uranium collects as massive billets weighing 10 to 200 pounds and can be recast in graphite crucibles without air, then machined into rods, tubes, or other forms.")),
  paragraph(literal("2,708,656\n\nUranium carbide, uranium tetrafluoride, and uranium hexafluoride will also support a chain reaction with a proper moderator and allowance for bulk-density changes. To determine the efficiency of purification, an exponential pile with the same geometry and moderator can compare compositions directly in terms of K. A simpler “shotgun test” places a thin neutron detector, such as indium foil near a neutron source inside paraffin, and compares its induced radioactivity with that produced when a standard boron pellet is replaced by a pellet containing impurities removed from a known uranium sample. The resulting danger sum is expressed as an equivalent boron absorption, from which K reduction is calculated.\n\nFor a representative 10-kilogram uranium sample, the impurity pellet is made by exhaustive ether-water purification. The absorption ratio is the absorption of impurities in the pellet, expressed in equivalent milligrams of boron, divided by the absorption of 10 kilograms of uranium, also expressed in equivalent milligrams of boron. The latter is about 4,560 milligrams of boron. The ratio approximates the change in K. Analyses of residual impurities in metallic uranium produced from purified UO2 show danger sums on the order of 0.003 to 0.0053 K units when contamination is avoided.\n\nGraphite impurities are important because a uranium-graphite reactor uses roughly ten times as much moderator by weight as uranium. Graphite is made by impregnating calcined petroleum coke with pitch and graphitizing it under heat; careful selection of the raw materials, particularly for boron and vanadium, can limit the K reduction to about 0.01 to 0.015. D2O is produced at about 99.8 per cent purity, with light water as its principal impurity. Other contamination generally comes from tanks and uranium rod sheaths and can be removed by distillation. Neutron bombardment tends to purify a moderator: boron is converted to lithium, and light water in D2O is converted toward heavy water.\n\nThe neutron detector foil test measures thermal-neutron density by induced radioactivity. A boron absorber lowers the density near the foil; replacing it with the extracted impurities permits a direct comparison. This gives the impurity danger sum and the corresponding K reduction without relying solely on chemical analysis.")),
  paragraph(literal("2,708,656\n\nEFFECT OF A COOLING SYSTEM IN A NEUTRONIC REACTOR\n\nReactors conductively cooled by dissipating reaction heat through their exterior can operate continuously only at low power, or at high power for short periods. A coolant may be circulated for continuous high-power operation, but its neutron absorption and that of any coolant pipes must be included in the neutronic design.\n\nIn a uranium-graphite reactor, the approximate heat sources are: gamma radiation, 23 million electron volts per fission (11 per cent); beta radiation, 11 (6 per cent); kinetic energy of fission fragments, 159 (79 per cent); and kinetic energy of neutrons, 7, for a total of 200 million electron volts per fission. About 184 MeV, or 92 per cent, is generated in uranium, 12 MeV, or 6 per cent, in graphite, and 4 MeV, or 2 per cent, outside the pile. Coolant and pipes may be arranged in heat-exchange relation to the moderator, the uranium bodies, or both.\n\nAluminum tubes carrying water through the moderator provide one simple cooling system, but moderator cooling alone is limited to about 1,000 kilowatts because most moderators conduct heat poorly. Direct cooling of uranium is useful at higher powers, although uranium must be protected from chemical reaction with the coolant and radioactive fission fragments must be kept out of the coolant stream. Otherwise the external piping and circulating machinery would require heavy shielding and could remain inaccessible after shutdown.\n\nAir cooling has been used for a uranium-graphite reactor operating continuously up to 3,000 kilowatts, in the construction shown in Figs. 31 through 36. In any moderator, neutron bombardment during operation tends to reduce some absorbers: boron captures a neutron and emits an alpha particle to become lithium, and light water contamination in D2O is reduced by neutron capture. Absorbing materials formed in uranium during high-neutron-density operation are considered separately.")),
  paragraph(literal("2,708,656\n\nAN ILLUSTRATIVE GAS-COOLED NEUTRONIC REACTOR\n\nA gas-cooled structure comprises closely stacked graphite blocks 209 forming a cube 210, as shown in Figs. 31 and 32. The cube may be 24 to 26 feet on a side on concrete foundation 211. Horizontal square air channels 212, with one diagonal vertical, pass from inlet face 214 to outlet face 215; about 2,000 channels may be provided, and unused channels may be plugged. A concrete inlet duct 216, air filter 220, and electrically driven fan 221 supply air to the inlet chamber 225. Concrete top shield 226 and side shields 228 enclose the cube. Outlet shield 230, outlet chamber 231, and stack 234 carry air above ground; the concrete shields, five to twenty feet thick, reduce escaping neutrons and gamma radiation.\n\nUranium bodies are placed in the channels so that the reproduction ratio is slightly above unity, after accounting for internal and exterior losses. About 700 channels, each loaded with 68 aluminum-jacketed uranium slugs 235 end to end at seven-inch spacing, give a reproduction ratio of unity for a roughly cylindrical active portion. Graphite and uranium should have the highest available purity. To obtain a rise in neutron density, about 1,000 channels may be loaded, giving an operating ratio near 1.005; neutron-absorbing material is then inserted to hold the ratio at unity. Unloaded channels may be plugged with graphite, while peripheral channels may remain open for cooling.\n\nThe preferred slug construction is shown in Fig. 34. Each uranium slug 235 is 1.1 inches in diameter and 4 inches long in an aluminum jacket about 20 mils thick. The uranium portion 236 is machined and cleaned, inserted into a jacket can 237, drawn through a sizing die for thermal contact, and sealed with cap 238 and seam weld 240. The jacket prevents air corrosion and keeps fission fragments from entering the air stream.")),
  paragraph(literal("2,708,656\n\nThe active portion of the air-cooled reactor is loaded above critical size, for example at a reproduction ratio of about 1.005 with absorbers withdrawn. At seven-inch slug spacing the volume ratio is about 47 carbon to 1 uranium and the rod-lattice K is about 1.06. With about one per cent of fission neutrons delayed for a mean time of about five seconds, neutron density doubles every eight to fifteen seconds. Partial insertion of absorbers slows the rise; near the critical rod position a single doubling may take several hours. When the desired density is reached, inserted absorbers reduce the ratio to unity.\n\nControl rod 241, shown diagrammatically in Fig. 32, slides in a graphite channel and is moved by rack and pinion 242. It contains cadmium or boron; shim and safety rods 241a and 241b are also provided. Heat is generated chiefly in the uranium. Aluminum jackets melt at 658 C., and uranium melts at about 1,100 C.; stable temperature must therefore remain below these limits. Atmospheric air passed through the graphite channels and directly over the aluminum jackets permits continuous operation at 250 kilowatts with 32,000 cubic feet per minute and at 500 kilowatts with about 50,000 cubic feet per minute. Increasing fan capacity has permitted continuous operation at 3,000 kilowatts.\n\nLoading apertures 245 in the inlet shield, shown in Figs. 31 and 35, align with the slug channels. Lead plugs 246 normally close the apertures. A charging tube 247 and plunger mechanism 251 push slugs into a channel while air continues to circulate. The loading mechanism is carried by elevator platform 256 and frame 257 alongside supply car 261. Initial loading starts with central channels and proceeds outward while neutron activity is checked. The control rod is inserted as critical size is approached; removal of the rod and measurement of neutron-density doubling time gives the reproduction ratio. The active core may contain 34 to 50 tons of uranium, and graphite plugs fill unused channels.\n\nAfter loading, the fan is started and the control rod withdrawn until the desired power and stable temperature are reached, then advanced until the reproduction ratio is unity. Air passing through the reactor becomes radioactive and is exhausted from a stack, for example 200 feet above ground. After a run sufficient to produce U239, such as 100 days at 500 kilowatts, the reactor is shut down by fully inserting the control rod and waiting about one-half hour for delayed neutron emission and short-lived activity to subside.")),
  paragraph(literal("2,708,656\n\nUnloading may be performed by pushing slugs out of the channels, or by inserting fresh slugs so that they push irradiated slugs out. The slugs fall from outlet face 215 into outlet chamber 231 and onto angular pad plates 290, then roll into outlet pipe 291 with valves 292 and 294. The pipe opens into coffin chamber 295 and tunnel 296, where coffin car 299 carries slug coffins 301. Rods 302 and 304 operate the valves behind lead shield 305; crane 306 places caps on filled coffins. Water fills the upper pipe while air circulation is maintained at about one-quarter operating flow. The slugs are cooled in water, then aged under water for about thirty days before chemical treatment.\n\nThe additional losses in this air- or helium-cooled system are principally absorption in the aluminum jackets, with a small loss from moderator removed to form the air channels. The K reduction can be about 0.005. Liquid cooling requires pipes to keep the coolant out of the moderator; both the coolant and its pipes can have substantial neutron absorption.\n\nAN ILLUSTRATIVE LIQUID-COOLED NEUTRONIC REACTOR\n\nFor powers above 1,000 to 3,000 kilowatts, water or diphenyl may be used as a liquid coolant. Jacketed uranium slugs or rods are placed in pipes so the coolant flows around them. A representative reactor for outputs up to 100,000 kilowatts is shown in Figs. 37, 38, and 39. Graphite-block reactor 350 is surrounded by graphite reflector 351 and enclosed in fluid-tight steel casing 352, supported by I-beams 354 in concrete tank 355. Water 356 shields neutrons and gamma radiation; charging face 357 has shield tank 358 filled with lead shot and water. Aluminum coolant tubes 359 pass through the concrete wall, shield tank, graphite moderator, and casing outlet face 362. Water enters through manifolds, discharges into tank 355, and leaves through outlet pipe 365.\n\nThe tubes are loaded with aluminum-jacketed uranium slugs 372 in end-to-end relation. Water may pass once through the reactor or be cooled and recirculated; diphenyl requires a closed system. Loading and unloading use the gas-cooled mechanisms. Control rod 370, ionization chamber 371, and shim and safety rods 370a and 370b provide control and monitoring. In Fig. 39 the slugs rest on projections 373 inside coolant tubes 359, providing a uniform coolant annulus.")),
  paragraph(literal("2,708,656\n\nFor one liquid-cooled uranium-graphite example designed for continuous operation at about 100,000 kilowatts, uranium rods in near-optimum graphite geometry give K about 1.07. Aluminum jackets and pipes reduce K by 0.013, coolant reduces K by 0.023, and the total reduction is 0.036, leaving K about 1.034. The principal dimensions are: active-cylinder axial length 7 meters; radius 4.94 meters; uranium-metal weight 200 metric tons; graphite weight 850 metric tons; uranium-rod radius 1.7 centimeters; aluminum jacket thickness 0.5 millimeter; aluminum-pipe thickness 1.5 millimeters; liquid annulus 2.2 millimeters with water or 4 millimeters with diphenyl; 1,695 rods; aluminum weight 8.7 metric tons; and square-array rod spacing 21.3 centimeters.\n\nDiphenyl permits a thicker coolant annulus because its danger sum is smaller for a given volume and its boiling temperature is higher. Against this advantage are the need for closed circulation and possible polymerization, which requires make-up fluid. Liquid coolants are suited to outputs up to 500,000 kilowatts. Since K minus 1 for uranium-graphite reactors is only about 0.1, coolant quantity must be limited. D2O uranium-rod reactors can tolerate a larger impurity fraction because K minus 1 can approach 0.3. D2O can itself be used as coolant, reducing parasitic absorption.\n\nBy treating coolant and structural elements as parasitic impurities, evaluating their K reduction, and using the resulting K to determine critical and operating sizes, reactors for desired powers can be designed.\n\nUSE OF DIFFERENT LATTICES IN THE SAME NEUTRONIC REACTOR\n\nThe first uranium-graphite reactor used two lattice zones with different uranium forms. Other reactors may have zones with different K values and wholly different moderators. A D2O-moderated central portion can raise the average K of a composite reactor; a uranium-H2O lattice can be used around a uranium-D2O center. Such arrangements permit a practical operating size even when one lattice has a low K.")),
  paragraph(literal("2,708,656\n\nWhen reactors are constructed of concentric layers, the average K can be calculated. Curves in Fig. 40 give the statistical weight w of a sub-side or sub-radius of a zone having a specified lattice, plotted against S/R, where R is the side or radius of the entire active portion and S is the extent of the zone. Statistical weight is the value of a mass of lattice weighted by its position: a mass near the center is worth more than the same mass near the edge because neutron density is higher at the center. The effectiveness of a lattice varies approximately with the square of the average neutron density to which it is exposed.\n\nFor a cylindrical active portion of radius R, a central lattice with K1 and migration length M1 may extend to radius S1, a second lattice with K2 and M2 to radius S2, and a third lattice with K3 and M3 to the outer radius R. The curves in Fig. 40 permit calculation of the overall K for concentric cubic, spherical, or cylindrical structures with uranium rods. When migration lengths are equal, the average K minus 1 is obtained directly from the separate K minus 1 values; with different moderators, the appropriate migration length is inserted.\n\nAs an example, if the central zone has K1 = 1.05 and the surrounding zone has K2 = 1.06, the Fig. 40 curves give weights of approximately 0.525 and 0.475, producing an average K of about 1.0548. A center with high K can raise the average enough to reduce reactor size; a center with lower K can flatten the neutron-density curve.\n\nCRITICAL AND OPERATING SIZES OF NEUTRONIC REACTORS\n\nAfter all neutron losses except exterior leakage have been evaluated, the reactor size for operation must be determined. A satisfactory method, especially for low-power reactors, is to measure the relaxation distance or exponential constant A in an exponential pile similar in every respect to the proposed reactor. For a sphere the critical radius is obtained from A; for a rectangular parallelepiped the critical side lengths are obtained from the corresponding relation; and for a cylinder the critical height and radius follow from the cylindrical relation containing 2.405/R. Thus critical size can be obtained directly from measured A without first determining a numerical K. If migration length M is known, K can be determined from the relation involving (K - 1)/M and A, and the result can be used for critical and operating sizes at any power.")),
  paragraph(literal("2,708,656\n\nThe critical size of a reactor may be obtained from the measured relaxation distance or exponential constant A. For a sphere, parallelepiped, or cylinder, the corresponding leakage relation gives the critical radius, side lengths, or height and radius. Where the migration length M is known, K may be obtained from the relation involving (K - 1)/M and A. These relations permit critical and operating sizes to be determined without first assigning exact values to every nuclear constant.\n\nThe delayed neutrons emitted by fission fragments are of special importance in controlling the reaction. Approximately one per cent of fission neutrons may be delayed, with a mean delay of about five seconds; about half are emitted within six seconds and about ninety per cent within forty-five seconds. At a reproduction ratio r = 1.001, a neutron population may increase by a factor of 2.75 in about 28.5 seconds, or double in roughly twenty seconds. At r = 1.01 the doubling time is a fraction of a second, and at r = 1.02 or 1.03 the population can increase by factors of approximately 1,100 or 700,000 per second. A maximum safe operating ratio is therefore about 1.005, depending on the reactor and control system.\n\nFor a homogeneous reactor, critical dimensions follow from the neutron diffusion equations. The critical radius of a sphere, the critical side of a rectangular parallelepiped, and the critical height and radius of a cylinder are expressed in terms of the material buckling and the migration length. Figure 30 gives representative critical-size relations for D2O-moderated uranium-rod reactors.")),
  paragraph(literal("2,708,656\n\nThe critical-size relations may be corrected for a reflector. A reflector returns some neutrons that would otherwise escape, increasing the effective size of the reactor. The calculated relations are approximations because neutrons of all energies between fission and thermal energy enter the reflector, but they are sufficiently accurate for designing and operating reactors with reflectors.\n\nControl is obtained by varying neutron losses in or from the reactor. In a D2O reactor, changing the amount of heavy water wetting the uranium changes the leakage factor: a reactor may be brought to unity reproduction by removing part of the D2O after the desired neutron density is reached. In other reactors, cadmium or boron control rods absorb neutrons between the uranium bodies. Low-power reactors are generally built so that the maximum reproduction ratio with the rods removed is less than 1.01. A rod may be fully inserted to stop the reaction, partly inserted at unity reproduction, or fully withdrawn at the permitted maximum. The intermediate unity setting is the critical position.\n\nIonization chambers and indicators monitor neutron density. With the control rod fully inserted, the density may be about one hundred times the natural uranium background; withdrawing the rod makes the chains divergent and the density rises with a doubling time determined by delayed neutrons. When the desired density is reached, the rod is inserted to the unity position and later moved inward or outward to reduce or restore the selected density.")),
  paragraph(literal("2,708,656\n\nControl rods are preferably driven by reversible electric motors, but safety rods are provided for accidents such as a drive motor running the rod completely out or a power-line failure. Safety rods are normally held out and are released manually or automatically at a predetermined neutron density so that gravity inserts them rapidly. This is why the operating reproduction ratio must not greatly exceed 1.01: at r = 1.01 the density may double in about one-third of a second, while safety rods need several seconds to enter.\n\nTemperature and atmospheric-pressure changes normally alter K only slightly and can be compensated by short rod movements. During high-power operation, however, fission products can change K substantially. U235 depletion and conversion of U238 to U239 tend to increase K, while stable fission products and radioactive absorbers tend to reduce it. The important fission-product chain is tellurium-135 to iodine-135 to xenon-135 and then cesium and barium; the parenthetical times in the specification are half-lives.\n\nXenon-135 has an exceptionally large neutron-capture cross section. It is formed from iodine during operation, absorbs neutrons and reduces K, and is converted by neutron absorption or decay into isotopes of smaller capture cross section. In a high-power reactor the rod must be withdrawn as xenon builds up, and the reactor must be sized with the xenon reduction included in the final K. A reactor can otherwise become dangerous before xenon appears and can later shut down or restart as xenon forms and decays.")),
  paragraph(literal("2,708,656\n\nAt equilibrium, xenon-135 may reduce K by about 0.03 in a high-power reactor. The reduction depends on power: representative reductions are about 0.0012 at 10,000 kilowatts, 0.009 at 100,000 kilowatts, and larger values at still higher outputs. Shim rods can compensate for the xenon effect while preserving a maximum reproduction ratio below 1.01 with the main control rod withdrawn. At shutdown, all control, shim, and safety rods should be fully inserted so that the reaction does not restart when xenon decays.\n\nLow-power reactors operated intermittently are less affected by xenon poisoning because xenon does not become important for several hours. Such a reactor may reach a high density for a short period, wait for xenon to decay, and then be operated again. A control rod can be calibrated in a conventional inch or in a corrected unit called a cinch, which gives the same reproduction-ratio effect at different rod depths. The reactor period is the time required for neutron intensity to increase by e = 2.718; this is the inhour calibration. Atmospheric pressure is corrected at 0.323 inhour per millimeter of mercury from 760 millimeters.\n\nUSES OF NEUTRONIC REACTORS\n\nNeutronic reactors are powerful neutron and gamma-ray sources. Materials placed in or near the reactor can be made radioactive, and the larger leakage of a D2O reactor permits a large external neutron flux. Thorium-232 can be converted by slow-neutron exposure to thorium-233, then protactinium-233, and finally uranium-233, a fissionable material comparable in action to U235 and U239. Neutrons reacting with nitrogen can produce radioactive carbon-14 for medical and physiological tracer work.")),
  paragraph(literal("2,708,656\n\nNeutrons escaping from the reactor can be used for transmutation and isotope production. A graphite-filled shaft can form a thermal-neutron column. Internal shafts and tubes reaching the reactor center collimate fast neutrons into an external beam for nuclear research. Gamma rays can be used for radiographs of large castings; neutron screens and a bismuth filter can separate the desired radiation components.\n\nThe reactor is also useful for testing neutron absorbers and neutron producers. A removable stringer containing uranium bodies of known constants can be balanced at a fixed neutron density, replaced by test bodies, and returned to the reactor. The corrected control-rod position shows whether the new bodies are better or worse, and similar tests can measure the effects of size, impurities, coatings, and temperature. The method of determining these effects is not itself claimed.\n\nAt least part of the uranium bodies can be removed after irradiation so that U239 and fission products may be recovered. With suitable modifications, D2O reactors can produce steam under pressure, enriched-uranium/light-water systems can provide heat, gas-cooled reactors can heat helium for steam generation, and diphenyl-cooled reactors can transfer heat in exchangers. The theory is based on the best experimental evidence then available and is not intended to exclude later experimental modification.")),
];


export const fermiReactorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3",
  preparedBy: "Classic Patents editorial agent (cloud-source WIP)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
  blocks: [
    ..._fermiDrawingSheetBlocks,
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
    ...fermiLiteralSpecificationBlocks,
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
    paragraph(literal("References Cited in the file of this patent: United States Patent 2,206,634, Fermi et al., July 2, 1940; Foreign Patents 14,150, Australia, May 2, 1940; 14,151, Australia, May 3, 1940; 233,011, Switzerland, October 2, 1944; 861,390, France, October 28, 1940; 648,293, Great Britain, January 3, 1951; Other References: Power, July 1940, page 58. Copy in 204-154.2. Kelly et al., Physical Review 73, 1135–1139 (1948). Copy in Patent Office Library (204/154.2). Flügge, Naturwissenschaften, volume 27, pages 402–410 (1939). Copy in Patent Office Library (204/154.2).")),
    paragraph(literal("UNITED STATES PATENT OFFICE. CERTIFICATE OF CORRECTION. Patent No. 2,708,656, May 17, 1955, Enrico Fermi et al. It is hereby certified that error appears in the printed specification of the above numbered patent requiring correction and that the said Letters Patent should read as corrected below. Column 4, line 51, both occurrences, and line 53, both occurrences, for BT read -- A --; column 5, line 31, for friction read -- fraction --; column 6, line 46, strike out thermal neutron and insert the same before fissionable in line 47; column 19, line 52, for represensation read -- representation --; column 23, line 52, for 945 read -- 1945 --; column 25, line 45, for l'9 read -- 11.9 --; line 64, for protectting read -- protecting --; column 34, line 23, for either-water read -- ether-water --; column 38, line 16, for ...lib read -- .015 --; column 45, line 75, for K read -- K --; column 48, line 56, for formula portion K=1.0052 read -- K-1.005... --; column 51, line 35, for and read -- as --; column 53, line 72, for CC read -- CS --. Signed and sealed this 26th day of July, 1955. (SEAL) Attest: E. J. MURRY, Attesting Officer. ROBERT C. WATSON, Commissioner of Patents.")),
  ],
};

export const fermiReactorParallelReadings: Readonly<Record<number, readonly string[]>> =
  Object.fromEntries(
    fermiReactorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph"
        ? [
            [
              index,
              [
                "This authored companion preserves the literal source passage at this edition position for independent review; no summary substitutes for the printed text.",
              ],
            ],
          ]
        : [],
    ),
  ) as Readonly<Record<number, readonly string[]>>;

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
