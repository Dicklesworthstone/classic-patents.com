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
const fermiDrawingSheetBlocks: readonly CuratedSpecificationBlock[] = [
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

export const fermiReactorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e32bdaa34dda164d2ab62273c182c437464f5a2b88e480beabba0fa2aae60ef3",
  preparedBy: "Classic Patents editorial agent (SteelNeedle)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
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
    { kind: "heading", level: 2, text: "Claims" },
    paragraph(literal("What is claimed is:")),
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
    ...fermiPages30To40Blocks,
    ...fermiPages41To50Blocks,
    ...fermiPages51To58Blocks,
  ],
};

export const fermiReactorParallelReadings: Readonly<Record<number, readonly string[]>> = {
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
    "Claims 1-8, the cited patent and literature, signatures, and the correction certificate are preserved in the reviewed ledger pages 56-58 while the claim blocks remain the edition's canonical legal text.",
  ],
  55: [
    "The edition preserves the printed reference list, correction certificate, date, attesting officer, and Commissioner of Patents as source-face matter; the reviewed ledger supplies the page-marked comparison boundary.",
  ],
  56: [
    "The final typed paragraph records each certificate correction and the July 26, 1955 attestation, including E. J. Murry and Commissioner Robert C. Watson, without changing the separate legal claim blocks.",
  ],
};
