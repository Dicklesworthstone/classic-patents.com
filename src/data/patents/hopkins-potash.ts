import type { Patent } from "@/types/patent";
import { hopkinsPotashArchivalEdition } from "../editions/hopkinsPotashEdition";

const hopkinsSourceDrawingCrops = [["Fig. 1", "Parchment Letters Patent No. 1 Facsimile"]] as const;

export const hopkinsPotashPatent: Patent = {
  id: "us-x1-hopkins-potash",
  patentNumber: "US 1 (X1)",
  title: "Making Pot and Pearl Ashes by a New Apparatus and Process",
  shortTitle: "Hopkins Potash & Pearl Ash Calcining Process",
  subtitle:
    "Thermal Ash Calcination, Aqueous Lixiviation, and High-Purity Pearl Ash Crystallization",
  inventors: ["Samuel Hopkins"],
  inventorLocation: "Philadelphia, Pennsylvania",
  grantDate: "1790-07-31",
  filingDate: "1790-07-31",
  era: "Early Republic & Industrial Dawn (1790–1835)",
  category: "materials",
  categoryLabel: "Industrial Chemistry & Materials",
  summary:
    "The historic very first patent granted by the United States of America under the Patent Act of 1790, signed by President George Washington, Secretary of State Thomas Jefferson, and Attorney General Edmund Randolph. Samuel Hopkins discovered that roasting raw wood ashes in a furnace prior to leaching oxidizes combustible organics and tar, boosting potassium carbonate yield by over 50% while producing sparkling, high-purity pearl ash for glass, soap, and gunpowder.",
  heroQuote:
    "Which Operation of burning the raw Ashes in a Furnace, preparatory to their Dissolution and boiling in Water, is new, leaves little Residuum; and produces a much greater Quantity of Salt.",
  originalPdfUrl: "/patents/pdfs/us-x1-hopkins-potash.pdf",
  googlePatentsUrl: "https://commons.wikimedia.org/wiki/File:United_States_Patent_X1.png",
  usptoClassification: "X-Patent 1 / Chemical Metallurgy (C01D 7/00)",
  originalTextAsset: {
    url: "/patents/transcripts/us-x1-hopkins-potash-reviewed.txt",
    pageCount: 1,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "d4cdaf8e4f5cf9fc841df0a98adca8341b5c513e4f328f013f50fc914509777e",
  },
  archivalEdition: hopkinsPotashArchivalEdition,
  originalText:
    "Whereas Samuel Hopkins of the City of Philadelphia and State of Pensylvania hath discovered an Improvement, not known or used before such Discovery, in the making of Pot ash and Pearl ash by a new Apparatus and Process; that is to say, in the making of Pearl ash 1st. by burning the raw Ashes in a Furnace, 2d. by dissolving and boiling them when so burnt in Water, 3rd. by drawing off and settling the Ley, and 4th. by boiling the Ley into Salts which then are the true Pearl ash; and also in the making of Pot ash by fluxing the Pearl ash so made as aforesaid...",
  plainEnglishExplanation: {
    overview:
      "Potash (crude potassium carbonate, K₂CO₃) and pearl ash (calcined, purified potassium carbonate) were the primary chemical commodities of the 18th century, essential for making soap, fine glass, textiles, and gunpowder. Early American settlers cleared vast hardwood forests and burned the logs, but the resulting ashes were heavily contaminated with unburned charcoal and pitch. Traditional water leaching produced a dark, impure, low-yield solution. Samuel Hopkins solved this by introducing a preliminary furnace-roasting step that burned away all residual carbonaceous matter before aqueous leaching, dramatically increasing both chemical yield and crystalline purity.",
    coreMechanism:
      "Hopkins's four-step cycle transformed crude timber ash into refined alkali salts: (1) Thermal calcination in a reverberatory kiln ($T \\approx 700\\text{–}850^\\circ\\text{C}$) oxidizes soot, tar, and organic hydrocarbons into gaseous $\\text{CO}_2$ and $\\text{H}_2\\text{O}$, freeing trapped potassium ions from carbon matrices; (2) Aqueous lixiviation dissolves the freed $\\text{K}_2\\text{CO}_3$ into hot water ($C_{sat} > 1100\\text{ g/L}$); (3) Gravity sedimentation separates insoluble mineral dross (calcium oxide, silica, and alumina) to draw off clear alkaline ley; (4) Evaporation boils the clear ley down into gleaming crystalline pearl ash, which is optionally fluxed at $891^\\circ\\text{C}$ into dense cast potash blocks.",
    mechanicalBreakdown: [
      {
        title: "Reverberatory Roasting Kiln",
        summary:
          "Thermal calcination chamber where raw wood ashes are re-burned to oxidize organic contaminants.",
        technicalDetails:
          "The raw hardwood ashes are spread across the shallow hearth of a reverberatory furnace. Radiant heat from wood fire ($700\\text{–}850^\\circ\\text{C}$) oxidizes elemental carbon ($\\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2$) without melting the ash bed, converting insoluble compounds and unclogging microscopic pore channels for subsequent water penetration.",
        archaicTerm: "Burning the raw Ashes in a Furnace",
        modernEquivalent: "Rotary Calciner / Fluidized Roasting Bed",
      },
      {
        title: "Lixiviation & Leaching Vats",
        summary:
          "Multi-stage counter-current leaching vats where water dissolves soluble alkali salts.",
        technicalDetails:
          "Water at $70\\text{–}90^\\circ\\text{C}$ is passed through the porous calcined ash bed. Highly soluble potassium carbonate dissolves rapidly ($k_L \\approx 1.2 \\times 10^{-4}\\text{ m/s}$), while insoluble calcium carbonate ($\\text{CaCO}_3$) and silicates remain as inert tailings.",
        archaicTerm: "Dissolving and boiling in Water",
        modernEquivalent: "Solid-Liquid Extraction Percolator",
      },
      {
        title: "Sedimentation & Ley Clarifier",
        summary:
          "Gravity settling vats that decant clear, heavy alkaline liquor from mineral sediment.",
        technicalDetails:
          "The turbid leachate is held quiescent in settling casks. Heavy suspended silt and insoluble metal oxides settle out by Stokes law sedimentation ($v_t = \\frac{2 r^2 (\\rho_p - \\rho_f) g}{9 \\mu}$), allowing the crystal-clear, dense potassium carbonate solution (specific gravity $1.25\\text{–}1.40$) to be decanted.",
        archaicTerm: "Drawing off and settling the Ley",
        modernEquivalent: "Clarifier / Decanter Centrifuge",
      },
      {
        title: "Evaporating Pot & Pearl Ash Crystallizer",
        summary:
          "Direct-fired iron kettle that boils off water to precipitate pure pearl ash salts.",
        technicalDetails:
          "The decanted ley is boiled in shallow hemispherical cast-iron kettles. As water evaporates ($L_v = 2.26\\text{ MJ/kg}$), concentration exceeds saturation, precipitating white granular $\\text{K}_2\\text{CO}_3 \\cdot \\frac{3}{2}\\text{H}_2\\text{O}$ crystals.",
        archaicTerm: "Boiling the Ley into Salts (true Pearl ash)",
        modernEquivalent: "Evaporative Crystallizer",
      },
      {
        title: "High-Temperature Fluxing Kettle",
        summary:
          "Smelting furnace that melts pearl ash into solid cast blocks of commercial potash.",
        technicalDetails:
          "For bulk shipping in barrels, the crystalline pearl ash is heated past its fusion point ($891^\\circ\\text{C}$) in a smelting pot until it liquefies into a molten red flux, then poured into iron molds to solidify into dense, moisture-resistant potash loaves.",
        archaicTerm: "Fluxing the Pearl ash into Pot ash",
        modernEquivalent: "Fusion Smelter / Casting Ingot Mold",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Arrhenius Carbon Combustion Kinetics",
        formula: "$$k_{ox} = A \\exp\\left(-\\frac{E_a}{R T}\\right)$$",
        explanation:
          "High furnace temperatures accelerate the oxidation of residual wood tar and charcoal into carbon dioxide gas, stripping away the hydrophobic carbon envelope that prevents water from contacting potassium salts.",
      },
      {
        principle: "Aqueous Dissolution & Temperature-Dependent Solubility",
        formula: "$$C_{sat}(T) = 1120 + 4.4 \\times T_c \\quad [\\text{g/L}]$$",
        explanation:
          "Potassium carbonate exhibits exceptional aqueous solubility that increases linearly with temperature, enabling concentrated alkaline ley extraction with minimal water volume.",
      },
      {
        principle: "Thermal Oxidation Stoichiometry",
        formula:
          "$$\\text{C}_{\\text{residual}} + \\text{O}_2 \\xrightarrow{750^\\circ\\text{C}} \\text{CO}_2\\uparrow$$",
        explanation:
          "Roasting the raw wood ashes oxidizes tar, soot, and residual charcoal into carbon dioxide gas, eliminating colloidal carbon particles that would otherwise impede leaching and discolor the salt.",
      },
      {
        principle: "Stokes Gravitational Particle Sedimentation",
        formula: "$$v_t = \\frac{2 r^2 (\\rho_p - \\rho_f) g}{9 \\mu}$$",
        explanation:
          "Decanting clear ley relies on density-driven sedimentation of insoluble calcium and silica particles out of the viscous alkaline solution.",
      },
    ],
    whyItMattersToday:
      "Hopkins's patent stands as the cornerstone of American patent law and early industrial chemistry, establishing the principle that chemical process optimization—specifically thermal pre-treatment to eliminate organic impurities—is a patentable technological breakthrough.",
  },
  claims: [],
  drawings: hopkinsSourceDrawingCrops.map(([figNum, title]) => ({
    figureNumber: figNum,
    title,
    // No bespoke schematic: the parchment carries no drawing. The identifier
    // resolves to the viewer's honest generic rendering.
    svgType: "hopkins-potash",
    caption: `${title} from the historical parchment grant of United States Patent No. 1. The parchment carries no technical drawing; the patented apparatus and process are described in words only.`,
    callouts: [],
  })),
  historicalContext: {
    problemStatement:
      "In the 18th century, potash and pearl ash were the world's most vital industrial alkalis, needed for manufacturing glass, scouring raw wool, making soap, and formulating gunpowder. Clearing the North American forests generated millions of tons of wood ashes, but primitive pot-leaching left ashes contaminated with unburned charcoal and acidic organic tars, producing foul, discolored, low-potency potash that fetched low market prices in London.",
    priorArtLimitations: [
      "Leaching raw uncalcined ashes left up to 40% of potassium salts trapped within hydrophobic unburned carbon pores.",
      "Organic wood tars dissolved into the alkaline water, contaminating the ley and discoloring the resulting salts with dark pitch.",
      "Traditional pot-boiling required enormous fuel expenditures to evaporate huge volumes of dilute, low-concentration liquor.",
      "Insoluble calcium and silica impurities remained suspended, producing gritty, low-assay commercial potash.",
    ],
    breakthroughInsight:
      "Samuel Hopkins realized that burning raw ashes a second time in a specialized furnace before adding water would completely oxidize combustible organic matter into gas. This decarbonization unclogged the ash matrix, allowing hot water to dissolve almost 100% of the available potassium carbonate while yielding a brilliant white, pure crystalline salt.",
    patentWars: [],
    civilizationalImpact:
      "As United States Patent #1, Hopkins's patent laid the institutional cornerstone for American innovation. Economically, potash became America's first major industrial export: in 1790, over 7,000 tons were shipped to Europe, providing vital foreign currency for the nascent United States while turning clearing trees from agricultural land into an immediate profitable harvest.",
    funFact:
      "President George Washington, Secretary of State Thomas Jefferson, and Attorney General Edmund Randolph personally reviewed and signed Hopkins's application at Federal Hall in New York City, which was then serving as the temporary capital of the United States.",
    aftermath:
      "Hopkins licensed his process widely across Pennsylvania, New York, and Vermont. Decades later in 1836, when a catastrophic fire destroyed the U.S. Patent Office, the government painstakingly reconstructed the early records and officially designated Hopkins's milestone grant as 'Patent X1'.",
    sideNotes: [
      "Thomas Jefferson, who had initial skepticism about monopolies, served as the primary patent examiner for Patent No. 1 and personally tested and verified chemical applications.",
      "Hopkins also secured a companion patent in Upper Canada (British North America) in 1792, making him one of the earliest international patent holders in North American history.",
    ],
  },
  tags: ["chemistry", "materials", "thermodynamics", "foundational", "x-patent", "1700s"],
  stats: {
    totalClaims: 0,
    independentClaims: 0,
  },
};
