import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const crop = (number: number, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-120057-gramme-dynamo/fig-${number}.png`,
  alt: `Source-facsimile crop of ${label} from US 120,057.`,
  width,
  height,
});

const FIGURE_CROPS = {
  1: crop(1, 380, 500, "Fig. 1"),
  2: crop(2, 320, 520, "Fig. 2"),
  3: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-3-source-crop-v2.png",
    alt: "Source-facsimile crop of Fig. 3 from US 120,057.",
    width: 300,
    height: 105,
  },
  4: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-4-source-crop-v2.png",
    alt: "Tight upright source-facsimile crop of Fig. 4 from US 120,057, excluding neighboring drawing fragments.",
    width: 1140,
    height: 525,
  },
  5: crop(5, 1220, 580, "Fig. 5"),
  6: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-6-source-crop-v2.png",
    alt: "Tight upright source-facsimile crop of Fig. 6 from US 120,057, excluding the sheet title above the figure.",
    width: 440,
    height: 455,
  },
  7: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-7-source-crop.png",
    alt: "Complete source-facsimile crop of Fig. 7 from US 120,057; the source sheet physically overlaps the upper portion with Fig. 9.",
    width: 1300,
    height: 900,
  },
  8: crop(8, 1100, 650, "Fig. 8"),
  9: crop(9, 1100, 340, "Fig. 9"),
  10: crop(10, 620, 660, "Fig. 10"),
  11: crop(11, 650, 560, "Fig. 11"),
  12: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-12-source-crop-v3.png",
    alt: "Tight upright source-facsimile crop of Fig. 12 from US 120,057, excluding the neighboring Fig. 13 and witness lines.",
    width: 760,
    height: 575,
  },
  13: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-13-source-crop-v3.png",
    alt: "Tight upright source-facsimile crop of Fig. 13 from US 120,057, excluding the neighboring figure and signature lines.",
    width: 430,
    height: 610,
  },
  14: {
    src: "/patents/figures/us-120057-gramme-dynamo/fig-14-source-crop-v5.png",
    alt: "Upright source-facsimile apparatus crop of Fig. 14 from US 120,057, with the complete printed figure label and no witness block.",
    width: 1500,
    height: 930,
  },
} as const;

const FIGURE_14_LABEL_CROP = {
  src: "/patents/figures/us-120057-gramme-dynamo/fig-14-label-source-crop-v4.png",
  alt: "Upright source-facsimile crop of the printed Fig. 14 label from US 120,057.",
  width: 180,
  height: 100,
} as const;

type FigureNumber = keyof typeof FIGURE_CROPS;
type FigureReference = Extract<CuratedSpecificationInline, { kind: "reference" }>;

const figureGroup = (text: string, sheet: 1 | 2 | 3 | 4, figures: readonly FigureNumber[]) =>
  ({
    kind: "reference",
    text,
    href: `#drawing-sheet-${sheet}`,
    referenceType: "figure",
    label: `Open the source-facsimile crop for ${text} in US 120,057`,
    figurePreviews: figures.flatMap((figure) =>
      figure === 14 ? [FIGURE_CROPS[figure], FIGURE_14_LABEL_CROP] : [FIGURE_CROPS[figure]],
    ),
  }) satisfies FigureReference;

const figure1To3 = figureGroup("Figs. 1, 2, and 3", 1, [1, 2, 3]);
const figure4To6 = figureGroup("Figs. 4, 5, and 6", 1, [4, 5, 6]);
const figure7To9 = figureGroup("Figs. 7, 8, and 9", 2, [7, 8, 9]);
const figure10To13 = figureGroup("Figs. 10, 11, 12, and 13", 3, [10, 11, 12, 13]);
const figure14 = figureGroup("Fig. 14", 4, [14]);

const REFERENCE_CROPS: Record<string, readonly FigureNumber[]> = {
  "1:Figure 1": [1],
  "1:Fig. 1": [1],
  "1:Fig. 2": [2],
  "1:Fig. 3": [3],
  "1:Fig. 4": [4],
  "1:Fig. 5": [5],
  "1:Fig. 6": [6],
  "1:Figs. 1 and 2": [1, 2],
  "1:Figs. 4, 5, and 6": [4, 5, 6],
  "2:Fig. 7": [7],
  "2:Fig. 8": [8],
  "2:Fig. 9": [9],
  "2:Figs. 7 and 8": [7, 8],
  "3:Fig. 10": [10],
  "3:Fig. 11": [11],
  "3:Fig. 12": [12],
  "3:Fig. 13": [13],
  "4:Fig. 14": [14],
};

const sourceFigure = (
  text: string,
  sheet: 1 | 2 | 3 | 4,
): Extract<CuratedSpecificationInline, { kind: "reference" }> => {
  const figures = REFERENCE_CROPS[`${sheet}:${text}`];
  if (!figures) {
    throw new Error(`US 120,057 has no authored source crop for ${text} on sheet ${sheet}.`);
  }

  return {
    kind: "reference",
    text,
    href: `#drawing-sheet-${sheet}`,
    referenceType: "figure",
    label: `Open the source-facsimile crop for ${text} in US 120,057`,
    figurePreviews: figures.flatMap((figure) =>
      figure === 14 ? [FIGURE_CROPS[figure], FIGURE_14_LABEL_CROP] : [FIGURE_CROPS[figure]],
    ),
  };
};

/**
 * Continuous, manual edition of US 120,057. Every drawing sheet and every
 * specification page in the pinned nine-page PDF was inspected by the named
 * editor; this is not a cleaned OCR import. The source's spelling and its
 * broad, nineteenth-century claim language are preserved.
 */
