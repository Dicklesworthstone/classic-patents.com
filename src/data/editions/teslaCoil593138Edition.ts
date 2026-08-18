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
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

const sourceCrop = (figure: 1 | 2 | 3, width: number, height: number) => ({
  src: `/patents/figures/us-593138-tesla-coil/fig-${figure}-source-crop-v2.png`,
  alt: `Source-facsimile crop of Figure ${figure} from US 593,138.`,
  width,
  height,
});

const figures = {
  "Figure 1": [sourceCrop(1, 1100, 1450)],
  "Fig. 1": [sourceCrop(1, 1100, 1450)],
  "Fig. 2": [sourceCrop(2, 1100, 700)],
  "Fig. 3": [sourceCrop(3, 1100, 650)],
} as const;

const figure = (
  label: keyof typeof figures,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 593,138`,
  figurePreviews: figures[label],
});

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

/**
 * Continuous, manually prepared reading of the four-page US 593,138
 * facsimile. The two drawing sheets are represented by source-derived crops;
 * the specification, claims, signature, and witnesses follow as one reading.
 */
export const teslaCoil593138ArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "393b0a9cee0baa191c5cf8fac0f65738b9d77ce5318e74324b4792aaf17ddf44",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "NIKOLA TESLA, OF NEW YORK, N. Y.",
        "ELECTRICAL TRANSFORMER.",
        "Specification forming part of Letters Patent No. 593,138, dated November 2, 1897. Application filed March 20, 1897. Serial No. 628,453. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 2",
      title: "Transmission and receiving arrangement",
      description: [
        figure("Fig. 1"),
        {
          kind: "text",
          text: " is the printed system diagram, including the sending and receiving transformers, line, earth connections, dynamo, lamps, and motors. The sheet bears Nikola Tesla's inventor signature; witnesses G. B. Lewis and Edwin B. Hopkins; and the attorney line “Kerr, Curtis & Hodge.”",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 2",
      title: "Alternative induction-coil constructions",
      description: [
        figure("Fig. 2"),
        { kind: "text", text: " is the printed frustum-of-cone form; " },
        figure("Fig. 3"),
        {
          kind: "text",
          text: " is the printed side elevation and partial section of the two-secondary form. This sheet again bears Nikola Tesla's inventor signature, witnesses G. B. Lewis and Edwin B. Hopkins, and the Kerr, Curtis & Hodge attorneys line.",
        },
      ],
    },
    paragraph(text("To all whom it may concern:")),
    paragraph(
      text(
        "Be it known that I, NIKOLA TESLA, a citizen of the United States, residing at New York, in the county and State of New York, have invented certain new and useful Improvements in Electrical Transformers, of which the following is a specification, reference being had to the drawings accompanying and forming a part of the same.",
      ),
    ),
    paragraph(
      text(
        "The present application is based upon an apparatus which I have devised and employed for the purpose of developing electrical currents of high potential, which transformers or induction-coils constructed on the principles heretofore followed in the manufacture of such instruments are wholly incapable of producing or practically utilizing, at least without serious liability of the destruction of the apparatus itself and danger to persons approaching or handling it.",
      ),
    ),
    paragraph(
      text(
        "The improvement involves a novel form of transformer or induction-coil and a system for the transmission of electrical energy by means of the same in which the energy of the source is raised to a much higher potential for transmission over the line than has ever been practically employed heretofore, and the apparatus is constructed with reference to the production of such a potential and so as to be not only free from the danger of injury from the destruction of insulation, but safe to handle. To this end I construct an induction-coil or transformer in which the primary and secondary coils are wound or arranged in such manner that the convolutions of the conductor of the latter will be farther removed from the primary as the liability of injury from the effects of potential increases, the terminal or point of highest potential being the most remote, and so that between adjacent convolutions there shall be the least possible difference of potential.",
      ),
    ),
    paragraph(
      text(
        "The type of coil in which the last-named features are present is the flat spiral, and this form I generally employ, winding the primary on the outside of the secondary and taking off the current from the latter at the center or inner end of the spiral. I may depart from or vary this form, however, in the particulars hereinafter specified.",
      ),
    ),
    paragraph(
      text(
        "In constructing my improved transformers I employ a length of secondary which is approximately one-quarter of the wave length of the electrical disturbance in the circuit including the secondary coil, based on the velocity of propagation of electrical disturbances through such circuit, or, in general, of such length that the potential at the terminal of the secondary which is the more remote from the primary shall be at its maximum. In using these coils I connect one end of the secondary, or that in proximity to the primary, to earth, and in order to more effectually provide against injury to persons or to the apparatus I also connect it with the primary.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In the accompanying drawings, " },
      figure("Figure 1"),
      {
        kind: "text",
        text: " is a diagram illustrating the plan of winding and connection which I employ in constructing my improved coils and the manner of using them for the transmission of energy over long distances. ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " is a side elevation, and " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " a side elevation and part section, of modified forms of induction-coil made in accordance with my invention.",
      },
    ]),
    paragraph([
      { kind: "text", text: "A designates a core, which may be magnetic when so desired." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "B is the secondary coil, wound upon said core in generally spiral form.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "C is the primary, which is wound around in proximity to the secondary. One terminal of the latter will be at the center of the spiral coil, and from this the current is taken to line or for other purposes. The other terminal of the secondary is connected to ",
      },
      term(
        "earth",
        "The electrical ground connection identified by Tesla as the connection for the secondary terminal adjacent to the primary.",
      ),
      { kind: "text", text: " and preferably also to the primary." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "When two coils are used in a transmission system in which the currents are raised to a high potential and then reconverted to a lower potential, the receiving-transformer will be constructed and connected in the same manner as the first—that is to say, the inner end of what corresponds to the secondary of the first will be connected to line and the other end to earth and to the local circuit or that which corresponds to the primary of the first. In such case also the ",
      },
      term(
        "line-wire",
        "The long conductor that carries the high-potential circuit between the two transformers.",
      ),
      {
        kind: "text",
        text: " should be supported in such manner as to avoid loss by the current jumping from line to objects in its vicinity and in contact with earth—as, for example, by means of long insulators, mounted, preferably, on metal poles, so that in case of leakage from the line it will pass harmlessly to earth. In ",
      },
      figure("Fig. 1"),
      { kind: "text", text: ", where such a system is illustrated, a " },
      term(
        "dynamo",
        "Tesla's source machine G, an electrical generator supplying the sending or step-up transformer.",
      ),
      {
        kind: "text",
        text: " G is conveniently represented as supplying the primary of the sending or “step-up” transformer, and lamps H and motors K are shown as connected with the corresponding circuit of the receiving or “step-down” transformer.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Instead of winding the coils in the form of a flat spiral the secondary may be wound on a support in the shape of a frustum of a cone and the primary wound around its base, as shown in ",
      },
      figure("Fig. 2"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In practice for apparatus designed for ordinary use the coils are preferably constructed on the plan illustrated in ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: ". In this figure L L are spools of insulating material upon which the secondary is wound—in the present case, however, in two sections, so as to constitute really two secondaries. The primary C is a spirally-wound flat strip surrounding both secondaries B.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The inner terminals of the secondaries are led out through tubes of insulating material M, while the other or outside terminals are connected with the primary.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The length of the secondary coil B or of each secondary coil when two are used, as in ",
      },
      figure("Fig. 3"),
      {
        kind: "text",
        text: ", is, as before stated, approximately one-quarter of the wave length of the electrical disturbance in the secondary circuit, based on the velocity of propagation of the electrical disturbance through the coil itself and the circuit with which it is designed to be used—that is to say, if the rate at which a current traverses the circuit, including the coil, be one hundred and eighty-five thousand miles per second, then a frequency of nine hundred and twenty-five per second would maintain nine hundred and twenty-five stationary waves in a circuit one hundred and eighty-five thousand miles long, and each wave length would be two hundred miles in length. For such a frequency I should use a secondary fifty miles in length, so that at one terminal the potential would be zero and at the other maximum.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Coils of that character herein described have several important advantages. As the potential increases with the number of turns the difference of potential between adjacent turns is comparatively small, and hence a very high potential, impracticable with ordinary coils, may be successfully maintained.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "As the secondary is electrically connected with the primary the latter will be at substantially the same potential as the adjacent portions of the secondary, so that there will be no tendency for sparks to jump from one to the other and destroy the insulation. Moreover, as both primary and secondary are grounded and the line-terminal of the coil carried and protected to a point remote from the apparatus the danger of a discharge through the body of a person handling or approaching the apparatus is reduced to a minimum.",
      },
    ]),
    paragraph(
      text(
        "I am aware that an induction-coil in the form of a flat spiral is not in itself new, and this I do not claim; but",
      ),
    ),
    paragraph(text("What I claim as my invention is—")),
    claim(
      1,
      "A transformer for developing or converting currents of high potential, comprising a primary and secondary coil, one terminal of the secondary being electrically connected with the primary, and with earth when the transformer is in use, as set forth.",
    ),
    claim(
      2,
      "A transformer for developing or converting currents of high potential, comprising a primary and secondary wound in the form of a flat spiral, the end of the secondary adjacent to the primary being electrically connected therewith and with earth when the transformer is in use, as set forth.",
    ),
    claim(
      3,
      "A transformer for developing or converting currents of high potential comprising a primary and secondary wound in the form of a spiral, the secondary being inside of, and surrounded by, the convolutions of the primary and having its adjacent terminal electrically connected therewith and with earth when the transformer is in use, as set forth.",
    ),
    claim(
      4,
      "In a system for the conversion and transmission of electrical energy, the combination of two transformers, one for raising, the other for lowering, the potential of the currents, the said transformers having one terminal of the longer or fine-wire coils connected to line, and the other terminals adjacent to the shorter coils electrically connected therewith and to the earth, as set forth.",
    ),
    paragraph(text("NIKOLA TESLA. Witnesses: M. LAWSON DYER. G. W. MARTLING.")),
  ],
};

/**
 * Direct block-indexed readings for this patent-local edition. The shared
 * reading registry is deliberately not edited in this lane.
 */
export const teslaCoil593138ParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "This formal address opens Tesla's specification. It signals that the document which follows is the inventor's legal description, not a modern circuit tutorial.",
  ],
  4: [
    "Tesla identifies himself, his New York residence, the invention's subject, and the accompanying drawings as part of the specification. The drawing sheets are evidence for the written description.",
  ],
  5: [
    "The problem is safely making use of very high voltage. Tesla says ordinary transformer and induction-coil construction could not practically produce it without risking apparatus damage or harm to a person nearby.",
  ],
  6: [
    "Tesla proposes both a coil form and a long-distance transmission arrangement. He puts the increasingly high-potential portions of the secondary farther from the primary and arranges the turns so neighboring conductors differ little in voltage.",
  ],
  7: [
    "His usual geometry is a flat spiral: the primary is outside the secondary and the secondary output is taken from the spiral's center. He expressly allows later variations rather than limiting the invention to that one drawing form.",
  ],
  8: [
    "Tesla specifies a secondary about one quarter of the electrical disturbance wavelength so its terminal remote from the primary is at maximum potential. The nearby secondary end goes to ground and is also connected to the primary to reduce exposure and insulation stress.",
  ],
  9: [
    "This paragraph assigns the drawings their jobs. Figure 1 gives the complete winding-and-transmission arrangement; Figure 2 gives a conical variant; Figure 3 gives a sectional ordinary-use construction.",
  ],
  10: [
    "Letter A marks the core. Tesla permits it to be magnetic, but does not state that every construction requires a magnetic core.",
  ],
  11: [
    "Letter B is the secondary conductor. Tesla describes it as wound on the core in a generally spiral form.",
  ],
  12: [
    "Letter C is the nearby primary winding. The center or inner secondary terminal supplies the line or another load, while the other secondary terminal goes to earth and preferably to the primary.",
  ],
  13: [
    "For transmission, Tesla repeats the geometry and connection at the receiving transformer: its line end corresponds to the sending transformer's secondary, while its other end goes to ground and the local circuit. He also calls for long insulators so leakage reaches ground, then identifies G as the dynamo, H as lamps, and K as motors in Figure 1.",
  ],
  14: [
    "Figure 2 changes the support shape, not the electrical purpose. The secondary may be wound on a cone frustum, with the primary around the wide base.",
  ],
  15: [
    "For ordinary use, Figure 3 places two secondary sections B on insulating spools L L. A flat-strip primary C spirals around both sections.",
  ],
  16: [
    "The inner secondary terminals leave through insulating tubes M. The outer terminals are connected to the primary, preserving the connection Tesla has described throughout the specification.",
  ],
  17: [
    "Tesla supplies a numerical illustration of his quarter-wave rule: at 185,000 miles per second and 925 cycles per second, a 200-mile wavelength makes a 50-mile secondary a quarter wavelength. The stated result is zero potential at one end and maximum potential at the other.",
  ],
  18: [
    "The safety argument is voltage grading. More turns can produce higher potential while each adjacent pair of turns remains relatively close in potential, easing the demand on insulation between them.",
  ],
  19: [
    "Connecting the secondary near the primary makes their adjacent portions nearly the same potential, reducing spark-over between them. Tesla also routes the high-potential line terminal remotely and protects it to lower the chance of a discharge through a person.",
  ],
  20: [
    "Tesla disclaims the flat spiral by itself as old. His claims therefore target the stated primary-secondary connections, winding placement, and the two-transformer transmission system rather than every flat spiral coil.",
  ],
  21: [
    "This introduces the four legal claims that define the requested monopoly after the descriptive specification.",
  ],
  26: [
    "The signed name is Nikola Tesla. The printed witnesses are M. Lawson Dyer and G. W. Martling.",
  ],
};
