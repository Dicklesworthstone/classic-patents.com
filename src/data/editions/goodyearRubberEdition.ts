import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

/**
 * A continuous, manually prepared reading edition of US 3,633. The preparer
 * compared every block against both printed pages of the pinned facsimile.
 * This grant has no drawing sheet, printed figure reference, table, or equation.
 */
export const goodyearRubberArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7",
  preparedBy: "Classic Patents editorial agent (SunnySpring)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence:
      "US Patent 3,633 (1844) was issued as a text-only Letters Patent without attached drawing sheets.",
  },
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "CHARLES GOODYEAR, OF NEW YORK, N. Y.",
        "IMPROVEMENT IN INDIA-RUBBER FABRICS.",
        "Specification forming part of Letters Patent No. 3,633, dated June 15, 1844.",
      ],
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Be it known that I, CHARLES GOODYEAR, of the city of New York, in the State of New York, have invented certain new and useful Improvements in the Manner of Preparing Fabrics of ",
        },
        {
          kind: "term",
          text: "Caoutchouc or India-Rubber",
          definition:
            "The natural elastic gum then commonly called caoutchouc; the patent uses it as the material being compounded and formed into fabric.",
          label: "Period material name",
        },
        {
          kind: "text",
          text: "; and I do hereby declare that the following is a full and exact description thereof.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "My principal improvement consists in the combining of sulphur and ",
        },
        {
          kind: "term",
          text: "white lead",
          definition:
            "Basic lead carbonate, a lead salt used here as one component of Goodyear's compound. It is toxic and is not a recommendation for modern manufacture.",
          label: "Period material name",
        },
        {
          kind: "text",
          text: " with the india-rubber, and in the submitting of the compound thus formed to the action of heat at a regulated temperature, by which combination and exposure to heat it will be so far altered in its qualities as not to become softened by the action of the solar ray or of artificial heat at a temperature below that to which it was submitted in its preparation—say to a heat of 270° of Fahrenheit's scale—nor will it be injuriously affected by exposure to cold. It will also resist the action of the expressed oils, and that likewise of spirits of turpentine, or of the other essential oils at common temperatures, which oils are its usual solvents.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The articles which I combine with the india-rubber in forming my improved fabric are sulphur and white lead, which materials may be employed in varying proportions; but that which I have found to answer best, and to which it is desirable to approximate in forming the compound, is the following: I take twenty-five parts of india-rubber, five parts of sulphur, and seven parts of white lead. The india-rubber I usually dissolve in spirits of turpentine or other essential oil, and the white lead and sulphur also I grind in spirits of turpentine in the ordinary way of grinding paint. These three articles thus prepared may, when it is intended to form a sheet by itself, be evenly spread upon any smooth surface or upon glazed cloth, from which it may be readily separated; but I prefer to use for this purpose the cloth made according to the present specification, as the compound spread upon this article separates therefrom more cleanly than from any other.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Instead of dissolving the india-rubber in the manner above set forth, the sulphur and white lead, prepared by grinding as above directed, may be incorporated with the substance of the india-rubber by the aid of heated cylinders or ",
        },
        {
          kind: "term",
          text: "calender-rollers",
          definition:
            "A set of rotating rollers used to work a material into a continuous sheet of controlled thickness.",
          label: "Manufacturing term",
        },
        {
          kind: "text",
          text: ", by which it may be brought into sheets of any required thickness; or it may be applied so as to adhere to the surface of cloth or of leather of various kinds. This mode of producing and of applying the sheet caoutchouc by means of rollers is well known to manufacturers. To destroy the odor of the sulphur in fabrics thus prepared, I wash the surface with a solution of potash, or with vinegar, or with a small portion of essential oil or other solvent of sulphur.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "When the india-rubber is spread upon the firmer kinds of cloth or of leather it is subject to peel therefrom by a moderate degree of force, the gum letting go the fiber by which the two are held together. I have therefore devised another improvement in this manufacture by which this tendency is in a great measure corrected, and by which, also, the sheet-gum, when attached to cloth or leather, is better adapted to a variety of purposes than when not prepared by this improved mode, which is as follows: After laying a coat of the gum, compounded as above set forth, on any suitable fabric I cover it with a bat of ",
        },
        {
          kind: "term",
          text: "cotton-wool",
          definition:
            "A loose web of cotton fibers, not woven cloth, used here as an internal layer between rubber coats.",
          label: "Manufacturing term",
        },
        {
          kind: "text",
          text: " as it is delivered from the doffer of a carding-machine, and this bat I cover with another coat of the gum—a process which may be repeated two or three times, according to the required thickness of the goods. A very thin and strong fabric may be thus produced, which may be used in lieu of paper for the covering of boxes, books, or other articles.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "When this compound of india-rubber, sulphur, and white lead, whether to be used alone in the state of sheets or applied to the surface of any other fabric has been fully dried, either in a heated room or by exposure to the sun and air, the goods are to be subjected to the action of a high degree of temperature, which will admit of considerable variation—say from 212° to 350° of Fahrenheit's thermometer, but for the best effect approaching as nearly as may be to 270°. This heating may be effected by running the fabrics over a heated cylinder; but I prefer to expose them to an atmosphere of the proper temperature, which may be best done by the aid of an oven properly constructed with openings through which the sheet or web may be passed by means of suitable rollers. When this process is performed upon a fabric consisting of the above-named compound it must be allowed to remain upon the cloth on which it is made, in order to sustain it, as it is so far softened during the operation as not to be capable of supporting its own weight without such aid. If the exposure be to a temperature exceeding 270°, it must continue for a very brief period.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Having thus fully described the nature of the process by which I prepare my improved india-rubber fabric, I do hereby declare that I do not now claim the combining of sulphur with caoutchouc, either in the proportion named or in any other, this combination having been the subject of a patent granted to me on the 24th of February, 1839; but",
      ),
    },
    { kind: "paragraph", inlines: literal("I do claim—") },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The combining of the said gum with sulphur and with white lead, so as to form a triple compound, either in the proportions herein named or in any other within such limits as will produce a like result; and I will here remark that although I have obtained the best results from the carbonate of lead, other salts of lead or the oxides of that metal may be substituted therefor, and will produce a good effect. I therefore under this head claim the employment of either of the oxides or salts of lead in the place of the white lead in the above-named compound.",
      ),
    },
    {
      kind: "claim",
      number: 2,
      inlines: literal(
        "The formation of a fabric of the india-rubber by interposing layers of cotton-batting between those of the gum, in the manner and for the purpose above described.",
      ),
    },
    {
      kind: "claim",
      number: 3,
      inlines: literal(
        "In combination with the foregoing, the process of exposing the india-rubber fabric to the action of a high degree of heat, such as is herein specified, by means of which my improved compound is effectually changed in its properties so as to protect it from decomposition or deterioration by the action of those agents which have heretofore been found to produce that effect upon india-rubber goods.",
      ),
    },
    { kind: "paragraph", inlines: literal("CHARLES GOODYEAR.") },
    { kind: "paragraph", inlines: literal("Witnesses: THOS. P. JONES, B. R. MORSELL.") },
  ],
};

