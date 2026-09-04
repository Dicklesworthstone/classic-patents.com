import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const drawingSheet: CuratedSpecificationInline = {
  kind: "reference",
  text: "annexed drawings",
  href: "#",
  referenceType: "figure",
  label: "Preview the Davenport motor drawing sheet from the pinned US 132 facsimile",
  figurePreviews: [
    {
      src: "/patents/figures/us-132-davenport-electric-motor/drawing-sheet-source-v1.png",
      alt: "Complete US 132 source drawing sheet, including the upper motor perspective, middle rotor plan, lower commutator plan, patent furniture, and signatures.",
      width: 2320,
      height: 3408,
    },
  ],
};

/**
 * A continuous, manually prepared reading edition of US 132. The source is a
 * three-page facsimile: one drawing sheet followed by the two-column
 * specification and its signed conclusion. No scan pagination is rendered.
 */
export const davenportElectricMotorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9147fc5c9d6565aa765198b42e900c90c5c0fe550b9162fe62727f86a5071960",
  preparedBy: "Classic Patents editorial agent (StormyCreek)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "THOS. DAVENPORT, OF BRANDON, VERMONT.",
        "IMPROVEMENT IN PROPELLING MACHINERY BY MAGNETISM AND ELECTRO-MAGNETISM.",
        "Specification forming part of Letters Patent No. 132, dated February 25, 1837.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET",
      title: "Davenport electric motor",
      description: literal(
        "T. DAVENPORT. Electric Motor. No. 132. Patented Feb. 25, 1837. The sheet depicts the circular platforms, stationary artificial magnets, revolving galvanic magnets, battery, conductors, shaft, and signatures.",
      ),
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Be it known that I, THOMAS DAVENPORT, of the town of Brandon, in the county of Rutland, State of Vermont, have made a discovery, being an Application of Magnetism and Electro-Magnetism to Propelling Machinery, which is described as follows, reference being had to the ",
        },
        drawingSheet,
        { kind: "text", text: " of the same, making part of this specification." },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The machine for applying the power of magnetism and electro-magnetism is described as follows:",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The frame A may be made of a circular or any other figure, divided into two or more platforms, B and C, upon which the apparatus rests, of a size and strength adapted for the purpose intended.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The " },
        {
          kind: "term",
          text: "galvanic battery",
          definition:
            "A wet chemical cell. Here, alternating copper and zinc plates in dilute acid provide the current that energizes the motor's coils.",
          label: "Period electrical term",
        },
        {
          kind: "text",
          text: " D is constructed by placing plates of copper and zinc E and F, alternately of any figure, in a vessel of diluted acid, G. From each vessel are two conductors, H and I, one from the copper and one from the zinc, leading to and in contact with copper plates K and L placed upon the lower platform. These plates or conductors are made in the form of a segment of a circle corresponding in number with the artificial magnets hereinafter described, placed around the shaft detached from one another and from the shaft, having a conductor leading from the copper plate of the battery to one of said plates on the lower platform, and another conductor leading from the zinc plate of the battery to the next plate on said lower platform, and so on alternately (if there be more than two plates on said lower platform) around the circle.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The " },
        {
          kind: "term",
          text: "galvanic magnets",
          definition:
            "Davenport's current-excited electromagnets. Their poles change when the battery conductors meet different copper plates.",
          label: "Period electrical term",
        },
        {
          kind: "text",
          text: " M N O P are constructed of arms or pieces of soft iron in the shape of a straight bar, horseshoe, or any other figure, wound with copper wire Q first insulated with silk between the coils. These arms project on lines from the center of a vertical shaft, R, turning on a pivot or point in the lower platform, said copper wires Q extending from the arms parallel, or nearly so, with the shaft, down to the copper plates K and L and in contact with them. The galvanic magnets are fixed on a horizontal wheel of wood, V, attached to the shaft.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The " },
        {
          kind: "term",
          text: "artificial magnets",
          definition:
            "The stationary field magnets. Davenport distinguishes them from the rotating galvanic electromagnets.",
          label: "Period electrical term",
        },
        {
          kind: "text",
          text: " S T are made of steel and in the usual manner. They may be of any number and degree of strength and fixed on the upper platform, being segments of nearly the same circle as this platform; or, if galvanic magnets are used, (which may be done,) they may be made in the form of a crescent or horseshoe, with their poles pointing to the shaft.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Having arranged these artificial magnets on the top of the upper circular platform, there will be a corresponding number of magnetic poles, the north marked 5 and the south pole 6. Now, we will suppose the machine to be in a ",
        },
        {
          kind: "term",
          text: "quiescent state",
          definition: "At rest, before the first current-driven motion begins.",
          label: "Period mechanical term",
        },
        {
          kind: "text",
          text: ". The galvanic magnet No. 1 being opposite the north pole of the artificial magnets, the galvanic magnet No. 3 will, of course, be opposite the south pole No. 6, and the galvanic magnets Nos. 2 and 4 will be opposite each other, between the poles just mentioned.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "There being a corresponding number of copper plates or conductors placed below the artificial magnets around the shaft, but detached from it as well as from each other, with wires leading from the galvanic magnets to these plates and in contact with them, as before described, these wires will stand in the same position in relation to the copper plates that the galvanic magnets stand to the artificial magnets, but in contact with the plates.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Now, in order to put the machine in motion, the galvanic magnet No. 2, being changed by the galvanic current passing from the copper plate of the battery along the conductors and wires, becomes a north pole, while at the same time the magnet No. 4 is changed by the galvanic current passing from the zinc plate of the battery, and becomes a south pole. Of course the south pole of the artificial magnet No. 6 will attract the north pole of the galvanic magnet No. 2 and will move it a quarter of a circle. The south pole of the galvanic magnet No. 4, being at the same time attracted by the north pole No. 5, causes the said magnet No. 4 also to perform a quarter of a circle. The momentum of the galvanic arms will carry them past the centers of the poles Nos. 5 and 6, at which time the several wires from the galvanic magnets will have changed their positions in relation to the copper plates or conductors.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "For instance, the north pole No. 2 having now become a south pole by reason of its wire being brought in contact with the conductors of the zinc plate, and No. 4 having in like manner become a north pole, its wire having changed its position from the zinc plate to the copper plate, the poles of the galvanic magnets are, of course, now repelled by the poles that before attracted them; and in this manner the operation is continued, producing a rotary motion in the shaft, which motion is conveyed to machinery for the purpose of propelling the same.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The discovery here claimed, and desired to be secured by Letters Patent, consists in—",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "Applying magnetic and electro-magnetic power as a moving principle for machinery in the manner above described, or in any other substantially the same in principle.",
      ),
    },
    { kind: "paragraph", inlines: literal("THOMAS DAVENPORT.") },
    { kind: "paragraph", inlines: literal("Witnesses: W. W. AYRES, CHAS. A. COOK.") },
  ],
};

