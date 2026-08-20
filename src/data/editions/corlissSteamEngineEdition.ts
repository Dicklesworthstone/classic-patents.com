import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const dims: Record<string, [number, number]> = {
  "1": [720, 840],
  "2": [720, 936],
  "3": [823, 720],
  "4": [720, 1057],
  "5": [720, 1057],
  "8": [720, 1057],
  "9": [720, 1057],
};

const figure = (number: number | string): CuratedSpecificationInline => {
  const [w, h] = dims[number.toString()] || [720, 720];
  const sourcePreview =
    number.toString() === "3"
      ? "/patents/figures/us-6162-corliss-steam-engine-fig-3-source-crop-v2.png"
      : `/patents/figures/us-6162-corliss-steam-engine-fig-${number}-preview.png`;
  return {
    kind: "reference",
    text: `Fig. ${number}`,
    href: `#corliss-fig-${number}`,
    referenceType: "figure",
    label: `Open the source-faithful crop for Figure ${number} of US 6,162`,
    figurePreviews: [
      {
        src: sourcePreview,
        alt: `Figure ${number} from George H. Corliss's US 6,162 steam-engine patent.`,
        width: w,
        height: h,
      },
    ],
  };
};

const term = (
  before: string,
  text: string,
  definition: string,
  after = "",
): CuratedSpecificationInlines => [
  { kind: "text", text: before },
  { kind: "term", text, definition, label: "Patent vocabulary" },
  { kind: "text", text: after },
];

/**
 * A continuous edition made directly from the eight-page local facsimile.
 * Drawing-sheet order and printed page furniture remain in the PDF; this
 * reader preserves the legal argument without scan-page reconstruction.
 */
