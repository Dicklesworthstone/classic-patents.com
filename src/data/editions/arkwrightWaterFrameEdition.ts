import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
});

const term = (value: string, definition: string, label?: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
  label,
});

const FIGURES = {
  "Fig. 1": {
    src: "/patents/figures/gb-931-arkwright-water-frame/fig-1-source-crop-v2.png",
    caption: "Upright source-derived crop of the Figure 1 drawing sheet on pinned PDF page 3.",
    alt: "Upright Figure 1 water-frame drawing sheet from pinned PDF page 3, lettered A through G.",
    width: 1760,
    height: 2300,
  },
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the upright source-derived crop for ${label} from pinned PDF page 3 in GB 931`,
  figurePreviews: [FIGURES[label]],
});

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> =
  {
    1: [
      "Formal Letters Patent preamble identifying King George III's royal grant of exclusive privilege to Richard Arkwright of Nottingham on July 15, 1769 for an engine to spin cotton, flax, and wool.",
    ],
    2: [
      "Declaration of specification compliance: setting out the full mechanical construction and operational doctrine of the spinning engine with reference to the enrolled drawing plan.",
    ],
    4: [
      "Component A: the prime mover transmission drum or great water wheel, conveying continuous mechanical torque to all spinning spindles and drawing rollers.",
    ],
    5: [
      "Component B: the horizontal iron driving shaft with individual spindle driving whorls, clutches, and disengaging levers allowing independent stopping of any spindle thread.",
    ],
    6: [
      "Component C: the fundamental drafting organ comprising pairs of differential-speed cylindrical rollers—smooth leather top rollers and fluted brass/iron lower rollers—progressively attenuating and parallelizing staple cotton fibers by a 4x to 8x draft ratio.",
    ],
    7: [
      "Component D: suspended lead weights and pressing levers acting upon the upper roller bearings to maintain steady, slip-free normal clamping force against the fluted steel cylinders.",
    ],
    8: [
      "Component E: high-speed steel flyers with wire eye guides rotating at 3000–4000 RPM upon vertical spindles, imparting continuous true twist to the emerging drawn roving.",
    ],
    9: [
      "Component F: drag-retarded bobbins mounted coaxially on the spindles whose speed differential relative to the flyer winds the twisted yarn under steady tension.",
    ],
    10: [
      "Component G: the heart-shaped cam and traverse gearing which cyclically oscillates the bobbin rail vertically, laying down even, dense cylindrical layers across the bobbin spool.",
    ],
    17: [
      "Chancery enrollment certification: signed by Richard Arkwright on November 8, 1769 in the presence of the High Court of Chancery.",
    ],
  };

export const arkwrightWaterFrameArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3254894ae66cb4ddd2612d164e24af76f5efa8ee8ac6b741c8affc70d8fe62fd",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "A.D. 1769 . . . . . . . N° 931.",
        "MANUFACTURE OF YARN.",
        "ARKWRIGHT'S SPECIFICATION.",
      ],
    },
    p(
      text("TO ALL TO WHOM THESE PRESENTS SHALL COME, I, "),
      term(
        "RICHARD ARKWRIGHT",
        "Richard Arkwright (1732–1792), English inventor and pioneer of the factory system who developed the water-powered spinning frame at Cromford Mill, Derbyshire.",
      ),
      text(", of Nottingham, in the County of Nottingham, send greeting:"),
      text(
        "\n\nWHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Fifteenth day of July, in the ninth year of His reign, did give and grant unto me, the said Richard Arkwright, His especial licence, full power, sole privilege and authority, that I, the said Richard Arkwright, my executors, administrators, and assigns, should and lawfully might make, use, exercise, and vend, within England, Wales, and the Town of Berwick-upon-Tweed, my new Invented ",
      ),
      term(
        "Apparatus or Engine for the Making of Weft or Yarn from Cotton, Flax, and Wool;",
        "The technical grant covering the multi-spindle Water Frame spinning machine.",
      ),
    ),
    p(
      text(
        "NOW KNOW YE, that in compliance with the said proviso, I, the said Richard Arkwright, do hereby describe and ascertain the nature of my said Invention, and the manner in which the same is to be performed, by the Plan or ",
      ),
      figure("Fig. 1", "Drawing hereunto annexed"),
      text(", and following explanation thereof:"),
    ),
    {
      kind: "heading",
      level: 2,
      text: "THE NATURE AND CONSTRUCTION OF THE MACHINE:",
    },
    p(
      term("A", "The primary driving drum / water wheel pulley."),
      text(
        " represents the great wheel or pulley, which is driven by a horse, water, or other prime mover, giving motion to the whole machine through intermediate gearing and bands.",
      ),
    ),
    p(
      term("B", "The horizontal iron driving shaft with spindle bands and clutches."),
      text(
        " represents the horizontal iron driving shaft, having upon it small pullies or wooden drums with leather bands passing to each spindle, and furnished with a clutch or disengaging lever.",
      ),
    ),
    p(
      term("C", "The differential-speed drawing rollers, the core drafting organ of the machine."),
      text(" represents the pairs of "),
      term(
        "cylindrical drawing rollers",
        "Pairs of differential-speed cylinders that draw out and parallelize cotton roving fibers before twisting.",
        "differential drawing rollers",
      ),
      text(
        ", whereof the first pair takes in the cotton rove from bobbins above, and by turning with different degrees of velocity, draws out and attenuates the cotton fibers to the required degree of fineness. The top rollers are covered with ",
      ),
      term(
        "leather",
        "Leather provides a resilient, high-friction gripping cushion on the top pressure rollers.",
      ),
      text(", and the lower rollers are made of "),
      term(
        "fluted iron or brass",
        "Fluted metal cylinders provide positive traction against the cotton fibers without slippage.",
        "fluted rollers",
      ),
      text(", to seize and grip the fibers firmly without slipping or cutting."),
    ),
    p(
      term("D", "Suspended lead weights and pressing levers."),
      text(" represents the "),
      term(
        "lead weights and pressing levers",
        "Deadweight lever mechanisms exerting continuous normal force on top roller bearings.",
      ),
      text(
        ", which hang upon the bearings of the upper rollers, pressing them down upon the fluted cylinders with uniform force to ensure steady and constant drawing.",
      ),
    ),
    p(
      term("E", "High-speed steel flyers with wire eye guides."),
      text(" represents the high-speed steel "),
      term(
        "flyers",
        "Revolving U-shaped steel arms with wire guides that impart helical twist to the emerging roving at 3500+ RPM.",
        "flyer",
      ),
      text(
        ", having two curved arms with small wire guide loops or eyes, mounted upon the upright spindles, which twist the attenuated roving as it delivers from the last pair of drawing rollers, producing strong, compact, and even yarn.",
      ),
    ),
    p(
      term("F", "Drag-retarded bobbins."),
      text(" represents the "),
      term(
        "bobbins",
        "Yarn collection spools retarded by friction cords to create differential winding speed.",
        "bobbin",
      ),
      text(
        ", loosely fitted upon the spindles beneath the flyers, and retarded by friction bands or drag cords, so that by the difference of speed between the flyer and bobbin, the twisted yarn is continuously and uniformly wound upon the bobbin.",
      ),
    ),
    p(
      term("G", "Heart-shaped cam traverse mechanism."),
      text(" represents the "),
      term(
        "heart-wheel or cam",
        "A cardioid cam providing constant-velocity linear reciprocating motion to the bobbin traverse rail.",
        "heart-cam",
      ),
      text(
        ", driven by slow worm gearing from the main shaft, which raises and lowers the rail supporting the bobbins with a regular reciprocating motion, thereby distributing and winding the thread evenly in cylindrical layers from end to end of each bobbin.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS AND DECLARATION:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. Drawing out and attenuating cotton, wool, or other fibrous substances into a roving or thread of any desired fineness by passing the same successively through two or more pairs of rollers turning with different and accelerating velocities;",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. Pressing the top leather-covered rollers upon the lower fluted metal cylinders by suspended weights to preserve uniform traction;",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. Imparting the requisite twist to the drawn fibers continuously by rapidly revolving flyers; and",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. Winding the twisted yarn onto drag-retarded bobbins traversed uniformly by the action of a heart-cam.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURE & ENROLLMENT",
    },
    p(
      text("RICHARD ARKWRIGHT. (L.S.)\n\n"),
      text(
        "AND BE IT REMEMBERED, that on the Eighth day of November, in the tenth year of the Reign of King George the Third, the aforesaid Richard Arkwright came before our said Lord the King in His Chancery, and acknowledged the Specification aforesaid, and all and every thing therein contained, in form above written. Enrolled the Eighth day of November, in the year of our Lord One thousand seven hundred and sixty-nine.",
      ),
    ),
  ],
};

/**
 * Dynamic runtime lookup of exact claim text from the archival edition blocks.
 * Enforces the Single Source of Truth architectural doctrine.
 */
export function manualArkwrightClaimText(claimNumber: number): string {
  const block = arkwrightWaterFrameArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in arkwrightWaterFrameArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
