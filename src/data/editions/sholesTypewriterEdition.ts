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

const sourceSheet = (sourcePdfPage: 1 | 2, label: string) => ({
  src: `/patents/figures/us-79265-sholes-typewriter/source-sheet-${sourcePdfPage}-v1.png`,
  alt: `Full source-facsimile drawing sheet ${sourcePdfPage} of 2, containing ${label}, from US 79,265.`,
  width: 2320,
  height: 3408,
});

const FIGURES = {
  "Fig. 1": sourceSheet(1, "Fig. 1"),
  "Fig. 2": sourceSheet(1, "Fig. 2"),
  "Fig. 3": sourceSheet(1, "Fig. 3"),
  "Fig. 4": sourceSheet(2, "Fig. 4"),
  "Fig. 5": sourceSheet(2, "Fig. 5"),
  "Fig. 6": sourceSheet(2, "Fig. 6"),
  "Fig. 7": sourceSheet(2, "Fig. 7"),
  "Fig. 8": sourceSheet(2, "Fig. 8"),
  "Fig. 9": sourceSheet(1, "Fig. 9"),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile sheet containing ${label} in US 79,265`,
  figurePreviews: [FIGURES[label]],
});

const figures = (
  labels: readonly (keyof typeof FIGURES)[],
  sourceText: string,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile sheets containing ${sourceText} in US 79,265`,
  figurePreviews: labels.map((label) => FIGURES[label]),
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * Continuous, manually prepared reading edition of the six-page US 79,265
 * facsimile. The two direct source drawing sheets carry each printed-figure
 * preview; the explanatory prose is deliberately continuous rather than tied
 * to source scan-page boundaries.
 */
export const sholesTypewriterArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "C. LATHAM SHOLES, CARLOS GLIDDEN, AND SAMUEL W. SOULE, OF MILWAUKEE, WISCONSIN.",
        "IMPROVEMENT IN TYPE-WRITING MACHINES.",
        "Specification forming part of Letters Patent No. 79,265, dated June 23, 1868.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1–9",
      title: "Type-writing machine, detached parts, section, rear elevation, and spool detail",
      description: [
        { kind: "text", text: "The pinned drawing sheets contain " },
        figures(
          ["Fig. 1", "Fig. 2", "Fig. 3", "Fig. 4", "Fig. 5", "Fig. 6", "Fig. 9"],
          "Figs. 1–6 and 9",
        ),
        { kind: "text", text: ", plus " },
        figure("Fig. 7"),
        { kind: "text", text: " and " },
        figure("Fig. 8"),
        {
          kind: "text",
          text: ". Every preview is the complete source sheet containing the cited figure.",
        },
      ],
    },
    paragraph(text("To all whom it may concern:")),
    paragraph(
      text(
        "Be it known that we, C. LATHAM SHOLES, CARLOS GLIDDEN, and SAMUEL W. SOULE, of the city of Milwaukee, and county of Milwaukee, and State of Wisconsin, have invented new and useful Improvements in Type-Writing Machines; and we do hereby declare that the following is a full, clear, and exact description of the invention, which will enable those skilled in the art to make and use the same, reference being had to the accompanying drawings, forming part of this specification, in which—",
      ),
    ),
    paragraph([
      figure("Fig. 1", "Figure 1"),
      { kind: "text", text: " is a perspective view of the machine; " },
      figures(
        ["Fig. 2", "Fig. 3", "Fig. 4", "Fig. 5", "Fig. 6", "Fig. 9"],
        "Figs. 2, 3, 4, 5, 6, and 9",
      ),
      { kind: "text", text: ", views of detached parts thereof; " },
      figure("Fig. 7"),
      { kind: "text", text: ", a view of a longitudinal vertical section thereof, and " },
      figure("Fig. 8"),
      { kind: "text", text: " a view of the rear elevation of the same." },
    ]),
    paragraph(
      text(
        "This invention is of improvements to an invention of a type-writing machine, an application for a patent for which we filed October 11, 1867. Its features are a better way of working the type-bars, of holding the paper on the carriage, of moving and regulating the movement of the carriage, of holding, applying, and moving the inking-ribbon, a self-adjusting platen, and a rest or cushion for the type-bars to follow.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Make a case A, about two feet square, four to six inches deep, or of any requisite dimensions, of material and finish to one's taste, with the lid or cover A′ hinged to the back board A² by hinges f, as shown in ",
      },
      figures(["Fig. 7", "Fig. 8"], "Figs. 7 and 8"),
      { kind: "text", text: ". In the cover cut a circle, as shown in " },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ". Make a circular annular disk B, of any hard tough material (we use and prefer brass) four to five inches in diameter, or any required size, with a circle or hole in the center, one to one and a half or more inches in diameter, with the outer edge or periphery one-half to three-fourths of an inch or more thick, and the inner edge or circumference of the central circle two-eighths to three-eighths of an inch or more thick, with the top side planed level and smooth and the bottom side beveled, if preferred, from the outer to the inner edge with as many radial slots or grooves as types to be used cut in the bottom side from the central circle to the periphery, and deep to within an eighth of an inch of the top, less or more, with slots in the outer edge or periphery one-half to three-fourths of an inch or more deep toward the central circle to meet and fit exactly the radial grooves, and with a groove for pivot-wire cut in and circumscribing the periphery, as shown in ",
      },
      figures(["Fig. 1", "Fig. 5"], "Figs. 1 and 5"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Of any suitable material (we use and prefer steel) make as many type-bars or hammers O as types to be used or slots in the disk. Pivot the outer ends of the type-bars in the slots in the outer edge by a wire laid in the groove in the periphery circumscribing the disk. On the upper sides of the inner ends of the type-bars cut in relief the types to be used. Make all the type-bars of the exact length of the radius of the circle of the disk, so each type on the inner ends, when thrown up into the radial grooves, will strike against the central point. (See ",
      },
      figures(["Fig. 1", "Fig. 5", "Fig. 7"], "Figs. 1, 5, and 7"),
      {
        kind: "text",
        text: ".) Fasten the disk thus combined with the type-bars in the circle in the cover of the case, as shown in ",
      },
      figures(["Fig. 1", "Fig. 7"], "Figs. 1 and 7"),
      {
        kind: "text",
        text: ", by any convenient means not interfering with the working of the type-bars. (We set it on wire posts fastened to the bottom of the case.) In the case, on a suitable frame, put a key-board similar to the key-board of a piano, having as many keys L, plus one, as types to be used, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", each key reaching from the front in under or opposite the type-bars and pivoted to or vibrating on the fulcrum or beam M, as shown in ",
      },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ". On the inner end of each key, excepting the space-key, fasten a finger w, made in any convenient way, (we use a stiff wire,) or bend the inner ends of the keys so the fingers will be part of the keys to reach the corresponding type-bar, so that when the front end of the key is pressed down it will strike and throw the type-bar up into its radial groove and its type-end against the central point, as shown in ",
      },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ". The ends of the fingers will thus be in a circle corresponding to the circle of the disk and type-bars. Within and below the circle of the fingers and type-bars set a ",
      },
      term(
        "cushion or rest q",
        "A stop below the type-bars that receives them after each return stroke.",
      ),
      {
        kind: "text",
        text: ", of any material for the type-bars to fall back and rest on after having been thrown up against the central point, as shown in ",
      },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ". Over the central point of the inner circle of the disk suspend a solid anvil or post O′ in any firm manner, as by the arm D, fastened to the edge of the case and reaching out to the anvil, as shown in ",
      },
      figures(["Fig. 1", "Fig. 7"], "Figs. 1 and 7"),
      { kind: "text", text: ". In the bottom of the anvil make a " },
      term(
        "spherical cavity or bowl",
        "A socket with a curved inner surface, allowing a mating curved platen end to pivot in more than one direction.",
      ),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Make a platen G of any hard smooth substance (we use metal) with the bottom or face finished smooth and level and with the top spherical to fit the bowl in the bottom of the anvil. Fit and attach the spherical end of the platen in and to the bowl of the anvil, thus making of the connection a universal joint, and making the platen self-adjustable. (See ",
      },
      figures(["Fig. 1", "Fig. 7"], "Figs. 1 and 7"),
      {
        kind: "text",
        text: ".) Hang the platen as near the plane of the surface of the cover of the case as will just admit the paper to be written on and the carbonized paper or inking-ribbon to pass easily under the platen and over the disk and case. This adjustable platen insures the types meeting the paper evenly and squarely, and giving a full and fair impression thereof when thrown against the paper.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Make an open frame C, C′, and C² with the bars C′ and C² as arms to the main bar C, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", the arms projecting at a right angle to the main bar. Extend the arm C so that when the main bar C is laid flush and even with the front edge of the main part of the cover of the case it will reach entirely across to the back of the case and project so that the cord v may be attached to the open end, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ". To the front edge of the bar C attach a cleat S, to jut down against the edge of the cover of the case, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ". On the front edge of the top of the cover lay a rail, and on the under side of the bar C at each end, in the corner next to the cleat S, pivot a small flange-wheel to roll on the rail and enable the frame to move easily from right to left and back, or attach the ears g to the edge of the cover or table, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", (two, next the keys, not being seen in the drawings because of the cleat S,) and under the cleat S fasten two rings to serve as guides. To the ears g attach rods c, extending from the ears seen in the drawing to the ears unseen next the keys and through the guides. This will enable the frame to slide easily from right to left and back, and be a guide to keep it always in place.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "To and in the frame C, C′, and C² attach another open frame E, E′, and E², as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", with the bar E opposite and parallel to the bar C, and the bars E′ and E² parallel with the bars C′ and C². To the bars C′ and C² attach springs b on a line through the center of the platen, parallel to the bar C, to press down on the bars E′ and E². Arrange the frame E, E′, and E² to slide to and from the bar C, the bars E′ and E² along the bars C′ and C², either by slots or grooves in the inner edges of the bars C′ and C², and tongues on the outer edges of the bars E′ and E² to fit and work therein, or by clasps on the bars E′ and E², reaching over and around the bars C′ and C², and fitted so as to slide readily, or by any other obvious device. At the ends of the bars E′ and E², where they join the bar E, fasten two limber, thin, flat wire springs a, as long as the bars E′ and E², so that in sliding the frame E, E′, and E² to and from the bar C the springs a will be pressed close to the bars E′ and E² at every point in their length as they pass down and under the springs b, attached to the bars C′ and C². Rabbet the bars E, E′, and E² at their inner edges, so they may be as thin as practicable, and form a ",
      },
      term("chase or bed", "The recessed support in which the paper lies on the moving frame."),
      {
        kind: "text",
        text: " for the paper to lie in. This combination of devices forms a simple and practicable paper-carriage, the larger and primary frame C, C′, and C², movable to and from in one direction—say east and west—carrying the smaller and secondary frame E, E′, and E² with it, and the latter frame movable in the transverse direction to and from north and south, while the former is stationary, thus furnishing a movement in one direction for a line of words and in the opposite direction for a series of lines.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "On the edge of the cover of the case at the right of the paper-carriage attach the bar F, laid on stops or shoulders, so that the underside of the bar will be one-half inch or more above the table or cover of the case. In this bar set a series of pins e, running down into the table, so as to be fast and firm at regular and equal distances apart, the distance desired for the space (including the line) from one line of writing to another, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ". From the right-hand edge of the bar E′ of the paper-carriage project a lip out, under the bar C′ or from the clasp attached to E′ and around C′, and on this lip pivot a pawl h, with a sharp incline on the side toward the front of the case running to a point, so arranged with a stop that it cannot be turned on the pivot in the direction of the back of the case, but readily turned in the opposite direction and held in position by a yielding-spring l, all as shown in ",
      },
      figures(["Fig. 1", "Fig. 3"], "Figs. 1 and 3"),
      {
        kind: "text",
        text: ". By moving the carriage to the right side of the case the point of the pawl h will just pass a pin e on the side from the front of the case. The incline of the pawl on the side next the pin being equal to the distance from one pin to another, and the pawl not being turnable on its pivot in the direction from the front to the back of the case, the frame E, E′, and E², with the paper, when on it, necessarily will be moved the proper distance from one line of writing to another.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Attach to the right-hand corner of the carriage-frame a cord a′ and run it lengthwise of the bar under the bar C in a groove in the bar or table for that purpose, or it may be close to and inside of the bar, over a pulley e′, fitted in and below the top surface of the table, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", and fasten to the other end of it a weight under the case, but unseen in the drawings. To the other end of the bar C fasten a cord v, and run it down over a large pulley R on the back side of the case A², and to the other end of the cord hang the weight W, as shown in ",
      },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ". These cords v and a′, attached one to each corner of the carriage on one side, running over the pulleys R and e′ and fastened to the weight W and the weight W′ (unseen in the drawings) are the force and means of moving the carriage and paper while writing.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Under the table or cover of the case, behind the beam or fulcrum M, between the fulcrum and the disk a suitable distance, on and across all the keys, lay a bar T, with the ends bent at a right angle and extended and pivoted to the frame below and in front of the fulcrum, as shown at s in ",
      },
      figure("Fig. 7"),
      {
        kind: "text",
        text: ", so that when the front ends of the keys are pressed down the rear ends will strike against and raise the bar an extent in proportion to the distance from the fulcrum. Connect a lever H to the middle of the bar T, midway of the key-board, extending directly over and parallel with and between the middle keys, and pivoted in the middle on a suitable support, as shown in ",
      },
      figure("Fig. 7"),
      { kind: "text", text: ". " },
      term("Bifurcate", "Divide into two prongs or forks."),
      {
        kind: "text",
        text: " the front end of this lever and make the right-side faces of the forks perpendicular and the left-side faces inclined, the upper one to the left upward and the under one to the left downward, with the under edge of the upper fork and the upper edge of the under fork sharp like saw-teeth, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      { kind: "text", text: ", particularly in " },
      figure("Fig. 2"),
      {
        kind: "text",
        text: ". Fasten to the bar C of the carriage-frame two holders or arms d, extending down through the cleat S, or fasten them directly to the cleat, and pivot in their lower ends the ends of the ratchet-bar I, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      { kind: "text", text: ". " },
      term("Serrate", "Cut into a row of teeth."),
      { kind: "text", text: " the bar I on both sides with notches like saw-teeth, as shown in " },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      {
        kind: "text",
        text: ". Make these notches, teeth, or cogs regular and equidistant apart, the exact distance required for a letter in writing or printing on the paper. Make the left side of the faces of the teeth or cogs perpendicular, both above and below, and the right-side faces inclined exactly alike, but the reverse of the teeth or cogs of the inner edges of the forks of the lever H, so that the lever H, with its forks embracing the ratchet-bar I, in moving up and down first one and then the other forks will strike and fit into the notches of the bar I, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      {
        kind: "text",
        text: ". Make the forks of the lever H so far asunder as just to allow the ratchet I in its widest way to pass between.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "At the right side, considered from the front of the under fork of the lever H, attach a thin yielding spring i, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      {
        kind: "text",
        text: ". Make the upper and sharp edge of the under fork stand a hair-breadth or slight distance to the right of the under and sharp edge of the upper fork, and then, as the weights W and W′, attached to the cords v and a′, over the pulleys R and e′, as shown in ",
      },
      figures(["Fig. 1", "Fig. 8"], "Figs. 1 and 8"),
      {
        kind: "text",
        text: ", (excepting that the weight W′ is unseen in the drawings,) are constantly pulling at the carriage to draw it from the right to the left of the table or case, when the upper fork is thrown up out of an upper notch in the ratchet, the carriage will move to the left till the left-side perpendicular face of the tooth or cog next to the right and below meets and strikes against the right-side perpendicular face of the under fork, and the carriage is thereby stopped. Fix the thin yielding spring i so that when the upper fork is pressed down into an upper notch of the ratchet I the spring will fly back against and up into the next tooth and notch to the right below. The office of this yielding spring is to assist the under fork to catch every under tooth and not let one slip by.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "As the ratchet is moved along by the carriage till the face of the tooth to the right below strikes and stops against the spring and under fork, the left perpendicular face of the tooth directly above is moved to and directly in line up and down into a hair-breadth with the perpendicular face of the fork above, so that when the front end or forks of the lever are moved or pressed down and the under fork lets go its hold of an under tooth the upper fork falls into the notch and against the tooth directly above and prevents the ratchet from moving; but when the forks are thrown up and the upper fork lets go its hold of the tooth above the ratchet moves to the left the space of one notch till the next tooth to the right below, with the yielding spring in the notch at its perpendicular face, strikes against the perpendicular face of the under fork. In this way the ratchet and carriage are held firmly still, while the front or bifurcated end of the lever H is thrown and held down, but moves to the left one notch, a regular, exact, and equal distance every time the bifurcated end of the lever is thrown up, and as striking down the front end of each key, as at L in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", raises the bar T laid across the key at the rear of the fulcrum M, and raises the rear end of the lever H, attached to the bar T, it therefore necessarily throws down the bifurcated or front end of the lever, and as the key rises to its place of rest again all these movements are reversed and necessarily throw up again the front end of the lever. Thus the working of the keys L, in combination with the weights W and W′, (the latter unseen,) the cords v and a′, the pulleys R and e′, the bar T, the lever H, the ratchet I, and the carriage inevitably moves the paper a regular, uniform, and exact distance—any distance desired for a type or letter—every time a key is struck—and the paper is moved while the type-bar is falling to the cushion, and stopped and held firmly stationary while the type is struck against it and the platen.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "On the end of the ratchet I, to the right, attach the lever z, to turn it down flatwise when desired, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      {
        kind: "text",
        text: ". To the bar C of the carriage attach a yielding spring to hold the lever and ratchet in perpendicular position, while the carriage is moving from right to left, as shown in ",
      },
      figures(["Fig. 1", "Fig. 2"], "Figs. 1 and 2"),
      {
        kind: "text",
        text: ". Turn the lever z forward and down, and therewith the ratchet, to a horizontal position, and the ratchet and carriage can be moved from left to right, the ratchet through and between the embracing-forks of the lever H readily and without obstruction. This can be done by the hand or by any obvious device by a foot-treadle, thus completing the means for the right and left movement of the carriage and paper.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "On the front end of the arm D, just behind the anvil, put a cross-beam D′, as shown in ",
      },
      figures(["Fig. 1", "Fig. 8", "Fig. 9"], "Figs. 1, 8, and 9"),
      {
        kind: "text",
        text: ". In the end of the cross-beam, at the right, put a gudgeon s′, and through the end at the left run a shaft l, and through a box at the left side of the back end of the arm D, as shown in ",
      },
      figures(["Fig. 1", "Fig. 8"], "Figs. 1 and 8"),
      {
        kind: "text",
        text: ", make two ribbon-spools m, of any adequate size, with holes in their centers, to slip on and revolve on the gudgeon s′, as shown in ",
      },
      figures(["Fig. 1", "Fig. 8", "Fig. 9"], "Figs. 1, 8, and 9"),
      {
        kind: "text",
        text: ". At the circumference of the holes in the spools m in the inner edge of each spool, through from side to side, cut a slot to fit on a key or cog or spur on the front end of the shaft l forward of the cross-beam D′, so that whichever spool is put on the shaft will be fast thereto and cannot revolve thereon. On the hind end of the shaft l fasten a pulley k, as shown in ",
      },
      figures(["Fig. 1", "Fig. 8"], "Figs. 1 and 8"),
      { kind: "text", text: ". Make the pulleys R and k, as shown in " },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ", cone pulleys—that is, make each R and k a series of pulleys, decreasing in size in regular conical order. Pivot the pulley R on a bar P, and pivot the bar P to the back side of the case A², so that the pulley may rise and fall freely, as shown in ",
      },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ". Attach a ratchet-wheel V, with a pawl t, pivoted to the bar P, as shown in ",
      },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ", to follow and fall into the notches of the ratchet-wheel to prevent the wheel turning toward the bar F, as seen in ",
      },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ", or from left to right, considered from the front. Connect the pulleys R and k with a cord or band v′, as shown in ",
      },
      figure("Fig. 8"),
      {
        kind: "text",
        text: ". The pulley R, pivoted to the loose-pivoted bar P, with the weight W pulling down on the pulley, will always keep the band tight, so that it will not slip in working.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Upon the spool m on the gudgeon s′ wind the inking-ribbon, and run one end under the platen G and attach it to the spool m on the shaft l, as shown in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ". Then, as striking each key L permits the weight W, by means of the cord v over the pulley R, to pull or move the carriage the space of one notch of the ratchet-bar I, it will necessarily roll the pulley R a corresponding distance, and, as the pulleys R and k are connected by the band v′, and the pulley k and the left spool m, considered from the front, both being fast to the shaft l, rolling the pulley R necessarily will roll the spools m and draw the ribbon from the loose spool on the gudgeon s′ under the platen G and onto the spool attached to the shaft l, and thus give a fresh place of the inking-ribbon every time for every type to strike against, and by means of the series of conical pulleys at R and k the feed of the inking-ribbon can be regulated as may be desired.",
      },
    ]),
    paragraph(
      text(
        "Thus made, the type-writer is the simplest, most perfectly adapted to its work—the writing of ordinary communications with types instead of a pen—and in every way the best of all machines yet designed for the purpose, particularly as to the cost of making the machine and the neatness and labor-saving quality of its work.",
      ),
    ),
    paragraph([
      figure("Fig. 6"),
      {
        kind: "text",
        text: " of the drawings represents a crescent or the segment comprising half a disk. By making the circumference large enough to receive the requisite number of radial grooves the crescent may be substituted for the disk, or, in other words, the segment comprising one-half for the whole disk.",
      },
    ]),
    { kind: "heading", level: 2, text: "Claims" },
    claim(
      1,
      "The key-levers L, vibrating on the fulcrum M, with the inner ends or fingers w reaching under the type-bars, so that the keys will act directly on the types, substantially as and for the purpose described.",
    ),
    claim(
      2,
      "The spacer or ratchet I, combined with the bifurcated lever H, connected with the bar T, pivoted at s and resting on and across the arms of the keys L behind the fulcrum M, so that striking the faces of the keys will work the teeth of the forks of the lever up and down and into the notches of the spaces and give a certain uniform and regular space movement to the paper-carriage in line of the types, when made substantially as described.",
    ),
    claim(
      3,
      "The pins e, fastened to the table A′, combined with the pawl h and the spring l, to give the paper-carriage a certain and regular cross-line movement at a right angle to the space movement from line to line, when made substantially as described.",
    ),
    claim(
      4,
      "The clasps or springs b, attached to the bars C′ and C² on a line through the middle of the platen G, combined with the springs a, attached to the bar E, to hold the paper to the carriage and press it down smooth and tight in passing under the platen, when made substantially as described.",
    ),
    claim(
      5,
      "The spools m, combined with the gudgeon s′, the shaft l, the pulleys k and R, the band v′, the cord v, the weight W, the ratchet-wheel V, the pawl t, and the bar P, pivoted to the back of the case A² to feed a fresh part of the inking-ribbon under the platen to each type successively, when made substantially as described.",
    ),
    paragraph(text("This specification signed this 1st day of May, A. D. 1868.")),
    paragraph([
      { kind: "small-caps", text: "C. LATHAM SHOLES.  CARLOS GLIDDEN.  SAMUEL W. SOULE." },
    ]),
    paragraph([{ kind: "small-caps", text: "Witnesses: G. E. WEISS.  F. J. CROSBY." }]),
  ],
};

