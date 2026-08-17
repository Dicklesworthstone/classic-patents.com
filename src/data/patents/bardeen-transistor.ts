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
      "ENIAC's 18,000 tubes failed by the hour. A long-distance telephone repeater was a rack of hot glass. Shockley's first field-effect attempts at Bell Labs did nothing; surface states trapped the charge. The Labs needed a solid amplifier that did not burn a filament.",
    priorArtLimitations: [
      "de Forest Audions and later pentodes: gain, heat, and a vacuum pump in the supply chain.",
      "Braun cat's-whisker diodes rectify; they do not amplify.",
      "Lilienfeld's 1920s FET patents were paper. Nobody could make the surface clean enough.",
    ],
    breakthroughInsight:
      "16 December 1947: two gold contacts, a sliver of n-germanium, a forward-biased emitter injecting holes, a reverse-biased collector a few tens of microns away. Minority-carrier injection, not the FET Shockley had wanted. Brattain and Bardeen had a working point-contact amplifier. Shockley went home furious and invented the junction transistor on paper.",
    patentWars: [
      {
        rivalName: "William Shockley (inside the same lab)",
        rivalClaim:
          "Shockley wanted his name first and a device that was his theory. The attorneys gave the point-contact patent to Bardeen and Brattain (US 2,524,035). Shockley took the junction sandwich (US 2,569,347).",
        conflictDetails:
          "The personal break never healed. Shockley left to found Shockley Semiconductor; the traitorous eight left him. Bardeen left for Illinois and a second Nobel in superconductivity.",
        resolution:
          "The 1956 Nobel went to all three. Bell licensed the transistor package for $25,000 to anyone who would come to the 1952 symposium, which is why the industry is not a single-company museum.",
        legalOutcome:
          "Two patents, three names, one prize. The junction device, not the point-contact whisker, is what Fairchild later planarized.",
      },
    ],
    civilizationalImpact:
      "Repeaters shrank. Computers stopped being air-conditioned tube barns. Everything after Noyce assumes this solid-state gain stage.",
    funFact:
      "They called it a surface-states amplifier until John R. Pierce suggested 'transistor' (transfer + varistor). The lab notebook drawing is a triangle of germanium and two pieces of gold foil on a paper clip.",
    aftermath:
      "Point-contact transistors were noisy and mechanically fragile. They sold for a few years. The junction and then the silicon planar FET ate them. The 1947 lunch-table demo is still the origin story because it was the first solid gain that worked.",
    sideNotes: [
      "Walter Brattain did the surface physics with his hands. John Bardeen did the theory of the inversion layer and then of the injection. Shockley managed, then competed.",
      "The 1952 Bell transistor symposium's $25,000 ticket is one reason Tokyo and Palo Alto both had a legal starting point.",
    ],
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
