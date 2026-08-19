import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
  Patent,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (number: number, width: number, height: number) => ({
  src: `/patents/figures/us-124404-westinghouse-air-brake/fig-${number}-source-crop.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US 124,404.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": crop(1, 1540, 900),
  "Fig. 2": crop(2, 800, 650),
  "Fig. 3": crop(3, 800, 650),
  "Fig. 4": crop(4, 720, 570),
  "Fig. 5": crop(5, 830, 460),
  "Fig. 6": crop(6, 900, 400),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 124,404`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/** A continuous, manually prepared edition of the complete US 124,404 facsimile. */
export const westinghouseAirBrakeArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "4071920f448fd1c3c5d8b5d593963e629adc0b3ae91212aae23cfad3d95ed665",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GEORGE WESTINGHOUSE, JR., OF PITTSBURG, PENNSYLVANIA.",
        "IMPROVEMENT IN STEAM-POWER AIR-BRAKES AND SIGNALS.",
        "Specification forming part of Letters Patent No. 124,404, dated March 5, 1872.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-6",
      title: "Westinghouse's car piping, gauges, and automatic tripping apparatus",
      description: [
        { kind: "text", text: "The printed drawing sheet contains " },
        figure("Fig. 1"),
        { kind: "text", text: ", " },
        figure("Fig. 2"),
        { kind: "text", text: ", " },
        figure("Fig. 3"),
        { kind: "text", text: ", " },
        figure("Fig. 4"),
        { kind: "text", text: ", " },
        figure("Fig. 5"),
        { kind: "text", text: ", and " },
        figure("Fig. 6"),
        { kind: "text", text: ". Each reference opens a direct crop from the pinned facsimile." },
      ],
    },
    p("SPECIFICATION."),
    p("To all whom it may concern:"),
    p(
      "Be it known that I, GEORGE WESTINGHOUSE, Jr., of Pittsburg, in the county of Allegheny and State of Pennsylvania, have invented a new and useful Improvement in Steam-Power Air-Brakes and Signals; and I do hereby declare the following to be a full, clear, and exact description thereof, reference being had to the accompanying drawing making a part of this specification, in which—",
    ),
    paragraph([
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " is an inverted view of a car-body with my improved apparatus attached thereto. ",
      },
      figure("Fig. 2"),
      {
        kind: "text",
        text: " shows the arrangement of the air-brake pipes with reference to the main reservoir. ",
      },
      figure("Fig. 3"),
      { kind: "text", text: ", in connection with " },
      figure("Fig. 2"),
      { kind: "text", text: ", illustrates the use of the apparatus for signaling. " },
      figure("Fig. 4"),
      { kind: "text", text: " is an enlarged view of the gauge-index, and " },
      figure("Fig. 5", "Figs. 5"),
      { kind: "text", text: " and " },
      figure("Fig. 6", "6"),
      { kind: "text", text: " are enlarged and detached views of the tripping apparatus of " },
      figure("Fig. 1"),
      { kind: "text", text: "." },
    ]),
    p("Like letters of reference indicate like parts in each."),
    p(
      "In the steam-power air-brake apparatus heretofore in use a single line of pipe conveys the compressed air from the main reservoir on the locomotive to each brake-cylinder. If this pipe becomes accidentally broken at any point it is, of course, useless for braking purposes from that point to the rear end of the train. For this and other reasons I have devised an apparatus consisting in part of a double line of brake-pipes, which may be co-operative or independently operative in braking at the pleasure of the engineer, and which as a separate device I have included in a separate application.",
    ),
    p(
      "The improvement herein described relates to the same class of apparatus; and consists in the features of construction and combination, substantially as hereinafter claimed, by which, first, an air-reservoir, auxiliary to or independent of the main reservoir, is combined on each car with the brake-cylinder; second, by means of a cock or cocks, with suitable ports, such additional reservoir, when used as an auxiliary reservoir, is charged with compressed air from one brake-pipe, and the brake-cylinder from the other, such pipes in such use being interchangeable or not, at pleasure; third, and by means of a single cock with suitable ports either brake-pipe may be used for charging the reservoir and the other for operating the brakes; fourth, when a car becomes disconnected from the train by accident or otherwise, a port or ports will thereby be opened in a communicating-pipe or pipes, by which the air from such auxiliary reservoir will be admitted freely to the brake-cylinder, so as automatically to apply the brakes; and fifth, the conductor and engineer may communicate signals or orders to each other by the use of the brake-pipes and the compressed air.",
    ),
    p(
      "Some of the functions above specified are performed by the apparatus described in the separate application above mentioned; and hence in such cases I limit myself in this application to the means set forth or their substantial equivalents.",
    ),
    p(
      "To enable others skilled in the art to make and use my improvement, I will proceed to describe its construction and mode of operation.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The brake-pipes B B¹ extend along under the body of each car A from end to end, and the pipes of one car are coupled to those of the next by the hose and coupling connections described in patent granted to me August 8, 1870, and thereby connection is made with the main reservoir A¹. The brake-cylinder C is of the usual construction. An ",
      },
      term("air-receiver", "A vessel that stores compressed air for the local car."),
      {
        kind: "text",
        text: ", D, is attached to the bottom of the car A. This receiver should ordinarily be somewhat larger than the brake-cylinder C, and strong enough to sustain a pressure of, say, one hundred pounds per square inch, more or less. It may be used as a reservoir auxiliary to the main reservoir A¹, or as an independent reservoir, one on each car, for storing up the air necessary to apply the brakes. In this latter use I combine with it any known device for compressing air, such as an air-pump, fan-blower, steam-injector, &c.; and if an air-pump it may be worked by an eccentric on one of the car-axles A² or in other known way. A pipe or air-passage then extends directly or indirectly from it to the brake-cylinder C, with a stop-cock device therein, by which the compressed air is admitted at pleasure from such reservoir D to the brake-cylinder, so as to apply the brakes in the usual way. By the means set forth reservoir D is recharged from time to time, as may be necessary, in order to keep a store or supply of compressed air always on hand and ready for use.",
      },
    ]),
    p(
      "But the chief use which I contemplate for this reservoir D is as an auxiliary to the main reservoir A¹. One brake-pipe, B, I use in the ordinary way for conveying compressed air from the main reservoir A¹ to the brake-cylinder C, and the other pipe, B¹, I always keep in open communication with the main reservoir A¹, so that it is always filled with compressed air; but it is immaterial in the construction shown which pipe is used for either purpose. A cross-pipe, B² B³, connects the pipes B B¹, and from their point of junction the pipes b b¹ branch off, one to the brake-cylinder C and the other to the auxiliary reservoir D. At the junction of these pipes in a suitable case, d, I arrange a cock, d¹, having two non-communicating ports, a a¹, such that in one adjustment they will open communication from B² to b, and from B³ to b¹; and in the other adjustment from B³ to b and from B² to b¹. With the adjustment shown the pipe B¹ is to be used as a reservoir-pipe for containing compressed air and conveying the same to the auxiliary reservoir D, and the other pipe B is the ordinary operating-pipe for operating the brakes in the usual way.",
    ),
    p(
      "It will be seen that by turning the cock d¹ one quarter way around the relation of the pipes B B¹ to the auxiliary reservoir D and the brake-cylinder C will be reversed, but that the operation otherwise will remain the same. I also so construct my apparatus that when a car leaves the track or becomes uncoupled from the train the brakes will be automatically applied by means of the compressed air which is stored up in the reservoir-pipe and the auxiliary reservoir.",
    ),
    paragraph([
      {
        kind: "text",
        text: "For this purpose I connect the pipes B B¹ with each other near the ends of the car by cross-pipes E E. In two diagonally-opposite corners of the parallelogram thus formed I make cases e for the three-way cocks e, though one such cock and case will suffice to perform the function in view. When the cars are running these cocks are both in the position shown at the upper right corner of ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", so as to leave a free communication through the pipes B B¹. Each cock e is provided with a handle or arm, which (by means hereinafter described) is, when a coupling breaks or a car leaves the track, shifted so as to throw the cock to the position shown at the lower left-hand corner of ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", by which through communication is closed and the compressed air passes from the reservoir-pipe B¹ and auxiliary reservoir D around through the operating-pipe B and pipes B² b to the brake-cylinder C, and applies the brakes.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "To give the cocks e this throw I have shown two devices, which are illustrated in ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: ", " },
      figure("Fig. 5", "5"),
      { kind: "text", text: ", and " },
      figure("Fig. 6", "6"),
      { kind: "text", text: ". In " },
      figure("Fig. 6"),
      {
        kind: "text",
        text: ", e¹ represents the cock-case; e², the stem of the cock e; and e³, the shifting-handle, which, in this figure, is in the position it occupies when through communication is open. From a wrist on this handle e³ a crank-arm, m, extends back to, and, by a catch, m¹, engages, a counter-catch, o. A spring, m², or its equivalent, a weight, is arranged in connection with the crank-arm m, so that when the catch is released the arm will, by a forward throw, shift the position of the cock e, as above indicated. To effect this release I introduce under the arm m a tripping-head or lever, i, preferably of circular form, so that it will bear against the arm m whichever way it is moved, and from at or about its central point a tripping-stem, i¹, extends downward such distance that when the car is on the track, it will clear the ground, but when the car leaves the track it will strike the ground, the track, or ties, and, by a vertical, forward, or back or side motion, lift the arm m and disengage the catch with the result already stated.",
      },
    ]),
    p(
      "But to shift the position of the cock when the car-couplings break, while the car is still on the track, I run a cord or chain, y, or equivalent device from the outer end of the handle e³ forward and attach it to the hose-coupling y¹ of that or the next car at such point forward of the slack that when the car-couplings break and the slack-hose is straightened out the handle e³ will, by the cord y, be drawn over far enough to shift the position of the cock e, as already explained. In this way the brakes are automatically applied, in case of accident, to any part of the train. The same wire or chain y, or another, may extend in like manner from the coupling y¹ to the stem i¹, or to any other device which will disengage the catch m¹ with like result to that already stated. A slot, x, is made in the forward or outer end of the arm m, in which the wrist of the handle e³ plays, in order that the cock may be shifted by the wire y independently of the arm m. But other devices for automatically shifting the cock e may be employed; my present invention not being limited to those described.",
    ),
    paragraph([
      {
        kind: "text",
        text: "To the main reservoir A¹ is attached any suitable form of pressure-gauge, as shown at f, and to each brake-pipe B B¹ I attach a pressure-gauge of like suitable form g g¹, and arrange in convenient proximity to each an alarm-whistle, h h¹. These gauges g g¹ and whistles h h¹ are for use in signaling. Each one has a graduated index (illustrated in ",
      },
      figure("Fig. 4"),
      {
        kind: "text",
        text: ") so constructed, with reference to the pressure of air in the pipes, that a certain amount or degree of pressure, say one-half pound per square inch, shall send the index fingers to the graduation 2; a pressure a little greater, to 3; and so on. By a system agreed on, each graduation indicates a separate order or message, as “flag station,” “stop for orders,” “danger—run slow,” “danger—stop,” &c.; the highest or last graduation, preferably, indicating “stop.” The gauge is so constructed that greater degrees of air pressure will not effect it. In each car a like gauge is arranged, as shown at g², ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: ", and a pipe connection, n n¹, extends from it to the brake-pipes B B¹. This gauge is arranged at any suitable point in the car, and its pipe connections are fitted with a cock, n², which is accessible to the conductor, and of which he carries the key. These pipe connections n n¹ and cock n² are such that, on the cock n² being opened, the compressed air will be admitted from the reservoir-pipe, say B¹, both to the gauge g² and to the other or operating-pipe B, along which it will pass to the gauge g in the engineer's cab. The conductor opens the cock n² till the pressure of air has moved the index fingers to the graduation which indicates the order he wishes to give the engineer, and then closes it. The index finger on the engineer's gauge will, in like manner, be carried to the same graduation, and the alarm of the whistle will call his attention to it. By reversing the operation the engineer may communicate messages to the conductor.",
      },
    ]),
    p(
      "I do not deem it necessary to describe more minutely the ports and passages leading from the pipes n n¹ to the gauge g², as a suitable arrangement of such devices, on the function being known, can be readily made by those skilled in the art. Where one of the brake-pipes is always used as a reservoir-pipe, and the other as an operating-pipe, only one of the gauges g g¹ will be required, and, of course, it should be arranged on the operating-pipe.",
    ),
    p(
      "It will be seen that the conductor, by fully opening the cock, in case of extreme danger, will be enabled to apply the brakes himself, as well as notify the engineer, since the air will flow over by the pipes n n¹ from the reservoir-pipe B¹ to the operating-pipe B, and thence to the brake-cylinders. Also, that if it be desired to communicate but a single order, the gauges g g¹ g² may be dispensed with, and the order be communicated by a whistle blast.",
    ),
    p("What I claim as my invention, and desire to secure by Letters Patent, is—"),
    claim(
      1,
      "An air-reservoir arranged on each separate car in combination with an air-brake cylinder, D, and main reservoir A¹ on or near the locomotive, substantially as and for the uses set forth.",
    ),
    claim(
      2,
      "The combination of the pipes B B¹ B² B³ b b¹ with a suitable arrangement of ports for admitting air to the auxiliary reservoir D and brake-cylinder C, substantially as and for the uses set forth.",
    ),
    claim(
      3,
      "The cock d¹ having ports a a¹, and arranged relatively to the air-reservoir D, brake-cylinder C, and pipes B B¹, substantially as described.",
    ),
    claim(
      4,
      "A cock, e, arranged in an air-brake pipe, with a suitable arrangement of ports inside and an automatically-operating connection outside, whereby, in case of accident, a free communication will be opened from an auxiliary reservoir, C, to a brake-cylinder, D, and external communication be closed, substantially as set forth.",
    ),
    claim(
      5,
      "In combination with a pair of air-brake pipes, B B¹, a signaling apparatus consisting essentially of an alarm or index guage, or both, on or near the engineer's cab, a pipe connection on or in one or more of the cars, from one pipe, B, to the other, B¹, and like means in connection therewith for regulating or fixing the alarm to be given, substantially as set forth.",
    ),
    p("In testimony whereof I, the said GEORGE WESTINGHOUSE, Jr., have hereunto set my hand."),
    p("GEO. WESTINGHOUSE, JR."),
    p("Witnesses: JOHN H. JOHNSON. G. H. CHRISTY."),
  ],
};

