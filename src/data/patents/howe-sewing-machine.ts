import type { Patent } from "@/types/patent";

export const howeSewingMachinePatent: Patent = {
  id: "us-4750-howe-sewing-machine",
  patentNumber: "US 4,750",
  title: "Improvement in Sewing-Machines",
  shortTitle: "Howe's Lockstitch Sewing Machine",
  subtitle:
    "The Eye-Pointed Needle and Reciprocating Shuttle Mechanism Creating the Two-Thread Lockstitch",
  inventors: ["Elias Howe Jr."],
  inventorLocation: "Cambridge, Massachusetts",
  grantDate: "1846-09-10",
  filingDate: "1845-09-22",
  era: "Industrial Dawn (1840–1870)",
  category: "consumer",
  categoryLabel: "Precision Mechanical Machinery",
  summary:
    "The foundation of the modern garment industry: Elias Howe Jr.'s invention of the eye-pointed needle and synchronized reciprocating shuttle, producing an unbreakable two-thread lockstitch that replaced millennia of agonizing hand sewing.",
  heroQuote:
    "Be it known that I, Elias Howe, Jr., of Cambridge, in the County of Middlesex and State of Massachusetts, have invented a new and useful Machine for Sewing Seams in Cloth, Leather, and other substances...",
  originalPdfUrl: "/patents/pdfs/us-4750-howe-sewing-machine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4750A/en",
  usptoClassification: "D05B 1/02 (Sewing machines; lockstitch forming)",
  originalText: `UNITED STATES PATENT OFFICE.
ELIAS HOWE, JR., OF CAMBRIDGE, MASSACHUSETTS.

IMPROVEMENT IN SEWING-MACHINES.

Specification forming part of Letters Patent No. 4,750, dated September 10, 1846.

To all whom it may concern:
Be it known that I, ELIAS HOWE, JR., of Cambridge, in the County of Middlesex and State of Massachusetts, have invented a new and useful Machine for Sewing Seams in Cloth, Leather, and other substances; and I do hereby declare that the following is a full and exact description thereof.

In sewing a seam with my machine two threads are employed, one of which threads is carried through the fabric by a curved needle having an eye in or near its point, and the other thread is contained within a shuttle that passes through the loop formed by the needle-thread.

The cloth to be sewed is suspended from a series of pins projecting from a baseler plate or holding bar, which is moved intermittently by a pinion engaging with a rack on the plate, so as to feed the fabric forward at each stitch.

The curved needle is mounted upon a vibrating arm actuated by a cam on the main driving shaft. As the needle penetrates the cloth and begins to retreat, the thread bows out and forms a loop on the reverse side. The shuttle, carrying its bobbin of thread, is thrown through this loop by a reciprocating driver. Upon the complete withdrawal of the needle, both threads are drawn tight, forming a locked stitch in the center of the seam.`,
  plainEnglishExplanation: {
    overview:
      "For thousands of years, every garment, shoe, and sail was made by hand with a simple needle and thread. Elias Howe realized that trying to mechanically copy hand sewing was a dead end. Instead of pulling a long thread all the way through fabric, he invented a two-thread system: an upper thread pushed through by an eye-pointed needle, and a lower thread carried by a flying shuttle that shoots through the loop to lock the stitch.",
    coreMechanism:
      "A curved needle with the eye placed near its pointed tip penetrates the fabric, carrying an upper thread. As the needle begins its upward stroke, fabric friction causes the upper thread to bow outward into an open loop. A bullet-shaped shuttle carrying a bobbin of lower thread shoots through the loop, locking the threads in the middle of the fabric.",
    mechanicalBreakdown: [
      {
        title: "Eye-Pointed Curved Needle",
        summary: "A needle with the eye located at the pointed piercing tip.",
        technicalDetails:
          "Pushes a loop of upper thread through the workpiece without having to pull the entire remaining spool through the cloth on each stroke.",
        archaicTerm: "Curved needle with eye near the point",
        modernEquivalent: "Industrial machine sewing needle",
      },
      {
        title: "Reciprocating Shuttle & Internal Bobbin",
        summary: "A sliding shuttle carrying lower thread that flies through the needle loop.",
        technicalDetails:
          "Synchronized by cam linkage to pass through the dilated upper thread loop at maximum expansion, cinching both threads into a knot within the fabric neutral axis.",
        archaicTerm: "Shuttle carrying second thread",
        modernEquivalent: "Rotary hook bobbin assembly",
      },
      {
        title: "Intermittent Baseler Cloth Feed",
        summary: "A pinned plate advancing the cloth by exact stitch pitch increments.",
        technicalDetails:
          "Engages a rack-and-pinion feed during needle retraction, translating the fabric automatically at up to 300 stitches per minute.",
        archaicTerm: "Baseler plate with pins",
        modernEquivalent: "Four-motion feed dog mechanism",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Lockstitch Knot Friction & Interlooping",
        formula: "T_{knot} = \\mu \\cdot (T_{upper} + T_{lower}) \\cdot e^{\\pi \\theta}",
        explanation:
          "The upper and lower threads interlock at the midpoint of the fabric thickness, resisting unraveling even if an adjacent stitch is cut.",
      },
      {
        principle: "Kinematic Stitch Throughput",
        formula: "v_{feed} = f_{stitch} \\cdot \\lambda_{pitch}",
        explanation:
          "Operating at 300 stitches per minute, Howe's machine produced seams ten times faster than the fastest human seamstress.",
      },
    ],
    whyItMattersToday:
      "Howe's lockstitch is used in virtually all modern sewing machines, automated embroidery systems, robotic textile assemblers, and aerospace composite carbon-fiber preform stitchers.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The forming of the seam by carrying a thread through the cloth by means of a curved needle having the eye in its point, and the passing of a shuttle carrying a second thread through the loop formed by the needle-thread, substantially as described.",
      plainEnglish:
        "The historic master claim protecting the creation of a seam using an eye-pointed needle to form a loop and a shuttle carrying a second thread passing through that loop.",
      keyInnovations: [
        "Eye-pointed needle",
        "Two-thread lockstitch",
        "Reciprocating shuttle through needle loop",
      ],
      legalSignificance:
        "The master patent that spawned the 1856 Sewing Machine Combination—America's very first industrial patent pool—and secured Howe's legacy.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective View of Howe Lockstitch Sewing Machine",
      caption:
        "Schematic drawing showing the hand flywheel, cam drives, curved vibrating needle, and reciprocating shuttle.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Eye-Pointed Needle",
          description: "Curved needle with thread eye at the piercing point.",
          x: 45,
          y: 40,
        },
        {
          id: "hw-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Shuttle Race",
          description: "Reciprocating shuttle track holding the lower bobbin.",
          x: 55,
          y: 65,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "For millennia, all human clothing and textiles were stitched by hand needle. Hand sewing was agonizingly slow, physically debilitating, and severely restricted textile manufacturing productivity.",
    priorArtLimitations: [
      "Thomas Saint chain-stitch machine (1790, single thread, easily unraveled).",
      "Barthélemy Thimonnier wooden machines (1830, destroyed by rioting French tailors).",
      "Hand-sewing needles requiring the full thread length to pass through fabric on every stitch.",
    ],
    breakthroughInsight:
      "Howe realized that mechanical sewing required two independent threads: an upper thread pushed through by an eye-pointed needle to form a loop, and a lower thread carried by a flying shuttle through the loop to cinch the seam permanently.",
    patentWars: [
      {
        rivalName: "Isaac Merritt Singer & The Sewing Machine Combination",
        rivalClaim:
          "Singer argued his straight needle and foot treadle machine was an independent invention.",
        conflictDetails:
          "In 1854, federal courts ruled that Singer and all competitors infringed Howe's master lockstitch claim. In 1856, Howe, Singer, Wheeler & Wilson, and Grover & Baker formed the Sewing Machine Combination—the first patent pool in U.S. history.",
        resolution:
          "Manufacturers agreed to license Howe's master patent, paying him a royalty on every sewing machine sold in America.",
        legalOutcome:
          "Howe earned over $2 million in royalties, becoming one of the wealthiest inventors of the 19th century.",
      },
    ],
    civilizationalImpact:
      "Industrialized global garment manufacturing, drastically reduced the cost of clothing, transformed female employment, and established the legal blueprint for modern patent licensing pools.",
    funFact:
      "Howe reportedly dreamed he was captured by a tribe of cannibals who brandished spears with holes at their tips—inspiring him to place the needle's eye at the point.",
  },
  tags: [
    "Elias Howe",
    "Sewing Machine",
    "Textiles",
    "Lockstitch",
    "Patent Pool",
    "Industrial Revolution",
  ],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1846–1856",
    impactScore: 98,
  },
};
