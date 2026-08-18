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
