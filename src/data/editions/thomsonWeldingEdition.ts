import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const claim = (number: number, text: string) => ({
  kind: "claim" as const,
  number,
  inlines: literal(text),
});

type FigurePreview = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const FIGURE_PREVIEWS: Readonly<Record<number, FigurePreview>> = {
  1: {
    src: "/patents/figures/us-347140-thomson-welding/figure-1-source-crop-v1.png",
    alt: "US 347,140, Fig. 1: Thomson's pivoted electric-welding clamp and spring-pressure arrangement.",
    width: 1150,
    height: 1180,
  },
  2: {
    src: "/patents/figures/us-347140-thomson-welding/figure-2-source-crop-v1.png",
    alt: "US 347,140, Fig. 2: side view of the electric-welding clamp.",
    width: 600,
    height: 1100,
  },
  3: {
    src: "/patents/figures/us-347140-thomson-welding/figure-3-source-crop-v1.png",
    alt: "US 347,140, Fig. 3: wires in the clamps before abutment.",
    width: 720,
    height: 340,
  },
  4: {
    src: "/patents/figures/us-347140-thomson-welding/figure-4-source-crop-v2.png",
    alt: "US 347,140, Fig. 4: a newly formed welded joint with its burr.",
    width: 660,
    height: 300,
  },
  5: {
    src: "/patents/figures/us-347140-thomson-welding/figure-5-source-crop-v1.png",
    alt: "US 347,140, Fig. 5: removable clamp for a selected wire size.",
    width: 360,
    height: 520,
  },
  6: {
    src: "/patents/figures/us-347140-thomson-welding/figure-6-source-crop-v1.png",
    alt: "US 347,140, Fig. 6: compound clamp with three wire grooves.",
    width: 360,
    height: 520,
  },
  7: {
    src: "/patents/figures/us-347140-thomson-welding/figure-7-source-crop-v1.png",
    alt: "US 347,140, Fig. 7: hand-operated pressure arrangement.",
    width: 430,
    height: 400,
  },
  8: {
    src: "/patents/figures/us-347140-thomson-welding/figure-8-source-crop-v2.png",
    alt: "US 347,140, Fig. 8: gravity-pressure arrangement with an adjustable weight.",
    width: 750,
    height: 285,
  },
  9: {
    src: "/patents/figures/us-347140-thomson-welding/figure-9-source-crop-v1.png",
    alt: "US 347,140, Fig. 9: modified pressure arrangement for the welding apparatus.",
    width: 550,
    height: 620,
  },
  10: {
    src: "/patents/figures/us-347140-thomson-welding/figure-10-source-crop-v2.png",
    alt: "US 347,140, Fig. 10: two rectangular bars prepared for welding.",
    width: 480,
    height: 260,
  },
  11: {
    src: "/patents/figures/us-347140-thomson-welding/figure-11-source-crop-v1.png",
    alt: "US 347,140, Fig. 11: a flanged work-piece joined to a bar.",
    width: 500,
    height: 500,
  },
  12: {
    src: "/patents/figures/us-347140-thomson-welding/figure-12-source-crop-v1.png",
    alt: "US 347,140, Fig. 12: a rectangular bar joined to a round bar.",
    width: 600,
    height: 300,
  },
  13: {
    src: "/patents/figures/us-347140-thomson-welding/figure-13-source-crop-v1.png",
    alt: "US 347,140, Fig. 13: an endless ring with its joint held between clamps.",
    width: 550,
    height: 630,
  },
  14: {
    src: "/patents/figures/us-347140-thomson-welding/figure-14-source-crop-v1.png",
    alt: "US 347,140, Fig. 14: an endless U-shaped bar.",
    width: 600,
    height: 780,
  },
  15: {
    src: "/patents/figures/us-347140-thomson-welding/figure-15-source-crop-v1.png",
    alt: "US 347,140, Fig. 15: two smaller work-pieces joined to one larger piece.",
    width: 680,
    height: 520,
  },
  16: {
    src: "/patents/figures/us-347140-thomson-welding/figure-16-source-crop-v1.png",
    alt: "US 347,140, Fig. 16: induction-coil apparatus supplying the welding clamps.",
    width: 1300,
    height: 600,
  },
  17: {
    src: "/patents/figures/us-347140-thomson-welding/figure-17-source-crop-v1.png",
    alt: "US 347,140, Fig. 17: modified arrangement of the heavy secondary winding.",
    width: 650,
    height: 700,
  },
  18: {
    src: "/patents/figures/us-347140-thomson-welding/figure-18-source-crop-v1.png",
    alt: "US 347,140, Fig. 18: secondary-battery supply and the welding apparatus.",
    width: 1600,
    height: 580,
  },
};

