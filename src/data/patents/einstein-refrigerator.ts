import { einsteinRefrigeratorArchivalEdition } from "@/data/editions/einsteinRefrigeratorEdition";
import type { Patent } from "@/types/patent";

const sourceClaimText = (number: number) => {
  for (const block of einsteinRefrigeratorArchivalEdition.blocks) {
    if (block.kind === "claim" && block.number === number) {
      return block.inlines.map((inline) => inline.text).join("");
    }
  }
  throw new Error(`US 1,781,541 is missing source claim ${number}.`);
};

export const einsteinRefrigeratorPatent: Patent = {
  id: "us-1781541-einstein-refrigerator",
  patentNumber: "US 1,781,541",
  title: "Refrigeration",
  shortTitle: "Einstein–Szilárd Absorption Refrigerator",
  subtitle:
    "Three-fluid absorption circuit with a heat-lifted return and partial-pressure evaporation",
  inventors: ["Albert Einstein", "Leo Szilard"],
  inventorLocation: "Berlin and Berlin-Wilmersdorf, Germany",
  grantDate: "1930-11-11",
  filingDate: "1927-12-16",
  era: "Industrial & Mass Production (1910–1940)",
  category: "consumer",
  categoryLabel: "Thermodynamics & Consumer Technology",
  summary:
    "Einstein and Szilard describe a three-fluid absorption refrigerator. In their illustrated cycle, butane evaporates beside ammonia in evaporator 1; water absorbs the ammonia in condenser 6 so butane can condense and return. Heat in generator 29 regenerates the ammonia, while a heated conduit lifts weak solution to elevated container 33.",
  heroQuote:
    "During the operation of the hereinbefore described apparatus, the pressure existing in the various members is uniform with the exception of slight pressure differences, sufficient to cause flow of fluids, caused by liquid columns.",
  originalPdfUrl: "/patents/pdfs/us-1781541-einstein-refrigerator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1781541A/en",
  usptoClassification: "F25B 15/00 (Absorption refrigeration machines)",
  originalTextAsset: {
    url: "/patents/transcripts/us-1781541-einstein-refrigerator-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "5b67c380be742776b9509862e68e1fc68478a7b1cc92f215ba422efbd76b96e4",
  },
  // This compact catalogue excerpt is deliberately not presented as the full source.
  originalText:
    "Our invention relates to the art of refrigeration and particularly to an apparatus and method for producing refrigeration wherein the refrigerant evaporates in the presence of an inert gas. The complete source, its five claims, and the sole drawing are available in the manually prepared Original Patent Text edition.",
  archivalEdition: einsteinRefrigeratorArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The patent describes a three-fluid absorption refrigerator: butane is the cooling liquid, ammonia is the inert gas that lowers butane's partial pressure in the evaporator, and water absorbs ammonia again in the condenser. The working fluids move through the apparatus by gravity, heat exchange, vapor lift, and small liquid-head pressure differences.",
    coreMechanism:
      "Liquid butane enters evaporator 1. Ammonia delivered by conduit 30 lowers butane's partial pressure, so butane evaporates and absorbs heat. The vapor mixture reaches condenser 6, where water dissolves ammonia and leaves butane to condense under the cooling-water jacket. Ammonia-rich water returns by gravity to generator 29, where heat expels ammonia for another pass; a separately heated conduit lifts weak solution to container 33 for its return to the condenser.",
    mechanicalBreakdown: [
      {
        title: "Evaporator, vapor conduit, and liquid return",
        summary:
          "Evaporator 1 holds liquid butane; conduit 5 carries its mixed vapor toward condenser 6, and conduit 11 returns liquid butane to the evaporator.",
        technicalDetails:
          "Ammonia enters through conduit 30 and distributor head 31 near the evaporator bottom. The source says its presence reduces butane's partial pressure, producing evaporation. Condensed butane returns through conduit 11, below the connection of conduit 5 to the condenser.",
        archaicTerm: "Refrigerant",
        modernEquivalent: "Cooling agent that evaporates to absorb heat",
      },
      {
        title: "Condenser and absorbing water",
        summary:
          "Condenser 6 contacts the butane-ammonia vapor mixture with water, which absorbs ammonia and allows butane to condense.",
        technicalDetails:
          "Water reaches distributor head 35 through conduit 37. The patent relies on ammonia being very soluble in water and butane being quite insoluble, so the water removes ammonia from the vapor mixture. Cooling-water jacket 12 maintains a temperature at which the freed butane liquefies.",
        archaicTerm: "Absorption liquid",
        modernEquivalent: "Selective absorbent",
      },
      {
        title: "Generator and heat exchanger",
        summary:
          "Generator 29 heats ammonia-rich water so ammonia leaves as gas, while heat-exchanger jacket 28 exchanges heat between the strong and weak solutions.",
        technicalDetails:
          "The rich ammonia-water solution flows by gravity from condenser 6 through conduit 27 and jacket 28 to generator 29. Heating the generator expels ammonia through conduit 30. The patent does not specify a burner, electric heater, working pressures, or cooling capacity.",
        archaicTerm: "Strong and weak solution",
        modernEquivalent: "Ammonia-rich and ammonia-lean absorbent solution",
      },
      {
        title: "Heated riser, elevated container, and vent",
        summary:
          "Heat at 36 forms vapor in conduit 32, lifting weak liquid to container 33; the liquid then returns through conduit 37 and vapor vents through conduit 34.",
        technicalDetails:
          "The lift is a source-described vapor-lift effect, not a mechanical compressor. Container 33 sits above condenser 6 so its liquid return through conduit 37 can proceed by gravity. Claim 2 and Claim 4 additionally require vent conduit 34 between the container and condenser.",
        archaicTerm: "Liquid head",
        modernEquivalent: "Hydrostatic pressure caused by an elevation difference",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Partial-pressure evaporation",
        formula:
          "Ammonia in the evaporator reduces butane's partial pressure, allowing butane to evaporate.",
        explanation:
          "The patent gives the causal relation but no numerical pressure, temperature, or composition. The engineering point is that the relevant evaporation condition is butane's partial pressure, not merely the pressure of the whole apparatus.",
      },
      {
        principle: "Selective absorption and condensation",
        formula:
          "Water absorbs ammonia much more readily than butane, leaving butane to condense under cooling.",
        explanation:
          "Condenser 6 uses solubility contrast to separate the gas mixture. Once water removes ammonia, butane assumes substantially the condenser pressure and can liquefy at the temperature maintained by jacket 12.",
      },
      {
        principle: "Liquid-head flow balance",
        formula: "For the stated flow, the liquid head h₂ must be less than liquid head h₁.",
        explanation:
          "The grant says pressure is nearly uniform, with small differences created by liquid columns. The source uses the elevation heads h₁ and h₂ to state when generator vapor can overcome the relevant liquid column and flow toward the evaporator.",
      },
    ],
    whyItMattersToday:
      "The patent is a precise example of absorption refrigeration as a coupled separation-and-return process: an inert gas changes evaporation conditions, an absorbent separates that gas from the cooling liquid, and heat regenerates the absorbent. Its five claims distinguish the general apparatus, versions with a vent, versions using ammonia, water, and butane, and a corresponding method.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: sourceClaimText(1),
      plainEnglish:
        "Claim 1 covers the general elevated generator, condenser, evaporator, and container arrangement, with inert gas, absorbent, gravity conduits, and a heated riser that lifts liquid to the container.",
      keyInnovations: [
        "Elevated container and condenser arrangement",
        "Inert-gas absorption loop",
        "Heat-lifted weak-solution return",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: sourceClaimText(2),
      plainEnglish:
        "Claim 2 is Claim 1's general apparatus plus a vent conduit from the container's upper part to the condenser.",
      keyInnovations: ["Container-to-condenser vent conduit", "Heat-lifted absorption liquid"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: sourceClaimText(3),
      plainEnglish:
        "Claim 3 specifies the working materials: ammonia dissolved in water, ammonia gas, liquid butane, and strong and weak ammonia-water solutions.",
      keyInnovations: ["Ammonia-water absorbent", "Liquid butane refrigerant"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: sourceClaimText(4),
      plainEnglish:
        "Claim 4 is the material-specific arrangement of Claim 3 with the additional vent conduit from the container to the condenser.",
      keyInnovations: ["Ammonia-water-butane circuit", "Container vent conduit"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: sourceClaimText(5),
      plainEnglish:
        "Claim 5 covers the operating sequence: evaporate the cooling liquid beside inert gas, absorb the inert gas so the cooling agent condenses, use heat to separate the absorbent and inert gas, and return each stream to continue the cycle.",
      keyInnovations: [
        "Inert-gas-assisted evaporation",
        "Absorption separation",
        "Heat-regenerated circulation",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Source drawing",
      title: "Three-fluid absorption refrigeration apparatus",
      caption:
        "The sole drawing sheet shows the apparatus described in the specification: evaporator 1, condenser 6, cooling-water jacket 12, generator 29, elevated container 33, and their conduits.",
      svgType: "einstein-refrigerator",
      callouts: [
        {
          id: "evaporator-1",
          figureRef: "Source drawing",
          label: "Evaporator",
          element: "1",
          description: "Vessel holding liquid butane, where ammonia reduces its partial pressure.",
          x: 82,
          y: 52,
        },
        {
          id: "condenser-6",
          figureRef: "Source drawing",
          label: "Condenser",
          element: "6",
          description:
            "Vessel where water absorbs ammonia and butane condenses under cooling-water heat removal.",
          x: 53,
          y: 44,
        },
        {
          id: "generator-29",
          figureRef: "Source drawing",
          label: "Generator",
          element: "29",
          description: "Heated vessel that expels ammonia gas from the ammonia-water solution.",
          x: 27,
          y: 76,
        },
        {
          id: "container-33",
          figureRef: "Source drawing",
          label: "Elevated container",
          element: "33",
          description:
            "Container above condenser 6 that receives lifted weak solution and returns it by gravity.",
          x: 30,
          y: 29,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The grant addresses refrigeration in which a cooling liquid evaporates in the presence of an inert gas, then must be separated from that gas and returned for another cycle.",
    priorArtLimitations: [
      "The specification identifies US Patent No. 1,685,764, granted September 25, 1928 to Von Platen and Munters, as a related absorption-refrigeration type.",
      "It also identifies the inventors' British Patent No. 282,428 as related prior work.",
    ],
    breakthroughInsight:
      "The illustrated arrangement joins partial-pressure evaporation, selective absorption of ammonia by water, condensation of butane, gravity returns, and a separately heated vapor-lift conduit in one cycle.",
    patentWars: [],
    civilizationalImpact:
      "The document supplies a concrete source record for a three-fluid absorption refrigeration cycle, including the material-specific ammonia-water-butane claims and the method claim. It should be read as a defined apparatus and process, not as a generic origin story for all silent refrigerators.",
    funFact:
      "The printed grant names both a United States application date, December 16, 1927, and a German filing date, December 16, 1926.",
    aftermath:
      "US 1,781,541 was granted on November 11, 1930 and assigns the inventors' interest to Electrolux Servel Corporation of New York, New York.",
    sideNotes: [
      "The source does not state a fixed total pressure, a cooling temperature, or a compressor specification.",
      "The five printed claims include four apparatus claims and one method claim.",
    ],
  },
  tags: [
    "Albert Einstein",
    "Leo Szilard",
    "Absorption Refrigeration",
    "Thermodynamics",
    "Butane",
    "Ammonia",
    "Heat Exchanger",
  ],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
};
