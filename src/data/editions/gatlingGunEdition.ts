import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

/** Measured with ImageMagick identify against the committed local PNG crops. */
const GATLING_FIGURE_PREVIEW_DIMENSIONS: Record<number, readonly [number, number]> = {
  1: [560, 830],
  2: [420, 1580],
  3: [800, 760],
  4: [420, 420],
  5: [260, 290],
  6: [180, 400],
  7: [180, 170],
};

const previews = Object.fromEntries(
  Array.from({ length: 7 }, (_, index) => {
    const figure = index + 1;
    const [width, height] = GATLING_FIGURE_PREVIEW_DIMENSIONS[figure];
    return [
      figure,
      {
        src: `/patents/figures/us-36836-gatling-gun-fig-${figure}-preview.png`,
        alt: `Figure ${figure} from US 36,836, Improvement in Revolving Battery-Guns.`,
        width,
        height,
      },
    ];
  }),
) as Record<number, { src: string; alt: string; width: number; height: number }>;

const figure = (number: number) => ({
  kind: "reference" as const,
  text: `Fig. ${number}`,
  href: `#figure-${number}`,
  referenceType: "figure" as const,
  label: `Open Figure ${number} from the pinned US 36,836 facsimile`,
  figurePreviews: [previews[number]],
});

/**
 * Paragraph- and claim-level companion reading for this edition. Keys are the
 * exact zero-based indexes of `gatlingGunArchivalEdition.blocks`; the mapping
 * is intentionally local until an editor elects to register it globally.
 */
export const gatlingGunParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This formal address is the patent's public notice. It introduces the legal instrument to anyone who may need to inspect what follows.",
  ],
  3: [
    "Gatling identifies himself, his Indianapolis location, and the subject as an improvement in fire-arms. He also makes the required specification promise: the written description plus its drawings are meant to be full enough for a skilled reader to make and use the invention.",
  ],
  4: [
    "Figure 1 shows the gun in side elevation with part of the wheels removed; Figure 2 cuts lengthwise through its center; and Figure 3 looks down with part of casing A and the middle of the barrels removed. Those cuts reveal relationships that an exterior view hides.",
    "Figure 4 is a cross-section of lock-cylinder D on line x-y, Figure 5 is the end of grooved carrier C, Figure 6 isolates a lock tube and its hammer and spring, and Figure 7 isolates ring P. The ring's two rear inclined planes are the fixed surfaces that push each hammer back into its working positions.",
  ],
  5: [
    "The proposed gun is meant to be compact and durable enough for attack or defence, lighter and more portable than field artillery, rapidly fired, and operated by few people. This is an intended operating role, not a numerical rate-of-fire claim.",
  ],
  6: [
    "The central arrangement is a rotating lock-cylinder or breech, a grooved carrier, and multiple barrels all fixed to one shaft. Each lock, carrier groove, and barrel runs parallel to the shaft axis, so rotating the shaft carries the matched parts around together rather than turning an independent feeder beside stationary barrels.",
  ],
  7: [
    "A fixed ring P cocks and repositions the rotating hammers without a conventional trigger. Separate inner lock tubes also move forward against cartridge-chambers at discharge, helping seal the chamber to the barrel and keeping the protected lock mechanism inside casing A and disk I.",
  ],
  8: [
    "The same letters identify the same part wherever it appears in the several drawings. The text therefore uses the drawing labels as a cross-reference system, not as generic names.",
  ],
  9: [
    "Gatling now changes from the invention statement to construction and operation. The following paragraphs specify the physical arrangement a skilled maker would reproduce.",
  ],
  10: [
    "The usual construction has six rifle barrels E secured at both ends in circular plates F and G on shaft N. That shaft also carries carrier C, lock-cylinder D, and cog-wheel K; casing A protects D and K, while frame B and an ordinary gun-carriage support the rotating group.",
  ],
  11: [
    "Lock-cylinder D has six longitudinal holes, one for each barrel, plus slots from the surface to admit hammer projections b. Figure 4 shows the six-hole relationship; Figure 6 shows one of the locks inserted into one such hole.",
  ],
  12: [
    "Each lock is a tube a with a flanged breech-pin c at its rear, hammer b, and mainspring d. The flange gives the coiled spring a reaction surface, and Figure 2 is the source view for the assembled cross-section.",
  ],
  13: [
    "Carrier C lifts loaded cartridge-chambers from hopper H to the firing position, then continues rotating until they fall out by gravity. A fixed comb or rake on the frame, shown in Figures 2 and 3, ensures a chamber is removed instead of remaining in a groove.",
  ],
  14: [
    "Ring P is fixed to frame B, not to the rotating lock-cylinder. Its larger rear incline cocks each hammer as it passes; its smaller incline returns the hammer into its tube after it strikes the percussion-cap, allowing the fired cartridge-chamber to leave carrier C.",
  ],
  15: [
    "Disk I divides casing A: its forward part shields the locks, and its rear part protects cog-wheels K and L. Steel plug O projects slightly from the disk; as a tube reaches that swell, it pushes the tube and cartridge-chamber forward against the barrel, reducing powder-gas escape and also compressing mainspring d so hammer b strikes the percussion-cap harder.",
  ],
  16: [
    "The rounded head of each breech-pin c rests against disk I under spring e. Until it reaches swell O, the lock front stays flush with lock-cylinder D; at the swell it moves forward as described. This states both the normal position and the limited position in which the sealing advance occurs.",
  ],
  17: [
    "Main shaft N carries D, C, barrels E, and gear K and is supported at disk I and frame B. Separate crank-shaft M runs through casing A with pinion L and hand crank S; L meshes with K to turn the main rotating assembly.",
  ],
  18: [
    "Adjusting screw T changes the pressure applied to cartridge-chambers R. Loaded chambers, with cap or nipple ends facing the hammers, go into hopper H; turning crank S turns M, pinion L, gear K, then N, D, C, and E. The chambers roll into carrier C, rise to discharge, and remain aligned because hammers, chambers, and barrels are parallel to the rotation axis.",
  ],
  19: [
    "The large incline on stationary ring P pushes hammer b back. Once past that incline's highest point, mainspring e drives the hammer into the percussion-cap on the cartridge-chamber nipple; after discharge the holder continues around and falls out by its own weight for reloading.",
  ],
  20: [
    "Gatling expressly narrows the scope before claiming it. He does not claim grooved carrier C by itself when it revolves independently, calling that an old device; nor does he claim its direct combination with an automatic rotating gear or a chamber-pressing device when that device is used alone. The following claims seek only the combinations he treats as new.",
  ],
  27: [
    "This is Gatling's signature, identifying the inventor who makes the specification and claims.",
  ],
  28: ["A. F. Mathew and W. O. Rockwood are printed as witnesses to the instrument."],
};

