import { manualCortClaimText } from "@/data/editions/cortPuddlingRollingEdition";
import type { Patent } from "@/types/patent";

export const cortPuddlingRollingPatent: Patent = {
  id: "gb-1420-cort-puddling-rolling",
  patentNumber: "GB 1420",
  title:
    "Method of Shingling, Welding, and Manufacturing Iron and Steel into Bars, Plates, and Rods of Purer Quality and in Larger Quantities by More Effectual and Expeditious Methods and with Fewer Fires Than Heretofore Used",
  shortTitle: "Henry Cort Reverberatory Puddling Furnace & Grooved Rolling Mill",
  subtitle:
    "Continuous Reverberatory Coal-Decarburization and Multi-Pass Slag-Extruding Grooved Rolling",
  inventors: ["Henry Cort"],
  inventorLocation: "Fontley, Southampton (Hampshire), England",
  grantDate: "1784-02-13",
  filingDate: "1784-02-13",
  era: "Pre-Industrial & Early Industrial (Pre-1800)",
  category: "materials",
  categoryLabel: "Materials Science & Metallurgy",
  summary:
    "Henry Cort's monumental 1784 patent combining the reverberatory puddling furnace with the grooved rolling mill—the technological foundation of the Industrial Revolution in iron. By isolating pig iron from sulfurous coal fuel on a concave hearth and stirring the molten bath under radiant flame, Cort burned off carbon until the iron 'came to nature' as pasty pure metal crystals. Immediately transferring the red-hot sponge ball to grooved rolling cylinders exerted progressive hydrostatic compression that expelled liquid silicate slag and welded the iron into fibrous, ductile bars in a single heat, multiplying output fifteenfold and slashing production costs by 70%.",
  heroQuote:
    "The crude iron... is first introduced into a reverberatory furnace... where the intense flame is caused to reverberate down upon the hearth wholly secluded from direct contact with the solid sulfurous fuel... while grooved rollers express the liquid cinder and weld the crystals into fibrous bars in a single heat.",
  originalPdfUrl: "/patents/pdfs/gb-1420-cort-puddling-rolling.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/GB178401420A/en",
  usptoClassification: "C21B 11/00",
  originalText:
    "TO ALL TO WHOM THESE PRESENTS SHALL COME, I, HENRY CORT, of Fontley, in the Parish of Titchfield, in the County of Southampton, Esquire, send greeting:\\n\\nWHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Thirteenth day of February, in the twenty-fourth year of His reign, did give and grant unto me, the said Henry Cort, His especial licence, full power, sole privilege and authority, that I, the said Henry Cort, my executors, administrators, and assigns, should and lawfully might make, use, exercise, and vend, within England, Wales, and the Town of Berwick-upon-Tweed, my new Invented 'Method of Shingling, Welding, and Manufacturing Iron and Steel into Bars, Plates, and Rods of Purer Quality and in Larger Quantities by More Effectual and Expeditious Methods and with Fewer Fires Than Heretofore Used;' in which said Letters Patent there is contained a proviso obliging me, the said Henry Cort, by an instrument in writing under my hand and seal, to cause a particular description of the nature of my said Invention, and the manner in which the same is to be performed, to be inrolled in His Majesty's High Court of Chancery within one calendar month next and immediately after the date of the said Letters Patent...\\n\\nThe crude iron, commonly called pig iron or cast iron, is first introduced into a reverberatory or air furnace heated by pit coal or common coal. In this furnace the fuel burns in a separate combustion grate, and the intense flame and heated gases are caused to reverberate from the curved arched roof down upon the hearth, where the iron is placed upon a bed of sand and slag, wholly secluded from direct contact with the solid sulfurous fuel.",
  plainEnglishExplanation: {
    overview:
      "In the late 18th century, Great Britain faced a severe national crisis in metallurgy. The country had depleted its timber forests, making traditional charcoal finery forges economically impossible. British ironmasters could produce crude cast pig iron in blast furnaces using coal-derived coke, but pig iron contained ~4% carbon—making it brittle, unforgeable, and useless for structural engineering or tools. Refining pig iron into ductile wrought iron required burning out the carbon, but attempting to melt pig iron over raw coal contaminated the iron with sulfur, causing 'hot shortness' where the iron shattered under the forge hammer. Furthermore, shaping hot iron with water-powered tilt hammers was painfully slow (~1 ton per week per forge) and produced internal cracks. Henry Cort solved both problems simultaneously with an integrated chemical and mechanical system: (1) Decarburizing pig iron in a reverberatory furnace where coal burned in a separate grate and only clean radiant flames swept over the concave hearth, and (2) Compressing the resulting red-hot spongy iron puddle ball through continuous grooved rollers that squeezed out liquid slag and rolled finished fibrous bars in a single heat.",
    coreMechanism:
      "The process operates in two synchronized thermal stages: (1) Reverberatory Puddling: High-carbon pig iron (3.5–4.2% C, melting point ~1150 °C) is charged onto a concave sand/slag hearth. Coal burns in a separate firebox, separated by a masonry bridge wall. The low arched roof reflects radiant heat (1300–1400 °C) and sweeps oxidizing combustion gases across the molten pool. The puddler inserts an iron rabble rod through the working door, vigorously stirring the bath. Oxygen from the flame and iron oxide scale reacts with dissolved carbon: $2\\text{Fe}_2\\text{O}_3 + 3\\text{C} \\rightarrow 4\\text{Fe} + 3\\text{CO} \\uparrow$. As carbon content drops below 0.1%, the melting point of the purified iron rises sharply from 1150 °C to 1538 °C. Because the furnace operates at ~1350 °C, the iron spontaneously solidifies into pasty, spongy metallic grains—a phenomenon termed 'coming to nature'. The puddler gathers these grains into 60–80 lb puddle balls (loups). (2) Grooved Rolling Mill Shingling: The incandescent puddle ball (interspersed with ~15% liquid iron silicate slag) is immediately conveyed while white-hot to Cort's grooved rolling mill. Two heavy chilled-iron cylinders with matching graduated grooves (cogging box -> gothic diamond -> flat -> round) rotate under water power. The powerful continuous rotary nip exerts 30–60 MPa of hydrostatic pressure throughout the entire core of the billet, violently squirting the liquid slag out of the pores and welding the microscopic iron crystals into a solid, fibrous, highly ductile wrought iron bar in a single heat without needing a tilt hammer.",
    mechanicalBreakdown: [
      {
        title: "Reverberatory Furnace Arch & Fire Bridge Isolation",
        summary:
          "A masonry furnace that isolates coal combustion in a separate grate. The fire bridge prevents solid fuel or ash from touching the iron, while the curved arched roof reverberates radiant heat down onto the concave hearth.",
        technicalDetails:
          "Combustion gases ($T_{\\text{flame}} \\approx 1450\\,^\\circ\\text{C}$) sweep over the bridge wall. Stefan-Boltzmann radiation $q = \\epsilon \\sigma (T_{\\text{roof}}^4 - T_{\\text{bath}}^4)$ transfers over 80 kW/m² of clean radiant flux onto the hearth bath.",
        archaicTerm: "Reverberatory or air furnace",
        modernEquivalent: "Open-hearth reverberatory metallurgical refining furnace",
      },
      {
        title: "Puddler Rabble Rod & Surface Carbon Oxidation",
        summary:
          "A long iron hook or hoe worked continuously through a port in the furnace door. Stirring breaks the slag crust and brings unoxidized pig iron to the surface to react with iron oxide cinder.",
        technicalDetails:
          "Manual rabbling at 15–20 RPM increases interfacial mass transfer $\\frac{d[\\text{C}]}{dt} = -k_{\\text{eff}} A (C - C_{\\text{eq}})$, reducing carbon from 4.0% to 0.04% within 75–90 minutes.",
        archaicTerm: "Iron paddle or rabble",
        modernEquivalent: "Refining rabble / metallurgical slag rake",
      },
      {
        title: "Solidus Elevation & 'Coming to Nature' Transition",
        summary:
          "As carbon is removed, the iron's melting point rises above the furnace temperature, causing pure iron crystals to solidify into a spongy, pasty mass inside the molten slag.",
        technicalDetails:
          "Linearized Fe-C solidus relation: $T_{\\text{solidus}} = 1538 - 88 \\cdot [\\%\\text{C}]$. When carbon drops below 1.5%, $T_{\\text{solidus}} > T_{\\text{furnace}}$ (1350 °C), precipitating delta/gamma-ferrite grains.",
        archaicTerm: 'Separates into granular particles and "comes to nature"',
        modernEquivalent: "Thermodynamic liquid-to-solid phase transition via decarburization",
      },
      {
        title: "Graduated Grooved Rolling Mill & Hydrostatic Slag Squeeze",
        summary:
          "A two-high rolling stand with matching profiled collar grooves (box, diamond, flat, round) that exert progressive 3D compressive force on the red-hot billet.",
        technicalDetails:
          "Groove pass geometry applies hydrostatic pressure $P_{\\text{roll}} = \\sigma_{\\text{flow}} \\left(1 + \\frac{1.2 L_{\\text{bite}}}{2 h}\\right) \\approx 45\\,\\text{MPa}$, reducing residual slag from 16% to 1.2% and increasing tensile strength to 340 MPa.",
        archaicTerm: "Pairs of large chilled cast-iron rollers with corresponding grooves",
        modernEquivalent: "Multi-pass grooved breakdown rolling mill (cogging mill)",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Thermochemical Decarburization Kinetics",
        formula:
          "\\frac{d[\\text{C}]}{dt} = -k_0 e^{-\\frac{E_a}{R T}} (1 + \\beta \\omega_{\\text{rabble}}) [\\text{C}]",
        explanation:
          "Dissolved carbon in molten iron is oxidized by iron oxide in the slag and oxygen in the furnace draft into carbon monoxide gas ($2\\text{Fe}_2\\text{O}_3 + 3\\text{C} \\rightarrow 4\\text{Fe} + 3\\text{CO} \\uparrow$), which bubbles vigorously through the bath.",
      },
      {
        principle: "Solidus Rise & Phase Transition (Coming to Nature)",
        formula: "T_{\\text{solidus}}(\\%\\text{C}) = 1538 - 88 \\cdot [\\%\\text{C}]",
        explanation:
          "Pure iron melts at 1538 °C, whereas eutectic pig iron melts at 1147 °C. Decarburization elevates the solidus line past the furnace operating temperature (1350 °C), transforming the liquid into pasty solid iron grains.",
      },
      {
        principle: "Hydrostatic Squeeze & Slag Extrusion Dynamics",
        formula:
          "P_{\\text{roll}} = \\sigma_{\\text{flow}}(T) \\left(1 + \\frac{1.2 \\sqrt{R \\Delta h}}{2 h}\\right) > P_{\\text{slag\\_capillary}}",
        explanation:
          "Grooved cylinders exert normal compressive stresses far exceeding the capillary retention pressure of molten fayalite slag ($2\\text{FeO}\\cdot\\text{SiO}_2$), squirting slag out along the longitudinal roll axis and welding iron grains into dense fibrous wrought iron.",
      },
    ],
    whyItMattersToday:
      "Cort's combination of reverberatory decarburization and continuous grooved rolling created the modern steel and iron industry. Every continuous rolling mill, structural beam rolling train, and rail rolling mill operating in the world today is a direct descendant of Henry Cort's 1784 patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualCortClaimText(1),
      plainEnglish:
        "Claim 1 establishes the fundamental method of refining crude blast-furnace pig iron into malleable wrought iron inside a reverberatory furnace heated solely by clean coal flame and radiant heat, isolating the metal from direct contact with sulfurous solid coal fuel.",
      keyInnovations: [
        "Reverberatory coal flame heating",
        "Isolation of molten iron from solid sulfurous fuel",
        "Refining pig iron without charcoal",
      ],
      legalSignificance:
        "The master claim that emancipated the iron industry from charcoal dependency and Baltic imports.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualCortClaimText(2),
      plainEnglish:
        "Claim 2 covers the manual rabbling and agitation of the molten iron bath under reverberated radiant heat to accelerate carbon oxidation until the metal loses fluidity, 'comes to nature,' and is gathered into cohesive puddle balls.",
      keyInnovations: [
        "Rabble agitation of molten bath",
        "Coming to nature solidus elevation",
        "Gathering into cohesive 60–80 lb puddle balls",
      ],
      legalSignificance:
        "Defines the chemical decarburization and physical agglomeration mechanism of the puddling process.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualCortClaimText(3),
      plainEnglish:
        "Claim 3 protects the process of shingling and consolidating the red-hot spongy puddle balls by passing them directly through pairs of heavy revolving rollers with matching graduated grooves.",
      keyInnovations: [
        "Rotary roller shingling",
        "Graduated roll profile passes",
        "Elimination of tilt-hammer forging",
      ],
      legalSignificance:
        "Replaced slow, crack-inducing hammer shingling with high-speed continuous rotary compression.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualCortClaimText(4),
      plainEnglish:
        "Claim 4 specifies the simultaneous expulsion of liquid silicate slag and the solid-state consolidation of wrought iron bars in a single heat during continuous grooved rolling, yielding superior ductility and 15x higher output.",
      keyInnovations: [
        "Hydrostatic slag expulsion in a single heat",
        "Fibrous crystal grain welding",
        "Fifteenfold productivity increase over tilt hammers",
      ],
      legalSignificance:
        "Established the commercial viability of mass-producing structural wrought iron bars for Victorian infrastructure.",
    },
  ],
  drawings: [
    {
      figureNumber: "1",
      title:
        "Fig. 1 — Reverberatory Puddling Furnace & Fig. 2 — Grooved Rolling Mill & Roll Pass Profiles",
      caption:
        "Technical longitudinal section of the reverberatory puddling furnace showing coal grate (A), fire bridge (B), concave hearth (C), arched roof (D), chimney stack (F), and rabble (G); together with front elevation of the grooved rolling mill showing mill stands (H), wobbler coupling (I), grooved rolls (J), adjustment screws (K), and graduated roll pass profiles (Fig. 3).",
      svgType: "cort-puddling-rolling",
      callouts: [
        {
          id: "A",
          figureRef: "1",
          label: "A",
          element: "Combustion Grate (Coal Firebox)",
          description:
            "Where pit coal or common coal is combusted on iron grate bars, isolated from the iron charge.",
          x: 20,
          y: 40,
        },
        {
          id: "B",
          figureRef: "1",
          label: "B",
          element: "Fire Bridge Wall",
          description:
            "Masonry barrier that prevents solid coal, ash, and sulfur from spilling onto the hearth bath.",
          x: 27,
          y: 35,
        },
        {
          id: "C",
          figureRef: "1",
          label: "C",
          element: "Concave Puddling Hearth Basin",
          description:
            "Sand and iron oxide refractory basin where pig iron melts and decarburizes into puddle balls.",
          x: 42,
          y: 48,
        },
        {
          id: "D",
          figureRef: "1",
          label: "D",
          element: "Arched Reverberatory Roof (Crown)",
          description:
            "Curved brick crown that deflects clean burning gases and radiates intense thermal flux down upon the bath.",
          x: 36,
          y: 22,
        },
        {
          id: "F",
          figureRef: "1",
          label: "F",
          element: "High Brick Chimney Stack",
          description:
            "Provides natural draft to pull air through the firebox and sweep flame across the reverberatory hearth.",
          x: 58,
          y: 18,
        },
        {
          id: "G",
          figureRef: "1",
          label: "G",
          element: "Puddler Working Door & Rabble Aperture",
          description:
            "Port through which the puddler inserts the iron rabble to stir the molten iron during refining.",
          x: 42,
          y: 32,
        },
        {
          id: "H",
          figureRef: "1",
          label: "H",
          element: "Cast-Iron Mill Housings (Stanchions)",
          description:
            "Massive structural frames holding the roll chocks and bearings under extreme separating force.",
          x: 72,
          y: 35,
        },
        {
          id: "J",
          figureRef: "1",
          label: "J",
          element: "Chilled Cast-Iron Grooved Rollers",
          description:
            "Matching counter-rotating rolls with graduated box, diamond, flat, and round groove passes.",
          x: 82,
          y: 42,
        },
        {
          id: "K",
          figureRef: "1",
          label: "K",
          element: "Screw-Down Adjustment Spindles",
          description:
            "Heavy vertical screws that set the gap between rolls to control pass draft and hydrostatic pressure.",
          x: 76,
          y: 15,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1780, Great Britain was severely resource-constrained in iron production due to nationwide deforestation of charcoal timber. British blast furnaces produced brittle cast pig iron using coal-coke, but refining pig iron into ductile wrought iron required burning out ~4% carbon. Attempting to melt pig iron over raw coal contaminated the iron with sulfur, causing 'hot shortness' where the iron shattered under the forge hammer. Britain was forced to import over 70% of its bar iron from Sweden and Russia at ruinous naval and commercial expense.",
    priorArtLimitations: [
      "Charcoal finery forges required vast forests and could not scale to meet industrial demand",
      "Melting iron directly on coal fires contaminated the metal with brittle sulfur impurities",
      "Tilt hammers forged only ~1 ton of iron per week per forge and frequently caused internal cracks",
      "Reheating iron across multiple separate finery fires wasted huge quantities of fuel and metal",
    ],
    breakthroughInsight:
      "Henry Cort realized that decoupling coal combustion from the metal bath using a reverberatory roof enabled the use of cheap domestic coal without sulfur contamination. Furthermore, replacing forge hammers with continuous grooved rollers exerted uniform 3D hydrostatic pressure that squeezed out liquid slag and rolled 15 tons of finished bars in the time a tilt hammer forged one.",
    patentWars: [
      {
        rivalName: "Adam Jellicoe & Royal Navy Pay Office / Richard Crawshay / Samuel Homfray",
        rivalClaim:
          "Ironmasters claimed Cort's puddling process was prior art or used it without paying agreed royalties of 10 shillings per ton.",
        conflictDetails:
          "Cort partnered with Adam Jellicoe, deputy paymaster of the Royal Navy, who financed Cort's Fontley ironworks using embezzled Navy funds. When Jellicoe died in 1789, the British Crown seized Cort's patents and property to satisfy Jellicoe's debt. The Crown never collected royalties from ironmasters, effectively throwing Cort's patents open to the entire British iron industry without Cort receiving a penny.",
        resolution:
          "Cort was ruined financially, while ironmasters like Richard Crawshay of Cyfarthfa amassed vast fortunes using Cort's puddling and rolling processes. In 1794, the British government granted Cort a small pension of £200 per year.",
        legalOutcome:
          "Tragically destroyed the inventor financially, but the zero-royalty public access catalyzed the most explosive growth of iron manufacturing in human history.",
      },
    ],
    civilizationalImpact:
      "Cort's 1784 patent transformed Great Britain from an iron-importing nation into the 'Workshop of the World'. British wrought iron production surged from 68,000 tons in 1788 to 250,000 tons in 1806 and over 1.6 million tons by 1845. Cort's cheap, high-strength wrought iron enabled the global expansion of steam railways, iron steamships, suspension bridges, factory machinery, and the architectural structures of the 19th century.",
  },
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
  tags: [
    "metallurgy",
    "iron",
    "steel",
    "puddling",
    "rolling mill",
    "materials",
    "industrial revolution",
    "furnace",
    "wrought iron",
  ],
};
