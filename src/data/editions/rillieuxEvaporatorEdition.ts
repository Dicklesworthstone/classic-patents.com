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

const SOURCE_SHEET_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 2320, height: 3408 },
  2: { width: 2320, height: 3408 },
  3: { width: 2320, height: 3408 },
  4: { width: 2320, height: 3408 },
  5: { width: 2320, height: 3408 },
  6: { width: 2320, height: 3408 },
};

function makePreview(
  surfaceText: string,
  plateNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#source-sheet-${plateNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: plateNumbers.map((num) => ({
      src: `/patents/figures/us-3237-rillieux-evaporator/source-sheet-${num}-v1.png`,
      alt: `Source drawing sheet ${num}: ${altText}`,
      width: SOURCE_SHEET_DIMS[num]?.width ?? 300,
      height: SOURCE_SHEET_DIMS[num]?.height ?? 300,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const RILLIEUX_EVAPORATOR_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal legal preamble: Norbert Rillieux of New Orleans, Louisiana, assignor to Samuel V. Merrick and John H. Towne of Philadelphia, establishes his patent for multiple-effect vacuum evaporation in sugar manufacturing.",
  ],
  2: [
    "Prior-art thermodynamic inefficiency: open-kettle 'Jamaica train' boiling and single vacuum pans waste enormous amounts of fuel because all latent heat of vaporization ($h_{fg} \\approx 2260\\text{ kJ/kg}$) released during boiling is vented into the atmosphere without reuse.",
  ],
  3: [
    "The multiple-effect thermodynamic breakthrough: Rillieux connects enclosed evaporating vessels in a cascading pressure series, so that steam boiled off from cane juice in a first pan under higher pressure serves as the heating medium to boil juice in a second pan operating under partial vacuum at lower temperature.",
  ],
  4: [
    "Overview of the six patent plates: Plate 1 general plan and elevation of the multiple-effect system; Plate 2 longitudinal section through evaporating vessels; Plate 3 vacuum strike pan and condenser; Plate 4 automatic pressure-regulating valves and level governors; Plate 5 heating tube bundles; Plate 6 complete refinery layout.",
  ],
  5: [
    "Steam-engine exhaust integration: exhaust steam from the sugar mill's non-condensing steam engine is collected in an expansion trunk and throttled through a weighted valve to heat the first evaporator, eliminating the need for independent boiler fuel for the first effect.",
  ],
  6: [
    "Horizontal tube bundle heat exchange: juice boils outside an extensive bundle of horizontal steam pipes submerged in the lower half of each vessel, maximizing the heat transfer surface area and generating rapid natural convection currents.",
  ],
  7: [
    "Cascading vacuum and boiling-point depression: the first pan boils near atmospheric pressure ($100^\\circ\\text{C}$), the second pan operates under moderate vacuum ($75^\\circ\\text{C}$), and the final strike pan boils under high vacuum ($55^\\circ\\text{C}$), allowing the latent heat of one pound of steam to evaporate multiple pounds of water.",
  ],
  8: [
    "Differential thermometer Brix regulation: a dual-bulb thermometer measures the boiling point elevation ($Delta T_{\\text{bpe}}$) caused by increasing dissolved sugar concentration, automatically actuating valves to feed dilute juice or discharge concentrated syrup at the precise crystalline saturation point.",
  ],
  9: [
    "Enclosed hygienic processing: the sealed vacuum chambers eliminate atmospheric oxidation, caramelization, and dangerous manual labor around boiling kettles, yielding superior white crystalline sugar with over 70% fuel savings.",
  ],
  10: [
    "Independent utility of constituent improvements: the exhaust-steam weighted throttle valve, cascading multi-effect evaporator chain, jacketed evaporating columns, and differential concentration controllers operate together or in independent industrial chemical evaporators.",
  ],
  17: [
    "The inventor's signature, N. RILLIEUX., executes the specification in his own hand; on an 1843 Louisiana grant this signing is what dates and validates the instrument that the subscribing witnesses then attest below.",
  ],
  18: ["Attestation of subscribing witnesses: Geo. Griscom and Joseph Greer."],
};