export const grammeDynamoArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b7ffe0d2354ea69f50616261005f1265fcbab643824f0293b91fc3d2b6523895",
  preparedBy: "Classic Patents editorial agent (SunnySpring)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ZENOBE THEOPHILE GRAMME AND EARDLEY LOUIS CHARLES D’IVERNOIS, OF PARIS, FRANCE.",
        "IMPROVEMENT IN MAGNETO-ELECTRIC MACHINES.",
        "Specification forming part of Letters Patent No. 120,057, dated October 17, 1871.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 1",
      title: "Gramme and d’Ivernois magneto-electric machines, Figs. 1–6",
      description: [
        {
          kind: "text",
          text: "Four sheets—Sheet 1. Z. Th. GRAMME & E. L. Ch. d’IVERNOIS. Magneto-Electric Machines. No. 120,057. Patented Oct. 17, 1871. This source sheet contains ",
        },
        figure1To3,
        { kind: "text", text: " and " },
        figure4To6,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 2",
      title: "Gramme and d’Ivernois magneto-electric machines, Figs. 7–9",
      description: [
        {
          kind: "text",
          text: "Four sheets—Sheet 2. Z. Th. GRAMME & E. L. Ch. d’IVERNOIS. Magneto-Electric Machines. No. 120,057. Patented Oct. 17, 1871. This source sheet contains ",
        },
        figure7To9,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 3",
      title: "Gramme and d’Ivernois magneto-electric machines, Figs. 10–13",
      description: [
        {
          kind: "text",
          text: "Four sheets—Sheet 3. Z. Th. GRAMME & E. L. Ch. d’IVERNOIS. Magneto-Electric Machines. No. 120,057. Patented Oct. 17, 1871. This source sheet contains ",
        },
        figure10To13,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 4",
      title: "Gramme and d’Ivernois magneto-electric machine, Fig. 14",
      description: [
        {
          kind: "text",
          text: "Four sheets—Sheet 4. Z. Th. GRAMME & E. L. Ch. d’IVERNOIS. Magneto-Electric Machines. No. 120,057. Patented Oct. 17, 1871. This source sheet contains ",
        },
        figure14,
        { kind: "text", text: "." },
      ],
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that we, ZENOBE THEOPHILE GRAMME and EARDLEY LOUIS CHARLES D’IVERNOIS, of Paris, in the Empire of France, have invented Improvements in Magneto-Electric Machines; and we do hereby declare that the following is a full and exact description thereof, reference being had to the accompanying drawing and to the letters of reference marked thereon, corresponding parts being marked in the various figures as much as possible by the same letters.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "These improvements in magneto-electric machines consist in arranging them in such manner as to allow of giving rise to induction-currents, which may be made either continuous, viz., flowing in a continuous manner and in the same direction, or be alternate, viz., flowing alternately in opposite directions, in both cases without the medium of ",
        },
        {
          kind: "term",
          text: "circuit-breakers, pole-changers, or commutators",
          definition:
            "Mechanical switching devices. The inventors distinguish their ring-and-contact arrangement from a conventional device that interrupts or reverses a circuit.",
          label: "Period electrical terms",
        },
        {
          kind: "text",
          text: ", but merely by coiling round a core of soft iron or other suitable magnetic material a wire of copper, or other good conductor of electricity, forming the entire into an ",
        },
        {
          kind: "term",
          text: "endless bobbin",
          definition:
            "A continuous closed series of connected coils around a ring or cylinder, with no free terminal end in the coil series.",
          label: "Source construction term",
        },
        {
          kind: "text",
          text: ", viz., in the shape of a cylinder, ring, or other suitable analogous or endless form, the wire being provided at suitable intervals with metal rods or conductors for allowing the proper exit of the electric current generated, when the said bobbin is caused to be magnetized by the poles of one or more permanent or electro-magnets, so as to give rise to the production in the wire and the progressive displacement or flow of the electric current without interruption or demagnetizing.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "In order to make the invention more easily and clearly understood, we will now describe some of the various magneto-electric machines which may be constructed according to the just-described principle.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If, on the outside of a solid or a hollow core of soft iron or other suitable magnetic material, made into a cylinder, ring, or other similar endless shape, be coiled a wire of copper or other good electric conductor into a series of properly-isolated helices, and so as to form a series of small bobbins, the terminal end of the wire of each of which is soldered or otherwise connected in a metallic manner to the end of the following one; a metal rod or conductor being also soldered at each of these junctions, and the entire series of small bobbins being consequently arranged so as to form one large endless bobbin, viz., without free end, presenting the shape of a cylinder, ring, or other similar endless shape; and if, as has been just mentioned, at the junction-points or ends of the wire of each two successive small bobbins be soldered a metal rod for allowing at the required moment the outflow or exit of the electric current; and if now the said cylinder, ring, or endless large bobbin be situated between and caused to revolve suitably near to the poles of one or more either permanent or electro-magnets, having their poles alternately in opposition to each other, no noticeable electricity or induction-currents will be developed in those parts of the bobbin which, at the time being, are not situated exactly opposite the poles of each of the magnets, but such induction-currents will be developed without interruption in those parts of the wire which at the said moment are situated exactly opposite each pole of the magnets, each of which currents will flow in the wire in the direction required for meeting the current of a similar name produced at the same moment in the wire by its passing before the next dissimilar pole, and which current of similar name will likewise flow in the direction required for meeting the first current; in consequence of which the two currents will meet and combine together in a part of the wire situated between the two dissimilar poles which developed them; and if, consequently, between these two poles be situated a metal rubber (either a spring, roller, or other analogous appropriate contrivance) which, at the moment the conducting-rods are, by the rotation of the bobbin, carried opposite the two dissimilar poles, touches the said rods, the two currents taken from these rubbers will flow in the same direction and in a continuous manner, there being constantly the same quantity of conducting-wire into action before the two poles, provided these latter be of the same size and power.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If the cylinder or large bobbin revolves from left to right the current taken from a rubber situated (comparatively to the direction in which the bobbin is revolving) between a north and a south pole will be a positive one, if the coils of the conducting-wire are wound right-handed; whereas, in the same case, if taken from a rubber situated between a south and a north pole the current will be a negative one. Of course, the contrary would be the case if the bobbin was revolving in the opposite direction, or if the helix of the conducting-wire was a left-handed one.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Figure 1", 1),
        {
          kind: "text",
          text: " of the annexed drawing represents a vertical projective view of a magneto-electric machine, constructed according to the above-described principles; ",
        },
        sourceFigure("Fig. 2", 1),
        { kind: "text", text: " shows a vertical section, and " },
        sourceFigure("Fig. 3", 1),
        { kind: "text", text: " a view of a detached part. See " },
        figure1To3,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The apparatus consists of two fixed compound permanent magnets, H H, acting on good conducting-wires or coils closely surrounding, in an isolated manner, a hollow or a solid cylinder, ring, or core, A, of soft iron, so as to form a large endless bobbin fixed by means of the bosses F and G, of wood or other bad conductor of electricity, on a revolving shaft or arbor, D.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The core might be formed of a suitable number of soft-iron wires or coils cemented together by resin or other suitable cement; and the conducting-wires are wound round the core in such manner as to form thirty-six small bobbins, all of them coiled in the same direction and connected together into one large endless bobbin by soldering the end of the wire of each of them to the end of the wire of the next one and soldering to each of these junctions a metal rod or conductor, C, two of which are shown in the cross-sectional view, ",
        },
        sourceFigure("Fig. 2", 1),
        {
          kind: "text",
          text: ". The thirty-six small bobbins consequently present thirty-six junctions and thirty-six conductors C, kept duly isolated from each other and pressed in positions between the bosses F and G.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Metal rubbers or conducting-springs S S are allowed to press against the free ends of the conductors C, which ends are fixed in position by tubes t t, one of which is soldered to the frame B and the other to an isolated cross-bar, V, while the pressure of the rubbers S S is regulated by levers R, screws and springs, or in any other suitable manner. The frame B, of brass, carries the bearings for the shaft D.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The two magnets H in this apparatus may be considered as a single one, their similar poles being situated side by side; they are screwed to the frame B and to brass plates E, carrying the bearings of a spindle, J, provided with a winch-handle, I, and pulley K, for transmitting the required revolving motion to the shaft by a pulley, N, and string M, or in any other suitable manner.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The shaft D carries a spur-wheel, O, against which presses a metal rubber, kept isolated in the frame B and communicating with the cross-bar V, and which may be made use of when the apparatus is to serve for producing physiological shocks.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The mode of acting of the apparatus may be explained as follows: Supposing the revolving motion of the cylinder A to take place in the direction of the arrow a′, ",
        },
        sourceFigure("Fig. 1", 1),
        {
          kind: "text",
          text: ", and the north pole to be situated at the left-hand side and the south pole at the right-hand side of this figure, the positive current developed in each small bobbin at the moment it passes before the north pole will flow from this bobbin to the next one situated in the direction from left to right; whereas the positive current developed in each bobbin when passing before the south pole will pass to the next bobbin situated in the direction from right to left; and these two similar currents thus flowing in opposite directions through the series of bobbins will meet in the bobbin which at that moment is arrived at the top, as will be readily understood by the arrows g and i; and this bobbin communicating in that moment with the rubber S, the said two positive currents will combine and leave the cylinder A by this rubber S if the electric circuit be closed; and if the revolution of the cylinder is continued without interruption the flow of these currents will take place likewise without interruption, viz., in a continuous manner.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The same effect, but in the opposite direction, will take place with the two negative currents, which will likewise take their exit from the cylinder or endless bobbin A by the rubber S′.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Fig. 4", 1),
        {
          kind: "text",
          text: " shows a vertical, and ",
        },
        sourceFigure("Fig. 5", 1),
        { kind: "text", text: " a horizontal projection, and " },
        sourceFigure("Fig. 6", 1),
        {
          kind: "text",
          text: " a vertical section of another construction of magneto-electric machine arranged according to our invention. See ",
        },
        figure4To6,
        {
          kind: "text",
          text: ". The same consists of six fixed compound permanent magnets which, three by three, have their similar poles connected together so as to form what may be considered two magnets.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A is the endless revolving cylinder, ring, or large bobbin of the above-described construction, viz., consisting of an uninterrupted series of small bobbins, the coils of which are connected, as has been described, so as to form one continuous wire, each of the junctions being provided with a conducting-rod, C. A suitable revolving motion may be given to the cylinder A by the shaft D, on which the cylinder is fixed by means of a brass wheel, E, and intermediate wooden boss, G.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The shaft D receives a suitable revolving motion in its bearings B by means of a pulley or other suitable mechanical arrangements, and the seventy-two conductors C are kept fixed between two disks, F and J, of wood or other suitable bad conducting material. The currents are taken from the conductors C by four metal rubbers or springs, S, two of which are fixed to the frame B and the third one to a standard, V, fixed on the wooden bed-plate K, and the fourth one in a pendant V′, fixed to a brass arm L.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The two permanent magnets H have their dissimilar poles situated in the same horizontal plane, and they are fixed in position by the arm L and the wooden standards P, and they are fixed by brass bolts O to the bed-plate K. The bearings B are held in position by the standards P.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If in this arrangement the cylinder or large endless bobbin A be caused to revolve from left to right, each of the two rubbers carried by the bearings or frame B will take up a negative current, and each of the two other rubbers a positive current.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "It will be understood that, if wished, the cylinder A might be magnetized by eight poles instead of by four, which would consequently require eight rubbers; also, that any other suitable number of cylinders fixed on the same shaft D, and of permanent magnets, might be made use of, and that the latter might be replaced by electro-magnets.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Fig. 7", 2),
        {
          kind: "text",
          text: " represents a vertical projection; ",
        },
        sourceFigure("Fig. 8", 2),
        { kind: "text", text: " a horizontal section, and " },
        sourceFigure("Fig. 9", 2),
        {
          kind: "text",
          text: " a modification of parts of another construction of magneto-electric machine, arranged according to our invention. See ",
        },
        figure7To9,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The apparatus consists of two revolving disks, A A′, arranged as has been described in reference to ",
        },
        sourceFigure("Figs. 4, 5, and 6", 1),
        {
          kind: "text",
          text: ", and fixed on the shaft D, which revolves in bearings situated in a brass frame, J. Each of the disks consists of a series of small bobbins, connected in the same manner as those of the cylinder A of ",
        },
        sourceFigure("Figs. 4, 5, and 6", 1),
        {
          kind: "text",
          text: ", and the conducting-rods C are fixed between wooden or other suitable non-conducting disks, F and G. The currents are taken by six rubbers or springs, S, fixed to the frame J and to the insulated carriers V.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The electro-magnets are formed of twelve short bobbins, six of which are situated on one side and the other six on the opposite side of the apparatus, one end of the iron bars of which magnets are bolted to two hexagonal pieces, P and P′, whereas at the opposite end they are connected in pairs by armatures B, see ",
        },
        sourceFigure("Figs. 7 and 8", 2),
        {
          kind: "text",
          text: ", and they are coupled in such manner that the armatures B connect similar poles, and that over the periphery each electro-magnet has a dissimilar pole, in consequence of which the armatures B form the poles of the electro-magnets, and the disks A and A′ are only magnetized by three north and three south poles.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The two armatures B of the inferior magnets H are fixed to two pieces of brass, L, bolted to the wooden bed-plate K, and all the armatures B are united by brass plates I, forming a circular groove so as to conceal part of each of the disks A and A′.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The hexagonal parts P and P′ are, by preference, made of annealed cast-iron, and form the bearings for the shaft D, and in the interior angles of these hexagons the rubber-carriers V are fixed on any suitable isolating material, on the continuation of which carriers are situated the posts X.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The apparatus consequently presents six rubbers, S, three of which allow the exit of the positive and the three others of the negative current, part of which currents is employed for charging the electro-magnets, while the remainder of the currents may be applied to any suitable industrial or other purpose. The electro-magnets are made of iron fit for retaining the magnetism.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "It will be readily understood that in this arrangement also the number of electro-magnets may, if wished, be either increased or diminished; that instead of the disks a cylinder, A, might be made use of, viz., as shown in ",
        },
        sourceFigure("Fig. 9", 2),
        {
          kind: "text",
          text: "; or that one or more of the disks might be done away with; and that by making use of a cylinder, A, ",
        },
        sourceFigure("Fig. 9", 2),
        {
          kind: "text",
          text: ", this latter might be kept fixed, and instead the electro-magnets be caused to rotate in the interior of it for magnetizing from the inside.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Fig. 10", 3),
        {
          kind: "text",
          text: " represents a vertical projection, and ",
        },
        sourceFigure("Fig. 11", 3),
        {
          kind: "text",
          text: " a horizontal section of another construction of magneto-electric machine arranged according to our invention. See ",
        },
        figure10To13,
        {
          kind: "text",
          text: ". H are four fixed straight permanent magnets connected together by an iron plate, B, and two revolving cylinders, A A′, arranged as has been described in respect to the two first apparatuses, and fixed on the shaft D by a wooden boss, G. Each of the cylinders forms twenty small bobbins, and have their wires all wound in the same direction.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal("The bobbins of the cylinder A are connected to those of the cylinder A′."),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "For this purpose the final end of one of the bobbins of the cylinder A′ is fixed to a ring, c′, communicating, by means of the conductor I′, with the shaft D; and the final end of one of the bobbins of the cylinder A is screwed to the ring c communicating, by means of the conductor I, with a small cylindrical rod, S, kept isolated within the shaft D, against the end of which metal rod S presses a spring, R, carried by the cross-bar V properly isolated.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Each of the magnets H is composed of six blades, suitably fitted and screwed in the notches of the annealed-iron armatures E, which partly envelop the cylinders A and A′. In order to increase the magnetizing surface they are fixed to the brass frame J which carries the bearings for the shaft D.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The two poles which are to magnetize the cylinder A are north ones, and those for magnetizing the cylinder A′ are south ones; consequently the induced currents they develop in the bobbins of the cylinder A, when these bobbins successively pass before them, will flow in the same direction.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The same will be the case for the currents developed in the bobbins of the cylinder A′, but they will flow in an opposite direction to those of the bobbins of the cylinder A, in consequence of which, and of the manner in which the bobbins are connected, the positive currents will flow to the ring c, if the cylinders revolve from right to left; whereas the negative currents will reach the ring c′, while the positive current is conducted to the post X carried by the cross-bar V, and the negative one to the post X′ connected to the frame J.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "By suitably increasing the diameter of the cylinders they might, if wished, become magnetized by several poles of the magnets.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Fig. 12", 3),
        {
          kind: "text",
          text: " shows a longitudinal vertical projection, and ",
        },
        sourceFigure("Fig. 13", 3),
        {
          kind: "text",
          text: " an end vertical projection of another construction of magneto-electric apparatus arranged according to our invention. See ",
        },
        figure10To13,
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The same consists, first, of two fixed straight permanent magnets, H, each of them formed of a series of straight bars of soft iron or other suitable magnetic material; secondly, a series of eight fixed hollow bobbins, B; and, thirdly, of two movable endless chains, A and A′, carried by pulleys E fixed on the shafts D and D′ revolving in bearings in the wooden frame J.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The links of the chains A and A′ are formed of soft iron, preferably small plates turning on pivots; or they may be made of iron wire or superposed iron strips or ribbons. Each chain moves through four hollow bobbins, B, between the poles of two permanent magnets, H, each of which latter is formed of a suitable number of blades or rods connected together in such manner as to have three of them situated on each flat side of the chains, but without actually touching them.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The magnets are fixed in the frame J, and in such manner that the similar poles of them magnetize the same chain; and the bobbins B are fixed to the magnets H and to the frame J by means of brass plates G and bolts I.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If, now, by means of the pulley N, a suitable revolving motion be imparted to the two chains, a continuous current will be developed in each bobbin, the direction of the flow of which currents depends, first, on the direction in which the conducting-wire is coiled on the bobbins; secondly, on the direction in which the motion of the chains takes place; and, thirdly, on the nature of the poles which magnetize each chain.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "This arrangement affords great facility for coupling the bobbins for obtaining either tension or quantity and for taking the currents, each bobbin producing continuous currents, and they being all fixed and situated on the outside of the machine. Each of the bobbins B may have its two ends situated between two poles of the same name, which allows, by increasing the size of the chains and other parts, of making use of any suitable number of magnets and bobbins.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The permanent magnets might be replaced by electro-magnets to be magnetized by currents taken from part of the bobbins.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        sourceFigure("Fig. 14", 4),
        {
          kind: "text",
          text: " represents a longitudinal elevation view, some parts being shown as partly removed, of another construction of apparatus arranged according to our invention. See ",
        },
        figure14,
        {
          kind: "text",
          text: ". On a wooden or other bad conducting bed-plate, K, is fixed a permanent or an electro-magnet, H, having additional poles h and h′, of a circular shape, so as to correspond with that of the cylinder or endless large bobbin A.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The said poles are kept isolated from each other by means of the bad conducting parts i and i′ and the bobbin or cylinder A is arranged, as has been described above, in reference to the apparatus of ",
        },
        sourceFigure("Figs. 1 and 2", 1),
        {
          kind: "text",
          text: ", viz., composed of a continuous series of small bobbins connected end to end, the junctions being each connected to a conductor C, which conductors are kept isolated from each other; on the free ends of which conductors act the rubbers or connecting-rollers S and S′ for carrying the currents respectively to the posts X and X′.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The cylinder or large bobbin A revolves by means of the shaft D in standards B, and motion may be transmitted to the shaft D by means of a winch-handle, I, and pulleys or other suitable mechanical contrivances. A² represents the soft-iron core of the cylinder, ring, or large endless bobbin A.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "As has been mentioned in the beginning of this specification, our invention allows of giving rise either to continuous or to alternate currents. Thus, for instance, in the second apparatus described, in respect to ",
        },
        sourceFigure("Figs. 4, 5, and 6", 1),
        {
          kind: "text",
          text: ", if the conductors C and metal rubbers or conducting-springs S be done away with, and the shaft D be connected metallically with two diametrically-opposite junctions of the small bobbins of the cylinder A, the said small bobbins remaining connected in an endless manner, as has been described; and if, in the manner as shown in ",
        },
        sourceFigure("Fig. 11", 3),
        {
          kind: "text",
          text: ", we connect together by a metal conductor a small rod, inserted in an isolated manner in the shaft D, two other diametrically-opposite junctions situated in a perpendicular direction in respect to the two first-mentioned junctions, we will then obtain alternate currents—the current taken from the frame B in metallic communication by means of its bearings with the shaft D, and that taken from a metal rubber pressing against the end of the small isolated rod inserted in the shaft D being alternate.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The small bobbins of " },
        sourceFigure("Figs. 4, 5, and 6", 1),
        {
          kind: "text",
          text: " are coupled together for quantity, they representing four series of eighteen bobbins each.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If wished to couple them for tension, let us consider for a moment each series as forming only one bobbin; we then have to connect the end of the conductor terminating the first series with that forming the beginning of the third series, and the terminating end of this latter to the terminating end of the second series, the beginning end of this latter to the terminating end of the fourth series, the beginning end of this latter to the shaft D, and the beginning end of the first series with the rod kept isolated within the shaft D.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The said alternate currents might, in the same manner as is done in other magneto-electric machines, be carried in the same direction by pole-changers or commutators.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Various other modifications might be made in the above-described apparatus or others based on the principles of our invention. Thus, for instance: First, the conducting wire or wires forming the coils or helices of the cylinder or large endless bobbin may be replaced by strips or ribbons of suitable conducting material, the said coils being kept duly isolated from each other.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Secondly, the rubbers may be arranged for allowing of replacing the magnets or electro-magnets by a fixed hollow cylinder of soft iron or other suitable magnetic material covered with a continuous series of small bobbins similar to those of the cylinder A, and within which hollow cylinder the cylinder A would be made to revolve. The fixed cylinder might serve as one or more electro-magnets.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The small bobbins being connected in the same manner as those of the cylinder A—viz., so as to form one large continuous bobbin without free end—if at one of the junctions a current be allowed to enter and take its exit by a diametrically-opposite junction, the fixed cylinder will thereby become two dissimilar poles; whereas if the current be caused to enter by two diametrically-opposite junctions, and to take its exit likewise by two diametrically-opposite junctions, the diameters of which are situated perpendicularly to each other, the fixed cylinder will have four alternately-dissimilar poles.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The thus-modified apparatus would constitute a cylinder or large endless bobbin, revolving in the interior of another fixed one, the latter acting as an electro-magnet magnetized by a portion of the currents taken from the rubbers of the first one, and it would be the magnetism of the wire of the fixed bobbin re-enforced by the magnetism of its iron core, which would act on the revolving bobbin.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A suitable number of the small bobbins constituting the large fixed bobbin might be replaced by a stout iron bar or wire so as to carry the poles of the iron core nearer to the movable large bobbin.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Thirdly, several movable cylinders or large bobbins might be applied on the same shaft, one of which bobbins might serve for giving off continuous currents to be made use of for magnetizing the electro-magnets which replace the permanent ones; whereas the remainder of the bobbins might give off alternate currents to be made use of for the production of electric light or for other industrial, physiological, or other purposes.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Fourthly, the general arrangement of our apparatus may also be modified in various manners; thus, for instance, instead of causing the cylinder or large bobbin A of the apparatus of ",
        },
        sourceFigure("Figs. 1 and 2", 1),
        {
          kind: "text",
          text: " to revolve, a magnet might be caused to revolve at the inside or at the outside of this bobbin.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "What we consider to be novel and original, and therefore more particularly claim as our invention, is—",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The employment, in magneto-electric machines, of one or more cylinders, rings, or large endless bobbins arranged and constructed in the manner as has been above described, viz., made into a circular or other suitable endless shape, and consisting of a series of small bobbins or wires enveloping a core of soft iron or other good magnetic material, and connected together end to end in a continuous series, the said endless large bobbin or bobbins or cylinders situated between or in opposition to the poles of fixed or movable permanent or electro-magnets, for the purpose of allowing the production of continuous induction-currents in the conducting-wires, strips, or ribbons of brass or other good conducting metal enveloping the magnetic material, in which wires, strips, or ribbons a continuous displacement of the magnetism takes place without demagnetizing.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "The arrangements described for allowing of giving rise to alternate or opposite instead of continuous currents.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "The general arrangement and combination of parts of the various above-described magneto-electric apparatuses employed for any industrial, physiological, or other purposes for which electric currents may be made use of, substantially as described and illustrated in the annexed drawing and for the purposes set down.",
      ),
    },
    { kind: "paragraph", inlines: literal("ZENOBE THEOPHILE GRAMME.") },
    { kind: "paragraph", inlines: literal("EARDLEY LOUIS CHARLES D’IVERNOIS.") },
    { kind: "paragraph", inlines: literal("Witnesses: A. G. BRADE, AUGUSTE MEDARD.") },
  ],
};