const SHEET_ONE = 1 as const;
const SHEET_TWO = 2 as const;

/** Each source label is manually bound to its own local crop(s); no prose is parsed. */
const FIGURE_REFERENCE_PREVIEWS: Readonly<Record<string, readonly number[]>> = {
  "Figure 1": [1],
  "Fig. 1": [1],
  "Fig. 2": [2],
  "Fig. 3": [3],
  "Fig. 4": [4],
  "Fig. 5": [5],
  "Fig. 6": [6],
  "Fig. 7": [7],
  "Fig. 8": [8],
  "Fig. 9": [9],
  "Figs. 1 through 9": [1, 2, 3, 4, 5, 6, 7, 8, 9],
  "Figs. 10, 11, 12, 13, 14, and 15": [10, 11, 12, 13, 14, 15],
  "Figs. 10 through 18": [10, 11, 12, 13, 14, 15, 16, 17, 18],
  "Fig. 10": [10],
  "Fig. 11": [11],
  "Fig. 12": [12],
  "Fig. 13": [13],
  "Fig. 14": [14],
  "Fig. 15": [15],
  "Fig. 16": [16],
  "Fig. 17": [17],
  "Fig. 18": [18],
};

const figure = (
  text: keyof typeof FIGURE_REFERENCE_PREVIEWS,
  _sourceSheet: typeof SHEET_ONE | typeof SHEET_TWO,
): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: "#",
  referenceType: "figure",
  label: `Preview the source drawing for ${text}`,
  figurePreviews: FIGURE_REFERENCE_PREVIEWS[text].map((number) => FIGURE_PREVIEWS[number]),
});

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

/**
 * A continuous, manually prepared reading of the complete US 347,140
 * facsimile. Figure references are deliberately authored at their source
 * occurrences and point only to crops made from the two drawing sheets.
 */
