import type { Patent } from "@/types/patent";

export const bardeenTransistorPatent: Patent = {
  id: "us-2569347-bardeen-transistor",
  patentNumber: "US 2,569,347",
  title: "Three-Electrode Circuit Element Utilizing Semiconductive Materials",
  shortTitle: "Bardeen & Brattain's Point-Contact Transistor",
  subtitle:
    "The Solid-State Semiconductor Amplifier that Replaced Vacuum Tubes and Founded Modern Microelectronics",
  inventors: ["John Bardeen", "Walter H. Brattain"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1951-10-03",
  filingDate: "1948-06-17",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Solid-State Physics & Semiconductors",
  summary:
    "The most important electronic invention of the 20th century: John Bardeen and Walter Brattain's point-contact transistor at Bell Labs, which demonstrated solid-state current and power amplification in germanium with zero heated vacuum filaments.",
  heroQuote:
    "Be it known that we, John Bardeen and Walter H. Brattain, citizens of the United States, residing at Summit and Morristown, in the County of Morris and State of New Jersey, have invented certain new and useful Improvements in Three-Electrode Circuit Elements...",
  originalPdfUrl: "/patents/pdfs/us-2569347-bardeen-transistor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2569347A/en",
  usptoClassification: "H01L 29/00 (Semiconductor devices; transistors)",
  originalText: `UNITED STATES PATENT OFFICE.
JOHN BARDEEN AND WALTER H. BRATTAIN, OF SUMMIT AND MORRISTOWN, NEW JERSEY, ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, OF NEW YORK, N. Y., A CORPORATION OF NEW YORK.

THREE-ELECTRODE CIRCUIT ELEMENT UTILIZING SEMICONDUCTIVE MATERIALS.

Application June 17, 1948, Serial No. 33,466.
Patent No. 2,569,347. Patented Oct. 3, 1951.

To all whom it may concern:
Be it known that we, JOHN BARDEEN and WALTER H. BRATTAIN, citizens of the United States, residing at Summit and Morristown, in the County of Morris and State of New Jersey, have invented certain new and useful Improvements in Three-Electrode Circuit Elements Utilizing Semiconductive Materials, of which the following is a specification.

This invention relates to novel circuit elements and methods utilizing semiconductive materials for the amplification and control of electric currents.

Prior to our invention, the amplification of electrical signals was accomplished almost entirely by thermionic vacuum tubes. Such tubes require power to heat a cathode filament, produce substantial heat, and have a limited operating life due to filament deterioration.

In accordance with our invention, electrical amplification is accomplished by a solid-state device comprising a block of semiconductive material, such as germanium, having a base electrode making a low-resistance ohmic connection therewith, and two rectifying point contacts, termed the emitter and collector, bearing against a surface of the block and spaced apart by a very small distance, on the order of a few thousandths of an inch.

When the emitter contact is biased in the forward (low resistance) direction and the collector contact is biased in the reverse (high resistance) direction, a signal voltage applied to the emitter causes an emission of carriers into the semiconductor which flow to the collector, causing corresponding and amplified changes in the collector current.`,
  plainEnglishExplanation: {
    overview:
      "Before December 1947, all signal amplification required bulky, fragile glass vacuum tubes with glowing red-hot filaments that consumed lots of electricity and burned out frequently. Bardeen and Brattain discovered that two tiny gold contacts touching a crystal of germanium just 50 microns apart could amplify an electrical signal inside a solid crystal at room temperature with zero warmup time.",
    coreMechanism:
      "An n-type germanium crystal has an ohmic base electrode. Two gold-leaf point contacts (emitter and collector) sit on the top surface. Forward-biasing the emitter injects minority 'holes' into the crystal. These holes drift into the reverse-biased collector space-charge depletion zone, modulating the collector current with massive power gain ($A_p = A_v \\cdot A_i$).",
    mechanicalBreakdown: [
      {
        title: "Germanium Semiconductor Crystal Base",
        summary: "A crystal block of high-purity n-type germanium with ohmic base contact.",
        technicalDetails:
          "Supplies conduction electrons and supports a surface inversion layer for hole diffusion and drift.",
        archaicTerm: "Block of semiconductive material",
        modernEquivalent: "Semiconductor substrate / base region",
      },
      {
        title: "Emitter Point-Contact Electrode",
        summary: "A sharp gold foil contact biased in the low-resistance forward direction.",
        technicalDetails:
          "Injects minority carrier holes ($p$) directly into the semiconductor crystal lattice ($I_E = I_p + I_n$).",
        archaicTerm: "First point electrode / Emitter",
        modernEquivalent: "Transistor emitter terminal",
      },
      {
        title: "Collector Point-Contact Electrode",
        summary: "A second sharp contact spaced 50 microns away, biased in reverse direction.",
        technicalDetails:
          "Collects injected holes with high current collection efficiency $\\alpha = \\Delta I_C / \\Delta I_E \\approx 1.0$, producing large output voltage swings across high load resistance.",
        archaicTerm: "Second point electrode / Collector",
        modernEquivalent: "Transistor collector terminal",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Minority Carrier Injection & Transistor Action",
        formula:
          "\\alpha = \\left(\\frac{\\partial I_C}{\\partial I_E}\\right)_{V_C} \\approx 0.98, \\quad G_{power} = \\alpha^2 \\cdot \\frac{R_{load}}{R_{in}}",
        explanation:
          "Holes injected by the forward-biased emitter modulate the conductivity of the reverse-biased collector junction, generating substantial power gain.",
      },
      {
        principle: "Ambipolar Carrier Drift & Diffusion",
        formula: "J_p = -q D_p \\nabla p + q \\mu_p p \\vec{E}",
        explanation:
          "Hole current flows through the base region via a combination of concentration gradient diffusion and electric field drift.",
      },
    ],
    whyItMattersToday:
      "The point-contact transistor is the ancestor of every modern bipolar junction transistor (BJT) and field-effect transistor (MOSFET) operating inside billions of microprocessors, AI accelerator chips, smartphones, and computers today.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A circuit element which comprises a block of semiconductive material, a base electrode making low-resistance contact with said block, and two point electrodes making rectifier contact with a surface of said block, said point electrodes being spaced apart by a distance of the order of a few mils.",
      plainEnglish:
        "The master claim defining a three-terminal solid-state circuit element with a semiconductor block, base electrode, and two point-contact electrodes spaced a few thousandths of an inch apart.",
      keyInnovations: [
        "Three-terminal solid-state amplifier",
        "Minority carrier hole injection",
        "Point-contact emitter/collector spacing",
      ],
      legalSignificance:
        "Foundational patent that demonstrated the physical transistor effect, leading to the 1956 Nobel Prize in Physics.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Point-Contact Transistor Assembly",
      caption:
        "Schematic drawing showing the germanium wedge, base electrode, and plastic wedge holding emitter and collector point contacts.",
      svgType: "bardeen-transistor",
      callouts: [
        {
          id: "bt-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Germanium Crystal",
          description: "High-purity n-type germanium crystal block.",
          x: 50,
          y: 60,
        },
        {
          id: "bt-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Point Contacts",
          description: "Microscopic emitter and collector gold-leaf contacts.",
          x: 50,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Telecommunication repeaters and early computers like ENIAC required thousands of fragile vacuum tubes that generated tremendous heat, consumed huge amounts of power, and failed constantly due to filament burnout.",
    priorArtLimitations: [
      "Thermionic triode vacuum tubes (Lee de Forest Audion).",
      "Point-contact crystal diode rectifiers (Ferdinand Braun cat's whisker, zero amplification).",
      "Field-effect theoretical concepts that could not be fabricated due to surface state traps.",
    ],
    breakthroughInsight:
      "Bardeen and Brattain discovered that forward-biasing a microscopic emitter point contact on germanium injected minority holes directly into the crystal, allowing a nearby reverse-biased collector point contact to collect the carriers with substantial power gain.",
    patentWars: [
      {
        rivalName: "William Shockley & The Junction Transistor",
        rivalClaim:
          "Shockley sought sole patent credit for the transistor, leading to internal friction at Bell Labs.",
        conflictDetails:
          "Bell Labs patent attorneys determined that Bardeen and Brattain were the legal inventors of the physical point-contact device. Shockley subsequently invented the theoretical junction sandwich transistor (US Patent No. 2,569,347 vs US 2,502,488).",
        resolution: "All three shared the 1956 Nobel Prize in Physics in Stockholm.",
        legalOutcome:
          "Bell Labs licensed the transistor patent widely for a nominal $25,000 fee, fostering the Silicon Valley semiconductor boom.",
      },
    ],
    civilizationalImpact:
      "Replaced vacuum tubes, launched solid-state electronics, enabled digital computing, satellite communications, and modern microprocessors.",
    funFact:
      "The team initially called their invention a 'surface states amplifier'. The name 'transistor' was coined by Bell Labs engineer John R. Pierce as a portmanteau of 'transconductance' (or 'transfer') and 'varistor'.",
  },
  tags: [
    "Transistor",
    "Semiconductors",
    "Bell Labs",
    "Nobel Prize",
    "Germanium",
    "Microelectronics",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1948–1956",
    impactScore: 100,
  },
};