export const corlissSteamEngineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "22a03c717ed383165143af5aa3b85c8dac0705eaa4cdadcf93130ba28ef76ff5",
  preparedBy: "Classic Patents editorial agent (SilverRiver)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GEO. H. CORLISS, OF PROVIDENCE, RHODE ISLAND.",
        "CUT-OFF AND WORKING THE VALVES OF STEAM-ENGINES.",
        "Specification forming part of Letters Patent No. 6,162, dated March 10, 1849; Reissued May 13, 1851, No. 200.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Side elevation",
      description: literal("G. H. Corliss. Steam Engine. No. 6,162. Patented Mar. 10, 1849."),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 2",
      title: "Longitudinal vertical section",
      description: literal("G. H. Corliss. Steam Engine. No. 6,162. Patented Mar. 10, 1849."),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 3, 6, AND 7",
      title: "Valve gear, latch, and air-cylinder details",
      description: literal("G. H. Corliss. Steam Engine. No. 6,162. Patented Mar. 10, 1849."),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 4, 5, 8, AND 9",
      title: "Plan, section, and alternative valve arrangements",
      description: literal("G. H. Corliss. Steam Engine. No. 6,162. Patented Mar. 10, 1849."),
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that I, GEORGE H. CORLISS, of the city and county of Providence and State of Rhode Island, have invented certain new and useful Improvements in Steam-Engines; and that the following is a full, clear, and exact description of the principle or character which distinguishes them from all other things before known and of the manner of making, constructing, and using the same, reference being had to the accompanying drawings, making part of this specification, in which—",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "reference",
          text: "Figure 1",
          href: "#corliss-fig-1",
          referenceType: "figure",
          label: "Open the source-faithful crop for Figure 1 of US 6,162",
          figurePreviews: [
            {
              src: "/patents/figures/us-6162-corliss-steam-engine-fig-1-preview.png",
              alt: "Figure 1 from US 6,162.",
              width: 720,
              height: 840,
            },
          ],
        },
        { kind: "text", text: " is a side elevation of an engine on my improved plan, " },
        figure("2"),
        { kind: "text", text: ", a longitudinal vertical section; " },
        figure("3"),
        {
          kind: "text",
          text: ", an elevation of the valves and the arrangement of parts for working them, and ",
        },
        figure("4"),
        { kind: "text", text: ", a plan thereof; " },
        figure("5"),
        {
          kind: "text",
          text: " is a separate section representing a latch used in the valve gear, and ",
        },
        {
          kind: "reference",
          text: "Figs. 6 and 7",
          href: "#corliss-fig-6",
          referenceType: "figure",
          label: "Open the source-faithful crops for Figures 6 and 7",
          figurePreviews: [
            {
              src: "/patents/figures/us-6162-corliss-steam-engine-fig-6-source-crop-v2.png",
              alt: "Figure 6 from US 6,162.",
              width: 600,
              height: 650,
            },
            {
              src: "/patents/figures/us-6162-corliss-steam-engine-fig-7-preview.png",
              alt: "Figure 7 from US 6,162.",
              width: 720,
              height: 720,
            },
          ],
        },
        {
          kind: "text",
          text: ", a plan and section of an air cylinder and piston for checking the motions of the valve apparatus.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal("The same letters indicate like parts in all the figures."),
    },
    {
      kind: "paragraph",
      inlines: term(
        "In constructing the frame work of what are known as ",
        "beam engines",
        "Stationary reciprocating steam engines in which a pivoted overhead beam transmits the piston rod's motion to a crank.",
        " it is highly important to avoid the working or yielding of the frame under the action of the varying forces of the engine, for it is to such working and yielding of the frame that the shaft breaking of engines is mainly due. The numerous devices which have been essayed to remove this evil establishes conclusively the importance of a practical remedy. The object of the first part of my invention relates to the means of avoiding this difficulty and consists in supporting the shaft of the working beam on two vertical standards that are erected on two horizontal beams secured and resting at the ends on the bed, the upper end of the two standards being connected to, and braced with the ends of the horizontal beams by means of diagonal tension screw braces so that during the upward motion of the piston the strain from the base of the cylinder to the bearings of the working beam shall be along one set of diagonal tension braces, and from these bearings to the support of the crank shaft along the set of diagonal braces on the other side, and during the downward motion shall be vertically along the line of the standards onto the horizontal beams which are prevented from working by the tension of the diagonal tension braces.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "In steam engines operated with slide valves, particularly the large condensing engines made in England, the valves are connected and moved together in pairs, one at each end of the cylinder, and therefore move together over the same extent of surface, and as the power required to move them is due to the friction produced by the pressure of the steam on their surface and their range of motion under this pressure it follows that the valves while closed require the most power, for much of this friction is relieved the moment the valves are partly opened. One of the valves must always be closed while the other is being opened or closed, hence the closed valve is moved at an entire sacrifice of power. To save this, several devices have been resorted to, such as cams, the irregular working of which makes too much noise, and renders the whole liable to derangement, but by my invention I am enabled to reduce the motion of the closed valve relatively to that of the other valve, and thus greatly to reduce the amount of power heretofore required for this purpose.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "This the second part of my invention therefore consists in communicating motion to the two valves from one rock shaft by connecting each valve with a separate arm or crank wrist of the rocker, the two arms making such an angle with each other dependent on the position of the valves and the rocker so that the point of connection of the closed valves shall vibrate near the dead point, and therefore give but a small amount of motion to that valve, while the other which is being opened and closed is moving along that part of its circuit which shall give the greatest longitudinal motion, and therefore giving to that valve the greatest amount of motion. By this means I not only save much of the power due to the working of the valves when closed but at the same time I attain the important advantage of greatly accelerated motion of the valves whilst opening and closing the ports.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The third part of my invention relates to the method of regulating the cut off, of the steam in the main slide valves, and consists in effecting this by means of the governor which operates cams, so that when the velocity of the engine is too great these cams shall be moved by the centrifugal action of the regulator that a catch on the valve rods may the sooner come in contact with them to liberate the valves and admit of their being closed by the force of weights or springs, and thus cut off the steam in proportion to the velocity of the engine, this being done sooner when the velocity of the engine is to be reduced and later when it is to be increased.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "In the accompanying drawings (a) represents the bed of the engine which is elevated at each end above the level of the plane of the middle part. The cylinder (b) is secured to one end, and the boxes (c, c) of the crank shaft to the other. Two horizontal beams (d, d) are placed with their ends resting on the two elevated parts of the bed and then securely bolted, and on the middle of these are erected the two standards (e, e) which may however be cast with the horizontal beams. And near the upper end, these standards are formed with a hole or hollow space (f) in part to reduce the weight but chiefly to form a bearing for nuts (g, g) that are tapped onto the ends of tension brace rods (h h and h' h') one on each side of each standard and extending down diagonally to the ends of the horizontal beams through which they pass and to which they are firmly secured by keys (i, i) in manner well known to engineers. The upper end of the standards are provided with appropriate boxes for the journals of the shaft (j) of the working beam (k) in the usual manner. The two standards are of course braced together in any desired manner to keep them parallel.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "From the above arrangement it will be seen that by drawing the tension brace rods by means of the nuts, the standards will be forced down onto the horizontal beams, and that the tension braces will be strained or drawn tight, so that during the upward action of the piston the downward force of the steam on the bed plate and the upward thrust in the boxes of the working beam shaft will be exerted along the diagonal line of the tension brace rods (h, h) and from the shaft of the beam along the other diagonal tension brace rods (h' h') to the boxes of the crank shaft, and that these being fully strained by the nuts no force that is not sufficient to separate the connection will be able to force these apart to any injurious extent so that during this upward action the frame will not work or yield and on the return or downward stroke of the piston the strain on the shaft of the beam will be exerted vertically on the standards and therefore on the horizontal beams which are held in a state of tension by the tension braces and therefore this action of the steam will not cause the frame to work or yield materially unless such force be sufficient to break the metal. The parts being thus braced and under tension and pressure, independently of the force of the engine, will effectually prevent that working of the frame which in a short time causes some part or parts of the engine to break or become deranged.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The steam and exhaust valves (l l) and (m m) are arranged above and below the top and bottom of the cylinder in steam chests (n) (o), the one (n) at top, and formed in the cylinder head, and the other let into a recess in the bed plate. The exhaust valves (m m) are attached to valve rods (p, p) provided with appropriate slide heads (q, q), one for each, which by connecting rods (r, r) are jointed to arms (s, s) of two levers (t t) that turn on fulcrum pins (u, u), the other arms (v, v) being in turn connected each with a wrist (w) of a rock shaft (x), the two wrists being distant about a quarter of a circle, so that when one is at its greatest leverage the other is at the dead point.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "As one valve must not be opened until the other is closed, or nearly so, and vice versa, and the two derive their motions from one and the same rock shaft, the wrists on the rock shaft are so situated, relatively to the valves, that they are each in turn opened and closed by that portion of the motion of the wrist which communicates the greatest longitudinal motion to the connecting rod, and when one is performing this motion the other wrist is performing that portion of its motion which communicates the least longitudinal motion to the connecting rod, hence while the two wrists are performing the same length of rotation the one which operates the opening and closing valve gives a quick movement to its valve to open and close the port rapidly, whilst the other valve which moves over the closed port and therefore under the full pressure of steam, moves very slowly, and vice versa. The rock shaft (x) is provided with an arm (y) which receives the required vibratory motion by a connecting rod (z) from an eccentric (a') in the usual manner of operating the valve gear of steam engines.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The steam valves (l l) are provided with double valve rods (b' b') attached to sliding heads (c' c') and connected with, and operated by the rock shaft (x) in manner similar to the exhaust valves above described, with this exception, that the levers (d' d') that are connected with the rock shaft by means of connecting rods (e' e'), instead of being jointed to rods connected with the slide heads of the steam valve rods, as in the exhaust valves, are each provided with a cogged sector (f' f') which operate sliding racks (g' g'), and these racks instead of being jointed to the cross heads of the valve stems are so formed as to be engaged and disengaged with the connecting rods (h' h') by means of catches (i' i') on the valve rods which catch onto corresponding lips on the racks and there held by springs (i' i').",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "When the steam valves are closed the vibration of the rock shaft (x) alternately moves one of the racks sufficiently far to become engaged with the catch (i') of one of the rods (h'), and on the return motion so soon as the valve is sufficiently open a projection (j') on the rod (h') strikes against a cam (k') on a vertical rod (l') which disengages the catch from the sliding rack and permits the valve to be closed quickly to cut off the supply of steam, by means of a bent lever (m') one arm of which bears against the back of a small air cylinder (n') attached to the double valve rods, and the other arm having a weight (o') suspended to it, the moment the catch is liberated the gravity of the weight closes the valve to cut off the supply of steam that it may complete the stroke of the engine by expansion. Toward the end of the closing motion of the valve the small air cylinder (n') attached to the valve rods embraces a piston (p') attached to the frame which condenses the air within the cylinder and thus acts as a buffer or elastic cushion to prevent the slamming of the machinery and breakage consequent thereon.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The two steam valves are arranged, mounted and connected in the same manner, and are therefore operated in the same manner, and are alternately operated by the rock shaft; and their connection being made with the rock shaft in the same manner, although at different points, as the exhaust valves, they of necessity operate on the same principle, with the exception specified for cutting off the steam. The cams (k' k') are helical projections on the peripheries of two cylinders on a sliding and rotating rod (l') attached to the slide (r') of the governor (s') so that when the governor, which receives its rotation from the crank shaft by a line shaft (t') and bevel wheels (u' u' u' u'), moves too fast the rising of the balls will elevate the rotating and sliding rod (l') and with it the helical cams (k' k') which by their helical form and rotation come in contact with the projections (j' j') on the valve rods (h' h') to strike them the sooner and therefore to liberate the valves at a shorter part of the stroke of the piston and the sooner to cut off the steam which will reduce the power of the engine and consequently its velocity. In this way the motions of the engine are regulated.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "When the balls of the governor are entirely down, as when the engine is at rest, the helical cams (k' k') are below the plane of motion of the steam valve rods, so that these can have their full motion without striking the cams. In this position of the parts the steam valves will operate in manner similar to the exhaust valves, and the steam will not be cut off. All that is necessary therefore to work the engine full stroke is simply to liberate the slide of the governor, or disconnect the governor. When the steam valves are not to be used as cut-off valves they are to be operated in every particular like the exhaust valves. It will be obvious from the foregoing that when the valves are arranged to move in planes parallel with the axis of the cylinder, as is usual with slide valves, that the rock shaft by which they are operated is to be differently located, and that whenever the location of the rock shaft is to be changed that the joints of connection of the connecting rods therewith are to be placed nearer together or farther apart so as to give the required range of motion to the valves in accordance with the principle of my invention. The best mode of arranging the parts when the valves move in planes parallel with the axis of the cylinder is fully represented in the additional ",
        },
        {
          kind: "reference",
          text: "Figs. 8 and 9",
          href: "#corliss-fig-8",
          referenceType: "figure",
          label: "Open the source-faithful crops for Figures 8 and 9",
          figurePreviews: [
            {
              src: "/patents/figures/us-6162-corliss-steam-engine-fig-8-preview.png",
              alt: "Figure 8 from US 6,162.",
              width: 720,
              height: 1057,
            },
            {
              src: "/patents/figures/us-6162-corliss-steam-engine-fig-9-preview.png",
              alt: "Figure 9 from US 6,162.",
              width: 720,
              height: 1057,
            },
          ],
        },
        {
          kind: "text",
          text: "—where the same letters are used to indicate corresponding parts as in the figures described above.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I wish it to be distinctly understood that in the mode of regulating the cut off by the governor I do not limit myself to the use of the particular kind of cams described or represented, as the form, position, and operation of these may be greatly varied without changing the principle of this part of my invention; as for instance, stops or cams connected with the slide of the governor by levers may be made to slide in the direction of the plane of motion of the valve rods to vary the periods of liberating the catches of the valve rods; or wedge formed stops or cams may be substituted for the helical cams and attached to the cam rod which in that case must not turn. The mode of applying this principle which I have first described is the one which I have essayed with success and therefore I have described it minutely, but the two modifications indicated will show clearly that the same principle is susceptible of various modifications.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal("What I claim as my invention and desire to secure by Letters Patent is—"),
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The method, substantially as described, of operating the slide valves of steam engines by connecting the valves that govern the ports at opposite ends of the cylinder, with separate arms of the rock shaft, or the mechanical equivalents thereof, so that from the motion thereof the valve that keeps its port or ports closed shall move over a less space while its port or ports is closed than the one that is opening or closing its port, or ports, and vice versa, while at the same time the two arms by which they are operated have the same range of motion, as described, whereby I am enabled to save much of the power heretofore required to work the slide valves of steam engines, and by which also I am enabled to give a greater range of motion to the valves at the periods of opening and closing the ports to facilitate the induction and eduction of steam, as specified.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "And lastly I claim the method of regulating the motion of steam engines by means of the centrifugal regulator by combining the said regulator with the catches that liberate the steam valves by means of movable cams or stops, substantially as described.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "GEORGE H. CORLISS. Witnesses: A. P. BOURNE. E. P. McCREA. [FIRST PRINTED 1913.]",
      ),
    },
  ],
};

