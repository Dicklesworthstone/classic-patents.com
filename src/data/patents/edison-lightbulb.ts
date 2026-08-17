import type { Patent } from "@/types/patent";

export const edisonLightbulbPatent: Patent = {
  id: "us-223898-edison-lightbulb",
  patentNumber: "US 223,898",
  title: "Electric-Lamp",
  shortTitle: "Edison Incandescent Light Bulb",
  subtitle: "High-Resistance Carbonized Filament in High-Vacuum Glass Globe with Platinum Leads",
  inventors: ["Thomas Alva Edison"],
  inventorLocation: "Menlo Park, New Jersey",
  grantDate: "1880-01-27",
  filingDate: "1879-11-04",
  era: "Incandescent Lighting (1875–1885)",
  category: "electricity",
  categoryLabel: "Lighting & Materials Science",
  summary:
    "The patent that illuminated the modern world. Edison did not invent the first electric light, but he invented the first commercially viable incandescent lamp. By recognizing that practical central-station distribution required a high electrical resistance filament ($100\\ \\Omega$ instead of $1\\ \\Omega$) enclosed in a nearly complete Sprengel vacuum ($10^{-6}\\text{ atm}$) with sealed platinum lead-in wires, Edison solved the famous problem of the 'subdivision of the electric light.'",
  heroQuote:
    "Be it known that I, Thomas Alva Edison, of Menlo Park, in the State of New Jersey, United States of America, have invented an Improvement in Electric Lamps, and in the method of manufacturing the same...",
  originalPdfUrl:
    "https://patentimages.storage.googleapis.com/b9/62/77/89eb8fa0bb26ce/US223898.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US223898A/en",
  usptoClassification: "H01K 1/00 (Incandescent lamps; Filaments)",
  originalText: `UNITED STATES PATENT OFFICE.
THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.

ELECTRIC-LAMP.

SPECIFICATION forming part of Letters Patent No. 223,898, dated January 27, 1880.
Application filed November 4, 1879.

To all whom it may concern:
Be it known that I, THOMAS ALVA EDISON, of Menlo Park, in the State of New Jersey, United States of America, have invented an Improvement in Electric Lamps, and in the method of manufacturing the same, of which the following is a specification.

The object of this invention is to produce electric lamps giving light by incandescence, which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light and the use of small electrical conductors in the distribution of the current.

The invention consists in a light-giving body of carbon wire or sheets coiled or arranged in such a manner as to offer great resistance to the passage of the electric current, and at the same time present but a slight surface from which radiation can take place.

The invention further consists in placing such light-giving body of great resistance in a nearly-perfect vacuum, so that there is no oxygen to put an end to the carbon during the continued passage of the current, and in sealing the carbon wire to platinum wires within a glass bulb exhausted by a mercury-pump...`,
  plainEnglishExplanation: {
    overview:
      "Before Edison, dozens of inventors had created glowing incandescent wires in laboratories (including Humphry Davy, Warren de la Rue, and Joseph Swan). However, all prior lamps used thick, low-resistance carbon rods or platinum wires with resistances around $1\\ \\Omega$. In a city-wide power grid wired in parallel, low resistance meant massive current ($I = V/R$), which required copper power cables as thick as tree trunks to avoid catching fire ($P_{loss} = I^2 R_{wire}$). Edison’s mathematical breakthrough was understanding that high electrical resistance ($100\\ \\Omega$) was the only way to make electric lighting economically competitive with gas.",
    coreMechanism:
      "A thin carbonized organic fiber (cotton thread, cardboard, or bamboo) with a cross-section of only a few thousandths of an inch was shaped into a hairpin or spiral loop. The filament was clamped to platinum lead-in wires hermetically sealed into a glass bulb. An advanced Sprengel mercury pump evacuated the bulb to one-millionth of an atmosphere. When electric current passed through the high-resistance carbon filament, Joule heating ($P = I^2 R$) raised its temperature to over $2000^\\circ\\text{C}$ ($2300\\text{ K}$), causing it to emit brilliant, warm blackbody incandescence without burning up because no oxygen remained in the glass envelope.",
    mechanicalBreakdown: [
      {
        title: "High-Resistance Carbon Filament",
        summary: "A slender carbonized thread possessing over 100 Ohms of resistance.",
        technicalDetails:
          "Formed by carbonizing cotton sewing thread or bristol board in an oxygen-free iron crucible. Its high electrical resistivity ($\\rho \\approx 3.5 \\times 10^{-5}\\ \\Omega\\cdot\\text{m}$) and minimal cross-sectional area ($A \\approx 0.05\\text{ mm}^2$) produced a cold resistance of $100\\ \\Omega$ and a hot operating resistance of $140\\ \\Omega$, drawing only $0.75\\text{ Amperes}$ at $110\\text{ Volts}$.",
        archaicTerm: "Carbon wire or filament of high resistance",
        modernEquivalent: "Tungsten filament / incandescent emitter",
      },
      {
        title: "Ultra-High Vacuum Glass Envelope",
        summary: "Hermetically sealed glass globe evacuated by mercury aspirators.",
        technicalDetails:
          "Using Hermann Sprengel's multi-stage mercury vacuum pump, Edison achieved a vacuum pressure below $10^{-6}\\text{ atmospheres}$ ($0.1\\text{ Pa}$). In the absence of atmospheric oxygen and nitrogen, carbon cannot undergo chemical combustion ($\\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2$) and convective heat dissipation is virtually eliminated.",
        archaicTerm: "Nearly-perfect vacuum exhausted by mercury-pump",
        modernEquivalent: "High-vacuum hermetic glass envelope",
      },
      {
        title: "Platinum Lead-In Wire Seals",
        summary: "Platinum conductors fused directly through the glass stem.",
        technicalDetails:
          "Platinum was selected because its coefficient of thermal expansion ($\\alpha \\approx 9 \\times 10^{-6}\\text{ K}^{-1}$) nearly matches soda-lime and lead glass. When the hot glass cooled around the wire during glassblowing, the glass formed a gas-tight seal that did not crack as the lamp heated and cooled during operation.",
        archaicTerm: "Platinum wires sealed into the glass",
        modernEquivalent: "Hermetic glass-to-metal matched expansion seal",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Joule Heating & Power Loss in Parallel Grids",
        formula: "P_{loss} = I^2 R_{wire} = \\left(\\frac{P_{lamp}}{V}\\right)^2 R_{wire}",
        explanation:
          "Increasing the distribution voltage (110V) and filament resistance reduces the current I required for a given light output, drastically cutting power losses in distribution wires by the square of current.",
      },
      {
        principle: "Stefan-Boltzmann Law & Blackbody Radiation",
        formula: "j^* = \\varepsilon \\sigma T^4, \\quad \\lambda_{peak} = \\frac{b}{T}",
        explanation:
          "The luminous output of an incandescent filament scales with the fourth power of temperature T. Higher operating temperatures shift peak emission from infrared into visible light spectrum.",
      },
    ],
    whyItMattersToday:
      "Edison's patent launched the modern electrical utility industry. The 110V parallel distribution standard, the screw-base lamp socket (Edison base / E26), and central power stations (like Pearl Street Station in NYC) were all engineered directly around the requirements of this patent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An electric lamp for giving light by incandescence, consisting of a filament of carbon of high resistance, made as described, and secured to metallic wires, substantially as set forth.",
      plainEnglish:
        "Protects an incandescent electric lamp made with a high-resistance carbon filament connected to metal lead-in wires.",
      keyInnovations: [
        "High-resistance carbon filament",
        "Slender thread geometry",
        "Incandescent light",
      ],
      legalSignificance:
        "The core claim that defeated competing gas lighting companies and established General Electric's monopoly on early electric illumination.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "The combination of carbon filaments with a receiver made entirely of glass and conductors passing through the glass, and from which receiver the air is exhausted, substantially as set forth.",
      plainEnglish:
        "Protects the combination of a carbon filament inside an all-glass exhausted vacuum receiver with lead-in wires passing through the glass.",
      keyInnovations: [
        "All-glass vacuum envelope",
        "Hermetic wire pass-through",
        "High vacuum evacuation",
      ],
      legalSignificance:
        "Crucial claim upheld in federal courts in 1891 against the United States Electric Lighting Company and Westinghouse.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of the Electric Lamp",
      caption:
        "Drawing of the classic pear-shaped glass bulb with coiled carbon filament and platinum lead-in wires.",
      svgType: "edison-bulb",
      callouts: [
        {
          id: "eb-1",
          figureRef: "Fig. 1",
          label: "c",
          element: "Carbon Filament",
          description: "High-resistance carbonized fiber hairpin loop.",
          x: 50,
          y: 42,
        },
        {
          id: "eb-2",
          figureRef: "Fig. 1",
          label: "d",
          element: "Platinum Clamps",
          description:
            "Small copper/platinum clamps connecting the carbon filament to the conductors.",
          x: 50,
          y: 62,
        },
        {
          id: "eb-3",
          figureRef: "Fig. 1",
          label: "a",
          element: "Glass Globe",
          description: "All-glass envelope evacuated to ultra-high vacuum.",
          x: 50,
          y: 48,
        },
        {
          id: "eb-4",
          figureRef: "Fig. 1",
          label: "h",
          element: "Sealed Exhaust Tip",
          description: "Glass pip sealed shut after mercury-pump evacuation.",
          x: 50,
          y: 12,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1878, gas illumination ruled cities, spewing fumes, soot, and heat into homes. Arc lamps were blindingly bright (thousands of candlepower) and emitted choking carbon smoke, making them suitable only for street intersections and lighthouses. No one could 'subdivide' the electric light into gentle 16-candlepower lamps for domestic rooms without requiring astronomical quantities of copper wire.",
    priorArtLimitations: [
      "Humphry Davy (1802) demonstrated incandescent platinum wire, but platinum melted near its incandescence point ($1768^\\circ\\text{C}$) and cost a fortune.",
      "Joseph Swan in England (1878) used thick carbon rods with very low resistance ($1\\ \\Omega$) in partial vacuums; the carbon quickly vaporized and blackened the glass bulb.",
      "Heinrich Göbel and Warren de la Rue lacked the Sprengel mercury pump needed to achieve a durable $10^{-6}\\text{ atm}$ vacuum.",
    ],
    breakthroughInsight:
      "Edison calculated mathematically that by boosting filament resistance from $1\\ \\Omega$ to $100+\\ \\Omega$, he could drop the operating current by 90%, reducing power losses in distribution wires by 99% ($I^2 R$) and making copper wiring thousands of times cheaper.",
    patentWars: [
      {
        rivalName: "Sir Joseph Swan (Edison & Swan United Electric Light Co.)",
        rivalClaim:
          "Swan demonstrated carbon incandescent lamps in England before Edison and held British patents.",
        conflictDetails:
          "Rather than fight an all-out patent war in British courts that could have invalidated both claims, Edison and Swan merged their UK interests into the 'Ediswan' joint venture in 1883.",
        resolution:
          "In the United States, Edison’s US Patent 223,898 was relentlessly challenged by the Westinghouse-backed US Electric Lighting Co. (using Maxim and Sawyer-Man patents).",
        legalOutcome:
          "In 1891, the US Circuit Court of Appeals decisively ruled in Edison’s favor, holding that Edison was the first to invent a high-resistance carbon filament in an all-glass hermetically sealed vacuum.",
      },
    ],
    civilizationalImpact:
      "Edison’s patent banished darkness from human dwellings, extended the productive working and leisure hours of civilization, eliminated open gas-lamp fire hazards in cities, and laid the cornerstone for the global electrical grid.",
    funFact:
      "Edison’s team tested over 6,000 different organic carbon materials—including cedar, coconut hair, fishline, cardboard, and even hair plucked from an assistant’s beard—before discovering that Japanese bamboo filaments lasted over 1,200 continuous hours!",
  },
  tags: [
    "Lighting",
    "Thomas Edison",
    "Electricity",
    "Vacuum Tube",
    "Materials Science",
    "Invention",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 2,
    patentWarYears: "1880–1892",
    impactScore: 100,
  },
};
