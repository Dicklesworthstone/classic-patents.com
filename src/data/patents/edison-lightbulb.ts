import type { Patent } from "@/types/patent";

export const edisonBulbPatent: Patent = {
  id: "us-223898-edison-lightbulb",
  patentNumber: "US 223,898",
  title: "Electric-Lamp",
  shortTitle: "Edison High-Resistance Incandescent Lamp",
  subtitle: "High-Resistance Carbonized Filament in a High-Vacuum Sealed Glass Globe",
  inventors: ["Thomas A. Edison"],
  inventorLocation: "Menlo Park, New Jersey",
  grantDate: "1880-01-27",
  filingDate: "1879-11-04",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Illumination & Materials Science",
  summary:
    "The Electrification of the Modern World: On January 27, 1880, Thomas Edison was granted US Patent No. 223,898 for the practical incandescent electric lamp. By recognizing that subdivision of electric light required high electrical resistance ($R \\approx 100\\,\\Omega$) rather than thick low-resistance rods, Edison reduced line current by 95%, making parallel power distribution over copper wires financially feasible. Paired with a high-vacuum glass envelope ($10^{-6}\\text{ Torr}$) evacuated by Sprengel mercury pumps and matched-expansion platinum lead seals, Edison created the first commercially viable electric lighting system.",
  heroQuote:
    "The object of this invention is to produce electric lamps giving light by incandescence, which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light and the distribution of current through main conductors of small diameter...",
  originalPdfUrl: "/patents/pdfs/us-223898-edison-lightbulb.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US223898A/en",
  usptoClassification: "H01K 1/00 (Incandescent lamps)",
  originalTextAsset: {
    url: "/patents/transcripts/us-223898-edison-lightbulb.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
  },
  originalText: `UNITED STATES PATENT OFFICE.
THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.

ELECTRIC-LAMP.

SPECIFICATION forming part of Letters Patent No. 223,898, dated January 27, 1880.
Application filed November 4, 1879.

To all whom it may concern:
Be it known that I, THOMAS ALVA EDISON, of Menlo Park, in the State of New Jersey, United States of America, have invented an Improvement in Electric Lamps, and in the method of manufacturing the same, of which the following is a specification.

The object of this invention is to produce electric lamps giving light by incandescence, which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light and the distribution of current through main conductors of small diameter.

The invention consists in a light-giving body of carbon wire or filament made as a continuous piece and of high resistance, which is enclosed within a hermetically sealed all-glass globe from which the air has been exhausted to a high degree of vacuum, and provided with platinum leading-in wires passing through the glass and hermetically sealed therein by the fusion of the glass around them.

Heretofore light by incandescence has been obtained by using thick carbon rods of low resistance (from one to four ohms) in vessels from which the air was imperfectly exhausted. When many such lamps were connected in multiple circuit, the enormous current required necessitated copper conductors of impractical thickness and cost. Furthermore, in imperfect vacuums, carbon rods oxidized and deteriorated rapidly due to air-washing and chemical reactions.

I have discovered that even a cotton thread properly carbonized and placed in a sealed glass receiver exhausted to one-millionth of an atmosphere offers a resistance of upwards of one hundred ohms, and remains stable when heated to incandescent luminosity by the electric current.

The filament may be formed of cotton or linen thread, wood splint, paper, or fibers of bamboo carbonized in a closed iron mold at a high temperature. Leading-in wires of platinum are clamped to the ends of the carbon filament, and the whole is mounted upon a glass stem fused into the neck of a glass bulb. The bulb is then exhausted upon a Sprengel mercury pump while current is passed through the filament to drive out occluded gases from the carbon and glass walls, after which the tube is sealed off by the blow-pipe.

Referring to the drawing:
Figure 1 is a view of the lamp in elevation, showing the glass globe with the carbon filament mounted on platinum wires and sealed at the base.`,
  plainEnglishExplanation: {
    overview:
      "Before Edison, dozens of inventors (including Joseph Swan, Humphry Davy, and Warren de la Rue) had demonstrated incandescent light, but their lamps burned out within minutes or hours and used thick, low-resistance carbon or platinum rods (1–4 Ω). To run thousands of low-resistance lamps in parallel, a power grid would require massive, solid copper cables as thick as tree trunks ($I = V / R$). Edison solved both the physics and the economics: by making the filament a micro-thin, high-resistance carbonized thread (100–200 Ω) inside a millionth-of-an-atmosphere vacuum, he reduced the required current by 95% ($P = V^2 / R$), making thin copper home wiring financially feasible for the first time.",
    coreMechanism:
      "An electric current is passed through a micro-thin carbonized bamboo filament ($R \\approx 100\\,\\Omega$). Due to Joule heating ($P = I^2 R$), the filament reaches 2,200 Kelvin and radiates brilliant blackbody incandescence. Because the glass bulb is evacuated to a high vacuum ($10^{-6}\\text{ Torr}$), there are no oxygen molecules to burn the carbon, and no gas convection to cool the wire, allowing the filament to glow continuously for over 1,200 hours.",
    mechanicalBreakdown: [
      {
        title: "High-Resistance Carbonized Filament",
        summary:
          "A micro-thin thread of carbonized organic fiber (cotton, paper, Japanese bamboo).",
        technicalDetails:
          "Offers an electrical resistance of 100–200 Ω at operational temperature. High resistance allows hundreds of lamps to be connected in parallel ($1/R_{total} = \\sum 1/R_i$) across a constant 110V supply without drawing destructive branch currents.",
        archaicTerm: "Carbon wire or filament of high resistance",
        modernEquivalent: "High-resistance incandescent emitter",
      },
      {
        title: "Hermetically Sealed High-Vacuum Glass Envelope",
        summary: "An all-glass globe evacuated using Sprengel mercury vacuum pumps.",
        technicalDetails:
          "Evacuation to $10^{-6}\\text{ Torr}$ eliminates oxygen (stopping oxidation combustion) and increases the mean free path of residual gas molecules, stopping molecular 'air washing' of carbon atoms and thermal conduction losses.",
        archaicTerm: "Receiver exhausted to one-millionth of an atmosphere",
        modernEquivalent: "High-vacuum glass envelope",
      },
      {
        title: "Fused Platinum Leading-in Wires",
        summary: "Platinum wire leads passing through the glass stem.",
        technicalDetails:
          "Platinum has nearly the identical coefficient of thermal expansion as soda-lime glass ($\\alpha \\approx 9 \\times 10^{-6}/\\text{K}$). As the lamp heats and cools, the glass and platinum expand together, preventing microscopic air leaks along the seal.",
        archaicTerm: "Platinum leading-in wires sealed by fusion",
        modernEquivalent: "Hermetic glass-to-metal matched seals",
      },
      {
        title: "Electro-Plated Clamps & Glass Stem Mount",
        summary: "Copper electro-plated clamps securing the carbon filament to platinum leads.",
        technicalDetails:
          "Deposits fine copper over the fragile carbon-to-platinum mechanical joint, preventing contact arcing and localized thermal hot-spot degradation.",
        archaicTerm: "Plastic carbon paste and electro-plated clamps",
        modernEquivalent: "Electro-deposited ohmic lead contacts",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Joule Heating & Feeder Line $I^2R$ Optimization",
        formula:
          "P_{lamp} = \\frac{V^2}{R_{filament}} = I^2 R, \\quad P_{line\\_loss} = I_{total}^2 R_{wire} = \\left(\\sum \\frac{V}{R_i}\\right)^2 R_{wire}",
        explanation:
          "Increasing filament resistance from 1 Ω to 100 Ω drops required current tenfold, slashing $I^2R$ heat dissipation losses in street distribution copper cables by 99% (a 100-fold reduction).",
      },
      {
        principle: "Stefan-Boltzmann & Planck Blackbody Emission",
        formula:
          "E = \\epsilon \\sigma T^4, \\quad u(\\lambda, T) = \\frac{8\\pi h c}{\\lambda^5} \\frac{1}{e^{\\frac{hc}{\\lambda k_B T}} - 1}",
        explanation:
          "At 2,200 Kelvin, the carbonized filament emits blackbody radiant flux ($E \\approx 1.3\\text{ MW/m}^2$), shifting peak emission toward visible wavelengths according to Wien's Displacement Law ($\\lambda_{max} = 1.32\\,\\mu\\text{m}$).",
      },
      {
        principle: "Kinetic Gas Mean Free Path & Convective Suppression",
        formula:
          "\\lambda_{mfp} = \\frac{k_B T}{\\sqrt{2} \\pi d^2 P}, \\quad P = 10^{-6}\\text{ Torr} \\implies \\lambda_{mfp} > 50\\text{ cm}",
        explanation:
          "Because the mean free path $\\lambda_{mfp}$ exceeds bulb dimensions, gas molecules collide with glass walls rather than circulating, eliminating thermal convection cooling and chemical 'air washing'.",
      },
      {
        principle: "Langmuir-Knudsen Carbon Filament Sublimation Kinetics",
        formula: "\\dot{m}_{evap} = P_{sat}(T) \\sqrt{\\frac{M}{2\\pi R T}}",
        explanation:
          "Operating at 2,200 K keeps the carbon vapor pressure $P_{sat}$ low enough ($< 10^{-8}\\text{ Torr}$) to prevent rapid bulb blackening and extend filament service life past 1,200 hours.",
      },
      {
        principle: "Glass-to-Metal Thermal Expansion Coherence",
        formula:
          "\\Delta L = L_0 \\alpha \\Delta T, \\quad \\alpha_{Pt} \\approx 9.0 \\times 10^{-6}/\\text{K} \\approx \\alpha_{glass}",
        explanation:
          "Matching thermal expansion coefficients prevents thermal stress fractures and maintains a permanent hermetic seal across temperature swings of 20°C to 200°C.",
      },
    ],
    whyItMattersToday:
      "Edison's patent was not merely a lamp; it created the architectural blueprint for the modern commercial electrical power grid. The high-resistance parallel-circuit model ($110\\text{V}$ DC/AC), the screw socket (E26 standard still used worldwide), central generating stations, underground conduit distribution, meters, and circuit fuses were all invented to support this single incandescent bulb.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An electric lamp for giving light by incandescence, consisting of a filament of carbon of high resistance, made as described, and secured to metallic wires, as set forth.",
      plainEnglish:
        "The master apparatus claim covering an incandescent electric lamp consisting of a high-resistance carbon filament connected to metallic lead-in wires.",
      keyInnovations: [
        "High-resistance carbon filament",
        "Incandescent filament geometry",
        "Mechanical lead-in wire clamping",
      ],
      legalSignificance:
        "The foundational claim of commercial electric lighting. Upheld in federal courts as defining the high-resistance threshold ($R > 100\\,\\Omega$) essential for parallel power distribution.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination of carbon filaments with a receiver made entirely of glass and conductors passing through the glass, and from which receiver the air is exhausted, for the purposes set forth.",
      plainEnglish:
        "Covers the combination of a carbon filament inside an all-glass vacuum bulb with sealed conductors fused directly through the glass envelope.",
      keyInnovations: [
        "All-glass hermetic vacuum envelope",
        "Glass-fused wire lead seals",
        "High-vacuum preservation of carbon",
      ],
      legalSignificance:
        "Preempted hybrid metal-and-glass lamps that suffered from vacuum leaks, making the one-piece blown glass envelope the universal industry standard.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "A carbon filament or strip coiled and connected to electric conductors so that only a portion of the surface of such carbon conductors shall be exposed for radiating light, as set forth.",
      plainEnglish:
        "Covers coiled, looped, or horseshoe filament geometries that concentrate heat, reduce radiative surface cooling, and increase luminous efficacy.",
      keyInnovations: [
        "Horseshoe and coiled filament design",
        "Thermal concentration",
        "Increased optical luminous flux",
      ],
      legalSignificance:
        "Protected non-linear filament geometries that fit long high-resistance wires into compact glass bulbs.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The method herein described of securing the platinum contact-wires to the carbon filament and carbonizing of the whole in a closed chamber, substantially as set forth.",
      plainEnglish:
        "The manufacturing process for securing platinum leads to organic fiber filaments before high-temperature carbonization in sealed molds.",
      keyInnovations: [
        "Carbon-to-platinum junction engineering",
        "Pre-assembly carbonization method",
        "Mass-production manufacturing technique",
      ],
      legalSignificance:
        "Secured the production technique needed to manufacture fragile filaments at industrial scale without breakage.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation View of Edison High-Resistance Incandescent Lamp",
      caption:
        "Full elevation blueprint showing the hand-blown glass globe, horseshoe carbon filament, inner glass stem mount, platinum lead-in wires, and sealed exhaust tip.",
      svgType: "edison-bulb",
      callouts: [
        {
          id: "eb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Horseshoe Carbon Filament",
          description:
            "High-resistance carbonized organic fiber ($R \\approx 100\\,\\Omega$) glowing at 2,200 K.",
          x: 50,
          y: 35,
        },
        {
          id: "eb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "All-Glass Vacuum Globe",
          description:
            "Evacuated to $10^{-6}\\text{ Torr}$ with Sprengel mercury pumps to stop combustion.",
          x: 50,
          y: 40,
        },
        {
          id: "eb-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Platinum Leading-in Wires",
          description:
            "Fused directly through glass stem; matching thermal expansion coefficient prevents vacuum leaks.",
          x: 50,
          y: 68,
        },
        {
          id: "eb-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Sealed Exhaust Pip",
          description:
            "Glass tip flame-sealed after mercury pump evacuation to lock in high vacuum.",
          x: 50,
          y: 12,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the 1870s, arc lights (invented by Humphry Davy and Charles Brush) were used for outdoor street lighting and train stations. However, arc lamps produced blinding, glaring light (thousands of candlepower), emitted toxic nitric fumes, and hissed violently, making them completely unusable indoors. Early incandescent experimenters used low-resistance carbon rods (1–4 Ω) connected in series; if one bulb failed, the entire circuit went dark. Connecting low-resistance bulbs in parallel required copper conductors as thick as tree trunks to avoid burning the wires.",
    priorArtLimitations: [
      "Low-resistance carbon rods (1–4 Ω) demanded massive, economically impossible copper cables.",
      "Imperfect mechanical vacuums left residual oxygen, causing carbon to combust in minutes.",
      "Mismatched thermal expansion between lead wires and glass caused vacuum envelopes to crack.",
      "Series arc circuits made whole lighting grids vulnerable to single-point failure.",
    ],
    breakthroughInsight:
      "Working with mathematician Francis Upton, Edison solved the electrical network equations ($P = V^2 / R$). He realized that increasing filament resistance from 1 Ω to 100 Ω reduced the line current tenfold, dropping $I^2R$ power losses in distribution wires a hundredfold. This allowed hundreds of lamps to operate independently in parallel off a standard 110-volt supply using thin, economical copper wiring.",
    patentWars: [
      {
        rivalName: "Joseph Swan (Britain), Sawyer-Man, and Westinghouse",
        rivalClaim:
          "In England, Sir Joseph Swan demonstrated carbon incandescent lamps before Edison and held British patents. In the US, William Sawyer and Albon Man patented carbonized paper filaments and sued Edison. Later, George Westinghouse acquired Sawyer-Man patents to compete against Edison General Electric.",
        conflictDetails:
          "In Britain, Edison and Swan settled out of court in 1883, forming the joint 'Ediswan' company. In the US, the litigation raged for over a decade, culminating in the landmark Supreme Court decision *The Incandescent Lamp Patent* (159 U.S. 465, 1895).",
        resolution:
          "The US Supreme Court ruled in Edison's favor, declaring Sawyer-Man's patent invalid because it claimed all fibrous materials without disclosing the specific high-resistance carbon filament and high-vacuum combination Edison perfected.",
        legalOutcome:
          "Edison's US Patent No. 223,898 was upheld as the foundational patent of the incandescent electric lamp.",
      },
    ],
    civilizationalImpact:
      "The incandescent lamp revolutionized human society, banishing nocturnal darkness and transforming cities, factories, offices, and homes. It extended the active human day, eliminated hazardous open-flame gas lighting, and launched the electrical utility industry, starting with Edison's historic Pearl Street Power Station in Lower Manhattan in 1882.",
    funFact:
      "Edison and his Menlo Park team tested over 6,000 different organic materials to find the ideal filament—including cedar, boxwood, coconut hair, fishing line, and even hair plucked from his associate's beard. Edison finally sent explorer William H. Moore to Japan, discovering a species of bamboo (*Madake*) that provided 1,200 hours of continuous illumination.",
    aftermath:
      "In 1892, J.P. Morgan orchestrated the merger of Edison General Electric with the Thomson-Houston Electric Company to form General Electric (GE). Carbon filaments remained the industry standard until GE researcher William D. Coolidge invented ductile tungsten filaments in 1910.",
    sideNotes: [
      "The standard screw base on modern light bulbs is known as the 'Edison Screw' (E26 in North America, E27 in Europe) and has remained largely unchanged since Edison designed it in 1880.",
      "While testing vacuum lamps in 1883, Edison noticed a mysterious current flowing from the filament to an inserted metal plate—the first observation of thermionic emission (the 'Edison Effect'), which later formed the foundation of vacuum tube electronics.",
    ],
  },
  tags: [
    "Thomas Edison",
    "Incandescent Lamp",
    "Light Bulb",
    "Electrification",
    "Materials Science",
    "High Vacuum",
    "19th Century",
    "General Electric",
  ],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
    patentWarYears: "1880–1895",
    impactScore: 100,
  },
};
