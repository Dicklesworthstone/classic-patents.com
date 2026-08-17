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
    "Howe's 1846 lockstitch: an eye-pointed needle (eye at the tip) throws a loop; a shuttle carries a second thread through that loop; a feed plate steps the cloth. The knot sits inside the fabric. Hand sewing put the whole remaining thread through every stitch; this machine does not.",
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
      "Domestic and industrial lockstitch machines still use an eye-pointed needle and a second-thread hook (the shuttle became a rotary hook). The 1856 Sewing Machine Combination is the case study every patent-pool course still assigns.",
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
        "Howe's lockstitch claim is what the 1856 Sewing Machine Combination licensed. That pool is the first large American patent pool.",
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
      "A tailor's needle carries the entire remaining thread through the cloth on every stitch. That motion does not scale. Ready-made clothing in the 1840s was still hand work; shirts were priced by the seamstress's hours, not by the yard of cloth.",
    priorArtLimitations: [
      "Thomas Saint's 1790 British patent is a chain-stitch drawing; it did not found an industry.",
      "Thimonnier's 1830 wooden chain-stitchers sewed French army kit until Paris tailors wrecked the shop in 1831.",
      "Walter Hunt built an eye-pointed needle and shuttle in the 1830s and never filed; that omission later became Howe's luck.",
    ],
    breakthroughInsight:
      "Two threads. The needle's eye is at the point so it can leave a loop below the cloth without pulling a spool through. A shuttle (borrowed from weaving) goes through that loop. The lock sits in the fabric, not on the surface, and does not ravel when you cut the end.",
    patentWars: [
      {
        rivalName: "Isaac Singer, and then the Sewing Machine Combination",
        rivalClaim:
          "Singer's straight needle, presser foot, and treadle were presented as a new machine. Hunt's unfiled 1830s work was waved as prior art.",
        conflictDetails:
          "Howe v. Underwood (1854) and related cases held that the lockstitch with an eye-pointed needle was Howe's. Singer kept selling and paid. In 1856 Howe, Singer, Wheeler & Wilson, and Grover & Baker formed the Sewing Machine Combination, the first major US patent pool.",
        resolution:
          "Members cross-licensed and collected a per-machine royalty, of which Howe took a fixed slice. He made on the order of two million dollars before the patents expired, a 19th-century fortune.",
        legalOutcome:
          "Howe's claims held. Hunt was found to have abandoned. The pool taught later industries how to stop suing and start shipping.",
      },
    ],
    civilizationalImpact:
      "Factory lockstitch dropped the price of a shirt and moved sewing from piecework rooms into plants (and later back into homes as a treadle appliance). The Combination is why 'patent pool' is a standard phrase.",
    funFact:
      "The cannibal-dream story (spears with holes at the tip) appears in later Howe lore. Treat it as family publicity. The mechanical argument for an eye at the point does not need the dream.",
    aftermath:
      "Howe served as a Union cavalry private and later officer, using some of the royalty money to equip the regiment. He died in 1867. Singer's name stayed on the domestic machine; Howe's stayed on the claim chart.",
    sideNotes: [
      "Howe built his first machine in Cambridge, pawned it, went to England to work for William Thomas, and came home poor. The US suits, not the first prototype, are how he was paid.",
      "A lockstitch uses roughly twice the thread of a chain stitch and does not pull out. That trade (thread cost vs. seam security) is why jeans still lockstitch.",
      "The Combination expired with the patents in the 1870s. After that, sewing-machine prices fell again.",
    ],
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
