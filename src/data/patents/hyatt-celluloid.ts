import { hyattCelluloidArchivalEdition } from "@/data/editions/hyattCelluloidEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = hyattCelluloidArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Hyatt manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const hyattCelluloidPatent: Patent = {
  id: "us-105338-hyatt-celluloid",
  patentNumber: "US 105,338",
  title: "Improvement in Treating and Molding Pyroxyline",
  shortTitle: "Hyatt Camphor–Pyroxyline Process",
  subtitle: "Heat-activated camphor solvent action in pressed pyroxylin pulp",
  inventors: ["John W. Hyatt, Jr.", "Isaiah S. Hyatt"],
  inventorLocation: "Albany, Albany County, New York",
  grantDate: "1870-07-12",
  // The one-page grant and the primary public record supply no application or
  // filing date. Do not substitute the grant or execution date.
  filingDate: null,
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "materials",
  categoryLabel: "Materials and Polymer Processing",
  summary:
    "US 105,338 describes making a solid pyroxyline compound by wet-pulping the material, mixing in finely divided camphor and optional pigments, removing most water while retaining enough to prevent burning or explosion, then applying 150° to 300° Fahrenheit heat and pressure. Its three claims separately name pulping, heat-activated camphor-gum in the pulp, and pressure maintained through cooling.",
  heroQuote:
    "The heat, according to the degree used, vaporizes or liquefies the camphor, and thus converts it into a solvent of the pyroxyline.",
  originalPdfUrl: "/patents/pdfs/us-105338-hyatt-celluloid.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US105338A/en",
  usptoClassification: "C08L 1/18 (cellulose nitrate compositions)",
  originalTextAsset: {
    url: "/patents/transcripts/us-105338-hyatt-celluloid-reviewed.txt",
    pageCount: 1,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "186dd64b072c5a1182eac0c9c2cb4d2edb20f17296f3e5d934c9114ed684df82",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship:
          "The sole two-column patent-office sheet: formal matter, specification, claims, signatures, and witnesses.",
      },
    ],
  },
  // This is a source-true on-page excerpt. The complete public source is the
  // explicit archivalEdition below; the preserved legacy text assets are not
  // represented as a reviewed transcription.
  originalText:
    "Our invention consists, first, of so preparing pyroxyline that pigments and other substances in a powdered condition can be easily and thoroughly mixed therewith before the pyroxyline is subjected to the action of a solvent; secondly, of mixing with the pyroxyline so prepared any desirable pigment, coloring matter, or other material, and also any substance in a powdered state which may be vaporized or liquefied and converted into a solvent of pyroxyline by the application of heat; and, thirdly, of subjecting the compound so made to heavy pressure while heated, so that the least practicable proportion of solvent may be used in the production of solid collodion and its compounds.",
  archivalEdition: hyattCelluloidArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The specification addresses a processing problem: mix pigments or other powders through pyroxyline before solvent action, then make the solvent active inside the material instead of relying on a pre-made liquid solution. The Hyatt brothers use finely divided camphor, heat, and pressure to produce a moldable solid compound while stating an explicit safety condition: enough moisture remains after dewatering to prevent the pyroxyline from burning or exploding during the remaining process.",
    coreMechanism:
      "Wet grinding turns pyroxyline into a pulp. Pigment, dye, or another compatible powder can then be dispersed through that pulp. About one part finely pulverized camphor to two parts dry pyroxyline is mixed in, most water is expelled in a perforated vessel, and the mass goes into a mold. At 150° to 300° Fahrenheit, selected for the camphor proportion and mass size, camphor vaporizes or liquefies and becomes the pyroxyline solvent. Heavy pressure forces that solvent into intimate contact with every particle. Cooling while the pressure remains on completes the stated process before removal from the mold.",
    mechanicalBreakdown: [
      {
        title: "Wet-pulped pyroxyline",
        summary: "A paper-pulp-like wet grind creates a mixable starting state.",
        technicalDetails:
          "The specification calls for grinding pyroxyline in water to a fine pulp, then grinding in pigments, dyes, or other suitable powdered or granulated material. This is both the first stated invention and printed claim 1: the pulp condition is what makes thorough pre-solvent mixing possible.",
        archaicTerm: "Pyroxyline",
        modernEquivalent: "Soluble nitrocellulose or pyroxylin",
      },
      {
        title: "Finely divided camphor",
        summary:
          "Camphor is incorporated as a solid ingredient that heat subsequently makes solvent-active.",
        technicalDetails:
          "The source gives about one part by weight camphor to two parts dry pyroxyline, while allowing some variation. It permits water grinding, pounding, rolling, or alcoholic dissolution followed by precipitation to make the camphor finely divided. Claim 2 requires the finely comminuted camphor-gum to be mixed with the pulp and rendered a solvent by heat.",
        archaicTerm: "Gum-camphor",
        modernEquivalent: "Finely divided camphor",
      },
      {
        title: "Dewatering, heated pressing, and pressure cooling",
        summary:
          "The mold process removes most water, activates camphor with heat, and keeps pressure on through cooling.",
        technicalDetails:
          "The mixture is strained and pressed in a perforated vessel, but enough moisture must remain to prevent burning or explosion. In a suitable mold, steam or another method heats it to 150° to 300° Fahrenheit while a hydraulic or other press applies heavy pressure. The source says pressure gives solvent contact with every particle; claim 3 specifies keeping that pressure until the mold and contents cool.",
        archaicTerm: "Solid collodion",
        modernEquivalent: "A consolidated pyroxyline compound",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Heat-activated solvent action",
        formula: "150° F ≤ T ≤ 300° F",
        explanation:
          "This is the temperature range printed in the specification, not a modern optimized processing prescription. Hyatt and Hyatt say the proper point within it depends on camphor proportion and mass size, and that heat vaporizes or liquefies camphor so it can act as a pyroxyline solvent.",
      },
      {
        principle: "Pressure-assisted intimate contact",
        formula:
          "P > P_{\\text{ambient}} \\quad (\\text{maintained during } T_{\\text{process}} \\to T_{\\text{ambient}})",
        explanation:
          "The source's mechanism is mechanical as well as thermal: heavy pressure forces the heat-activated solvent into intimate contact with every particle, then remains applied while the mold and contents cool. No pressure value is printed in the facsimile, so the record does not invent one.",
      },
    ],
    whyItMattersToday:
      "The document is a compact early statement of compounding and compression molding: prepare a particulate feedstock, distribute additives, activate a processing aid with heat, consolidate under pressure, and cool under constraint. Its careful disclaimer also shows that the claimed route was not every use of camphor with nitrated cellulose, but the described heat-and-pressure sequence.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 protects the preparatory operation of grinding pyroxyline into pulp. Its legal role is narrow but foundational: the pulp is the condition that the specification says permits pigments and other powders to be mixed thoroughly before solvent action.",
      keyInnovations: ["Pyroxyline pulp", "Wet grinding", "Pre-solvent powder mixing"],
      legalSignificance:
        "A process claim to the document's first stated step, limited by the described purpose rather than a general claim to every ground pyroxyline material.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 covers the combination of finely divided camphor-gum with pyroxyline pulp when heat renders the camphor a solvent of that pulp. It requires the named material relationship and heat-activated solvent effect; it does not claim the disclaimed older practice of using a pre-made liquid camphor solution merely because camphor is present.",
      keyInnovations: [
        "Finely comminuted camphor-gum",
        "Pyroxyline pulp",
        "Heat-activated solvent action",
      ],
      legalSignificance:
        "The central material-process claim, expressly qualified by “substantially as described.”",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 adds a pressure-and-cooling condition to the camphor-gum use of claim 2. The pressure is not momentary: the source requires it to continue until both mold and contents have cooled, matching the process description's sequence of completing solvent action, cooling under pressure, and only then removing the molded mass.",
      keyInnovations: ["Pressure during molding", "Cooling under pressure", "Camphor-gum process"],
      legalSignificance:
        "A dependent combination claim that preserves the duration of pressure as part of the claimed process.",
    },
  ],
  // The complete facsimile is a one-page two-column specification. It prints
  // no drawings, figure labels, or figure references; no reconstructed figure
  // is represented as a source drawing.
  drawings: [],
  historicalContext: {
    problemStatement:
      "The patentees sought a way to make a solid pyroxyline material after pigment and other powders had been mixed through it, using less of a heat-activated solvent and avoiding the shrinkage they say does not appreciably occur in their molded product.",
    priorArtLimitations: [
      "The specification acknowledges camphor already used as a liquid solvent for xyloidine, then expressly disclaims that use.",
      "A liquid camphor solution is not the described sequence: this patent begins with finely divided camphor mixed through wet pyroxyline pulp and activates it with heat inside the pressed mass.",
    ],
    breakthroughInsight:
      "Heat can make finely divided camphor, already dispersed in pyroxyline pulp, solvent-active while pressure forces intimate contact through the mass and remains applied through cooling.",
    patentWars: [],
    civilizationalImpact:
      "The patent records an early, source-specific route to a moldable pyroxyline compound. Its importance here is the documented process sequence and its limits, rather than a retrospective claim that this one-page grant settles every later question about celluloid or plastics.",
    aftermath:
      "A later 1878 Hyatt comb patent identifies the article made by the processes described in US 105,338 as “celluloid” and notes that US 105,338 had been reissued as No. 5,928. That later description is context, not wording added to the 1870 source.",
    sideNotes: [
      "The 1870 facsimile does not use the word “Celluloid.” It calls the intended result “solid collodion” and its compounds.",
      "The facsimile has no drawing sheet, figure number, callout, or previewable figure reference.",
    ],
  },
  tags: ["pyroxyline", "camphor", "nitrocellulose", "compression molding", "materials"],
  stats: {
    totalClaims: 3,
    independentClaims: 2,
  },
};
