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

const sourceSheetPreview = (figure: string, description: string) => ({
  src: "/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png",
  alt: `Complete unmodified source drawing sheet from US 247,804, including ${figure}: ${description}`,
  width: 2320,
  height: 3408,
});

const FIGURES = {
  "Fig. 1": sourceSheetPreview("Fig. 1", "the printed perspective view on the smaller scale"),
  "Fig. 2": sourceSheetPreview("Fig. 2", "the printed vertical-section view of the apparatus"),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 247,804`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * A continuous, manually prepared reading edition of the complete three-sheet
 * US 247,804 facsimile. The source's printed figure labels and its written
 * figure-description sentence disagree; both are preserved and disclosed.
 */
export const delavalSeparatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "aa9e284bf20a53467a36a3ae648c7ce5bc4b9599837af32281e04b316b5ef187",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GUSTAF DE LAVAL, OF STOCKHOLM, SWEDEN.",
        "CENTRIFUGAL CREAMER.",
        "SPECIFICATION forming part of Letters Patent No. 247,804, dated October 4, 1881.",
        "Application filed July 31, 1879. Patented in England November 4, 1878, in France March 5 and June 30, 1879, in Belgium June 27, 1879, and in Italy June 30, 1879.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-2",
      title: "Source-labelled perspective and vertical-section drawings",
      description: [
        { kind: "text", text: "The drawing sheet labels the perspective " },
        figure("Fig. 1"),
        { kind: "text", text: " and the vertical-section " },
        figure("Fig. 2"),
        {
          kind: "text",
          text: ". The later printed figure-description sentence reverses those two labels. This edition preserves that discrepancy rather than silently correcting the source.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, GUSTAF DE LAVAL, of the city of Stockholm, Kingdom of Sweden, have invented certain new and useful Improvements in Apparatus for Separating Fluids by Centrifugal Force, of which the following is a specification.",
    ),
    paragraph([
      {
        kind: "text",
        text: "My invention relates to apparatus for separating mixed fluids of different ",
      },
      term(
        "specific gravities",
        "Relative densities: the source distinguishes a heavier fluid portion from a lighter one.",
      ),
      {
        kind: "text",
        text: " by centrifugal force, in which the mixed fluid is introduced into a hollow centrifugal chamber and the separated fluids are conducted therefrom through separate pipes or nozzles. The apparatus is especially useful in creaming milk.",
      },
    ]),
    p(
      "The invention consists, essentially, in the combination, with a hollow chamber rotating upon a vertical axis, of a pipe concentric with said axis for the admission of a compound fluid, and two or more nozzles, also concentric with said axis, for the delivery of the separated fluids.",
    ),
    p(
      "It also consists in various details of construction and combinations of parts, hereinafter described.",
    ),
    paragraph([
      { kind: "text", text: "In the accompanying drawings, " },
      figure("Fig. 1", "Figure 1"),
      { kind: "text", text: " represents a vertical section of the apparatus, and " },
      figure("Fig. 2"),
      { kind: "text", text: " a perspective view thereof on a smaller scale." },
    ]),
    p("Similar letters of reference designate corresponding parts in both figures."),
    p(
      "B designates a stand, preferably made of cast-iron, supporting a hollow chamber, A, preferably cast in one piece therewith.",
    ),
    p(
      "D is a strong chamber formed of one piece of steel, iron, or other metal, and in form nearly elliptical in vertical section. It is arranged upon the upper end of a shaft, which projects into chamber A, and which rotates rapidly. This rotating chamber D has two tubular projections or nozzles, l and n, from its center upward, one within the other, which respectively serve as passages for the separated fluids, and both concentric with the axis of the chamber D. These tubular projections have suitable flanges to allow them to be bolted firmly upon the upper end of the chamber D, as shown.",
    ),
    p(
      "G and H are vessels fitted around the tops of the nozzles l and n, leading from chamber D, the vessel G receiving the fluid flowing from the nozzle l and the vessel H that flowing from the nozzle n. The two vessels G and H are concentric with the nozzles l and n, and are open at the center to permit said nozzles to project through them.",
    ),
    p(
      "y y are two spouts arranged to convey from the vessels G and H the separated fluids to convenient receptacles.",
    ),
    p(
      "q is a small tube leading downward through tube n into the radial channels s s at the bottom of the chamber D, and through which the fluid to be separated is first poured.",
    ),
    p(
      "i is the shaft, through which motion is given to chamber D. It is provided with a flexible bearing, r, kept in position by means of the elastic ring o, made of rubber or other suitable material, and gland p, which allows a slight vibratory action of the upper end of said shaft.",
    ),
    p(
      "e represents a short vertical shaft, mounted in the base of frame A, upon which the shaft i rests, and which is connected thereto by means of a friction-plate, z, of cork, wood, or other suitable material. This vertical shaft e is provided with a suitable driving-pulley, a, whereby power may be communicated to the apparatus by means of a belt, d.",
    ),
    p("E is a cover, which incloses tightly the chamber A."),
    p(
      "X is a bent tube leading from the inner periphery of the chamber D to the tubular projection or nozzle l.",
    ),
    p(
      "s s represent two or more radial pipes, fastened in the bottom part of chamber D, which lead the entering fluid toward the periphery of the chamber D to a point at which the separation begins, the fluids of greater specific gravity continuing toward the periphery, while the lighter fluid portions flow toward the center under the influence of centrifugal action, to be described farther on.",
    ),
    p(
      "The operation of this apparatus is as follows: Rapid rotary motion being given to the chamber D, unskimmed milk or other compound fluid passes from a pipe, f, through pipe q, into the chamber D in a slow but continuous stream, the flow being regulated by a cock or valve in the supply-pipe f. By means of the rapid rotary motion, the compound fluid, continually flowing into the chamber D through the pipe q, is caused to separate into its constituents by the centrifugal action imparted to the fluids of different gravities, thereby causing the heavier to tend toward the outer circumference of chamber D, while the lighter is forced to remain nearer the center.",
    ),
    p(
      "As the chamber becomes filled with the separated fluids the heavier fluid portions commence to overflow through the curved pipe X and nozzle l into vessel G, while the cream from the milk, or the lighter portion of other compound fluid, will overflow from the inner nozzle, n, into vessel H. At the end of the operation, when all of the milk or other compound fluid to be separated at one time has been poured into the apparatus, in order to complete the separation of the contents remaining in vessel D, the rotation of the same is stopped for a moment. The rotation is then renewed, and some of the heavier portion of the already-separated fluid is poured through pipe q again. This causes the remaining cream or other light fluid to rise through the inner tube, n, and to be thrown into vessel H until the last remaining portion has become separated and the operation completed.",
    ),
    p(
      "As the supply of milk or other compound fluid is continuous, it will be understood that incipient and progressive separations of the supply into accretions of cream and skimmed milk or any other simple fluids are at all times taking place within the chamber.",
    ),
    p(
      "By means of this apparatus I am enabled to separate any fluids of different specific gravities continually. One stream of compound fluid enters by means of pipe q, while the separated fluids flow from the two spouts y y, respectively.",
    ),
    p(
      "This apparatus is simple, cheap, and valuable for many operations in the arts, and is especially adapted to the separation of cream from milk, either fresh or old. It may be operated by hand or otherwise.",
    ),
    p("What I claim as my invention, and desire to secure by Letters Patent, is—"),
    claim(
      1,
      "The combination, with a hollow chamber rotating upon a vertical axis, of a pipe concentric with said axis for the admission of a compound fluid, and two or more nozzles, also concentric with said axis, for the delivery of the separated fluids, substantially as specified.",
    ),
    claim(
      2,
      "The combination, with a hollow chamber rotating upon its vertical axis, of a pipe concentric with said axis for the admission of a compound fluid, two or more nozzles, also concentric with said axis, for the delivery of the separated fluids, and a curved pipe extending from the outermost of said nozzles down and outwardly within said chamber, nearly to the periphery thereof, substantially as specified.",
    ),
    claim(
      3,
      "A closed centrifugal chamber provided with a double set of concentric and central vertical discharge tubes or nozzles, in combination with a stationary receiver consisting of the central annular compartments, G H, through the hollow center of which the double tubes or nozzles project, substantially as specified.",
    ),
    claim(
      4,
      "The combination of the rotary chamber D, inlet pipe or passage q, radial passages s, extending therefrom, nozzles l n, and curved pipe x, substantially as specified.",
    ),
    p("GUSTAF DE LAVAL."),
    p("Witnesses: OSCAR LAMM, JR., GUSTAF ULFF."),
  ],
};

export const delavalSeparatorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: ["This is the standard notice opening the United States specification."],
  3: [
    "Gustaf De Laval identifies Stockholm, Sweden, and describes the subject broadly as apparatus for separating fluids by centrifugal force. The exact legal limits are the four claims at the end.",
  ],
  4: [
    "The source sets the input and output arrangement: a mixed fluid enters a hollow rotating chamber; different-density portions leave through separate pipes or nozzles. Creaming milk is its stated example, not its only proposed use.",
  ],
  5: [
    "This sentence states the central combination later recited in claim 1: a vertical-axis rotating chamber, an inlet pipe on that axis, and at least two concentric outlets for separated fluids.",
  ],
  6: [
    "De Laval reserves additional construction details and combinations for the description that follows.",
  ],
  7: [
    "The written description says Figure 1 is the vertical section and Figure 2 is the perspective. The printed labels on the drawing sheet appear the other way around: Fig. 1 is on the smaller perspective and Fig. 2 on the vertical section. The edition preserves the source wording and shows the source-labelled crop for each reference so the discrepancy is visible.",
  ],
  8: ["The same reference letters identify the same physical parts in both drawings."],
  9: [
    "B is the stand, and A is the hollow chamber it supports. The source says they are preferably cast together, but does not give a material specification beyond the preferred cast iron for the stand.",
  ],
  10: [
    "D is the rapidly rotating, nearly elliptical inner chamber. It carries nested central tubes l and n. Their job is not to mix the product streams: each is a separate path for a separated fluid, and both share the rotation axis.",
  ],
  11: [
    "G and H are stationary receiving vessels around the nested outlets. G receives the stream from outer nozzle l; H receives the stream from inner nozzle n. Their annular form leaves a central opening through which the nozzles project.",
  ],
  12: ["The two spouts y y carry the two collected streams from G and H to separate receptacles."],
  13: [
    "Feed tube q runs down through inner tube n and into radial channels s s at the bottom of D. The source therefore feeds the mixture near the axis before the radial channels carry it outward.",
  ],
  14: [
    "Shaft i drives D. Its upper support can move slightly because the bearing r is held by an elastic ring o and gland p. The source describes compliance, not a stated operating speed or a quantified vibration limit.",
  ],
  15: [
    "The lower support e receives shaft i through friction plate z. De Laval permits cork, wood, or another suitable friction material. Pulley a and belt d are the illustrated way to bring power to the apparatus; the source gives no gear ratio or revolutions per minute.",
  ],
  16: [
    "Cover E is the removable lid that incloses the bowl chamber A tightly, sealing the separating chamber so the machine can be filled, run, and cleaned without the contents splashing out of the top.",
  ],
  17: [
    "Curved pipe X picks up fluid from the inner periphery of rotating chamber D and leads it to outlet l. Claim 2 adds this particular curved path to the basic concentric-inlet-and-outlet combination.",
  ],
  18: [
    "Radial pipes s s lead entering fluid toward the outer region where separation begins. The source states the separation in relative-density terms: the greater-specific-gravity portion stays toward the periphery and the lighter portion stays closer to the center.",
  ],
  19: [
    "During operation the operator gives D rapid rotation, meters unskimmed milk or another compound fluid through f and q, and keeps the feed slow and continuous. The source gives the qualitative direction of separation but no numerical speed, G-force, pressure, density, or throughput.",
  ],
  20: [
    "Once separated liquid fills the chamber, the heavier portion reaches G through X and outer nozzle l. Cream or another lighter portion reaches H through inner nozzle n. For a finite charge, De Laval describes a finishing step: pause rotation, restart it, and send some already-separated heavier liquid through q to displace the remaining light fluid through n.",
  ],
  21: [
    "With a continuous supply, the source says separation begins and progresses continuously inside D, producing cream and skimmed milk at the same time rather than only after an entire batch has settled.",
  ],
  22: [
    "The claimed apparatus is presented as a continuous-flow separator: one compound stream enters through q and the two separated streams leave through y y.",
  ],
  23: [
    "De Laval calls the apparatus simple, cheap, and useful for many arts, especially creaming fresh or old milk. He says it may be hand-operated or driven another way; the document does not identify a particular motor or commercial performance figure.",
  ],
  24: [
    "The four numbered claims now state the exact combinations for which De Laval seeks patent protection.",
  ],
  29: ["Gustaf De Laval signs the completed United States specification."],
  30: ["Oscar Lamm, Jr., and Gustaf Ulff are listed as witnesses to execution."],
};

export function manualClaimText(number: number): string {
  const block = delavalSeparatorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`De Laval manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const delavalSeparatorRecordCorrections: Pick<
  Patent,
  | "title"
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "filingDate"
  | "summary"
  | "heroQuote"
  | "originalText"
  | "plainEnglishExplanation"
  | "claims"
  | "drawings"
  | "historicalContext"
  | "tags"
  | "stats"
> = {
  title: "Centrifugal Creamer",
  shortTitle: "De Laval's Concentric-Discharge Creamer",
  subtitle: "A rotating chamber with concentric feed and separated-fluid outlets",
  inventors: ["Gustaf De Laval"],
  inventorLocation: "Stockholm, Kingdom of Sweden",
  filingDate: "1879-07-31",
  summary:
    "US 247,804 describes apparatus for separating a compound fluid by centrifugal action. A rotating chamber receives fluid through a pipe concentric with its vertical axis. Nested, concentric nozzles carry separated streams to two annular receivers. The four claims protect the core inlet-and-outlet combination, a curved outer-fluid pipe, a specified stationary receiver with double central nozzles, and the named radial-feed construction.",
  heroQuote:
    "One stream of compound fluid enters by means of pipe q, while the separated fluids flow from the two spouts y y, respectively.",
  originalText: `UNITED STATES PATENT OFFICE.
GUSTAF DE LAVAL, OF STOCKHOLM, SWEDEN.

CENTRIFUGAL CREAMER.

Specification forming part of Letters Patent No. 247,804, dated October 4, 1881. Application filed July 31, 1879.

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including the source drawing sheet, full specification, all four printed claims, signature, and witnesses.`,
  plainEnglishExplanation: {
    overview:
      "De Laval describes a separator that receives a mixed liquid continuously and delivers two streams through concentric outlets. In the illustrated milk use, the heavier portion remains nearer the outside of the spinning chamber while cream, the lighter portion, remains nearer the center. The arrangement converts those radial positions into separate overflow paths without making the reader infer a speed, pressure, or performance number that the patent does not give.",
    coreMechanism:
      "Fluid enters through q near the axis and reaches radial channels s s at the bottom of rotating chamber D. The heavier portion tends toward the outer circumference; the lighter portion remains nearer the center. Curved pipe X carries the outer portion to nozzle l and receiving vessel G. Inner nozzle n delivers the lighter portion to H. The separate spouts y y lead the streams away. A flexible upper bearing on driving shaft i allows slight vibration, and the illustrated lower support uses a friction plate z and belt-driven pulley a.",
    mechanicalBreakdown: [
      {
        title: "Concentric inlet and outlets",
        summary:
          "The feed pipe and at least two discharge nozzles share the vertical axis of the rotating chamber.",
        technicalDetails:
          "Claim 1 requires a hollow chamber rotating on a vertical axis, an inlet pipe concentric with that axis, and two or more likewise concentric nozzles for separated fluids. The patent does not state a nozzle diameter, rotational speed, throughput, or separation percentage.",
        archaicTerm: "compound fluid",
        modernEquivalent: "A mixed liquid containing portions of different density",
      },
      {
        title: "Rotating chamber and radial channels",
        summary:
          "Chamber D receives the feed and its radial channels carry it outward to the region where separation begins.",
        technicalDetails:
          "The source calls D a strong one-piece chamber of steel, iron, or other metal, nearly elliptical in vertical section. It names radial passages s s and says the greater-specific-gravity portion continues toward the periphery while the lighter portion remains nearer the center.",
        archaicTerm: "specific gravity",
        modernEquivalent: "Relative density",
      },
      {
        title: "Nested discharge paths and receivers",
        summary:
          "Outer nozzle l and inner nozzle n send the separated portions to annular receivers G and H.",
        technicalDetails:
          "Outer nozzle l discharges into stationary vessel G; inner nozzle n discharges into stationary vessel H. The nested arrangement lets two streams leave through the same central region without remixing, and each receiver has its own spout y.",
        archaicTerm: "annular compartments",
        modernEquivalent: "Ring-shaped receiving vessels with a central opening",
      },
      {
        title: "Curved outer-fluid pipe",
        summary: "Pipe X draws the heavier portion from near the chamber wall.",
        technicalDetails:
          "Claim 2 and claim 4 name the curved pipe (called X in the description and x in claim 4). It runs from outer nozzle l down and outward nearly to the chamber's periphery, picking up the heavier separated fluid where centrifugal force concentrates it.",
        archaicTerm: "curved pipe X",
        modernEquivalent: "Periphery pickup tube for the denser separated phase",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Centrifugal Separation of Immiscible Phases",
        formula:
          "r_{\\text{heavy}} > r_{\\text{light}} \\quad (\\text{when } \\rho_{\\text{heavy}} > \\rho_{\\text{light}})",
        explanation:
          "Centrifugal acceleration forces the denser fluid toward the outer radius of the rotating chamber while displacing the lighter fluid toward the center. The patent gives the qualitative physical principle without asserting a specific G-force or separation velocity.",
      },
    ],
    whyItMattersToday:
      "The patent is a compact account of a continuous centrifugal separator as a set of named flow paths rather than a vague spinning bowl. Its claims distinguish a broad concentric inlet-and-outlet arrangement from more particular geometry: curved pipe X, annular receivers, double central nozzles, and radial feed passages.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 protects the basic apparatus combination: a vertical-axis rotating hollow chamber, a centerline inlet for mixed liquid, and at least two centerline outlets for the separated streams.",
      keyInnovations: [
        "Vertical-axis rotating chamber",
        "Concentric feed pipe",
        "Multiple concentric discharge nozzles",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 adds a curved pipe inside the chamber. It runs from the outermost nozzle down and outward nearly to the chamber's periphery, so it connects that outlet to the outer liquid region.",
      keyInnovations: [
        "Concentric inlet and outlets",
        "Curved outer-fluid pipe",
        "Near-periphery pickup",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 protects a closed rotating chamber with double nested vertical outlets plus stationary annular receiving compartments G and H surrounding them. The outlets project through the receivers' central opening.",
      keyInnovations: [
        "Double nested discharge tubes",
        "Stationary annular receivers",
        "Central outlet projection",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 names the illustrated flow route as a single combination: chamber D, feed q, radial passages s, nested nozzles l and n, and curved pipe x. The description calls the pipe X; this claim prints the letter in lower case.",
      keyInnovations: ["Radial feed passages", "Nested nozzles l and n", "Curved pipe x"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective view as labelled on the drawing sheet",
      caption:
        "Source-labelled Fig. 1: the apparatus in perspective, including receiving chamber A, stand B, shaft i, support e, and spouts y y.",
      svgType: "delaval-separator",
      callouts: [
        {
          id: "delaval-fig1-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Hollow chamber",
          description: "The outer chamber supported by the stand.",
          x: 58,
          y: 35,
        },
        {
          id: "delaval-fig1-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Stand",
          description: "The supporting stand for chamber A.",
          x: 74,
          y: 57,
        },
        {
          id: "delaval-fig1-y",
          figureRef: "Fig. 1",
          label: "y y",
          element: "Spouts",
          description: "The two spouts leading separated fluids to receptacles.",
          x: 42,
          y: 31,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Vertical section as labelled on the drawing sheet",
      caption:
        "Source-labelled Fig. 2: cross-section through rotating chamber D, inner and outer nozzles n and l, curved pipe X, receivers G and H, and the drive shaft.",
      svgType: "delaval-separator",
      callouts: [
        {
          id: "delaval-fig2-d",
          figureRef: "Fig. 2",
          label: "D",
          element: "Rotating chamber",
          description: "The strong inner chamber where the mixed fluid separates.",
          x: 56,
          y: 39,
        },
        {
          id: "delaval-fig2-ln",
          figureRef: "Fig. 2",
          label: "l, n",
          element: "Nested nozzles",
          description: "Concentric outlet passages for separated fluids.",
          x: 48,
          y: 22,
        },
        {
          id: "delaval-fig2-x",
          figureRef: "Fig. 2",
          label: "X",
          element: "Curved pipe",
          description: "Pipe leading from the chamber's inner periphery to nozzle l.",
          x: 39,
          y: 37,
        },
        {
          id: "delaval-fig2-q",
          figureRef: "Fig. 2",
          label: "q",
          element: "Feed tube",
          description: "Tube carrying the incoming fluid toward the radial passages.",
          x: 48,
          y: 17,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The stated problem is separating a mixed fluid of different specific gravities while it flows, with milk creaming as the named use.",
    priorArtLimitations: [
      "No earlier machine or prior-art limitation is identified in this three-sheet facsimile.",
    ],
    breakthroughInsight:
      "The source joins a vertical rotating chamber, a concentric inlet, and concentric outlets so the heavy and light portions can be collected separately while feed continues.",
    patentWars: [],
    civilizationalImpact:
      "The source itself presents the apparatus as useful for many operations in the arts and particularly for separating cream from fresh or old milk. This edition does not infer a commercial adoption figure or a legal outcome from that statement.",
    aftermath:
      "The document records parallel patent dates in England, France, Belgium, and Italy as part of its masthead, but supplies no later litigation or sales history.",
  },
  tags: ["Gustaf De Laval", "Centrifugal separator", "Creaming milk", "Rotating fluids"],
  stats: { totalClaims: 4, independentClaims: 4 },
};
