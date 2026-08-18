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
    "The Machine That Clothed the World: In 1846, Elias Howe Jr. patented the two-thread lockstitch sewing machine. By abandoning attempts to mimic manual hand sewing, Howe placed the thread eye at the pointed tip of a curved reciprocating needle. As the needle pierced the cloth and slightly retracted, fabric friction dilated a thread loop beneath the seam; a bullet-shaped shuttle shot through the loop with a second bobbin thread, interlocking the two threads at the center of the fabric. Howe's lockstitch sparked the Sewing Machine Combination of 1856—the first modern patent pool in industrial history.",
  heroQuote:
    "Be it known that I, Elias Howe, Jr., of Cambridge, in the County of Middlesex and State of Massachusetts, have invented a new and useful Machine for Sewing Seams in Cloth, Leather, and other substances...",
  originalPdfUrl: "/patents/pdfs/us-4750-howe-sewing-machine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4750A/en",
  usptoClassification: "D05B 1/02 (Sewing machines; lockstitch forming)",
  originalTextAsset: {
    url: "/patents/transcripts/us-4750-howe-sewing-machine.txt",
    pageCount: 6,
    kind: "reviewed-transcription",
  },
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
      "For over twenty thousand years, human clothing was stitched exclusively by hand: a seamstress pushed a needle through fabric and pulled the entire length of thread through with every individual stitch. Early inventors failed because they attempted to mechanize this hand motion. Elias Howe Jr. achieved a historic breakthrough by abandoning hand sewing entirely. He placed the eye of the needle at its piercing tip and introduced a second thread carried inside a flying shuttle. When the needle pushes through cloth and begins to retract, the upper thread bows out into an open loop; the shuttle shoots through that loop, creating a permanent knot buried invisibly inside the fabric thickness.",
    coreMechanism:
      "A curved needle with an eye at its sharp point is driven by a cam linkage through the workpiece. As the needle reaches bottom dead center and begins its upward stroke, friction between the thread and fabric forces the upper thread to buckle outward, forming an open teardrop loop. A reciprocating steel shuttle carrying a bobbin of lower thread is thrown through the open loop by a synchronized cam driver. As the needle retracts completely, both threads are cinched tight with balanced tension ($T_{upper} \\approx T_{lower}$), embedding the interlock knot precisely at the neutral axis of the cloth layers.",
    mechanicalBreakdown: [
      {
        title: "Eye-Pointed Curved Needle",
        summary: "A steel needle with the thread eye placed near its sharp piercing point.",
        technicalDetails:
          "Pushes a loop of upper thread through the fabric without pulling the entire thread spool through, reducing thread friction and eliminating yarn breakage at high speeds ($300\\text{ SPM}$).",
        archaicTerm: "Curved needle with eye near the point",
        modernEquivalent: "Industrial lockstitch sewing machine needle",
      },
      {
        title: "Reciprocating Shuttle & Internal Bobbin",
        summary:
          "A bullet-shaped steel shuttle carrying a second spool of thread through the loop.",
        technicalDetails:
          "Guided along a machined curved race, the shuttle passes cleanly through the dilated upper thread loop before needle withdrawal, locking the stitch permanently against raveling.",
        archaicTerm: "Shuttle carrying second thread in race",
        modernEquivalent: "Rotary hook and bobbin case assembly",
      },
      {
        title: "Intermittent Baseler Cloth Feed",
        summary: "A pinned plate advancing the cloth by exact stitch pitch increments.",
        technicalDetails:
          "Rack-and-pinion feed indexed by a pawl mechanism during needle retraction, translating the fabric automatically at up to 300 stitches per minute with uniform seam pitch ($p_{stitch}$).",
        archaicTerm: "Baseler plate with pins and rack",
        modernEquivalent: "Four-motion drop feed dog mechanism",
      },
      {
        title: "Synchronized Cam Drive & Tension Take-Up Lever",
        summary: "Grooved face cams on the main shaft coordinating needle and shuttle timing.",
        technicalDetails:
          "Maintains strict phase synchronization ($\\Delta t < 5\\text{ ms}$) between needle loop expansion and shuttle transit, cinching thread tension as the needle reaches top dead center.",
        archaicTerm: "Grooved cams and thread-tightening levers",
        modernEquivalent: "Precision rotary timing cams & dynamic take-up lever",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Lockstitch Capstan Knot Equilibrium",
        formula:
          "T_{upper} \\cdot e^{\\mu \\theta_{1}} = T_{lower} \\cdot e^{\\mu \\theta_{2}}, \\quad \\theta_1 = \\theta_2 = \\pi",
        explanation:
          "Balancing upper and lower thread tensions locks the interloop knot at the exact midpoint of fabric thickness, maximizing seam shear strength and preventing surface puckering.",
      },
      {
        principle: "Eye-Pointed Needle Loop Dilation Dynamics",
        formula:
          "\\delta_{loop} = h_{retract} \\cdot \\left(1 - \\frac{\\mu_{needle/thread}}{\\mu_{fabric/thread}}\\right) > w_{shuttle}",
        explanation:
          "As the needle retreats by $h_{retract}$, higher friction against the cloth holds the thread stationary while the needle eye slips, bowing out a loop wider than the shuttle body ($w_{shuttle}$).",
      },
      {
        principle: "Harmonic Cam Kinematic Acceleration Profile",
        formula:
          "y(t) = \\frac{h}{2}\\left(1 - \\cos(\\omega t)\\right), \\quad a_{max} = \\frac{h \\omega^2}{2} = \\frac{h (2\\pi f_{rpm})^2}{2}",
        explanation:
          "Harmonic face cams smoothly accelerate the needle arm and shuttle without shock loads, enabling sewing speeds ten times faster than human hands.",
      },
      {
        principle: "Continuous Linear Seam Throughput Rate",
        formula:
          "v_{seam} = f_{stitch} \\cdot p_{pitch} = \\frac{\\text{SPM}}{60} \\cdot p_{stitch}",
        explanation:
          "At 300 stitches per minute and a 2.5 mm pitch, Howe's machine produced 75 cm of finished seam per minute, reducing garment construction time from 14 hours to 1 hour.",
      },
      {
        principle: "Seam Tensile Shear Resistance & Interlock Security",
        formula:
          "\\sigma_{seam} = 2 \\cdot N_{stitches/cm} \\cdot F_{thread\\_tensile} \\cdot \\cos(\\phi)",
        explanation:
          "Because each lockstitch knot is independent, cutting or breaking one stitch does not cause the seam to run or unravel, unlike chain stitches.",
      },
    ],
    whyItMattersToday:
      "Every modern garment, automotive seat, leather shoe, and aerospace spacesuit is constructed using the two-thread lockstitch principle Howe patented in 1846. Furthermore, the 1856 Sewing Machine Combination formed to cross-license Howe's patent became the blueprint for modern patent pools, including standard-essential patent pools for MPEG, Wi-Fi, and 5G cellular technologies.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The forming of the seam by carrying a thread through the cloth by means of a curved needle on the end of a vibrating arm, and the passing of a shuttle furnished with its bobbin, in the manner set forth, between the needle and the thread which it carries under a combination and arrangement of parts substantially the same with that described.",
      plainEnglish:
        "The historic master claim protecting the formation of a seam using an eye-pointed needle on a vibrating arm to pass a thread loop through cloth, combined with a shuttle carrying a second bobbin thread passing through that loop to lock the stitch.",
      keyInnovations: [
        "Eye-pointed needle mechanism",
        "Two-thread lockstitch formation",
        "Reciprocating shuttle through needle loop",
      ],
      legalSignificance:
        "The foundational claim of mechanical sewing. Upheld in *Howe v. Underwood* (1854), forcing Isaac Singer and all other competitors to pay Howe royalties on every machine built.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The lifting of the thread that passes through the needle-eye by means of the lifting-rod W, for the purpose of forming a loop of loose thread that is to be subsequently drawn in by the passage of the shuttle, as herein fully described, said lifting-rod being furnished with a lifting-pin, u, and governed in its motions by the guide-pieces and other devices, arranged and operating substantially as described.",
      plainEnglish:
        "Claims the synchronized thread take-up and lifting-rod mechanism that forms slack thread into an open loop for shuttle transit and cinches the thread tight after the shuttle passes.",
      keyInnovations: [
        "Thread loop lifting mechanism",
        "Guided cam-driven lifting pin",
        "Controlled slack and tension timing",
      ],
      legalSignificance:
        "Protected the mechanical tensioning linkages that prevented loose or tangled thread loops during high-speed sewing.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The holding of the thread that is given out by the shuttle, so as to prevent its unwinding from the shuttle-bobbin after the shuttle has passed through the loop, said thread being held by means of the lever or clipping-piece f, as herein made known, or in any other manner that is substantially the same in its operation and result.",
      plainEnglish:
        "Claims a shuttle friction brake and clipping lever that prevents the lower bobbin from over-spinning and dumping excess slack thread as the shuttle passes through the loop.",
      keyInnovations: [
        "Shuttle bobbin friction brake",
        "Clipping tension lever",
        "Anti-backlash thread control",
      ],
      legalSignificance:
        "Essential for preventing birdnesting and jammed threads inside the enclosed shuttle race.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The manner of arranging and combining the small lever m' n' with the sliding box M, in combination with the spring-piece z, for the purpose of tightening the stitch as the needle is retracted, as described.",
      plainEnglish:
        "Claims the spring-loaded tensioning linkage that draws the stitch tight at the precise instant the needle retracts from the cloth.",
      keyInnovations: [
        "Spring-loaded stitch tightener",
        "Sliding shuttle box linkage",
        "Dynamic stitch tightening cycle",
      ],
      legalSignificance: "Secured uniform stitch tension across varying fabric thicknesses.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "The holding of the cloth to be sewed by the use of a baster-plate furnished with points for that purpose, and with holes enabling it to operate as a rack in the manner set forth, thereby carrying the cloth forward and dispensing altogether with the necessity of basting the parts together.",
      plainEnglish:
        "Claims the pinned metal feed plate that securely grips the fabric edges and advances them stitch by stitch using a rack-and-pinion drive, eliminating preliminary hand basting.",
      keyInnovations: [
        "Pinned baster feed plate",
        "Rack-and-pinion intermittent cloth advance",
        "Elimination of manual basting pins",
      ],
      legalSignificance:
        "The first automatic fabric feed mechanism in sewing machine patent history.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Side Elevation of Howe Lockstitch Sewing Machine",
      caption:
        "Side elevation blueprint showing the hand flywheel, cam-driven vibrating needle arm, eye-pointed needle, and lower reciprocating shuttle race.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Eye-Pointed Needle",
          description: "Curved needle with thread eye at the sharp piercing point.",
          x: 45,
          y: 40,
        },
        {
          id: "hw-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Reciprocating Shuttle Race",
          description: "Machined track holding the flying shuttle and lower bobbin.",
          x: 55,
          y: 65,
        },
        {
          id: "hw-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Pinned Baster Feed Plate",
          description: "Rack-and-pinion plate advancing fabric incrementally per stitch.",
          x: 40,
          y: 55,
        },
        {
          id: "hw-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Main Camshaft & Flywheel",
          description: "Rotary drive coordinating needle vibration and shuttle transit timing.",
          x: 75,
          y: 45,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Detail of Lockstitch Formation at Needle Retraction",
      caption:
        "Cross section showing how the eye-pointed needle dilates the upper thread loop, allowing the shuttle to carry the lower bobbin thread through.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Dilated Thread Loop",
          description: "Open upper thread loop created by friction as needle begins upward stroke.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Throughout human history until the 1840s, every stitch in every piece of clothing, sail, and leather shoe was hand-sewn with needle and thread. A skilled seamstress required 14 hours to sew a single dress shirt by hand. Ready-made clothing was nonexistent for ordinary workers, and garments were valued by the seamstress's grueling labor hours rather than the cost of cloth.",
    priorArtLimitations: [
      "Thomas Saint (1790) patented a single-thread chain-stitcher that easily unraveled with a single pull on the thread end.",
      "Barthélemy Thimonnier (1830) built wooden chain-stitch machines in Paris to sew French army uniforms, but terrified tailors rioted, broke into his factory, and destroyed all 80 machines.",
      "Walter Hunt (1834) built a two-thread lockstitch machine in New York but refused to patent it, fearing it would throw thousands of poor seamstresses out of work.",
    ],
    breakthroughInsight:
      "Howe realized that copying hand sewing (pulling a long trailing thread completely through cloth) was a mechanical impossibility at high speed. By placing the eye at the needle point and pairing it with a second bobbin thread inside a shuttle, the needle only needed to penetrate a few millimeters to throw an open loop. The lockstitch placed the knot securely inside the cloth where it could never unravel.",
    patentWars: [
      {
        rivalName: "Isaac Merritt Singer and The Sewing Machine War",
        rivalClaim:
          "In 1850, Isaac Singer saw a broken Blodgett & Lerow machine and improved it with a straight vertical needle, an overhanging arm, a presser foot, and a foot treadle. Singer claimed he had invented the first practical sewing machine and argued that Walter Hunt's unpatented 1834 machine invalidated Howe's patent.",
        conflictDetails:
          "Howe sued Singer in federal court in 1854 (*Howe v. Underwood*). Judge Peleg Sprague ruled decisively that Walter Hunt had abandoned his invention, declaring Howe the true and original inventor of the eye-pointed needle and lockstitch. Singer was ordered to pay Howe $15,000 in damages and royalties of $25 per machine.",
        resolution:
          "In 1856, attorney Orlando B. Potter brought together the four warring sewing machine titans—Howe, Singer, Wheeler & Wilson, and Grover & Baker—to form the 'Sewing Machine Combination.' This was the first major patent pool in industrial history. The members pooled 24 interlocking patents, agreed to cross-license each other, and collected a $15 royalty on all other manufacturers.",
        legalOutcome:
          "Howe's patent was fully vindicated. Before his patent expired in 1867, Howe earned over $2,000,000 in royalties (equivalent to over $50 million today), making him one of the wealthiest men in America.",
      },
    ],
    civilizationalImpact:
      "The lockstitch sewing machine catalyzed the Industrial Revolution in textiles. It reduced the manufacturing time of a men's shirt from 14 hours to 1 hour, enabling affordable mass-produced clothing. It also freed millions of women from endless domestic hand sewing and paved the way for modern home consumer appliances.",
    funFact:
      "During the Civil War in 1861, Elias Howe enlisted as a private in the 17th Connecticut Volunteer Infantry. When the federal government fell months behind on paying Union soldiers, Private Howe walked into the paymaster's office and personally wrote a check out of his sewing machine royalties for $31,000 to pay his entire regiment's back wages.",
    aftermath:
      "Elias Howe passed away in 1867 at age 48, having lived to see his lockstitch machine transform global manufacturing. Isaac Singer's company grew into the multinational Singer Corporation, while Howe was posthumously inducted into the National Inventors Hall of Fame in 2004.",
    sideNotes: [
      "A popular legend claims Howe dreamed he was captured by cannibals with spears that had holes through their tips, giving him the idea for the eye-pointed needle; Howe's biographers note this was marketing lore, as the mechanical geometry derived directly from his watchmaker apprenticeship.",
      "The lockstitch requires approximately twice as much thread as a single-thread chainstitch, but its lock integrity remains standard in modern apparel manufacturing.",
    ],
  },
  tags: [
    "Elias Howe",
    "Sewing Machine",
    "Lockstitch",
    "Patent Pool",
    "Industrial Revolution",
    "Textiles",
    "Precision Mechanics",
    "19th Century",
  ],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
    patentWarYears: "1846–1856",
    impactScore: 99,
  },
};