/** Companion readings keyed to the exact paragraph blocks above. CopperGrove
 * must merge this record into the shared parallel-reading registry. */
export const corlissSteamEngineParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "This conventional opening addresses the public who may need to identify the legal instrument.",
  ],
  6: [
    "Corliss identifies himself and promises a full account of what is new, how it is made, and how it operates. The figures are part of that account, not decoration.",
  ],
  7: [
    "The first four sheets show the actual engine and its valve gear: Fig. 1 is the side elevation, Fig. 2 the longitudinal section, Fig. 3 the valve gear elevation, Fig. 4 its plan, Fig. 5 the latch, and Figs. 6 and 7 the dashpot. The source crops preserve those distinctions.",
  ],
  8: [
    "A letter denotes the same component wherever it appears. This is the patent's cross-reference system.",
  ],
  9: [
    "The first invention is a preloaded structural frame for a beam engine. Tight diagonal braces carry the piston load in tension between the cylinder, beam bearings, and crankshaft supports, instead of allowing the bed and standards to flex repeatedly.",
  ],
  10: [
    "Corliss identifies a loss in paired slide valves: while one valve is opening, the other is shut yet still being dragged under full steam-pressure friction. His mechanism reduces travel of the closed valve without sacrificing rapid port opening and closing.",
  ],
  11: [
    "One rock shaft has two crank arms set at different angular positions. The arm for the working valve passes through its high-motion part of the arc; the arm for the closed, pressure-loaded valve stays near its dead point. Equal shaft rotation therefore gives unequal useful valve travel.",
  ],
  12: [
    "The governor does not throttle steam. Overspeed lifts its centrifugal balls, moves a cam into an earlier meeting with the valve-rod catch, releases the admission valve sooner, and lets the trapped steam expand for the rest of the stroke. A slower engine delays that release.",
  ],
  13: [
    "Here the text names the load path: bed a, cylinder b, crank boxes c, beams d, standards e, hollow f, nuts g, tension rods h, keys i, beam shaft j, and beam k. Tightening the rods prestresses the standards and beams before steam load is applied.",
  ],
  14: [
    "The tension-braced frame is designed to stay stiff on both halves of the piston cycle. On the upstroke, forces follow diagonal rods; on the return, the standards take vertical load while the beams remain tied by the braces. Corliss is solving fatigue and misalignment before discussing the cutoff gear.",
  ],
  15: [
    "Two admission valves and two exhaust valves occupy upper and lower steam chests. Exhaust-valve rods, levers, and the rock shaft turn a quarter-cycle arrangement into alternating motion: one wrist has maximum leverage while the other is near dead center.",
  ],
  16: [
    "The geometry gives fast travel to the valve that must change port state and slow travel to the valve that remains shut against steam pressure. The eccentric drives the rock shaft, but the crank-arm phasing controls where that rotation becomes linear rod travel.",
  ],
  17: [
    "Admission valves add a rack-and-catch connection. The rock shaft normally drives the rack; a spring-held catch makes the valve rod follow it until the trip releases that connection.",
  ],
  18: [
    "A projection on the valve rod strikes the governor-set cam after the valve has opened. That releases the catch. A weighted bent lever then closes the valve so expansion completes the stroke, while an air cylinder compresses air at the end of travel to cushion the mechanism rather than let it slam.",
  ],
  19: [
    "Both admission valves use the same alternating arrangement. The governor's rotating, sliding helical cams rise when speed is high and encounter the valve-rod projections earlier. Earlier release means earlier cutoff, less admitted steam, and less engine power.",
  ],
  20: [
    "With the governor slide released or disconnected, the cams sit below the valve-rod path and the engine takes full steam for the full stroke. Corliss also describes a parallel-to-cylinder layout in Figs. 8 and 9 and says that changing linkage spacing can preserve the same motion principle.",
  ],
  21: [
    "The patent is not limited to one cam shape. Sliding stops, cams, or wedges may set the release time so long as the governor-controlled release principle remains. Corliss describes his successful arrangement in detail while expressly reserving equivalent modifications.",
  ],
  22: ["The claims now state the legal combinations for which Corliss requests protection."],
  25: [
    "Corliss signs the specification. A. P. Bourne and E. P. McCrea witness it; the printed copy records that it was first printed in 1913.",
  ],
};
