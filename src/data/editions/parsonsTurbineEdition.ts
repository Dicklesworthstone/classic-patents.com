import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const sourceSheetPreview = (sheet: 1 | 2 | 3, figure: string, description: string) => ({
  src: `/patents/figures/us-608969-parsons-turbine/source-sheet-${sheet}-v1.png`,
  alt: `Complete unmodified source drawing sheet ${sheet} of 3 from US 608,969, including ${figure}: ${description}`,
  width: 2320,
  height: 3408,
});

const PREVIEWS = {
  1: sourceSheetPreview(1, "Fig. 1", "eight marine turbines coupled to four screw-shafts"),
  2: sourceSheetPreview(2, "Fig. 2", "four main turbines and reversing turbines for a fast vessel"),
  3: sourceSheetPreview(3, "Fig. 3", "six turbines coupled to three screw-shafts"),
} as const;

const figure = (
  value: string,
  numbers: readonly (keyof typeof PREVIEWS)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: value,
  href: "#",
  referenceType: "figure",
  label: `Preview ${value} from the US 608,969 facsimile`,
  figurePreviews: numbers.map((number) => PREVIEWS[number]),
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const claimText = (number: number): string => {
  const block = parsonsTurbineArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim")
    throw new Error(`Parsons manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
};

/**
 * Continuous, hand-authored edition of the exact seven-page facsimile. The
 * first three source pages are drawing sheets; page markers are deliberately
 * retained only in the reviewed ledger, never in this public reading.
 */
export const parsonsTurbineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "fafd0884e61225ee7f93d0a88c81229cbbb4984e48869c204af58cb6af64b991",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "CHARLES ALGERNON PARSONS, OF NEWCASTLE-UPON-TYNE, ENGLAND.",
        "MARINE STEAM-TURBINE.",
        "Specification forming part of Letters Patent No. 608,969, dated August 9, 1898.",
        "Application filed March 4, 1898. Serial No. 672,594. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Eight turbines on four screw-shafts",
      description: text(
        "C. A. PARSONS. MARINE STEAM TURBINE. Application filed Mar. 4, 1898. Patented Aug. 9, 1898. No model. Witnesses. Inventor. By Richardson, his Attorneys.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 2",
      title: "Four main turbines and reversing turbines",
      description: text(
        "C. A. PARSONS. MARINE STEAM TURBINE. Application filed Mar. 4, 1898. Patented Aug. 9, 1898. No model. Witnesses. Inventor. By Richardson, his Attorneys.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 3",
      title: "Six turbines on three screw-shafts",
      description: text(
        "C. A. PARSONS. MARINE STEAM TURBINE. Application filed Mar. 4, 1898. Patented Aug. 9, 1898. No model. Witnesses. Inventor. By Richardson, his Attorneys.",
      ),
    },
    { kind: "paragraph", inlines: text("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: text(
        "Be it known that I, CHARLES ALGERNON PARSONS, engineer, a subject of the Queen of Great Britain and Ireland, residing at Heaton Works, Newcastle-upon-Tyne, England, have invented certain new and useful Improvements in Marine Steam-Turbines, of which the following is a specification.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "My invention relates to marine steam-engines; and it is chiefly applicable to engines of the steam-turbine class.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "My object is to so arrange the engines and couple up the steam connections as to enable the engines to be operated more economically under all conditions of power and speed variation—that is, my object is to enable the engines to operate with the maximum economy of steam per horse-power expended at low powers as well as at high powers and also at slow speeds as well as at high speeds.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In all modern engines of high economy the steam is expanded successively in a series of cylinders or engines, the first of which cylinders or engines takes steam directly from the boiler and exhausts into the next cylinder, which again exhausts into the next, and so on throughout the series.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "I am aware that at present for mechanical reasons the exhaust-steam from one cylinder is sometimes caused to supply two low-pressure cylinders, so as to more nearly equalize the weight of the moving parts acting on the several crank-shafts. I am aware also that live steam is sometimes admitted to the low-pressure steam-chest directly from the boiler for starting purposes, or for the purpose of increasing the power of the engine under exceptional conditions. My invention, however, does not concern itself with such mechanical purposes as I have indicated.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "My invention consists in new methods of arranging, proportioning, and operating a set of steam-turbines so as to enable economy to be maintained under widely-varying conditions, such as occur in connection with marine steam propulsion.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In carrying my invention into effect—say to a case where four screw-shafts are used, each shaft being driven by a separate compound steam-turbine—I so couple these four separate turbines by suitable valves and pipes that when reduced power is required for cruising purposes the steam shall flow through Nos. 1, 2, 3, and 4 compound engines in series from the first to the last, the last turbine exhausting into the condenser. For this purpose I arrange turbines Nos. 1, 2, 3, and 4 so that the capacity or volume increases successively from one to four—that is, generally speaking, the capacity of No. 2 is greater than the capacity of No. 1, and so on throughout the series. By this arrangement the steam, practically speaking, continually expands from the moment of entering No. 1 until it finally discharges at the low-pressure end of No. 4 to the condenser. This variation in capacity may be secured either by increase in actual dimensions from one to four or by the increase in speed of rotation, or a combination of both; also, each individual turbine of the series is preferably graduated in capacity, so that the turbines at the inlet end are smaller than those at the exit end. When greater power, however, is required, the pipe connections are so made that the high-pressure steam from the boiler is admitted to the inlet of No. 1 and also to the inlet of No. 2 and passes from the exit of No. 1 to the inlet of No. 3 and from the exit of No. 2 to the inlet of No. 4, then from the exit of Nos. 3 and 4 to the condenser, and thus the steam flows through all four turbines in what may be described as “compound parallel.” Usually the compound-parallel coupling will be sufficient for most purposes; but in exceptional cases I may arrange the valves so as to admit the high-pressure steam to each inlet of Nos. 1, 2, 3, and 4 turbines and connect the exit of each turbine to the condenser. The coupling is then in simple parallel; but in such cases where great power is required I generally prefer to arrange the turbines so that the compound-parallel coupling may suffice. I may also sometimes in cases where the boiler-pressure has to be reduced arrange the valves so that Nos. 1 and 2 shall be in parallel and Nos. 3 and 4 in series, receiving their steam from the exit of No. 2 and also No. 1. Such an arrangement might be used to enable the boiler-pressure to be lowered to atmospheric pressure when going into action.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In order that the expansion of the steam shall be properly distributed throughout the turbines under both conditions of working—that is, either while working in compound parallel or in series—it is necessary, generally speaking, as I have already described, to make the capacity increase from No. 1 throughout the series continually or by moderate steps in the capacity. While operating, however, at full power in compound parallel, the pressures delivered on the several screw-shafts will not be equal. This, however, I meet by a small variation in the screws on the several shafts, and also sometimes by a modification of the capacities of the turbines from the sizes most economical for series working, which modification does not detract materially from their efficiency under either arrangement of coupling.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "My invention may be varied; but the essential features consist in so proportioning the number and form of turbines and so connecting them by suitable valves and pipes that I am enabled to operate them economically either in series, the steam passing from one to the other, or in compound or simple parallel, the steam being supplied to the high-pressure end of one, two, three, or four of the lot and discharged into the condenser or the atmosphere through four or a less number at the low-pressure end or ends of separate turbines. Under the invention thus it is evident that the turbines may be placed in pairs on each of two screw-shafts instead of four, or three screw-shafts and six turbine motors may be used.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "Four shafts and eight turbine motors may be used in this case if the shafts be numbered 1, 2, 3, and 4 and the motors A A′ B B′ C C′ D D′. Then for series working the steam will pass through the motors in the order A A′ B B′ C C′ D D′ and for compound-parallel working through A B C D in series from boiler to condenser and similarly throughout A′ B′ C′ D′; also, from boiler to condenser. Also further modifications may be made in the coupling for exceptional cases.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In such cases by a proper combination of the turbine sets on each shaft a greater number of different powers may be dealt with by suitable combination of the turbines on the steam distribution and a greater degree of economy realized, especially so in the case of large war-ships where the engines are required to run with the greatest economy at various cruising speeds, as well as at full power, as by means of a large number of separate turbines of different sizes the power may be varied within large limits, and at the same time a large range of expansion in the turbines can be maintained under all circumstances. From the description I have given it will be seen that by simply changing the connections between the engines or cylinders the steam is caused to flow through different successive cylinders or engines, by which different degrees of successive expansion are secured and different outputs of power more economically obtained than by the methods at present in use.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "I sometimes prefer to make the turbine engines in two or more distinct portions or banks of cylinders, and I then arrange the valves so that the steam may be turned through either portion or both or more portions, and under these circumstances the engines to which no steam is being supplied will preferably work in the vacuum of the condenser.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In the case of changing the course of the flow of steam through successive cylinders with an engine of the turbine class the distribution may be so carried out as to receive suitable drops in pressure, so as to secure a maximum efficiency under different speeds of rotation.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "In carrying my invention into effect with reference to the accompanying three sheets of drawings, ",
        },
        figure("Figure 1, Sheet 1", [1]),
        {
          kind: "text",
          text: ", shows a set of eight turbines arranged for working on four screw-shafts, according to one part of my invention. ",
        },
        figure("Fig. 2, Sheet 2", [2]),
        {
          kind: "text",
          text: ", shows a modification of my invention having four main turbine motors A, B, C, and D working on four shafts numbered 1, 2, 3, and 4. ",
        },
        figure("Fig. 3, Sheet 3", [3]),
        {
          kind: "text",
          text: ", shows another modification in which six turbines and three screw-shafts are used.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure("Fig. 1, Sheet 1", [1]),
        {
          kind: "text",
          text: ", is shown a form of my invention having a set of eight turbines A A′ B B′ C C′ D D′ arranged in banks and coupled to four screw-shafts numbered 1, 2, 3, and 4, two turbines on each shaft. Turbines A and A′ are coupled to shaft No. 1, turbines B and B′ are coupled to shaft No. 2, turbines C and C′ are coupled to shaft No. 3, and turbines D and D′ are coupled to shaft No. 4. Turbines A, B, C, and D are of regularly-increasing capacity from A to D, and the turbine blades on each of the respective motors are preferably of increasing capacity toward the exhaust ends. Turbines A′, B′, C′, and D′ are similarly graduated, but each of the latter set are preferably of somewhat larger capacity than the corresponding members of the first set. In the case of series working the turbines may be connected in two ways.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "In the first the main inlet-pipe P supplies steam from the boilers, which then passes through turbine A and by way of valve R¹ and pipe P² to turbine A′. From A′ it passes by valve R² and pipe P³ to the inlet end of turbine B, from turbine B by valve R³ and pipe P⁴ to turbine B′, from turbine B′ by valve R⁴ and pipe P⁵ to turbine C, from turbine C by valve R⁵ and pipe P⁶ to turbine C′, from turbine C′ by valve R⁶ and pipe P⁷ to turbine D, from turbine D by valve R⁷ and pipe P⁸ to turbine D′, and from turbine D′ by pipe P¹⁰ to the condenser E. In this arrangement the valves R⁸ to R¹⁶, inclusive, are closed.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In the second method of connecting for series working the steam passes from the boiler to turbine A by the pipe P¹, from turbine A by valve R⁸ and pipe Q¹ to turbine B, from turbine B by valve R¹⁵ and pipe Q⁷ to turbine A′, from turbine A′ by valve R¹² and pipe Q² to turbine B′, from turbine B′ by valve R⁴ and pipe P⁵ to turbine C, from turbine C by valve R¹⁰ and pipe Q⁵ to turbine D, from turbine D by valve R¹⁶ and pipe Q⁸ to turbine C′, from turbine C′ by valve R¹⁴ and pipe Q⁶ to turbine D′, and from turbine D′ by pipe P¹⁰ to the condenser E. In this arrangement the valves R¹, R², R³, R⁵, R⁶, R⁷, R¹¹, and R¹³ are closed.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In the case of compound-parallel working the flow of steam is as follows: from the boiler by the pipe P¹ to turbine A, from turbine A by valve R⁸ and pipe Q¹ to turbine B, from turbine B by valve R⁹ and pipe Q³ to turbine C, from turbine C by valve R¹⁰ and pipe Q⁵ to turbine D, from turbine D by valve R¹¹ and pipes P⁹ and P¹⁰ to the condenser E, also from the boiler by way of the pipe P¹ through the turbine A′, from turbine A′ by valve R¹² and pipe Q² to turbine B′, from turbine B′ by valve R¹³ and pipe Q⁴ to turbine C′, and from turbine C′ by valve R¹⁴ and pipe Q⁶ to turbine D′, and from turbine D′ by the pipe P¹⁰ to the condenser E. The valves not mentioned in the above cases should be closed in the respective arrangements.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Either of the sets A, B, C, and D or A′, B′, C′, and D′ may be used independently. Any set not being used revolves freely in ",
        },
        term(
          "vacuum",
          "Here the idle turbine is connected to the low-pressure condenser space rather than supplied with working steam. The source uses this condition to let an unused machine turn freely.",
        ),
        {
          kind: "text",
          text: ". Other combinations may be made, as will readily be seen from the above description; but the principle and mode of operation are similar.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure("Fig. 2, Sheet 2", [2]),
        {
          kind: "text",
          text: ", a set of turbines and connections are shown of about ten thousand collective horse-power suitable for a fast vessel or a torpedo-boat destroyer. In this modification four screw-shafts are employed, only two of which are indicated in ",
        },
        figure("Fig. 2", [2]),
        {
          kind: "text",
          text: ", numbered 1 and 4, and four turbines A B C D act thereon for the usual forward driving; but for reversing two suitable turbine motors X and Y are shown, acting on the same shafts with the turbines C D. These motors X and Y, when operated, will drive their respective shafts in the reverse direction, thus propelling the vessel astern. When these motors are not in use for reversing, they are suitably connected with the condenser, so that they will be running freely in vacuum.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "When going full power ahead, the turbine A takes steam from the main supply-pipe S¹. After partial expansion in this motor it passes by the pipe S¹⁰ to turbine C, where the expansion is completed, and the steam passes thence to the condenser G. Similarly the turbine B takes steam from the pipe S² and passes it on by way of the pipe S³ after partial expansion to the motor D, which delivers it to the condenser H. The motors thus arranged give full power ahead. For working at cruising speeds and therefore with reduced power the coupling-pipes S² and S⁴ are utilized, and the connecting-valves T¹ and T³ are opened and valves T⁴, T⁶, and T⁸ closed. The steam-pipe S¹ only is then used, and the condenser H is cut off from the circulating water, so that it becomes inoperative.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The course of the steam in this case will then be as follows: from boiler by valve T¹ and pipe S¹ to turbine A, from turbine A by pipe S² and valve T³ to turbine B, from turbine B by pipe S³ to turbine D, from turbine D through condenser H, pipe S⁴, and valve T⁵ to turbine C, from turbine C to condenser G, where it is finally condensed. Valve T⁸ is provided to enable the pressure admitted to the two sets of turbines to be equalized when working at full power. For reversing valves T² and T⁴ are closed and T⁹ and T¹⁰ opened. Thus steam is admitted by pipes S⁶ to turbine X, and from turbine X by pipes S⁷ to condenser G, also by pipe S⁸ through turbine Y by pipe S⁹ to condenser H. One or both of these reversing-motors may be used, according to the speed required in going astern.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The proportions of the internal parts of the turbine motors depend largely upon the requirements of the service for which the ship is designed. Thus if economy at full speed is of the utmost importance turbine A is made identical with turbine B and similarly turbine C identical with turbine D; but if it is desirable to secure a greater degree of economy at cruising speeds then a compromise is made, and turbine B is made of larger capacity than A, and similarly turbine C is made larger than D. In the same way the proportions of the rows of turbines on each of the motors and their graduation in size and capacity along the barrels are regulated by the above-mentioned conditions, which have to be met in each class of service.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure("Fig. 3, Sheet 3", [3]),
        {
          kind: "text",
          text: ", is shown a modification of my invention in which three screw-shafts numbered 1, 2, and 3 are used, to which are coupled six motors, two on each shaft, A and A′ on shaft No. 1, B and B′ on shaft No. 2, and C and C′ on shaft No. 3. In this group of motors I have made, for the sake of simplicity, turbines A, B, and C, each identically the same as also A′ B′ C′ exactly alike, but each of the latter set are preferably of somewhat larger capacity than the members of the first set.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "For series working the flow of steam would be as follows: from the boiler by the pipe U¹ to turbine A, from turbine A by valve W¹ and pipe U² to turbine B, from turbine B by valve W² and pipe U³ to turbine C, from turbine C by valve V³ and pipe U⁴ to turbine C′, from turbine C′ by valve V⁴ and pipe U⁵ to turbine B′, from turbine B′ by valve W⁵ and pipe U⁶ to turbine A′, from turbine A′ by pipes U⁷, U⁸, and U⁹ to the condenser K.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For compound-parallel working the flow of steam would be—first group: from boiler by pipe U¹ to turbine motor A, from motor A by valve W⁷ and pipe U¹² to motor A′, and from motor A′ by pipes U⁷, U⁸, and U⁹ to condenser K; second group: from boiler by pipe U², valve W⁸, and pipe U¹³ to motor B, from motor B by valve V⁹ and pipe U¹⁴ to motor B′, and from motor B′ by valve W⁹, pipes U¹⁵, U¹⁶, U⁸, and U¹⁹ to condenser K; third group: from boiler by pipe U³ to valve V¹⁰, pipe U¹⁸, and valve V¹¹, and pipe U¹⁷ to motor C; from motor C by valve W⁶ and pipe U⁴ to motor C′, and from motor C′ by valve V¹¹ and pipes U¹³, U¹⁵, U¹⁶, U¹⁷, and U¹⁹ to condenser K.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "For simple-parallel working the steam flows from the boiler to the main parallel supply-pipes U¹³ U¹⁷ and U¹⁸ U¹⁹ by means of the pipes U¹ and U². Each of the turbines A, B, and C is supplied from pipes U¹², U¹³, and U¹⁷, and each also exhausts into the condenser K. In the same way each of the turbines A′, B′, and C′ is supplied from pipes U¹⁴, U¹⁵, and U¹⁹, and each exhausts into the condenser.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "Having thus described my invention, what I claim as new, and desire to secure by Letters Patent, is—",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: text(
        "1. In combination, a plurality of screw-shafts, a plurality of turbines and the pipes and valves forming the connection between the turbines to couple them in series in simple parallel or in compound parallel, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: text(
        "2. In combination, a plurality of screw-shafts, plurality of turbines on the separate shafts, pipe connections between the turbines with valves to connect them in series or in compound parallel, and a reversing-turbine on the shaft of one of the first-mentioned turbines with pipe-and-valve connections thereto, the said reversing-turbine running in vacuum while the first-mentioned turbines are running, substantially as described.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: text(
        "3. In combination, the plurality of shafts, the plurality of turbines with pipe connections and a reversing-turbine connected with one of the shafts and running in vacuum when the first-mentioned turbines are running, substantially as described.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In witness whereof I have hereunto set my hand in presence of two witnesses. CHARLES ALGERNON PARSONS. Witnesses: GEORGE GREY. ABRAHAM BEURCK GOLDSBROUGH.",
      ),
    },
  ],
};

/** One source-bounded engineering reading for every prose block, keyed by block index. */
export const parsonsTurbineParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: ["This conventional notice introduces the legal specification; it is not a technical claim."],
  5: [
    "Parsons identifies himself as an engineer at Heaton Works and limits the subject to improvements in marine steam turbines.",
  ],
  6: [
    "The specification concerns marine propulsion machinery using turbines, rather than a single bladed rotor design in isolation.",
  ],
  7: [
    "The stated goal is economical operation across both load and speed, including slow cruising and high-speed service.",
  ],
  8: [
    "Parsons begins from serial expansion: exhaust from one engine becomes the working steam of the next, lowering pressure in stages.",
  ],
  9: [
    "He distinguishes his proposal from known balancing and starting arrangements for reciprocating engines; those are not what he claims.",
  ],
  10: [
    "The invention is a system-level arrangement of several turbines, their capacities, and their operating connections for marine service.",
  ],
  11: [
    "For four propeller shafts, valves select series flow for reduced power or compound-parallel flow for greater power; turbine capacity rises toward the low-pressure end.",
  ],
  12: [
    "The capacity progression keeps expansion distributed whether flow is series or compound-parallel, while altered screw or turbine sizes compensate for unequal shaft output.",
  ],
  13: [
    "The essential scope is selectable series, simple-parallel, or compound-parallel plumbing, with one to four high-pressure admissions and low-pressure discharge paths.",
  ],
  14: [
    "The eight-machine example places two turbines on each of four shafts and gives the series and compound-parallel order of their use.",
  ],
  15: [
    "Changing the connections changes the number of operating turbine sets and expansion steps, allowing economical power variation for cruising and full power.",
  ],
  16: [
    "Parsons also permits engines to be divided into banks so steam can be routed through selected banks while idle machines spin in condenser vacuum.",
  ],
  17: [
    "Reversing or otherwise changing the steam route should retain appropriate pressure drops, so efficiency remains acceptable at different shaft speeds.",
  ],
  18: [
    "The three source drawings define the claimed arrangements: eight turbines/four shafts, four principal turbines with reversing units, and six turbines/three shafts.",
  ],
  19: [
    "Figure 1 labels paired turbine sets on four shafts. The turbines rise in capacity along the flow path, and the second set is somewhat larger.",
  ],
  20: [
    "This is the first Figure 1 series connection: every named valve and pipe establishes one long A through D-prime expansion route to condenser E.",
  ],
  21: [
    "The second Figure 1 series option cross-connects the pairs in a different order; the listed closed valves prevent unwanted parallel branches.",
  ],
  22: [
    "In compound-parallel operation, one A-to-D train and one A-prime-to-D-prime train expand steam in parallel, with the unused connections shut.",
  ],
  23: [
    "Either four-turbine set may run alone; an idle set is deliberately allowed to revolve in condenser vacuum rather than being mechanically disconnected.",
  ],
  24: [
    "Figure 2 is a roughly ten-thousand collective-horsepower example for a fast vessel, including two reversing turbines that can drive the shafts astern.",
  ],
  25: [
    "For full-ahead use, two main paths A-to-C and B-to-D complete expansion in separate condensers; cruising re-plumbs those paths and isolates condenser H.",
  ],
  26: [
    "The passage gives the reduced-power steam route, equalizing valve, and the separate X and Y reversing paths; routing, not a new turbine blade shape, is the mechanism.",
  ],
  27: [
    "Internal proportions depend on whether full-speed or cruising economy matters most, so relative turbine sizes and rows are selected for the intended ship service.",
  ],
  28: [
    "Figure 3 substitutes three shafts and six turbines. Each second-set turbine is preferably larger than its counterpart in the first set.",
  ],
  29: [
    "The Figure 3 series route sends steam successively through A, B, C, C-prime, B-prime, and A-prime before condenser K.",
  ],
  30: [
    "The Figure 3 compound-parallel description defines three separate groups and their valve-and-pipe routes to the condenser.",
  ],
  31: [
    "For simple parallel service, separate supply pipes feed each turbine and each exhausts to the condenser, rather than passing through a train.",
  ],
  32: ["This formula introduces the three numbered legal claims that follow."],
  36: [
    "Parsons signs the specification in the presence of George Grey and Abraham Beurck Goldsbrough.",
  ],
};

export const parsonsManualClaimText = claimText;
