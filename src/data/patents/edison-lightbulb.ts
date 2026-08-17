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
    "Edison's 1879 lamp is a high-resistance carbon filament ($R \\approx 100\\,\\Omega$) in a Sprengel vacuum, with platinum leads sealed through the glass. The resistance is the point: thousands of lamps can hang in parallel on modest copper instead of each needing a feeder the size of a gas main.",
  heroQuote:
    "The object of this invention is to produce electric lamps giving light by incandescence, which lamps shall have high resistance, so as to allow of the practical subdivision of the electric light...",
  originalPdfUrl: "/patents/pdfs/us-223898-edison-lightbulb.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US223898A/en",
  usptoClassification: "H01K 1/00 (Incandescent lamps)",
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
    ],
    scientificPrinciples: [
      {
        principle: "Joule Heating & High-Resistance Sub-Division",
        formula: "P = \\frac{V^2}{R} = I^2 R, \\quad I = \\frac{V}{R}",
        explanation:
          "By increasing filament resistance R from 1 Ω to 100 Ω, the current I required for identical radiant power drops by 90%, reducing power transmission losses in copper supply cables by 99% (P_{loss} = I^2 R_{wire}).",
      },
      {
        principle: "Planck Blackbody Radiation & Color Temperature",
        formula:
          "u(\\lambda, T) = \\frac{8\\pi h c}{\\lambda^5} \\frac{1}{e^{\\frac{hc}{\\lambda k_B T}} - 1}",
        explanation:
          "Heating the carbon filament to 2,200 K shifts its spectral emission curve into the visible spectrum, producing warm 2700K incandescent light.",
      },
      {
        principle: "High-Vacuum Mean Free Path & Kinetic Gas Theory",
        formula: "\\lambda_{mfp} = \\frac{k_B T}{\\sqrt{2} \\pi d^2 P}",
        explanation:
          "At 10⁻⁶ Torr, the molecular mean free path exceeds the dimensions of the glass bulb, preventing gas convection cooling and chemical degradation of the incandescent carbon.",
      },
    ],
    whyItMattersToday:
      "The socket, the parallel feeder, the meter, and the fuse box are the lamp's companions. LEDs changed the burner; they still hang on the distribution geometry this patent forced Edison to invent.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An electric lamp for giving light by incandescence, consisting of a filament of carbon of high resistance, made as described, and secured to metallic wires, as set forth.",
      plainEnglish:
        "The master apparatus claim covering any electric incandescent lamp using a high-resistance carbon filament connected to metal lead wires.",
      keyInnovations: [
        "High-resistance carbon filament",
        "Incandescent filament geometry",
        "Mechanical lead-in wire clamping",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination of carbon filaments with a receiver made entirely of glass and conductors passing through the glass, and from which receiver the air is exhausted, for the purposes set forth.",
      plainEnglish:
        "Covers the combination of a carbon filament inside an all-glass vacuum bulb with sealed conductors passing through the glass.",
      keyInnovations: [
        "All-glass vacuum enclosure",
        "Hermetic glass-to-wire seal",
        "High-vacuum preservation of carbon",
      ],
    },
    {
      number: 3,
      isIndependent: false,
      originalText:
        "A carbon filament or strip coiled and connected to electric conductors so that only a portion of the surface radiates light, as set forth.",
      plainEnglish:
        "Covers coiled or folded filament configurations that concentrate heat and increase effective luminous efficacy.",
      keyInnovations: [
        "Coiled filament geometry",
        "Reduced radiative surface cooling",
        "Higher core temperature",
      ],
    },
    {
      number: 4,
      isIndependent: false,
      originalText:
        "The method herein described of securing the conductors to the carbon filament and forming the malleable contact, as set forth.",
      plainEnglish:
        "The manufacturing method for securing platinum lead wires to fragile carbonized organic filaments.",
      keyInnovations: [
        "Carbon-to-metal junction engineering",
        "Thermal expansion compatibility",
        "Manufacturing process for mass production",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Elevation View of Edison Incandescent Lamp",
      caption:
        "Full elevation showing the hand-blown glass globe, horseshoe carbon filament, inner glass stem mount, platinum lead-in wires, and sealed exhaust tip.",
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
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Brush and Jablochkoff arc lamps were street tools: thousands of candlepower, a hiss, and nitric fumes. They could not sit on a desk. Earlier incandescent rods (Starr, Sawyer, Swan) were a few ohms. Feeding a city of them in parallel would have required copper on the scale of a gasworks. The lamp and the feeder were one design problem.",
    priorArtLimitations: [
      "Low-resistance carbon rods (1–4 Ω) demanded uneconomic copper sections.",
      "Poor vacuums oxidized the carbon and blackened the bulb in minutes.",
      "Platinum-to-glass seals cracked when the expansion coefficients missed.",
      "Series arc circuits put every lamp on one failure chain.",
    ],
    breakthroughInsight:
      "Raise each lamp to about 100 Ω. Then $I = V/R$ per lamp is small, $I^2R$ in the street mains stays tolerable, and you can hang lamps in parallel the way gas jets hang on a pipe. The Sprengel pump and the carbonized sewing-thread (later bamboo) filament were how he hit that resistance and kept it from burning.",
    patentWars: [
      {
        rivalName: "Joseph Swan, Sawyer–Man, and Heinrich Goebel claimants",
        rivalClaim:
          "Swan had British carbon-lamp patents and a working demonstration. Sawyer–Man claimed broad US rights in carbonized paper. Later litigants waved Goebel's 1850s bottles.",
        conflictDetails:
          "In Britain, Edison and Swan merged into Ediswan rather than litigate to death. In the United States the Sawyer–Man interest fought through to the Supreme Court.",
        resolution:
          "The Incandescent Lamp Patent, 159 U.S. 465 (1895), held Sawyer–Man's claim to any 'fibrous or textile material' invalid as too broad. Edison's specific high-resistance carbon filament in high vacuum survived.",
        legalOutcome:
          "US 223,898 held. The British fight ended in a joint company, not a winner-take-all decree.",
      },
    ],
    civilizationalImpact:
      "Pearl Street (1882) sold light by the hour. Once the feeder math worked, generating stations had a load that paid for the copper. Gas mantles did not vanish overnight; they lost the indoor evening.",
    funFact:
      "The Menlo Park notebooks list thousands of carbonized candidates: woods, flax, horsehair, fishing line, and at least one assistant's beard. The 1,200-hour lamp that went on sale used Japanese bamboo, chosen after a worldwide fiber hunt, not after a single lucky night.",
    aftermath:
      "Edison General Electric merged into GE in 1892. The carbon lamp lasted commercially into the tungsten era (Coolidge, 1910). The parallel-feeder idea outlived every filament chemistry.",
    sideNotes: [
      "Francis Upton, a Princeton mathematician, did much of the Ohm's-law arithmetic that convinced Edison the high-resistance path was the only path that could be sold.",
      "The first public Menlo Park demonstration was 31 December 1879. The US patent issued 27 January 1880. Pearl Street did not open until 4 September 1882.",
      "Swan's British lamps were real. Treating Edison as the sole inventor of incandescence is American courtroom history, not laboratory history. His contribution is the high-R, high-vacuum, parallel-grid package.",
    ],
  },
};
