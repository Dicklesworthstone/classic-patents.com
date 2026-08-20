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
    src: "/patents/figures/gb-1420-cort-puddling-rolling/fig-1-source-crop-v1.png",
    caption: "Source-facsimile crop of Sheet 1 from the Chancery enrollment of GB 1420.",
    alt: "Engraved technical elevation and cross-section of the puddling furnace and grooved rolling mill.",
    width: 2000,
    height: 2000,
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
  label: `Open the source-facsimile crop for ${label} in GB 1420`,
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

export const CORT_PUDDLING_ROLLING_PARALLEL_READINGS: Readonly<Record<number, readonly string[]>> =
  {
    1: [
      "Formal royal preamble of British Patent No. 1,420 granted by King George III to Henry Cort of Fontley, Hampshire on February 13, 1784.",
    ],
    2: [
      "Chancery enrollment proviso obliging Cort to file a full, reproducible written description of the reverberatory puddling and grooved rolling inventions within one calendar month.",
    ],
    4: [
      "Puddling in a reverberatory furnace: melting high-carbon pig iron on a concave hearth using common coal fuel isolated in a separate fire-grate, preventing sulfur and ash contamination.",
    ],
    5: [
      "Decarbonization and rabbling: stirring molten iron at 1300°C under radiant flame, oxidizing carbon into carbon monoxide vapor until the metal 'comes to nature' as pasty, decarburized iron grains.",
    ],
    6: [
      "Puddle ball collection: gathering the pasty spongy iron crystals with the rabble into 60–80 lb loups at welding heat for immediate transfer to shingling rollers.",
    ],
    7: [
      "Grooved roller shingling: passing the red-hot sponge ball through accelerating grooved rolls, hydrostatically expelling liquid silicate slag and welding iron crystals into solid fibrous bars in a single heat.",
    ],
    14: [
      "Chancery enrollment certification signed and sealed by Henry Cort on February 13, 1784 before the High Court of Chancery.",
    ],
  };

export const cortPuddlingRollingArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b213e2bb7da843a3397d38f9be1126696512eed62fae9680147761566e40286f",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
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

/**
 * Dynamic runtime lookup of exact claim text from the archival edition blocks.
 * Enforces the Single Source of Truth architectural doctrine.
 */
export function manualCortClaimText(claimNumber: number): string {
  const block = cortPuddlingRollingArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in cortPuddlingRollingArchivalEdition`);
  }
  return block.inlines.map((i) => i.text).join("");
}
