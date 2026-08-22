import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const FIGURES = {
  1: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-1-preview.png",
    alt: "Figure 1 from US 4,750: front elevation of Howe's sewing machine.",
    width: 1900,
    height: 1700,
  },
  2: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-2-preview.png",
    alt: "Figure 2 from US 4,750: end elevation of the sewing machine.",
    width: 1900,
    height: 1900,
  },
  3: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-3-preview.png",
    alt: "Figure 3 from US 4,750: top view of the sewing machine and baster-plate.",
    width: 1900,
    height: 1750,
  },
  4: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-4-detail-preview.png",
    alt: "Figure 4 from US 4,750: needle and cloth section with the needle arm down.",
    width: 900,
    height: 800,
  },
  5: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-5-preview.png",
    alt: "Figure 5 from US 4,750: top view of the shuttle-box and sliding pieces.",
    width: 1700,
    height: 700,
  },
  6: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-6-preview.png",
    alt: "Figure 6 from US 4,750: feeding apparatus with claw and ratchet-wheel.",
    width: 950,
    height: 1350,
  },
  7: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-7-preview.png",
    alt: "Figure 7 from US 4,750: shuttle with thread hole and slot.",
    width: 1100,
    height: 420,
  },
  8: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-8-preview.png",
    alt: "Figure 8 from US 4,750: small shuttle-thread retaining lever.",
    width: 620,
    height: 500,
  },
  9: {
    src: "/patents/figures/us-4750-howe-sewing-machine-fig-9-preview.png",
    alt: "Figure 9 from US 4,750: lever detail for the sliding box.",
    width: 740,
    height: 620,
  },
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from the US 4,750 source facsimile`,
  figurePreviews: numbers.map((number) => FIGURES[number]),
});

/**
 * A continuous, hand-prepared reading edition of US 4,750. The three drawing
 * sheets and three specification sheets of the pinned local facsimile were
 * checked directly. Source page order is deliberately not reproduced here.
 */
export const howeSewingMachineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053",
  preparedBy: "Classic Patents editorial agent (codex-hotel)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ELIAS HOWE, JR., OF CAMBRIDGE, MASSACHUSETTS.",
        "IMPROVEMENT IN SEWING-MACHINES.",
        "Specification forming part of Letters Patent No. 4,750, dated September 10, 1846.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 1, 4, AND 7",
      title: "Front elevation, needle section, and shuttle",
      description: [
        {
          kind: "text",
          text: "E. HOWE, JR. SEWING-MACHINE. No. 4,750. Patented Sept. 10, 1846. Sheet 1 of 3 sheets. ",
        },
        figure("Figure 1", [1]),
        { kind: "text", text: " is the front elevation; " },
        figure("Figure 4", [4]),
        { kind: "text", text: " is the needle-and-cloth section; " },
        figure("Figure 7", [7]),
        { kind: "text", text: " shows the shuttle." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 2 AND 5",
      title: "End elevation and shuttle-box detail",
      description: [
        {
          kind: "text",
          text: "E. HOWE, JR. SEWING-MACHINE. No. 4,750. Patented Sept. 10, 1846. Sheet 2 of 3 sheets. ",
        },
        figure("Figure 2", [2]),
        { kind: "text", text: " is the end elevation; " },
        figure("Figure 5", [5]),
        { kind: "text", text: " is the shuttle-box detail." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 3, 6, 8, AND 9",
      title: "Top view, feed mechanism, and lever details",
      description: [
        {
          kind: "text",
          text: "E. HOWE, JR. SEWING-MACHINE. No. 4,750. Patented Sept. 10, 1846. Sheet 3 of 3 sheets. ",
        },
        figure("Figure 3", [3]),
        { kind: "text", text: " is the top view; " },
        figure("Figure 6", [6]),
        { kind: "text", text: " is the feed; " },
        figure("Figures 8 and 9", [8, 9]),
        { kind: "text", text: " are lever details." },
      ],
    },
    { kind: "paragraph", inlines: text("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: text(
        "Be it known that I, ELIAS HOWE, JR., of Cambridge, in the county of Middlesex and State of Massachusetts, have invented a new and useful machine for sewing seams in cloth or other articles requiring to be sewed; and I do hereby declare that the following is a full and exact description thereof.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In sewing a seam with my machine two threads are employed, one of which threads is carried through the cloth by means of a curved ",
        },
        {
          kind: "term",
          text: "needle",
          definition:
            "The upper-thread carrier. Howe places its eye near the pointed end, unlike a hand needle whose eye is at the blunt end.",
          label: "Mechanism",
        },
        {
          kind: "text",
          text: ", the pointed end of which is to pass through said cloth. The needle used has the eye that is to receive the thread within a small distance - say, an eighth of an inch - of its inner or pointed end. The other or outer end of the needle is held by an arm that vibrates on a pivot or joint pin, and the curvature of the needle is such as to correspond with the length of the arm as its radius. When the thread is carried through the cloth, which may be done to the distance of about three-fourths of an inch, the thread will be stretched above the curved needle, something in the manner of a bow-string, leaving a small open space between the two.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "A small " },
        {
          kind: "term",
          text: "shuttle",
          definition:
            "The moving lower-thread carrier, analogous in role to a weaving shuttle. It carries a bobbin through the upper-thread loop.",
          label: "Sewing mechanism",
        },
        {
          kind: "text",
          text: " carrying a bobbin filled with silk or thread is then made to pass entirely through this open space between the needle and the thread which it carries, and when the shuttle is returned, which is done by means of a ",
        },
        {
          kind: "term",
          text: "picker-staff",
          definition:
            "A reciprocating shuttle-driver or pusher used to return the shuttle through the needle-thread loop; it is a machine part, not a hand-operated staff.",
          label: "Period mechanism term",
        },
        {
          kind: "text",
          text: " or shuttle-driver, the thread which was carried in by the needle is surrounded by that received from the shuttle, and as the needle is drawn out it forces that which was received from the shuttle into the body of the cloth, and as this operation is repeated a seam is formed which has on each side of the cloth the same appearance as that given by stitching, with this peculiarity, that the thread shown on one side of the cloth is exclusively that which was given out by the needle, and the thread seen on the other side is exclusively that which was given out by shuttle. It will therefore be seen that a stitch is made at every back-and-forth movement of the shuttle.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The two thicknesses of cloth that are to be sewed are held upon pointed wires which project out from a metallic plate, like the teeth of a comb, but at a considerable distance from each other - say three-fourths of an inch, more or less - these pointed wires sustaining the cloth and answering the purpose of ordinary ",
        },
        {
          kind: "term",
          text: "basting",
          definition:
            "Temporary hand stitches used to hold layers together before their permanent seam is made.",
          label: "Period sewing term",
        },
        {
          kind: "text",
          text: ". The metallic plate from which these wires project has numerous holes through it, which answer the purpose of rack-teeth in enabling the plate to be moved forward by means of a pinion as the stitches are taken. The distance to which said plate is moved, and consequently the length of the stitches, may be regulated at pleasure.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In the accompanying drawings, " },
        figure("Figure 1", [1]),
        { kind: "text", text: " is a front elevation of the machine; " },
        figure("Fig. 2", [2]),
        { kind: "text", text: ", an end elevation thereof, and " },
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: " a top view. The other figures represent sections and parts in detail, which will be presently explained.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "A A is the bed or base of the machine, and B B standards rising therefrom, which sustain the main shaft and other parts of the apparatus.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "C C is the main shaft, which carries the cams that operate the needle, the shuttle-drivers, and other parts of the machine. D is a fly-wheel, and E a winch, on said shaft.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text("F is a bobbin on which the silk is wound that is to supply the needle."),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "G is the needle-arm, that carries the curved needle a. This is seen most distinctly in the end elevation, ",
        },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: '. The thread from the bobbin F passes round a small friction-roller, b, or round a smooth groove in the situation of said roller, then up through the eye of the needle at a, which eye is situated near to the needle-point. The cloth is stuck on the points d d, that project from the metallic plate H, which I will call the "',
        },
        {
          kind: "term",
          text: "baster-plate",
          definition:
            "Howe's perforated metal cloth-supporting plate, fitted with points to hold the layers and holes that engage a pinion as a rack.",
          label: "Period sewing term",
        },
        {
          kind: "text",
          text: '". This plate is shown most distinctly in the top view, ',
        },
        figure("Fig. 3", [3]),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "When the thread e is carried through the cloth by the needle a, the upper portion of said thread will be above the needle and will allow the point of the shuttle (to be presently described) to pass between them. To enable it to enter readily, the needle, after entering the cloth, is immediately drawn back to a short distance, which opens the loop slightly. The cam which operates the needle-arm being so formed as to cause such drawing back, the shuttle will, in order to give itself the necessary room, draw a portion of the thread which had been given out by the needle through the cloth, said thread having been left in a loop or slack state for that purpose.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        figure("Fig. 4", [4]),
        {
          kind: "text",
          text: " represents a part of the same portion of the machine that is shown in ",
        },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: ", but with the needle-arm down and with the needle passed through the cloth. f is the cloth, (seen in section, but not shown in any of the other figures.) e' is the loop or slack thread formed on the outside of the cloth, and which is to be drawn through it by the passing of the shuttle.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "I in the respective figures is the shuttle box or trough, within which the shuttle is moved back and forth by means of the ",
        },
        {
          kind: "term",
          text: "picker-staves",
          definition:
            "The paired reciprocating shuttle-drivers that push the shuttle back and forth through the needle-thread loop during stitch formation.",
          label: "Period mechanism term",
        },
        { kind: "text", text: " or shuttle-drivers J J. In " },
        figure("Fig. 5", [5]),
        {
          kind: "text",
          text: " I have given a top view of this box with the shuttle K within it. This shuttle is in its general construction similar to the larger shuttle used in weaving, and its spool g is capable of containing an ordinary skein of silk. The shuttle-box I is represented as made convex on its under side, by which it is adapted to admit a baster-plate that may be in a curved form, although for most purposes a straight baster-plate may be used. The pieces marked i i are light springs above the shuttle, which bear slightly upon it and serve to steady its motion. The shuttle-drivers work on joint-pins, as shown at j, ",
        },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: ", there being a corresponding fixture for the drivers on the other side.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "L, " },
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: ", is the cam that operates the shuttle-drivers, on the upper ends of which drivers there may be friction-rollers j' j'. The cam L acts upon the shuttle-drivers alternately.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "M, " },
        figure("Fig. 5", [5]),
        {
          kind: "text",
          text: ", is a sliding box fitted into the shuttle-box and moved back and forth in the rear of the shuttle by one of the drivers, and N is a corresponding sliding piece moved by the other driver and adapted to the fore or pointed end of the shuttle. The needle-arm is attached to the rock-shaft O, ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ", which vibrates on a center pin or pivots, and from this shaft rises an arm, P, that carries a pin and friction-roller, k, which enters a space, l, in the cam Q, which space operates as a zigzag groove, and is of course so formed as to give the proper vibration to the needle-arm. There is a groove or narrow channel made across the bottom of the shuttle-box to receive the needle, in order that its upper part may be even with said bottom and allow the shuttle to pass freely over it.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The baster-plate H, " },
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: ", which receives the cloth to be sewed, is furnished with a row of small holes, m m, drilled at a regular distance from each other, serving the purpose of rack-teeth, and into these round pinion-teeth enter for the purpose of carrying the plate forward to a proper distance at every stitch.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        figure("Fig. 6", [6]),
        {
          kind: "text",
          text: " shows the principal portion of the feeding apparatus as it would appear were a vertical section made through the machine in the line x x of ",
        },
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: ". R is a cam on the cam-shaft C, that vibrates an arm, S, carrying a feeding-claw, T, that takes into a ratchet-wheel, U, on the shaft V, which shaft crosses the bed A of the machine, its fore end being seen at V, ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ". This shaft has on it near its fore end the pinion that carries the pins or teeth that take into the holes m in the baster and cause it to advance between every stitch. The length of the stitch may be regulated by regulating the play of the arm S, and this is effected by the regulating-screw n, ",
        },
        figure("Fig. 3", [3]),
        {
          kind: "text",
          text: ", that moves a pin back and forth that serves as a stop to said arm. The pin is represented by the dot o, ",
        },
        figure("Fig. 6", [6]),
        { kind: "text", text: ", and is seen at o, " },
        figure("Figs. 2 and 3", [2, 3]),
        {
          kind: "text",
          text: ". p is a spring that retains the ratchet-wheel in place as the claw is taking a new hold. q is a spring for holding the arm S against the cam.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In sewing with this machine, the thread from the bobbin F is passed over a notch, r, ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ", at the upper end of the needle-arm, and is returned through the notch r. It then passes down in front of said arm, then around the roller b, and through the needle-eye. To regulate the giving out of the thread from the bobbin, friction is made on it by the semicircular clasp s, that is made to press on it by a spring, t, regulated by a ",
        },
        {
          kind: "term",
          text: "tempering-screw",
          definition:
            "An adjusting screw used to set the pressure of the spring clasp that meters thread delivery from the needle bobbin.",
          label: "Period adjustment term",
        },
        {
          kind: "text",
          text: ".",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "Before the needle passes through the cloth the thread, which extends from the needle-eye to said cloth, is raised or drawn up by a lifting-pin, so as to form the loop or slack, which is subsequently to be drawn in by the passing of the shuttle between the thread and the needle.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "W, " },
        figure("Figs. 1 and 2", [1, 2]),
        {
          kind: "text",
          text: ", is a ",
        },
        {
          kind: "term",
          text: "lifting-rod",
          definition:
            "The reciprocating rod carrying lifting-pin u; its guided motion raises the needle thread into the temporary loop the shuttle must enter.",
          label: "Period mechanism term",
        },
        {
          kind: "text",
          text: ", from the side of which projects the lifting-pin u. The lifting-rod is attached at its upper end to a crank-arm, v, which works on a shaft, w, and this shaft is made to vibrate by means of the cam x on the cam-shaft. This cam operates on a friction-roller, y, on a short arm on the inner end of the shaft w. The lifting-rod stands in front of a plate, X, ",
        },
        figure("Figs. 1 and 2", [1, 2]),
        {
          kind: "text",
          text: ", which is attached at its upper end to the frame of the machine, and between the lower end of this plate and the shuttle-box the cloth is to pass. The plate X is furnished with a hinge-joint at its upper end, in order that its distance from the shuttle-box may be regulated to suit cloth of different thicknesses.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Y, " },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ", is a set-screw, by which it is held in place. From the back part of the lifting-rod proceeds a guide-pin, z, that moves the lifting-rod laterally, so as to govern the action of the lifting-pin u. This guide-pin works against guide-pieces a' b', affixed on the front of the plate X. The dotted lines show the groove formed by the pieces a' b', along which the guide-pin is to pass. The lifting-rod is carried toward the piece b' by means of a spiral spring around its shaft, or in any other convenient mode. In the position in which the apparatus is shown in ",
        },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: " the lifting-pin is partially raised, and will have lifted the thread. In raising it the guide-pin passes through the groove between a' b', (shown by dotted lines,) and when at the upper end of this groove the needle-arm acts and carries the needle through the cloth. On the side of the needle-arm there is a projecting piece, c', the inclined edge of which, coming in contact with the lifting-rod, pushes it laterally over the angular point of the piece d', and the crank-arm v descending at this moment, the lifting-pin is withdrawn from the thread, which is thereby left slack to a sufficient extent for the purpose designated.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The shuttle (shown separately in " },
        figure("Fig. 7", [7]),
        {
          kind: "text",
          text: ") has a hole, d', through its side for the thread to pass from the spool; and a slot, f' f', is made through the side of the shuttle-box to allow of the play of the shuttle-thread back and forth. At the time when the shuttle has completed its passage between the needle and its thread, the needle is to be withdrawn from the cloth; and when this is taking place, it is necessary that the shuttle-thread should be held firmly, or the withdrawing of the needle, instead of drawing the shuttle-thread firmly into the body of the cloth and making a perfect seam, would draw a portion of it from the spool and cause it to pass entirely through said cloth.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure("Fig. 1", [1]),
        {
          kind: "text",
          text: ", f' is the outer end of a lever which is made to rise at the proper moment, and to clip the thread between it and the upper edge of the slot f'. This lever is seen in ",
        },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: ", its fulcrum being at h'. The rod i serves to depress the inner end of said lever and to raise its outer end, the cam j' on the cam-shaft performing this office.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The sliding box M does not bear directly against the rear end of the shuttle-box, but has a pin, m', projecting from its fore end, which pin acts against the shuttle. The pin m' constitutes a part of a small lever shown separately in ",
        },
        figure("Fig. 8", [8]),
        {
          kind: "text",
          text: ". The part n' of this lever is received within a suitable slot in the sliding box M, and it turns on a fulcrum-pin, p'. When the shuttle has passed through the loop formed by the needle-thread, it is received upon the pin m', and as the needle is retracted the thread will be drawn taut upon said pin. At this time the head of an adjustable spring-piece, z z', bears against the end n' of the small lever, and the force of its pressure has to be overcome before the thread escapes from the pin, which it does by drawing over against the power of the spring. As the loop then escapes, it will draw up the filling-thread from the shuttle firmly against the cloth and embed it within it. The head of the spring Z passes through a mortise in the shuttle-box, as shown by the dotted lines. c' is an adjusting-screw by which the force of the spring Z may be regulated.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Having thus fully described the manner in which I construct my machine for sewing seams, and shown the operation thereof, what I claim therein as new, and desire to secure by Letters Patent, is -",
        },
      ],
    },
    {
      kind: "claim",
      number: 1,
      inlines: text(
        "The forming of the seam by carrying a thread through the cloth by means of a curved needle on the end of a vibrating arm, and the passing of a shuttle furnished with its bobbin, in the manner set forth, between the needle and the thread which it carries under a combination and arrangement of parts substantially the same with that described.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: text(
        "The lifting of the thread that passes through the needle-eye by means of the lifting-rod W, for the purpose of forming a loop of loose thread that is to be subsequently drawn in by the passage of the shuttle, as herein fully described, said lifting-rod being furnished with a lifting-pin, u, and governed in its motions by the guide-pieces and other devices, arranged and operating substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The holding of the thread that is given out by the shuttle, so as to prevent its unwinding from the shuttle-bobbin after the shuttle has passed through the loop, said thread being held by means of the lever or ",
        },
        {
          kind: "term",
          text: "clipping-piece",
          definition:
            "The lever or clip that holds the shuttle thread after the shuttle passes, preventing the bobbin from unwinding before the stitch is tightened.",
          label: "Period mechanism term",
        },
        {
          kind: "text",
          text: " f, as herein made known, or in any other manner that is substantially the same in its operation and result.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: text(
        "The manner of arranging and combining the small lever m' n' with the sliding box M, in combination with the spring-piece Z, for the purpose of tightening the stitch as the needle is retracted, as described.",
      ),
    },
    {
      kind: "claim",
      number: 5,
      inlines: text(
        "The holding of the cloth to be sewed by the use of a baster-plate furnished with points for that purpose, and with holes enabling it to operate as a rack in the manner set forth, thereby carrying the cloth forward and dispensing altogether with the necessity of basting the parts together.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "ELIAS HOWE, JR." }] },
    { kind: "paragraph", inlines: text("Witnesses: THOS. P. JONES. GEORGE FISHER.") },
  ],
};

/**
 * Patent-local, block-addressed Plain English companions for the continuous
 * Howe edition. These are hand-authored explanations, not a renderer fallback
 * or a summary of the whole patent. Each key is the exact paragraph index in
 * `howeSewingMachineArchivalEdition.blocks`.
 */
export const HOWE_SEWING_MACHINE_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  4: [
    "This is the patent's formal public address. It tells any reader that the following document is the inventor's statement to the Patent Office.",
  ],
  5: [
    "Howe identifies himself, his Cambridge residence, and the subject of the invention: a machine for sewing seams in cloth and other articles. He presents the following description as the complete technical disclosure supporting the legal claims at the end, not as a claim by itself.",
  ],
  6: [
    "The upper thread does not follow the hand-sewing motion of pulling a long thread through the cloth. A curved needle carries it through the work, with the eye about one-eighth inch from the pointed end. Its outer end pivots on the vibrating arm, whose radius matches the needle's curve.",
    "After the needle enters roughly three-fourths inch, the thread spans above the curved needle like a bowstring. That geometry leaves an open space between thread and needle. The clearance is a necessary condition for the shuttle described next; without it, a lower-thread carrier could not pass through the upper-thread loop.",
  ],
  7: [
    "A small shuttle carrying a bobbin passes through the opening between the needle and the upper thread. A picker-staff, or shuttle-driver, returns it. The shuttle's thread wraps the thread carried by the needle, and withdrawing the needle pulls that interlock into the body of the cloth.",
    "The result is a two-thread lockstitch: the visible thread on one face comes from the needle, and the visible thread on the other from the shuttle. Each back-and-forth shuttle stroke produces a stitch. This paragraph states the causal mechanism behind claim 1, but the claim limits protection to the specified combination and arrangement of parts.",
  ],
  8: [
    "Howe holds the two cloth layers on widely spaced pointed wires in a metal plate. Those points replace temporary hand basting, so the machine can hold the layers while the needle and shuttle act. The stated spacing is approximately three-fourths inch, not a generic clamp with no geometry.",
    "Holes in that plate act as rack teeth. A pinion engages them and advances the plate as stitches are made; choosing the distance moved chooses stitch length. This is the physical feed arrangement later claimed in claim 5, including both the points and the rack-like holes.",
  ],
  9: [
    "Howe deliberately tells the reader how to use the drawing sheets: Figure 1 is the front elevation, Figure 2 the end elevation, and Figure 3 the top view. The later figures are not separate machines; they are sectional or detailed views of named portions of this one mechanism.",
  ],
  10: [
    "A is the bed or base. The paired B standards rise from it and support the main shaft and the machine's other moving structure. The lettering establishes a positional vocabulary for the following descriptions and figures.",
  ],
  11: [
    "C is the main shaft. Its cams time the needle and shuttle drivers, while D is the flywheel and E the hand winch on that shaft. Thus the operator's rotation is converted into coordinated repeating motion rather than independently moving the needle and shuttle.",
  ],
  12: [
    "F is the bobbin supplying the needle thread. It is the upper-thread store, distinct from the bobbin carried by the shuttle below the cloth.",
  ],
  13: [
    "G is the pivoted needle arm that carries curved needle a; Figure 2 gives the clearest end view. Thread leaves upper bobbin F, goes over friction roller b or an equivalent smooth groove, then enters the eye near the needle point. The near-point eye is what lets the needle carry only a small local loop through the work.",
    "The cloth sits on points d d of plate H, the baster-plate, which Figure 3 shows from above. This links the needle path, the needle-thread route, and the pinned feed plate to the specific reference letters on Figures 2 and 3 rather than treating them as anonymous sewing-machine parts.",
  ],
  14: [
    "When needle a carries thread e through the cloth, the upper portion remains above the needle and the shuttle point can enter between them. The needle then retracts a short distance, opening the loop. That partial withdrawal, not full removal, creates the clearance.",
    "The needle-arm cam is shaped to produce that retreat. While it happens, the shuttle draws some previously delivered upper thread through the cloth, leaving it as a loop or slack. The timing condition is essential: the shuttle needs enough room to pass before the loop is tightened.",
  ],
  15: [
    "Figure 4 freezes the same needle area from Figure 2 with the arm down and the needle through the cloth. It labels f as the cloth in section and e' as the loose loop on the outside. The shuttle must pass through that e' loop; the figure is evidence for the loop-formation sequence, not decorative art.",
  ],
  16: [
    "I is the shuttle box or trough, and J J are the picker-staves that drive the shuttle back and forth. Figure 5 shows the box from above with shuttle K inside. Howe compares K to a weaving shuttle and says its spool g can hold an ordinary skein of silk, identifying both its construction and its lower-thread supply.",
    "The underside of box I is convex so it can clear a curved baster-plate, though Howe says a straight plate will serve most purposes. Light springs i i bear gently on the shuttle to steady it, and the drivers pivot at j in Figure 2 with a counterpart on the other side. These are stated structural limits on the shuttle's travel, not merely labels.",
  ],
  17: [
    "L in Figure 3 is the cam that operates the shuttle drivers. Optional friction rollers j' j' can sit at their upper ends. The cam works the two drivers alternately, giving the shuttle its repeated reciprocal passage through the upper-thread loop.",
  ],
  18: [
    "Figure 5's M is a sliding box behind the shuttle, while N is the opposing sliding piece at its pointed end. Separate drivers move them back and forth. This describes the box arrangement that later appears in claim 4 with the small lever and spring-piece Z.",
    "Needle arm G connects to rock shaft O in Figure 1. Arm P on that shaft carries roller k in the zigzag groove l of cam Q, so the cam gives the arm its required vibration. A channel across the shuttle-box bottom receives the needle and keeps its upper surface level enough for the shuttle to pass freely over it. The groove is a clearance constraint between two moving organs.",
  ],
  19: [
    "Baster-plate H in Figure 3 receives the cloth. Its regularly spaced holes m m function as rack teeth; a round pinion enters them and advances the plate by the proper distance after each stitch. This repeats the feed mechanism with its reference letters and connects it to the claimed no-basting result.",
  ],
  20: [
    "Figure 6 isolates the feed in a vertical section taken on line x x of Figure 3. Cam R on shaft C rocks arm S. S carries feeding claw T, which engages ratchet wheel U on shaft V. V crosses bed A; its front end is visible in Figure 1, and a pinion near that end engages the holes m in the baster-plate.",
    "The claw-and-ratchet sequence advances the plate between stitches rather than while the needle is in the cloth. Changing the play of arm S changes stitch length. Regulating screw n in Figure 3 moves a stop pin, shown as o in Figure 6 and also visible in Figures 2 and 3. Spring p holds the ratchet-wheel while the claw takes a new tooth, and spring q holds arm S against the cam. Those springs preserve engagement and timing, not merely comfort or ornament.",
  ],
  21: [
    "Thread from upper bobbin F goes over notch r at the needle-arm top, returns through that notch, descends in front of the arm, passes around roller b, and reaches the needle eye. Howe then gives an adjustable tension device: semicircular clasp s presses on the thread through spring t, whose force is set by a tempering-screw.",
    "That friction controls how readily the bobbin gives out thread. It must provide enough thread for the needle's loop without allowing uncontrolled slack that would interfere with shuttle passage or final tightening.",
  ],
  22: [
    "Before penetration, a lifting-pin raises the span of thread between needle eye and cloth. Raising it deliberately makes the loop or slack that the shuttle will later draw in while traveling between the thread and the needle. This is the function claimed in claim 2, not a claim to every kind of thread tensioning.",
  ],
  23: [
    "W is the lifting rod, and pin u projects from it. Its upper end connects to crank arm v on shaft w; a cam on the main cam-shaft vibrates w through roller y. The linkage converts main-shaft rotation into the temporary lift that creates the shuttle-clearance loop.",
    "The rod stands before plate X, shown in Figures 1 and 2. Cloth passes between the lower end of X and shuttle box I. X hinges at its top, so its spacing from the shuttle box can be set for different cloth thicknesses. That adjustment is a stated operating condition, not a license to ignore the described plate and shuttle geometry.",
  ],
  24: [
    "Y is the set-screw that holds the adjustable plate arrangement. Guide-pin z from the lifting rod moves the rod sideways and governs lifting pin u. It follows a groove between guide pieces a' and b' on plate X, shown by dotted lines. A spiral spring draws the rod toward b', while other equivalent means may provide that bias.",
    "In the Figure 1 position, the lifting pin has already raised the thread. As z reaches the upper end of its guide groove, the needle arm drives the needle through the cloth. A projecting piece c' on the needle arm contacts the lifting rod, pushes it over angular piece d', and, as crank arm v descends, withdraws pin u. The thread is then left with sufficient slack for the shuttle operation. The paragraph supplies the timed guide, release, and slack conditions behind claim 2.",
  ],
  25: [
    "Figure 7 shows shuttle K's thread hole d' and the shuttle-box slot f' f', which permits the shuttle thread to move back and forth. After the shuttle has passed between needle and upper thread, the needle must be withdrawn. At that moment the lower thread must be held firmly.",
    "If it were not held, needle withdrawal would pull extra lower thread from the spool instead of drawing the interlock into the cloth. The machine would lose the intended tight seam. The needed restraint is the functional problem addressed by the retaining lever of claim 3.",
  ],
  26: [
    "In Figure 1, f' is the outer end of the lever that rises at the correct moment and clips the shuttle thread against the upper edge of slot f'. Figure 2 shows its fulcrum h'. Rod i depresses the inner end and raises the outer end, and cam j' on the main shaft performs that motion. This gives claim 3 a specific timed clipping mechanism, not an unexplained promise to hold thread.",
  ],
  27: [
    "Sliding box M does not bear directly on the shuttle-box rear; its projecting pin m' bears against the shuttle. Figure 8 isolates the small lever containing m'. Its n' portion fits a slot in M and pivots at p'. After the shuttle passes the needle-thread loop, the loop lands on m', and retracting the needle draws the thread taut there.",
    "Adjustable spring-piece z z' bears on the lever end n'. The thread cannot leave m' until it overcomes that spring force. When it does, the loop pulls the shuttle's filling thread tight against the cloth and embeds it. Spring Z passes through a mortise in the shuttle box, and adjusting screw c' sets its force. These named relationships are the combination and tightening effect claimed in claim 4.",
  ],
  28: [
    "Howe closes the description and identifies the next material as the legal claims. The claims do not repeat every descriptive paragraph; they define five selected combinations and operations for which he seeks Letters Patent.",
  ],
  34: [
    "Elias Howe, Jr. signs the specification. The signature is formal execution of the inventor's description and claims; it does not add a separate mechanism or claim limitation.",
  ],
  35: [
    "Thos. P. Jones and George Fisher are the printed witnesses to Howe's signing. They document execution of the patent instrument and are not named inventors or claimants.",
  ],
};
