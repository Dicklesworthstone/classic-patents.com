import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const individualFigurePreview = (number: number) => ({
  src: `/patents/figures/us-x9430-colt-revolver/fig-${number}-source-crop-v1.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US X9430.`,
  width: 600,
  height: 600,
});

const individualFigurePreviews: Readonly<
  Record<string, readonly ReturnType<typeof individualFigurePreview>[]>
> = {
  "Figure 1": [individualFigurePreview(1)],
  "Figure 2": [individualFigurePreview(2)],
  "Figure 3": [individualFigurePreview(3)],
  "Figure 4": [individualFigurePreview(4)],
  "Figure 5": [individualFigurePreview(5)],
  "Figure 6": [individualFigurePreview(6)],
  "Figure 7": [individualFigurePreview(7)],
  "Figure 8": [individualFigurePreview(8)],
  "Figure 9": [individualFigurePreview(9)],
};

const figure = (
  text: string,
  group: "division-2" | "division-3" | "division-4" | "plate-2",
): CuratedSpecificationInlines[number] => {
  const previews = {
    "division-2": [
      "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section.png",
      820,
      1420,
    ],
    "division-3": ["/patents/figures/us-x9430-colt-revolver/division-3-lock-parts.png", 760, 1080],
    "division-4": [
      "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder.png",
      1000,
      1220,
    ],
    "plate-2": ["/patents/figures/us-x9430-colt-revolver/plate-2-lockwork.png", 980, 1190],
  } as const;
  const [src, width, height] = previews[group];
  return {
    kind: "reference",
    text,
    href: `#${group}-drawing`,
    referenceType: "figure",
    label: `${text}, ${group.replace("-", " ")} source drawing crop`,
    figurePreviews: individualFigurePreviews[text] ?? [
      { src, alt: `${text} in the US X9430 ${group.replace("-", " ")} drawing.`, width, height },
    ],
  };
};

const cited = (
  ...parts: (string | CuratedSpecificationInlines[number])[]
): CuratedSpecificationInlines =>
  parts.map((part) => (typeof part === "string" ? { kind: "text", text: part } : part));

/**
 * A hand-prepared continuous reading edition of Samuel Colt's US X9430.
 * Four drawing sheets precede the three specification sheets in the pinned
 * facsimile. Their printed sheet numbers are described here as source matter,
 * but deliberately do not create scan-page boundaries in the reader.
 */
