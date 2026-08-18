import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const FIGURES = {
  1: {
    src: "/patents/figures/us-470918-reno-escalator/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 470,918: lower end of the inclined conveyor and moving hand-rail.",
    width: 2321,
    height: 1900,
  },
  2: {
    src: "/patents/figures/us-470918-reno-escalator/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 470,918: upper end of the conveyor, sprocket-wheel, belt sections, and comb landing.",
    width: 2050,
    height: 2100,
  },
  3: {
    src: "/patents/figures/us-470918-reno-escalator/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 470,918: general-outline diagram of the endless conveyor and hand-rail.",
    width: 1500,
    height: 1100,
  },
  4: {
    src: "/patents/figures/us-470918-reno-escalator/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 470,918: cross-section of the belt, I-beam, and hand-rail support on line a b of Figure 2.",
    width: 2050,
    height: 1350,
  },
} as const;

const figure = (number: 1 | 2 | 3 | 4, label = `Fig. ${number}`): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: `#fig-${number}`,
  referenceType: "figure",
  label: `Open the source-facsimile crop for Figure ${number} of US 470,918`,
  figurePreviews: [FIGURES[number]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * A continuous, manually prepared edition of US 470,918. The grant's two
 * drawing sheets remain facsimile material; this reader follows its printed
 * argument without reproducing scan-page boundaries or OCR column order.
 */
export const renoEscalatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "2c34b13c20fab70980a22470702fa891d3ca359c4846b02aa7ea5ff23b1576cf",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "JESSE W. RENO, OF NEW YORK, N. Y.",
        "ENDLESS CONVEYER OR ELEVATOR.",
        "Specification forming part of Letters Patent No. 470,918, dated March 15, 1892.",
        "Application filed January 2, 1891, Serial No. 376,455. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEETS",
      title: "Figures 1–4",
      description: text(
        "The two source drawing sheets contain four printed figures: the lower and upper ends of the conveyor, a general outline, and a cross-section. Each printed figure reference below opens its corresponding local facsimile crop.",
      ),
    },
    paragraph([{ kind: "emphasis", text: "To all whom it may concern:" }]),
    paragraph(
      text(
        "Be it known that I, JESSE W. RENO, of the city of New York, in the county and State of New York, have invented a new and useful Endless Conveyer or Elevator, which invention is fully set forth and illustrated in the following specification and accompanying drawings.",
      ),
    ),
    paragraph(
      text(
        "The object of this invention is in particular to provide a mechanical incline or slide-conveyer to be used in place of elevators or stairways where large numbers of persons are to be transferred from one floor or level to another, either upward or downward.",
      ),
    ),
    paragraph(
      text(
        "The invention will first be described in detail, and then particularly set forth in the claims.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In the accompanying drawings, " },
      figure(1, "Figure 1"),
      {
        kind: "text",
        text: " shows a side elevation of part of the conveyer and hand-rail at a suitable angle or inclination at its lower end. ",
      },
      figure(2),
      {
        kind: "text",
        text: " shows a side elevation of the upper end of the conveyer or ‘slide.’ ",
      },
      figure(3),
      { kind: "text", text: " shows a diagram of the device in general outline. " },
      figure(4),
      { kind: "text", text: " shows a cross-section through the line a b of " },
      figure(2),
      { kind: "text", text: "." },
    ]),
    paragraph(
      text(
        "In said figures the several parts are respectively indicated by reference-numbers as follows:",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "The conveyer or elevator proper consists of a continuous or endless belt formed of sections, preferably of cast-iron, as shown at 2, ",
      },
      figure(2, "Figs. 2"),
      { kind: "text", text: " and " },
      figure(4),
      {
        kind: "text",
        text: ". These sections are hinged together, as shown at 12, and are cast with a grooved surface, as shown in cross-section in ",
      },
      figure(4),
      {
        kind: "text",
        text: ". Into the grooves of said surface, which may be made about three-fourths of an inch wide by one inch deep, the prongs 5 of the comb-like landings 14 extend. These landings, preferably made of cast-steel, are rigidly fixed, so that their prongs 5 have a clearance of, preferably, say, not exceeding one-eighth of an inch between the bottoms and sides of the grooves in the sections 2 of the endless belt. Said belt made up of said sections is turned upon the two pairs of sprocket-wheels 3, all of similar design, the notches 17 about their circumferences forming seats into which the rounded parts of the hinges 12 rest. Power for moving the belt is preferably applied to the wheels 3 at the top of the conveyer; but power may be applied at the bottom of the conveyer, if desired, the return of the belt being supported on guides or tracks from the top to the bottom.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Between the pairs of wheels 3 at the top and bottom of the conveyer the moving belt is supported and slides upon two I-beams 4, the squared hinged parts of each section of the belt fitting into a ",
      },
      term(
        "planed channel 15",
        "A channel machined or finished to a smooth, flat-bearing surface. Here it laterally guides the squared parts of the belt hinges.",
      ),
      {
        kind: "text",
        text: " in each of said beams, which channels prevent lateral motion of the belt. Planed channels like 15 of the I-beams 4 are continued as grooves 16 in the wheels 3, as shown in ",
      },
      figure(1, "Figs. 1"),
      { kind: "text", text: " and " },
      figure(2),
      {
        kind: "text",
        text: ", so that as the square parts of the hinges 12 leave the sliding or planed surfaces 15 of the beams 4 the rounded parts of the hinges are engaged by and supported in the seats or notches 17 about the circumferences of the wheels 3.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "As it will add to the feeling of security and comfort of the passengers to grasp a hand-rail as they ascend or descend upon the conveyer, a moving hand-rail 10 is provided, as shown in the drawings. A conveyer would be complete for a single file of passengers with but one moving hand-rail, but for a conveyer on which two passengers can stand abreast a moving rail on each side of the same would be preferably provided.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure(4),
      {
        kind: "text",
        text: " the moving hand-rail is shown at 10 and a fixed hand-rail on the opposite side at 21; but a plain wall or guard of any kind may of course take the place of the rail 21.",
      },
    ]),
    paragraph([
      { kind: "text", text: "Referring to " },
      figure(1),
      {
        kind: "text",
        text: ", it will be observed that the moving hand-rail is made in short joints or sections 10, which construction permits said rail to bend around the sprocket-wheels 6. Said sprocket-wheels are preferably made of the same radius as the gear-wheels 3. Motion may be imparted to the sectional railing 10 by passing the same around a sprocket-wheel similar to wheel 6, suitably secured on shaft 13, ",
      },
      figure(3, "Figs. 3"),
      { kind: "text", text: " and " },
      figure(4),
      { kind: "text", text: "." },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure(4),
      {
        kind: "text",
        text: ", at 7 8 10, is shown a section through the jointed moving hand-rail 10 and the fixed railing 7, on which said hand-rail slides, the steel plates 8, secured to each individual rail-piece 10, sliding in a groove in the rail 7, as clearly illustrated in said figure. Said plates 8 are preferably cemented in slots in the rail-pieces 10 and are held to each other by the steel links 9, ",
      },
      figure(1),
      {
        kind: "text",
        text: ". The lower parts of said plates 8 are provided with notches 18, so that as the rail-sections 10 travel said notches fit and mesh into the teeth 19 on the circumferences of the wheels 6. The faces of these wheels 6 are channeled similarly to the channels in the rail 7, so as to hold the plates 8 securely in position when passing around them. The rail-pieces 10 are preferably turned from hard wood, alternately light and dark in color, so as to attract the attention of passengers.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Of course the same result as that effected by the continuous channels and notched ridges upon the belt's upper surface can be obtained by substituting rows of pegs, which would also pass between the spaces in the comb-like landings. Steel balls or small rollers may also be substituted for the sliding contact between the belt-sections 10 and the I-beams 4. The belt, however, being perfectly balanced, much friction is thereby obviated and the friction-surfaces along the channeled I-beams and in the notches or teeth in the sprocket-wheels 3 are thoroughly protected from falling grit or dirt. At the upper and lower landings the sprocket-wheels 6 of the moving railing are inclosed in casings, which extend over segments of the moving rail, as shown at 20 in ",
      },
      figure(1),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It can now be seen that by this invention is provided a continuously-moving endless inclined conveyer or elevator and hand-rail. The passenger who steps upon said conveyer will be carried by it either up or down, as the case may be, without effort on his part, and as the apparatus is automatic an accident in ascending or descending will be impossible. The conveyer and its hand-rail will each preferably move at the rate of an average walk—about two hundred feet per minute—thus giving a maximum capacity of six thousand passengers per hour in single file. A person stepping upon the conveyer will experience no change in his motion and on arriving at the top or bottom will be transferred to the comb-shaped landing without any special attention on his part.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It is purposed to have the conveyer set at an angle of slope of about twenty-five degrees, and when provided with a notched or roughened upper surface the conveyer can be stood upon by passengers with ease, especially when grasping the traveling hand-rail, which will be moving at the same rate as that of the conveyer.",
      },
    ]),
    paragraph(
      text(
        "Where more than one of these conveyers are used, instead of reversing the direction of the conveyer, one or one set of conveyers, with their hand-rails, may be run to elevate from one floor-level to another, and one or one set of elevators, with their hand-rails, may be run to descend and convey passengers from one floor-level to a lower level, so that there will be no stopping of the conveyers and no change of direction in their movements, and crowds or streams of persons may pass each other in opposite directions without confusion or detention.",
      ),
    ),
    { kind: "heading", level: 2, text: "Claims" },
    paragraph(text("Having thus fully described my said invention, I claim—")),
    claim(
      1,
      "A traveling conveyer adapted for the conveyance of passengers, composed of short links or sections hinged together in the form of an endless belt, said sections being channeled longitudinally, as described, in combination with a landing or landings channeled or combed to register with the channeled surfaces of said sections, whereby transfer from conveyer to landing, or vice versa, is effected, substantially as set forth.",
    ),
    claim(
      2,
      "In combination with a conveyer or elevator, a traveling hand-rail composed of short links or sections hinged together in the form of an endless chain, and a stationary support or supports and sprocket-wheels therefor, substantially as set forth.",
    ),
    claim(
      3,
      "The combination, with a combed landing or landings, of an endless hinged traveling platform and an endless traveling hand-rail therefor, said elements being constructed and operating substantially as and for the purposes set forth.",
    ),
    paragraph([{ kind: "small-caps", text: "JESSE W. RENO." }]),
    paragraph(text("Witnesses: FRANCIS P. REILLY, THEO. H. FRIEND.")),
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 1",
      title: "Lower-end side elevation",
      description: text(
        "Source crop from drawing sheet 1: lower end of the inclined conveyer and moving hand-rail.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 2",
      title: "Upper-end side elevation",
      description: text(
        "Source crop from drawing sheet 2: upper sprocket-wheel, grooved belt, comb landing, and rail sections.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 3",
      title: "General outline",
      description: text(
        "Source crop from drawing sheet 1: the general arrangement of the endless conveyor and its hand-rail.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 4",
      title: "Cross-section on line a b",
      description: text(
        "Source crop from drawing sheet 2: the belt section, guide beam, and the moving and fixed rail construction.",
      ),
    },
  ],
};

