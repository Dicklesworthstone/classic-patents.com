import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
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

export const CORT_PUDDLING_ROLLING_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> =
  {
    1: [
      "The Patent Office index identifies the inventor and the 1784 patent number; this draft is not an accepted facsimile edition.",
    ],
    2: [
      "The checked printed abridgment describes a dished reverberatory or air furnace and shaped iron bars used to work the molten charge.",
    ],
    3: [
      "The abridgment records ebullition, a bluish flame, continued raking and stirring, and the charge being brought into nature.",
    ],
    4: [
      "Loops are removed, raised to welding heat, and shingled under a hammer or otherwise; grooved rollers are one described route.",
    ],
  };

type CortResearchEdition = Omit<CuratedSpecificationEdition, "completeFacsimileReviewed"> & {
  completeFacsimileReviewed: false;
};

export const cortPuddlingRollingArchivalEdition: CortResearchEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b213e2bb7da843a3397d38f9be1126696512eed62fae9680147761566e40286f",
  preparedBy: "Classic Patents source-audit draft (not a publication edition)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
  claimStatus: {
    kind: "no-formal-claims-in-facsimile",
    evidence:
      "The checked 1854 Patent Office abridgment for A.D. 1784, No. 1420 has no numbered claims and ends with '[Printed, 3d. No Drawings.]'. The local two-page PDF is a rejected reconstruction, not a facsimile.",
  },
  drawingStatus: {
    kind: "no-drawings-in-facsimile",
    evidence:
      "The checked Patent Office abridgment explicitly says '[Printed, 3d. No Drawings.]'; no figure citation or crop is accepted for this record.",
  },
  /*
  blocks: [
    {
      kind: "masthead",
      lines: [
        "A.D. 1784 . . . . . . . N° 1420.",
        "MANUFACTURE OF IRON AND STEEL.",
        "CORT'S SPECIFICATION.",
      ],
    },
    p(
      text("TO ALL TO WHOM THESE PRESENTS SHALL COME, I, "),
      term(
        "HENRY CORT",
        "Henry Cort (1740–1800), English ironmaster who transformed metallurgy by inventing the puddling furnace and grooved rolling mill, multiplying British wrought iron output fifteenfold.",
      ),
      text(
        ", of Fontley, in the Parish of Titchfield, in the County of Southampton, Esquire, send greeting:",
      ),
    ),
    p(
      text(
        "WHEREAS His most Excellent Majesty King George the Third, by His Letters Patent under the Great Seal of Great Britain, bearing date at Westminster, the Thirteenth day of February, in the twenty-fourth year of His reign, did give and grant unto me, the said Henry Cort, His especial licence, full power, sole privilege and authority, that I, the said Henry Cort, my executors, administrators, and assigns, should and lawfully might make, use, exercise, and vend, within England, Wales, and the Town of Berwick-upon-Tweed, my new Invented ",
      ),
      term(
        "Method of Shingling, Welding, and Manufacturing Iron and Steel into Bars, Plates, and Rods of Purer Quality and in Larger Quantities by More Effectual and Expeditious Methods and with Fewer Fires Than Heretofore Used;",
        "The technical grant covering both the reverberatory puddling furnace and grooved rolling mill processes.",
      ),
      text(
        " in which said Letters Patent there is contained a proviso obliging me, the said Henry Cort, by an instrument in writing under my hand and seal, to cause a particular description of the nature of my said Invention, and the manner in which the same is to be performed, to be inrolled in His Majesty's High Court of Chancery within one calendar month next and immediately after the date of the said Letters Patent.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "THE NATURE AND METHOD OF THE PROCESS AND APPARATUS:",
    },
    p(
      text("The crude iron, commonly called "),
      term(
        "pig iron or cast iron",
        "Brittle blast furnace iron containing 3.5–4.5% carbon and 1–2% silicon, with a low melting point (~1150°C).",
        "pig iron",
      ),
      text(", is first introduced into a "),
      term(
        "reverberatory or air furnace",
        "A furnace in which fuel burns in a separate grate and radiant flames reflect from an arched roof onto the hearth, keeping sulfur impurities out of the metal.",
        "reverberatory furnace",
      ),
      text(
        " heated by pit coal or common coal. In this furnace the fuel burns in a separate combustion grate, and the intense flame and heated gases are caused to reverberate from the curved arched roof down upon the hearth (as illustrated in ",
      ),
      figure("Fig. 1", "Fig. 1 of the annexed Drawings"),
      text(
        "), where the iron is placed upon a bed of sand and slag, wholly secluded from direct contact with the solid sulfurous fuel.",
      ),
    ),
    p(
      text(
        "When the furnace is brought to a white welding heat, the pig metal melts and becomes fluid. It is then constantly stirred, agitated, and worked with an iron paddle or ",
      ),
      term(
        "rabble",
        "A long wrought-iron hoe or hooked rod used by puddlers to stir molten iron and expose it to oxidizing flames.",
        "rabble tool",
      ),
      text(
        " by the workman through a small aperture in the furnace door. Under this intense heat and exposure to the reverberated flame and air, the carbon and impurities contained in the pig iron are burned out and discharged in the form of elastic vapor. As the decarbonization proceeds, the liquid metal loses its fluidity, separates into granular particles, and ",
      ),
      term(
        '"comes to nature,"',
        "The historical metallurgical term for when purified wrought iron solidifies into pasty crystals because its melting point rises from 1150°C to 1535°C as carbon is removed.",
        "coming to nature",
      ),
      text(" assuming a spongy and pasty consistency."),
    ),
    p(
      text(
        "The puddler continues to gather and work these pasty particles together into rounded masses, loops, or ",
      ),
      term(
        "puddle balls",
        "Spongy 60–80 lb masses of decarburized iron crystals interspersed with liquid iron silicate slag.",
        "puddle ball",
      ),
      text(
        " of sixty to eighty pounds weight each. When the ball is thoroughly brought to a welding heat, it is quickly withdrawn from the reverberatory furnace and conveyed directly while hot to the shingling hammer or grooved rollers.",
      ),
    ),
    p(
      text(
        "The red-hot puddle ball is immediately passed between pairs of large chilled cast-iron rollers furnished with corresponding grooves of graduated dimensions (",
      ),
      figure("Fig. 1", "Fig. 2 and Fig. 3"),
      text(")—square, gothic, flat, and round. The powerful continuous rotary compression of the "),
      term(
        "grooved rollers",
        "Cylindrical rolls with matching profiled grooves that exert progressive multi-axis compression, expelling slag and elongating billets into finished bars.",
        "grooved rollers",
      ),
      text(
        " exerts a uniform hydrostatic squeeze throughout the entire mass, violently expressing and discharging the liquid iron silicate cinder and slag from the internal pores, and welding the pure metallic iron crystals into a solid, compact, fibrous bar or billet in a single heat, without the necessity of repeated reheats or finery fires.",
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
          "1. The method of converting pig iron into wrought malleable iron by melting and refining the same in a reverberatory furnace heated by coal flame alone, without bringing the metal into contact with the solid sulfur-bearing fuel;",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          '2. Decarbonizing and working the fluid molten iron with an iron rabble upon a concave hearth under reverberated radiant heat until the particles separate, "come to nature," and are gathered into cohesive puddle balls;',
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. Shingling and welding the red-hot spongy puddle balls by passing them directly through pairs of heavy revolving rollers having corresponding graduated grooves; and",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. Expressing liquid slag and consolidating fibrous wrought iron bars in a continuous rotary rolling operation in a single heat, producing iron of superior tenacity and ductility in vastly greater quantities than heretofore achieved by tilt hammers.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURE & ENROLLMENT",
    },
    p(
      text("HENRY CORT. (L.S.)\n\n"),
      text(
        "IN WITNESS WHEREOF, I, the said Henry Cort, have hereunto set my hand and seal, this Thirteenth day of February, One thousand seven hundred and eighty-four. Enrolled in His Majesty's High Court of Chancery.",
      ),
    ),
  ],
};
  */
  blocks: [
    {
      kind: "masthead",
      lines: [
        "A.D. 1784, February 13.—No. 1420.",
        "CORT, HENRY.—Shingling, welding, and manufacturing iron and steel into bars, plates, rods, etc.; by the use of fire and machinery.",
      ],
    },
    p(
      text(
        "Pig or other cast iron is melted in a reverberatory or air furnace; the bottom of which is ‘dished out’ to contain the metal when melted. The molten metal is ‘worked and moved about’ by ‘iron bars and other instruments fitly shaped,’ conveniently introduced through holes in the bottoms of the doors.",
      ),
    ),
    p(
      text(
        "After a time, ‘an ebullition, effervescence, or such like intestine motion takes place,’ and a bluish flame is emitted by the metal. As the ‘raking, separating, stirring, and spreading’ is continued, it ‘loses its fusibility, and is flourished or brought into nature.’ Thereupon it is collected together into lumps or loops and removed through the door.",
      ),
    ),
    p(
      text(
        "The loops may be stamped into plates, piled or broken and worked in an air furnace, or raised to a welding heat and shingled under a forge hammer or otherwise into half blooms, slabs, or other forms. Slabs shingled to the requisite size may be passed through grooved rollers, which may be used for working any sort of iron at a welding heat.",
      ),
    ),
    p(
      text(
        "‘Iron and also steel, so prepared, made, wrought, and manufactured,’ will be freed from adhering impurities and of good quality. The whole process is conducted without using finery, charcoal, cokes, chaffery, hollow fire, blast, or fluxes. [Printed, 3d. No Drawings.]",
      ),
    ),
  ],
};

/**
 * Dynamic runtime lookup of exact claim text from the archival edition blocks.
 * Enforces the Single Source of Truth architectural doctrine.
 */
export function manualCortClaimText(claimNumber: number): string {
  throw new Error(
    `GB 1420 has no separately enumerated claims; claim ${claimNumber} is not a source-backed node.`,
  );
}
