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
    "Goodyear's 1844 process: heat raw Hevea gum with sulfur until the polyisoprene chains cross-link. The stuff stops melting in August and cracking in January. That is vulcanization; the rest of the rubber industry is process control around this reaction.",
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
      "Sulfur still cross-links most natural-rubber and SBR tires. Peroxide and radiation cures exist for specialty elastomers; the passenger-car carcass is still Goodyear's chemistry with carbon black and accelerators his furnace never saw.",
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
      "The 1830s 'rubber fever' sold shoes and wagon covers that melted into sludge above about 80°F and shattered below freezing. Roxbury India Rubber and its copyists went bankrupt. Untreated Hevea is a thermoplastic gum, not an engineering solid.",
    priorArtLimitations: [
      "Raw latex is sticky above summer indoor temperatures.",
      "The same gum is glass-brittle near 32°F.",
      "Turpentine, camphene, and lamp oils dissolve it.",
      "Nitric-acid 'cures' (Goodyear's own earlier method) only tanned the surface.",
    ],
    breakthroughInsight:
      "The stove story is 1839, Woburn, in Nathaniel Hayward's shop: a sulfur-mixed scrap charred on the iron and stayed springy after it cooled. Whether the drop was accident or a leftover from Hayward's solarization experiments is still argued. The chemistry is not: heat plus sulfur cross-links polyisoprene.",
    patentWars: [
      {
        rivalName: "Thomas Hancock (Britain) and Horace H. Day",
        rivalClaim:
          "Hancock saw Goodyear samples in London, smelled sulfur, reproduced the heat treatment, and filed in Britain weeks ahead of Goodyear's English application. Day infringed in the United States and called Goodyear a crank.",
        conflictDetails:
          "Goodyear v. Day (the Great India-Rubber Case, Trenton, 1852) put Daniel Webster, then Secretary of State, on Goodyear's brief for a large fee. Webster's speech is famous; the holding is narrower: US 3,633 is valid and Day infringed.",
        resolution:
          "Goodyear won in New Jersey. He never collected a Hancock-scale British fortune. He died in 1860 still in debt.",
        legalOutcome:
          "US patent held. British priority went to Hancock. The word 'vulcanization' is Hancock's.",
      },
    ],
    civilizationalImpact:
      "Waterproof boots, then belts, then (after 1888–1895) pneumatic tires. Without a heat-stable elastomer the bicycle boom and the automobile have no contact patch.",
    funFact:
      "Goodyear really did wear vulcanized coats and shoes as walking samples. Visitors found the costume as convincing as the chemistry.",
    aftermath:
      "The Goodyear Tire & Rubber Company (1898) licensed the name from the family; Charles had been dead 38 years. He did not found the Akron firm and did not get its dividends.",
    sideNotes: [
      "Hayward's US patent on sulfur-sunlight treatment was assigned to Goodyear. A fair account gives Hayward a piece of the invention and Goodyear the heat that finished it.",
      "Charles Goodyear Jr. later worked on welt-sewing machinery. The family's talent ran to process, not to keeping money.",
      "Modern accelerated vulcanization (aniline, then mercaptobenzothiazole) is 20th-century. The 1844 patent is heat, sulfur, and time.",
    ],
  },
};