export const coltRevolverArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "61eed2c1b5ea259a301fb2690a7d3d17e1a59560cfb002dc91c29a50f5841d01",
  preparedBy: "codex-charlie",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "SAMUEL COLT, OF HARTFORD, CONNECTICUT.",
        "IMPROVEMENT IN FIRE-ARMS.",
        "9430X. Specification forming part of Letters Patent dated February 25, 1836.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 1 OF 4",
      title: "Division 2, sectional pistol view",
      description: literal(
        "S. COLT. Revolving Gun. 9430X. Patented February 25, 1836. The first drawing sheet carries the first sectional representation identified in the specification as Division 2.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 2 OF 4",
      title: "Sectional and component views",
      description: literal(
        "S. COLT. Revolving Gun. 9430X. Patented February 25, 1836. The second drawing sheet carries the sectional and component views used in the written description.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 3 OF 4",
      title: "Pistol, cylinder, arbor, and ratchet views",
      description: literal(
        "S. COLT. Revolving Gun. 9430X. Patented February 25, 1836. The third drawing sheet shows the pistol, cylinder, arbor, ratchet, and related sectional details.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 4 OF 4",
      title: "Lockwork, barrel, and loose parts",
      description: literal(
        "S. COLT. Revolving Gun. 9430X. Patented February 25, 1836. The fourth drawing sheet shows the mechanical combination and its numbered loose parts.",
      ),
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that I, SAMUEL COLT, of Hartford, in the county of Hartford and State of Connecticut, have invented a new and useful Improvement in Fire-Arms; and I hereby declare that the following, with the accompanying drawings, is a full and exact description of the construction and operation of the said improvements as invented by me.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Division 1", "division-2"),
        " of the drawings represents a pistol. ",
        figure("Division 2", "division-2"),
        " represents ",
        figure("Division 1", "division-2"),
        " in four sections, as 1, 2, 3, and 4. ",
        figure("Division 3", "division-3"),
        " represents all the parts in ",
        figure("Section 1", "division-2"),
        " of ",
        figure("Division 2", "division-2"),
        ". ",
        figure("Division 4", "division-4"),
        " represents all the parts of ",
        figure("Section 2", "division-4"),
        " of ",
        figure("Division 2", "division-2"),
        ". ",
        figure("Division 5", "plate-2"),
        " represents the mechanical combination of the entire instrument.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 1", "division-3"),
        " of ",
        figure("Division 3", "division-3"),
        " represents the hammer which discharges the percussion-caps. It acts upon a fulcrum at a. b is a pin projecting from the hammer, which serves to operate the key that locks the cylinder when its respective chambers are brought directly opposite the barrel. C represents the hole which receives the lower arm of the lifter that turns the cylinder. a represents the part of the hammer where the mainspring acts upon it. e is a projection by which the hammer is drawn back.",
      ),
    },
    { kind: "paragraph", inlines: cited(figure("Figure 2", "division-3"), " is the mainspring.") },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 3", "division-3"),
        " is the key that holds the cylinder in its place by the arm a when each chamber is brought opposite the barrel. b is a spring, which is attached to the part c, which has a lateral motion to the right by means of a hinge at d, and serves to allow the pin b in ",
        figure("Figure 1", "division-3"),
        " to pass it. The fulcrum of the key is at e. f is the fulcrum-pin. g is the spring which forces the key into the wards of the cylinder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 4", "division-3"),
        " is the lifter or hand, with a spring on the left side to allow it to move laterally to the left when acted on at a by each tooth of the ratchet. At b is a joint, which connects it with the pin c, which acts in the hole e in ",
        figure("Figure 1", "division-3"),
        ".",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 5", "division-3"),
        " is the connecting-rod. The end a serves as a catch to the hammer when the lock is set, and when the hammer is pulled back the rod moves forward horizontally in consequence of the hammer's coming in contact with it, and the end b operates upon the trigger, ",
        figure("Figure 6", "division-3"),
        ", at the catch a and throws down the end b, by which means the claw c hooks into the end b of ",
        figure("Figure 5", "division-3"),
        ", and is held in its place by the spring, ",
        figure("Figure 7", "division-3"),
        ", acting upon it at the pin d. ",
        figure("Figure 8", "division-3"),
        " is the pin which holds in their places the spring, ",
        figure("Figure 7", "division-3"),
        ", at a and the connecting-rod, ",
        figure("Figure 5", "division-3"),
        ", at c. ",
        figure("Figure 6", "division-3"),
        " moves on the pin c at f. ",
        figure("Figure 9", "division-3"),
        " is a spring, which holds the rod, ",
        figure("Figure 5", "division-3"),
        ", toward the hammer, that the connecting-rod may catch in a notch at the bottom of the hammer to hold it when set.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Division 4", "division-4"),
        " is a dissection of ",
        figure("Section 2", "division-4"),
        ". ",
        figure("Figure 1", "division-4"),
        " is the arbor on which the cylinder revolves. a a′ are the bearings on which the cylinder rests. b is the slot through which a key enters to connect ",
        figure("Section 4", "division-4"),
        " with it. The part C passes through the shackle, ",
        figure("Figure 2", "division-4"),
        ", which is keyed to the cylinder, ",
        figure("Section 3", "division-4"),
        ", ",
        figure("Figure 1", "division-4"),
        ", at the groove a by means of the tongue or projections A on the shackle. e is the part which receives the nut, ",
        figure("Figure 3", "division-4"),
        ", when it is connected with the shackle, ",
        figure("Figure 4", "division-4"),
        ", as seen at a, ",
        figure("Section 2", "division-4"),
        " in ",
        figure("Division 2", "division-2"),
        ".",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 5", "division-4"),
        " is the ratchet, which is placed in the middle of the shield at a, and receives the shackle, to which it is connected by the tongue or projection b. The arbor is prevented from turning in the shield by means of a pin or key in the shield, which enters the groove d on the arbor.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Figure 2", "division-4"),
        ", ",
        figure("Section 3", "division-4"),
        " of ",
        figure("Division 2", "division-2"),
        ", represents the fore part of the cylinder. The holes a a, &c., represent the ends of the chambers for the charges. b is the hole through which the arbor (on which the cylinder revolves) passes. C C, &c., represent the wards to receive the end a of the key, ",
        figure("Figure 3", "division-3"),
        ", ",
        figure("Division 3", "division-3"),
        ", to prevent the cylinder from turning when a charge is brought opposite the barrel. b b, &c., ",
        figure("Figure 1", "division-4"),
        ", represent the tubes on which are placed the percussion-caps. C C, &c., are partitions which, when embraced in the shield, as in ",
        figure("Division 1", "division-2"),
        ", prevent the communication of fire or smoke from one cap to the other.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        "In ",
        figure("Division 2", "division-2"),
        ", ",
        figure("Section 4", "division-4"),
        ", a represents the hole through which the arbor passes, and b a mortise for the key c to connect this section with the arbor. At d the ball enters the barrel from the chamber. At e the barrel is fastened to the plate. At f is a groove in the plate to receive the end a of the lock-plate of ",
        figure("Section 1", "division-2"),
        ", which serves to steady it. g represents the bayonet hung on a pin at h, i being a catch to hold it in its place when it is thrown out.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        "In ",
        figure("Division 5", "plate-2"),
        " the hammer is hung at the fulcrum a. The key which holds the cylinder is hung at the fulcrum b. The lifter that works the ratchet has a working connection with the hammer on the left side at c. The arm d of the lifter works into the teeth of the ratchet on the left. e represents the ratchet when connected with the shackle. f f is the middle and forward part of the shackle on which the ratchet is placed. g is the arbor on which the cylinder revolves. The end h is the nut that holds the pin in its place when in the shield. i i represent the forward end of the arbor which passes through the plate and the projection on the lower part of the barrel, and by a key at j it is secured to the barrel. k represents the fulcrum of the trigger. l is the spring which forces the connecting-rod against the end of the hammer. m is the spring which forces the key that holds the cylinder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "By drawing back the hammer the pin p operates upon the after end of the key (that locks the cylinder) and rises. Consequently the other end, r, is drawn from the cylinder, and the arm d of the lifter commences to act on a tooth, s, on the left side of the ratchet, which, being connected to the cylinder by means of the shackle, turns it until the next chamber is brought opposite to the barrel. When the pin p is relieved from the key by passing over its upper end, t, the pin allows the end r of the key to be forced by means of the spring m into the succeeding ward of the cylinder. At the same time, by the action of the lower end of the hammer u upon the connecting-rod at v, it produces a forward horizontal motion of the rod, when the end w is brought in contact with the upper projection of the trigger and forces it down to a proper position for the finger, when a claw at x of the trigger hooks into the connecting-rod, which holds the hammer when drawn back or set by means of the end v entering the lower catch, y, on the hammer.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "To discharge the pistol, by pulling the trigger the connecting-rod is drawn from the catch of the hammer, when the mainspring forces the hammer forward, the upper end of which strikes the percussion-cap, during which the lifter, by means of lateral motion to the left, falls below a succeeding tooth on the ratchet, when, by means of the lateral motion of the after end q of the key which holds the cylinder, the pin p of the hammer is permitted to fall below it again. By repetitions of the same motion of the hammer the same effect is produced until each succeeding chamber is discharged.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        figure("Plate 2", "plate-2"),
        " represents the principle of the invention as applicable to rifles, muskets, and other fire-arms, differing from what has already been described, first, in the manner of setting the lock; secondly, in the use of the adopter for communicating the force of the hammer to the percussion-cap; thirdly, in the situation of the mainspring and trigger; and, fourthly, in the construction of the lock-plate and guards that hold the stock. ",
        figure("Figure 1", "plate-2"),
        " represents the mainspring. ",
        figure("Figure 2", "plate-2"),
        " is the stirrup to connect the mainspring with the hammer. ",
        figure("Figure 3", "plate-2"),
        " is the hammer. ",
        figure("Figure 4", "plate-2"),
        " is the lever for setting the lock. ",
        figure("Figure 5", "plate-2"),
        " is the discharging-trigger. ",
        figure("Figure 6", "plate-2"),
        " is the adopter. ",
        figure("Figure 7", "plate-2"),
        " is the spiral spring to draw back the adopter. ",
        figure("Figure 8", "plate-2"),
        " represents all the parts combined.",
      ),
    },
    {
      kind: "paragraph",
      inlines: cited(
        "To set the lock, the fulcrum of the lever being at a, by drawing down on the end b the end c operates upon the end d of the hammer, whose fulcrum, being at e, throws back its end f, when the trigger at g (whose fulcrum is at h) operates upon the catches of the hammer at i, to hold the lock when set. When the end f of the hammer is removed from the adopter (whose bearings are at j j) it is drawn back by means of the coiled spring k until its end l is drawn back sufficient to allow the cylinder to turn, which is effected as described in the pistol. After the finger is relieved from the lever (when the lock is set) a small spring draws it back to its former place to make room for the end d of the hammer, so that its force may not be impaired. By pulling the trigger from the catch of the hammer, the mainspring (which is connected to the hammer by the stirrup o) forces its end f forward against the end m of the adopter, the end l of which is brought in contact with the percussion-cap placed upon the tube n, which discharges the load. To load, it is only requisite to draw the key j, which will liberate ",
        figure("Section 4", "division-4"),
        ". Then by drawing the key that locks the cylinder (which may be effected by drawing back the hammer) the cylinder may be taken from the arbor.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Among the many advantages in the use of these guns, independent of the number of charges they contain, are, first, the facility in loading them; secondly, the outward security against dampness; thirdly, security of the lock against the smoke of the powder; fourthly, the use of the partitions between the caps, which prevent fire communicating from the exploding cap to the adjoining ones; fifthly, by the hammer's striking the cap at the end of the cylinder no jar is occasioned, deviating from the line of sight; sixthly, the weight and location of the cylinder, which give steadiness to the hand; seventhly, the great rapidity in the succession of discharges, which is effected merely by drawing back the hammer and pulling the trigger. The advantages not applicable to the pistol are the use of the adopter and lever.",
      ),
    },
    { kind: "heading", level: 2, text: "I claim as new—" },
    {
      kind: "claim",
      number: 1,
      inlines: literal("The application of the caps at the end of the cylinder."),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal("The application of a partition between the caps."),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "The application of a shield over the caps as a security against moisture and the action of the smoke upon the works of the lock.",
      ),
    },
    {
      kind: "claim",
      number: 4,
      inlines: literal("The principle of the connecting-rod between the hammer and the trigger."),
    },
    {
      kind: "claim",
      number: 5,
      inlines: literal("The application of the shackle to connect the cylinder with the ratchet."),
    },
    {
      kind: "claim",
      number: 6,
      inlines: literal("The principle of locking and turning the cylinder."),
    },
    {
      kind: "claim",
      number: 7,
      inlines: literal(
        "The principle of uniting the barrel with the cylinder by means of the arbor running through the plate and the projection under the barrel.",
      ),
    },
    {
      kind: "claim",
      number: 8,
      inlines: literal(
        "The principle of the adopter and the application of the lever, neither of which is used in pistols.",
      ),
    },
    { kind: "paragraph", inlines: literal("SAMUEL COLT.") },
    { kind: "paragraph", inlines: literal("Witnesses: ROBERT CLARKE, WM. WALLIS.") },
  ],
};

