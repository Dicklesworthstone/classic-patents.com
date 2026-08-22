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

const figure = (
  label: "Fig. 1" | "Fig. 2" | "Fig. 3" | "Fig. 4",
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: `#figure-${label.replace("Fig. ", "")}`,
  referenceType: "figure",
  label: `US 233,692 ${label}`,
  // Existing crops are retained on disk but are not bound here: the current
  // versions include neighboring drawing matter and are awaiting a fresh
  // source-coordinate crop pass under a permitted load gate.
});

const claim = (number: number, value: string | CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines: typeof value === "string" ? text(value) : value,
});

/**
 * A continuous, manually prepared edition of the complete three-sheet US
 * 233,692 facsimile. The drawing sheet is represented by source-semantic
 * references; figure-preview binding remains withheld until the existing
 * neighboring-matter crops can be replaced under a permitted load gate.
 */
export const peltonWaterWheelArchivalEdition: Omit<
  CuratedSpecificationEdition,
  "completeFacsimileReviewed"
> & { completeFacsimileReviewed: false } = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "LESTER A. PELTON, OF CAMPTONVILLE, CALIFORNIA.",
        "WATER-WHEEL.",
        "SPECIFICATION forming part of Letters Patent No. 233,692, dated October 26, 1880. Application filed July 3, 1880. (No model.)",
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "Drawing sheet: printed title and execution matter",
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-4",
      title: "Wheel, water-distribution arrangement, bucket, and bucket section",
      description: [
        {
          kind: "text",
          text: "No Model. L. A. Pelton. Water Wheel. No. 233,692. Patented Oct. 26, 1880. ",
        },
        figure("Fig. 1"),
        { kind: "text", text: ". A. B. F. G. " },
        figure("Fig. 2"),
        { kind: "text", text: ". A. B. F. G. " },
        figure("Fig. 3"),
        { kind: "text", text: ". B. b. c. d. e. " },
        figure("Fig. 4"),
        {
          kind: "text",
          text: ". c. d. e. Witnesses: Frank A. Brooks. Geo. H. Strong. Inventor: Lester A. Pelton. N. Peters, Photo-Lithographer, Washington, D. C.",
        },
      ],
    },
    p("To all whom it may concern:"),
    p(
      "Be it known that I, LESTER A. PELTON, of Camptonville, county of Yuba, and State of California, have invented an Improved Water-Wheel; and I hereby declare the following to be a full, clear, and exact description thereof.",
    ),
    paragraph([
      {
        kind: "text",
        text: "My invention relates to certain improvements in that class of water-wheels known as “",
      },
      term("hurdy-gurdy", "A period name for a water wheel driven at its rim by a jet."),
      {
        kind: "text",
        text: "” wheels, which are driven by the momentum of a stream of water delivered into buckets on the periphery of the wheel through a nozzle and under a high pressure. When the water is delivered upon flat or flat-bottomed buckets in this class of wheels it splashes and reacts against the bottoms of the succeeding buckets, thus retarding the wheel. Buckets having pointed and other shaped bottoms have been used to overcome the difficulty named, and with some success.",
      },
    ]),
    p(
      "In my invention I construct a wheel having a flat face, and upon this face I secure peculiar-shaped buckets which are adapted to receive the stream from the nozzle and divide it, so that the two parts of the stream are directed into the curved bottoms of the two halves of the bucket, and by means of the inclined or flaring sides the two streams are caused to react and escape smoothly at each side, so that the whole reactionary force of the water is utilized, and the water is discharged clear of the wheel and the following bucket.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Referring to the accompanying drawings for a more complete explanation of my invention, ",
      },
      figure("Fig. 1", "Figure 1"),
      { kind: "text", text: " is a perspective view of my wheel. " },
      figure("Fig. 2"),
      {
        kind: "text",
        text: " is a side elevation and section of distributing-box and discharge pipes or nozzles. ",
      },
      figure("Fig. 3"),
      { kind: "text", text: " is a perspective view of one of the buckets. " },
      figure("Fig. 4"),
      { kind: "text", text: " is a section of the same." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A is a wheel, which may be of any suitable construction and size, and it has a rim provided with a flat face, upon which the buckets B are secured. These buckets may be formed separately, and screwed, soldered, or otherwise fastened upon the wheel-rim, or they may be formed as a part of the wheel itself, if desired. The buckets have a bottom or bottoms formed in two distinct curves, c c, which meet in an apex at d, so that when the stream of water strikes this apex it will be divided into two parts, each of which is directed into one of the bottoms c. The sides e are continuations of the bottom, and stand at such an incline outward, that the water passes smoothly from the apex down into the bottoms, and thence up the inclined sides e, so as to discharge clear of the next bucket and at the sides of the wheel. This action of the water causes it to be delivered upon the wheel with the full force due to its momentum, and in passing through the curved bottom and up the inclined sides the ",
      },
      term(
        "reactionary force",
        "The force produced when the bucket changes the water stream's direction.",
      ),
      {
        kind: "text",
        text: " due to this change of direction is also added to the primary power to assist in driving the wheel.",
      },
    ]),
    p(
      "The fronts b of the buckets are at such an incline or angle that the bottom is nearer the face of the wheel than the top, so that their faces will not strike the streams of water from the nozzle and thus retard the wheel; but when a bucket has arrived in line with the streams the water will instantly strike the apex d.",
    ),
    paragraph([
      {
        kind: "text",
        text: "The water is brought to the wheel through a pipe or pipes, and is discharged upon it through a nozzle or nozzles, F F. In the present case I have shown a distributing-box, G, which receives the water from the main pipe and delivers it to the nozzles F. One or more of these nozzles may be employed, and they are placed ",
      },
      term("tangentially", "Along a tangent to the wheel's rim, rather than aimed at its center."),
      {
        kind: "text",
        text: " to the periphery of the wheel, or so that when a bucket is in line the water will strike exactly in its center. In the present case I have shown two nozzles, and it will be manifest that more may be added at will. Each nozzle is set so as to discharge into the second bucket from the one acted upon by the previous nozzle, thus allowing each bucket to clear itself before receiving the water from another nozzle. By this arrangement I am enabled to add to the power of the wheel without increasing the area of the buckets.",
      },
    ]),
    p(
      "The form of the buckets may be varied somewhat to obtain the best results; but the essential features of the two-part bucket with the dividing-apex, the curved bottom, and the flaring discharge sides will not be altered.",
    ),
    p(
      "Having thus described my invention, what I claim as new, and desire to secure by Letters Patent, is—",
    ),
    claim(
      1,
      "In a water-wheel, the buckets having the curved bottoms c, meeting at the apex d, and continued to form the inclined discharge sides e, in combination with the bucket-front b, standing at an incline with the wheel-face, so that the stream from the nozzle shall be received into the bucket without striking its face, substantially as herein described.",
    ),
    p("In witness whereof I have hereunto set my hand."),
    p("LESTER A. PELTON."),
    p("Witnesses: S. H. NOURSE, FRANK A. BROOKS."),
  ],
};