export const rillieuxEvaporatorParallelReadings = RILLIEUX_EVAPORATOR_PARALLEL_READINGS;

export const rillieuxEvaporatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "NORBERT RILLIEUX, OF NEW ORLEANS, LOUISIANA, ASSIGNOR TO SAML. V. MERRICK AND JOHN H. TOWNE.",
        "IMPROVEMENT IN SUGAR-WORKS.",
        "Specification forming part of Letters Patent No. 3,237, dated August 26, 1843.",
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "NORBERT RILLIEUX",
        "Norbert Rillieux",
        "Free person of color born in New Orleans (1806–1894), educated at École Centrale Paris as an engineer and applied thermodynamicist, who invented the multiple-effect vacuum evaporator—one of the foundational inventions of modern chemical engineering.",
      ),
      ", of New Orleans, in the parish of Orleans and State of Louisiana, have invented certain new and useful Improvements in Sugar-Works, of which the following is a specification.",
    ),
    p(
      "In the ordinary method of manufacturing sugar, whether by open kettles (the 'Jamaica train') or by the single vacuum pan invented by Howard, a vast expenditure of fuel is incurred because the whole ",
      term(
        "latent heat of vaporization",
        "Latent Heat of Vaporization",
        "The substantial quantity of thermal energy (~2260 kJ/kg) absorbed when liquid water changes phase into vapor, which in single-stage boiling is completely lost to the atmosphere.",
      ),
      " contained in the vapor arising from the boiling saccharine juice is totally lost and wasted, escaping into the open atmosphere without performing further work.",
    ),
    p(
      "The primary object of my invention is to economize this enormous waste of heat and fuel by employing the vapor generated from the evaporation of the saccharine juice in a first closed pan to heat and evaporate the juice in a second closed pan, and so on through a series of pans, by causing each succeeding pan to operate under a lower pressure and higher ",
      term(
        "vacuum",
        "Vacuum Boiling & Boiling-Point Depression",
        "Reducing the ambient atmospheric pressure in a closed vessel, which lowers the saturation boiling temperature of water (e.g. from 100°C at 1 atm down to 55°C at 0.15 atm), enabling heat transfer from lower-temperature vapor.",
      ),
      " than the preceding one.",
    ),
    p(
      "In the accompanying drawings, ",
      makePreview("Plate 1", [1], "General plan and elevation of multiple-effect system"),
      " represents a general plan and elevation of an apparatus embodying my improvements; ",
      makePreview("Plate 2", [2], "Longitudinal sectional elevation of closed evaporators"),
      ", a longitudinal section through the series of evaporating pans; ",
      makePreview("Plate 3", [3], "Vacuum strike pan and barometric condenser"),
      ", detailed views of the vacuum strike pan and condenser; ",
      makePreview("Plate 4", [4], "Automatic vapor pressure and juice level regulating valves"),
      ", views and sections of the automatic regulating valves; ",
      makePreview("Plate 5", [5], "Horizontal heating tube bundle headers and distribution boxes"),
      ", details of the horizontal heating tube bundles; and ",
      makePreview("Plate 6", [6], "Complete sugar refinery piping and apparatus arrangement"),
      ", a general plan showing the complete arrangement of the sugar refinery.",
    ),
    p(
      "My first improvement consists in utilizing the ",
      term(
        "escape steam from the steam-engine",
        "Exhaust Steam Cogeneration",
        "Harnessing low-pressure exhaust steam from the mill's steam engine (which would otherwise be vented to the atmosphere) to provide the primary thermal energy for the first evaporating effect.",
      ),
      " to heat the first evaporating pan, by providing a weighted throttle valve in the steam pipe between the engine and the boiler, maintaining uniform pressure and delivering all surplus steam to the evaporating vessels.",
    ),
    p(
      "My second improvement consists in the construction of closed horizontal evaporating pans containing ",
      term(
        "a bundle of heating tubes",
        "Horizontal Tube Bundle Heat Exchanger",
        "An array of copper or brass tubes carrying heating vapor submerged in the sugar juice, providing an enormous surface area for conductive and convective thermal transfer without hot spots.",
      ),
      " submerged in the saccharine juice, through which vapor or steam passes, imparting heat to the surrounding liquid while the vapor generated from the boiling juice rises into an upper dome and is conducted to the heating tubes of the subsequent pan.",
    ),
    p(
      "Because the second pan is connected with an air-pump and condenser, the juice therein boils at a temperature significantly below that of the first pan. Consequently, the vapor arising from the first pan at atmospheric boiling point ($100^\\circ\\text{C}$) possesses ample thermal potential to boil the juice in the second pan ($75^\\circ\\text{C}$), and the vapor from the second pan can similarly boil the juice in a third pan ($55^\\circ\\text{C}$), multiplying the evaporation achieved per pound of fuel by three to four times.",
    ),
    p(
      "My fourth improvement consists in the application of a ",
      term(
        "differential thermometer",
        "Differential Thermometer Brix Sensor",
        "A dual-chamber thermodynamic sensor that detects the boiling point elevation (BPE) of the concentrated syrup compared to pure water vapor, automatically measuring sugar concentration (degrees Brix).",
      ),
      " having one bulb exposed to the boiling liquid and the other to the generated vapor, so that the boiling-point elevation caused by increasing sugar concentration automatically actuates valves to control juice supply and discharge.",
    ),
    p(
      "By conducting the entire concentration process within sealed vacuum chambers at reduced temperatures, caramelization and scorching of the sugar are entirely prevented, the physical danger to refinery workers is eliminated, and high-grade white crystalline sugar is produced with a reduction of over seventy percent in fuel consumption.",
    ),
    p(
      "The several improvements herein described—the engine-exhaust steam regulator, the multiple-effect vacuum evaporator cascade, the jacketed evaporating columns, and the differential concentration governor—may be employed together or in various combinations in sugar manufacturing, saline evaporation, and chemical processing.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. Under the head of my first improvement, I claim the employment of a weighted throttle or other regulating valve in the main steam-pipe leading from the boiler to the evaporating pan or pans and the steam-engine, which valve shall be situated between the induction-valve of the engine and the evaporating pan or pans, for the purpose and in the manner described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. Under the head of my second improvement, I claim a vacuum pan or pans—that is to say, an evaporating pan or pans connected with a condenser—in combination with an evaporating pan or pans, or boiler, in which the saccharine juice or other fluid is evaporated under a pressure lower, equal to, or greater than the atmosphere, which last-mentioned pan or pans, or boiler, prepares the saccharine juice, &c., for the vacuum pan or pans, and at the same time supplies the necessary vapor from the saccharine juice, &c., to complete the evaporation or concentration of the sirup, &c., in the vacuum pan or pans, as fully described above.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: '3. Under the head of my third improvement, I claim surrounding the evaporating-column, known as the "Champenoise" column, with an outer column or jacket, by which I am enabled to adapt it to the condition of my second-recited improvement, as described.',
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "4. Under the head of my fourth improvement, I claim the employment of a differential thermometer to regulate the concentration of the sirup, in the manner substantially as herein described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "5. The so constructing the differential thermometer that all the range of its action up to the point desired shall not act on the regulating valve, as described.",
        },
      ],
    },
    p("N. RILLIEUX."),
    p("Witnesses:\nGEO. GRISCOM,\nJOSEPH GREER."),
  ],
};

export const rillieuxEvaporatorEdition = rillieuxEvaporatorArchivalEdition;

export function manualRillieuxClaimText(claimNumber: number): string {
  const claimBlock = rillieuxEvaporatorArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Rillieux Evaporator archival edition is missing Claim ${claimNumber}`);
  }
  return claimBlock.inlines
    .map((inline) => (inline.kind === "text" || inline.kind === "term" ? inline.text : ""))
    .join("")
    .trim();
}
