import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

const FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1630, height: 1360 },
  2: { width: 1500, height: 960 },
};

const preview = (
  surfaceText: string,
  figureNumber: number,
  src: string,
  alt: string,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: surfaceText,
  href: `#figure-${figureNumber}`,
  referenceType: "figure",
  label: alt,
  figurePreviews: [
    {
      src,
      alt,
      width: FIGURE_DIMS[figureNumber]?.width ?? 1600,
      height: FIGURE_DIMS[figureNumber]?.height ?? 1200,
    },
  ],
});

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const hallAluminiumArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "CHARLES M. HALL, OF OBERLIN, OHIO.",
        "PROCESS OF REDUCING ALUMINIUM BY ELECTROLYSIS.",
        "SPECIFICATION forming part of Letters Patent No. 400,766, dated April 2, 1889.",
        "Application filed July 9, 1886. Serial No. 207,601. (No specimens.)",
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "CHARLES M. HALL",
        "charles-m-hall",
        "American chemist and inventor (1863–1914) who discovered the molten cryolite electrolysis process in a woodshed laboratory behind his family home in Oberlin, Ohio, co-founding ALCOA (Aluminum Company of America).",
      ),
      ", a citizen of the United States, residing at Oberlin, in the county of Lorain and State of Ohio, have invented a new and useful Improvement in the Process of Reducing Aluminium by Electrolysis, of which the following is a specification.",
    ),
    p(
      "This invention has for its object to reduce aluminium from its oxides by dissolving such oxides in a bath containing a ",
      term(
        "fused fluoride salt of aluminium",
        "fused-fluoride-salt",
        "A high-temperature molten electrolyte composed of sodium fluoride and aluminium fluoride (cryolite, Na₃AlF₆) that acts as an inorganic liquid solvent for solid alumina without decomposing at the alumina reduction voltage.",
      ),
      " and then reducing the aluminium by the aid of an electric current by the operation of which the fluorides are not decomposed, the bath being thus continuously maintained.",
    ),
    p(
      "Heretofore the reduction of aluminium has been accomplished by chemical processes with sodium or by electrolysis of molten anhydrous double chloride of aluminium and sodium; but these methods are expensive and commercially unsatisfactory.",
    ),
    p(
      "In the practice of my invention I prepare a bath of a fluoride of aluminium and a fluoride of a metal more electro-positive than aluminium, as sodium, potassium, calcium, or lithium. A fluoride of aluminium and sodium—that is, the mineral ",
      term(
        "cryolite",
        "cryolite-solvent",
        "Naturally occurring sodium hexafluoroaluminate (Na₃AlF₆) mined from Ivigtût, Greenland, melting at ~950°C to form a low-viscosity, high-conductivity molten bath capable of dissolving up to 10 wt% alumina.",
      ),
      ", having the formula Al₂F₆·6NaF—is preferred on account of its low melting point, high solvent power for alumina, and non-decomposition under the electromotive force required to decompose alumina.",
    ),
    p(
      "This fluoride bath is placed in a suitable crucible or pot, preferably lined with ",
      term(
        "carbon",
        "carbon-cathode-lining",
        "Conductive anthracite / pitch lining sintered onto the interior of the steel smelting pot, serving both as chemical containment and the negative cathode terminal.",
      ),
      ", which forms the cathode or negative electrode, and is fused by external heat or by the action of the electric current itself. ",
      term(
        "Alumina",
        "alumina-feedstock",
        "Pure aluminium oxide (Al₂O₃) refined from bauxite ore, having an extremely high native melting point (2072°C) that made direct thermal or electrolytic smelting impossible prior to Hall's solvent discovery.",
      ),
      " (Al₂O₃) in a finely powdered state is then added to the molten fluoride bath, in which it readily dissolves, forming a clear, fluid solution.",
    ),
    p(
      "Electrodes of carbon connected to the positive pole of an electric generator are then suspended in the fused bath, as shown in ",
      preview(
        "Fig. 1",
        1,
        "/patents/figures/us-400766-hall-aluminium/fig-1-source-crop-v1.png",
        "Figure 1: Sectional elevation of electrolytic crucible showing carbon lining, molten bath, anode rods, and molten aluminium pool.",
      ),
      " and ",
      preview(
        "Fig. 2",
        2,
        "/patents/figures/us-400766-hall-aluminium/fig-2-source-crop-v1.png",
        "Figure 2: Top plan view showing rectangular pot shell, terminal lugs, and carbon anode array.",
      ),
      ". Upon passing an electric current of suitable voltage and density through the bath, the dissolved alumina is decomposed into aluminium and oxygen. The aluminium is deposited at the negative electrode (the bottom and sides of the carbon-lined pot) and, being heavier in the molten state than the molten fluoride bath at the operating temperature, sinks to the bottom of the pot and forms a pool of molten metal.",
    ),
    p(
      "The oxygen liberated at the positive carbon electrodes reacts with the carbon of the electrodes to form carbon monoxide and carbon dioxide gases, which escape from the bath.",
    ),
    p(
      "As the alumina in the bath is decomposed and reduced, fresh quantities of powdered alumina are added from time to time to the bath, which is thus maintained in a continuous operating condition without consuming or decomposing the fluoride solvent. The fluoride salts of the bath undergo no permanent change, serving simply as a fused solvent for the oxide.",
    ),
    p(
      "The process may be carried on continuously for days or months by periodically siphoning or tapping out the accumulated molten aluminium from the bottom of the crucible and adding alumina as rapidly as it is consumed.",
    ),
    p(
      "Instead of cryolite alone, mixtures of the fluorides of aluminium and sodium with fluorides of calcium or potassium may be employed to lower the fusion point and adjust the specific gravity of the molten bath so that the reduced aluminium will readily sink to the bottom.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "What I claim is:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. The process of reducing aluminium by electrolysis, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and a metal more electro-positive than aluminium, and then passing an electric current through the fused mass, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. The process of reducing aluminium by electrolysis, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and sodium, and then passing an electric current through the fused mass, substantially as described.",
        },
      ],
    },
    p("In testimony whereof I have hereunto set my hand."),
    p("CHARLES M. HALL."),
    p("Witnesses:\nFrank F. Schilling,\nM. E. Jones."),
  ],
};

