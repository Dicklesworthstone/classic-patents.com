import { pasteurFermentationArchivalEdition } from "@/data/editions/pasteurFermentationEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = pasteurFermentationArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Pasteur manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const pasteurFermentationPatent: Patent = {
  id: "us-135245-pasteur-fermentation",
  patentNumber: "US 135,245",
  title: "Improvement in Brewing Beer and Ale",
  shortTitle: "Carbonic-Acid Wort Cooling",
  subtitle: "Expelling air from hot wort before external water-spray cooling",
  inventors: ["Louis Pasteur"],
  inventorLocation: "Paris, France",
  grantDate: "1873-01-28",
  // Neither the reviewed grant nor the primary public record states a U.S. filing date.
  filingDate: null,
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Brewing & Food Process Engineering",
  summary:
    "Pasteur's one-claim process introduces carbonic-acid gas into boiling-hot wort in a closed vessel to expel contained air, externally cools the vessel with water spray, then adds yeast at 16°–18° Réaumur (20°–22.5 °C). It is not a claim to the later familiar heat-hold process called pasteurization.",
  heroQuote:
    "Subjecting the wort to a process for the expulsion of the air and cooling it off, substantially as and for the purposes set forth.",
  originalPdfUrl: "/patents/pdfs/us-135245-pasteur-fermentation.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US135245A/en",
  usptoClassification: "A23L 2/76 (modern classification: removal of gases from beverages)",
  originalTextAsset: {
    url: "/patents/transcripts/us-135245-pasteur-fermentation-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "CopperLotus, manual facsimile review",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "7c9145e813b652e9da76472a8e6d0b2fa3088aeb1cea34b5ae3163f4d673a649",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "L. PASTEUR. Brewing Beer and Ale. No. 135,245. Patented Jan. 28, 1873.",
        sourceRelationship:
          "The single drawing sheet carries the printed inventor, title, number, date, Figs. 1–2, and execution signatures.",
      },
      {
        page: 2,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship:
          "The first specification page contains the formal masthead and begins the two-column description.",
      },
      {
        page: 3,
        exactSourceText: "to cool them and their contents.",
        sourceRelationship:
          "The second specification page continues the cooling sentence, then contains the claim, execution, and witnesses.",
      },
    ],
  },
  originalText: `LOUIS PASTEUR, OF PARIS, FRANCE.

IMPROVEMENT IN BREWING BEER AND ALE.

Specification forming part of Letters Patent No. 135,245, dated January 28, 1873.

The full manual transcription, including both figures, complete specification, one claim, signature, and witnesses, is available in the archival reading face.`,
  archivalEdition: pasteurFermentationArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The patent is about the atmosphere around hot wort before fermentation. Pasteur directs the brewer to replace that air with carbon dioxide, remove heat with an external water spray, and only then introduce yeast. The printed specification does not prescribe a 50°–60 °C heat treatment or claim an aseptic, shelf-stable product.",
    coreMechanism:
      "Boiling wort enters vessel A. A stream of carbon dioxide sweeps through the vessel so that its gas phase and the wort's dissolved/entrained air are displaced. Water from pipe E reaches nozzles P and runs across the domed vessel exterior into a trough, carrying away heat. At 20°–22.5 °C, yeast begins the first fermentation. Recovered carbon dioxide may be collected in a gasometer and reused.",
    mechanicalBreakdown: [
      {
        title: "Closed wort vessel A",
        summary:
          "A closed cask or tank receives the boiling-hot wort while carbon dioxide is introduced.",
        technicalDetails:
          "The claimed procedure depends on excluding atmospheric air while the wort is confined. In mass-transfer terms, the gas stream reduces the air fraction in the vessel headspace and promotes removal of entrained air; the patent does not state a flow rate, pressure, or oxygen measurement.",
        archaicTerm: "wort",
        modernEquivalent: "Boiled, unfermented brewing liquor",
      },
      {
        title: "Carbonic-acid gas source M M",
        summary:
          "A generator supplies carbon dioxide through tubing to vessel A; recovered fermentation gas can later supplement it.",
        technicalDetails:
          "The specification's operative requirement is thorough penetration by carbonic-acid gas to expel all contained air. It describes a process objective, not a modern sealed-pressure specification.",
        archaicTerm: "carbonic-acid gas",
        modernEquivalent: "Carbon dioxide (CO₂)",
      },
      {
        title: "Water-spray cooling assembly E, P, i, c",
        summary:
          "Spray water runs down the outside of each vessel and is collected and discharged.",
        technicalDetails:
          "Cooling is external: heat crosses the vessel wall into a falling water film. A simple energy balance is $Q = m c_p \u0394T$ for the wort charge, while the rate is limited by the wall and water-film heat-transfer resistance. The patent gives the yeast-addition temperature but no cooling-time claim.",
        archaicTerm: "cocks",
        modernEquivalent: "Valves",
      },
      {
        title: "Post-cooling fermentation",
        summary:
          "At 16°–18° Réaumur, the brewer adds yeast or pure ferment and may continue fermentation in vessels A or transfer to barrels.",
        technicalDetails:
          "Réaumur temperature is converted by $T_{°C}=1.25T_{°Ré}$, so the stated interval is 20°–22.5 °C. The optional later addition of air is first passed through a hot tube or cotton, but that option is not separately claimed.",
        archaicTerm: "pure ferment",
        modernEquivalent: "Yeast inoculum",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Gas displacement",
        formula: "y_{\\mathrm{air,after}} < y_{\\mathrm{air,before}}",
        explanation:
          "Introducing carbon dioxide into a vented vessel lowers the fraction of air in the vessel atmosphere. The patent's claim is to expulsion and cooling, not to a specified residual oxygen concentration.",
      },
      {
        principle: "External convective cooling",
        formula: "\\dot{Q} = U A (T_{\\mathrm{wort}} - T_{\\mathrm{water}})",
        explanation:
          "A water film over the tank carries heat away from the hot wort through the vessel wall. The drawing shows the water path and collection trough, while the specification supplies no numerical heat-transfer coefficient.",
      },
      {
        principle: "Réaumur temperature conversion",
        formula: "T_{\\mathrm{C}} = 1.25 T_{\\mathrm{Ré}}",
        explanation:
          "The stated 16°–18° Réaumur interval corresponds to 20°–22.5 °C, the point at which the patent says to add yeast or pure ferment.",
      },
    ],
    whyItMattersToday:
      "The document records a nineteenth-century brewery process that treats gas composition, cooling geometry, and fermentation sequence as one system. Its narrow claim is a useful corrective to the common but inaccurate description of US 135,245 as a broad heat-pasteurization patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "The claim covers the paired process of removing air from wort and cooling it. The specification supplies the disclosed means: carbonic-acid gas in a closed vessel and exterior water spray.",
      keyInnovations: [
        "Air expulsion from wort",
        "Carbon-dioxide treatment in a closed vessel",
        "External water-spray cooling",
      ],
      legalSignificance:
        "This is the sole printed claim. It is not limited by an enumerated temperature or a separate pure-yeast claim.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Three-vessel carbonic-acid and spray-cooling apparatus",
      caption:
        "The drawing sheet shows vessels A, water pipe E and nozzles P, carbonic-acid generator M M, exit tubes x, drainage i and c, and faucets R/R′.",
      svgType: "pasteur-fermentation",
      callouts: [
        {
          id: "pf-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Vessels",
          description: "Casks or tanks holding the wort and later the fermenting beer.",
          x: 49,
          y: 51,
        },
        {
          id: "pf-e",
          figureRef: "Fig. 1",
          label: "E",
          element: "Water-supply pipe",
          description: "Pipe feeding the branches and spray nozzles.",
          x: 48,
          y: 8,
        },
        {
          id: "pf-p",
          figureRef: "Fig. 1",
          label: "P",
          element: "Spray nozzles",
          description:
            "Nozzles that spray water across the domed vessel tops for external cooling.",
          x: 49,
          y: 32,
        },
        {
          id: "pf-mm",
          figureRef: "Fig. 1",
          label: "M M",
          element: "Carbonic-acid generator",
          description: "Apparatus supplying carbon-dioxide gas to the vessels.",
          x: 51,
          y: 24,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Modified removable-top vessel",
      caption:
        "A modified vessel B with removable top, water gages, thermometers, man-holes, and the spray arrangement.",
      svgType: "pasteur-fermentation-fig-2",
      callouts: [
        {
          id: "pf-b",
          figureRef: "Fig. 2",
          label: "B",
          element: "Modified vessel",
          description: "The removable-top vessel or cask described in the specification.",
          x: 50,
          y: 50,
        },
        {
          id: "pf-g",
          figureRef: "Fig. 2",
          label: "g g′",
          element: "Rim parts",
          description: "The figure's labeled rim and associated vessel components.",
          x: 31,
          y: 38,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Pasteur identifies atmospheric-air exposure of boiled wort as a brewery problem: he says it impairs beer quality and lowers yield from a given amount of wort.",
    priorArtLimitations: [
      "The customary process exposed boiled wort to atmospheric air during cooling.",
      "The grant says ordinary cooling vessels lose material by evaporation; it does not quantify the loss.",
      "The pre-existing record's claimed 50°–60 °C heat treatment and separate pure-yeast claim are absent from this grant.",
    ],
    breakthroughInsight:
      "The patent treats air exclusion and heat removal as coupled operations: displace the air in a closed vessel with carbonic-acid gas, then cool the exterior with water spray before inoculating.",
    patentWars: [],
    civilizationalImpact:
      "This grant is evidence of Pasteur applying experimental fermentation work to brewery equipment and process sequence. It should not be used as evidence for claims that its text does not make, including a general pasteurization temperature regime.",
    aftermath:
      "The grant itself reports an earlier French patent dated June 28, 1871. The local record is deliberately limited to what the U.S. facsimile and its catalog entry support.",
    sideNotes: [
      "The specification is signed December 8, 1871 and granted January 28, 1873.",
      "Fig. 1 and Fig. 2 are on the separate first drawing sheet; the printed specification is on sheets 2 and 3.",
    ],
  },
  tags: [
    "Louis Pasteur",
    "brewing",
    "carbon dioxide",
    "wort",
    "fermentation",
    "process engineering",
  ],
  stats: { totalClaims: 1, independentClaims: 1 },
};