export const westinghouseAirBrakeParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The source labels the formal description that follows. It is not a separate technical section.",
  ],
  3: [
    "This standard notice introduces the patent as a document addressed to any person concerned with the claimed apparatus.",
  ],
  4: [
    "Westinghouse identifies himself and says that the drawing is part of the specification. The document uses the contemporary spelling Pittsburg and makes no filing-date statement.",
  ],
  5: [
    "Figure 1 shows the underside of a car and its piping. Figure 2 relates the pipes to the main reservoir, and Figure 3 shows the signalling arrangement. Figure 4 enlarges the pressure-gauge index; Figures 5 and 6 enlarge the trip mechanism that changes a cock's position.",
  ],
  6: [
    "The same letter means the same part in all six figures. That convention is important because the claims name several pipes, cocks, and reservoirs by their figure labels.",
  ],
  7: [
    "Westinghouse begins from a single-pipe brake system. A break in that one pipe leaves every brake cylinder behind the break without the locomotive's compressed-air supply. His broader arrangement uses two brake pipes that the engineer can use together or separately.",
  ],
  8: [
    "The source lists five functions: a reservoir on each car; ported cocks that direct the two pipes to the reservoir and brake cylinder; a cock that can assign either pipe to either job; automatic application after a disconnection; and signals passed between conductor and engineer through the pipes and compressed air.",
  ],
  9: [
    "Westinghouse distinguishes features he says belong to a separate application. This specification claims only the stated means or their substantial equivalents, not every function mentioned in the overview.",
  ],
  10: ["He now moves from the objectives to the physical construction and operating sequence."],
  11: [
    "Two brake pipes run under every car and couple to the next car. C is the brake cylinder; D is an air receiver mounted beneath the car. The source says D should ordinarily be somewhat larger than C and capable of about one hundred pounds per square inch. It may be an auxiliary to the locomotive reservoir or a separate reservoir on each car, with a compressor and a controllable passage to the brake cylinder.",
  ],
  12: [
    "Westinghouse's preferred use makes D auxiliary to the locomotive's main reservoir. B is the ordinary operating pipe and B-prime stays charged as a reservoir pipe. A cross-pipe joins them; branches lead one way to C and the other to D. The ported cock d-prime selects which long pipe connects to which branch, and a quarter turn can reverse those duties.",
  ],
  13: [
    "The quarter-turn capability changes the pipe assignments without changing the system's underlying operation. More importantly, Westinghouse says the stored air in the reservoir pipe and car reservoir will apply the brakes automatically if a car leaves the track or is uncoupled.",
  ],
  14: [
    "Cross-pipes at the car ends form a loop between the two long brake pipes. During ordinary running, the three-way cocks leave the loop open. A coupling failure or derailment shifts a cock to close through communication and reroute stored compressed air through the operating path to brake cylinder C.",
  ],
  15: [
    "The first trip mechanism is mechanical. A spring-loaded crank arm normally holds the cock open. A low tripping stem clears the ground on the track but strikes ground, rail, or ties if the car derails; that motion releases the catch and lets the arm shift the cock.",
  ],
  16: [
    "The second trigger responds to a broken coupling while the car remains on the rails. A cord or chain attached beyond normal slack pulls the handle when the couplings part and the slack hose straightens. The source also permits other automatic cock-shifting devices; its claim is not confined to the illustrated cord and trip stem.",
  ],
  17: [
    "The same compressed-air system also carries coded signals. Pressure gauges on the main reservoir and both brake pipes work with nearby alarm whistles. Their indexed graduations correspond to agreed messages such as a flag station, orders, slow, danger, or stop. A conductor opens a keyed car cock long enough to create the selected pressure indication at the engineer's gauge; the operation can be reversed for messages in the other direction.",
  ],
  18: [
    "Westinghouse leaves the detailed gauge-port construction to a skilled mechanic once the signalling function is known. If one pipe permanently serves as the reservoir pipe and the other as the operating pipe, he says only one of the two pipe gauges is needed, located on the operating pipe.",
  ],
  19: [
    "Opening the conductor's cock fully in an emergency both signals the engineer and sends reservoir-pipe air into the operating pipe, applying the brakes. If only one order need be transmitted, the gauges can be omitted and the whistle alone can communicate it.",
  ],
  20: [
    "The numbered claims now define the five combinations for which Westinghouse seeks legal protection.",
  ],
  26: ["Westinghouse signs the instrument after the five claims."],
  27: ["The printed signature uses the form GEO. WESTINGHOUSE, JR."],
  28: ["John H. Johnson and G. H. Christy are the witnesses to execution."],
};

