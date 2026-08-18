import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const annotated = (
  before: string,
  text: string,
  definition: string,
  after = "",
  label?: string,
): CuratedSpecificationInlines => [
  { kind: "text", text: before },
  { kind: "term", text, definition, label },
  { kind: "text", text: after },
];

/**
 * Continuous manual reading edition of the two printed sheets in US 78,317.
 * The facsimile calls for a Schedule, but the pinned two-page PDF contains no
 * schedule or drawing sheet. No figure record is therefore invented here.
 */
export const nobelDynamiteArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "06f67c50087092ed0c6110cef12d6aadc6a087747b876e516cece34288cf8b55",
  preparedBy: "Classic Patents editorial agent (codex-bravo)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ALFRED NOBEL, OF HAMBURG, GERMANY, ASSIGNOR TO JULIUS BANDMANN, OF SAN FRANCISCO, CALIFORNIA.",
        "Letters Patent No. 78,317, dated May 26, 1868.",
        "IMPROVED EXPLOSIVE COMPOUND.",
        "The Schedule referred to in these Letters Patent and making part of the same.",
      ],
    },
    { kind: "paragraph", inlines: literal("TO ALL WHOM IT MAY CONCERN:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that I, ALFRED NOBEL, of the city of Hamburg, Germany, have invented a new and useful Composition of Matter, to wit, an Explosive Powder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The nature of the invention consists in forming out of two ingredients long known, viz, the explosive substance nitro-glycerine, and an inexplosive porous substance, hereafter specified, a composition which, without losing the great explosive power of nitro-glycerine, is very much altered as to its explosive and other properties, being far more safe and convenient for transportation, storage, and use, than nitro-glycerine.",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "In general terms, my invention consists in mixing with nitro-glycerine a substance which possesses a very great ",
        "absorbent capacity",
        "The ability of a porous solid to take up and retain liquid within its internal pores. Nobel uses it as a practical material property, not as a modern analytical measurement.",
        ", and which, at the same time, is free from any quality which will decompose, destroy, or injure the nitro-glycerine, or its explosiveness.",
        "Patent vocabulary",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "It is undoubtedly true, as a general rule, that nitro-glycerine, when mixed with another substance, possesses less concentration of power than when used alone; but while the safety of the miner (to prevent leakage into seams in the rock) prohibits the use of nitro-glycerine without cartridges, which latter must of course be somewhat less in diameter than the bore-holes which are to contain them, the powder herein described can be made to form a semi-pasty mass, which yields to the slightest pressure, and thus can be made to fill up the bore-hole entirely. Practically, therefore, the miner will have as much nitro-glycerine in the same height of bore-hole with this powder as with nitro-glycerine in its pure state.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "This is the real character and purpose of my invention; and in order to enable others skilled in the art to which it appertains (or with which it is most nearly connected) to make, compound, and use the same, I will proceed to describe the same, and also the manner and process of making, compounding, and using it, in full, clear, and exact terms.",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "The substance which most fully meets the requirements above mentioned, so far as I know or have been able to ascertain from numerous experiments, is a certain kind of ",
        "silicious earth",
        "A silica-rich porous earth. Nobel also names silicious marl, tripoli, and rotten-stone as period trade or material names for related mineral deposits.",
        " or silicic acid, found in various parts of the globe, and known under the several names of silicious marl, tripoli, rotten-stone, &c. The particular variety of this material which is best for my compound is homogeneous, has a low specific gravity, great absorbent capacity, and is generally composed of the remains of ",
        "Patent vocabulary",
      ).concat([
        {
          kind: "term",
          text: "infusoria",
          definition:
            "A nineteenth-century collective term for microscopic organisms. Here the word identifies fossil microscopic remains in the porous earth, often called diatomaceous earth today.",
          label: "Period scientific term",
        },
        { kind: "text", text: "." },
      ]),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "So great is the absorbent capacity of this earth, that it will take up about three times its own weight of nitro-glycerine and still retain its powder-form, thus leaving the nitro-glycerine so compact and concentrated as to have very nearly its original explosive power; whereas, if another substance, having a less absorbent capacity, is used, a correspondingly less proportion of nitro-glycerine will be absorbed, and the powder be correspondingly weak or wholly inexplosive.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "For example, most chalk will take but about fifteen per cent. of nitro-glycerine and retain its powder-form. Twenty per cent. will reduce it to a paste.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Porous charcoal has also a considerable absorbent capacity, but it has the defect of being itself a combustible material, and also of less elasticity of its particles, which renders it easy to squeeze out a part of its nitro-glycerine.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal("The two materials are combined in the following manner:"),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The earth, thoroughly dried and pulverized, is placed in a wooden vessel. To it is introduced the nitro-glycerine in a steady stream so small that the two ingredients can be kept thoroughly mixed.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The mixing may be effected by the naked hand, or by any proper wooden instrument used in the hand, or by wooden machinery.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Sufficient of nitro-glycerine should be used to render the compound explosive, but not so much as to change its form of powder to a liquid or pasty consistency.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Practically, about sixty parts, by weight, of nitro-glycerine to forty of earth, forms the useful minimum, and seventy-eight parts, by weight, of nitro-glycerine to twenty-two of earth, the useful maximum of explosive power. The former has a perfectly dry appearance, the latter is pasty.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Between these two extremes the composition will be explosive powder, and it will be more easily exploded, and its explosive power greater, as the relative proportion of the nitro-glycerine is greater.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The proportions, by weight, of seventy-five of nitro-glycerine to twenty-five of earth, gives a powder as well adapted to ordinary practical purposes as that from any proportions I am now able to name, and can be easily compressed to a specific gravity nearly equal to that of pure nitro-glycerine.",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "When the mass has been intimately mixed and thoroughly incorporated by stirring and kneading, it is rubbed through a hair, silk, or brass-wire ",
        "sieve",
        "A mesh screen used to separate and reduce particles by size. Nobel expressly excludes iron because it corrodes.",
        ", (iron corrodes,) and any lumps which may remain are rubbed with a stiff-bristle brush till they are reduced and made to pass through the sieve.",
        "Process term",
      ),
    },
    { kind: "paragraph", inlines: literal("The powder is then finished and ready for use.") },
    {
      kind: "paragraph",
      inlines: literal(
        "The fineness desired for the powder will determine the fineness of the sieve to be used.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The chief characteristic of this powder is its nearly perfect exemption from liability to accidental or involuntary explosion.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "It is far less sensitive than nitro-glycerine to concussion or percussion, and contained in its usual packing, (a wooden cask or box,) the latter may be smashed completely to pieces without any danger of an explosion.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Unlike gunpowder, in the open air or in ordinary packing, (a wooden cask or box,) it burns up, when set fire to, without exploding. It can, therefore, be handled, stored, and transported with less danger than ordinary gunpowder.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "When confined in a tight and strong enclosure it explodes by heat applied in any form, when above the temperature of 360° Fahrenheit. Under all other circumstances it may be exploded by some other explosion in it or into it.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The most simple and certain method known to me of exploding it is as follows:",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "The end of a common blasting-fuse is inserted into a ",
        "percussion-cap",
        "A cap containing an initiating charge. Nobel describes its crimped attachment to a blasting fuse and its placement in the powder; the patent does not give a modern detonator design specification.",
        ", and the rim of the cap crimped tightly and firmly about the fuse by nippers, or other means, so as to leave the fulminating-powder of the cap and the end of the fuse tightly and firmly enclosed together. The end of the fuse, with the cap attached, is then embedded in the powder—the more firmly, the more certain the explosion.",
        "Blasting term",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "In blasting, the powder is pressed tightly about the cap and fuse, and ",
        "tamping",
        "Material packed above or around a charge to confine it in a bore-hole. Nobel directs that it be pressed, not pounded.",
        ", of sand or other proper material, added, and pressed but not pounded in. A tamping firmly pressed is as good as if rammed in the most solid manner.",
        "Blasting term",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal("The fuse explodes the cap, and this explosion explodes the powder."),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I will add here that by carefully packing the end of a good fuse amidst the powder of a charge enclosed, like a blasting charge, in a tight place, the fuse alone will explode the powder, especially if the powder is strongly charged with nitro-glycerine. But this method of explosion requires too much care, and is too uncertain to be depended upon or generally used.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "As before stated, the more strongly the powder is charged with nitro-glycerine the more easily it explodes.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If, therefore, the powder contains a low proportion of nitro-glycerine, it is necessary to employ in its explosion a correspondingly long, strong, and heavily-charged percussion-cap, made especially for the purpose. For the sake of certainty of explosion it is better to use such a cap in all cases.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "If the fire from the fuse comes in contact with the powder before the cap is exploded, which is liable to occur if the fuse is leaky and the cap extends too far into the powder, a portion of the powder will be burned before the explosion takes place. To guard against this, the cap should only be fairly inserted into the powder, and poor fuses wound next to the cap firmly with strong glued paper or hemp, or otherwise secured.",
      ),
    },
    {
      kind: "paragraph",
      inlines: annotated(
        "The ",
        "bore-holes",
        "Holes drilled into rock to receive a blasting charge. The stated size and charge guidance is historical source text, not modern blasting instruction.",
        ", as a practical but not absolute rule, should be about one-half the size, and the charge should be from one-fifth to one-tenth the quantity ordinarily used in gunpowder-blasting.",
        "Mining term",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A very convenient form in which to use the powder is to pack it firmly in cartridges of strong paper.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Having thus described my invention, what I " },
        {
          kind: "reference",
          text: "claim",
          href: "?view=original-spec#claim-1",
          referenceType: "claim",
          label: "Jump to the sole formal claim in the original patent text",
        },
        { kind: "text", text: " as new, and desire to secure by Letters Patent, is—" },
      ],
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "The composition of matter, made substantially of the ingredients and in the manner and for the purposes set forth.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "ALFRED NOBEL." }] },
    {
      kind: "paragraph",
      inlines: [{ kind: "small-caps", text: "WITNESSES: FR. T. PROHME, HEINR. BARTELSSEN." }],
    },
  ],
};