export const peltonWaterWheelParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: ["This is the conventional notice that opens the specification."],
  4: [
    "Pelton identifies himself, Camptonville, Yuba County, and California, then offers the full technical account that follows.",
  ],
  5: [
    "Pelton calls the relevant machines “hurdy-gurdy” wheels. He defines them by their mode of drive: a pressurized stream enters buckets around the rim. The cited failure is not a measured efficiency number. It is splash and reaction against the next bucket when a flat or flat-bottomed bucket receives the jet.",
  ],
  6: [
    "The proposed bucket splits the incoming stream at its center. Each half enters its own curved bottom, travels upward along an outward-flaring side, and exits away from both the following bucket and the wheel. Pelton's stated gain is that the momentum delivered at entry is supplemented by the force associated with changing the stream's direction.",
  ],
  7: [
    "The four figures separate the overall wheel, the water-distribution arrangement, a perspective bucket, and a cross-section of that bucket. The references open cropped portions of the historical drawing sheet rather than a generic turbine illustration.",
  ],
  8: [
    "The wheel has a flat rim face carrying buckets B. Each bucket may be separate or integral with the rim. Its two curved bottoms c meet at central apex d. The jet strikes d, divides in two, passes down the curved bottoms, rises along sides e, and exits laterally. The source's mechanism is the full bucket geometry, not merely a center splitter considered alone.",
  ],
  9: [
    "The sloped front b keeps a bucket that is not yet in position from cutting through the jet. Once the bucket reaches the stream line, the stream meets the apex d instead of the front face.",
  ],
  10: [
    "Pelton permits one or more nozzles. In the illustrated two-nozzle arrangement, each nozzle is aimed so a bucket has time to drain before another nozzle reaches it. The claimed bucket can therefore be used in a multiple-nozzle layout without enlarging the bucket area.",
  ],
  11: [
    "Pelton allows variations in exact form but names three features he will not discard: a two-part bucket, the dividing apex, and curved bottoms with flaring discharge sides.",
  ],
  12: [
    "The following single claim defines the protected combination. It is not a broad claim to every split-cup wheel or every high-head hydroelectric system.",
  ],
  14: ["The execution line records Pelton's adoption of the completed specification."],
  15: [
    "The inventor's signature, LESTER A. PELTON., executes the specification in his own hand; on an 1880 California grant this signing is what dates and validates the instrument that the subscribing witnesses then attest below.",
  ],
  16: ["S. H. Nourse and Frank A. Brooks are listed as witnesses to execution."],
};