/**
 * Manually prepared from the three sheets of US 36,836. The document remains
 * one continuous reading argument: source-sheet folios and scan boundaries
 * are deliberately absent from these authored nodes.
 */
export const gatlingGunArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "1eb10666b48d84d2e2be3e09168c6f4f224e531428f7f7c39fdf70ff60d0683f",
  preparedBy: "codex-lima",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "RICHARD J. GATLING, OF INDIANAPOLIS, INDIANA.",
        "IMPROVEMENT IN REVOLVING BATTERY-GUNS.",
        "Specification forming part of Letters Patent No. 36,836, dated November 4, 1862.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figures 1–7",
      title: "Machine gun, its locks, carrier, and cocking ring",
      description: [
        { kind: "text", text: "The source drawing sheet contains " },
        figure(1),
        { kind: "text", text: ", " },
        figure(2),
        { kind: "text", text: ", " },
        figure(3),
        { kind: "text", text: ", " },
        figure(4),
        { kind: "text", text: ", " },
        figure(5),
        { kind: "text", text: ", " },
        figure(6),
        { kind: "text", text: ", and " },
        figure(7),
        { kind: "text", text: ". It is the first sheet of the pinned facsimile." },
      ],
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that I, RICHARD J. GATLING, of Indianapolis, county of Marion, and State of Indiana, have invented new and useful Improvements in Fire-Arms; and I do hereby declare that the following is a full and exact description thereof, reference being had to the accompanying drawings, making part of this specification, in which—",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        figure(1),
        {
          kind: "text",
          text: " is a side elevation of the gun with the upper portion of the wheels cut away. ",
        },
        figure(2),
        {
          kind: "text",
          text: " is a vertical longitudinal section through the center of the gun. ",
        },
        figure(3),
        {
          kind: "text",
          text: " is a top view of the gun with the top half of the external casing, A, left off and the middle portion of the barrels cut away to shorten the drawing. ",
        },
        figure(4),
        {
          kind: "text",
          text: " is a transverse section through lock-cylinder on line x y in Figs. 1 and 2. ",
        },
        figure(5),
        {
          kind: "text",
          text: " is an end view of the grooved carrier C which receives the cartridges or cartridge-chambers. ",
        },
        figure(6),
        {
          kind: "text",
          text: " is a side view of one of the tubes containing the mainspring and hammer of one of the locks. ",
        },
        figure(7),
        {
          kind: "text",
          text: " is a perspective view of the ring P which surrounds the forward end of the lock-cylinder D, having inclined planes on its rear edge for cocking and drawing back the hammers to their proper position.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The object of this invention is to obtain a simple, compact, durable, and efficient fire-arm for war purposes, to be used either in attack or defence, one that is light when compared with ordinary field-artillery, that is easily transported, that may be rapidly fired, and that can be operated by few men.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The invention consists in a singularly-constructed " },
        {
          kind: "term",
          text: "revolving lock cylinder or breech",
          definition:
            "The rotating cylinder that contains one lock for each barrel; in modern terms, a rotating breech-and-bolt carrier.",
          label: "Defined usage",
        },
        { kind: "text", text: ", in combination with a " },
        {
          kind: "term",
          text: "grooved carrier",
          definition:
            "The rotating, slotted part that carries loaded cartridge-chambers from the hopper to the firing position and onward to release.",
          label: "Defined usage",
        },
        {
          kind: "text",
          text: " and barrels all rigidly fixed upon the same shaft, and all of which revolve together when the gun is in operation, the locks and grooves in the carrier and the barrels all being parallel with the axis of revolution.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The invention also consists in the novel means employed in cocking and firing the gun without the use of a trigger by means of the inclined plane on the rear edge of the ring P, which surrounds the forward end of the lock-cylinder, and also in the novel use of the inner tubes (which contain the locks) to press the ",
        },
        {
          kind: "term",
          text: "cartridge-chambers",
          definition:
            "Separate loaded chambers or holders, rather than a modern integral cartridge chamber permanently cut into a barrel.",
          label: "Period ammunition term",
        },
        {
          kind: "text",
          text: " firmly against the rear ends of the barrels while being discharged, and in the outer casing and disk, which protects the locks from injury.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Similar letters of reference indicate corresponding parts in the several figures.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "To enable others skilled in the art to make and use my invention, I will proceed to describe its construction and operation.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I construct my gun usually with six ordinary rifle-barrels, E, fixed at their rear and forward ends into circular plates F and G, which are rigidly secured to a shaft, N, upon which is also rigidly fixed the grooved carrier C and lock-cylinder D and cog-wheel K. A case or shield, A, covers and protects the lock-cylinder and cog-wheel. All of these several parts are mounted on a frame, B, and are supported by an ordinary gun-carriage.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The lock-cylinder D is perforated longitudinally with six holes, (corresponding to the number of barrels,) as shown in ",
        },
        figure(4),
        {
          kind: "text",
          text: ", and has slots cut through from the surface of the cylinder to the holes to admit the projecting portion of the hammers b. In the perforations or holes in the lock-cylinder the locks (one of which is shown in elevation in ",
        },
        figure(6),
        { kind: "text", text: ") are placed." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The locks are constructed of the tubes a a, &c., having a " },
        {
          kind: "term",
          text: "flanged breech-pin",
          definition:
            "A pin at the rear of each lock tube with a projecting flange; the flange gives the spring a surface against which to act.",
          label: "Period lock part",
        },
        {
          kind: "text",
          text: ", c, secured in their rear ends and provided with hammers b and mainsprings d, all formed and arranged as clearly shown in section in ",
        },
        figure(2),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "C is a grooved carrier for conveying the cartridge-chambers from the reservoir or hopper H up to the position in which they are fired, and thence on around until they fall out by their own weight; but that the cartridge-chambers may be removed with certainty from the grooved carrier C a comb or rake is provided and attached to the frame, as shown by the red lines in ",
        },
        figure(2),
        { kind: "text", text: " and " },
        figure(3),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "P, Figs. 2, 3, and 7, is a ring encircling the forward end of the lock-cylinder D, and is rigidly secured by lugs to the frame B. The rear edge of this ring is formed into two inclined planes, as clearly shown in ",
        },
        figure(3),
        {
          kind: "text",
          text: ", the greater inclined plane serving to push back or cock the hammers b as they are successively revolved, while the lesser inclined plane serves to push the hammers back into their proper places within the tubes a after they have struck the percussion-cap, so as to allow the cartridge-chambers to drop from the carrier.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The disk I forms a division in the case A, the forward portion of the case forming a shield or covering for the locks, while the rear division contains and protects the cog-wheel K and L. In the forward face of the disk I a small steel plug, O, is inserted, having its forward face rounded or swelled out slightly beyond the face of the disk. This swell is for the purpose of pressing the tubes a forward against the cartridge-chambers R, and thus pressing the cartridge-chambers firmly against the rear end of the barrel at the time of each and every discharge, thereby preventing the escape of gas from the ignited powder. The forward motion of the tubes a, caused by the swell O on disk I, also assists in compressing the mainsprings d, thereby increasing the force of the blow from the lock-hammers b upon the percussion-caps on the nipples of the cartridge-chambers.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The rounded heads of the breech-pin c bear against the forward face of the disk I, being kept in their position by the coiled springs e e, &c., which surround the rear ends of the tubes a a, &c., the springs e bearing against the rear end of the lock-cylinder and against the flange of the breech-pin c. By this arrangement the forward ends of the locks are kept flush with the forward face of the lock-cylinder until they are revolved opposite the swell o, when they are pressed forward, as before described.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The shaft N, upon which the lock-cylinder D, carrier C, barrels E, and cog-wheel K are rigidly secured, has a bearing near its rear end in disk I and a bearing at its forward end in a box on the frame B. A crank-shaft, M, runs through the rear part of case A and has fixed upon it the small cog-wheel or pinion L and crank S.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "An adjusting-screw, T, is placed in the box opposite the forward end of shaft N, for regulating the pressure upon the cartridge-chambers R. The cartridge-chambers R, (any desired number of which may be used,) being loaded, are placed in the hopper or reservoir, with their nipple or cap ends toward the hammers, over the grooved carriers C, when, by rotating the crank S, which carries with it the shaft M, and pinion L, which meshes into the large cog-wheel K, thereby revolving the shaft N, lock-cylinder D, carrier C, and barrels E, the cartridges drop or rather roll into the grooves of carrier C and are carried by it up to the position in which they are discharged. The hammers, cartridge-chambers, and barrels all being on a line parallel to the axis of revolution, it is impossible for the cartridges to be out of place when discharged.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The hammers b are pushed back by the large inclined plane on the rear edge of the ring P, and when they have passed the highest point of the inclined plane they are driven forward against the percussion-cap on the nipple of the cartridge-chamber by the coiled mainspring e with sufficient force to explode the cap and discharge the cartridge, after which the cartridge-holder is carried on around until it drops out of the carrier by its own weight, when it is ready to be taken up and reloaded.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I do not claim the use of the grooved or fluted revolving carrier C, separately considered, and when the same is made to revolve separately and independently of the barrels and breech, the same being an old device; neither do I claim the direct combination thereof with an automatic revolving gear or with a device for pressing the cartridge-chamber against the barrel when used alone for that purpose; but",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "What I do claim as new and as my invention, and desire to secure by Letters Patent, is—",
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The combination of the lock-cylinder or breech D with the grooved carrier C, circular plate F, and barrels E E, &c., the lock-cylinder or breech, carrier, and circular plate being firmly fastened upon the main shaft N, and the locks, grooves in the carrier, and barrels being arranged on a line parallel with the axis of revolution, the whole revolving together when the gun is in operation, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "In the construction of revolving fire-arms, the use of as many locks as there are barrels, said locks revolving simultaneously with the breech and barrels, and being arranged and operated substantially as set forth.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "The stationary ring P, provided with inclined planes on its rear edge, in combination with lock-cylinder D and locks, when constructed and operated for the purposes substantially as set forth.",
      ),
    },
    {
      kind: "claim",
      number: 4,
      inlines: literal(
        "The tubes a a, &c., furnished with the flanged breech-pins c c, &c., and springs e e, &c., and which contain the lock-hammers b b, &c., and mainsprings d d, &c., in combination with the revolving breech D, disk I, and swell o, when constructed, arranged, and operated for the purposes substantially as set forth.",
      ),
    },
    {
      kind: "claim",
      number: 5,
      inlines: literal(
        "The disk I, in combination with the external breech-piece or casing, A, which forms a shield or covering for the lock-cylinder and which protects the locks and cog-wheels from injury.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "RICHARD J. GATLING." }] },
    {
      kind: "paragraph",
      inlines: [{ kind: "small-caps", text: "Witnesses: A. F. MATHEW, W. O. ROCKWOOD." }],
    },
  ],
};
