import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const figure = (label: "Figure 1" | "Fig. 1" | "Fig. 2" | "Fig. 3"): CuratedSpecificationInline => {
  const number = label.at(-1);

  return {
    kind: "reference",
    text: label,
    href: `#fig-${number}`,
    referenceType: "figure",
    label: `Open the source-faithful ${label} crop from US 31,128`,
    figurePreviews: [
      {
        src: `/patents/figures/us-31128-otis-elevator/figure-${number}-oriented-cw.png`,
        alt:
          number === "1"
            ? "Figure 1 from US 31,128: vertical section of the hoisting apparatus."
            : number === "2"
              ? "Figure 2 from US 31,128: front view of the hoisting apparatus."
              : "Figure 3 from US 31,128: detached side view of the stop mechanism.",
        width: number === "1" ? 1050 : number === "2" ? 1400 : 360,
        height: 1750,
      },
    ],
  };
};

/**
 * Manual, continuous edition of the three-sheet US 31,128 facsimile.
 * Each reference, term, claim, signature, and drawing description was chosen
 * against the pinned PDF; no source text layer is rendered here.
 */
export const otisElevatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "c35eb5c999bc20b015ef0d24a3ffb0f194123d780c8a46fabea7f2d52a355d42",
  preparedBy: "CopperLotus, manual facsimile review",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "E. G. OTIS, OF YONKERS, NEW YORK.",
        "IMPROVEMENT IN HOISTING APPARATUS.",
        "Specification forming part of Letters Patent No. 31,128, dated January 15, 1861.",
      ],
    },
    { kind: "paragraph", inlines: [{ kind: "emphasis", text: "To all whom it may concern:" }] },
    {
      kind: "paragraph",
      inlines: text(
        "Be it known that I, E. G. OTIS, of Yonkers, in the county of Westchester and State of New York, have invented a new and Improved Hoisting Apparatus; and I do hereby declare that the following is a full, clear, and exact description of the same, reference being had to the annexed drawings, making a part of this specification, in which—",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        figure("Figure 1"),
        { kind: "text", text: " is a vertical section of my invention, taken in the line x x, " },
        figure("Fig. 2"),
        { kind: "text", text: "; " },
        figure("Fig. 2"),
        { kind: "text", text: ", a front view of the same; " },
        figure("Fig. 3"),
        { kind: "text", text: ", a detached side view of the stop mechanism." },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "Similar letters of reference indicate corresponding parts in the several figures.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The object of this invention is to obtain a hoisting apparatus which may have its weight or load stopped at any desired point and a brake automatically and simultaneously applied with the stopping of the load or weight. The invention also has for its object the sustaining of the load or weight in case of the breaking of the lifting-rope in such a way as to insure a certain effectual action or operation of the load-sustaining mechanism.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "To enable those skilled in the art to fully understand and construct my invention, I will proceed to describe it.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "A represents a base or platform, to which two uprights B B are secured, said uprights having each a rack C at its inner side. These racks C have teeth of hook form, or the teeth may be described as having an inclination upward, as shown clearly in ",
        },
        figure("Fig. 2"),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Between the uprights B B a platform D is placed, the platform being secured to two uprights a a, which are grooved vertically to receive the racks C C. To each upright a a a bent lever E is attached by a fulcrum-pin b, and the inner ends of the levers E E overlap each other and are fitted in an eye c at the lower end of a vertical bar F, which passes loosely through a rail or bar d, that connects the upper ends of the uprights a a. To the lower end of the bar F a ",
        },
        {
          kind: "term",
          text: "spring e",
          definition:
            "The spring connected to the vertical bar F; it biases the safety pawls toward engagement with the racks.",
          label: "Safety-spring designation",
        },
        {
          kind: "text",
          text: " is attached, said spring having a tendency to keep the pawls f, which are attached to the lower ends of the levers E E, in gear with the racks C C.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "This will be fully understood by referring to " },
        figure("Fig. 2"),
        {
          kind: "text",
          text: ", in which it will be seen that the pawls f are connected to the ends of the levers E by pivots, and have springs g attached, which springs have a tendency to keep the pawls pressed down into or between the teeth of the racks C. The pawls, it will be seen, fit or work in mortises h in the uprights a a.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "To the upper end of the bar F there is a rope G attached. This rope G passes over pulleys i i, and extending down is attached to a drum H, which is connected by gearing j k to a shaft I, having two idle-pulleys J K upon it and a working-pulley L between them. The drum H and shaft I have their bearings attached to suitable uprights M M, and between these uprights there is placed a drum N, around which and the idle-pulleys J K belts O P pass, one of which P is a cross-belt.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "To the drum H a rope Q is attached. This rope winds on drum H in a contrary direction to the rope G, which is connected with the platform D. The rope Q passes upward over a pulley l and has a weight R attached to it, said weight serving as a counterpoise for the platform D.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The belts O P pass through eyes m, attached to the slide S, which forms a ",
        },
        {
          kind: "term",
          text: "belt-shipper",
          definition:
            "A sliding guide that moves a belt between an idle pulley and a driving pulley.",
          label: "Power-transmission term",
        },
        {
          kind: "text",
          text: ". This slide is fitted in suitable guides n n and has a rack o at one end, into which a pinion p gears. The pinion p is on a shaft q, which has a drum r placed on it, around which a rope T passes, said rope being secured to the drum r and wound around it in opposite directions. The rope T also passes over pulleys s s and down around a pulley t near the base A.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "To the portion of the rope T between the pulleys s s and t a rope U is attached by a branched end V, each part u of which is attached to a side of the rope T, as shown clearly in ",
        },
        figure("Fig. 3"),
        {
          kind: "text",
          text: ". To the slide or belt-shipper S there is attached an arm W, the lower end of which is attached by a pivot to a bar X. This bar X is attached by a pivot v to one of the uprights M, and the bar X is provided with a pendent projection x, which bears on a bar Y, one end of which is attached by a pivot to one of the uprights M and the opposite end fitted in a guide a′ on one of the uprights. To the bar Y at about its center a shoe Z is attached, which, when the bar Y is pressed downward, bears upon the working-pulley L.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "The operation, which will be readily seen, is as follows: When the drum N is turned in the direction of the arrow and the belt P on the working-pulley L, the rope G will be wound on the drum H and the platform D elevated, and in order to lower the platform the cross-belt P is moved on the working-pulley L, the belt O being moved on the idle-pulley J. The shifting of these belts is effected by actuating the rope T by hand, the movement of which turns the drum r so that the pinion p will, in consequence of gearing into the rack o, move the slide S.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The rope U forms the stop, and when pulled down both parts u u of the branched end V of the rope U have their upper ends brought in the same horizontal plane, and the slide S will be so actuated that the belt O will be on the idle-pulley J and belt P on the idle-pulley K, the shoe Z being at the same time pressed down on the working-pulley L and serving as a brake. The branched end V of the rope U, it will be seen, actuates the rope T when the machine is in operation, but will have no effect on said rope when the brake is applied, as the upper ends of both parts u u of the end V will be in a horizontal line with each other.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In order to raise the platform D, the rope T is moved by hand so as to throw the belt O on the working-pulley L, the shoe Z being simultaneously raised, and in order to reverse the movement of the platform D and allow it to descend, the rope T is moved so as to shift the cross-belt P on the working-pulley L.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In case the rope G should break in hoisting the loaded platform D, the pawls f f, in consequence of being released from the pull of said rope, will immediately be thrown in connection with the racks C C by the springs e g g, and in consequence of the teeth of the racks being of hook form or pointed upward the pawls f f, under the weight of the load on the platform, will have a tendency to draw the uprights B B toward each other instead of forcing them apart, and the pawls lock themselves with the racks, so that casual disengagement is impossible. By having the counterpoise R attached to the drum H instead of to the platform D the platform or load-sustaining mechanism is not at all interfered with, as would be the case were the rope Q attached directly to the cross-piece d.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "To one of the uprights a a an arm aˣ is attached, said arm having an eye at its outer end, through which the rope T passes, and said rope has a knot or projection bˣ on it, against which the arm aˣ acts when the platform reaches its lowest point of descent, and thereby throws the belt O off the working-pulley L and stops the descent of the platform, while the brake Z is simultaneously applied.",
      ),
    },
    { kind: "heading", level: 2, text: "Claims" },
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
        "Having the pawls f f and the teeth of the racks C C hook-formed, essentially as shown, so that the weight of the platform will, in case of the breaking of the rope G, cause the pawls and teeth to lock together and prevent the contingency of a separation of the same, as herein set forth.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: text(
        "The arrangement of the ropes T, U, and V, combined and operating substantially as and for the purpose set forth.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: text(
        "The arrangement of the slide or belt-shipper S with the shoe or brake Z and rope T, substantially as shown, to admit of the simultaneous application of the brake and the shifting of the belts O P on the idle-pulleys J K, as set forth.",
      ),
    },
    {
      kind: "claim",
      number: 4,
      inlines: text(
        "Attaching the rope Q of the counterpoise R to the drum H on the opposite side from the lifting-rope G, substantially as shown, so as to counterpoise the platform D without preventing or interfering with the action of the safety mechanism E e f.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "E. G. OTIS." }] },
    { kind: "paragraph", inlines: text("Witnesses: M. M. LIVINGSTON, G. H. REED.") },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 1",
      title: "Vertical section",
      description: text(
        "Source-faithful crop from drawing sheet 1: a vertical section of the complete hoisting apparatus, taken on line x x of Figure 2.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 2",
      title: "Front view",
      description: text(
        "Source-faithful crop from drawing sheet 1: front view of the apparatus, including the platform, racks, pawls, winding gear, belts, and brake linkage.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "Fig. 3",
      title: "Detached stop mechanism",
      description: text(
        "Source-faithful crop from drawing sheet 1: detached side view of the stop mechanism that brings the branched rope end into a horizontal, non-actuating position when the brake is applied.",
      ),
    },
  ],
};
