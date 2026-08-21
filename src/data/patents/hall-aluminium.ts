import type { Patent } from "@/types/patent";
import { manualHallClaimText } from "../editions/hallAluminiumEdition";

const _hallSourceDrawingCrops = [
  ["Fig. 1", "Sectional elevation of a form of apparatus"],
  ["Fig. 2", "View partly in elevation and partly in section of a modified apparatus"],
] as const;

const hallFigureCallouts: Record<
  string,
  Array<{
    id: string;
    figureRef: string;
    label: string;
    element: string;
    description: string;
    x: number;
    y: number;
  }>
> = {
  "Fig. 1": [
    {
      id: "hall-crucible-a",
      figureRef: "Fig. 1",
      label: "Metal Crucible or Melting-Pot A",
      element: "A",
      description: "The iron or steel crucible or melting-pot that holds the fused materials.",
      x: 52,
      y: 58,
    },
    {
      id: "hall-furnace-b",
      figureRef: "Fig. 1",
      label: "Furnace B",
      element: "B",
      description:
        "The suitable furnace surrounding the crucible and supplying heat to fuse the charge.",
      x: 19,
      y: 69,
    },
    {
      id: "hall-positive-electrode-c",
      figureRef: "Fig. 1",
      label: "Positive Electrode C",
      element: "C",
      description:
        "The positive electrode immersed in the fused solution, which may be carbon, copper, or platinum.",
      x: 48,
      y: 32,
    },
    {
      id: "hall-negative-electrode-d",
      figureRef: "Fig. 1",
      label: "Negative Electrode D",
      element: "D",
      description:
        "The negative electrode at which aluminium is reduced; Hall specifies carbon when pure aluminium is desired.",
      x: 57,
      y: 33,
    },
    {
      id: "hall-carbon-lining-aprime",
      figureRef: "Fig. 1",
      label: "Carbon Lining A-prime",
      element: "A′",
      description:
        "The carbon lining protecting the metal pot from aluminium and available as the negative electrode in Fig. 2.",
      x: 28,
      y: 59,
    },
  ],
  "Fig. 2": [
    {
      id: "hall-plan-pot",
      figureRef: "Fig. 2",
      label: "Carbon-Lined Pot A and A-prime",
      element: "A",
      description:
        "The modified apparatus uses the carbon lining A-prime as the negative electrode in the metal pot A.",
      x: 40,
      y: 48,
    },
    {
      id: "hall-plan-negative-connection",
      figureRef: "Fig. 2",
      label: "Negative Generator Conductor N-prime",
      element: "N′",
      description:
        "The conductor from the negative pole of the electric generator connected to the carbon lining.",
      x: 16,
      y: 34,
    },
  ],
};