export const thomsonWeldingArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "80e7bbf735c52f3ace482277f39b130c0b6a62ee8eb9290389175939ba48356c",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ELIHU THOMSON, OF LYNN, MASSACHUSETTS.",
        "APPARATUS FOR ELECTRIC WELDING.",
        "Specification forming part of Letters Patent No. 347,140, dated August 10, 1886.",
        "Application filed March 29, 1886. Serial No. 197,077. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 1 OF 2",
      title: "Figs. 1–9: clamps, pressure arrangements, and alternative joints",
      description: [
        { kind: "text", text: "The first source drawing sheet contains " },
        figure("Figs. 1 through 9", SHEET_ONE),
        {
          kind: "text",
          text: ", including the pivoted clamp apparatus, a section through it, removable clamp forms, manual and weighted pressure arrangements, and a modified jointing arrangement.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET 2 OF 2",
      title: "Figs. 10–18: bars, rings, transformer supply, and battery supply",
      description: [
        { kind: "text", text: "The second source drawing sheet contains " },
        figure("Figs. 10 through 18", SHEET_TWO),
        {
          kind: "text",
          text: ", including alternative work-piece forms, the induction-coil apparatus, its modification, and the secondary-battery arrangement.",
        },
      ],
    },
    paragraph(
      literal(
        "To all whom it may concern: Be it known that I, ELIHU THOMSON, a citizen of the United States, and a resident of Lynn, in the county of Essex and State of Massachusetts, have invented a certain new and useful Method of and Apparatus for Electric Welding, of which the following is a specification.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "My invention consists in a novel art or process of and apparatus for forming joints between metal wires, bars, and the like by the agency of an electric current. This art or process I term ",
      },
      term(
        "“electric welding.”",
        "Thomson's name for joining metal pieces by current applied at their contact.",
      ),
    ]),
    paragraph(
      literal(
        "One of the chief objects of my invention is to secure a true and firm joint between metal wires, &c., without the usual necessary application of solders or metals melting at a lower temperature, and to secure a complete weld of the two abutted ends, which shall be as strong and firm as any other part of the wires, bars, &c., used.",
      ),
    ),
    paragraph(
      literal(
        "My invention enables sections of wires—as of copper and its alloys, iron, silver, gold, &c.—to be jointed into one continuous length, and the joints, being of the metal itself nearly uniform in texture with the rest, are strong, and can be bent, twisted, hammered, and drawn without rupture—a result not achieved before my present invention.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Briefly, the new art, which I term “electric welding,” consists in bringing together with a certain pressure the ends of the wires, bars, &c., to be jointed, and which pressure must be small, and can with my apparatus be regulated at will, and then constituting the abutted ends and a slight portion of the wire or bar on each side of such ends as the path for an electric current of great volume, but not necessarily of an ",
      },
      term(
        "electro-motive force",
        "The period term for voltage, the electrical potential difference that drives current.",
      ),
      {
        kind: "text",
        text: " of more than a few volts, (depending on the nature and size of wire or bar.) With large bars the current must be much greater than with small bars or wires, and it is well to employ as a source of current a regulable apparatus. Either continuous, intermittent, or alternating currents of electricity may be employed.",
      },
    ]),
    paragraph(
      literal(
        "I will now proceed to describe, by reference to figures, the manner in which I have practiced the process and the apparatus which I have found suitable therefor.",
      ),
    ),
    paragraph([
      figure("Figure 1", SHEET_ONE),
      {
        kind: "text",
        text: " shows my jointing-clamp with wires ready to be electrically welded. ",
      },
      figure("Fig. 2", SHEET_ONE),
      { kind: "text", text: " is another view of a portion of the same. " },
      figure("Fig. 3", SHEET_ONE),
      {
        kind: "text",
        text: " shows the placing of wire or bars in line in the clamps before abutting the ends for welding. ",
      },
      figure("Fig. 4", SHEET_ONE),
      {
        kind: "text",
        text: " shows a joint just formed, there being usually a slight burr or flange formed at the junction after passage of current. ",
      },
      figure("Fig. 5", SHEET_ONE),
      { kind: "text", text: " shows removable clamps for holding wires of varying sizes. " },
      figure("Fig. 6", SHEET_ONE),
      { kind: "text", text: " shows a clamp for holding wires of three sizes as needed. " },
      figure("Fig. 7", SHEET_ONE),
      {
        kind: "text",
        text: " indicates the substitution of manual pressure for elastic pressure in forming the joint. ",
      },
      figure("Fig. 8", SHEET_ONE),
      {
        kind: "text",
        text: " indicates the substitution of gravity for elastic pressure in forming the joint; ",
      },
      figure("Fig. 9", SHEET_ONE),
      { kind: "text", text: ", a modification of the same. " },
      figure("Figs. 10, 11, 12, 13, 14, and 15", SHEET_TWO),
      { kind: "text", text: " indicate the application of my process to other forms of bar, &c. " },
      figure("Fig. 16", SHEET_TWO),
      {
        kind: "text",
        text: " illustrates one of the ways of generating the heavy currents needed in the practice of my invention. ",
      },
      figure("Fig. 17", SHEET_TWO),
      { kind: "text", text: " illustrates a modification of a portion of " },
      figure("Fig. 16", SHEET_TWO),
      { kind: "text", text: ". " },
      figure("Fig. 18", SHEET_TWO),
      {
        kind: "text",
        text: " shows another way of obtaining currents of sufficient volume for practicing my invention.",
      },
    ]),
    paragraph(
      literal(
        "I reserve for other applications for Letters Patent certain other improvements in the apparatus used in practice.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In " },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: " is shown the apparatus applicable to the case of joining ends of wires, &c. It consists of two arms or clamp-holding bars, L L′, one only of which need be movable. This is swung on a joint at A, which, when the arms L L′ are wholly metallic, is insulated by interposed washers and tube of insulating material, as mica, in a way to allow the free movement at A, but no passage of current at such point. Heavy cables C C′, preferably very many times the section of the wires to be jointed, connect L L′, respectively, with the terminals of apparatus, from which, at will, a sudden flow of current of considerable volume may be obtained. Suitable clamps, K K′, (this latter, K′, shown removed,) serve to bind down firmly and make good electrical contact with a portion of the length of the wires to be jointed. The wires W W′—say of copper, brass, iron, steel, or German silver—are placed in the clamps with their ends abutting and projecting, as shown at J, the edges of the clamps being countersunk or rounded, so as to leave a small portion of W and W′ unclamped near J. An adjustable spring, S, arranged to pull L L′ together, but insulated by an interposed block of insulator I, is used to keep the wires W W′ abutted with a slight pressure. Sometimes I provide a set of heavy copper contacts, Z Z′, which automatically connect L L′ after the joint at J is effected, accompanied, as it is, by the slight approach of the parts L L′ under the action of the spring S when the metal at J welds.",
      },
    ]),
    paragraph([
      figure("Fig. 2", SHEET_ONE),
      {
        kind: "text",
        text: " shows one leg, L′, removed and the remaining one, L, seen from between them, showing opening for wire and insulation of joint A in black.",
      },
    ]),
    paragraph([
      figure("Fig. 3", SHEET_ONE),
      {
        kind: "text",
        text: " shows wires W W′ just before abutment together with their relation to the clamps K K′. When in contact, as in ",
      },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: ", a powerful current is passed from C to C′, which current has to pass the abutted ends at J. However, if of great volume, even though the resistance at J be less than one fifty-thousandth of an ohm for very moderate-sized wires, heat will be developed in the ratio of the square of the current flowing, which heat will be formed at J in sufficient amount to fuse the abutted ends, and under slight pressure they will weld over their whole section with a slight projecting burr or expansion, as indicated at J, ",
      },
      figure("Fig. 4", SHEET_ONE),
      {
        kind: "text",
        text: ". This will be seen to occur by the slight yielding at J and the approach of L L′ toward each other by the elastic force of S. The current is then stopped and the clamps removed, and the wires W W′ will now be found united into one. The burr can be readily filed off or ground off, and if the clamps K K′ were set oppositely at the start the joint will be true with the axis of each wire. Of course it is important that the wires shall be clean to insure contact, and though usually the joint is well formed without any flux, such as borax, there is no objection to its use in slight amount in certain cases. In such cases, after abutting the wires, a little moist powdered borax or other flux may be applied at J. The clamps for holding the wires may be made removable shells, so as to be readily substituted when different sizes of wire are to be clamped, although simple V-grooves may be made in the clamps to accommodate various sizes; or universal chucks may be employed. All such variations are without importance, and are evident to mechanics.",
      },
    ]),
    paragraph([
      figure("Fig. 5", SHEET_ONE),
      { kind: "text", text: " shows removable clamps, and " },
      figure("Fig. 6", SHEET_ONE),
      { kind: "text", text: " a compound clamp with three sets of grooves of different sizes." },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("Fig. 7", SHEET_ONE),
      {
        kind: "text",
        text: " the spring S, ",
      },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: ", is left off, and is replaced by handles, which may be manually pressed together in forming the joint. A little practice will show the pressure to be used in each case.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("Fig. 8", SHEET_ONE),
      {
        kind: "text",
        text: " an adjustable weight, P, sliding on L′, extended, which latter may be graduated, forms an efficient substitute for S, ",
      },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: ", the other parts being suitably disposed.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Instead of using a swinging joint, as A, ",
      },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: ", it is sometimes preferable, as where heavy wires are to be accurately abutted and jointed, that the movable piece L shall slide in guides, giving a rectilinear motion, though equivalent parallel or right-line movements may be attained in other well-known ways.",
      },
    ]),
    paragraph(
      literal(
        "The clamps K K′ can be shaped to suit various forms of wires or bars to be joined—such as square, hexagonal, rectangular, &c.—and it will be evident that tubes can be operated upon instead of bars or wires.",
      ),
    ),
    paragraph([
      figure("Fig. 10", SHEET_TWO),
      { kind: "text", text: " shows two rectangular bars prepared for juncture." },
    ]),
    paragraph([
      figure("Fig. 11", SHEET_TWO),
      {
        kind: "text",
        text: " shows how my invention may be employed to effect joints between pieces of different form, W′ in the figure being a flanged head. In this connection it may be remarked that my invention gives a great advantage in permitting the formation of joints without heating the metal to any considerable distance on each side of the joint, so that temper, elasticity, and finish remains uninjured.",
      },
    ]),
    paragraph([
      figure("Fig. 12", SHEET_TWO),
      {
        kind: "text",
        text: " illustrates the union of a rectangular bar to a round bar. It may be here said that in all cases it is best that the clamps for holding the pieces be fitted to the shape of the pieces, and clamp them quite near the junction. In such way even rings, as in ",
      },
      figure("Fig. 13", SHEET_TWO),
      {
        kind: "text",
        text: ", may be rendered endless; but in this case more current is needed, as a portion passes around the ring; but, further, on account of the greater length, it is small compared with the portion traversing the joint when the clear ends are well abutted and the clamps K K′ embrace the ring, as indicated. In ",
      },
      figure("Fig. 13", SHEET_TWO),
      {
        kind: "text",
        text: " the lower part of the ring R can, if needful, be immersed in water to avoid any chance of heating.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("Fig. 14", SHEET_TWO),
      {
        kind: "text",
        text: " a long bar or wire of metal or a band can be made endless, as in ",
      },
      figure("Fig. 13", SHEET_TWO),
      {
        kind: "text",
        text: ", and I propose to apply my invention to the production of endless steel pieces for band-saws and the like, and so to remove the weaker brazed joint and the consequent destruction of temper near where it is made. My invention can also be applied to the production of endless wires for endless twisted cables, and it may also be used to join the separate ends of the wires of a twisted cable and so make the cable endless. It is also possible to join two smaller pieces to one larger piece, as in ",
      },
      figure("Fig. 15", SHEET_TWO),
      { kind: "text", text: "." },
    ]),
    paragraph(
      literal(
        "To insure success in effecting a joint the parts opposed should, if possible, be of the same section or at least of such dimensions and melting-points as to melt nearly at the same time, and so secure a thorough union of the particles of both pieces. However, junction is easily effected between German silver and steel or iron and between brass and iron, and in many other cases where the metals joined differ.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "As an example of a means of securing a large flow of current with little electro-motive force, such as is demanded by my invention, the arrangement shown in ",
      },
      figure("Fig. 16", SHEET_TWO),
      {
        kind: "text",
        text: " is used. In this case an induction-coil consisting of a core, F, of iron wire wound with two windings is employed. One of the windings is of fine wire, M, and connected into a circuit supplying alternating currents suited to the size wire in M, while a simple switch, B, controls the circuit through M. The other winding, N, is a very few turns of very heavy conductor connected by short and thick connections to the wire-jointing clamps L L′, as in ",
      },
      figure("Fig. 1", SHEET_ONE),
      {
        kind: "text",
        text: ". When all is ready to make a joint, the switch B is closed for a second or two, at which time the currents in N will be induced, and since the resistance of the wires to be joined will be a large fraction of the actual resistance in the secondary circuit, so a large portion of the energy will be evolved where the joint is to be made, incipient fusion will result and subsequent thorough welding. To save parts it may be simpler to give the coil N the disposition indicated in ",
      },
      figure("Fig. 17", SHEET_TWO),
      {
        kind: "text",
        text: " by attaching L L′ to its terminals, and having the terminals possess a slight elasticity toward one another, so as to give the pressure needed to make the joint.",
      },
    ]),
    paragraph([
      { kind: "text", text: "In " },
      figure("Fig. 18", SHEET_TWO),
      {
        kind: "text",
        text: " is illustrated the employment of a cell of secondary battery as a source of current. It need only be a plain Planté battery of large surface, so as to yield, on occasion, many thousands of ampères, according to the diameter and the conducting-power of the wires to be joined. It is charged by being placed in a circuit, a b, of moderate current-supply, such as an arc or other line. The heavy conductors L L′, one from each terminal of the battery, are ordinarily sprung apart and insulated, as at I. When the wires W W′ are in place, they are kept out of contact until the charge of the battery is sufficient to give a flow of current of a few seconds duration, at which time the handles H H′ are pushed nearer together, thus effecting contact, fusion, and welding between the ends of the wires W W′.",
      },
    ]),
    paragraph(
      literal(
        "Other sources of electricity may be used, such as currents from large dynamos, either direct current or alternating in character.",
      ),
    ),
    paragraph(
      literal(
        "Instead of employing the pressure of a spring, or gravity, or manual pressure to effect the welding, I may obviously employ pressure obtained from any other source.",
      ),
    ),
    { kind: "heading", level: 2, text: "What I claim as my invention is—" },
    claim(
      1,
      "The herein-described art of effecting union between two pieces of metal, consisting in holding the same in contact at the point of union and simultaneously passing a current of electricity through the joint of a power to fuse and unite the pieces, as and for the purpose described.",
    ),
    claim(
      2,
      "The process or art of electric welding, consisting in the application of heavy currents to traverse a joint to be welded, and the simultaneous application of a pressure or force tending to move together the pieces to be welded.",
    ),
    claim(
      3,
      "The process or art of causing union between the ends of metal pieces in contact by simultaneous application of fusing-currents of electricity and mechanical pressure at the contact.",
    ),
    claim(
      4,
      "In an apparatus for electric jointing of metals, suitable clamps for holding the pieces to be joined movable toward one another, and means, such as a spring, for exerting a pressure for forcing the pieces into contact, and means of applying fusing-currents of electricity while such pieces rest in pressure contact, as described.",
    ),
    claim(
      5,
      "The combination, in an apparatus for electric welding, of two arms or supports, L L′, connected with a source of electric current, removable dies or holding-clamps carried by said arms, and means whereby said arms may be pressed toward one another, as and for the purpose described.",
    ),
    claim(
      6,
      "The combination, in an apparatus for electric welding, of clamps or holders for grasping the pieces to be welded, connections from said clamps to a suitable source of electric current, and an adjustable spring, or its equivalent, as described, for adjusting the force with which the pieces are pressed toward one another during the operation of welding.",
    ),
    claim(
      7,
      "In an apparatus for electric jointing of metal wires, bars, &c., a primary feeding-line connected to any suitable source of current and controlled by a switch, and a secondary fusing or welding circuit connected to the pieces to be welded, and which are held in pressure contact, together with suitable means of transfer of energy from said primary line to the circuit of the fusing or welding apparatus, as described.",
    ),
    claim(
      8,
      "The art or process of electric welding, consisting in applying to suitably guided and clamped pieces to be joined a powerful electric current at the junction simultaneously with a pressure, whereby upon incipient fusion at the joint a complete union is effected.",
    ),
    paragraph(
      literal(
        "Signed at Lynn, in the county of Essex and State of Massachusetts, this 23d day of March, A. D. 1886.",
      ),
    ),
    paragraph(literal("ELIHU THOMSON.")),
    paragraph(literal("Witnesses: W. O. WAKEFIELD, E. H. KIRFIELD.")),
  ],
};

