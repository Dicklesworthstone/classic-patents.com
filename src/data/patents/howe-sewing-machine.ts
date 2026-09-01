import type { Patent } from "@/types/patent";
import { howeSewingMachineArchivalEdition } from "../editions/us-4750-howe-sewing-machine";

function manualClaimText(number: number): string {
  const block = howeSewingMachineArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Howe manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

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
  filingDate: null,
  era: "Industrial Dawn (1840–1870)",
  category: "consumer",
  categoryLabel: "Precision Mechanical Machinery",
  summary:
    "The Machine That Clothed the World: In 1846, Elias Howe Jr. patented the two-thread lockstitch sewing machine. By abandoning attempts to mimic manual hand sewing, Howe placed the thread eye at the pointed tip of a curved reciprocating needle. As the needle pierced the cloth and slightly retracted, fabric friction dilated a thread loop beneath the seam; a bullet-shaped shuttle shot through the loop with a second bobbin thread, interlocking the two threads at the center of the fabric. Howe's lockstitch sparked the Sewing Machine Combination of 1856—the first modern patent pool in industrial history.",
  heroQuote:
    "Be it known that I, ELIAS HOWE, JR., of Cambridge, in the county of Middlesex and State of Massachusetts, have invented a new and useful machine for sewing seams in cloth or other articles requiring to be sewed; and I do hereby declare that the following is a full and exact description thereof.",
  originalPdfUrl: "/patents/pdfs/us-4750-howe-sewing-machine.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4750A/en",
  usptoClassification: "D05B 1/02 (Sewing machines; lockstitch forming)",
  originalTextAsset: {
    url: "/patents/transcripts/us-4750-howe-sewing-machine.txt",
    pageCount: 6,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (codex-hotel)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053",
  },
  archivalEdition: howeSewingMachineArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
ELIAS HOWE, JR., OF CAMBRIDGE, MASSACHUSETTS.

IMPROVEMENT IN SEWING-MACHINES.

Specification forming part of Letters Patent No. 4,750, dated September 10, 1846.

To all whom it may concern:
Be it known that I, ELIAS HOWE, JR., of Cambridge, in the county of Middlesex and State of Massachusetts, have invented a new and useful machine for sewing seams in cloth or other articles requiring to be sewed; and I do hereby declare that the following is a full and exact description thereof.

In sewing a seam with my machine two threads are employed, one of which threads is carried through the cloth by means of a curved needle, the pointed end of which is to pass through said cloth. The needle used has the eye that is to receive the thread within a small distance - say, an eighth of an inch - of its inner or pointed end.`,
  plainEnglishExplanation: {
    overview:
      "For over twenty thousand years, human clothing was stitched exclusively by hand: a seamstress pushed a needle through fabric and pulled the entire length of thread through with every individual stitch. Early inventors failed because they attempted to mechanize this hand motion. Elias Howe Jr. achieved a historic breakthrough by abandoning hand sewing entirely. He placed the eye of the needle at its piercing tip and introduced a second thread carried inside a flying shuttle. When the needle pushes through cloth and begins to retract, the upper thread bows out into an open loop; the shuttle shoots through that loop, creating a permanent knot buried invisibly inside the fabric thickness.",
    coreMechanism:
      "Main shaft C carries the cams that coordinate the machine. Cam Q rocks shaft O and arm G, whose curved needle carries the first thread through the cloth; the eye is printed as about one eighth inch from the point. Lifting rod W then raises that thread to make deliberate slack. Picker-staves J drive shuttle K back and forth in trough I so the shuttle and its second thread pass between the needle and the first thread. Cam R, arm S, claw T, ratchet U, shaft V, and the rack holes in pinned baster plate H advance the supported cloth for the next stitch.",
    mechanicalBreakdown: [
      {
        title: "Eye-Pointed Curved Needle",
        summary: "A steel needle with the thread eye placed near its sharp piercing point.",
        technicalDetails:
          "The specification places the eye within about one eighth inch of the pointed end. The curved needle is fixed to vibrating arm G, so the arm carries a bight of the first thread through the cloth instead of passing the whole needle and thread supply through by hand.",
        archaicTerm: "Curved needle with eye near the point",
        modernEquivalent: "Industrial lockstitch sewing machine needle",
      },
      {
        title: "Reciprocating Shuttle & Internal Bobbin",
        summary:
          "A bullet-shaped steel shuttle carrying a second spool of thread through the loop.",
        technicalDetails:
          "Shuttle K reciprocates in trough I and is pushed alternately by picker-staves J. During the admitted pass phase it travels between the curved needle and the loop of first thread, carrying the second thread through that loop.",
        archaicTerm: "Shuttle carrying second thread in race",
        modernEquivalent: "Rotary hook and bobbin case assembly",
      },
      {
        title: "Intermittent Baster-Plate Cloth Feed",
        summary: "A pinned plate advancing the cloth by exact stitch pitch increments.",
        technicalDetails:
          "The plate's points, printed as about three quarters inch apart, hold the cloth. Holes in the same plate act as a rack; cam R drives arm S and claw T against ratchet U so shaft V and its pinion advance the supported plate between stitches.",
        archaicTerm: "Baseler plate with pins and rack",
        modernEquivalent: "Four-motion drop feed dog mechanism",
      },
      {
        title: "Synchronized Cam Drive & Tension Take-Up Lever",
        summary: "Grooved face cams on the main shaft coordinating needle and shuttle timing.",
        technicalDetails:
          "Roller k on arm P follows zigzag groove l in cam Q to rock the needle arm, while the shuttle and feed cams on the same shaft preserve the printed causal order. The grant supplies no millisecond timing, shaft speed, or cam lift table.",
        archaicTerm: "Grooved cams and thread-tightening levers",
        modernEquivalent: "Precision rotary timing cams & dynamic take-up lever",
      },
    ],
    scientificPrinciples: [
      {
        principle: "One-Drive Multibody Constraint",
        formula: "q = q(\\theta_C), \\qquad n_{drive}=1",
        explanation:
          "The flywheel and cams share main shaft C. The needle arm, picker-staves, shuttle, lifting rod, and baster feed therefore have several joint coordinates but only one prescribed drive coordinate; the model never animates them from unrelated clocks.",
      },
      {
        principle: "Eye-Pointed Needle Loop Dilation Dynamics",
        formula:
          "\\mathcal{P}_{pass}=(\\lambda_{loop} \\ge \\lambda_{min}) \\land (K \\subset I)",
        explanation:
          "Rod W creates the slack named by Claim 2. The interactive model reports the Claim 1 pass only when the displayed loop clears the shuttle section and shuttle K remains on its prismatic guide in trough I; $\\lambda_{min}$ is an explicit display boundary, not a dimension printed by Howe.",
      },
      {
        principle: "Admitted Normalized Cam Profile",
        formula:
          "q_G(\\theta_C)=\\frac{1-\\cos\\theta_C}{2}, \\qquad x_K(\\theta_C)=-A_K\\cos\\theta_C",
        explanation:
          "The grant prints cam and linkage topology but no lift table. A smooth normalized profile makes that topology executable without inventing a dimensional stroke, velocity, acceleration, or historical operating rate.",
      },
      {
        principle: "Declared Display Feed Relation",
        formula:
          "v_{seam} = f_{stitch} \\cdot p_{pitch} = \\frac{\\text{SPM}}{60} \\cdot p_{stitch}",
        explanation:
          "For a visitor-selected demonstration cadence and pitch, one feed increment per shaft cycle gives the displayed cloth velocity. Both quantities are declared controls; the 1846 grant does not supply an operating speed or stitch pitch for this calculation.",
      },
      {
        principle: "Printed Local Geometry",
        formula:
          "d_{eye} \\approx \\frac{1}{8}\\,\\mathrm{in}=3.175\\,\\mathrm{mm}, \\qquad p_H \\approx \\frac{3}{4}\\,\\mathrm{in}=19.05\\,\\mathrm{mm}",
        explanation:
          "These are the two local dimensions used by the reconstruction. All other rendered lengths are normalized proportions and are not presented as measurements of Howe's machine.",
      },
    ],
    whyItMattersToday:
      "Every modern garment, automotive seat, leather shoe, and aerospace spacesuit is constructed using the two-thread lockstitch principle Howe patented in 1846. Furthermore, the 1856 Sewing Machine Combination formed to cross-license Howe's patent became the blueprint for modern patent pools, including standard-essential patent pools for MPEG, Wi-Fi, and 5G cellular technologies.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "This claim covers forming a seam by carrying one thread through the cloth with a curved needle mounted on a vibrating arm, while a shuttle carrying its bobbin passes between that needle and the thread it carries, in the described combination and arrangement.",
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
      originalText: manualClaimText(2),
      plainEnglish:
        "This claim covers lifting the needle thread with lifting-rod W to create a loose loop that the shuttle subsequently draws in, with rod W equipped with lifting-pin u and its motion governed by the described guide-pieces and associated devices.",
      keyInnovations: [
        "Thread loop lifting mechanism",
        "Guided cam-driven lifting pin",
        "Controlled slack and tension timing",
      ],
      legalSignificance:
        "Protected the specific lifting-rod and guide arrangement that deliberately creates the loose loop later drawn in by the shuttle.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "This claim covers holding the thread delivered by the shuttle so it cannot unwind from the shuttle bobbin after the shuttle passes through the loop, using lever or clipping-piece f, or another device substantially equivalent in operation and result.",
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
      originalText: manualClaimText(4),
      plainEnglish:
        "This claim covers arranging small lever m' n' with sliding box M and spring-piece Z so their stated combination tightens the stitch while the needle is retracted, preserving the specific lever, box, spring, and timing relationship.",
      keyInnovations: [
        "Spring-loaded stitch tightener",
        "Sliding shuttle box linkage",
        "Dynamic stitch tightening cycle",
      ],
      legalSignificance:
        "Protected the stated lever, sliding-box, and spring relationship used to tighten the stitch while the needle is retracted.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "This claim covers holding cloth on a baster-plate furnished with points, with holes that let the plate operate as a rack and carry the cloth forward as described, thereby dispensing with the need to baste the pieces together beforehand.",
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
      title: "Front elevation of the machine",
      caption:
        "The front elevation identifies the bed, standards, main shaft, fly-wheel, needle-arm, baster-plate, shuttle box, and lifting apparatus described in the specification.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Bed or base of the machine",
          description: "The machine bed or base from which the standards rise.",
          x: 50,
          y: 92,
        },
        {
          id: "hw-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Standards rising from the bed",
          description: "The paired standards sustaining the main shaft and other apparatus.",
          x: 30,
          y: 58,
        },
        {
          id: "hw-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Main shaft",
          description: "The shaft carrying cams that operate the needle and shuttle-drivers.",
          x: 50,
          y: 38,
        },
        {
          id: "hw-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Fly-wheel",
          description: "The fly-wheel mounted on the main shaft.",
          x: 84,
          y: 44,
        },
        {
          id: "hw-5",
          figureRef: "Fig. 1",
          label: "G",
          element: "Needle-arm",
          description: "The arm carrying the curved needle and vibrating on a pivot.",
          x: 48,
          y: 53,
        },
        {
          id: "hw-6",
          figureRef: "Fig. 1",
          label: "H",
          element: "Baster-plate",
          description:
            "The metallic plate whose points hold the cloth and whose holes act as rack-teeth.",
          x: 70,
          y: 76,
        },
        {
          id: "hw-7",
          figureRef: "Fig. 1",
          label: "I",
          element: "Shuttle box or trough",
          description: "The trough within which the shuttle is moved back and forth.",
          x: 58,
          y: 72,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "End elevation of the machine",
      caption:
        "The end elevation shows the needle-arm, shuttle-drivers, lifting-rod, adjustable plate, and the feed and thread-control relationships described for the machine.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-8",
          figureRef: "Fig. 2",
          label: "G",
          element: "Needle-arm",
          description: "The arm carrying the curved needle in the end elevation.",
          x: 66,
          y: 38,
        },
        {
          id: "hw-9",
          figureRef: "Fig. 2",
          label: "W",
          element: "Lifting-rod",
          description: "The rod carrying the lifting-pin that raises the needle thread.",
          x: 52,
          y: 70,
        },
        {
          id: "hw-10",
          figureRef: "Fig. 2",
          label: "X",
          element: "Adjustable plate",
          description: "The hinged plate in front of which the lifting-rod stands.",
          x: 64,
          y: 74,
        },
        {
          id: "hw-11",
          figureRef: "Fig. 2",
          label: "J",
          element: "Shuttle-driver",
          description: "One of the picker-staves or shuttle-drivers moving the shuttle.",
          x: 42,
          y: 65,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Top view of the machine",
      caption:
        "The top view shows the baster-plate, rack holes, main shaft, shuttle-driver cam, and regulating screw used to advance and set the stitch length.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-12",
          figureRef: "Fig. 3",
          label: "H",
          element: "Baster-plate",
          description: "The plate receiving the cloth and carrying the row of rack-like holes.",
          x: 22,
          y: 66,
        },
        {
          id: "hw-13",
          figureRef: "Fig. 3",
          label: "L",
          element: "Shuttle-driver cam",
          description: "The cam that operates the shuttle-drivers alternately.",
          x: 52,
          y: 52,
        },
        {
          id: "hw-14",
          figureRef: "Fig. 3",
          label: "m",
          element: "Rack holes in the baster-plate",
          description:
            "The regularly spaced holes receiving the pinion teeth to advance the plate.",
          x: 20,
          y: 61,
        },
        {
          id: "hw-15",
          figureRef: "Fig. 3",
          label: "n",
          element: "Regulating-screw",
          description:
            "The screw moving a stop pin to regulate the play of the feeding arm and stitch length.",
          x: 69,
          y: 42,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Needle-and-cloth section",
      caption:
        "The section shows the needle-arm down, the needle through the cloth, and the loose thread loop outside the cloth prepared for shuttle passage.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-16",
          figureRef: "Fig. 4",
          label: "f",
          element: "Cloth in section",
          description: "The cloth shown in section in the needle-and-cloth detail.",
          x: 42,
          y: 52,
        },
        {
          id: "hw-17",
          figureRef: "Fig. 4",
          label: "e'",
          element: "Loop or slack thread",
          description: "The loop formed outside the cloth and drawn through by the shuttle.",
          x: 60,
          y: 44,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Top view of the shuttle box",
      caption:
        "The shuttle-box detail shows the shuttle, its spool, the sliding box and piece, and the springs that steady the shuttle's motion.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-18",
          figureRef: "Fig. 5",
          label: "I",
          element: "Shuttle box",
          description: "The convex-sided box or trough adapted to admit the baster-plate.",
          x: 35,
          y: 60,
        },
        {
          id: "hw-19",
          figureRef: "Fig. 5",
          label: "K",
          element: "Shuttle",
          description: "The lower-thread shuttle within the box, with spool g.",
          x: 58,
          y: 60,
        },
        {
          id: "hw-20",
          figureRef: "Fig. 5",
          label: "M",
          element: "Sliding box",
          description: "The sliding box fitted into the shuttle-box behind the shuttle.",
          x: 78,
          y: 57,
        },
        {
          id: "hw-21",
          figureRef: "Fig. 5",
          label: "N",
          element: "Sliding piece",
          description: "The corresponding sliding piece adapted to the pointed end of the shuttle.",
          x: 28,
          y: 58,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Feeding apparatus",
      caption:
        "The vertical feed section shows the cam, feeding arm and claw, ratchet-wheel, cross shaft, springs, and pinion that advance the baster-plate between stitches.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-22",
          figureRef: "Fig. 6",
          label: "R",
          element: "Feed cam",
          description: "The cam on the cam-shaft that vibrates arm S.",
          x: 54,
          y: 12,
        },
        {
          id: "hw-23",
          figureRef: "Fig. 6",
          label: "S",
          element: "Feeding arm",
          description: "The arm carrying the feeding-claw.",
          x: 57,
          y: 45,
        },
        {
          id: "hw-24",
          figureRef: "Fig. 6",
          label: "T",
          element: "Feeding-claw",
          description: "The claw taking into ratchet-wheel U.",
          x: 37,
          y: 72,
        },
        {
          id: "hw-25",
          figureRef: "Fig. 6",
          label: "U",
          element: "Ratchet-wheel",
          description: "The ratchet-wheel on shaft V that receives the feeding-claw.",
          x: 40,
          y: 83,
        },
      ],
    },
    {
      figureNumber: "Fig. 7",
      title: "Shuttle detail",
      caption:
        "The shuttle detail identifies the side hole for thread from the spool and the slot allowing the shuttle-thread to play back and forth.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-26",
          figureRef: "Fig. 7",
          label: "d'",
          element: "Shuttle thread hole",
          description:
            "The hole through the shuttle side through which thread passes from the spool.",
          x: 52,
          y: 50,
        },
        {
          id: "hw-27",
          figureRef: "Fig. 7",
          label: "f' f'",
          element: "Shuttle-box slot",
          description: "The slot allowing the shuttle-thread to play back and forth.",
          x: 74,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 8",
      title: "Small shuttle-thread retaining lever",
      caption:
        "The small lever detail shows the pin and lever relationship that receives the thread after shuttle passage and holds it while the needle retracts.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-28",
          figureRef: "Fig. 8",
          label: "m'",
          element: "Projecting pin",
          description: "The pin projecting from the sliding box and acting against the shuttle.",
          x: 45,
          y: 50,
        },
        {
          id: "hw-29",
          figureRef: "Fig. 8",
          label: "n'",
          element: "Small lever part",
          description: "The lever part received within the sliding-box slot.",
          x: 62,
          y: 50,
        },
        {
          id: "hw-30",
          figureRef: "Fig. 8",
          label: "p'",
          element: "Fulcrum-pin",
          description: "The pin on which the small lever turns.",
          x: 55,
          y: 66,
        },
      ],
    },
    {
      figureNumber: "Fig. 9",
      title: "Lever detail for the sliding box",
      caption:
        "The separately printed lever detail is represented as its own figure inventory entry, with the spring-piece and adjusting-screw labels described in the specification.",
      svgType: "howe-sewing",
      callouts: [
        {
          id: "hw-31",
          figureRef: "Fig. 9",
          label: "z z'",
          element: "Adjustable spring-piece",
          description:
            "The spring-piece whose pressure bears against the small lever end and is regulated in the described tightening operation.",
          x: 52,
          y: 50,
        },
        {
          id: "hw-32",
          figureRef: "Fig. 9",
          label: "c'",
          element: "Adjusting-screw",
          description:
            "The screw used to regulate the force of spring Z in the described mechanism.",
          x: 72,
          y: 64,
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
  },
};