/**
 * Renderer-ready, explicitly authored companions, keyed directly to the
 * zero-based indexes of paragraph blocks above. Each entry keeps the source
 * paragraph's mechanism, stated conditions, figure links, and legal effect.
 */
export const grammeDynamoParallelReadings: Readonly<Record<number, readonly string[]>> = {
  5: [
    "This conventional salutation opens the specification. It supplies no machine part, operating condition, or legal limitation.",
  ],
  6: [
    "Gramme and d’Ivernois identify both inventors and their Paris location in the Empire of France. They make the drawing and its recurring reference letters part of the full description, so a reader must use the source sheets with the text.",
  ],
  7: [
    "The proposed machines use a closed ring, cylinder, or equivalent endless coil around soft iron. Fixed contacts collect current at selected junctions as the coil passes permanent or electromagnet poles. The asserted result is a continuous or alternating induction current without the named circuit breakers, pole changers, or commutators; that absence is a stated mechanism, not a claim that no contact is used.",
  ],
  8: [
    "This is a transition. The inventors say that the following several constructions are examples made according to the already stated endless-bobbin principle.",
  ],
  9: [
    "This paragraph gives the general current-combining mechanism. Successive insulated coils are connected end-to-end round a soft-iron ring and each junction carries a conductor. Only coils opposite magnet poles induce appreciably; currents of like name reach a space between unlike poles, combine at a spring, roller, or other metal rubber touching the passing conductors, and leave continuously while equal pole strength keeps the active wire quantity constant.",
  ],
  10: [
    "For a left-to-right rotor with right-handed windings, a contact between north then south takes positive current and a contact between south then north takes negative current. Reverse either rotor direction or winding handedness and the stated polarity reverses. This fixes the source’s orientation condition rather than a universal sign convention.",
  ],
  11: [
    "Figures 1, 2, and 3 on source drawing sheet 1 show the first construction: a vertical projection, vertical section, and detached part. Their figure references identify the pictured machine to which the following letters belong.",
  ],
  12: [
    "In the first machine, fixed compound magnets H H act on isolated conducting coils around hollow or solid soft-iron core A. Wooden or other insulating bosses F and G carry the resulting endless bobbin on rotating shaft D. The passage identifies both magnetic field, armature core, insulation, and moving support.",
  ],
  13: [
    "The source permits a resin-cemented bundle of soft-iron wires or coils as core. It specifies thirty-six same-handed small coils joined end-to-end, with conductor C at every joint; Fig. 2 shows two in section. Thus there are thirty-six isolated junction conductors between bosses F and G, an explicit count and electrical segmentation.",
  ],
  14: [
    "Metal rubbers or conducting springs S S press on conductors C. Tubes t t locate their ends, one connected to brass frame B and one to isolated cross-bar V; levers R, screws, or springs regulate pressure. Frame B also bears shaft D, so the contacts are mechanically supported and one is electrically isolated.",
  ],
  15: [
    "The two H magnets may be treated as one compound magnet because like poles sit side by side. They attach to frame B and brass plates E, which bear spindle J with winch I and pulley K; pulley N and string M transmit rotation to D. This is the stated hand or belt drive path.",
  ],
  16: [
    "Shaft D also has spur wheel O. An insulated metal rubber pressed against it communicates with cross-bar V and may be used when the apparatus produces physiological shocks. The passage states a possible output use, not an added claim limitation.",
  ],
  17: [
    "For Fig. 1’s indicated rotation, north lies left and south right. A positive current induced at north travels rightward to the next coil, while a positive current induced at south travels leftward; the like currents meet in the top coil and, at contact S, combine and leave A if the external circuit is closed. Continuing rotation gives uninterrupted output, which is the detailed causal account behind the continuous-current assertion.",
  ],
  18: [
    "The same combining action occurs for the two negative currents in the opposite direction. They leave the endless bobbin through S′, preserving the distinct negative outlet rather than merging it with S.",
  ],
  19: [
    "Figures 4, 5, and 6 on source drawing sheet 1 are a second construction in vertical projection, horizontal projection, and vertical section. It has six fixed compound permanent magnets, joined three by three at like poles to form what the text regards as two magnets.",
  ],
  20: [
    "A is again the continuous ring or cylinder of small coils, with conducting rod C at every junction. Shaft D rotates it, fixed through brass wheel E and insulating wooden boss G. The passage carries forward the endless-bobbin construction and specifies its mounting.",
  ],
  21: [
    "Shaft D is driven through its bearings B by pulley or another mechanical arrangement. Seventy-two conductors C are insulated between wooden or other nonconducting disks F and J; four spring rubbers take current, two on frame B, one on standard V at bed-plate K, and one on pendant V′ at brass arm L. The contacts and their placement are explicit.",
  ],
  22: [
    "The two H magnets present unlike poles in one horizontal plane. Arm L, wooden standards P, brass bolts O, and bed-plate K fix them, while standards P hold bearings B. This paragraph is the field and support geometry for the second construction.",
  ],
  23: [
    "With A rotating left to right, the two rubbers on bearings or frame B take negative current and the other two take positive current. The source assigns polarity by contact position for this particular arrangement.",
  ],
  24: [
    "The inventors permit eight poles, which would require eight rubbers, and any other suitable number of cylinders on shaft D and permanent magnets. They also allow electro-magnets in place of permanent magnets; these are expressly contemplated variants.",
  ],
  25: [
    "Figures 7, 8, and 9 on drawing sheet 2 show the next construction: vertical projection, horizontal section, and a parts modification. The source makes those three views the visual reference for the following disk machine.",
  ],
  26: [
    "This machine has rotating disks A and A′ on shaft D in brass frame J. Each disk repeats the Fig. 4–6 small-bobbin connection, with rods C between insulating disks F and G. Six rubbers S, mounted on J and insulated carriers V, collect the currents.",
  ],
  27: [
    "Twelve short electromagnet bobbins, six on each side, have iron bars bolted to hexagonal P and P′ and paired at the other end by armatures B. The armatures connect like poles, but the periphery alternates pole type, so they form the operative poles and magnetize disks A and A′ with three north and three south poles.",
  ],
  28: [
    "The lower armatures B attach through brass pieces L to wooden bed-plate K. Brass plates I unite all armatures and make a circular groove that conceals part of disks A and A′. These are physical retaining and field-structure details.",
  ],
  29: [
    "Annealed cast-iron hexagons P and P′ are preferred as shaft-D bearings. Insulated rubber carriers V sit in their interior angles and continue to output posts X; the source couples insulation, brush support, and output terminals.",
  ],
  30: [
    "Six rubbers S provide three positive and three negative exits. Part of the current charges the electromagnets and the remaining current can serve industrial or other work; the iron is selected to retain magnetism. This expressly describes self-excitation from a portion of output, without claiming a quantified division.",
  ],
  31: [
    "The number of electromagnets may rise or fall. Disks may be replaced by cylinder A of Fig. 9, disks may be omitted, and with that cylinder fixed, the electromagnets may rotate inside it to magnetize from within. The variants preserve the field/closed-bobbin relationship while changing which member rotates.",
  ],
  32: [
    "Figures 10 and 11 on drawing sheet 3 show another construction in vertical projection and horizontal section. Four fixed straight H magnets connect by iron plate B; two rotating cylinders A and A′ are fixed to shaft D by wooden boss G, and each contains twenty same-handed small bobbins.",
  ],
  33: [
    "The small bobbins of cylinder A connect to those of A′. This is the short but essential series-connection statement for the twin-cylinder construction.",
  ],
  34: [
    "The terminal of A′ goes to ring c′ and through I′ to shaft D. The terminal of A goes to ring c and through I to isolated rod S inside D; spring R on insulated cross-bar V presses that rod. The stated ring, rod, and spring connections separate the two output paths.",
  ],
  35: [
    "Each H magnet has six blades in annealed-iron armatures E that partly surround A and A′. They attach to brass frame J, which carries D’s bearings, to enlarge the magnetizing surface around the rotating cylinders.",
  ],
  36: [
    "The two poles magnetizing A are north and those magnetizing A′ are south. Therefore currents induced in successive A coils flow in the same direction; the polarity assignment is the condition for the later combined output.",
  ],
  37: [
    "A′ produces currents opposite to A’s. Given their connections, a right-to-left rotation sends positive current to ring c and negative current to c′, while positive reaches post X on cross-bar V and negative reaches X′ on frame J. The paragraph states direction, polarity, rings, and terminal effects together.",
  ],
  38: [
    "Increasing cylinder diameter permits magnetization by several magnet poles. It is an explicitly stated geometric scaling option, not a change to the endless-coil principle.",
  ],
  39: [
    "Figures 12 and 13 on drawing sheet 3 show another magneto-electric apparatus in longitudinal vertical and end vertical views. They are the visual reference for the fixed-bobbin, moving-chain arrangement that follows.",
  ],
  40: [
    "This arrangement has two fixed straight H magnets made from straight soft-iron bars, eight fixed hollow bobbins B, and two moving endless chains A and A′ on pulleys E carried by shafts D and D′ in wooden frame J. The passage identifies all three major systems.",
  ],
  41: [
    "Links of A and A′ may be pivoted soft-iron plates, wire, or stacked strips/ribbons. Each chain passes through four hollow bobbins B between two H magnets whose blades place three members on each flat chain side without touching. The air gap and moving magnetic links are stated limits.",
  ],
  42: [
    "Magnets are fixed in frame J so like poles magnetize the same chain. Brass plates G and bolts I fix bobbins B to magnets H and the frame. This makes bobbins stationary while the soft-iron chain moves through their fields.",
  ],
  43: [
    "Driving both chains with pulley N develops a continuous current in every bobbin. Its direction depends on winding direction, chain-motion direction, and the pole nature magnetizing each chain; all three conditions are retained.",
  ],
  44: [
    "Because the fixed exterior bobbins each make continuous current, they can be coupled for tension or quantity and tapped readily. Their ends may lie between same-name poles, and enlarging the chains and other parts permits any suitable number of magnets and bobbins.",
  ],
  45: [
    "Permanent magnets may be replaced by electromagnets energized from part of the bobbin current. This is a stated excitation alternative, not a claim of any particular field circuit.",
  ],
  46: [
    "Figure 14 on drawing sheet 4 is a partly removed longitudinal elevation of another construction. Permanent or electromagnet H sits on insulating bed-plate K and has circular additional poles h and h′ shaped to match endless bobbin A.",
  ],
  47: [
    "Insulating parts i and i′ keep those poles separate. A repeats the Fig. 1–2 continuous small-bobbin series, with isolated conductor C at each joint; rubbers or rollers S and S′ act on conductor ends and carry current to posts X and X′ respectively.",
  ],
  48: [
    "Shaft D turns A in standards B, driven by winch I, pulleys, or another mechanical device. A² is the soft-iron core of the ring/cylinder/large endless bobbin, an explicit designation of the interior magnetic material.",
  ],
  49: [
    "The Fig. 4–6 construction can produce alternating instead of continuous current: remove conductors C and springs S, connect D to two opposite coil junctions, then use an isolated rod in D to connect the other opposite pair at right angles as Fig. 11 shows. Current from frame B/shaft D and from a rubber on that rod is then alternating. The conditions and output points are all part of the stated alternate-current arrangement.",
  ],
  50: [
    "The Fig. 4–6 small coils are coupled for quantity in four series of eighteen bobbins each. This is a specific connection mode, distinct from the tension coupling that follows.",
  ],
  51: [
    "For tension, treat each eighteen-bobbin series as one bobbin. The source prescribes an exact chain of joins: end of first to beginning of third, end of third to end of second, beginning of second to end of fourth, beginning of fourth to shaft D, and beginning of first to the isolated rod within D.",
  ],
  52: [
    "The described alternating currents may be put into one direction by pole-changers or commutators as in other magneto-electric machines. The passage allows that later rectification step even though the opening continuous-current arrangement emphasized avoiding those devices.",
  ],
  53: [
    "First modification: replace coil or helix wires on the large endless bobbin with conducting strips or ribbons, while keeping the separate coils isolated. Claim 1 expressly includes wires, strips, and ribbons in its broad material language.",
  ],
  54: [
    "Second modification: a fixed hollow soft-iron cylinder bearing a continuous small-bobbin series may replace the magnets, with cylinder A rotating inside it. The fixed cylinder may serve as one or more electromagnets, preserving the concentric moving/fixed relationship.",
  ],
  55: [
    "With its small bobbins joined into one endless series, the fixed cylinder gets two unlike poles if current enters at one junction and exits at the diametrically opposite one. It gets four alternating unlike poles if entry and exit each use opposite pairs whose diameters are perpendicular. The passage gives the precise feed geometry for pole count.",
  ],
  56: [
    "That modification has a rotating endless bobbin inside a fixed endless bobbin. A portion of current from the first bobbin’s rubbers energizes the fixed electromagnet; its coil magnetism reinforced by its iron core then acts on the rotating bobbin. This describes a self-excited concentric-machine possibility.",
  ],
  57: [
    "Some fixed-cylinder small bobbins may be replaced by stout iron bar or wire to bring the iron-core poles closer to the moving endless bobbin. This is a stated magnetic-circuit proximity modification.",
  ],
  58: [
    "Third modification: several moving rings/cylinders may share a shaft. One may furnish continuous current to magnetize replacement electromagnets while others furnish alternating current for electric light, industrial, physiological, or other use. It preserves the different current roles and intended uses.",
  ],
  59: [
    "Fourth modification: instead of rotating endless bobbin A of Figs. 1–2, rotate a magnet inside or outside it. The claimed architecture therefore is not confined to rotation of the ring itself.",
  ],
  60: [
    "This is the formal transition to the three numbered claims. It announces that the following legal language defines what the inventors regard as novel and original.",
  ],
  64: [
    "This printed signature identifies Zenobe Theophile Gramme as one of the two inventors who made the specification and claims.",
  ],
  65: [
    "This printed signature identifies Eardley Louis Charles d’Ivernois as the co-inventor. It corrects any catalog treatment that attributes the grant to Gramme alone.",
  ],
  66: [
    "A. G. Brade and Auguste Medard are the printed witnesses. The closing preserves their names as source matter and adds no technical or legal limitation.",
  ],
};
