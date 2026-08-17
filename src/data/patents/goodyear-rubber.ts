import type { Patent } from "@/types/patent";

export const goodyearRubberPatent: Patent = {
  id: "us-3633-goodyear-rubber",
  patentNumber: "US 3,633",
  title: "Improvement in India-Rubber Fabrics",
  shortTitle: "Goodyear Vulcanized Rubber",
  subtitle: "Thermal Sulfur Cross-Linking of Elastomeric Polymer Chains",
  inventors: ["Charles Goodyear"],
  inventorLocation: "New York, NY",
  grantDate: "1844-06-15",
  filingDate: "1844-01-30",
  era: "Industrial Materials Revolution (1840-1860)",
  category: "materials",
  categoryLabel: "Polymer Chemistry",
  summary:
    "Charles Goodyear's breakthrough discovery of rubber vulcanization. By subjecting raw natural latex gum mixed with sulfur and white lead to elevated heat, Goodyear cross-linked polymer polyisoprene chains, curing the sticky, temperature-sensitive material into an impervious, elastic, weatherproof engineering material.",
  heroQuote:
    "My principal improvement consists in combining sulfur and white lead with India-rubber and then subjecting the compound to a high degree of heat, whereby the rubber undergoes a change that renders it unalterable by cold or solar heat, and completely insusceptible to dissolving actions.",
  originalPdfUrl: "/patents/pdfs/us-3633-goodyear-rubber.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3633A/en",
  usptoClassification: "C08C 19/20; C08K 3/06",
  originalText: `TO ALL WHOM IT MAY CONCERN:
Be it known that I, CHARLES GOODYEAR, of the city of New York, have invented a new and useful Improvement in the Process of Curing India-Rubber, of which the following is a specification.

India-rubber in its natural state is subject to serious defects: in warm weather it softens, decomposes, becomes exceedingly sticky and offensive in smell, while in cold weather it becomes rigid and brittle.

My process consists in compounding caoutchouc or India-rubber with sulfur and white lead (or other metallic oxides) in certain proportions, and subjecting the compound to the action of artificial heat at temperatures from 270° to 300° Fahrenheit for a period of several hours. By this treatment the rubber undergoes a metallic and chemical change: it no longer melts under high temperatures, remains perfectly flexible in extreme winter cold, resists all solvents which dissolve raw gum, and possesses unprecedented elasticity and resilience.`,
  plainEnglishExplanation: {
    overview:
      "Natural rubber tree latex (cis-1,4-polyisoprene) is a collection of tangled polymer chains with no chemical bonds between them. In summer heat, the chains slide past each other, turning rubber into a gooey, melting sludge; in winter, the chains freeze rigid and crack like glass. Goodyear accidentally dropped sulfur-treated gum onto a hot stove and discovered that baking rubber with sulfur created permanent disulfide cross-links between polymer chains, forming a 3D elastic molecular web that gave birth to the modern materials industry.",
    coreMechanism:
      "At elevated temperatures (130°C–150°C), elemental sulfur rings ($S_8$) break open and bond across reactive double carbon bonds on adjacent polyisoprene chains, forming covalent monosulfide and disulfide bridges ($-C-S_x-C-$) that permanently prevent chain slippage while preserving elasticity.",
    mechanicalBreakdown: [
      {
        title: "Disulfide Covalent Cross-Linking",
        summary:
          "Transforming a thermoplastic liquid melt into a thermoset permanent elastic elastomer.",
        technicalDetails:
          "Raw cis-1,4-polyisoprene has free double bonds ($C=C$). Sulfur atoms react with these allylic sites, creating sulfur bridges between adjacent chains. When stretched, the chains uncoil; when released, the sulfur cross-links pull the molecular network back into its exact original resting shape (Hookean elasticity).",
        archaicTerm: "Subjecting the compound to artificial heat of 270°F",
        modernEquivalent: "Thermal sulfur elastomer cross-linking (vulcanization)",
      },
      {
        title: "Inorganic Oxide Accelerators (White Lead / Basic Lead Carbonate)",
        summary: "Catalyzing sulfur activation and preventing sulfuric acid degradation.",
        technicalDetails:
          "Goodyear found that pure sulfur and rubber cured too slowly and produced acidic byproducts. Adding basic lead carbonate ($2PbCO_3 cdot Pb(OH)_2$) acted as a vital inorganic vulcanization accelerator and acid scavenger, accelerating cure time from 12 hours to under 2 hours.",
        archaicTerm: "White-lead or litharge as a drier",
        modernEquivalent: "Inorganic vulcanization activator & accelerator",
      },
      {
        title: "Solvent & Temperature Immunity",
        summary:
          "Eliminating the susceptibility of raw rubber to turpentine, oil, and atmospheric extremes.",
        technicalDetails:
          "Because the polymer chains are bonded into a single interconnected giant macromolecule, organic solvents can swell the matrix but cannot dissolve it. Glass transition temperature ($T_g$) and thermal decomposition temperature are drastically expanded (-40°C to +150°C).",
        archaicTerm: "Unalterable by cold or solar heat",
        modernEquivalent: "Expanded operating thermal envelope & chemical solvent resistance",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Polymer Network Cross-Link Density & Elasticity (Affinity Theory)",
        formula: "G = n · k_B · T = (ρ R T) / M_c",
        explanation:
          "Shear modulus G is directly proportional to cross-link density (where M_c is molecular weight between cross-links). Higher sulfur content increases rigidity, producing hard ebonite; moderate sulfur yields soft tire tread.",
      },
      {
        principle: "Entropy Elasticity of Elastomers",
        formula: "f = -T · (∂S / ∂L)_T",
        explanation:
          "Rubber elasticity is an entropic force: stretching straightens polymer chains (lowering conformational entropy S); thermal agitation drives them back toward high-entropy tangled states.",
      },
    ],
    whyItMattersToday:
      "Vulcanized rubber made modern transportation possible (automotive tires, shock mounts, conveyor belts) as well as critical industrial seals, O-rings, gaskets, waterproof electrical insulators, and medical tubing.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination of caoutchouc with sulfur and white-lead, and the subsequent exposure of the same to a high degree of heat, substantially in the manner and for the purpose herein set forth.",
      plainEnglish:
        "The master combination of mixing raw natural rubber with sulfur and lead oxide, and heating the compound at high temperature (270°F) to permanently alter its physical and chemical properties.",
      keyInnovations: [
        "Rubber-sulfur-lead compounding",
        "High-temperature baking (270°F–300°F)",
        "Thermoset elasticity",
      ],
      legalSignificance:
        "The broad foundational patent for vulcanization, fiercely defended in the historic 'Great India-Rubber Case' of 1852.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Rubber Compounding Rollers & High-Temperature Steam Curing Chamber",
      caption:
        "Showing masticating roll mills, sulfur mixing trough, and high-pressure steam vulcanizing autoclave.",
      svgType: "kwolek-kevlar",
      callouts: [
        {
          id: "masticator",
          figureRef: "Fig. 1",
          label: "Mastication Rollers",
          element: "R",
          description:
            "Steel steam-heated rollers grinding raw rubber gum into a homogeneous plastic dough.",
          x: 35,
          y: 40,
        },
        {
          id: "curing-oven",
          figureRef: "Fig. 1",
          label: "Steam Curing Autoclave",
          element: "O",
          description:
            "Pressure chamber delivering 270°F–300°F heat to cross-link sulfur into the rubber matrix.",
          x: 65,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1830s, the 'India-Rubber Craze' crashed into financial ruin when thousands of rubber shoes, coats, and wagon covers melted into foul-smelling glue during hot summers and froze solid into brittle shards in winter.",
    priorArtLimitations: [
      "Nathaniel Hayward used sulfur on the surface of rubber (the 'solarizing' process), but it only treated the microscopic surface and decomposed upon heating.",
      "Thomas Hancock (UK) dissolved rubber in turpentine, but the dried rubber remained purely thermoplastic and melted in heat.",
    ],
    breakthroughInsight:
      "Goodyear discovered that heat—which had always been rubber's greatest enemy—was actually the necessary catalyst: applying high temperature (270°F) to rubber compounded throughout with sulfur and white lead transformed its internal molecular structure permanently.",
    patentWars: [
      {
        rivalName: "Horace H. Day & Thomas Hancock",
        rivalClaim:
          "Day infringed Goodyear's patent in the US, while Thomas Hancock claimed priority in England after seeing a sample of Goodyear's vulcanized rubber.",
        conflictDetails:
          "Goodyear hired Daniel Webster (the famous US Senator and orator) for a then-astronomical fee of $15,000 to defend the patent in Goodyear v. Day (1852), known as the 'Great India-Rubber Case'.",
        resolution:
          "Judge Robert C. Grier and the US Circuit Court issued an absolute injunction against Day, delivering a sweeping defense of Goodyear's priority and sacrifice.",
        legalOutcome:
          "Webster's closing arguments established the principle of judicial protection for pioneering inventors who endure years of trial-and-error discovery.",
      },
    ],
    civilizationalImpact:
      "Created the global rubber, tire, and polymer manufacturing industries. Without vulcanized pneumatic tires, the automotive, bicycle, and aviation revolutions would have been impossible.",
    funFact:
      "Goodyear spent over a decade in extreme poverty and debtors' prison experimenting with rubber compounds in his jail cell. Although the Goodyear Tire & Rubber Company was named in his honor in 1898, neither Goodyear nor his family had any financial connection to the company.",
  },
  tags: ["Rubber", "Polymers", "Materials Science", "Chemistry", "Vulcanization", "Goodyear"],
  stats: {
    totalClaims: 4,
    independentClaims: 1,
    patentWarYears: "1844–1852 (8 Years)",
    impactScore: 98,
  },
};
