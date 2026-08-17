import type { Patent } from "@/types/patent";

export const goodyearRubberPatent: Patent = {
  id: "us-3633-goodyear-rubber",
  patentNumber: "US 3,633",
  title: "Improvement in India-Rubber Fabrics",
  shortTitle: "Goodyear Vulcanized Rubber",
  subtitle:
    "Chemical Cross-Linking of Polyisoprene Elastomers via Sulfur and High-Temperature Curing",
  inventors: ["Charles Goodyear"],
  inventorLocation: "New York, New York",
  grantDate: "1844-06-15",
  filingDate: "1844-01-30",
  era: "Industrial Dawn (1840–1870)",
  category: "materials",
  categoryLabel: "Materials Science & Chemical Engineering",
  summary:
    "The birth of modern polymer chemistry and elastomers: Charles Goodyear discovered that heating natural raw gum elastic (India rubber) with sulfur transforms the soft, sticky polymer into a resilient, waterproof, non-sticky elastomer impervious to cold and heat.",
  heroQuote:
    "Be it known that I, Charles Goodyear, have invented a new and useful manner of preparing compositions of India-rubber, whereby the property of said gum is so far altered as not to be softened by the action of the solar or artificial heat...",
  originalPdfUrl: "/patents/pdfs/us-3633-goodyear-rubber.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3633A/en",
  usptoClassification: "C08J 3/24 (Crosslinking of rubber compounds)",
  originalText: `UNITED STATES PATENT OFFICE.
CHARLES GOODYEAR, OF NEW YORK, N. Y.

IMPROVEMENT IN INDIA-RUBBER FABRICS.

Specification forming part of Letters Patent No. 3,633, dated June 15, 1844.

To all whom it may concern:
Be it known that I, CHARLES GOODYEAR, of the city of New York, in the State of New York, have invented a new and useful manner of preparing compositions of India-Rubber, by which means the properties of said gum are so far altered as not to be softened by the action of the solar or artificial heat, nor rendered brittle by the cold, and of which the following is a full and exact description.

My principal improvement consists in the combining of sulfur and white lead with India-rubber, and in the subjecting of the compound thus formed to the action of a high degree of heat, by which means the property of the rubber is essentially changed, so that it will withstand the heat of the sun and the action of solvents which previously dissolved it.

The process of manufacture is as follows:
Take natural India-rubber (gum elastic) and reduce it to a state of plastic dough by mastication between heated rollers. Incorporate with the rubber sulfur in the proportion of from two to five parts by weight of sulfur to one hundred parts of rubber, together with a metallic oxide such as white lead (carbonate of lead) or litharge in the proportion of from twelve to twenty parts by weight.

The thoroughly compounded mixture is then sheeted or molded into the desired articles, such as waterproof cloth, boots, shoes, vehicle springs, or hose pipes.

The articles so formed are then exposed to artificial heat in an oven or steam-chamber heated to a temperature of between two hundred and seventy degrees (270°F) and three hundred degrees (300°F) Fahrenheit, for a period of from one to six hours.

By this heating process, the sulfur combines chemically with the gum, producing a profound transformation: the rubber loses its stickiness, becomes completely insoluble in turpentine, camphene, or essential oils, and retains its elasticity unchanged across extreme temperatures from freezing cold to the boiling point of water.`,
  plainEnglishExplanation: {
    overview:
      "In the 1830s, natural rubber products caused a commercial catastrophe: waterproof coats and shoes melted into rancid, rotting goo in summer heat and froze into brittle, shattering glass in winter cold. Charles Goodyear spent a decade in poverty experimenting with natural gum. In 1839, after accidentally dropping a sulfur-rubber mixture onto a hot stove, he discovered vulcanization: heat causes sulfur atoms to form covalent chemical bridges between parallel polyisoprene polymer chains, locking them into a permanently elastic 3D cross-linked network.",
    coreMechanism:
      "Raw natural rubber consists of long, tangled polymer chains of cis-1,4-polyisoprene that slide past one another when warm (viscous flow) and crystalize when cold. During vulcanization, heat ($140^\\circ\\text{C}$) opens carbon-carbon double bonds ($C=C$) along adjacent polymer backbones, allowing sulfur atoms to form covalent disulfide and polysulfide bridge links ($-C-S_x-C-$). These molecular cross-links act like microscopic springs, allowing the chains to stretch under mechanical stress but snapping them back to their original configuration when tension is released.",
    mechanicalBreakdown: [
      {
        title: "Sulfur Covalent Cross-Linking Bridges",
        summary: "Sulfur atoms bonding across adjacent polyisoprene hydrocarbon chains.",
        technicalDetails:
          "Disulfide and polysulfide bridges ($-S_x-$ where $x = 1\\text{ to }6$) connect the carbon backbones. The cross-link density determines hardness, transforming soft gum into flexible tire tread or hard ebonite.",
        archaicTerm: "Combining of sulfur with gum-elastic by heat",
        modernEquivalent: "Covalent polymer vulcanization network",
      },
      {
        title: "White Lead Inorganic Catalyst / Activator",
        summary: "Basic lead carbonate added to accelerate the sulfur reaction.",
        technicalDetails:
          "Lead oxide acts as an inorganic activator and hydrogen sulfide scavenger, accelerating cross-linking and preventing porosity bubbles in the cured elastomer.",
        archaicTerm: "White lead / Carbonate of lead",
        modernEquivalent: "Vulcanization accelerator & acid scavenger",
      },
      {
        title: "Thermal Curing Steam Chamber",
        summary: "An oven heating the compounded rubber to 270°F–300°F (132°C–149°C).",
        technicalDetails:
          "Provides the activation energy ($E_a \\approx 100\\text{ kJ/mol}$) required to break sulfur ring molecules ($S_8$) into reactive free radicals that cross-link the polymer chains.",
        archaicTerm: "Artificial heat in an oven or steam-chamber",
        modernEquivalent: "High-temperature vulcanization autoclave",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rubber Elasticity & Entropic Spring Physics",
        formula:
          "f = -T \\left(\\frac{\\partial S}{\\partial L}\\right)_T = \\frac{\\rho R T}{M_c} \\left(\\lambda - \\frac{1}{\\lambda^2}\\right)",
        explanation:
          "Cross-linked rubber elasticity is purely entropic: stretching chains straight reduces conformational entropy; releasing tension allows thermal agitation to pull chains back into random coiled states.",
      },
      {
        principle: "Cross-Link Density & Elastic Modulus",
        formula: "G = N k_B T = \\frac{\\rho R T}{M_c}",
        explanation:
          "The shear modulus G is directly proportional to absolute temperature T and cross-link density N (inversely proportional to average molecular weight between cross-links M_c).",
      },
    ],
    whyItMattersToday:
      "Goodyear's vulcanization process made the modern industrial and automotive age possible. Every car, truck, bicycle, and airplane tire on Earth—along with hydraulic seals, gaskets, waterproof conveyor belts, and medical gloves—relies on sulfur-vulcanized elastomer chemistry.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The forming of the metallic gum-elastic composition of matter substantially as herein set forth, by the combining of sulfur and white lead with India-rubber, and heating the compound, as described.",
      plainEnglish:
        "Composition of matter claim covering vulcanized rubber made by combining raw rubber with sulfur, an inorganic metallic activator, and heat.",
      keyInnovations: [
        "Sulfur vulcanized rubber composition",
        "Heat-activated cross-linking",
        "Temperature-stable elastomer",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Molecular Cross-Linking of Vulcanized Rubber",
      caption:
        "Schematic diagram illustrating cis-1,4-polyisoprene polymer chains connected by sulfur covalent bridge atoms.",
      svgType: "goodyear-rubber",
      callouts: [
        {
          id: "gr-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Polyisoprene Polymer Backbone",
          description: "Long-chain hydrocarbon backbone providing elastic stretching freedom.",
          x: 50,
          y: 35,
        },
        {
          id: "gr-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Sulfur Cross-Linking Bridges",
          description: "Disulfide bonds connecting chains to prevent viscous melting.",
          x: 50,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The 'Rubber Fever' of the 1830s collapsed after hundreds of thousands of rubber shoes, coats, and wagon covers turned to liquid sludge in the summer sun, bankrupting early manufacturers.",
    priorArtLimitations: [
      "Natural latex became sticky and liquefied above 80°F.",
      "Natural latex turned brittle like glass and cracked below 32°F.",
      "Soluble in turpentine, camphene, and oils.",
    ],
    breakthroughInsight:
      "In 1839 in Woburn, Massachusetts, Goodyear accidentally dropped a piece of rubber mixed with sulfur onto a hot wood stove. The charred piece did not melt; it remained elastic and resilient even after cooling in the winter snow.",
    patentWars: [
      {
        rivalName: "Thomas Hancock (Great Britain) & Horace Day",
        rivalClaim:
          "Hancock examined Goodyear's samples in London, smelled sulfur, figured out the heat treatment, and filed a British patent weeks before Goodyear.",
        conflictDetails:
          "In the famous 'Great India-Rubber Case' of 1852 in Trenton, New Jersey, Goodyear was represented by legendary orator Daniel Webster against infringing manufacturers.",
        resolution:
          "Webster's brilliant arguments won a decisive federal victory confirming Goodyear as the sole inventor.",
        legalOutcome: "Federal validation of Goodyear's patent.",
      },
    ],
    civilizationalImpact:
      "Created the entire synthetic and natural rubber industry, making automobile tires, pneumatic seals, electrical insulation, and waterproof gear possible.",
    funFact:
      "Goodyear was so obsessed with rubber that he wore a suit, hat, and boots made entirely of his experimental vulcanized rubber to prove its durability.",
  },
};
