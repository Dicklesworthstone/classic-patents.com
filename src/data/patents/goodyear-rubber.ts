import type { Patent } from "@/types/patent";
import { goodyearRubberArchivalEdition } from "../editions/goodyearRubberEdition";

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
    "In this June 15, 1844 grant, Charles Goodyear claimed a rubber-fabric compound of India-rubber, sulphur, and white lead or related lead salts or oxides; cotton-batting laminates; and heat treatment. The specification gives 25:5:7 parts as its preferred India-rubber, sulphur, and white-lead mixture, permits 212°–350° Fahrenheit heat, and says the best effect approaches 270°.",
  heroQuote:
    "My principal improvement consists in the combining of sulphur and white lead with the india-rubber, and in the submitting of the compound thus formed to the action of heat at a regulated temperature.",
  originalPdfUrl: "/patents/pdfs/us-3633-goodyear-rubber.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3633A/en",
  usptoClassification:
    "Historical grant; modern Google Patents classifications include B32B and C08F8/34",
  originalTextAsset: {
    url: "/patents/transcripts/us-3633-goodyear-rubber.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SunnySpring)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7",
  },
  archivalEdition: goodyearRubberArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
CHARLES GOODYEAR, OF NEW YORK, N. Y.

IMPROVEMENT IN INDIA-RUBBER FABRICS.

Specification forming part of Letters Patent No. 3,633, dated June 15, 1844.

To all whom it may concern:
Be it known that I, CHARLES GOODYEAR, of the city of New York, in the State of New York, have invented certain new and useful Improvements in the Manner of Preparing Fabrics of Caoutchouc or India-Rubber; and I do hereby declare that the following is a full and exact description thereof.