/** Patent-card data corrected against the same pinned four-sheet facsimile. */
export const westinghouseAirBrakeRecordCorrections: Pick<
  Patent,
  "plainEnglishExplanation" | "claims" | "drawings" | "historicalContext" | "tags" | "stats"
> = {
  plainEnglishExplanation: {
    overview:
      "US 124,404 is not the later triple-valve automatic brake. It is a 1872 arrangement of two brake pipes, a local air receiver on each car, ported cocks that choose how the pipes charge and operate the system, an automatic cock-shifting mechanism for a derailment or broken coupling, and a signalling system that uses pipe pressure and whistles.",
    coreMechanism:
      "One pipe can act as the ordinary operating line to the brake cylinder while the other remains charged as a reservoir line. On each car, branches from the paired pipes lead to the brake cylinder and an auxiliary receiver. A ported cock assigns those connections. If a coupling parts or a car leaves the track, the described trigger moves a three-way cock: it closes ordinary through communication and reroutes compressed air stored in the reservoir pipe and receiver to the brake cylinder. The same paired pipes can also carry coded pressure changes between conductor and engineer.",
    mechanicalBreakdown: [
      {
        title: "Paired brake pipes and car receiver",
        summary:
          "Two pipes run along every car; an air receiver D beneath the car can store compressed air beside brake cylinder C.",
        technicalDetails:
          "Westinghouse permits either long pipe to be the reservoir pipe or the operating pipe. The source specifies that the receiver is ordinarily somewhat larger than the brake cylinder and capable of about one hundred pounds per square inch. It can be charged from the locomotive system or, in the alternative arrangement, by a local compressor.",
        archaicTerm: "air-receiver",
        modernEquivalent: "Auxiliary compressed-air reservoir",
      },
      {
        title: "Ported selecting cock",
        summary:
          "Cock d-prime connects the paired long pipes to the branches for the brake cylinder and auxiliary reservoir.",
        technicalDetails:
          "Its two non-communicating ports establish one pairing in one position and the reversed pairing after a quarter turn. This is a routing valve in the literal mechanical sense: its job is to assign which long pipe charges D and which operates C.",
        archaicTerm: "cock with suitable ports",
        modernEquivalent: "Manually positioned ported pneumatic valve",
      },
      {
        title: "Automatic tripping cock",
        summary:
          "A three-way cock changes the air path after a derailment or a separated coupling.",
        technicalDetails:
          "For a derailment, a low tripping stem can strike the ground, rail, or tie and release a spring-loaded arm. For a broken coupling, a cord or chain pulls the handle once normal slack is exhausted. In either case the source says the shifted cock sends stored air around to brake cylinder C.",
        archaicTerm: "tripping-head or lever",
        modernEquivalent: "Mechanical derailment and separation trigger",
      },
      {
        title: "Pressure-index signalling",
        summary:
          "Gauges, whistles, and keyed pipe connections use selected pressure steps as a train communication channel.",
        technicalDetails:
          "A conductor opens the car cock until the gauge reaches the agreed graduation for an order, then closes it. The engineer's gauge moves to the same graduation and its whistle draws attention. The source expressly allows the same arrangement to work in reverse and permits a whistle-only single-order version.",
        archaicTerm: "gauge-index",
        modernEquivalent: "Coded pneumatic pressure indicator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Stored pneumatic energy and clamping work",
        formula:
          "F_{\\text{clamp}} = \\eta_{\\text{rigging}} \\cdot P_{\\text{cyl}} \\cdot \\left(\\frac{\\pi D^2}{4}\\right)",
        explanation:
          "The air receiver stores compressed air locally. A changed valve path can release that stored pressure into a brake cylinder, so braking does not depend solely on an uninterrupted direct supply from the locomotive.",
      },
      {
        principle: "Fail-safe mechanical triggering",
        formula: "F_{\\text{trip}} \\ge k_{\\text{spring}} \\Delta x_{\\text{sear}} + \\mu F_N",
        explanation:
          "The automatic function derives from a physical change in the train: a low stem meeting track hardware after a derailment, or a cord pulled taut by a separated coupling. Both move the cock that changes the pneumatic path.",
      },
      {
        principle: "Pressure-coded communication",
        formula:
          "\\Delta P = \\frac{\\rho_{\\text{air}} v_{\\text{flow}}^2}{2} + \\Delta h_{\\text{index}} \\cdot S_{\\text{gauge}}",
        explanation:
          "The signalling feature treats gauge positions as a finite code. A controlled pressure change moves an index to a designated graduation, and a whistle tells the remote operator to read that position.",
      },
    ],
    whyItMattersToday:
      "The patent shows a formative stage in railway pneumatic control: stored energy on the cars, reconfigurable pipe paths, automatic action after an accident, and an information channel carried by the same compressed-air infrastructure. Those are more specific and historically useful ideas than the later triple-valve story previously attached to this record.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An air-reservoir arranged on each separate car in combination with an air-brake cylinder, D, and main reservoir A¹ on or near the locomotive, substantially as and for the uses set forth.",
      plainEnglish:
        "Claims a local receiver on each car combined with an air-brake cylinder and the locomotive's main reservoir. It makes the per-car stored-air arrangement part of the protected system.",
      keyInnovations: ["Per-car air reservoir", "Air-brake cylinder", "Locomotive main reservoir"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The combination of the pipes B B¹ B² B³ b b¹ with a suitable arrangement of ports for admitting air to the auxiliary reservoir D and brake-cylinder C, substantially as and for the uses set forth.",
      plainEnglish:
        "Claims the named long, cross, and branch pipes together with the port arrangement that routes air to receiver D and brake cylinder C.",
      keyInnovations: [
        "Paired long brake pipes",
        "Cross-pipes",
        "Branches to reservoir and cylinder",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The cock d¹ having ports a a¹, and arranged relatively to the air-reservoir D, brake-cylinder C, and pipes B B¹, substantially as described.",
      plainEnglish:
        "Claims the specific selecting cock and its two ports in relation to the local receiver, brake cylinder, and the two main pipes.",
      keyInnovations: [
        "Ported selecting cock",
        "Reservoir/cylinder routing",
        "Interchangeable pipe duties",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "A cock, e, arranged in an air-brake pipe, with a suitable arrangement of ports inside and an automatically-operating connection outside, whereby, in case of accident, a free communication will be opened from an auxiliary reservoir, C, to a brake-cylinder, D, and external communication be closed, substantially as set forth.",
      plainEnglish:
        "Claims the accident-operated cock, including its internal ports and external trigger. The source's printed claim labels the auxiliary reservoir C and brake cylinder D even though the descriptive text identifies C as the cylinder and D as the receiver; the edition preserves that printed wording rather than silently correcting it.",
      keyInnovations: [
        "Accident-operated cock",
        "External mechanical trigger",
        "Automatic air-path change",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "In combination with a pair of air-brake pipes, B B¹, a signaling apparatus consisting essentially of an alarm or index guage, or both, on or near the engineer's cab, a pipe connection on or in one or more of the cars, from one pipe, B, to the other, B¹, and like means in connection therewith for regulating or fixing the alarm to be given, substantially as set forth.",
      plainEnglish:
        "Claims the two-pipe signalling arrangement: an engineer-side alarm or index gauge, a car-side connection from one pipe to the other, and a way to choose the particular alarm. “Guage” is the spelling printed in the claim.",
      keyInnovations: [
        "Pneumatic signalling",
        "Engineer-side gauge or alarm",
        "Car-side coded pressure connection",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Inverted car-body piping layout",
      caption:
        "The source sheet's underside view of car A with brake pipes, receiver D, cylinder C, and the automatic cock arrangements.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-1",
          figureRef: "Fig. 1",
          label: "B / B¹",
          element: "Paired brake-pipes",
          description: "The two long pneumatic lines running from end to end beneath the car.",
          x: 52,
          y: 27,
        },
        {
          id: "wb-2",
          figureRef: "Fig. 1",
          label: "C",
          element: "Brake-cylinder",
          description: "The cylinder identified as C in the descriptive specification.",
          x: 38,
          y: 46,
        },
        {
          id: "wb-3",
          figureRef: "Fig. 1",
          label: "D",
          element: "Air-receiver",
          description: "The local reservoir attached beneath the car.",
          x: 63,
          y: 46,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Brake-pipe and main-reservoir arrangement",
      caption:
        "The source drawing relates the two pipes to the locomotive main reservoir and gauges.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-4",
          figureRef: "Fig. 2",
          label: "A¹",
          element: "Main reservoir",
          description: "The locomotive reservoir to which the train piping connects.",
          x: 50,
          y: 49,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Car signalling arrangement",
      caption:
        "The source sheet's car-end view showing the gauge and pipe connection used for signalling.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-5",
          figureRef: "Fig. 3",
          label: "g²",
          element: "Car gauge",
          description: "The pressure gauge used by the conductor to send an indicated order.",
          x: 50,
          y: 16,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Gauge-index",
      caption: "The source sheet's enlarged graduated index for coded pressure signals.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-6",
          figureRef: "Fig. 4",
          label: "2 / 3",
          element: "Graduated index",
          description: "The positions used as agreed pressure-code messages.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Trip mechanism detail",
      caption: "One enlarged source view of the apparatus that shifts a cock after an accident.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-7",
          figureRef: "Fig. 5",
          label: "i¹",
          element: "Tripping stem",
          description: "The low stem intended to engage ground, rail, or ties after a derailment.",
          x: 32,
          y: 56,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Cock and spring trip detail",
      caption:
        "The source sheet's enlarged view of cock e, its shifting handle, and the spring-loaded catch arrangement.",
      svgType: "westinghouse-air-brake",
      callouts: [
        {
          id: "wb-8",
          figureRef: "Fig. 6",
          label: "e³",
          element: "Shifting handle",
          description: "The handle pulled by the separation cord or moved by the released arm.",
          x: 42,
          y: 48,
        },
        {
          id: "wb-9",
          figureRef: "Fig. 6",
          label: "m",
          element: "Crank-arm",
          description: "The spring-loaded arm that shifts the cock when its catch is released.",
          x: 25,
          y: 71,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A one-pipe air brake loses its direct locomotive supply to every rear car after a break in that pipe. Westinghouse's source identifies that failure and also seeks a way to cause braking when a car derails or a coupling parts.",
    priorArtLimitations: [
      "A single broken pipe leaves the rear part of a train without the stated braking supply.",
      "A direct locomotive-to-cylinder arrangement lacks the local receiver and alternative routing described here.",
      "Train crews need a way to transmit selected orders between conductor and engineer without a separate communication line.",
    ],
    breakthroughInsight:
      "The patent combines local stored air, two selectable pipe paths, automatically shifted cocks, and an indexed signalling channel. The same air network therefore supplies brake force, responds to certain accidents, and carries coded orders.",
    patentWars: [],
    civilizationalImpact:
      "This early railway-pneumatics document records the move from a direct single-line brake supply toward distributed reservoirs, automatic accident responses, and train-wide control infrastructure.",
    aftermath:
      "Westinghouse continued to develop railway air-brake systems. This record should be read for its specific double-pipe, cock, and signal arrangements rather than as the later triple-valve patent.",
  },
  tags: ["George Westinghouse", "Air Brake", "Railroad Safety", "Pneumatics", "Railway Signalling"],
  stats: { totalClaims: 5, independentClaims: 5 },
};