/**
 * Extract literal claim text from the archival edition blocks.
 * Enforces dynamic runtime single-source-of-truth lookup.
 */
export function manualHallClaimText(claimNumber: number): string {
  const block = hallAluminiumArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in hallAluminiumArchivalEdition`);
  }
  return block.inlines.map((i) => i.text).join("");
}

export const HALL_ALUMINIUM_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal opening identification of inventor Charles M. Hall, chemist of Oberlin, Ohio, declaring his new process of reducing aluminium by electrolysis.",
  ],
  2: [
    "Foundational statement of invention: using a molten fluoride salt bath as a solvent to dissolve refractory aluminium oxides without decomposing the fluoride solvent itself.",
  ],
  3: [
    "Prior-art analysis: chemical sodium reduction (Deville process) and anhydrous chloride electrolysis were economically ruinous and unable to produce structural quantities.",
  ],
  4: [
    "Solvent formulation: selecting molten cryolite (Na₃AlF₆) due to its accessible melting point (~950°C), superior alumina solubility, and wide electrochemical stability window.",
  ],
  5: [
    "Apparatus preparation: charging a carbon-lined steel crucible acting as the negative cathode, melting the cryolite, and dissolving finely powdered alumina into the molten salt.",
  ],
  6: [
    "Electrolytic reduction mechanics: direct current decomposes dissolved Al₂O₃, depositing liquid aluminium metal at the bottom cathode while consuming suspended carbon anode rods.",
  ],
  7: [
    "Anode oxidation chemistry: liberated oxygen ions react with carbon anodes to evolve carbon monoxide and dioxide gas, preventing corrosive back-reaction.",
  ],
  8: [
    "Continuous catalytic replenishment: adding powdered alumina as oxygen and aluminium are consumed, keeping the cryolite solvent volume perpetually intact.",
  ],
  9: [
    "Industrial continuous production: periodically siphoning or tapping out accumulated molten aluminium from the pot bottom while adding alumina continuously for months without shutdown.",
  ],
  10: [
    "Electrolyte density tuning: adding calcium fluoride (fluorite) or potassium fluoride to lower bath melting point and ensure molten aluminium (density 2.3 g/cm³) stays submerged below the salt.",
  ],
  14: ["Formal testimonium executing the specification under hand."],
  15: ["Inventor signature of Charles M. Hall."],
  16: ["Signatures of witnesses Frank F. Schilling and M. E. Jones."],
};