/**
 * Paragraph-level companion notes authored with this edition. The current
 * shared reader has no per-edition companion registry; these remain local,
 * explicit editorial evidence rather than generated summaries.
 */
export const coltRevolverParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "This formal salutation addresses every reader who may need notice of the instrument. It introduces the legal specification rather than a mechanical part or a claim.",
  ],
  6: [
    "Colt identifies himself as a Hartford inventor and says that the accompanying drawings and written account together give the complete construction and operation. The statement distinguishes the descriptive disclosure from the numbered claims that follow later.",
  ],
  7: [
    "The drawings are organized as a complete pistol, four sectional views, the loose parts of Sections 1 and 2, and the assembled mechanism. That structure lets a reader follow the same hammer, key, hand, ratchet, shackle, cylinder, and arbor from an isolated part to the working gun.",
  ],
  8: [
    "The hammer has two jobs. Its upper end strikes a percussion cap, while pin b lifts the key that locks the cylinder before indexing; the lifter's lower arm enters hole C so hammer motion can turn the cylinder. The mainspring bears on the named hammer portion, and projection e gives the user a place to draw it back.",
  ],
  9: [
    "This short figure identification matters because the mainspring supplies the stored energy that drives the hammer forward after the trigger releases the connecting-rod catch. The specification keeps the spring as a separately identified part rather than treating the firing force as unexplained.",
  ],
  10: [
    "The key is the cylinder stop. Its arm a enters a cylinder ward when a chamber reaches the barrel; spring g supplies the locking force. The hinged part c and spring b let hammer pin b pass during cocking, so the key can withdraw for rotation and then return for alignment.",
  ],
  11: [
    "The hand or lifter is spring-biased sideways. Each ratchet tooth can push it leftward while passing, after which the hand returns to engage and drive the next tooth. Its joint to pin c converts the hammer's motion into the cylinder's stepwise rotation.",
  ],
  12: [
    "The connecting-rod converts the hammer's rearward movement into trigger positioning and a cocked catch. When the hammer draws the rod forward, the trigger claw hooks the rod; a separate spring keeps the rod toward the hammer so it can enter the hammer notch and hold the lock set.",
  ],
  13: [
    "The arbor is the fixed spindle around which the cylinder turns. Its bearings support the cylinder; a key connects the arbor assembly through the shackle, and the shackle's tongues couple it to the cylinder. The nut and keyed connection retain the sections while allowing the cylinder, rather than the arbor, to revolve.",
  ],
  14: [
    "The ratchet sits in the shield and receives the shackle through a tongue or projection, so the hand's motion reaches the cylinder. A pin or key holds the arbor against rotation in the shield; this is the fixed reference that permits the ratchet and cylinder to turn around it.",
  ],
  15: [
    "The cylinder has charge chambers at its front, a central arbor hole, locking wards, rear percussion-cap tubes, and partitions between those tubes. When the shield embraces the partitions, they stop fire or smoke from one exploding cap from reaching an adjacent cap. This paragraph ties the physical cap separation directly to the cylinder and lockup features.",
  ],
  16: [
    "This section identifies the barrel-side connection: the arbor passes through the section, a key joins it, and the ball enters the barrel from the selected chamber. The barrel fastens to the plate, whose groove steadies the lock plate; the same figure also identifies the bayonet, its pivot, and its catch.",
  ],
  17: [
    "The assembled view names the complete drive train. Hammer motion reaches the ratchet through the lifter, ratchet, and shackle; the arbor supports the cylinder; a key secures the forward arbor and barrel; and distinct springs load the connecting-rod and the cylinder-locking key. It is a map of which organ performs each mechanical constraint.",
  ],
  18: [
    "Cocking is an ordered sequence: hammer pin p lifts the rear of the locking key, end r leaves its cylinder ward, and lifter arm d drives ratchet tooth s through the shackle. After pin p passes the key, spring m returns r into the succeeding ward. The lower hammer end also moves the connecting-rod forward until the trigger claw catches it, holding the hammer set.",
  ],
  19: [
    "Pulling the trigger removes the connecting-rod from the hammer catch, so the mainspring drives the hammer into the percussion-cap. During that firing stroke the lifter slips laterally below the next ratchet tooth and the key geometry lets hammer pin p reset below its rear end, preparing the same mechanism for the next chamber.",
  ],
  20: [
    "For rifles, muskets, and other long guns, Colt retains the revolving-cylinder principle but changes four linked features: how the lock is set, a separate adopter that carries hammer force to the cap, the positions of mainspring and trigger, and the stock-retaining lock plate and guards. The paragraph identifies each long-gun part so the following operation can be traced without importing pistol-only geometry.",
  ],
  21: [
    "The long-gun lever first pulls the hammer to the trigger catch. Once the hammer clears the adopter, a coil spring retracts the adopter enough for the cylinder to turn; after release, the mainspring sends the hammer into the adopter, whose far end strikes the cap. Loading uses a key to free Section 4 and then withdraws the locking key so the cylinder can come off the arbor.",
  ],
  22: [
    "Colt names concrete practical effects: easier loading, protection from dampness and powder smoke, partitions that block cap-to-cap ignition, less sight disturbance because the hammer hits the cap at the cylinder end, steadier hand balance from cylinder weight and position, and rapid successive shots. He separately limits the adopter and lever advantages to the long-gun form.",
  ],
  32: [
    "Samuel Colt's signature executes the specification after the claims. It is a formal source block, not an additional technical claim or a plain-English claim decoder.",
  ],
  33: [
    "Robert Clarke and Wm. Wallis are the named witnesses to the executed instrument. Their names document signing and do not add inventors, parts, or claimed subject matter.",
  ],
};
