import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

const crop = (number: number, width: number, height: number) => ({
  src: `/patents/figures/us-621195-zeppelin-airship/fig-${number}-source-crop-v${
    number === 7 ? 2 : 1
  }.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US 621,195.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": [crop(1, 1856, 2385)],
  "Fig. 2": [crop(2, 1856, 2385)],
  "Fig. 3": [crop(3, 1856, 2385)],
  "Fig. 4": [crop(4, 800, 700)],
  "Fig. 5": [crop(5, 800, 400)],
  "Fig. 6": [crop(6, 800, 720)],
  "Fig. 7": [crop(7, 720, 480)],
  "Fig. 8": [crop(8, 460, 720)],
  "Fig. 9": [crop(9, 580, 1050)],
  "Fig. 10": [crop(10, 500, 1840)],
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 621,195`,
  figurePreviews: FIGURES[label],
});

const missingFigures = (): CuratedSpecificationInline => ({
  kind: "term",
  text: "Figs. 11 and 12",
  definition:
    "The printed specification cites Figs. 11 and 12, but the immutable seven-page facsimile supplies only four drawing sheets with Figs. 1 through 10; no preview is fabricated.",
});

const term = (textValue: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: textValue,
  definition,
});

/**
 * A continuous, manually prepared reading of the exact seven-page US 621,195
 * facsimile. Sheets 1-4 supply Figs. 1-10; pages 5-7 contain the complete
 * specification, four claims, signature, and witness names. The printed
 * specification cites Figs. 11 and 12, whose drawing panels are absent from
 * this immutable facsimile; the source-facing omission note is deliberate.
 */
