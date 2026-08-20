import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

const FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 450, height: 710 },
  2: { width: 260, height: 720 },
  3: { width: 380, height: 580 },
  4: { width: 440, height: 700 },
  5: { width: 360, height: 400 },
  6: { width: 340, height: 390 },
  7: { width: 360, height: 190 },
  8: { width: 360, height: 160 },
  9: { width: 380, height: 140 },
  10: { width: 360, height: 320 },
  11: { width: 240, height: 300 },
  12: { width: 190, height: 300 },
  13: { width: 180, height: 300 },
  14: { width: 170, height: 300 },
  15: { width: 150, height: 300 },
  16: { width: 160, height: 300 },
  17: { width: 360, height: 330 },
  18: { width: 360, height: 90 },
  19: { width: 140, height: 350 },
  20: { width: 240, height: 380 },
};

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: `/patents/figures/us-48475-yale-lock/fig-${num}-source-crop-v1.png`,
      alt: `Figure ${num}: ${altText}`,
      width: FIGURE_DIMS[num]?.width ?? 300,
      height: FIGURE_DIMS[num]?.height ?? 300,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const YALE_LOCK_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal legal preamble: Linus Yale, Jr., master locksmith of Shelburne Falls, Massachusetts, establishes his legal declaration of new and useful improvements in lock mechanisms.",
  ],
  2: [
    "Comprehensive guide to the twenty patent figures: Fig. 1 side elevation; Fig. 2 front plate elevation; Fig. 3 case interior cross-section; Fig. 4 longitudinal section showing cylinder in door; Figs. 5, 7, 8 bolt elevation and retention contrivance; Fig. 9 elastic bolt-retaining plate; Fig. 6 transverse cylinder cross-section; Fig. 10 longitudinal pin chamber array; Fig. 11 plug body; Figs. 12-14 plug cross-sections; Figs. 15-16 lazy-arm interaction; Figs. 17-18 flat bitted key and tumbler division lines; Fig. 19 pin tumbler and spring stack; Fig. 20 interior tumbler-case end view.",
  ],
  3: [
    "Broad mechanical scope: the invention applies primarily to pin-tumbler cylinder locks, with modular applicability to mortise and rim locks across commercial and residential security.",
  ],
  4: [
    "Dual pedagogical purpose: the improvements solve two fundamental historical deficits—vulnerability to manipulation/picking, and complex door installation across differing door thicknesses and right/left swing handings.",
  ],
  5: [
    "Bolt retention and insertion mechanism: mortise case A houses bolt B with talons and projection F, retained by elastic spring plate F' and clamping screw G, allowing insertion directly through the front mortise faceplate after case installation.",
  ],
  6: [
    "Externally threaded modular cylinder housing: cylindrical tumbler-case C features external machine threads mating with tapped nut O in the lock case, clamped via off-axis pointed set screw H to adjust cylinder projection flush with doors of any thickness.",
  ],
  7: [
    "The core pin-tumbler shear-line mechanism: eccentric revolving plug D houses five two-piece pin tumblers (upper driver pin I and lower key pin J) loaded by springs L. Flat bitted steel key K lifts the pins so their division lines align exactly at the shear line flush with plug D's circumference. Circumferential anti-pick notches (serrations) prevent picking while wide pin chambers support the pins against key thrust.",
  ],
  8: [
    "Lost-motion lost-angle cam (lazy-arm): plug D features ring recess s and axial groove t that engage drive knob v on stamped steel lazy-arm E with bolt-throwing wing W, providing rotary clearance and deadlocking bolt engagement.",
  ],
  9: [
    "Tumbler-case circumferential clearance slit: transverse arcuate slit W' allows the lazy-arm to rotate freely within the cylinder housing when the cylinder is threaded into place.",
  ],
  10: [
    "Sequential assembly and plug dead-retention: inserting pins and springs, compressing drivers I, sliding plug D with groove t over knob v, and releasing inner pin J into the retaining groove ensures the rotating plug cannot be extracted from the front without the authorized key.",
  ],
  11: [
    "Lost-motion rotation geometry and anti-forcing deadbolt lock: the key-containing plug rotates nearly a full 360° to allow key extraction, while the lazy-arm traverses a smaller angle (approx. 90°-120°) to remain in direct blocking contact with the bolt talon, mechanically deadlocking the bolt against external forcing.",
  ],
  12: [
    "Automatic key alignment stops: bilateral stop knobs on the lazy-arm strike bolt talons at the locked and unlocked terminal positions, ensuring the cylinder plug always comes to rest with all pin chambers perfectly in line for immediate key insertion or removal.",
  ],
  13: [
    "Independent utility of constituent inventions: Yale notes that the cylinder retention ring, lost-motion lazy-arm deadbolt actuator, alignment stops, and modular threaded mortise mounting possess distinct security and mechanical utility individually or in combination.",
  ],
  20: ["Inventor signature: Linus Yale, Jr."],
  21: ["Attestation of subscribing witnesses: Arthur Maxwell and Henry Winn."],
};

