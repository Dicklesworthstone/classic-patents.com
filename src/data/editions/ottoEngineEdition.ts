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

const crop = (number: number, width: number, height: number, revision = "") => ({
  src: `/patents/figures/us-194047-otto-engine/fig-${number}-source-crop${revision}.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US 194,047.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": crop(1, 620, 980),
  "Fig. 2": crop(2, 1160, 1800),
  "Fig. 3": crop(3, 1120, 1810),
  "Fig. 4": crop(4, 960, 830),
  "Fig. 5": crop(5, 620, 560, "-v2"),
  "Fig. 6": crop(6, 450, 420, "-v2"),
  "Fig. 7": crop(7, 450, 420, "-v2"),
  "Fig. 8": crop(8, 520, 500, "-v2"),
  "Fig. 9": crop(9, 300, 220),
  "Fig. 10": crop(10, 320, 750),
  "Fig. 11": crop(11, 330, 750),
  "Fig. 12": crop(12, 470, 320),
  "Fig. 13": crop(13, 450, 320),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 194,047`,
  figurePreviews: [FIGURES[label]],
});

const figureGroup = (
  sourceText: string,
  labels: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crops for ${sourceText} in US 194,047`,
  figurePreviews: labels.map((label) => FIGURES[label]),
});

const claim = (number: number, value: string | CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines: typeof value === "string" ? text(value) : value,
});

/**
 * A continuous, manually prepared edition of the complete US 194,047
 * facsimile. Four drawing sheets precede four specification sheets. The
 * reader deliberately follows the historical document as prose rather than
 * being split into arbitrary scan-page panels.
 */
export const ottoEngineArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ad6cfd50e5aaca4dbf9dcb594eb53dc1e619339314f50fdd49a6b4f34eb30baf",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "NICOLAUS A. OTTO, OF DEUTZ, GERMANY.",
        "IMPROVEMENT IN GAS-MOTOR ENGINES.",
        "Specification forming part of Letters Patent No. 194,047, dated August 14, 1877; application filed July 13, 1876.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1 AND 4",
      title: "Longitudinal engine-cylinder section and back-end view",
      description: [
        { kind: "text", text: "The first printed drawing sheet contains " },
        figure("Fig. 1"),
        { kind: "text", text: " and " },
        figure("Fig. 4"),
        { kind: "text", text: ". Both previews are direct crops from the pinned facsimile." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURE 2",
      title: "Side elevation of the engine",
      description: [
        { kind: "text", text: "The second printed drawing sheet is " },
        figure("Fig. 2"),
        { kind: "text", text: ", a side elevation of the engine." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURE 3",
      title: "Sectional plan of the engine",
      description: [
        { kind: "text", text: "The third printed drawing sheet is " },
        figure("Fig. 3"),
        { kind: "text", text: ", a sectional plan of the engine." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 5-13",
      title: "Gas-slide, valve-gear, and cycle details",
      description: [
        { kind: "text", text: "The fourth printed drawing sheet contains " },
        figure("Fig. 5"),
        { kind: "text", text: ", " },
        figure("Fig. 6"),
        { kind: "text", text: ", " },
        figure("Fig. 7"),
        { kind: "text", text: ", " },
        figure("Fig. 8"),
        { kind: "text", text: ", " },
        figure("Fig. 9"),
        { kind: "text", text: ", " },
        figure("Fig. 10"),
        { kind: "text", text: ", " },
        figure("Fig. 11"),
        { kind: "text", text: ", " },
        figure("Fig. 12"),
        { kind: "text", text: ", and " },
        figure("Fig. 13"),
        { kind: "text", text: ". Each reference opens its own source-facsimile crop." },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, NICOLAUS AUGUST OTTO, of the Gas-Motoren Fabrik-Deutz, at Deutz, in the German Empire, have invented an Improved Gas-Motor Engine; and do hereby declare that the following description, taken in connection with the accompanying sheets of drawings, hereinafter referred to, forms a full and exact specification of the same, wherein I have set forth the nature and principles of my said improvement, by which my invention may be distinguished from others of a similar class, together with such parts as I claim and desire to secure by Letters Patent—that is to say:",
    ),
    p(
      "In gas-motor engines as at present constructed, an explosive mixture of combustible gas and air is introduced into the engine-cylinder, where it is ignited, resulting in a sudden development of heat and expansion of the gases, a great portion of the useful effect being lost by absorption of heat, unless special provisions are made for allowing the gases to expand very rapidly.",
    ),
    paragraph([
      {
        kind: "text",
        text: "According to my present invention an intimate mixture of combustible gas or vapor and air is introduced into the cylinder, together with a separate charge of air or other ",
      },
      term(
        "incombustible gas",
        "A gas that does not itself support the combustion described here.",
      ),
      {
        kind: "text",
        text: ", in such a manner and in such proportions that the particles of the combustible gaseous mixture are more or less dispersed in an isolated condition in the air or other gas, so that on ignition, instead of an explosion ensuing, the flame will be communicated gradually from one combustible particle to another, thereby effecting a gradual development of heat and a corresponding gradual expansion of the gases, which will enable the motive power so produced to be utilized in the most effective manner.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In order more clearly to describe my invention, I will refer to the accompanying drawings, in which ",
      },
      figure("Fig. 1", "Figure 1"),
      {
        kind: "text",
        text: " shows a longitudinal section of an engine-cylinder, A, having a piston, B, connected to a fly-wheel shaft, and a port or passage, C, for the admission of combustible gaseous mixture and air, controlled by the slide D, and having also a passage, E, for the emission of the products of combustion, closed by a valve, F.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Assuming the piston to be at the end of its instroke, its bottom surface being represented by the dotted line a, while the slide D is in such a position that its passage D¹ establishes a communication between the outer air through the aperture D² and the port C, then, on the piston commencing its ",
      },
      term("outstroke", "The piston’s motion away from the closed end of its cylinder."),
      {
        kind: "text",
        text: ", it will draw in atmospheric air until it arrives at the point indicated by the dotted line b, when the slide will have been moved so as to cut off the air-supply and establish a communication between the passage G in the slide-cover, for an intimate mixture of coal-gas or petroleum vapor and air, (in such proportions that the mixture will burn of itself, but, owing to the presence of the first admitted air, will not explode,) and the port C through the passage D¹. On the continued motion of the piston, combustible gaseous mixture will consequently be drawn in until the piston has arrived at a point, c, when the slide will have moved into the position shown, cutting off the gas-supply, and about to establish a communication between the small gas-flame H and the charge in the cylinder, for the purpose of igniting the latter.",
      },
    ]),
    p(
      "The combustible gaseous mixture, in entering the cylinder behind the charge of air previously admitted, will, to a certain extent, mix with the latter, the particles of the combustible mixture being close together in and near the port C, and becoming more and more dispersed in the air as they approach the piston, as indicated by the dots in the drawing, which represent the combustible particles. Thus, on the ignition of the charge in the port C, the gaseous mixture will at first burn with comparative rapidity, the flame spreading from particle to particle; but as the ignition extends toward the front end of the charge, it will proceed more and more slowly, owing to the combustible particles being farther and farther apart.",
    ),
    p(
      "The burning particles impart their heat to the surrounding air, producing a gradually increasing pressure in the cylinder, which causes the piston to complete its outstroke. Motion being thus imparted to the fly-wheel by the piston-rod, its momentum causes the piston to perform its return stroke, whereby the products of combustion are expelled through the valve F, and the fly-wheel also causing the piston to commence its next outstroke, a fresh charge of air and combustible mixture is drawn in, as before described.",
    ),
    p(
      "In order to vary the power of the engine, the charge of combustible mixture (represented by the space a to b) may be varied, as may also the proportions of air and coal-gas or vapor of which it is composed, and such variation may be controlled by connecting the valve-gear with any suitable construction of governor, as will be presently described.",
    ),
    p(
      "From the foregoing general description it will be seen that as in the improved mode of operating there is no sudden explosion of the gaseous charge, but a gradual development of heat and expansion of the gases, there will be no such losses of effect as result in gas-engines of present construction through shocks produced by the sudden development of motive power, and by the absorption of heat consequent upon the inability of the gases to expand with sufficient rapidity.",
    ),
    p(
      "The above-described beneficial effect of the improved mode of working will be further increased by the fact that the charge of air interposed between the combustible mixture and the piston will operate as a cushion or buffer in still further reducing the suddenness of the expansive force generated as it transmits it to the piston.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Engines operating according to my invention may either be single-acting—the return stroke being effected by the momentum of the fly-wheel—or they may be double-acting, a gaseous charge being introduced at each end of the cylinder. They may also operate with the gases either at atmospheric pressure or compressed to any desired degree. In the latter case the engine may be arranged in a similar manner to that above described, the gases being compressed by any suitable known means before being introduced into the engine; but, by preference, I dispense with any such additional compressing mechanism by arranging the engine to operate in the manner I will now proceed to describe with reference to ",
      },
      figureGroup("Figs. 2 to 13", [
        "Fig. 2",
        "Fig. 3",
        "Fig. 4",
        "Fig. 5",
        "Fig. 6",
        "Fig. 7",
        "Fig. 8",
        "Fig. 9",
        "Fig. 10",
        "Fig. 11",
        "Fig. 12",
        "Fig. 13",
      ]),
      { kind: "text", text: " of the drawings, of which—" },
    ]),
    paragraph([
      figure("Fig. 2", "Fig. 2"),
      { kind: "text", text: " shows a side elevation; " },
      figure("Fig. 3", "Fig. 3"),
      { kind: "text", text: ", a sectional plan; " },
      figure("Fig. 4", "Fig. 4"),
      { kind: "text", text: ", a back-end view, and " },
      figureGroup("Figs. 5 to 13", [
        "Fig. 5",
        "Fig. 6",
        "Fig. 7",
        "Fig. 8",
        "Fig. 9",
        "Fig. 10",
        "Fig. 11",
        "Fig. 12",
        "Fig. 13",
      ]),
      { kind: "text", text: " details of the valve-gear." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The engine is here represented as being single-acting, the cylinder A being open to the atmosphere at its front end. At its closed back end it has a space, A¹, beyond the stroke of the piston B, which space is, by preference, made conical at the end, as shown, tapering to the inlet-port C for combustible gas and air, and also communicating by the passage E with the escape-valve F, ",
      },
      figure("Fig. 3", "Fig. 3"),
      { kind: "text", text: ", for the products of combustion." },
    ]),
    p(
      "The piston B is connected by the rod B¹ to the crank-shaft I, on which is a bevel-pinion, I¹, in gear with a bevel-wheel, K¹, on a shaft, K. On the other end of this shaft is a crank, K², connected by a link, D², to the slide D, governing the admission of gas and air to the cylinder. The gearing I¹ K¹ is so proportioned that the crank K² makes one revolution, and, consequently, the slide one to-and-fro motion, while the piston makes two double strokes.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The mode of operating with this engine is as follows: Assuming the piston to be at the end of its ",
      },
      term("instroke", "The piston’s return motion toward the closed end of its cylinder."),
      { kind: "text", text: " (represented by the dotted line a, " },
      figure("Fig. 3", "Fig. 3"),
      {
        kind: "text",
        text: ",) and about to be moved through its outstroke by the momentum of the fly-wheel M, then, the slide D (the construction of which will be presently explained) being in position to admit atmospheric air through the passage D¹ and port C, air will be drawn into the cylinder until the piston has reached the point represented by the dotted line b, when, the slide having established a communication with the combustible-gas supply and the cylinder, combustible gas intimately mixed with air will be drawn in until the piston has arrived at the end of its outstroke, the position shown at ",
      },
      figure("Fig. 3", "Fig. 3"),
      { kind: "text", text: ". As before explained with reference to " },
      figure("Fig. 1", "Fig. 1"),
      {
        kind: "text",
        text: ", the combustible gaseous mixture, in entering, will mix to a certain extent with the air previously introduced, the particles of gaseous mixture being close together at the back end of the cylinder, and more and more separated from each other toward the front end. The slide having moved so as to close the inlet-port C, the piston is caused, by the momentum of the fly-wheel, to perform its instroke, whereby the charge of gaseous mixture and air that filled the cylinder at atmospheric pressure will be compressed into the space from the line a to the back end of the cylinder, the particles of gaseous mixture remaining in much the same unequally distributed condition in the air as they did before compression. The slide now establishes a communication between the gas-flame H and the interior of the cylinder, so as to ignite the charge, resulting in a gradual development of heat and expansion of the gases, as before explained, whereby the piston will be caused to perform its outstroke, imparting fresh momentum to the fly-wheel. This momentum will again cause the piston to perform its instroke, whereby the products of combustion will be expelled through the valve F, which has been opened by the lever N, acted on by a cam, O, on the shaft K. As the piston only moves back to the line a, it will be seen that a certain portion of the products of combustion will remain in the cylinder, and will consequently mix to a certain extent with the air drawn in behind them at the next outstroke; but as the mixture of combustible gas and air afterward introduced will burn independently of the air or other gas surrounding its particles, it will be seen that the presence of such products of combustion in the charge will be of no consequence.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "As before stated, the power of the engine may be regulated by regulating the quantity of combustible gas introduced at each charge. This is effected by the gas-slide P, controlled by the ",
      },
      term("governor", "A speed-responsive mechanism that changes the admitted fuel quantity."),
      { kind: "text", text: " Q, operating on the sliding cam R as follows: " },
      figure("Fig. 5", "Fig. 5"),
      { kind: "text", text: " shows an enlarged front view of the gas-slide; " },
      figureGroup("Figs. 6 and 7", ["Fig. 6", "Fig. 7"]),
      { kind: "text", text: ", vertical sections; and " },
      figure("Fig. 8", "Fig. 8"),
      { kind: "text", text: " a plan, of the same." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In the casing of the slide are formed two passages, G¹ and G², the former communicating with a pipe, G³, leading to the gas-passage G in the slide D, and the other with the gas-supply pipe G⁴. These passages have small side openings, as shown, which, when the slide is in the position shown in ",
      },
      figure("Fig. 7", "Fig. 7"),
      {
        kind: "text",
        text: ", both communicate with the cavity of the slide P, so that gas can pass from G² into G¹, and thence into the passage G of the slide D. When the slide is moved into the position shown in ",
      },
      figure("Fig. 6", "Fig. 6"),
      {
        kind: "text",
        text: ", this communication, and consequently the gas-supply, is cut off. The slide P rests with a small roller, P¹, upon a cam, R, which revolves with, but can slide somewhat upon, the shaft K, the raising of the slide being effected by the cam, while its downward motion is effected by the spring P². According as the cam is shifted relatively to the roller P¹ by the action of the governor Q and lever Q¹, (which has a fork taking into a collar on the cam, as shown,) the slide is made to establish the communication between G¹ and G² for a longer or a shorter period, thus allowing a greater or less quantity of the combustible gas for one charge to pass into the cylinder A independently of the action of the slide D. The gas-slide P is held against the face of the casing by a spring, P³, pressing against a cover, P⁴, on the back of the slide.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The construction and mode of operating of the engine-slide D will be understood on reference to ",
      },
      figureGroup("Figs. 10 to 13", ["Fig. 10", "Fig. 11", "Fig. 12", "Fig. 13"]),
      { kind: "text", text: ", of which " },
      figureGroup("Figs. 10 and 11", ["Fig. 10", "Fig. 11"]),
      {
        kind: "text",
        text: " represent two longitudinal sections of the slide and casing on line Z Z, ",
      },
      figure("Fig. 12", "Fig. 12"),
      { kind: "text", text: ", with the slide in two different positions, and " },
      figureGroup("Figs. 12 and 13", ["Fig. 12", "Fig. 13"]),
      { kind: "text", text: " show transverse sections, respectively, on lines X X and Y Y, " },
      figure("Fig. 10", "Fig. 10"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "From the previous description of the action of the engine, it will be seen that there are four strokes of the piston required for one complete operation—namely, an outstroke for drawing in the charge of combustible mixture and air, an instroke for compressing the gases, a second outstroke when the piston is propelled on the ignition of the gases, and a second instroke for expelling the products of combustion. The slide D consequently has to perform one to-and-fro motion while the piston is performing the above-mentioned four operations, for which purpose, as before stated, the slide-crank K² makes one revolution while the engine-shaft makes two. The circle at ",
      },
      figure("Fig. 9", "Fig. 9"),
      {
        kind: "text",
        text: " represents a diagram of the path of the crank K², in which the part from 1 to 2 represents the motion of the slide during the time of drawing in the gaseous charge, the part from 2 to 3 the motion during the compression of the charge, 3 to 4 the motion during the working stroke, and 4 to 1 the motion during the expulsion of the products of combustion. ",
      },
      figureGroup("Figs. 10 and 11", ["Fig. 10", "Fig. 11"]),
      { kind: "text", text: " each show two positions of the slide, " },
      figure("Fig. 10", "Fig. 10"),
      {
        kind: "text",
        text: " showing, first, its position at the point 1 of the crank-path when the air-passage D¹ is just about to communicate with the port C, and, secondly, its position at point 2, the gas and air supply having just been cut off. It will be seen that in the first position the gas-passage G is also about to open; but the before-described action of the gas-slide P will prevent the admission of combustible gas until the requisite charge of air is introduced. ",
      },
      figure("Fig. 11", "Fig. 11"),
      {
        kind: "text",
        text: " shows, first, the position of the slide at the point 3 when the flame of the gas jet H is about to be communicated to the gaseous charge by a small quantity of inflamed gas in the passage D³, and, secondly, its position at the point 4 when the escape-valve F is about to be opened.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "For effecting the ignition of the charge, a small quantity of combustible gas is made to pass down a pipe, S, into a recess, S¹, in the end of the cylinder, whence it issues through a small channel, D³, in the slide into the passage D. Here it is ignited by the jet H, and the flame is, by the motion of the slide, conveyed to the port C, the slide-cover L being made to close the outer opening of D³ before its inner opening communicates with C, as shown at ",
      },
      figure("Fig. 11", "Fig. 11"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The gas-passage G communicates with the air-passage D¹ through a number of small openings, as shown at ",
      },
      figure("Fig. 13", "Fig. 13"),
      {
        kind: "text",
        text: ", so that the gas, in issuing in small divided jets into D¹, becomes intimately mixed with the air therein in the requisite proportions for producing the combustible mixture before described.",
      },
    ]),
    paragraph([
      { kind: "text", text: "The opening of the " },
      term("escape-valve", "The valve that releases combustion products from the cylinder."),
      {
        kind: "text",
        text: " F at the commencement of the second instroke of the piston (point 4 at ",
      },
      figure("Fig. 9", "Fig. 9"),
      {
        kind: "text",
        text: ") is effected by the bell-crank lever F¹, connected at one end to the stem of the valve, and having at the other end a roller, F², which is acted upon by the cam F³ on the shaft K. E¹ is the pipe for conducting away the products of combustion.",
      },
    ]),
    p(
      "The governor Q is driven by bevel-gearing from the shaft K, its arms being made to move a sliding collar, Q³, up or down, thus imparting motion through the lever Q¹ to the cam R, as before described.",
    ),
    p("The cylinder A is, by preference, provided with a jacket, as shown."),
    p(
      "As before stated, the engine may be arranged double-acting by providing the requisite valve-gear for each end of the cylinder. It may also be arranged in a vertical or inclined position, instead of horizontal; and if single-acting, or if great regularity of motion be required, two or more engines may be connected to one and the same crank-shaft.",
    ),
    p(
      "Having thus described the nature of my invention, and in what manner the same is to be performed, I wish it to be understood that I do not claim generally the separate introduction of combustible gas and air into the cylinder of a gas-engine, as I am aware that is to a certain extent described in the English Patents No. 1,655 of 1857, and 335 of 1860; but, I claim—",
    ),
    claim(
      1,
      "A gas-motor engine wherein an intimate mixture of combustible gas or vapor and air is introduced into the cylinder, separate from a charge of air or other incombustible gas, in such manner and in such proportions that the particles of combustible mixture will be close together at the point of ignition, but will be more and more dispersed in the charge of air forward of that point, whereby the development of heat and the expansion or increase of pressure produced by the combustion are rendered gradual, substantially as herein described.",
    ),
    claim(
      2,
      "A gas-motor engine wherein an intimate mixture of combustible gas or vapor and air is introduced into the cylinder separate from and subsequent to a charge of air, such introduction being effected through an aperture or apertures in the end surface of the cylinder, in order to cause the charge of air to move forward in the cylinder as the combustible mixture is introduced, substantially as and for the purposes set forth.",
    ),
    claim(3, [
      {
        kind: "text",
        text: "A gas-motor engine wherein, by one outstroke of the piston, separate charges of combustible gaseous mixture and of air are drawn into the cylinder, which charges are compressed by the instroke and then ignited, so as to propel the piston, which, by its return stroke, expels the products of combustion, substantially as herein described with reference to ",
      },
      figureGroup("Figs. 2 to 13", [
        "Fig. 2",
        "Fig. 3",
        "Fig. 4",
        "Fig. 5",
        "Fig. 6",
        "Fig. 7",
        "Fig. 8",
        "Fig. 9",
        "Fig. 10",
        "Fig. 11",
        "Fig. 12",
        "Fig. 13",
      ]),
      { kind: "text", text: " of the drawings." },
    ]),
    claim(
      4,
      "In gas-motor engines wherein charges of combustible gas and air are introduced separately into the cylinder, regulating the power of the engine by controlling the gas-supply by means of a valve operated by a governor, substantially as herein described.",
    ),
    claim(
      5,
      "In gas-motor engines, the shaft K, driven from the engine-shaft, with crank K², imparting motion to the slide D, cam R, for regulating the gas-supply, and cam F³, for opening the escape-valve F, substantially as herein described.",
    ),
    claim(
      6,
      "In gas-motor engines, the combination of the cylinder A, piston B, engine-shaft I, counter-shaft K, crank K², slide D, gas-slide P, cam R, escape-valve F, lever F¹, and cam F³, all arranged and operating substantially as and for the purposes herein described.",
    ),
    p(
      "In testimony whereof I have signed my name to this specification in the presence of two subscribing witnesses this 1st day of June, 1876.",
    ),
    p("NICOLAUS AUGUST OTTO."),
    p("Witnesses: FRIEDRICH ALBERT SPIECKER. GUSTAV KLEINJING."),
  ],
};

export const ottoEngineParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: ["This conventional opening addresses any reader who may need notice of the invention."],
  6: [
    "Otto identifies himself, his Deutz factory connection, and the drawings that accompany this legal specification.",
  ],
  7: [
    "The stated starting problem is a sudden explosion of a fully combustible cylinder charge. Otto says the resulting heat can be lost before the gas has time to expand and push the piston.",
  ],
  8: [
    "The central idea is a deliberately nonuniform charge. Near ignition, combustible particles are close enough for the flame to move readily. Farther toward the piston, the mixture is progressively diluted by air or another noncombustible gas, so the flame and pressure rise become more gradual.",
  ],
  9: [
    "Figure 1 is the simplified sectional explanation. It labels the cylinder, piston, inlet port, slide, exhaust passage, and exhaust valve. The following paragraphs use its dotted lines a, b, and c to define where the piston is during admission and ignition.",
  ],
  10: [
    "First the slide admits air. It then cuts off that air and admits a combustible gas-and-air mixture behind it. The gas mixture is combustible by itself, but the initial air charge makes the total cylinder contents too dilute to explode as one mass. Near the end of the admission stroke, the slide prepares a small flame communication to ignite the charge.",
  ],
  11: [
    "Otto expects partial mixing, not a hard boundary. He describes a concentration gradient: gas particles close together near port C and farther apart nearer the piston. That gradient is his stated reason the flame starts relatively quickly at the rear, then travels more slowly as it moves into increasingly dilute material.",
  ],
  12: [
    "Heat from burning gas reaches the surrounding air and gradually raises pressure, completing the working outstroke. The flywheel stores enough momentum to make the return stroke, open the exhaust path, and begin the next charge. This is an engine cycle, but the source’s claimed distinction is the staged combustion rather than a generic modern cycle label.",
  ],
  13: [
    "Power can be changed by varying both the amount of combustible mixture and its gas-to-air proportion. Otto delegates that adjustment to valve gear operated by a governor, which the later figures describe.",
  ],
  14: [
    "Otto contrasts gradual heat and expansion with a sudden explosive pressure rise. His asserted gain is less shock and less loss while a gas fails to expand fast enough, not a measured efficiency or pressure value.",
  ],
  15: [
    "The initial air charge is also said to cushion the piston from the expanding combustion products. The source treats that gas layer as part of how the expanding force is transmitted.",
  ],
  16: [
    "The description permits single-acting or double-acting engines and supply gases at atmospheric or higher pressure. Otto says he prefers the mechanism now described because it avoids a separate upstream compressor.",
  ],
  17: [
    "Figures 2 through 4 show the main engine from side, sectional-plan, and back-end views. Figures 5 through 13 isolate the valve gear that creates the timing and mixture sequence.",
  ],
  18: [
    "In the illustrated single-acting version, cylinder A is open at one end. A conical space beyond piston travel leads into inlet port C and connects through passage E to exhaust valve F.",
  ],
  19: [
    "Piston rod B-prime drives crankshaft I. Bevel gearing drives shaft K, and crank K-squared moves slide D through link D-squared. The ratio makes one full slide cycle while the piston makes two double strokes, so the valve gear is timed across the four piston operations.",
  ],
  20: [
    "This is the complete operating sequence in the illustrated engine: air enters first; combustible mixture follows; the moving piston compresses the combined charge; a flame path ignites it; then the flywheel carries the piston through exhaust. The source also says residual combustion products can remain because the subsequent combustible mixture burns independently of the surrounding dilute gas.",
  ],
  21: [
    "Governor Q does not simply open or close the main slide. It shifts cam R, which changes how long gas-slide P connects the gas passages. That changes the amount of combustible gas admitted on each charge.",
  ],
  22: [
    "The gas-slide uses two internal passage connections. In one position it lets gas flow from the supply into the engine-slide route; in the other it cuts that supply off. A cam raises it, a spring returns it, and the governor shifts the cam to alter the open interval.",
  ],
  23: [
    "Figures 10 and 11 are lengthwise sections of the engine-slide at two positions; Figures 12 and 13 are cross-sections along the marked lines. The drawings are a mechanical explanation of the passage timing, not generic decorative diagrams.",
  ],
  24: [
    "Figure 9 maps one revolution of the slide crank against four piston operations. Its arcs 1-to-2, 2-to-3, 3-to-4, and 4-to-1 correspond to admission, compression, working expansion, and exhaust. The figure references then identify the two shown slide positions for those events.",
  ],
  25: [
    "A small gas stream travels through pipe S and recess S-prime to a channel in the slide. It is lit by jet H, and the moving slide brings that flame communication to port C only after its outer opening has been closed by the cover.",
  ],
  26: [
    "The gas path enters the air path through several small openings. Otto describes the issuing gas as divided jets that become intimately mixed with the air before reaching the cylinder.",
  ],
  27: [
    "At the second return stroke, cam F-cubed moves the bell-crank lever to open exhaust valve F. Pipe E-prime carries the combustion products away.",
  ],
  28: [
    "The governor’s arms move a sliding collar, which acts through lever Q-prime to reposition cam R. It is the mechanical feedback path that changes gas quantity as engine speed changes.",
  ],
  29: [
    "The source says the cylinder is preferably jacketed. It does not specify a material, coolant, temperature, or pressure for that jacket.",
  ],
  30: [
    "Otto allows horizontal, vertical, inclined, single-acting, double-acting, and multi-engine arrangements. Those options show that the legal scope is not limited to the illustrated orientation.",
  ],
  31: [
    "Otto expressly disclaims a broad claim to separate introduction of gas and air because earlier English patents described that idea to some extent. His six following claims instead identify the gradual-combustion distribution, admission geometry, cycle, governor, and named valve gear.",
  ],
  38: [
    "The dated execution says Otto signed the specification on June 1, 1876, before two witnesses. That date is distinct from the July 13 application filing shown in the masthead and the August 14, 1877 grant.",
  ],
  39: ["Nicolaus August Otto signs the specification."],
  40: [
    "Friedrich Albert Spiecker and Gustav Kleinjing are listed as witnesses to Otto’s execution of the patent instrument.",
  ],
};

export const ottoEngineRecordCorrections: Pick<
  Patent,
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "filingDate"
  | "category"
  | "categoryLabel"
  | "summary"
  | "heroQuote"
  | "usptoClassification"
  | "plainEnglishExplanation"
  | "claims"
  | "drawings"
  | "historicalContext"
  | "tags"
  | "stats"
> = {
  shortTitle: "Otto's Gradual-Combustion Gas Engine",
  subtitle: "Staged air-and-fuel charges, progressive flame travel, and governed slide-valve gear",
  inventors: ["Nicolaus August Otto"],
  inventorLocation: "Deutz, German Empire",
  filingDate: "1876-07-13",
  category: "consumer",
  categoryLabel: "Thermodynamics & Internal Combustion",
  summary:
    "US 194,047 describes a gas engine that first admits air, then introduces an intimate combustible gas-and-air mixture behind it. The mixture is deliberately concentrated near the ignition port and increasingly dispersed toward the piston, so Otto says flame, heat, and pressure develop gradually. The patent also describes the four piston strokes, governor-regulated gas slide, and named valve gear that implement that arrangement.",
  heroQuote:
    "The flame will be communicated gradually from one combustible particle to another, thereby effecting a gradual development of heat and a corresponding gradual expansion of the gases.",
  usptoClassification: "F02B 75/02 (Four-stroke internal-combustion engines; Otto-cycle engines)",
  plainEnglishExplanation: {
    overview:
      "Otto begins with a thermal-management problem, not a modern slogan. He argues that igniting one uniformly explosive cylinder charge produces a sudden heat release whose useful effect can be lost if the gas cannot expand quickly enough. His proposed charge has two parts: air or another diluting gas enters first, then a combustible mixture enters behind it. The fuel-rich region near the ignition port burns first; farther toward the piston, the particles are more dispersed, so the flame and pressure rise progress along the cylinder rather than arriving as a single sudden event.",
    coreMechanism:
      "The slide admits plain air through port C until the piston reaches dotted line b. It then switches to a coal-gas or petroleum-vapor mixture with air, drawing that mixture until the piston reaches c. On the return stroke the piston compresses both portions of the charge into the rear space. A small flame path ignites the region near C. The source describes a flame that travels from relatively close combustible particles into increasingly dispersed ones, while the surrounding air receives heat and pressure rises. The flywheel supplies inertia for compression and exhaust; the valve gear repeats the sequence in four piston strokes while the slide crank makes one revolution for two engine-shaft revolutions.",
    mechanicalBreakdown: [
      {
        title: "Sequential air and combustible-charge admission",
        summary:
          "Slide D first admits air, then switches to combustible mixture while the piston continues its intake stroke.",
        technicalDetails:
          "The order is essential to the description. The earlier air charge occupies the front of the cylinder, while the subsequently admitted combustible mixture lies nearer the closed rear end and inlet port. Otto says the mixture remains unevenly distributed even after compression. The patent does not give a composition percentage, a pressure, or a cylinder dimension.",
        archaicTerm: "outstroke and instroke",
        modernEquivalent: "Intake and return piston strokes",
      },
      {
        title: "Progressive flame path",
        summary:
          "The claimed concentration gradient changes how combustion develops along the charge.",
        technicalDetails:
          "Near port C, combustible particles are close together and ignition spreads comparatively rapidly. Toward the piston, the particles are farther apart in the air or other incombustible gas, so the source says the flame proceeds more slowly. Otto connects that progression to gradual heat development and pressure increase, rather than to an asserted numerical efficiency.",
        archaicTerm: "incombustible gas",
        modernEquivalent: "Diluting, non-fuel gas charge",
      },
      {
        title: "Slide, flame path, and exhaust valve",
        summary:
          "One sliding element times air, gas, and ignition communication; a cammed valve clears the products of combustion.",
        technicalDetails:
          "Slide D supplies the intake path and brings a flame from jet H to port C through a small channel only at the ignition position. Cam F-cubed then moves lever F-prime to open exhaust valve F on the second return stroke. These are concrete source components, not a modern spark plug or electronic injection system.",
        archaicTerm: "slide and escape-valve",
        modernEquivalent: "Reciprocating timing slide and exhaust valve",
      },
      {
        title: "Governor-controlled gas slide",
        summary: "Governor Q shifts cam R to change the duration of fuel admission.",
        technicalDetails:
          "Gas-slide P is raised by cam R and returned by spring P-squared. Moving the cam relative to roller P-prime changes the interval during which passages G-prime and G-squared communicate. That is the patent’s described method of changing the gas quantity per charge without changing the action of the main slide D.",
        archaicTerm: "governor",
        modernEquivalent: "Mechanical speed governor and fuel-metering linkage",
      },
      {
        title: "Flywheel and one-to-two timing relation",
        summary:
          "The flywheel carries the non-power motions; bevel gearing causes one slide cycle for four piston strokes.",
        technicalDetails:
          "Shaft K is driven from engine shaft I through bevel pinion I-prime and bevel wheel K-prime. Its crank K-squared makes one revolution while the piston makes two double strokes. The document uses that relation to coordinate admission, compression, work, and exhaust; it does not state a rotational speed, mass, or energy value.",
        archaicTerm: "fly-wheel",
        modernEquivalent: "Rotational inertia wheel",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Concentration-dependent flame propagation",
        explanation:
          "A combustible mixture does not burn with the same behavior at every dilution. Otto’s own account uses the spacing of combustible particles as a qualitative model: close particles near ignition transmit flame readily, while increasingly dispersed particles ahead slow that transfer. The patent’s technical contribution is to arrange the charge spatially, not merely to state that fuel and air can be introduced separately.",
      },
      {
        principle: "Pressure from heated confined gas",
        explanation:
          "When combustion heats the cylinder charge, its pressure rises and exerts force on the piston. Otto stresses the rate of that rise. The interposed air charge is described as a cushion or buffer that further reduces the suddenness of transmitted expansive force.",
      },
      {
        principle: "Four-stroke timing",
        explanation:
          "The illustrated operating sequence has four piston motions: draw in air and combustible mixture, compress the charge, make a working outstroke after ignition, and expel the products. The source links that sequence to one to-and-fro motion of the slide while the engine shaft makes two revolutions.",
      },
    ],
    whyItMattersToday:
      "The source separates an actual 1877 mechanism from the simplified four-stroke legend often attached to Otto’s name. Its claims include a four-stroke operation, but they also make the spatial distribution of fuel, the gradual development of heat and pressure, a governor-controlled gas supply, and specific slide-and-cam hardware legally material. Reading those features together gives a clearer account of what this patent actually put before the Patent Office.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A gas-motor engine wherein an intimate mixture of combustible gas or vapor and air is introduced into the cylinder, separate from a charge of air or other incombustible gas, in such manner and in such proportions that the particles of combustible mixture will be close together at the point of ignition, but will be more and more dispersed in the charge of air forward of that point, whereby the development of heat and the expansion or increase of pressure produced by the combustion are rendered gradual, substantially as herein described.",
      plainEnglish:
        "This claim protects the deliberately graded charge. The combustible mixture is separate from the first air or noncombustible-gas charge, concentrated near ignition, and increasingly dispersed farther forward so combustion produces a gradual heat and pressure rise.",
      keyInnovations: [
        "Separate air charge",
        "Fuel-concentration gradient",
        "Gradual combustion pressure rise",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "A gas-motor engine wherein an intimate mixture of combustible gas or vapor and air is introduced into the cylinder separate from and subsequent to a charge of air, such introduction being effected through an aperture or apertures in the end surface of the cylinder, in order to cause the charge of air to move forward in the cylinder as the combustible mixture is introduced, substantially as and for the purposes set forth.",
      plainEnglish:
        "This claim narrows the staged charge to an end-surface admission arrangement. The later combustible mixture enters through one or more cylinder-end apertures and pushes the prior air charge forward.",
      keyInnovations: [
        "Cylinder-end admission",
        "Subsequent combustible charge",
        "Forward displacement of air charge",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "A gas-motor engine wherein, by one outstroke of the piston, separate charges of combustible gaseous mixture and of air are drawn into the cylinder, which charges are compressed by the instroke and then ignited, so as to propel the piston, which, by its return stroke, expels the products of combustion, substantially as herein described with reference to Figs. 2 to 13 of the drawings.",
      plainEnglish:
        "This claim places the separate air and combustible charges in a complete four-stroke operating sequence: intake, compression, ignition and work, then exhaust. It ties that sequence to the illustrated valve gear in Figures 2 through 13.",
      keyInnovations: [
        "Separate-charge intake",
        "Compression before ignition",
        "Four-stroke exhaust sequence",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In gas-motor engines wherein charges of combustible gas and air are introduced separately into the cylinder, regulating the power of the engine by controlling the gas-supply by means of a valve operated by a governor, substantially as herein described.",
      plainEnglish:
        "This claim covers power regulation by a governor-operated valve that meters the gas supply in an engine using separately introduced combustible gas and air.",
      keyInnovations: ["Governor-operated valve", "Gas-supply regulation", "Power control"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "In gas-motor engines, the shaft K, driven from the engine-shaft, with crank K², imparting motion to the slide D, cam R, for regulating the gas-supply, and cam F³, for opening the escape-valve F, substantially as herein described.",
      plainEnglish:
        "This claim names a coordinated shaft-and-cam train: shaft K drives the main slide through crank K-squared, meters fuel through cam R, and opens exhaust valve F through cam F-cubed.",
      keyInnovations: ["Counter-shaft K", "Slide-driving crank", "Fuel and exhaust cams"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "In gas-motor engines, the combination of the cylinder A, piston B, engine-shaft I, counter-shaft K, crank K², slide D, gas-slide P, cam R, escape-valve F, lever F¹, and cam F³, all arranged and operating substantially as and for the purposes herein described.",
      plainEnglish:
        "This claim protects the complete named mechanism and its coordinated operation: cylinder and piston, engine and counter shafts, the main and gas slides, governor cam, exhaust valve, lever, and exhaust cam.",
      keyInnovations: ["Integrated valve gear", "Gas slide P", "Exhaust lever F-prime"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal section of the engine cylinder",
      caption:
        "The facsimile’s sectional diagram of cylinder A, piston B, inlet C, slide D, exhaust passage E, and valve F.",
      svgType: "otto-engine",
      callouts: [
        {
          id: "oe-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Engine-cylinder",
          description: "The cylinder in which the staged charge and piston operate.",
          x: 50,
          y: 29,
        },
        {
          id: "oe-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Piston",
          description: "The reciprocating member driven by the gradual pressure rise.",
          x: 52,
          y: 48,
        },
        {
          id: "oe-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Admission port",
          description: "The port through which air and then combustible mixture enter.",
          x: 56,
          y: 74,
        },
        {
          id: "oe-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Slide",
          description: "The sliding valve element that times the admission and ignition paths.",
          x: 73,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Side elevation of the engine",
      caption: "The facsimile’s large side view of the cylinder, flywheel, shaft, and valve gear.",
      svgType: "otto-engine",
      callouts: [
        {
          id: "oe-5",
          figureRef: "Fig. 2",
          label: "M",
          element: "Flywheel",
          description:
            "The wheel whose momentum carries the return, compression, and exhaust motions.",
          x: 35,
          y: 45,
        },
        {
          id: "oe-6",
          figureRef: "Fig. 2",
          label: "K",
          element: "Counter-shaft",
          description: "The shaft that drives the slide crank and cams.",
          x: 62,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Sectional plan of the engine",
      caption: "The facsimile’s plan section through the cylinder, port space, and valve gear.",
      svgType: "otto-engine",
      callouts: [
        {
          id: "oe-7",
          figureRef: "Fig. 3",
          label: "A¹",
          element: "Rear cylinder space",
          description: "The conical space beyond piston travel described near inlet port C.",
          x: 47,
          y: 81,
        },
        {
          id: "oe-8",
          figureRef: "Fig. 3",
          label: "F",
          element: "Escape-valve",
          description: "The valve that opens to discharge combustion products.",
          x: 46,
          y: 86,
        },
      ],
    },
    {
      figureNumber: "Figs. 5-13",
      title: "Gas-slide and valve-gear details",
      caption:
        "Direct source drawings of the gas slide, its passages, the cycle diagram, and the timed slide positions.",
      svgType: "otto-engine",
      callouts: [
        {
          id: "oe-9",
          figureRef: "Fig. 5",
          label: "P",
          element: "Gas-slide",
          description: "The governor-controlled slide that changes gas admission duration.",
          x: 35,
          y: 70,
        },
        {
          id: "oe-10",
          figureRef: "Fig. 9",
          label: "1-4",
          element: "Cycle path",
          description: "The circle that maps slide motion to the four piston operations.",
          x: 56,
          y: 52,
        },
        {
          id: "oe-11",
          figureRef: "Fig. 13",
          label: "G / D¹",
          element: "Mixing openings",
          description: "Small openings through which gas enters the air passage as divided jets.",
          x: 57,
          y: 53,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Otto’s specification identifies the problem as a gas engine that develops heat and pressure too suddenly. He says the sudden event produces shocks and can lose useful effect through heat absorption when expansion is not rapid enough.",
    priorArtLimitations: [
      "The source says existing gas-motor engines ignite an explosive gas-and-air mixture as one charge, producing a sudden development of heat and gas expansion.",
      "The source distinguishes earlier separate introduction of gas and air, citing English Patents No. 1,655 of 1857 and 335 of 1860, and expressly disclaims that general idea.",
      "A separate upstream compressing mechanism is described as possible, but not Otto’s preferred arrangement.",
    ],
    breakthroughInsight:
      "The patent’s stated move is not simply to admit gas and air separately. It is to arrange their distribution so combustible particles are closest together at ignition and increasingly dispersed through the prior air charge, making flame travel, heat release, and pressure increase gradual.",
    patentWars: [],
    civilizationalImpact:
      "US 194,047 is an unusually detailed primary record of late nineteenth-century gas-engine reasoning: combustion distribution, mechanical timing, fuel metering, exhaust control, and the formal limits Otto placed on his own claims. That primary evidence is more useful than reducing the document to a generic automobile origin story.",
    aftermath:
      "The specification was signed June 1, 1876, filed July 13, 1876, and granted August 14, 1877. This manual edition preserves those three distinct dates and the source’s own limited claim statement.",
  },
  tags: ["Nikolaus Otto", "Gas engine", "Combustion", "Valve gear", "Governor", "Four-stroke"],
  stats: { totalClaims: 6, independentClaims: 6 },
};