export const zeppelinAirshipArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "179d9d9b857e4bda8c35a4d9e8ee29d1e2fea5aa90705b0ddbe7d8cc6bb8d429",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "FERDINAND GRAF ZEPPELIN, OF STUTTGART, GERMANY.",
        "NAVIGABLE BALLOON.",
        "Specification forming part of Letters Patent No. 621,195, dated March 14, 1899. Application filed December 29, 1897. Serial No. 664,295. (No model.)",
      ],
    },
    p(text("To all whom it may concern:")),
    p(
      text(
        "Be it known that I, FERDINAND GRAF ZEPPELIN, general-lieutenant z. d. general à la suite of His Majesty the King of Württemberg, of Stuttgart, Germany, have invented certain new and useful Improvements in and Relating to Navigable Balloons; and I do hereby declare the following to be a full, clear, and exact description of the invention, such as will enable others skilled in the art to which it appertains to make and use the same.",
      ),
    ),
    p(
      text(
        "This invention relates to a navigable balloon which is characterized essentially in that it is provided with a number of motors arranged separately from each other. In this manner it is possible to give the balloon or buoyant part of the apparatus, which receives the gas and is preferably cylindrical with rounded ends, a smaller diameter in proportion to the driving power developed by the motors and to correspondingly reduce the air resistance. A navigable balloon or air craft of this kind can be combined with several other balloons or air crafts in such a manner that the foremost craft contains the driving-gear, while the others serve for the reception of the goods or load to be carried.",
      ),
    ),
    p([
      { kind: "text", text: "In the accompanying drawings, " },
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " is a side elevation of my improved navigable balloon or air craft. ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " is a front elevation thereof. " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " is a longitudinal section showing a part of the said craft drawn to an enlarged scale. ",
      },
      figure("Fig. 4"),
      { kind: "text", text: " is a transverse section through the craft. " },
      figure("Fig. 5", "Figs. 5"),
      { kind: "text", text: " and " },
      figure("Fig. 6", "6"),
      {
        kind: "text",
        text: " show the arrangement of the separate gas bags or envelops in the several compartments of the balloon. ",
      },
      figure("Fig. 7", "Figs. 7"),
      { kind: "text", text: " and " },
      figure("Fig. 8", "8"),
      {
        kind: "text",
        text: " show in side elevation and plan, respectively, the arrangement of an adjustable running-weight which serves for giving the balloon any desired inclination to the horizontal. ",
      },
      figure("Fig. 9"),
      {
        kind: "text",
        text: " shows a modification in which the running-weight is replaced by adjustable towing or trailing ropes. ",
      },
      figure("Fig. 10"),
      {
        kind: "text",
        text: " shows a number of balloons connected together, so as to form a train. ",
      },
      missingFigures(),
      { kind: "text", text: " illustrate the method of coupling the several balloons together." },
    ]),
    p([
      {
        kind: "text",
        text: "In order to give the balloon a rigid form, it is provided with a framework or skeleton of tubes ",
      },
      term(
        "r",
        "The source uses the letter r as a reference numeral for the framework tubes, not as a variable or an abbreviated word.",
      ),
      { kind: "text", text: ", wire ropes s, and wire gauze or netting d, " },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: ", " },
      figure("Fig. 3", "3"),
      { kind: "text", text: ", and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", over which is stretched an outer shell or casing d′ of silk or similar material. The framework is stiffened internally by means of partition-walls a, vertical stays v, ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", between which lie circumferential rings u, and diagonal stays w. By means of the said partition-walls the balloon is divided into separate compartments or chambers, ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: ", in which correspondingly-shaped gas bags or envelops are introduced in a folded-together condition, and are then filled with gas. This arrangement permits the use of rigid chambers as gas-spaces without bringing the gas into contact with the atmospheric air in the chambers during filling. The filling of the gas bags or envelops takes place without interfering with the cylindrical form of the balloon-framework, which is continuously maintained by means of the outer casing d′ and is only continued up to such a degree that the necessary free space is left to permit expansion of the gas when the balloon ascends to great altitudes and when heated. By means of this limited charge of gas, which is, however, to be sufficient for lifting the craft, it is possible to retain the necessary quantity of gas even for journeys of very long duration. The gas bags or envelops are provided with safety-valves and outlet-valves, (not shown on the drawings,) which in the ordinary course are not used.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In order to obviate the necessity of having to let out gas from the main gas bags in long journeys to compensate for the reduction in the weight to be carried due to the consumption of fuel or other material used in driving the craft, which results in spoiling the gas by the introduction of air, I arrange in the several chambers, near the main gas-bags ",
      },
      term(
        "o",
        "The printed letter o is a reference numeral for the main gas bags or containers. It identifies a component rather than the word ‘of.’",
      ),
      {
        kind: "text",
        text: ", special auxiliary bags, which may be termed ‘maneuvering’ bags or containers p, ",
      },
      figure("Fig. 5", "Figs. 5"),
      { kind: "text", text: " and " },
      figure("Fig. 6", "6"),
      {
        kind: "text",
        text: ", and are of the same diameter as the main gas-bags and of suitable length. In filling these special maneuvering bags or containers p are filled with gas before the main gas-bags, with which they are connected, so that they retain their position when the filling of the main gas bags or containers afterward takes place. If now gas be allowed to escape from the maneuvering bags or containers when the reduction in weight renders this necessary, the main gas bags or containers o expand under the action of the upwardly-pressing gas contained therein until, after the emptying of the maneuvering-bags, they fill up the whole of the upper part of the chamber. The main gas bags or containers o thus retain their full quantity of gas.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Beneath the balloon or buoyant part of the apparatus runs a gangway l, rigidly connected thereto, from which all parts of the balloon can be reached by means of rope ladders f, as well as two or more cars g, for the reception of the aeronaut or controller of the driving-gear, of the fuel or other material used in driving the craft, the passengers, and the useful load or cargo. Each driving mechanism drives two ",
      },
      term(
        "air-screws",
        "A period name for propellers. The specification uses it for the paired thrust-producing propellers driven by each driving mechanism.",
      ),
      { kind: "text", text: " i, " },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", provided on both sides of the buoyant cylinder at about the same height as the center of resistance.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The steering of the balloon to either side is effected by means of two rudders q, ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", which are arranged above and beneath at the front or the rear part of the balloon and can be operated by means of suitable steering-gear.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In order to bring the balloon into a horizontal or inclined position, as desired, a weight b is suspended beneath it by means of pulley-blocks and tackle l′, ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: ", " },
      figure("Fig. 7", "7"),
      { kind: "text", text: ", and " },
      figure("Fig. 8", "8"),
      {
        kind: "text",
        text: ". The movable carriage or traveler n, to which the upper pulley-block is secured, rests adjustably on a wire rope secured to the shell or casing of the balloon and can be drawn to and fro between suitable limiting positions by means of an endless wire rope, which runs several times around over two rotatable drums h, ",
      },
      figure("Fig. 7", "Figs. 7"),
      { kind: "text", text: " and " },
      figure("Fig. 8", "8"),
      {
        kind: "text",
        text: ", arranged at equal distances from the middle of the balloon. To each of the two drums is secured a fusee or snail z, rotating therewith. The threads of the said fusees are so calculated that the wire rope l² is kept continually stretched between them and the running-weight b, since it simultaneously winds onto one and unwinds from the other when the position of the weight is altered by moving the traveler supporting it. This arrangement insures that in the horizontal position of the whole balloon as far as relates to the adjustment of the running-weight to compensate for other displacements or redistributions of weight—for example, change in the position of men—the two wire ropes l² shall always remain under a slight tension. In this manner they automatically contribute toward maintaining a horizontal position, for when, for example, the front end of the balloon begins to rise the running-weight in its tendency to remain perpendicularly below the traveler n will exert a pull in the wire rope running to the front fusee. If the balloon is to be maintained in an upwardly-directed position, for example, the front wire rope continuously exerts a pull, this, however, increasing if the point rises still higher. The suspension of the weight is effected by means of pulley-blocks and tackle l′ in order to enable it to be drawn up when the balloon descends to the ground.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "If the weight is to be used as a simple running-weight, even while it is partly or entirely drawn up, the fusees can be loosed from connection with the drums and the wire rope l² unhooked from the weight b, so that these ropes and the tackle do not interfere with one another’s action. Instead of a running-weight of this kind two or more towing or trailing ropes l³, arranged at a suitable distance apart, can also be employed, as shown in ",
      },
      figure("Fig. 9"),
      {
        kind: "text",
        text: ", which ropes can be adjusted in the longitudinal direction of the balloon. These towing or trailing ropes, which can be arranged singly or in groups, are secured to an endless cable, by means of which they can be adjusted in one or the other direction. In traveling in the air the towing or trailing ropes as soon as they no longer trail on the earth are tied or connected together at their lower ends in any suitable manner, so as to enable the towing or trailing ropes to automatically maintain the vehicle in the required position.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In order to permit greater loads to be carried, one or more similarly-built load-carrying balloons, but without driving-gear, can be suspended to the balloon provided with driving-gear, as shown in ",
      },
      figure("Fig. 10"),
      {
        kind: "text",
        text: ". All crafts are connected together in such a manner that they form a connected train. The connection of the single balloons is effected by means of couplings c, ",
      },
      missingFigures(),
      {
        kind: "text",
        text: ", which are movable in all directions. The space between each two balloons is closed by means of an extensible cover e, which lies over the cylindrical shells of the two adjacent balloons, so that the wind cannot obtain a hold in the intermediate space.",
      },
    ]),
    p(
      text(
        "The compensation for the difference in specific gravity of the balloons of a train, due to the consumption of the fuel or material used in driving the balloon or of the provisions or loss of gas or to other causes, is preferably effected by the transfer of liquids—for example, benzin, water, or the like—or by transferring heavy objects—for example, provisions, useful freight of all kinds, sand, or the like—out of the specifically heavier into the lighter balloon, or by condensing gases or atmospheric air in the latter.",
      ),
    ),
    p(
      text(
        "Having now described particularly the nature of my invention, what I claim, and desire to secure by Letters Patent, is—",
      ),
    ),
    claim(
      1,
      "In a balloon, the combination of a framework divided into separate compartments, with a main gas-bag in each compartment, adapted to expand and fill the same when permitted, and auxiliary gas-bags in the compartments for maneuvering, to permit the main gas-bags to retain their full quantity of gas unaffected by the admission of air, substantially as set forth.",
    ),
    claim(
      2,
      "The combination of a balloon, with a running-weight suspended beneath the same, rotary drums provided with fusees, and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
    ),
    claim(
      3,
      "The combination of a balloon, with a weight suspended beneath the same, and adjustable in height, a movable carriage supporting the weight, rotary drums to which the carriage is connected and which are provided with fusees and a rope stretched from the weight to and around each fusee, substantially as and for the purpose set forth.",
    ),
    claim(
      4,
      "An air-craft comprising a series of balloons coupled together and provided with rigid casings, the foremost of said balloons being provided with driving mechanism, and the remainder adapted to carry the load or freight, and extensible covers secured to the rigid casings and covering the intermediate spaces between two adjacent balloons.",
    ),
    p(
      text(
        "In testimony that I claim the foregoing as my invention I have signed my name in presence of two subscribing witnesses.",
      ),
    ),
    p(text("FERDINAND GRAF ZEPPELIN. [L. S.] Witnesses: WM. HAHN, H. WAGNER.")),
  ],
};