export const yaleLockParallelReadings = YALE_LOCK_PARALLEL_READINGS;

export const yaleLockArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "LINUS YALE, JR., OF SHELBURNE FALLS, MASSACHUSETTS.",
        "IMPROVEMENT IN LOCKS.",
        "Specification forming part of Letters Patent No. 48,475, dated June 27, 1865.",
      ],
    },
    p(
      "To all whom it may concern:\nBe it known that I, ",
      term(
        "LINUS YALE, Jr.",
        "Linus Yale Jr.",
        "American mechanical engineer, inventor, and manufacturer (1821–1868) who revolutionized lock security by miniaturizing the pin-tumbler cylinder lock and inventing the flat serrated key.",
      ),
      ", of Shelburne Falls, in the county of Franklin and State of Massachusetts, have invented certain new and useful Improvements in Locks; and I do hereby declare that the following, taken in connection with the drawings, is a full, clear, and exact description thereof.",
    ),
    p(
      "In the drawings, ",
      makePreview("Figure 1", [1], "Side elevation of mortise lock case and cylinder"),
      " is a side elevation of the lock; ",
      makePreview("Fig. 2", [2], "Front elevation showing bolt face"),
      ", a front elevation thereof; ",
      makePreview("Fig. 3", [3], "Section on line x x of Fig. 2"),
      ", a section on line x x of ",
      makePreview("Fig. 2", [2], "Front elevation showing bolt face"),
      "; ",
      makePreview("Fig. 4", [4], "Section on line y y of Figs. 1 and 3"),
      ", a section on line y y of ",
      makePreview("Figs. 1 and 3", [1, 3], "Side elevation and section"),
      ". ",
      makePreview(
        "Figs. 5, 7, and 8",
        [5, 7, 8],
        "Elevation of bolt, talons, and retention contrivance",
      ),
      " are an elevation of the bolt and the contrivance for securing it, and a section through the former. ",
      makePreview("Fig. 9", [9], "Plan of elastic bolt-securer"),
      " is a plan of the elastic bolt-securer. ",
      makePreview("Fig. 6", [6], "Section through tumbler-case and cylinder on line z z of Fig. 4"),
      " is section through the tumbler-case and cylinder on line z z of ",
      makePreview("Fig. 4", [4], "Section through door and cylinder"),
      ". ",
      makePreview("Fig. 10", [10], "Section through cylinder on plane perpendicular to lock-case"),
      " is a section through the same on a plane perpendicular to the lock-case. ",
      makePreview("Fig. 11", [11], "Elevation of cylinder plug"),
      " is an elevation of the cylinder, and ",
      makePreview("Figs. 12, 13, and 14", [12, 13, 14], "Sections through cylinder plug"),
      " are sections through the same. ",
      makePreview("Figs. 15 and 16", [15, 16], "Sections through cylinder and lazy-arm"),
      " are sections through the cylinder and lazy-arm. ",
      makePreview(
        "Figs. 17 and 18",
        [17, 18],
        "Plan and elevation of tumblers and flat bitted key",
      ),
      " are a plan and elevation of one section of the tumblers and the key. ",
      makePreview("Fig. 19", [19], "Elevation of both sections of a tumbler and their spring"),
      " is an elevation of both sections of a tumbler and their spring; and ",
      makePreview("Fig. 20", [20], "Plan of tumbler-case and lazy-arm from inside of lock"),
      " is a plan of the tumbler-case, lazy-arm, &c., from the inside of the lock.",
    ),
    p(
      'The improvements herein described are chiefly applicable in that class of tumbler-locks known as "',
      term(
        "pin-locks",
        "Pin-Tumbler Lock",
        "A lock mechanism using a series of spring-loaded split pins that must be lifted to exact heights by a bitted key to align with the shear line between plug and housing.",
      ),
      ';" but some of them are useful in other classes of locks, and the improvements may be used either together, as I have shown them, or separately in connection with locks which are wanting in some or all others of the improvements invented by me.',
    ),
    p(
      "The improvements relate partly to the security of locks against picking, partly to methods of construction, rendering the lock easy of adaptation to doors, either right or left hand, or of various degrees of thickness. I will proceed to describe the latter, first premising that the lock shown in the drawings is a ",
      term(
        "mortise-lock",
        "Mortise Lock",
        "A lock designed to be installed inside a pocket (mortise) cut into the edge of a door, requiring only a small cylindrical hole drilled through the door face for the key cylinder.",
      ),
      " and that the improvements are equally applicable to rim-locks.",
    ),
    p(
      "In the drawings, the case of the lock is shown at A A, having two sides and a plate, as usual in mortise-locks. In each side of the case is a hole, O, having a screw-thread cut in it, so as to form a nut, and in the case works the bolt B, provided with ",
      term(
        "talons",
        "Bolt Talons",
        "Notches or projecting lugs on the rear shank of a sliding lock bolt that engage the rotating cam or lazy-arm to shoot or retract the bolt.",
      ),
      ", as shown, as usual, and also with a pin or projection, F. Between this pin and the case is secured an elastic plate having in it a hole, F', as long as the pin and the play of the bolt. The elastic plate tends always to spring upward, as in ",
      makePreview("Fig. 8", [8], "Elastic plate springing upward"),
      ", but may be forced and held downward by the screw G, in the position shown in ",
      makePreview("Fig. 3", [3], "Section showing elastic plate held downward by screw G"),
      ". The bolt is to be shoved into place, the pin passing below the elastic plate, and when in place the screw G is to be screwed home, thus forcing the plate down and preventing the bolt from being wholly withdrawn from the lock, while at the same time it can be shot and retracted; and this contrivance for holding a bolt in place, which enables me to insert the bolt through the bolt-hole, and, if desired, after the lock is in place on the door, is the first feature of my invention.",
    ),
    p(
      "A case, C, contains the tumblers and a wing, E, moved by the key. This case has a thread cut on its outside corresponding with the screw-threads in O, and the tumbler-case can be screwed into either side of the lock-case, thus making it a right or left hand lock. The wing or ",
      term(
        "lazy-arm",
        "Lazy-Arm Cam",
        "A lost-motion cam ring that is rotated by the cylinder plug through less than a full revolution, maintaining continuous blocking contact with the bolt talon in both locked and unlocked states.",
      ),
      " E, which actuates the bolt, is very thin—only as thick as the slit shown in ",
      makePreview("Fig. 11", [11], "Slit S on cylinder plug"),
      " at S—and it can act over any part of the talons from p to q, ",
      makePreview("Fig. 7", [7], "Talon range from p to q"),
      ". It is therefore clear that the tumbler-case may be screwed in to different depths, thus making the lock suitable for doors of various thickness, and still leaving the end of the tumbler-case—which in the present instance forms the escutcheon—flush with the face of the door. The tumbler-case, when set in to the right depth, may be fastened by a jam-nut set up through the bolt-opening before the bolt is in position; but I prefer to secure the case in the lock by a pointed screw, H, which screws into either of two bosses cast on the inside of the case, one on each side of the lock. This screw is a little out of parallel with the side of the lock-case, and is to be set up so as to hold the tumbler-case in any desired position by a screw-driver inserted through the bolt-hole before the bolt is placed in position, and the contrivance for making the lock either right and left hand, or suitable for different thicknesses of doors, or both, is of my invention.\n\nThe tumbler-case C is, as before stated, cylindrical, and has a cylindrical bore through it,",
    ),
    p(
      "into which is inserted the ",
      term(
        "cylinder D",
        "Rotating Plug Cylinder",
        "The inner cylindrical core of the lock containing the keyway and bottom pin chambers, which rotates freely within the outer housing when all pins are elevated to the shear line.",
      ),
      " eccentric to the tumbler-case. D has holes bored nearly through it in planes perpendicular to its axis, as at r r r, and the tumbler-case is provided with corresponding holes, r' r' r'. The tumblers or pins are each made in ",
      term(
        "two pieces, I and J",
        "Driver Pin & Key Pin",
        "A two-piece pin stack: the upper driver pin (I) spans the shear line in the locked state, while the lower key pin (J) rests on the key bitting.",
      ),
      ", and each is provided with a ",
      term(
        "spring, L",
        "Tumbler Compression Spring",
        "A small helical spring situated above the driver pin that continuously pushes the pin stack downward across the shear line into the revolving plug.",
      ),
      ". The pieces I and J are of different lengths, and must all be arranged by the key, so that the various lines of division between the two parts of the tumblers are all in the same line before the cylinder D can be turned. (See ",
      makePreview("Fig. 17", [17], "Plan and elevation of tumblers and flat key"),
      ".) The ",
      term(
        "key K",
        "Flat Bitted Key",
        "A thin, lightweight flat blade of sheet steel with serrated bottom cuts that directly set pin heights, replacing heavy 19th-century cast-iron bit keys.",
      ),
      " is a thin slip of steel properly shaped to bring the lines of division between the tumblers into the same line and flush with the periphery of the cylinder D, and the key-hole is a narrow slit passing through the cylinder D in a plane parallel to its axis. The holes for the reception of both parts of the tumblers have a screw-thread tapped in them, or are cut full of notches, and both parts of the tumblers are notched perpendicular to their length, or nearly so, or have screws cut on their periphery, but in such manner that the greatest diameter of the tumblers is less than the least diameter of their containing-holes. These notches therefore, either on the tumblers or their recesses, or on both, as preferred, serve the purpose of the ",
      term(
        "racking",
        "Anti-Pick Serrations / Spool Notches",
        "Perpendicular circumferential grooves cut into pin surfaces and chamber walls that catch and bind against the shear line during picking attempts (precursor to modern spool and serrated security pins).",
      ),
      " on vibrating or rotating tumblers, preventing to a certain extent picking of the lock, and it is clear that the tumblers would, if their ends that projected into the key-hole were unsupported, be liable to jam in their recesses when an attempt was made to set them by the key. By observation of the drawings and examination of the preceding description, it will be perceived that the key-hole only cuts away a small portion of the top and bottom of each tumbler-recess, (see specially ",
      makePreview(
        "Figs. 13 and 14",
        [13, 14],
        "Sections showing key-hole cutting away small portion of recess",
      ),
      ",) and that the parts of the tumblers projecting into the key-hole are therefore supported by nearly the whole of the circumference of their containing holes or cavities against the thrust of the key. This plan of a thin key and narrow key hole, in connection with comparatively large cavities for tumblers, enables me to use racked tumblers in this class of lock, and racked pin-tumblers of greater diameter than the width of the key are of my invention.",
    ),
    p(
      "The cylinder D has a notch or ring-recess cut nearly around it, as at s, ",
      makePreview("Figs. 11 and 12", [11, 12], "Notch s cut nearly around cylinder"),
      ", and out of this notch leads a groove parallel with the cylinder's axis as at t, ",
      makePreview("Figs. 11, 12, 13, and 20", [11, 12, 13, 20], "Axial groove t in cylinder"),
      ', which extends to the inside end of the cylinder. A wing or "lazy-arm," as I term it, E, is stamped or otherwise formed out of a thin piece of steel. It has an aperture through it of the same diameter as the cylinder in all places but one, as at v, where a knob projects into the opening. This knob is a counterpart of the groove t. From the outside of the wing projects an arm, W, which is, properly speaking, the wing itself, as it acts on the bolt-talons. Two other projections are formed, one on each side of W, whose use will be explained hereinafter.',
    ),
    p(
      "A slit, W', as wide as the wing is thick, is cut into the tumbler-case perpendicular to its axis, and this slit extends around from z to z, ",
      makePreview("Fig. 20", [20], "Slit W' extending around from z to z"),
      ", so that the wing may be turned completely within the tumbler-case when the latter is screwed into the lock-case.",
    ),
    p(
      "The manner in which the parts are put together is as follows: All the parts J J and I I are inserted in their cavities, the parts I I being shoved into their recesses as far as possible, and the wing is inserted in its slot W'. The cylinder is then shoved into the tumbler-case with its groove t in line with the knob v, the parts I I being shoved back in succession to permit its passage. The groove t will then pass over the knob v, and the wing will then occupy its proper place in relation to the cylinder. If the cylinder be now turned till the parts I I J J are in a line, the springs will then cause J J to enter the cylinder, and as one of them passes nearer the end of the cylinder than the wing, thus filling the notch t, the cylinder cannot be retracted. In all other positions of the cylinder in its revolution the key must be in and the key must hold the innermost tumbler, I, over the groove t, or else the cylinder cannot revolve, and as long as it so holds it the cylinder cannot be withdrawn from the case. The wing therefore holds the cylinder that contains the key-hole in place, and this is one of its offices.",
    ),
    p(
      "By observation of ",
      makePreview("Figs. 15 and 16", [15, 16], "Key-hole cylinder turning without moving wing"),
      ' it will be perceived that the key-hole cylinder can turn nearly a whole revolution without moving the wing, which I therefore call a "lazy-arm," and as the key in pin-locks cannot be removed, except when both parts of the pins or tumblers are in line, the key-hole cylinder must move a whole revolution at both locking and unlocking, unless the key is to be left in the lock. If the wing moved with the cylinder, it would have to make a whole revolution, and would, of necessity, be out of contact with the bolt-talons both when the lock was locked and unlocked. By making it move less than a whole revolution I am enabled to keep the wing W in contact with a talon both when the lock is locked and unlocked, (see ',
      makePreview("Fig. 3", [3], "Wing W in contact with talon"),
      ",) and thus make the wing itself a stop, preventing forcing the bolts. This function of the wing is due to its moving through a less angle than the key-hole cylinder does.",
    ),
    p(
      "In the class of pin-locks the key, as before stated, can be removed and inserted only when both parts of the pins are in line, and it is useful to have some guide or stop which always causes the cylinder to come to rest in the position where the pins are in line. For this purpose I have formed upon the wing two knobs, one on each side of the wing W, and by inspection of ",
      makePreview("Fig. 3", [3], "Knobs striking against talons"),
      " it will be perceived that one or other of these knobs will strike against the talons when the lock is either locked or unlocked, thus preventing further rotation of the cylinder and forcing it to come to rest with both parts of the pins in line, so that the key may either be inserted or withdrawn when",
    ),
    p(
      "the lock is either locked or unlocked. The same effect might be produced by providing proper stops for the wing W to strike against, and I intend to use this plan as an equivalent for the other in some cases. This is the third function of the wing or lazy-arm, and it is clear that one of these functions might be performed without the others. For instance, the wing might be a mere ring with a knob, such as v, and in that case it would prevent removal of the cylinder, while another arm secured to the cylinder and moving with it might shoot the bolt, and some other stop might be used, or no stop at all; or the wing might be so made as to possess its function as a lazy-arm, thus moving the bolt and obviating the use of a separate bolt-stop, while it neither held the cylinder in place nor operated to prevent its revolution when the pins were in line; or it might merely act to stop the revolution of the cylinder containing the key, and act neither to shoot the bolt nor hold the key-containing cylinder in place. The cylindrical tumbler-chamber might contain other kinds of tumblers and still be useful as a means of making a lock either left or right hand, or applicable to different thicknesses of doors.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. The contrivance, substantially as described, for holding a bolt in place.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. The combination of a lock-case containing a bolt with a cylindrical chamber containing tumblers, all constructed and arranged with reference to each other substantially as described, whereby the lock may be made right or left hand or fitted to either thick or thin doors, the combination being substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "3. The combination of a cylinder containing tumblers and having a screw cut thereon with a lock-case having a nut attached to or making part thereof, and a screw-pin or its equivalent, arranged as described, whereby the former may be attached to the case so as to fit doors of different thickness, and secured in position by a device which is so arranged as to be acted upon through the bolt-hole.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "4. Notched pin-tumblers, in combination with a key-hole slit narrower than the diameter of the pins, and also notched containing-recesses, in combination with a key-hole slit narrower than their diameter, the combination being substantially such as described and operating substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "5. In combination with a cylinder containing a key-hole and pin-tumblers, a wing or lazy-arm, constructed and operated as specified.",
        },
      ],
    },
    p("LINUS YALE, JR."),
    p("In presence of—\nARTHUR MAXWELL,\nHENRY WINN."),
  ],
};

export const yaleLockEdition = yaleLockArchivalEdition;

export function manualYaleClaimText(claimNumber: number): string {
  const claimBlock = yaleLockArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Yale Lock archival edition is missing Claim ${claimNumber}`);
  }
  return claimBlock.inlines
    .map((inline) => (inline.kind === "text" || inline.kind === "term" ? inline.text : ""))
    .join("")
    .trim();
}