/** Each entry retains the operative parts, timing, and stated limits of its source paragraph. */
export const sholesTypewriterParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: ["The conventional address introduces the specification as a public legal instrument."],
  3: [
    "The three inventors identify themselves and say this document is a full, enabling description of their improvement.",
  ],
  4: [
    "The drawings establish the machine's perspective, detached-part, sectional, and rear-elevation views. Each cited figure opens a crop from the pinned source sheet.",
  ],
  5: [
    "They frame this grant as improvements to an earlier type-writing-machine application. The stated package covers type-bar action, paper holding, two carriage motions, ribbon handling, a self-adjusting platen, and a type-bar rest.",
  ],
  6: [
    "Case A is a maker-chosen enclosure with a hinged cover. Disk B is a brass-preferred annulus with a central hole, radial grooves, peripheral bar slots, and a peripheral pivot-wire groove; the stated dimensions are preferences rather than fixed claim limits.",
  ],
  7: [
    "Steel is the stated preferred type-bar material. Each bar pivots at the disk's outer edge and has the disk radius, so its inner type can meet the common center. A piano-like key-board has one more key than types for a space-key; the grant does not name a layout or count. Fingers under the bars lift them, and cushion q receives them on return.",
  ],
  8: [
    "Platen G has a hard, smooth face and a spherical top seated in an anvil bowl. That universal joint lets the platen square itself to the paper, which passes with carbonized paper or an inking-ribbon over the disk.",
  ],
  9: [
    "The primary C frame slides in the writing direction on rails or guides. It carries the secondary E frame, which provides the perpendicular motion for successive lines.",
  ],
  10: [
    "Springs and clasps hold the paper in the secondary frame's chase. The C frame carries it along a line, while the E frame moves at right angles for a series of lines. The claim is about that specified two-axis arrangement, not a modern carriage geometry.",
  ],
  11: [
    "Pins e, pawl h, and spring l create the separate line-to-line step. The pawl passes a pin during a return movement and then forces the required transverse advance; the source gives a relative spacing rule, not a numerical line pitch.",
  ],
  12: [
    "Weights W and W′, cords v and a′, and pulleys R and e′ supply the pull that moves the paper carriage while the machine is used.",
  ],
  13: [
    "A pressed key raises bar T behind fulcrum M. Lever H has two shaped forks that alternately engage serrated ratchet I; the exact tooth and fork shapes are given so the carriage can be held and released in sequence.",
  ],
  14: [
    "The spring i helps the lower fork catch each tooth. When the upper fork releases, the weight-driven carriage moves until the lower fork meets the next perpendicular tooth face. The source describes this as a mechanical timing and holding sequence.",
  ],
  15: [
    "The alternating forks give one regular in-line carriage movement per key cycle. The source explicitly says paper moves while the type-bar falls to cushion q, then stays fixed while the type strikes the platen.",
  ],
  16: [
    "Lever z folds ratchet I down for an unobstructed rightward return of the carriage. The document allows a hand or foot-treadle return without making either its only mode.",
  ],
  17: [
    "The ribbon system uses a gudgeon, shaft, spools, cone pulleys, a ratchet wheel, a pawl, a weighted loose-pivoted belt tensioner, and a cross-beam. These parts are specified as a linked train rather than a generic ribbon.",
  ],
  18: [
    "Each carriage step turns pulley R. The belt to pulley k then turns the driven spool and moves a fresh section of inking-ribbon beneath platen G; the cone pulleys allow its feed to be regulated.",
  ],
  19: [
    "This is the inventors' performance claim for the assembled machine. It is historical advocacy, not a measured comparison supplied by the specification.",
  ],
  20: [
    "A semicircular, grooved segment can replace the complete annular disk if its circumference carries the required radial grooves.",
  ],
  27: [
    "The inventors date the signed specification May 1, 1868, before the June 23 grant date printed in the masthead.",
  ],
  28: ["These are the three inventors' names as executed on the specification."],
  29: ["G. E. Weiss and F. J. Crosby appear as witnesses to the execution."],
};