export const hallAluminiumPatent: Patent = {
  id: "us-400766-hall-aluminium",
  patentNumber: "US 400,766",
  title: "Process of Reducing Aluminium by Electrolysis",
  shortTitle: "Hall-Héroult Aluminium Electrolytic Smelting Process",
  subtitle:
    "Molten Cryolite Solvent Bath, Alumina Dissolution, and Continuous Carbon-Anode Electrodeposition",
  inventors: ["Charles M. Hall"],
  inventorLocation: "Oberlin, Ohio",
  grantDate: "1889-04-02",
  filingDate: "1886-07-09",
  era: "Electrification & Early Modern (1870–1920)",
  category: "materials",
  categoryLabel: "Materials, Metallurgy & Chemical Engineering",
  summary:
    "The landmark foundational patent that transformed aluminium from a rare precious metal costlier than silver into the universal structural material of the modern world. Charles Martin Hall discovered that refractory alumina (Al₂O₃, native melting point 2072°C) dissolves readily in molten cryolite (Na₃AlF₆) at ~950°C. Passing a direct electric current through this fused solution electrolytically decomposes the alumina, causing dense liquid aluminium to collect at the cathode bottom while oxygen oxidizes the carbon anodes into CO₂. Hall's continuous solvent process reduced the price of aluminium by 99%, created ALCOA, and laid the metallurgical foundation for 20th-century aviation, high-voltage electrical grids, and modern architecture.",
  heroQuote:
    "The invention described herein relates to the reduction of aluminium from its oxide by dissolving such oxide in a bath containing a fused fluoride salt of aluminium and then reducing the aluminium by passing an electric current through the bath.",
  originalPdfUrl: "/patents/pdfs/us-400766-hall-aluminium.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US400766A/en",
  usptoClassification: "C25C 3/06 (Electrolytic production of aluminium)",
  originalTextAsset: {
    url: "/patents/transcripts/us-400766-hall-aluminium-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6 Luna)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791",
  },
  // Withheld from the served source face until the versioned Fig. 1 and Fig. 2
  // crops are generated and independently viewed. The claim text remains
  // dynamically sourced from the candidate edition below.
  archivalEdition: undefined,
  originalText:
    "To all whom it may concern:\nBe it known that I, CHARLES M. HALL, a citizen of the United States, residing at Oberlin, in the county of Lorain and State of Ohio, have invented certain new and useful Improvements in the Process of Reducing Aluminium by Electrolysis; and I do hereby declare the following to be a full, clear, and exact description of the invention, such as will enable others skilled in the art to which it appertains to make and use the same.\n\nThe invention described herein relates to the reduction of aluminium from its oxide by dissolving such oxide in a bath containing a fused fluoride salt of aluminium and then reducing the aluminium by passing an electric current through the bath; and in general terms the invention consists in the electrolysis of a solution of alumina in a fused fluoride salt of aluminium, substantially as hereinafter more fully described and claimed.",
  plainEnglishExplanation: {
    overview:
      "Throughout the 19th century, aluminium was an exotic laboratory curiosity and luxury metal priced higher than silver ($18 per pound). While aluminium is the most abundant metallic element in the Earth's crust (comprising ~8% of the crust), it was locked in extraordinarily stable oxide chemical bonds in bauxite ($Al_2O_3$). Direct thermal smelting with carbon was impossible because aluminium reduces at temperatures above the boiling point of the metal, and direct electrical melting required an unachievable 2072°C. The only known method—the Deville chemical process—consumed expensive metallic sodium to displace aluminium from molten double chloride salts. In February 1886, 22-year-old Oberlin College graduate Charles Martin Hall discovered the master electrochemical solution in his family woodshed: molten cryolite ($Na_3AlF_6$) at 950°C acts as a non-reactive liquid solvent that readily dissolves solid alumina powder. Passing direct current through this molten bath selectively decomposes the dissolved alumina into liquid aluminium metal and oxygen without consuming the cryolite solvent.",
    coreMechanism:
      "The smelting cell operates at ~950°C–960°C. Solid cryolite ($Na_3AlF_6$) and aluminium fluoride ($AlF_3$) are fused into a molten ionic liquid electrolyte ($D$) inside a carbon-lined steel pot ($A, B$). Fine alumina powder ($Al_2O_3$) is fed onto the bath surface, where it rapidly dissolves to form complex aluminofluoride oxy-ions (such as $[Al_2OF_6]^{2-}$). Direct current from an electric dynamo passes from suspended consumable carbon anodes ($C$) through the electrolyte to the carbon cathode lining ($B$). At the cathode bottom, aluminium ions undergo electrochemical reduction ($Al^{3+} + 3e^- \\rightarrow Al_{(l)}$). Because molten metallic aluminium has a density of $2.30\\text{ g/cm}^3$ at 950°C while the molten cryolite bath has a density of $2.10\\text{ g/cm}^3$, the reduced aluminium sinks by gravity to form a clean molten metal pool ($E$) protected from atmospheric re-oxidation. At the carbon anodes, oxygen ions undergo electrochemical oxidation, reacting with the hot carbon to evolve carbon dioxide gas ($2O^{2-} + C_{(s)} \\rightarrow CO_{2(g)} + 4e^-$). The cryolite solvent is completely preserved, allowing continuous operation for months simply by adding fresh alumina powder and periodically siphoning out pure liquid aluminium.",
    mechanicalBreakdown: [
      {
        title: "Molten Cryolite Inorganic Solvent Bath",
        summary:
          "A fused high-temperature electrolyte bath of sodium hexafluoroaluminate ($Na_3AlF_6$) dissolving solid alumina at 950°C.",
        technicalDetails:
          "Native alumina ($Al_2O_3$) melts at 2072°C—an insurmountable thermal and electrical barrier in 1886. Cryolite melts at 1010°C, and adding excess $AlF_3$ and $CaF_2$ forms a eutectic bath melting at ~950°C with high ionic conductivity ($~2.2\\text{ S/cm}$) that dissolves up to 10 wt% $Al_2O_3$ without decomposing at the 2.1 V–4.5 V operating window.",
        archaicTerm: "fused fluoride salt of aluminium and sodium",
        modernEquivalent: "Molten cryolite-based electrolyte solvent (Na₃AlF₆ + AlF₃ + CaF₂)",
      },
      {
        title: "Carbon-Lined Reduction Crucible (Cathode)",
        summary:
          "A heavy steel pot lined with compacted anthracite and pitch acting as the chemical containment shell and negative electrode.",
        technicalDetails:
          "The carbon lining ($B$) resists chemical corrosion by molten fluorides and serves as the cathode terminal. Liquid aluminium electrodeposits directly upon the carbon surface and coalesces into a continuous pool ($E$) that conducts cathodic current to the bottom collector bars.",
        archaicTerm: "crucible or pot lined with carbon",
        modernEquivalent: "Carbon-lined electrolytic reduction pot cathode",
      },
      {
        title: "Consumable Carbon Anode Assembly",
        summary:
          "Dense pre-baked carbon blocks suspended into the molten bath, connected to the positive electrical generator bus.",
        technicalDetails:
          "Anode oxidation evolves oxygen that immediately combusts the carbon at 950°C to form $CO_2$ ($C + 2O^{2-} \\rightarrow CO_2 + 4e^-$). This exothermic carbon consumption lowers the theoretical decomposition voltage from 2.21 V (for inert anodes) down to 1.18 V ($E^\\circ = -\\Delta G / zF$), drastically reducing electric power requirements.",
        archaicTerm: "electrodes of carbon connected to the positive pole",
        modernEquivalent: "Prebaked / Söderberg consumable carbon anodes",
      },
      {
        title: "Density-Stratified Molten Metal Pool",
        summary:
          "Gravity-separated liquid aluminium layer collecting at the bottom of the cell beneath the protective electrolyte.",
        technicalDetails:
          "At 950°C, molten aluminium has a density of $2.30\\text{ g/cm}^3$, while the cryolite bath has a density of $2.10\\text{ g/cm}^3$. The positive buoyancy difference ($\\Delta \\rho = 0.20\\text{ g/cm}^3$) causes the metal to settle rapidly beneath the salt, shielding it from air oxidation and allowing clean tapping.",
        archaicTerm: "pool of molten metal at the bottom of the pot",
        modernEquivalent: "Submerged liquid aluminium metal pad",
      },
      {
        title: "Continuous Alumina Replenishment & Joule Heating",
        summary:
          "Continuous addition of refined alumina powder to maintain electrolytic equilibrium without interrupting electrical current.",
        technicalDetails:
          "Internal resistance of the cryolite electrolyte ($R_{\\text{bath}}$) provides sufficient Ohmic Joule heating ($P = I^2 R_{\\text{bath}}$) to keep the entire bath molten at 960°C without requiring external furnace burners once electrolysis commences.",
        archaicTerm: "adding alumina as rapidly as it is consumed",
        modernEquivalent:
          "Continuous point-feeder alumina replenishment and autothermal Joule balance",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Faraday's Laws of Electrolysis",
        formula: "m = \\frac{I \\cdot t \\cdot M}{z \\cdot F} \\cdot \\eta_{\\text{current}}",
        explanation:
          "The mass of aluminium deposited at the cathode ($m$) is directly proportional to electrical current ($I$), time ($t$), and the molar mass of aluminium ($M = 26.98\\text{ g/mol}$), inversely proportional to the valence change ($z = 3$) and Faraday's constant ($F = 96,485\\text{ C/mol}$), scaled by current efficiency ($\\eta \\approx 85\\text{--}95\\%$) which yields approximately 0.335 grams of aluminium per ampere-hour.",
      },
      {
        principle: "Thermodynamic Decomposition Potential & Gibbs Free Energy",
        formula:
          "E_{\\text{cell}}^\\circ = -\\frac{\\Delta G^\\circ}{z F} = -\\frac{\\Delta H^\\circ - T\\Delta S^\\circ}{z F}",
        explanation:
          "Electrochemical decomposition of alumina with carbon anode consumption ($2Al_2O_3 + 3C \\rightarrow 4Al + 3CO_2$) has a standard reaction Gibbs free energy of $\\Delta G^\\circ \\approx 1285\\text{ kJ/mol}$ at 960°C, corresponding to a reversible cell potential of $E^\\circ = 1.18\\text{ V}$. Overpotentials and electrolyte resistance raise actual cell operating voltage to 4.0–4.5 V.",
      },
      {
        principle: "Eutectic Phase Equilibrium & Molten Salt Solubility",
        formula:
          "X_{Al_2O_3}^{\\text{sat}} = f(T_{\\text{bath}}, \\text{CR}) \\approx 8\\text{--}10\\text{ wt}\\%",
        explanation:
          "Cryolite ($Na_3AlF_6$) and alumina ($Al_2O_3$) form a binary eutectic system that lowers the liquidus temperature from 2072°C (pure alumina) and 1010°C (pure cryolite) down to ~960°C at 10 wt% alumina concentration, creating an accessible liquid processing window.",
      },
      {
        principle: "Liquid-Liquid Buoyancy Density Stratification",
        formula:
          "\\Delta \\rho = \\rho_{Al(l)} - \\rho_{\\text{bath}(l)} = 2.30 - 2.10 = +0.20\\text{ g/cm}^3 > 0",
        explanation:
          "Because liquid aluminium is denser than the molten cryolite-alumina electrolyte, the metal pad sinks to the bottom cathode, forming an electrical contact layer and preventing re-oxidation by anode gases.",
      },
    ],
    whyItMattersToday:
      "Hall's 1889 patent is the single technological foundation upon which all modern aluminium production rests. Every airplane, lightweight automobile chassis, high-voltage transmission line, architectural skyscraper facade, beverage can, and aerospace rocket frame produced today is smelted using the Hall-Héroult molten-cryolite electrolytic process.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualHallClaimText(1),
      plainEnglish:
        "Claim 1 defines the broad foundational chemical process: dissolving solid alumina ($Al_2O_3$) in a fused bath of aluminium fluoride and a more electro-positive fluoride (such as sodium, potassium, calcium, or lithium), and passing an electric current to selectively reduce aluminium without decomposing the fluoride solvent.",
      keyInnovations: [
        "Inorganic molten fluoride solvent for refractory metal oxides",
        "Selective electrodeposition of aluminium without solvent breakdown",
        "Universal alkali/alkaline-earth metal fluoride electrolyte formulation",
      ],
      legalSignificance:
        "The master genus claim that legally dominated all molten-fluoride aluminium electrolysis in the United States, upholding Hall's priority in federal courts against chemical and electrolytic competitors.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualHallClaimText(2),
      plainEnglish:
        "Claim 2 specifies the optimal commercial species: dissolving alumina in a fused bath composed specifically of aluminium fluoride and sodium fluoride (molten cryolite, $Na_3AlF_6$) and passing direct electric current through the fused mixture to produce aluminium.",
      keyInnovations: [
        "Molten cryolite ($Na_3AlF_6$) specific solvent composition",
        "Eutectic melting point suppression to ~950°C",
        "Optimal electrical conductivity and density separation",
      ],
      legalSignificance:
        "The sodium-fluoride species claim narrows the bath composition used in Hall's preferred embodiment while retaining the carbonaceous-anode operating step.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualHallClaimText(3),
      plainEnglish:
        "Claim 3 covers the lithium-modified embodiment: alumina is dissolved in a fused bath containing aluminium, sodium, and lithium fluorides, and current is passed through that fused mass by a carbonaceous anode. It claims the specific three-fluoride composition and electrode form described in the specification.",
      keyInnovations: [
        "Lithium-fluoride bath modification",
        "Three-fluoride electrolyte composition",
        "Carbonaceous anode in fused-mass electrolysis",
      ],
      legalSignificance:
        "The lithium composition claim captures Hall's lower-fusion-point variant and keeps the explicitly described lithium substitution within the issued claim set.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title:
        "Sectional Elevation of Hall Electrolytic Reduction Crucible with Carbon Anodes and Sunk Metal Pool",
      caption:
        "Cross-sectional view showing metal crucible A, furnace B, positive electrode C, negative electrode D, and carbon lining A-prime as identified in the specification.",
      svgType: "hall-aluminium",
      callouts: hallFigureCallouts["Fig. 1"],
    },
    {
      figureNumber: "Fig. 2",
      title: "Top Plan View of Rectangular Smelting Cell and Carbon Anode Bus Array",
      caption:
        "Modified apparatus view showing carbon lining A-prime used as the negative electrode and conductor N-prime connected to the lining.",
      svgType: "hall-aluminium",
      callouts: hallFigureCallouts["Fig. 2"],
    },
  ],
  historicalContext: {
    problemStatement:
      "Throughout the 19th century, aluminium was an exotic laboratory curiosity and luxury metal priced higher than silver ($18 per pound). While aluminium is the most abundant metallic element in the Earth's crust (~8%), it was locked in extraordinarily stable oxide bonds in bauxite (Al₂O₃). Direct carbon smelting was chemically impossible, direct melting required an unachievable 2072°C, and the Deville chemical displacement process consumed expensive metallic sodium.",
    priorArtLimitations: [
      "Deville chemical displacement process required pure metallic sodium ($12–$18/lb), yielding only tiny quantities of expensive metal.",
      "Anhydrous aluminium chloride electrolysis generated toxic chlorine gas, required expensive sealed cells, and suffered severe electrode corrosion.",
      "Direct electrical or thermal melting of alumina was impossible with 19th-century dynamos due to alumina's 2072°C melting point.",
    ],
    breakthroughInsight:
      "Charles Martin Hall discovered that molten cryolite (Na₃AlF₆) at 950°C acts as a non-corrosive, highly conductive liquid solvent that readily dissolves solid alumina powder. Passing direct current through this molten bath selectively decomposes the dissolved alumina into liquid aluminium metal and oxygen, without decomposing the fluoride solvent. Because liquid aluminium is denser (2.28 g/cm³) than the molten cryolite bath (2.10 g/cm³), the metal sinks by gravity to the cathode bottom, shielded from air re-oxidation.",
    patentWars: [
      {
        rivalName: "Paul Héroult / Cowles Electric Smelting and Aluminum Company",
        rivalClaim:
          "Cryolite electrolysis priority and internal electrical resistance heating (Bradley patents)",
        conflictDetails:
          "Hall filed his US application on July 9, 1886, three months after Paul Héroult filed in France. The US Patent Office declared an interference; Hall proved priority dating back to February 23, 1886 through laboratory notebooks and testimony from Oberlin Professor Frank Jewett and Julia Hall, securing sole US rights. The Cowles brothers later sued for infringement of their internal resistance heating patents.",
        resolution:
          "ALCOA settled the Cowles litigation in 1903 by purchasing the patent rights for $1.35 million, consolidating total domestic control over aluminium smelting.",
        legalOutcome:
          "Upheld Hall's master priority over molten-cryolite aluminium smelting, creating the corporate foundation for ALCOA.",
      },
    ],
    civilizationalImpact:
      "Hall's patent reduced the price of aluminium by 99%—from $18/lb in 1886 to $0.18/lb by 1914. This catastrophic cost reduction transformed aluminium into the foundational structural metal of the 20th century, enabling the Wright Flyer's lightweight engine crankcase in 1903, modern long-distance electrical power grids, commercial aviation, and skyscraper architecture.",
  },
  stats: {
    totalClaims: 3,
    independentClaims: 3,
  },
  tags: [
    "aluminium",
    "electrolysis",
    "cryolite",
    "metallurgy",
    "chemistry",
    "electrochemistry",
    "smelting",
    "ALCOA",
    "materials science",
  ],
};
