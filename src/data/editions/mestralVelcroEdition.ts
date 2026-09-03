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
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});
const crop = (file: string, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-2717437-mestral-velcro/${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 2,717,437.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": [crop("fig-1-source-crop-v1", 640, 310, "Fig. 1")],
  "Fig. 2": [crop("fig-2-source-crop-v1", 580, 280, "Fig. 2")],
};

const figure = (
  label: "Fig. 1" | "Fig. 2",
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: `#fig-${label === "Fig. 1" ? "1" : "2"}`,
  referenceType: "figure",
  label,
  figurePreviews: FIGURES[label],
});

/**
 * Continuous, hand-authored archival reading of the complete three-page
 * US 2,717,437 patent facsimile granted to George de Mestral on September 13, 1955.
 */
export const mestralVelcroArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3b55f3a8b19575d9261a48f695368101b229bc505a21ea9c554e09161b7aa91a",
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "2,717,437",
        "Patented Sept. 13, 1955",
        "VELVET TYPE FABRIC AND METHOD OF PRODUCING SAME",
        "George de Mestral, Prangins, Vaud, Switzerland, assignor to Velcro S. A., Fribourg, Switzerland, a corporation of Switzerland",
        "Application October 15, 1952, Serial No. 314,933",
        "Claims priority, application Switzerland October 22, 1951",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 1",
      title: "Velvet Pile Weave, Thermal Setting Lancet Bar, and Interengaging Fastening Array",
      description: [
        figure("Fig. 1"),
        { kind: "text", text: " and " },
        figure("Fig. 2"),
        {
          kind: "text",
          text: " show the foundation weave, auxiliary loop warp over heated lancet bar 5 with cutting blade 8 forming resilient hooks 4 and straight strands 10, and two superposed 90°-crossed fabric pieces adhering together.",
        },
      ],
    },
    p([
      {
        kind: "text",
        text: "My invention has for its object a velvet fabric including a foundation structure constituted by a weft and a warp incorporating threads that are cut at a predetermined length so as to form a ",
      },
      term(
        "raised pile",
        "A surface effect on woven fabric composed of upright yarn loops or tufts projecting from the underlying foundation weave.",
      ),
      {
        kind: "text",
        text: ". My novel fabric distinguishes from the other similar fabrics by the fact that the raised pile is made of artificial material, while at least part of the threads in said pile is provided near its end with material-engaging means, as required for adhering to a similar fabric or for scouring purposes.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "My invention has for its further object a method for producing a fabric of the above type, according to which the raised pile is provided with its material-engaging means by forming loops round a carrier and submitting the loops formed on the carrier to a ",
      },
      term(
        "thermic action",
        "Thermal heat treatment applied to thermoplastic polymers (such as nylon) above their glass transition temperature to permanently freeze molecular chain orientation into a curved hook geometry.",
      ),
      {
        kind: "text",
        text: " with a view to giving them their final shape, after which the loops are cut on one side of the carrier so that each loop produces at least one pile thread having a hook-shaped end.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Fabrics of the type referred to are intended primarily for use as closing means or fasteners for garments, curtains and the like as substitutes for the usual slider-operated closing means or fasteners or for buttons or the like attaching means, whenever a yielding invisible closing arrangement is of advantage.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Fabrics of the type referred to may also be used to advantage as cleaning implements. As a matter of fact, it is possible to lay them on a support made of wood or of plastic material so as to produce a clothes or shoe brush.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "I have illustrated diagrammatically and by way of example in accompanying drawings various embodiments of the fabric according to my invention. In said drawings: ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: " is an explanatory diagram of a preferred method of production of such a fabric. ",
      },
      figure("Fig. 2"),
      {
        kind: "text",
        text: " shows two pieces of fabric executed according to a first embodiment of my invention and laid over each other so as to interengage and to adhere to each other.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Turning to ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", it is apparent that the velvet fabric, illustrated in the making, includes a foundation structure constituted by a weft 1 and by a warp 2.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The foundation structure also carries the warp thread 3 in addition to the warp thread 2, said thread 3 being adapted to form the raised pile 9, 10, some of the pile threads showing near their ends material-engaging means; in the example illustrated, the threads 9 of the pile are bent downwardly to form a hook 4.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Obviously, the weft and warp threads forming the foundation structure may be arranged otherwise than in the manner illustrated.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Furthermore, the raised pile is made of artificial or a synthetic resin material so that it is possible to give the pile threads the desired shape and to make them retain the said desired shape. I may use as an artificial material any suitable plastic material, such as that sold in the trade as “",
      },
      term(
        "nylon",
        "A synthetic thermoplastic polyamide characterized by recurring peptide linkages [-CO-NH-] whose polymer chains orient axially under drawing to provide high tensile strength and elastic recovery.",
      ),
      {
        kind: "text",
        text: "”, which is a generic term for any long chain synthetic polymeric amide which has recurring amide groups as an integral part of the main polymer chain and which is capable of being formed into a filament in which the structural elements are oriented in the direction of the axis. Note “Du Pont Products Index,” published by E. I. du Pont de Nemours & Company (Inc.), Wilmington 98, Delaware, page 91, January, 1951.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "When producing a fabric of the type illustrated in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", I proceed in the same manner as for the production of the special velvet made on ",
      },
      term(
        "bar looms",
        "Textile weaving looms equipped with transverse metal lancet wires or bars inserted into the shed over which warp pile threads are raised to form loops.",
      ),
      {
        kind: "text",
        text: ". As a matter of fact, it is possible to use for the formation of the pile, small transverse metal bars (",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ") round which the additional warp threads are caused to pass so as to form loops 6. Each small bar 5 is provided with a longitudinal groove 7 in which is guided a knife 8 adapted to cut the loop 6 open and to form thus the raised pile threads. However, with a view to obtaining the hooks 4, I heat the bar 5 before the cutting of the loops 6, so that the thread extending over the bar may assume and retain the shape imparted to it by the latter. The heating of the bars may be obtained by making an electric current flow through them. Obviously, the carrier bars 5 for the loop may be heated as well through any means other than an electric current, e. g. the carrier bars may be hollow and heated by steam.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "After the loop 6 has been cut, the raised pile retains its shape and each loop produces, on one hand, the raised pile threads 9, the ends of which are hook-shaped and, on the other hand, ordinary raised pile threads 10 forming lost strands.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "As apparent from inspection of ",
      },
      figure("Fig. 2"),
      {
        kind: "text",
        text: ", it is possible to superpose two pieces of fabric of the type illustrated in ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: ", after having imparted to one of the two pieces a 90° angular displacement in respect to the other piece and after turning them so that their pile surfaces face each other, the pile threads 9 of one piece engaging the pile threads 9 of the other piece through the co-operating hooks 4. Thus, as the number of hooks 4 per surface unit, say per square inch, may be high, the two pieces of fabric adhere together perfectly, and it is necessary to draw them away from each other with some energy, when it is desired to separate them. After separation of the two pieces, the hooks 4 return into their original shape.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "It is thus possible to use a pair of such pieces of fabric to advantage as a substitute for the usual fastening means, such as slide-operated fasteners, ordinary buttons, press buttons or the like attaching means. As a matter of fact, it is sufficient to sew a piece of fabric of the type described along the edges of the parts of garments, curtains and the like, which are to be held together. A mere pressure exerted on the two garment elements against each other will provide for their fastening. A somewhat considerable tractional stress exerted on the two garment elements thus associated, allows separating them when required.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "A fastening arrangement obtained as disclosed hereinabove shows inter alia the following advantages: The possibility of compensating any clearance between the associated elements as such elements are not always in exact register with each other; In the case of any straining, the fastening arrangement will yield before any damage is inflicted on the fabric, which is very important whenever a piece of velvet has engaged some fabric having delicate meshes.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "It should be remarked that the velvet fabrics according to my invention and more particularly those illustrated in ",
      },
      figure("Fig. 1", "Figs. 1"),
      {
        kind: "text",
        text: " and ",
      },
      figure("Fig. 2", "2"),
      {
        kind: "text",
        text: ", may serve advantageously for the execution of household implements, such as clothes brushes, shoe brushes and the like cleaning or scouring means. Obviously, in such a case, the size of the threads and more particularly their thickness and their rigidity may be selected according to the purpose intended for the pieces of fabric that are to be executed.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The velvet fabric according to my invention is thus obtained in practice in a manner similar to a conventional velvet. However, it is obvious that my novel fabric has neither the silky feel nor the outer appearance of the usual velvet that serves for the execution of clothes or for upholstery.",
      },
    ]),
    { kind: "heading", level: 2, text: "I claim:" },
    claim(
      1,
      "A method for producing a velvet type fabric consisting in weaving together a plurality of weft threads and a plurality of warp threads together with a plurality of auxiliary warp threads of synthetic resin material, forming loops with said auxiliary warp threads on one surface of the so woven fabric, submitting the said loops to a thermal source, thereby causing said loops to retain their shape to form raised pile threads, cutting said loops near their outer ends, thereby forming material-engaging means on at least a portion of said pile threads constituted by said cut loops.",
    ),
    claim(
      2,
      "A method for producing a velvet type fabric consisting in weaving together a plurality of weft threads and a plurality of warp threads together with a plurality of auxiliary warp threads of synthetic resin material, forming loops with said auxiliary warp threads on one surface of the so woven fabric, submitting the said loops to a thermal source, thereby causing said loops to retain their shape to form raised pile threads, cutting each of said loops near the respective outer end at a point between said outer end and the fabric surface, thereby forming a hook-shaped section with the free end of the respective pile thread at one side of said point at which the cut is made.",
    ),
    claim(
      3,
      "A velvet type fabric comprising a foundation structure including a plurality of weft threads, a plurality of warp threads, and a plurality of auxiliary warp threads of a synthetic resin material in the form of raised pile threads, the ends of at least part of said raised pile threads being in the form of material-engaging hooks.",
    ),
    claim(
      4,
      "A velvet type fabric comprising a foundation structure including a plurality of weft threads, a plurality of warp threads, and a plurality of auxiliary warp threads of a synthetic resin material in the form of raised pile threads, the terminal portions of at least part of said raised pile threads being in the form of a material-engaging means including hook-shaped sections.",
    ),
  ],
};