/** Read the sole printed claim from the authored edition, never a duplicate literal. */
export function peltonWaterWheelClaimText(number: number): string {
  const block = peltonWaterWheelArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Pelton manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const peltonWaterWheelRecordCorrections: Pick<
  Patent,
  | "shortTitle"
  | "subtitle"
  | "inventors"
  | "inventorLocation"
  | "summary"
  | "heroQuote"
  | "usptoClassification"
  | "originalText"
  | "plainEnglishExplanation"
  | "claims"
  | "drawings"
  | "historicalContext"
  | "tags"
  | "stats"
> = {
  shortTitle: "Pelton's Divided-Bucket Water Wheel",
  subtitle: "A central dividing apex, twin curved bottoms, and flaring discharge sides",
  inventors: ["Lester A. Pelton"],
  inventorLocation: "Camptonville, Yuba County, California",
  summary:
    "US 233,692 describes a rim-driven water wheel whose bucket divides an incoming jet at a central apex. The two portions travel through distinct curved bottoms and up flaring sides, then discharge at the wheel's sides rather than into the next bucket. The single printed claim also requires a sloped bucket front that lets the stream enter without striking that face.",
  heroQuote:
    "The essential features of the two-part bucket with the dividing-apex, the curved bottom, and the flaring discharge sides will not be altered.",
  usptoClassification: "F03B 1/02 (Impulse water wheels; bucketed runners)",
  originalText: `UNITED STATES PATENT OFFICE.
LESTER A. PELTON, OF CAMPTONVILLE, CALIFORNIA.

WATER-WHEEL.

Specification forming part of Letters Patent No. 233,692, dated October 26, 1880. Application filed July 3, 1880. (No model.)

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including the drawing sheet, full specification, single printed claim, execution, and witnesses.`,
  plainEnglishExplanation: {
    overview:
      "Pelton's specification starts with a particular nuisance in rim-driven water wheels. A pressurized jet striking a flat or flat-bottomed bucket splashes and reacts against the bucket that follows, slowing the wheel. His bucket uses a central apex to split the stream in two. Each half turns through a separate curved bottom and leaves through an outward-flaring side, clear of the next bucket.",
    coreMechanism:
      "A nozzle sends water to the wheel's rim. The bucket front b is sloped so an entering bucket does not strike the stream with its face. At the intended position, the jet meets central apex d and divides. Each part runs through one curved bottom c and up an inclined side e. Pelton says that path both receives the stream's momentum and adds the force due to the change in direction. The side exits keep the water from striking the next bucket.",
    mechanicalBreakdown: [
      {
        title: "Wheel rim and removable or integral buckets",
        summary:
          "Wheel A has a flat rim face on which buckets B can be attached or formed as part of the wheel.",
        technicalDetails:
          "The patent permits buckets to be screwed, soldered, otherwise fastened to the rim, or made integral with the wheel. It supplies no rim diameter, bucket count, material, operating head, or shaft speed.",
        archaicTerm: "hurdy-gurdy wheel",
        modernEquivalent: "Rim-driven impulse water wheel",
      },
      {
        title: "Dividing apex and twin curved bottoms",
        summary: "The jet divides at apex d and each half has its own curved path c.",
        technicalDetails:
          "The single printed claim names curved bottoms c meeting at apex d. That geometry is inseparable from the inclined discharge sides e and the sloped bucket-front b in the claimed combination. The source does not specify a knife-edge radius, exact turning angle, or a percentage energy recovery.",
        archaicTerm: "apex",
        modernEquivalent: "Central stream-dividing ridge",
      },
      {
        title: "Flaring discharge sides",
        summary:
          "Sides e carry the two water portions upward and outward so they leave beside the wheel.",
        technicalDetails:
          "Pelton says the sides continue the curved bottoms and are inclined outward. The stated functional result is a smooth discharge clear of the next bucket and at the sides of the wheel, avoiding the retarding interaction that opened the specification.",
        archaicTerm: "reactionary force",
        modernEquivalent: "Force associated with changing the water stream's direction",
      },
      {
        title: "Tangential nozzle placement and sequencing",
        summary:
          "Nozzles F can be placed around the wheel so a bucket drains before receiving water from another nozzle.",
        technicalDetails:
          "The illustrated distributing-box G feeds two nozzles, though Pelton permits one or more. He says each nozzle can be aimed at the second bucket from the one affected by the prior nozzle. This is a layout option in the specification; it does not appear as an additional printed claim.",
        archaicTerm: "distributing-box",
        modernEquivalent: "Manifold feeding multiple nozzles",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Momentum transfer by deflecting a water stream",
        formula: "F_{\\text{tangential}} = \\dot{m} (v_{\\text{jet}} - u)(1 - \\cos\\beta)",
        explanation:
          "A moving water stream carries momentum. When a bucket changes its direction, the water exerts a force on the bucket in the opposite direction. Pelton explicitly connects the twin curved paths and outward discharge to that additional force, but supplies no numerical deflection angle or force calculation.",
      },
      {
        principle: "Avoiding interference between successive buckets",
        formula:
          "\\Delta t_{\\text{drain}} < \\frac{2\\pi}{\\omega \\cdot N_{\\text{buckets}}}, \\quad \\vec{v}_{\\text{exit}} \\cdot \\hat{n}_{\\text{following}} \\le 0",
        explanation:
          "The source describes an unwanted feedback path: splash from a flat bucket can react against the next bucket. Splitting the stream and discharging it beside the wheel gives the water a route that does not meet that next bucket. The sloped front also prevents a bucket face from striking the jet before its apex reaches the right position.",
      },
      {
        principle: "Tangential jet application and torque generation",
        formula:
          "\\tau = r_{\\text{wheel}} \\times F_{\\text{tangential}} = r_{\\text{wheel}} \\cdot \\rho A_{\\text{jet}} v_{\\text{jet}} (v_{\\text{jet}} - u)(1 - \\cos\\beta)",
        explanation:
          "A tangential jet acts at the rim and therefore tends to turn the wheel around its axle. Pelton specifies tangent placement and center strike on the bucket, but does not give a pressure, jet velocity, nozzle diameter, or rotational speed in this patent.",
      },
    ],
    whyItMattersToday:
      "The document makes the classic bucket shape legible as a legal combination. Its central apex, two curved bottoms, flaring exits, and sloped front solve different parts of the same flow problem. The single claim is more specific than the later shorthand “Pelton wheel”: it protects the named geometry that accepts a nozzle stream without letting it hit the bucket face.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: peltonWaterWheelClaimText(1),
      plainEnglish:
        "The claim protects one complete bucket arrangement: two curved bottoms meeting at central apex d, those bottoms continuing into inclined discharge sides e, and a sloped front b. The front must let the nozzle stream enter the bucket without first hitting the bucket face.",
      keyInnovations: [
        "Central dividing apex",
        "Twin curved bottoms",
        "Inclined discharge sides",
        "Sloped bucket front",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective water wheel",
      caption: "Source Fig. 1: wheel A carrying buckets B around its rim.",
      svgType: "pelton-water-wheel",
      callouts: [
        {
          id: "pelton-wheel",
          figureRef: "Fig. 1",
          label: "A",
          element: "Wheel",
          description: "The wheel whose flat rim face carries the buckets.",
          x: 57,
          y: 36,
        },
        {
          id: "pelton-bucket",
          figureRef: "Fig. 1",
          label: "B",
          element: "Bucket",
          description: "One of the rim-mounted water-receiving buckets.",
          x: 68,
          y: 19,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Distribution box and nozzle arrangement",
      caption:
        "Source Fig. 2: side elevation and section of distributing-box G, pipes, and nozzles F.",
      svgType: "pelton-water-wheel",
      callouts: [
        {
          id: "pelton-nozzles",
          figureRef: "Fig. 2",
          label: "F",
          element: "Nozzles",
          description: "Nozzles that direct water tangentially to the wheel's rim.",
          x: 65,
          y: 62,
        },
        {
          id: "pelton-distribution",
          figureRef: "Fig. 2",
          label: "G",
          element: "Distributing box",
          description: "Box receiving water from the main pipe and feeding the nozzles.",
          x: 66,
          y: 69,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Perspective bucket",
      caption: "Source Fig. 3: bucket B with front b, apex d, curved bottoms c, and sides e.",
      svgType: "pelton-water-wheel",
      callouts: [
        {
          id: "pelton-apex",
          figureRef: "Fig. 3",
          label: "d",
          element: "Dividing apex",
          description: "Central point where the stream is divided into two portions.",
          x: 50,
          y: 54,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Bucket cross-section",
      caption: "Source Fig. 4: the two curved bottoms c, central apex d, and discharge sides e.",
      svgType: "pelton-water-wheel",
      callouts: [
        {
          id: "pelton-bottoms",
          figureRef: "Fig. 4",
          label: "c c",
          element: "Curved bottoms",
          description: "Two distinct curves that receive the divided water stream.",
          x: 48,
          y: 67,
        },
        {
          id: "pelton-sides",
          figureRef: "Fig. 4",
          label: "e e",
          element: "Inclined discharge sides",
          description: "Outward-flaring sides that discharge water beside the wheel.",
          x: 50,
          y: 48,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Pelton identifies a problem in pressurized rim-driven water wheels: a flat or flat-bottomed bucket splashes and reacts against the next bucket, retarding the wheel.",
    priorArtLimitations: [
      "Flat and flat-bottomed buckets splashed and reacted against succeeding buckets.",
      "Pointed and other shaped bottoms had been used to address the problem, but only with some success.",
      "A bucket face that strikes the incoming jet can itself retard the wheel before the jet reaches the intended central apex.",
    ],
    breakthroughInsight:
      "Make the bucket a two-part flow path: a central apex divides the jet, curved bottoms receive the two parts, and outward-flaring sides discharge them clear of the next bucket.",
    patentWars: [],
    civilizationalImpact:
      "This compact patent preserves the bucket geometry behind a recognizable class of impulse water wheel. It explicitly ties the wheel's turning force to the momentum of the incoming stream and the force produced by redirecting it, while keeping the claim limited to a defined bucket-and-front arrangement.",
  },
  tags: ["Lester A. Pelton", "Water wheel", "Impulse turbine", "Hydraulic machinery"],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
};
