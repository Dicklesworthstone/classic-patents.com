import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

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
      inlines: literal(
        "Division 1 of the drawings represents a pistol. Division 2 represents Division 1 in four sections, as 1, 2, 3, and 4. Division 3 represents all the parts in Section 1 of Division 2. Division 4 represents all the parts of Section 2 of Division 2. Division 5 represents the mechanical combination of the entire instrument.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 1 of Division 3 represents the hammer which discharges the percussion-caps. It acts upon a fulcrum at a. b is a pin projecting from the hammer, which serves to operate the key that locks the cylinder when its respective chambers are brought directly opposite the barrel. C represents the hole which receives the lower arm of the lifter that turns the cylinder. a represents the part of the hammer where the mainspring acts upon it. e is a projection by which the hammer is drawn back.",
      ),
    },
    { kind: "paragraph", inlines: literal("Figure 2 is the mainspring.") },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 3 is the key that holds the cylinder in its place by the arm a when each chamber is brought opposite the barrel. b is a spring, which is attached to the part c, which has a lateral motion to the right by means of a hinge at d, and serves to allow the pin b in Figure 1 to pass it. The fulcrum of the key is at e. f is the fulcrum-pin. g is the spring which forces the key into the wards of the cylinder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 4 is the lifter or hand, with a spring on the left side to allow it to move laterally to the left when acted on at a by each tooth of the ratchet. At b is a joint, which connects it with the pin c, which acts in the hole e in Figure 1.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 5 is the connecting-rod. The end a serves as a catch to the hammer when the lock is set, and when the hammer is pulled back the rod moves forward horizontally in consequence of the hammer's coming in contact with it, and the end b operates upon the trigger, Figure 6, at the catch a and throws down the end b, by which means the claw c hooks into the end b of Figure 5, and is held in its place by the spring, Figure 7, acting upon it at the pin d. Figure 8 is the pin which holds in their places the spring, Figure 7, at a and the connecting-rod, Figure 5, at c. Figure 6 moves on the pin c at f. Figure 9 is a spring, which holds the rod, Figure 5, toward the hammer, that the connecting-rod may catch in a notch at the bottom of the hammer to hold it when set.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Division 4 is a dissection of Section 2. Figure 1 is the arbor on which the cylinder revolves. a a′ are the bearings on which the cylinder rests. b is the slot through which a key enters to connect Section 4 with it. The part C passes through the shackle, Figure 2, which is keyed to the cylinder, Section 3, Figure 1, at the groove a by means of the tongue or projections A on the shackle. e is the part which receives the nut, Figure 3, when it is connected with the shackle, Figure 4, as seen at a, Section 2 in Division 2.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 5 is the ratchet, which is placed in the middle of the shield at a, and receives the shackle, to which it is connected by the tongue or projection b. The arbor is prevented from turning in the shield by means of a pin or key in the shield, which enters the groove d on the arbor.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Figure 2, Section 3 of Division 2, represents the fore part of the cylinder. The holes a a, &c., represent the ends of the chambers for the charges. b is the hole through which the arbor (on which the cylinder revolves) passes. C C, &c., represent the wards to receive the end a of the key, Figure 3, Division 3, to prevent the cylinder from turning when a charge is brought opposite the barrel. b b, &c., Figure 1, represent the tubes on which are placed the percussion-caps. C C, &c., are partitions which, when embraced in the shield, as in Division 1, prevent the communication of fire or smoke from one cap to the other.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "In Division 2, Section 4, a represents the hole through which the arbor passes, and b a mortise for the key c to connect this section with the arbor. At d the ball enters the barrel from the chamber. At e the barrel is fastened to the plate. At f is a groove in the plate to receive the end a of the lock-plate of Section 1, which serves to steady it. g represents the bayonet hung on a pin at h, i being a catch to hold it in its place when it is thrown out.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "In Division 5 the hammer is hung at the fulcrum a. The key which holds the cylinder is hung at the fulcrum b. The lifter that works the ratchet has a working connection with the hammer on the left side at c. The arm d of the lifter works into the teeth of the ratchet on the left. e represents the ratchet when connected with the shackle. f f is the middle and forward part of the shackle on which the ratchet is placed. g is the arbor on which the cylinder revolves. The end h is the nut that holds the pin in its place when in the shield. i i represent the forward end of the arbor which passes through the plate and the projection on the lower part of the barrel, and by a key at j it is secured to the barrel. k represents the fulcrum of the trigger. l is the spring which forces the connecting-rod against the end of the hammer. m is the spring which forces the key that holds the cylinder.",
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
      inlines: literal(
        "Plate 2 represents the principle of the invention as applicable to rifles, muskets, and other fire-arms, differing from what has already been described, first, in the manner of setting the lock; secondly, in the use of the adopter for communicating the force of the hammer to the percussion-cap; thirdly, in the situation of the mainspring and trigger; and, fourthly, in the construction of the lock-plate and guards that hold the stock. Figure 1 represents the mainspring. Figure 2 is the stirrup to connect the mainspring with the hammer. Figure 3 is the hammer. Figure 4 is the lever for setting the lock. Figure 5 is the discharging-trigger. Figure 6 is the adopter. Figure 7 is the spiral spring to draw back the adopter. Figure 8 represents all the parts combined.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "To set the lock, the fulcrum of the lever being at a, by drawing down on the end b the end c operates upon the end d of the hammer, whose fulcrum, being at e, throws back its end f, when the trigger at g (whose fulcrum is at h) operates upon the catches of the hammer at i, to hold the lock when set. When the end f of the hammer is removed from the adopter (whose bearings are at j j) it is drawn back by means of the coiled spring k until its end l is drawn back sufficient to allow the cylinder to turn, which is effected as described in the pistol. After the finger is relieved from the lever (when the lock is set) a small spring draws it back to its former place to make room for the end d of the hammer, so that its force may not be impaired. By pulling the trigger from the catch of the hammer, the mainspring (which is connected to the hammer by the stirrup o) forces its end f forward against the end m of the adopter, the end l of which is brought in contact with the percussion-cap placed upon the tube n, which discharges the load. To load, it is only requisite to draw the key j, which will liberate Section 4. Then by drawing the key that locks the cylinder (which may be effected by drawing back the hammer) the cylinder may be taken from the arbor.",
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
  6: [
    "Colt identifies himself and says the drawings plus description define how the mechanism is made and works.",
  ],
  7: [
    "The drawings are organized as a complete pistol, sectional views, loose parts, and the assembled mechanism so a reader can follow the same parts across views.",
  ],
  8: [
    "The hammer both strikes a percussion cap and carries a pin that moves the cylinder-locking key. The lifter enters the hammer through the named hole and turns the cylinder.",
  ],
  10: [
    "The key is the cylinder stop: its spring presses it into a cylinder ward after the next chamber has reached the barrel.",
  ],
  11: [
    "The hand or lifter is spring-biased sideways so each ratchet tooth can pass and then be driven on the next cocking movement.",
  ],
  12: [
    "The connecting rod converts hammer motion into trigger positioning and a catch that holds the hammer at full cock.",
  ],
  13: [
    "The arbor carries the cylinder, while the shackle and ratchet transmit the hand's rotation to it without letting the arbor spin in the shield.",
  ],
  14: [
    "The separated cap tubes and partitions isolate neighboring caps. The shield is an enclosure against moisture and powder smoke.",
  ],
  15: [
    "Cocking first withdraws the cylinder stop, then the hand advances the ratchet one chamber, and finally the stop spring enters the next ward to lock the chamber opposite the barrel.",
  ],
  16: [
    "The trigger releases the rod's catch so the mainspring drives the hammer into the cap. The hand resets below the next ratchet tooth for the following shot.",
  ],
  17: [
    "For long guns Colt substitutes a separate striker called an adopter and a setting lever, while retaining the locked, indexed cylinder principle.",
  ],
  18: [
    "The claimed practical effects are repeat loading, weather and smoke protection, cap separation, a stable hand position, and rapid successive cock-and-fire operation.",
  ],
};