/**
 * Renderer-compatible patent-local parallel readings. Keys are zero-based
 * source block indexes from `davenportElectricMotorArchivalEdition.blocks`.
 * Each literal array is the complete companion reading for that source block;
 * no adapter, parser, or inferred paragraph alignment is involved.
 */
export const davenportElectricMotorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "This is the conventional notice that follows. It tells every reader that the inventor is about to define the legal subject of the patent.",
  ],
  3: [
    "Thomas Davenport identifies himself as a Brandon, Rutland County, Vermont inventor and says his discovery applies magnetism and electromagnetism to driving machinery. He expressly incorporates the annexed drawing sheet into the specification, so the lettered parts on that sheet are part of what the text describes.",
  ],
  4: [
    "Davenport now turns from the legal introduction to the machine itself. The following paragraphs state the physical arrangement that gives the broad claim its concrete operating meaning.",
  ],
  5: [
    "Frame A is the supporting structure. It need not be circular: it may have another shape and two or more platforms B and C, provided it is strong and large enough to carry the apparatus. The source therefore treats the frame geometry as adaptable rather than the source of the motor's action.",
  ],
  6: [
    "Battery D uses alternating copper E and zinc F plates in diluted acid G. Each cell sends one conductor H from copper and one I from zinc to the insulated copper plates K and L on the lower platform. Those plates are separate arc segments around the shaft. Connecting copper to one segment and zinc to the next, repeatedly around the circle when there are more than two, establishes position-dependent electrical contacts instead of one fixed connection.",
  ],
  7: [
    "The rotating members M, N, O, and P are soft-iron bars, horseshoes, or another form wound with silk-insulated copper wire Q. They project from and turn with vertical shaft R, while their wires run down alongside that shaft to contact plates K and L. Wheel V fastens the magnets to the shaft. In modern terms, this paragraph defines a rotor whose electromagnet poles can change as its contacts move.",
  ],
  8: [
    "The stationary field members S and T are ordinary steel magnets fixed to the upper platform. Davenport permits any number and strength of them and makes them curved segments of the platform's circle. He also permits stationary galvanic magnets in crescent or horseshoe form, provided their poles face the shaft. The condition that matters is inward-facing stationary poles around the rotor.",
  ],
  9: [
    "Davenport first fixes the initial condition: the machine is at rest. With north field pole 5 and south field pole 6, rotating magnet 1 stands opposite north, magnet 3 opposite south 6, and magnets 2 and 4 lie between those field poles. This positional account supplies the reference state for the switching sequence that follows.",
  ],
  10: [
    "There are as many separated copper contact plates below the field magnets as the arrangement requires. The rotor wires touch those plates. Because the wires travel with the rotor in the same relative layout in which the rotor magnets travel past the stationary magnets, moving a wire to a different plate changes its battery connection at a particular rotor position. This is the mechanical commutation relation described by the patent.",
  ],
  11: [
    "To start motion, the copper-side battery path makes rotating magnet 2 a north pole and the zinc-side path makes magnet 4 a south pole. Stationary south pole 6 attracts north pole 2, and stationary north pole 5 attracts south pole 4, so each moves one quarter-circle. Momentum carries the arms past poles 5 and 6; by then their wires have reached different copper plates, ready to change the rotating poles again. The paragraph therefore gives both the polarity condition and the quarter-turn mechanical result.",
  ],
  12: [
    "After the contacts change, magnet 2 becomes south because its wire reaches a zinc-side conductor, while magnet 4 becomes north after moving from zinc to copper. The stationary poles that had attracted them now repel them. Repeating this attraction, travel past the poles, contact change, and repulsion cycle sustains one-direction rotary motion in the shaft, which can then propel machinery. This is the patent's complete causal chain, not merely a statement that a motor turns.",
  ],
  13: [
    "This is the legal transition to the claim. Davenport announces that the following language, rather than every descriptive detail by itself, is the discovery for which he seeks Letters Patent protection.",
  ],
  15: [
    "Thomas Davenport signs the specification, identifying himself as the inventor responsible for the claimed discovery.",
  ],
  16: [
    "W. W. Ayres and Chas. A. Cook are recorded as witnesses. Their names are formal source matter and are retained rather than replaced with editorial commentary.",
  ],
};