/** Every numbered source paragraph has a separately authored, non-lossy companion. */
export const thomsonWeldingParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "The formal preamble identifies Elihu Thomson of Lynn, Massachusetts, and calls the subject both a method and apparatus for electric welding. It frames the source as a specification, not a modern account of welding.",
  ],
  4: [
    "Thomson defines his subject broadly: an electric current makes joints in metal wires, bars, and similar work. He gives the practice a name, electric welding, before describing a particular clamp.",
  ],
  5: [
    "The stated objective is a full-strength joint made without relying on a lower-melting solder or filler metal. The comparison is to the parent wire or bar, whose strength and firmness the welded joint is meant to match.",
  ],
  6: [
    "The source says the method can make continuous lengths from copper alloys, iron, silver, gold, and other wire. Its claimed benefit is a joint of nearly uniform texture that can be bent, twisted, hammered, and drawn without rupture.",
  ],
  7: [
    "The operation begins with the ends under small, adjustable pressure. Current of great volume passes through the abutment and adjacent metal, while the required voltage may be only a few volts and the current must grow with bar size. Thomson explicitly permits continuous, intermittent, or alternating current.",
  ],
  8: [
    "This is a transition: the inventor will explain his practiced process and apparatus by the drawings that follow.",
  ],
  9: [
    "The source accounts for all eighteen drawings. Figs. 1–9 concern the clamping and pressure arrangements; Figs. 10–15 apply the process to other work-piece shapes; Figs. 16–18 show sources of the heavy current. Each source reference has a direct local preview rather than a generic drawing link.",
  ],
  10: [
    "Thomson reserves other apparatus improvements for other patent applications. The sentence limits what this particular specification attempts to cover.",
  ],
  11: [
    "Fig. 1 uses two clamp-holding arms L and L-prime. The pivot A is insulated if the arms are metal; heavy cables C and C-prime feed the arms; removable clamps K and K-prime grip wires W and W-prime near their abutment J. Spring S supplies slight closing pressure, while contacts Z and Z-prime can close after welding movement.",
  ],
  12: [
    "Fig. 2 is a sectional clarification of the clamp: one leg is removed, exposing the wire opening and the insulation at pivot A.",
  ],
  13: [
    "At J, a large current crosses the abutting wire ends. Thomson says heat follows the square of current even when joint resistance is below one fifty-thousandth of an ohm. Slight spring pressure produces a burr or expansion, then current stops and the burr can be removed. He also discusses clean contact, optional borax flux, interchangeable shells, V-grooves, and universal chucks.",
  ],
  14: [
    "Figs. 5 and 6 show removable and multi-groove clamps, respectively. They let the apparatus fit different wire sizes.",
  ],
  15: [
    "Fig. 7 replaces spring pressure with handles that an operator presses together. The source does not prescribe a fixed force; it says practice shows the necessary pressure.",
  ],
  16: [
    "Fig. 8 replaces the spring with an adjustable sliding weight on the extended movable arm. That weight supplies gravity-based closing force.",
  ],
  17: [
    "For accurately aligned heavy wires, the movable arm can slide in guides rather than swing at pivot A. The constraint is parallel or straight-line motion, not one required guide construction.",
  ],
  18: [
    "The clamp faces can follow the work-piece geometry: square, hexagonal, rectangular, and tube work are named. The source treats that shaping as an evident variation.",
  ],
  19: [
    "Fig. 10 shows rectangular bars prepared for their joint. It extends the account beyond round wire.",
  ],
  20: [
    "Fig. 11 joins unlike shapes, with W-prime drawn as a flanged head. Thomson's stated advantage is local heating: temper, elasticity, and finish away from the joint can remain uninjured.",
  ],
  21: [
    "Fig. 12 joins a rectangular bar to a round bar. The clamp should fit close to the junction. Fig. 13 makes a ring endless, but needs more current because some current travels around the ring; the lower ring can be immersed in water to avoid heating.",
  ],
  22: [
    "Fig. 14 applies the method to endless band-saw steel and twisted cable, avoiding a weaker brazed joint and nearby loss of temper. Fig. 15 gives the other geometry: two smaller pieces joined to one larger piece.",
  ],
  23: [
    "The preferred pair has similar section and melting behavior so both sides reach the relevant condition together. Thomson nevertheless states that German silver can join steel or iron, and brass can join iron.",
  ],
  24: [
    "Fig. 16 is the transformer supply. Fine winding M receives controlled alternating current through switch B; heavy few-turn winding N feeds the clamp circuit. Thomson places a large fraction of resistance at the work joint so energy evolves there. Fig. 17 moves the slight closing elasticity into the coil-terminal arrangement.",
  ],
  25: [
    "Fig. 18 substitutes a large-surface Planté secondary battery. It is charged from a moderate-current circuit, then its sprung insulated heavy conductors are brought into contact through handles for a few-second welding current.",
  ],
  26: [
    "The apparatus is not tied to its pictured sources: the source explicitly allows large-dynamo direct or alternating current.",
  ],
  27: [
    "Spring, gravity, and hand force are examples. Thomson leaves room for another source of pressure to make the joint.",
  ],
  37: [
    "The execution statement dates this signed specification to March 23, 1886 in Lynn, Essex County, Massachusetts.",
  ],
  38: ["The printed inventor signature is Elihu Thomson."],
  39: ["The printed witnesses are W. O. Wakefield and E. H. Kirfield."],
};