My principal improvement consists in the combining of sulphur and white lead with the india-rubber, and in the submitting of the compound thus formed to the action of heat at a regulated temperature, by which combination and exposure to heat it will be so far altered in its qualities as not to become softened by the action of the solar ray or of artificial heat at a temperature below that to which it was submitted in its preparation—say to a heat of 270° of Fahrenheit's scale—nor will it be injuriously affected by exposure to cold. It will also resist the action of the expressed oils, and that likewise of spirits of turpentine, or of the other essential oils at common temperatures, which oils are its usual solvents.`,
  plainEnglishExplanation: {
    overview:
      "Goodyear's document has three linked moves. First, it specifies a compound of India-rubber, sulphur, and white lead. Second, it describes a fabric made by sandwiching cotton-wool between coats of that gum. Third, it exposes the material to heat. His stated aim is not a generic rubber improvement: it is resistance to solar or artificial heat below the preparation temperature, cold, and the oils that usually dissolved the gum.",
    coreMechanism:
      "The claimed manufacturing chain is: mix India-rubber with sulphur and white lead; form it as a sheet or coat it on cloth or leather; optionally put cotton-wool between gum layers; dry it; then heat it. The printed range is 212°F to 350°F, with the best effect said to approach 270°F. The source makes a process claim about the changed properties; it does not disclose a modern molecular mechanism, so later cross-linking terminology is editorial interpretation, not wording from the grant.",
    mechanicalBreakdown: [
      {
        title: "Sulfur Covalent Cross-Linking Bridges",
        summary: "Sulfur atoms forming covalent cross-links between parallel polyisoprene chains.",
        technicalDetails:
          "Disulfide and polysulfide bridges ($-S_x-$ where $x = 1\\text{ to }6$) connect the carbon backbones. The cross-link density determines hardness, transforming soft gum into flexible tire tread or hard ebonite.",
        archaicTerm: "Combining of sulfur with gum-elastic by heat",
        modernEquivalent: "Covalent polymer vulcanization network",
      },
      {
        title: "White Lead Inorganic Activator / Catalyst",
        summary: "Basic lead carbonate added to accelerate the sulfur cross-linking reaction.",
        technicalDetails:
          "Lead oxide acts as an inorganic activator and hydrogen sulfide ($H_2S$) acid scavenger, accelerating cross-linking reaction rates and preventing spongy gas porosity in the cured elastomer.",
        archaicTerm: "White lead / Carbonate of lead",
        modernEquivalent: "Vulcanization accelerator & acid scavenger",
      },
      {
        title: "Thermal Curing Steam Chamber",
        summary: "An oven heating the compounded rubber to 270°F–300°F (132°C–149°C).",
        technicalDetails:
          "Provides the thermal activation energy ($E_a \\approx 105\\text{ kJ/mol}$) required to break sulfur ring molecules ($S_8$) into reactive free radicals that cross-link the polymer chains.",
        archaicTerm: "Artificial heat in an oven or steam-chamber",
        modernEquivalent: "High-temperature vulcanization autoclave",
      },
      {
        title: "Cotton-Batting Interlayer Reinforcement",
        summary: "Layers of woven textile fabric sandwiched between rubber sheets.",
        technicalDetails:
          "Distributes tensile tearing stress across high-modulus cellulose fibers, preventing puncture propagation and providing dimensional stability for garments and hoses.",
        archaicTerm: "Cotton-batting interposed between layers of gum",
        modernEquivalent: "Elastomeric fabric ply reinforcement",
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
        principle: "Cross-Link Density & Shear Modulus",
        formula: "G = N k_B T = \\frac{\\rho R T}{M_c}",
        explanation:
          "The shear modulus G is directly proportional to absolute temperature T and cross-link density N (inversely proportional to average molecular weight between cross-links M_c).",
      },
      {
        principle: "Mooney-Rivlin Hyperelastic Strain Energy Density",
        formula:
          "W = C_{10}(I_1 - 3) + C_{01}(I_2 - 3), \\quad I_1 = \\lambda_1^2 + \\lambda_2^2 + \\lambda_3^2",
        explanation:
          "Vulcanized elastomers undergo non-linear large-strain deformation, where strain energy density $W$ depends on the first and second strain invariants ($I_1, I_2$).",
      },
      {
        principle: "Sulfur Radical Ring Cleavage Kinetics",
        formula:
          "k = A \\exp\\left(-\\frac{E_a}{R T}\\right), \\quad E_a \\approx 105\\text{ kJ/mol}",
        explanation:
          "At room temperature, the octasulfur ring ($S_8$) is chemically inert. Heating above 130°C provides the activation energy ($E_a$) to cleave the sulfur rings into highly reactive biradicals that attack polyisoprene double bonds.",
      },
      {
        principle: "Glass Transition Temperature ($T_g$) Stabilization",
        formula:
          "T_g = T_{g0} + \\frac{K \\cdot N_{crosslink}}{1 + N_{crosslink}}, \\quad T_g \\approx -70^\\circ\\text{C}",
        explanation:
          "Vulcanization maintains a low glass transition temperature while eliminating viscous flow, ensuring flexible elasticity across an operating window of -40°C to +120°C.",
      },
    ],
    whyItMattersToday:
      "Sulfur vulcanization remains the foundational chemical process of the global automotive and aerospace industries. Over two billion pneumatic tires produced annually worldwide rely on sulfur cross-linking of natural rubber and synthetic styrene-butadiene rubber (SBR). Without Goodyear's vulcanization chemistry, modern automobiles, commercial aircraft landing gear, heavy machinery belts, and medical seals could not exist.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combining of the said gum with sulphur and with white lead, so as to form a triple compound, either in the proportions herein named or in any other within such limits as will produce a like result; and I will here remark that although I have obtained the best results from the carbonate of lead, other salts of lead or the oxides of that metal may be substituted therefor, and will produce a good effect. I therefore under this head claim the employment of either of the oxides or salts of lead in the place of the white lead in the above-named compound.",
      plainEnglish:
        "The foundational composition-of-matter claim covering the three-part formulation: natural rubber gum, sulfur, and white lead (or metallic oxide catalysts) in any proportions that achieve thermal cross-linking.",
      keyInnovations: [
        "Three-part vulcanization composition",
        "Sulfur cross-linking curing agent",
        "Lead oxide acceleration and stabilization",
      ],
      legalSignificance:
        "Claim 1 is the composition claim: it reaches the three-part gum, sulphur, and lead compound, while expressly extending the lead component beyond carbonate of lead.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The formation of a fabric of the india-rubber by interposing layers of cotton-batting between those of the gum, in the manner and for the purpose above described.",
      plainEnglish:
        "A composite elastomeric fabric formed by interposing layers of cotton batting or textile matrix between vulcanized rubber plies to make thin, flexible, high-tensile waterproof cloth.",
      keyInnovations: [
        "Layered rubber-textile composite",
        "Cotton-batting matrix reinforcement",
        "Thin flexible waterproof sheeting",
      ],
      legalSignificance:
        "Claim 2 is limited to the cotton-batting interlayer fabric described in the specification; it does not claim every rubber-coated textile.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1, 2],
      originalText:
        "In combination with the foregoing, the process of exposing the india-rubber fabric to the action of a high degree of heat, such as is herein specified, by means of which my improved compound is effectually changed in its properties so as to protect it from decomposition or deterioration by the action of those agents which have heretofore been found to produce that effect upon india-rubber goods.",
      plainEnglish:
        "With the preceding compound and fabric, this claim adds the specified high-heat exposure. The specification permits 212°F to 350°F, says the best effect approaches 270°F, and warns that exposure above 270°F must be brief.",
      keyInnovations: [
        "High-temperature thermal curing process",
        "Permanent thermoset cross-linking transformation",
        "Weather and solvent resistance",
      ],
      legalSignificance:
        "Claim 3 makes the heat-treatment step part of the claimed combination, tied to the patent's stated protection against deterioration of India-rubber goods.",
    },
  ],
  // The complete two-page grant has no drawing sheet or printed figure reference.
  // Modern educational simulations are not represented as archival drawings.
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification identifies the practical failure directly: ordinary India-rubber softened under solar or artificial heat, was injured by cold, and was dissolved by expressed oils, spirits of turpentine, and other essential oils.",
    priorArtLimitations: [
      "The source says that the expressed oils, spirits of turpentine, and other essential oils at common temperatures were the gum's usual solvents.",
      "Rubber spread on firmer cloth or leather could peel away under moderate force because the gum released the holding fiber.",
      "During high-heat treatment, the compound could soften enough that it required its supporting cloth and could not support its own weight.",
    ],
    breakthroughInsight:
      "Goodyear's stated move is a compound of India-rubber, sulphur, and white lead exposed to regulated heat. His preferred recipe is 25 parts India-rubber, 5 sulphur, and 7 white lead; the claimed method also uses cotton-wool interlayers and an oven or heated cylinder.",
    patentWars: [],
    civilizationalImpact:
      "The grant documents a reproducible approach to compounded, heat-treated India-rubber fabric: a formulation, fabrication routes, a laminate construction, a temperature range, and three claims. Those concrete process details are the historically useful record preserved here.",
  },
  tags: [
    "Charles Goodyear",
    "Vulcanization",
    "Rubber",
    "Polymers",
    "Materials Science",
    "Chemical Engineering",
    "19th Century",
    "Elastomers",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 2,
  },
};
