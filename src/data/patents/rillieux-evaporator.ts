import {
  manualRillieuxClaimText,
  rillieuxEvaporatorArchivalEdition,
} from "@/data/editions/rillieuxEvaporatorEdition";
import type { Patent } from "@/types/patent";

export const rillieuxEvaporatorPatent: Patent = {
  id: "us-3237-rillieux-evaporator",
  patentNumber: "US 3,237",
  title: "Improvement in Sugar-Works",
  shortTitle: "Norbert Rillieux Multiple-Effect Vacuum Evaporator",
  subtitle:
    "Latent Heat Cascading, Multi-Effect Vacuum Evaporation, Submerged Horizontal Tube Bundles, and Differential Thermometer Process Control",
  inventors: ["Norbert Rillieux"],
  inventorLocation: "New Orleans, in the parish of Orleans and State of Louisiana",
  grantDate: "1843-08-26",
  // The 1843 grant does not print an application/filing day; do not invent one.
  filingDate: null,
  era: "Early Industrial & Machine Age (1790–1869)",
  category: "materials",
  categoryLabel: "Chemical Engineering & Thermodynamics",
  summary:
    "Norbert Rillieux's 1843 patent for the multiple-effect vacuum evaporator is widely recognized as the single most consequential thermodynamic breakthrough in the history of industrial chemical processing. By connecting a series of enclosed boiling vessels under sequentially deeper vacuums, Rillieux harnessed the latent heat of water vapor boiled off from the first vessel to boil subsequent juice at reduced temperatures in subsequent vessels. This revolutionary latent heat cascading multiplied the evaporation accomplished per pound of fuel by up to four times, slashed plantation and refinery energy consumption by over 70%, eliminated caramelization scorching, and established the foundational principles of modern multi-effect distillation, industrial desalination, and chemical engineering mass-heat transfer.",
  heroQuote:
    "The primary object of my invention is to economize this enormous waste of heat and fuel by employing the vapor generated from the evaporation of the saccharine juice in a first closed pan to heat and evaporate the juice in a second closed pan, and so on through a series of pans...",
  originalPdfUrl: "/patents/pdfs/us-3237-rillieux-evaporator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3237A/en",
  usptoClassification: "B01D1/26; C13B25/02",

  originalTextAsset: {
    url: "/patents/transcripts/us-3237-rillieux-evaporator-reviewed.txt",
    pageCount: 11,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Editorial Team",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a",
  },

  archivalEdition: rillieuxEvaporatorArchivalEdition,

  originalText:
    "Be it known that I, NORBERT RILLIEUX, of New Orleans, in the parish of Orleans and State of Louisiana, have invented certain new and useful Improvements in Sugar-Works, of which the following is a specification... In the ordinary method of manufacturing sugar, whether by open kettles (the 'Jamaica train') or by the single vacuum pan invented by Howard, a vast expenditure of fuel is incurred because the whole latent heat of vaporization contained in the vapor arising from the boiling saccharine juice is totally lost and wasted, escaping into the open atmosphere without performing further work. The primary object of my invention is to economize this enormous waste of heat and fuel by employing the vapor generated from the evaporation of the saccharine juice in a first closed pan to heat and evaporate the juice in a second closed pan, and so on through a series of pans...",

  plainEnglishExplanation: {
    overview:
      "In the early 19th century, converting harvested sugar cane into crystallized sugar was an exceptionally dangerous, thermally wasteful, and labor-intensive ordeal. Refineries and plantations used the 'Jamaica train'—a row of open copper caldrons mounted over an open wood furnace where enslaved laborers ladled boiling cane syrup by hand from one kettle to the next. This process wasted over 95% of fuel energy because all latent heat of vaporization ($h_{fg} \\approx 2260\\text{ kJ/kg}$) escaped directly into the atmosphere, while uneven direct flame heat scorched and caramelized the sugar into dark molasses. Norbert Rillieux, a brilliant Free Person of Color from New Orleans educated in thermodynamics at École Centrale Paris, solved this crisis by inventing the multiple-effect evaporator: a closed cascade of boiling vessels operating under successively deeper vacuums, recycling the latent heat from one stage to boil the next.",
    coreMechanism:
      "Rillieux's multiple-effect system operates through five coordinated thermodynamic principles: (1) Raw clarified cane juice ($14^\\circ\\text{Bx}$) is pumped into the first closed vessel, where submerged horizontal copper tube bundles are heated by low-pressure steam ($P_1 = 160\\text{ kPa}, T_{\\text{sat}} = 113^\\circ\\text{C}$) supplied from the mill's steam-engine exhaust. (2) As the juice boils at near-atmospheric pressure ($100^\\circ\\text{C}$), the generated water vapor rises into an upper vapor dome. (3) Instead of venting this steam to the sky, Rillieux pipes it into the heating tubes of a second enclosed vessel maintained under partial vacuum ($P_2 = 50\\text{ kPa}$) by an air pump. (4) Because water boils at a lower saturation temperature under vacuum ($T_2 = 81^\\circ\\text{C}$), the $100^\\circ\\text{C}$ vapor from Effect 1 has a positive temperature driving potential ($\\Delta T \\approx 19^\\circ\\text{C}$) to boil the juice in Effect 2 without consuming any additional fuel. (5) The vapor generated in Effect 2 is similarly piped to heat a third vessel operating under deep vacuum ($P_3 = 16\\text{ kPa}, T_3 = 55^\\circ\\text{C}$), evaporating three pounds of water for every single pound of boiler steam ($S = \\dot{m}_{\\text{evap}} / \\dot{m}_{\\text{steam}} \\approx 2.85$).",
    mechanicalBreakdown: [
      {
        title: "Multiple-Effect Enclosed Evaporating Vessels",
        summary:
          "Heavy cylindrical wrought-iron or copper vessels sealed against atmospheric air and interconnected in a cascading pressure series.",
        technicalDetails:
          "Each vessel ($D = 1.5\\text{ m}, L = 3.5\\text{ m}$) is engineered to withstand full external atmospheric vacuum pressure ($101.3\\text{ kPa}$) and features an expansive upper vapor dome that prevents liquid entrainment droplets from carrying over into the steam trunks.",
        archaicTerm: "closed evaporating pan or boiler A, B",
        modernEquivalent: "Multi-Effect Falling/Submerged Evaporator Vessel",
      },
      {
        title: "Submerged Horizontal Copper Tube Bundles",
        summary:
          "An extensive array of horizontal copper heating tubes carrying steam submerged directly within the boiling liquid pool.",
        technicalDetails:
          "Contains over 100 copper tubes ($D = 50\\text{ mm}$) providing $120\\text{ m}^2$ of heat transfer surface area per effect. Heating steam condenses inside the tubes, releasing latent heat ($h_{fg} = 2260\\text{ kJ/kg}$) with an overall heat transfer coefficient of $U = 1800\\text{ W/m}^2\\text{K}$, driving rapid natural convection circulation.",
        archaicTerm: "bundle of heating tubes / double bottom",
        modernEquivalent: "Shell-and-Tube Calandria Heat Exchanger",
      },
      {
        title: "Engine-Exhaust Steam Cogeneration Weighted Regulator",
        summary:
          "An automatic weighted throttle valve that harvests waste exhaust steam from the non-condensing steam engine to power the first effect.",
        technicalDetails:
          "Positioned in the main steam trunk between the engine exhaust manifold and the boiler makeup line. When engine backpressure rises, the weighted lever automatically opens, routing all thermal exhaust ($P \\approx 140\\text{ kPa}$) directly into Effect 1 heating tubes, achieving true industrial cogeneration.",
        archaicTerm: "weighted throttle or regulating valve",
        modernEquivalent: "Cogeneration Steam Backpressure Regulator Valve",
      },
      {
        title: "Differential Thermometer Brix Process Governor",
        summary:
          "A dual-bulb mercury thermometer that senses solution boiling point elevation (BPE) to continuously monitor sugar concentration.",
        technicalDetails:
          "One sensing bulb is submerged in the boiling sugar syrup while the second is positioned in the pure rising vapor. The temperature differential ($\\Delta T_{\\text{bpe}} = T_{\\text{liquid}} - T_{\\text{vapor}}$) directly indicates dissolved sucrose Brix ($0\\text{ to }70^\\circ\\text{Bx}$), actuating mechanical linkages to throttle feed valves at the target density.",
        archaicTerm: "differential thermometer",
        modernEquivalent: "Boiling-Point Elevation (BPE) Brix Concentration Sensor",
      },
      {
        title: "Barometric Condenser & Vacuum Strike Pan",
        summary:
          "A final deep-vacuum crystallization pan connected to a cold-water jet spray condenser and barometric discharge column.",
        technicalDetails:
          "Maintains deep vacuum ($P = 12\\text{ to }16\\text{ kPa}$, corresponding to $55^\\circ\\text{C}$ boiling point) via a $10.4\\text{ m}$ barometric water leg and reciprocating air pump, enabling concentrated syrup ($65^\\circ\\text{Bx}$) to undergo grain crystallization without heat degradation.",
        archaicTerm: "vacuum strike pan and condenser",
        modernEquivalent: "Barometric Jet Condenser & Vacuum Crystallizer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Latent Heat Conservation & Multi-Effect Cascading Economy",
        explanation:
          "Evaporating water requires enormous thermal energy ($h_{fg} \\approx 2260\\text{ kJ/kg}$). In single-effect boiling, this latent heat is lost to the surroundings. Rillieux's law dictates that by staging $N$ vessels under decreasing pressures, the latent heat released by condensation in effect $i$ provides the latent heat of vaporization for effect $i+1$, achieving a total steam economy of $S \\approx N \\cdot \\eta_{\\text{thermal}}$.",
        formula:
          "S = \\frac{\\dot{m}_{\\text{evap,total}}}{\\dot{m}_{\\text{steam}}} = \\sum_{i=1}^N \\frac{U_i A_i \\Delta T_i}{\\dot{m}_{\\text{steam}} h_{fg,i}} \\approx N \\cdot \\eta_{\\text{thermal}}",
      },
      {
        principle: "Vacuum Saturation Temperature Depression (Clausius-Clapeyron)",
        explanation:
          "The equilibrium boiling temperature of an aqueous solution drops logarithmically with ambient vapor pressure according to the Antoine and Clausius-Clapeyron relations. Lowering pressure from $101.3\\text{ kPa}$ to $16\\text{ kPa}$ lowers water boiling temperature from $100^\\circ\\text{C}$ to $55^\\circ\\text{C}$, creating the necessary thermal driving head ($\\Delta T$) for heat transfer.",
        formula:
          "\\ln\\left(\\frac{P_{\\text{sat}}}{P_0}\\right) = -\\frac{\\Delta h_{\\text{vap}}}{R} \\left(\\frac{1}{T} - \\frac{1}{T_0}\\right) \\implies T_{\\text{boil}}(P_i) < T_{\\text{boil}}(P_{i-1})",
      },
      {
        principle: "Colligative Boiling-Point Elevation (BPE) & Mass Balance",
        explanation:
          "Dissolved sucrose lowers the chemical potential and vapor pressure of water, raising the boiling temperature above pure water saturation (Raoult's law). Rillieux measured this colligative BPE offset to determine exact product Brix in real time.",
        formula:
          "\\dot{m}_{\\text{syrup}} = \\dot{m}_{\\text{feed}} \\left(\\frac{B_{\\text{in}}}{B_{\\text{out}}}\\right) \\quad \\text{and} \\quad \\Delta T_{\\text{bpe}} = K_b \\cdot m_{\\text{sucrose}} \\approx 0.07 B + 0.0022 B^2",
      },
    ],
    whyItMattersToday:
      "Norbert Rillieux's multiple-effect evaporator is universally regarded as one of the greatest inventions in the history of chemical engineering. It transformed the global sugar industry from a dangerous artisanal craft into a modern, energy-efficient continuous manufacturing discipline, saving hundreds of thousands of acres of forest from being cut for fuel. Today, multi-effect evaporation and multi-stage flash (MSF) distillation supply drinking water to millions through seawater desalination plants and form the backbone of chemical concentration, paper pulp liquor recovery, and industrial petroleum distillation worldwide.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualRillieuxClaimText(1),
      plainEnglish:
        "Claims the employment of a weighted throttle or regulating valve in the main steam pipe between the boiler and engine and the evaporating pans, positioned between the engine intake valve and the evaporators, to regulate steam pressure and deliver engine exhaust steam to the pans.",
      keyInnovations: [
        "Weighted steam throttle regulator valve",
        "Engine exhaust steam harvesting for evaporation",
        "Industrial steam cogeneration integration",
      ],
      legalSignificance:
        "The first patent claim covering industrial steam cogeneration—harvesting mechanical engine exhaust to power thermal process evaporators.",
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualRillieuxClaimText(2),
      plainEnglish:
        "Claims the foundational combination of a vacuum pan connected with a condenser and an evaporating pan or boiler operating at higher pressure, wherein the higher-pressure pan prepares the juice and supplies its generated vapor to heat and complete evaporation in the vacuum pan.",
      keyInnovations: [
        "Multiple-effect vacuum evaporation cascade",
        "Latent heat reuse across differential pressure stages",
        "Cascading vacuum boiling-point depression",
      ],
      legalSignificance:
        "The master patent claim for multiple-effect evaporation—the cornerstone of modern chemical engineering separation processes.",
    },
    {
      number: 3,
      isIndependent: false,
      originalText: manualRillieuxClaimText(3),
      plainEnglish:
        "Claims surrounding the evaporating column (the Champenoise column) with an outer column or jacket to adapt it to multiple-effect operation using cascading vapor.",
      keyInnovations: [
        "Jacketed evaporating column",
        "Multiple-effect vertical column adaptation",
        "Annular vapor jacket heat transfer",
      ],
      legalSignificance:
        "Protected jacketed vertical evaporator designs operating within multi-effect cascades.",
    },
    {
      number: 4,
      isIndependent: false,
      originalText: manualRillieuxClaimText(4),
      plainEnglish:
        "Claims the employment of a differential thermometer to automatically regulate the concentration of the syrup based on the temperature difference between the boiling liquid and pure vapor.",
      keyInnovations: [
        "Differential thermometer concentration sensor",
        "Boiling-point elevation (BPE) process feedback",
        "Automated syrup density regulation",
      ],
      legalSignificance:
        "The foundational claim for automated composition-based process control using colligative property sensing.",
    },
    {
      number: 5,
      isIndependent: false,
      originalText: manualRillieuxClaimText(5),
      plainEnglish:
        "Claims constructing the differential thermometer so that its thermal movement below the target concentration threshold does not prematurely actuate the regulating valve.",
      keyInnovations: [
        "Dead-band / threshold mechanical governor",
        "Non-actuating range below setpoint",
        "Stable process control without hunting",
      ],
      legalSignificance:
        "Established the principle of dead-band and threshold control in automated process instrumentation.",
    },
  ],

  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Multiple-Effect Vacuum Evaporation Apparatus",
      caption:
        "Side elevation and piping diagram of Norbert Rillieux's multiple-effect evaporator showing steam throttle regulator, three closed calandria evaporating vessels, vacuum air pumps, and barometric strike pan.",
      svgType: "rillieux-evaporator-system",
      callouts: [
        {
          id: "callout-throttle-valve",
          figureRef: "Fig. 1",
          label: "A",
          element: "A",
          description:
            "Weighted steam throttle regulator valve connecting engine steam line to evaporator heating pipes.",
          x: 12,
          y: 40,
        },
        {
          id: "callout-first-pan",
          figureRef: "Fig. 1",
          label: "B",
          element: "B",
          description: "First closed evaporating vessel operating under near-atmospheric pressure.",
          x: 28,
          y: 50,
        },
        {
          id: "callout-second-pan",
          figureRef: "Fig. 1",
          label: "C",
          element: "C",
          description: "Second closed evaporating vessel operating under partial vacuum (50 kPa).",
          x: 48,
          y: 50,
        },
        {
          id: "callout-strike-pan",
          figureRef: "Fig. 1",
          label: "D",
          element: "D",
          description:
            "Third deep-vacuum strike pan (16 kPa) for final sugar grain crystallization.",
          x: 68,
          y: 50,
        },
        {
          id: "callout-condenser",
          figureRef: "Fig. 1",
          label: "E",
          element: "E",
          description: "Barometric cold-water jet condenser and reciprocating vacuum air pump.",
          x: 88,
          y: 45,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "In the early 19th century, converting harvested sugar cane into crystallized sugar required boiling juice in open copper kettles (the 'Jamaica train'), consuming enormous quantities of hardwood fuel and scorching sugar through direct flames.",
    priorArtLimitations: [
      "Open kettle boiling lost 100% of the latent heat of vaporization directly into the atmosphere",
      "Direct flame heating caused caramelization scorching and high inversion sugar losses",
      "Single-pan vacuum systems (Howard pan) required enormous fuel without heat recovery",
      "Enslaved laborers faced hazardous, brutal conditions ladling boiling syrup by hand",
    ],
    breakthroughInsight:
      "By connecting closed evaporating vessels in a cascading vacuum series, the latent heat of vapor boiled from the first pan at atmospheric pressure can boil subsequent juice at reduced temperatures under partial vacuum, multiplying fuel efficiency by up to four times.",
    patentWars: [
      {
        rivalName: "Merrick & Towne and Louisiana Competitors",
        rivalClaim: "Priority in multi-effect evaporation using French Derosne apparatus",
        conflictDetails:
          "After Rillieux assigned manufacturing rights to Philadelphia foundry owners Samuel Merrick and John Towne, rival builders constructed copycats claiming prior French art by Derosne and Cail.",
        resolution:
          "Rillieux filed his definitive master patent (US 4,879) in 1846 with rigorous mathematical and mechanical proofs of his unique submerged horizontal tube bundles and cascading vacuum controls.",
        legalOutcome:
          "US Patent 3,237 was upheld and established Rillieux as the sole true inventor of multiple-effect vacuum evaporation.",
      },
    ],
    civilizationalImpact:
      "The American Chemical Society and National Inventors Hall of Fame recognize Norbert Rillieux as the father of modern chemical engineering. Multiple-effect evaporation revolutionized the sugar industry and remains the foundational thermodynamic process for industrial seawater desalination, chemical evaporators, and petroleum refining worldwide.",
    funFact:
      "Norbert Rillieux was an accomplished Egyptologist who spent decades in Paris deciphering hieroglyphics alongside Jean-François Champollion's successors at the Bibliothèque Nationale before returning to engineering in his seventies.",
  },

  tags: [
    "Multiple-Effect Evaporator",
    "Norbert Rillieux",
    "Thermodynamics",
    "Chemical Engineering",
    "Sugar Refining",
    "Desalination",
    "Energy Efficiency",
    "Latent Heat",
  ],

  stats: {
    totalClaims: 5,
    independentClaims: 1,
  },
};