/**
 * Local, paragraph-only companions. Claim explanation stays in the canonical
 * Patent claim decoder so the direct paragraph map never acquires claim keys.
 */
export const nobelDynamiteParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: ["This formal address opens the instrument and does not state a chemical limitation."],
  2: [
    "Nobel identifies himself as being in Hamburg and identifies the subject in the broad period category of a composition of matter: an explosive powder.",
  ],
  3: [
    "The stated move is not the discovery of nitro-glycerine. It is a composition made from nitro-glycerine and a later-specified porous material, meant to retain much of the liquid's power while improving handling, storage, and transport.",
  ],
  4: [
    "Nobel names the required functional property of the added material: it must absorb strongly without chemically degrading the nitro-glycerine or spoiling its explosive action.",
  ],
  5: [
    "He acknowledges a tradeoff: dilution can reduce concentration of power. His practical answer is a deformable mass that fills the drilled hole, so a cartridge no longer leaves unused annular space around a smaller liquid container.",
  ],
  6: [
    "This is the enabling promise. Nobel says he will describe both the composition and the way to make and use it so a skilled person can reproduce the stated result.",
  ],
  7: [
    "Nobel selects a low-density, porous silica-rich earth and gives several contemporary names for it. The property he needs is a homogeneous mineral carrier with high uptake, not a brand name or a particular drawing.",
  ],
  8: [
    "The stated uptake is about three times the earth's own weight while remaining powder-like. That ratio is why the carrier can hold a large nitro-glycerine fraction without behaving as a free liquid.",
  ],
  9: [
    "Chalk is the counterexample: it is said to hold only about fifteen percent before a higher loading makes a paste. Nobel uses it to distinguish an inadequate absorber from the selected earth.",
  ],
  10: [
    "Charcoal is another candidate with uptake, but Nobel rejects it for two stated reasons: it is combustible and its particles lack enough elasticity to retain all of the liquid under pressure.",
  ],
  11: [
    "This short transition begins the manufacturing description. The following paragraphs specify drying, gradual addition, mixing, and the acceptable loading range.",
  ],
  12: [
    "Nobel directs that the earth be dried and pulverized first, then receive nitro-glycerine in a sufficiently slow stream to keep the ingredients mixed throughout.",
  ],
  13: [
    "The historic specification permits hand, hand-held wooden-tool, or wooden-machine mixing. It is reporting the allowed means, not prescribing a modern safety procedure.",
  ],
  14: [
    "The lower constraint is that enough liquid must be present for an explosive compound; the upper constraint is that the material must remain powder rather than become liquid or pasty.",
  ],
  15: [
    "Nobel gives a range of sixty parts nitro-glycerine to forty earth as a useful minimum, through seventy-eight to twenty-two as the useful maximum. He records dry appearance at one extreme and paste at the other.",
  ],
  16: [
    "Within that stated interval, a larger nitro-glycerine share is said to make the powder easier to explode and more powerful. This is a comparative relation, not a claim to every possible mixture.",
  ],
  17: [
    "Nobel identifies seventy-five parts nitro-glycerine to twenty-five earth as suitable for ordinary practice and says it can be compressed to nearly the specific gravity of pure nitro-glycerine.",
  ],
  18: [
    "After thorough incorporation, the material is screened through hair, silk, or brass wire. Iron is expressly rejected because it corrodes; remaining lumps are reduced with a stiff brush until they pass the screen.",
  ],
  19: ["Once screened as described, Nobel regards the powder as finished and ready for use."],
  20: [
    "The desired final particle fineness controls the fineness of the sieve. The text does not specify one universal mesh size.",
  ],
  21: [
    "Nobel characterizes the finished powder by reduced susceptibility to accidental or involuntary explosion. It is a performance statement central to the practical purpose of the composition.",
  ],
  22: [
    "He compares the packed powder with nitro-glycerine under concussion or percussion and states that a wooden cask or box may be smashed without explosion. The qualification is the material in its usual packing.",
  ],
  23: [
    "The comparison shifts to open-air fire and ordinary packaging. Nobel says the powder burns rather than explodes there, then draws the practical conclusion of lower handling, storage, and transport danger than ordinary gunpowder.",
  ],
  24: [
    "Confinement changes the stated behavior: above 360° Fahrenheit in a tight, strong enclosure, heat can cause explosion. Otherwise the text says another explosion in or into the material can initiate it.",
  ],
  25: [
    "Nobel now introduces what he calls the simplest and most certain method of initiating the powder. The details follow in the next paragraph.",
  ],
  26: [
    "A common blasting fuse enters a percussion cap; its rim is crimped so the fuse end and the cap's fulminating powder are enclosed together. Nobel then directs that this cap-and-fuse end be embedded firmly in the powder.",
  ],
  27: [
    "For blasting, the powder is pressed around the cap and fuse and covered with tamping that is pressed but not pounded. Nobel treats firm pressing as equivalent to very solid ramming for this purpose.",
  ],
  28: [
    "This is the causal initiation chain stated in the source: the fuse initiates the cap, and the cap's explosion initiates the powder.",
  ],
  29: [
    "Nobel notes that a carefully packed fuse alone can sometimes initiate a tightly enclosed, strongly charged powder mass, but expressly rejects that method as too careful and uncertain for general reliance.",
  ],
  30: [
    "The passage restates the composition-dependent initiation tendency: more nitro-glycerine makes the powder easier to explode.",
  ],
  31: [
    "For lower nitro-glycerine content, Nobel calls for a correspondingly longer, stronger, heavily charged percussion cap, and prefers such a cap generally for reliable initiation.",
  ],
  32: [
    "This warning concerns premature contact of fuse fire with the powder. Nobel tells the reader to insert the cap only fairly into the powder and to secure poor fuses near the cap with glued paper, hemp, or another means.",
  ],
  33: [
    "The bore-hole and charge quantities are expressly framed as practical rather than absolute. They are historical evidence of the claimed use context, not present-day operational guidance.",
  ],
  34: [
    "Nobel identifies strong-paper cartridges as a convenient form for using the powder, continuing the earlier concern with containment and placement.",
  ],
  35: [
    "This formal transition identifies the single legal claim that follows. It does not create a separate method claim for the blasting-cap discussion.",
  ],
  37: ["Alfred Nobel signs the instrument after the sole claim."],
  38: [
    "The facsimile lists Fr. T. Prohme and Heinr. Bartelssen as witnesses. Their names are formal execution matter, not technical claim limitations.",
  ],
};