/**
 * Renderer-ready, explicitly authored paragraph readings. Keys are zero-based
 * indexes in `goodyearRubberArchivalEdition.blocks`; numbered claims retain
 * their exact legal text and decoders in the canonical patent record.
 */
export const goodyearRubberParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "This is the formal notice that the following document addresses every reader concerned with the grant. It introduces no technical limitation.",
  ],
  2: [
    "Goodyear identifies himself, his New York residence, and the subject of the grant: making fabrics from caoutchouc, also called India-rubber. He presents the text as a full description of that particular improvement, not as a claim to every use of rubber.",
  ],
  3: [
    "The principal process combines India-rubber with sulphur and white lead, then heats the compound at a controlled temperature. Goodyear says the prepared material should resist softening below its preparation temperature, cold exposure, expressed oils, turpentine, and other essential oils that ordinarily dissolved the gum. The printed benchmark is 270°F; it is a condition of the description, not a claim that every cure uses exactly that temperature.",
  ],
  4: [
    "For the preferred mixture, Goodyear gives a mass recipe of 25 parts India-rubber, 5 parts sulphur, and 7 parts white lead. He describes dissolving the rubber and separately grinding the other ingredients in turpentine or another essential oil, then spreading the mixture as a removable sheet on a smooth surface or glazed cloth. This paragraph supplies a preferred working recipe and sheet-forming route; claim 1 later reaches proportion changes that produce a like result.",
  ],
  5: [
    "As an alternative to dissolving the rubber, the prepared sulphur and white lead may be worked directly into it with heated cylinders or calender-rollers. The rollers make a sheet of chosen thickness or coat cloth or leather. Goodyear also gives an odor-removal wash of potash, vinegar, or a small amount of essential oil or other sulphur solvent. These are manufacturing options and finishing steps, not printed figure references; this grant has none.",
  ],
  6: [
    "A rubber coating can peel from firm cloth or leather because the gum releases the holding fibers. Goodyear's response is a laminate: put a cotton-wool bat, taken from the doffer of a carding machine, over a coat of compounded gum and cover it with another gum coat. Repeating the stack two or three times changes thickness. This is the physical construction narrowed by claim 2: cotton-batting lies between gum layers, rather than merely any textile being rubber-coated.",
  ],
  7: [
    "After drying, the compound or coated fabric receives heat. The stated range is 212°F to 350°F, with the best effect approaching 270°F. Heating can use a cylinder, but Goodyear prefers an oven atmosphere that passes the sheet or web through on rollers. A fabric of this compound must stay on its cloth support because it softens during treatment; above 270°F, exposure must be very brief. Those temperature and support limits give operational meaning to claim 3's high-heat step.",
  ],
  8: [
    "Goodyear expressly narrows the boundary of this grant. He does not claim sulphur combined with caoutchouc by itself, at the named proportion or any other, because he says that combination was covered by his February 24, 1839 patent. The 1844 claims therefore concern the additional lead component, laminate construction, and heat-treatment combination set out next.",
  ],
  9: [
    "This is the formal transition from description to the three legal claims. The following numbered nodes, rather than this lead-in, state the enforceable boundaries asserted in the grant.",
  ],
  13: [
    "The inventor's printed signature identifies Charles Goodyear as the person making the specification and claims. It adds no separate technical limitation.",
  ],
  14: [
    "The printed witness line names Thos. P. Jones and B. R. Morsell. It is formal closing matter, preserved as source text rather than interpreted as part of the claimed process.",
  ],
};