export const zeppelinAirshipParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: ["The formal salutation begins the legal instrument without adding a technical limitation."],
  2: [
    "Zeppelin identifies himself, his Stuttgart location, and his military title, then states that the following text is the complete enabling description required for the patent.",
  ],
  3: [
    "The invention treats a navigable balloon as a long, narrow powered vessel. Separating motors allows a smaller hull diameter for a given propulsive capability, and the text also contemplates a powered leading craft towing or coupling load-carrying balloons.",
  ],
  4: [
    "This paragraph maps the document’s figures: elevation and cross-section views, gas-bag compartments, a movable trim weight, a trailing-rope alternative, and a train of connected balloons. The printed references to Figures 11 and 12 remain, but their panels are absent from the served facsimile.",
  ],
  5: [
    "The rigid hull is a tube, wire-rope, and mesh framework under a silk-like outer casing. Partitions, vertical stays, rings, and diagonal stays create chambers for folded gas bags; leaving free volume lets the gas expand at altitude or when heated while valves handle exceptional release.",
  ],
  6: [
    "Auxiliary maneuvering bags are filled before the main bags. Releasing gas from those auxiliary bags lets the main bags expand upward into the chamber, preserving the main lifting gas instead of admitting air to compensate for fuel consumed on a long journey.",
  ],
  7: [
    "A rigid gangway gives access to the hull and supports cars for crew, fuel, passengers, and cargo. Each driving mechanism turns two propellers placed laterally near the craft’s center of resistance, the source’s aerodynamic reference for a force application point.",
  ],
  8: [
    "Two rudders, above and below the hull at either end, provide lateral steering through suitable operating gear. The passage states placement and function but does not claim a later three-axis aircraft-control system.",
  ],
  9: [
    "A suspended running weight shifts longitudinally on a traveler to trim the balloon level or inclined. The paired drums and shaped fusees keep the two supporting ropes under light tension, so the weight’s gravity supplies a restoring pull as the craft’s attitude changes.",
  ],
  10: [
    "The trim weight may be disconnected from the drum mechanism when used simply as a hanging weight. Alternatively, adjustable towing or trailing ropes can be moved along the hull and tied together in flight so their geometry helps keep the vehicle in its selected position.",
  ],
  11: [
    "A powered balloon can tow similarly built but unpowered load balloons as a train. The claim-side description uses movable couplings and an extensible cover over the gap to keep wind from catching the intermediate space; the cited Figures 11 and 12 are missing from the supplied drawing sheets.",
  ],
  12: [
    "Zeppelin proposes balancing unequal buoyancy among balloons in a train by transferring liquids, heavy cargo, or by condensing gas or atmospheric air. These are operating options for compensating mass or gas changes, not a quantified performance guarantee.",
  ],
  13: [
    "This sentence marks the transition from the descriptive specification to the four legal claims that define the asserted combinations.",
  ],
  18: [
    "This closing attestation says that Zeppelin signed in the presence of two subscribing witnesses, making the signature and witness lines that follow part of the printed legal formalities.",
  ],
  19: [
    "The printed signature identifies Ferdinand Graf Zeppelin and gives the two witnesses as Wm. Hahn and H. Wagner; the bracketed L. S. is the printed seal notation.",
  ],
};