export const mestralVelcroParallelReadings: Record<number, readonly string[]> = {
  2: [
    "De Mestral establishes the foundation concept: incorporating synthetic thermoplastic monofilament threads into a velvet weave to form an upright raised pile, where individual pile threads are given terminal material-engaging geometries for reversible adhesion or scouring.",
  ],
  3: [
    "The core manufacturing sequence is disclosed: auxiliary warp loops are woven over a carrier, heated while constrained so the thread retains the imparted form, and then cut near an outer end to leave material-engaging hook-shaped pile.",
  ],
  4: [
    "The primary commercial application is defined as a universal garment and curtain closure, serving as a flexible, blind fastener replacing mechanical slide fasteners (zippers), rigid buttons, and snap press studs.",
  ],
  5: [
    "A secondary utilitarian application is identified: mounting dense hook-pile fabrics onto wooden or plastic handles to function as clothes or shoe cleaning brushes.",
  ],
  6: [
    "The drawings are introduced: Figure 1 illustrates the loom-based thermal loop forming and lancet cutting method, while Figure 2 diagrams the 90° cross-engagement of opposing hook arrays.",
  ],
  7: [
    "The foundation weave is detailed as a stable interlaced matrix of foundation weft threads 1 and warp threads 2, providing the structural backing that anchors the upright pile.",
  ],
  8: [
    "Auxiliary warp thread 3 is woven into the ground cloth and raised into vertical pile strands 9 and 10, with the bent thermoplastic strand 9 forming terminal hook 4.",
  ],
  9: [
    "The specification clarifies that the underlying foundation weave may be varied into any stable plain, twill, or satin weave without departing from the invention.",
  ],
  10: [
    "De Mestral discusses artificial monofilaments, including synthetic polymeric amides, and states that stretching or drawing can orient their structure; the grant does not publish a grade, modulus, strength, or fatigue test.",
  ],
  11: [
    "The velvet loom lancet mechanism is described: transverse metal bars 5 form loops 6, while internal electrical resistance heating or steam channels heat the bar to thermoform the loops prior to cutting along longitudinal knife guide groove 7 by blade 8.",
  ],
  12: [
    "Cutting each heated loop asymmetrically produces two distinct pile elements: an active curved hook strand 9 and a straight lost strand 10.",
  ],
  13: [
    "Fastener operation is explained: superposing two identical hook-bearing fabrics, turning one through 90°, and facing their pile surfaces lets hooks 4 on strands 9 interengage; pressure fastens the pieces and a sufficiently large traction separates them.",
  ],
  14: [
    "Application and closure method: sewing strips along fabric margins enables effortless fastening upon light touch contact and reliable separation under deliberate peel traction.",
  ],
  15: [
    "Key engineering advantages: the fastener self-aligns without requiring exact registration and yields progressively under excessive strain without tearing delicate foundation fabrics.",
  ],
  16: [
    "Filament dimensioning rules: monofilament diameter, length, and flexural rigidity are tailored to application requirements, using thicker, stiffer filaments for scouring implements and fine, flexible filaments for apparel closures.",
  ],
  17: [
    "The specification concludes by contrasting the stiff, functional hook pile with conventional decorative silk or cotton velvet upholstery fabrics.",
  ],
};