/** Source-paragraph companions keyed directly to the typed edition's blocks. */
export const renoEscalatorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This formal notice addresses the public. It is part of the source document's legal presentation, but it does not describe a machine component or limit a claim.",
  ],
  3: [
    "Reno identifies the legal subject as an Endless Conveyer or Elevator and says both the wording and the drawings that follow define the invention.",
  ],
  4: [
    "The stated problem is continuous transfer between levels where stairs and intermittent elevators do not move enough people. The claim is not limited to ascent: the same conveyer can carry people downward.",
  ],
  5: [
    "The description comes first; the three claims later identify the legal combinations Reno seeks to protect.",
  ],
  6: [
    "Figure 1 is the lower end, Figure 2 the upper end, Figure 3 the general route, and Figure 4 the section on line a b. Those are four separate drawings, so each source mention opens its own crop rather than an arbitrary PDF page.",
  ],
  7: [
    "The document uses numerals, not a separate prose parts list. The next paragraphs attach those numerals to the belt, wheels, rails, channels, and landings.",
  ],
  8: [
    "The passenger surface is an endless series of cast-iron sections 2 hinged at 12. Its grooves receive fixed cast-steel landing prongs 5. Reno gives actual preferred dimensions: grooves about three-quarters inch wide and one inch deep, and a clearance no greater than one-eighth inch. Sprocket-wheels 3 carry the belt, with power preferably at the top but optionally at the bottom.",
  ],
  9: [
    "I-beams 4 support the belt between its end wheels. Planed channel 15 keeps each squared hinge portion from moving sideways; matching wheel grooves 16 and seats 17 take over through the turn. This is a guided hinged platform, not the later separate-step escalator described by the old record.",
  ],
  10: [
    "A moving hand-rail 10 is presented as a comfort and security feature. A single lane needs one rail; a platform wide enough for two people abreast should preferably have one on each side.",
  ],
  11: [
    "Figure 4 contrasts the moving hand-rail 10 with fixed rail 21. Reno expressly allows a wall or other guard in place of the fixed rail.",
  ],
  12: [
    "Short hand-rail sections 10 bend around sprocket-wheels 6. Their drive can be taken from a similar wheel on shaft 13, and the patent says those wheels are preferably the same radius as gear-wheels 3.",
  ],
  13: [
    "The hand-rail slides on fixed rail 7 through steel plates 8 and links 9. Notches 18 on the plates mesh with wheel teeth 19, while matching wheel channels hold them through the curve. Alternating light and dark hard-wood rail pieces were intended to attract riders' attention.",
  ],
  14: [
    "Reno permits alternatives: rows of pegs may replace the continuous belt channels, and balls or rollers may replace sliding contact. He also says balanced belt geometry reduces friction and that casings 20 cover the hand-rail sprockets at both landings.",
  ],
  15: [
    "This is Reno's performance claim for the illustrated arrangement: a continuously moving inclined belt and hand-rail, approximately an average walking speed of 200 feet per minute, and a stated maximum single-file capacity of 6,000 passengers an hour. It is not a modern safety certification or guarantee that accidents are impossible.",
  ],
  16: [
    "The intended slope is about 25 degrees. A roughened or notched passenger surface and a hand-rail moving at the same rate are the conditions Reno gives for standing comfortably.",
  ],
  17: [
    "For two-way traffic, Reno proposes separate continuously moving conveyers instead of reversing one machine. One set rises and another descends, allowing opposing passenger streams to pass without stopping or changing direction.",
  ],
  19: [
    "This is the transition from the descriptive specification to the three numbered legal claims.",
  ],
  23: ["This is Reno's printed signature on the grant."],
  24: ["Francis P. Reilly and Theo. H. Friend are the two printed witnesses."],
};
